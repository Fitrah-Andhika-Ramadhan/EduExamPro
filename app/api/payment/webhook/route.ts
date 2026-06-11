import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { transactions, user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import midtransClient from 'midtrans-client'
import crypto from 'crypto'

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-YOUR_SERVER_KEY',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-YOUR_CLIENT_KEY'
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validate Signature Key
    const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-YOUR_SERVER_KEY';
    const hash = crypto.createHash('sha512').update(`${body.order_id}${body.status_code}${body.gross_amount}${serverKey}`).digest('hex')
    if (body.signature_key !== hash) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
    }

    const transactionStatus = body.transaction_status
    const fraudStatus = body.fraud_status
    const orderId = body.order_id

    let newStatus = 'pending'

    if (transactionStatus == 'capture') {
      if (fraudStatus == 'challenge') {
        newStatus = 'pending'
      } else if (fraudStatus == 'accept') {
        newStatus = 'settlement'
      }
    } else if (transactionStatus == 'settlement') {
      newStatus = 'settlement'
    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire') {
      newStatus = 'cancel'
    } else if (transactionStatus == 'pending') {
      newStatus = 'pending'
    }

    // Update Transaction
    await db.update(transactions)
      .set({ 
        status: newStatus,
        paymentType: body.payment_type
      })
      .where(eq(transactions.id, orderId))

    // If Settlement (Success), Upgrade User Plan
    if (newStatus === 'settlement') {
      const trx = await db.select().from(transactions).where(eq(transactions.id, orderId)).limit(1)
      if (trx.length > 0) {
        // Upgrade to PRO
        // Let's set expire 1 month from now
        const expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + 1)
        
        await db.update(user)
          .set({ 
            plan: 'pro',
            planExpiresAt: expiresAt
          })
          .where(eq(user.id, trx[0].userId))
      }
    }

    return NextResponse.json({ status: 'OK' })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
