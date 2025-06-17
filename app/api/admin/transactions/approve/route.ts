import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { transactionId, action } = await request.json()

    if (!transactionId || !action) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 })
    }

    // Get transaction details
    const transaction = await sql`
      SELECT * FROM transactions WHERE id = ${transactionId} AND status = 'pending'
    `

    if (transaction.length === 0) {
      return NextResponse.json({ message: "Transaction not found or not pending" }, { status: 404 })
    }

    const newStatus = action === "approve" ? "completed" : "failed"
    const completedAt = action === "approve" ? new Date().toISOString() : null

    // Update transaction status
    await sql`
      UPDATE transactions 
      SET 
        status = ${newStatus},
        completed_at = ${completedAt},
        approved_by = 1
      WHERE id = ${transactionId}
    `

    // If approving, update wallet balances
    if (action === "approve") {
      const tx = transaction[0]

      // Update from wallet (subtract amount)
      if (tx.from_wallet_id) {
        await sql`
          UPDATE wallets 
          SET balance = balance - ${tx.amount}
          WHERE id = ${tx.from_wallet_id}
        `
      }

      // Update to wallet (add amount)
      if (tx.to_wallet_id) {
        await sql`
          UPDATE wallets 
          SET balance = balance + ${tx.amount}
          WHERE id = ${tx.to_wallet_id}
        `
      }
    }

    // Log the admin action
    await sql`
      INSERT INTO admin_actions (admin_id, action_type, target_transaction_id, details, created_at)
      VALUES (1, 'transaction_approval', ${transactionId}, ${JSON.stringify({ action, status: newStatus })}, CURRENT_TIMESTAMP)
    `

    return NextResponse.json({
      message: `Transaction ${action}d successfully`,
      status: newStatus,
    })
  } catch (error) {
    console.error("Error processing transaction approval:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
