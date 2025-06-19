import { sql } from "@/lib/db"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { recipient, amount, currency, message } = await request.json()

    // Validate inputs
    if (!recipient || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }

    // Check sender balance
    const senderResult = await sql`
      SELECT cred_balance FROM users WHERE id = ${session.user.id}
    `

    if (senderResult.length === 0) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 })
    }

    const senderBalance = Number.parseFloat(senderResult[0].cred_balance)
    if (senderBalance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Find or create recipient
    const recipientResult = await sql`
      SELECT id FROM users WHERE email = ${recipient}
    `

    let recipientId
    if (recipientResult.length === 0) {
      // Create new user for recipient
      const newUserResult = await sql`
        INSERT INTO users (email, cred_balance)
        VALUES (${recipient}, 0)
        RETURNING id
      `
      recipientId = newUserResult[0].id
    } else {
      recipientId = recipientResult[0].id
    }

    // Simulate successful transaction
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create transaction
    await sql`
      INSERT INTO transactions (
        type, amount, currency, from_user_id, to_user_id, 
        description, status
      ) VALUES (
        'transfer', ${amount}, ${currency}, ${session.user.id}, ${recipientId},
        ${message || `Transfer to ${recipient}`}, 'approved'
      )
    `

    // Update balances
    await sql`
      UPDATE users 
      SET cred_balance = cred_balance - ${amount}
      WHERE id = ${session.user.id}
    `

    await sql`
      UPDATE users 
      SET cred_balance = cred_balance + ${amount}
      WHERE id = ${recipientId}
    `

    return NextResponse.json({
      success: true,
      message: `Successfully sent ${amount} ${currency} to ${recipient}`,
    })
  } catch (error) {
    console.error("Failed to send money:", error)
    return NextResponse.json({ error: "Failed to send money" }, { status: 500 })
  }
}
