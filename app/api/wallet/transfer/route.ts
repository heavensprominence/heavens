import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const {
      fromUserId,
      toWalletAddress,
      amount,
      currencyCode = "USD-CRED",
      description = "Transfer",
    } = await request.json()

    if (!fromUserId || !toWalletAddress || !amount || amount <= 0) {
      return NextResponse.json({ message: "Invalid transfer parameters" }, { status: 400 })
    }

    // Get sender wallet
    const fromWallet = await sql`
      SELECT id, balance FROM wallets 
      WHERE user_id = ${fromUserId} AND currency_code = ${currencyCode}
    `

    if (fromWallet.length === 0) {
      return NextResponse.json({ message: "Sender wallet not found" }, { status: 404 })
    }

    if (fromWallet[0].balance < amount) {
      return NextResponse.json({ message: "Insufficient balance" }, { status: 400 })
    }

    // Get recipient wallet
    const toWallet = await sql`
      SELECT id, user_id FROM wallets 
      WHERE wallet_address = ${toWalletAddress} AND currency_code = ${currencyCode}
    `

    if (toWallet.length === 0) {
      return NextResponse.json({ message: "Recipient wallet not found" }, { status: 404 })
    }

    // Create transaction
    const transactionHash = "TX" + Date.now().toString(36) + Math.random().toString(36).substring(2, 8).toUpperCase()

    const transaction = await sql`
      INSERT INTO transactions (
        transaction_hash, from_wallet_id, to_wallet_id, amount, currency_code,
        transaction_type, status, description, approval_level, created_at
      ) VALUES (
        ${transactionHash}, ${fromWallet[0].id}, ${toWallet[0].id}, ${amount}, ${currencyCode},
        'transfer', 'pending', ${description}, 'automatic', CURRENT_TIMESTAMP
      )
      RETURNING id, transaction_hash, created_at
    `

    // Update wallet balances
    await sql`
      UPDATE wallets 
      SET balance = balance - ${amount}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${fromWallet[0].id}
    `

    await sql`
      UPDATE wallets 
      SET balance = balance + ${amount}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${toWallet[0].id}
    `

    // Complete transaction
    await sql`
      UPDATE transactions 
      SET status = 'completed', completed_at = CURRENT_TIMESTAMP
      WHERE id = ${transaction[0].id}
    `

    // Log admin action
    await sql`
      INSERT INTO admin_actions (admin_id, action_type, details, notes)
      VALUES (
        ${fromUserId}, 'transfer_completed', 
        ${JSON.stringify({
          transactionHash: transaction[0].transaction_hash,
          amount,
          currencyCode,
          fromWalletId: fromWallet[0].id,
          toWalletId: toWallet[0].id,
        })},
        'CRED transfer completed'
      )
    `

    return NextResponse.json({
      message: "Transfer completed successfully",
      transaction: {
        hash: transaction[0].transaction_hash,
        amount,
        currencyCode,
        status: "completed",
        createdAt: transaction[0].created_at,
      },
    })
  } catch (error) {
    console.error("Transfer error:", error)
    return NextResponse.json({ message: "Transfer failed" }, { status: 500 })
  }
}
