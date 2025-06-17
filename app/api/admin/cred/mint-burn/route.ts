import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "owner") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { operation, amount, currency, reason } = await request.json()

    if (!operation || !amount || !currency || !reason) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ message: "Amount must be positive" }, { status: 400 })
    }

    // Generate transaction hash
    const transactionHash = "TX" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)

    // Get or create system maintenance wallet
    let systemWallet = await sql`
      SELECT id FROM wallets WHERE user_id IS NULL AND currency_code = ${currency}
    `

    if (systemWallet.length === 0) {
      // Create system wallet
      const walletAddress = "SYSTEM" + Math.random().toString(36).substring(2, 15)
      systemWallet = await sql`
        INSERT INTO wallets (user_id, currency_code, balance, wallet_address, is_primary)
        VALUES (NULL, ${currency}, 0, ${walletAddress}, false)
        RETURNING id
      `
    }

    if (operation === "mint") {
      // Mint tokens - add to system wallet
      await sql`
        UPDATE wallets 
        SET balance = balance + ${amount}
        WHERE id = ${systemWallet[0].id}
      `

      // Record minting transaction
      await sql`
        INSERT INTO transactions (
          transaction_hash, to_wallet_id, amount, currency_code, 
          transaction_type, status, description, approval_level, 
          approved_by, completed_at
        ) VALUES (
          ${transactionHash}, ${systemWallet[0].id}, ${amount}, ${currency},
          'minting', 'completed', ${reason}, 'owner',
          ${session.user.id}, CURRENT_TIMESTAMP
        )
      `
    } else if (operation === "burn") {
      // Check if system wallet has enough balance
      const walletBalance = await sql`
        SELECT balance FROM wallets WHERE id = ${systemWallet[0].id}
      `

      if (Number(walletBalance[0].balance) < amount) {
        return NextResponse.json({ message: "Insufficient balance to burn" }, { status: 400 })
      }

      // Burn tokens - remove from system wallet
      await sql`
        UPDATE wallets 
        SET balance = balance - ${amount}
        WHERE id = ${systemWallet[0].id}
      `

      // Record burning transaction
      await sql`
        INSERT INTO transactions (
          transaction_hash, from_wallet_id, amount, currency_code, 
          transaction_type, status, description, approval_level, 
          approved_by, completed_at
        ) VALUES (
          ${transactionHash}, ${systemWallet[0].id}, ${amount}, ${currency},
          'burning', 'completed', ${reason}, 'owner',
          ${session.user.id}, CURRENT_TIMESTAMP
        )
      `
    }

    return NextResponse.json({
      message: `Successfully ${operation === "mint" ? "minted" : "burned"} ${amount} ${currency}`,
      transactionHash,
    })
  } catch (error) {
    console.error("Mint/Burn error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
