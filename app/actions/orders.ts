'use server'

import { db } from '@/lib/db'
import { orders, orderItems, userPurchases, tests, user } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'

// CREATE ORDER
export async function createOrder(userId: string, items: any[], paymentMethod: string, totalAmount: number) {
  try {
    const orderId = `ORD-${Date.now()}-${randomUUID().slice(0, 8)}`
    
    // Create main order
    await db.insert(orders).values({
      id: orderId,
      userId,
      status: paymentMethod === 'whatsapp' ? 'verifying' : 'pending', // WhatsApp is manual so maybe start as verifying
      totalAmount,
      paymentMethod,
    })

    // Create order items
    for (const item of items) {
      await db.insert(orderItems).values({
        orderId,
        itemType: item.type,
        itemId: String(item.id),
        title: item.title,
        price: item.price,
      })
    }

    return { success: true, orderId }
  } catch (error: any) {
    console.error('Error creating order:', error)
    return { success: false, error: error.message }
  }
}

// GET ORDERS (ADMIN)
export async function getAdminOrders() {
  try {
    // We need to fetch orders and their items
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt))
    const items = await db.select().from(orderItems)
    const users = await db.select({ id: user.id, name: user.name, email: user.email }).from(user)

    return allOrders.map(o => ({
      ...o,
      user: users.find(u => u.id === o.userId),
      items: items.filter(i => i.orderId === o.id)
    }))
  } catch (error) {
    console.error('Error fetching admin orders:', error)
    return []
  }
}

// GET USER ORDERS
export async function getUserOrders(userId: string) {
  try {
    const userOrdersList = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt))
    const items = await db.select().from(orderItems)

    return userOrdersList.map(o => ({
      ...o,
      items: items.filter(i => i.orderId === o.id)
    }))
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return []
  }
}

// GET SINGLE ORDER
export async function getOrder(orderId: string) {
  try {
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId))
    if (!order) return null
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId))
    return { ...order, items }
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

// UPLOAD PAYMENT PROOF
export async function uploadPaymentProof(orderId: string, proofUrl: string) {
  try {
    await db.update(orders)
      .set({ 
        paymentProofUrl: proofUrl, 
        status: 'verifying',
        updatedAt: new Date() 
      })
      .where(eq(orders.id, orderId))
    
    revalidatePath(`/checkout/${orderId}`)
    revalidatePath('/orders')
    revalidatePath('/admin/orders')
    return { success: true }
  } catch (error: any) {
    console.error('Error uploading proof:', error)
    return { success: false, error: error.message }
  }
}

// APPROVE/REJECT ORDER (ADMIN CRUD)
export async function updateOrderStatus(orderId: string, newStatus: 'completed' | 'cancelled') {
  try {
    // 1. Update the order status
    await db.update(orders)
      .set({ 
        status: newStatus,
        updatedAt: new Date() 
      })
      .where(eq(orders.id, orderId))

    // 2. If approved, grant access by inserting into user_purchases
    if (newStatus === 'completed') {
      const orderData = await getOrder(orderId)
      if (orderData && orderData.items.length > 0) {
        for (const item of orderData.items) {
          // Check if already purchased to prevent duplicates
          const existing = await db.select()
            .from(userPurchases)
            .where(eq(userPurchases.userId, orderData.userId))

          const isAlreadyPurchased = existing.some(p => p.itemId === item.itemId && p.itemType === item.itemType)
          
          if (!isAlreadyPurchased) {
            await db.insert(userPurchases).values({
              userId: orderData.userId,
              itemType: item.itemType,
              itemId: item.itemId,
              transactionId: orderId,
            })
          }
        }
      }
    }

    revalidatePath('/admin/orders')
    revalidatePath('/admin')
    revalidatePath('/orders')
    revalidatePath('/my-packages')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating order status:', error)
    return { success: false, error: error.message }
  }
}
