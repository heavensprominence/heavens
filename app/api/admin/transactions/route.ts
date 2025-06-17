import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const transactions = await sql`
      SELECT 
        t.id,
        t.transaction_hash,
        t.amount,
        t.currency_code,
        t.transaction_type,
        t.status,
        t.description,
        t.created_at,
        t.completed_at,
        t.approval_level,
        t.approved_by,
        CASE 
          WHEN t.from_wallet_id IS NOT NULL THEN u1.first_name || ' ' || u1.last_name
          ELSE NULL
        END as from_user,
        CASE 
          WHEN t.to_wallet_id IS NOT NULL THEN u2.first_name || ' ' || u2.last_name
          ELSE NULL
        END as to_user,
        CASE 
          WHEN t.approved_by IS NOT NULL THEN u3.first_name || ' ' || u3.last_name
          ELSE NULL
        END as approver_name
      FROM transactions t
      LEFT JOIN wallets w1 ON t.from_wallet_id = w1.id
      LEFT JOIN wallets w2 ON t.to_wallet_id = w2.id
      LEFT JOIN users u1 ON w1.user_id = u1.id
      LEFT JOIN users u2 ON w2.user_id = u2.id
      LEFT JOIN users u3 ON t.approved_by = u3.id
      ORDER BY t.created_at DESC
      LIMIT 100
    `

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return NextResponse.json({ message: "Failed to fetch transactions" }, { status: 500 })
  }
}
