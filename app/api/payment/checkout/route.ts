import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { transactions, user } from '@/lib/db/schema'
import crypto from 'crypto'
import midtransClient from 'midtrans-client'

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-YOUR_SERVER_KEY',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-YOUR_CLIENT_KEY'
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan, amount } = await req.json()
    if (plan !== 'pro' || !amount) {
      return NextResponse.json({ error: 'Invalid plan or amount' }, { status: 400 })
    }

    const orderId = `ORDER-${crypto.randomUUID()}`

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount
      },
      customer_details: {
        first_name: session.user.name || 'User',
        email: session.user.email || ''
      }
    }

    const snapTransaction = await snap.createTransaction(parameter)
    
    // Save to database
    await db.insert(transactions).values({
      id: orderId,
      userId: session.user.id,
      amount: amount,
      status: 'pending',
      snapToken: snapTransaction.token
    })

    return NextResponse.json({ token: snapTransaction.token })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
