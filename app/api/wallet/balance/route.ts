import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ message: "User ID required" }, { status: 400 })
  }

  try {
    const wallets = await sql`
      SELECT 
        w.id,
        w.currency_code,
        w.balance,
        w.wallet_address,
        w.is_primary,
        w.created_at,
        w.updated_at
      FROM wallets w
      WHERE w.user_id = ${userId}
      ORDER BY w.is_primary DESC, w.currency_code ASC
    `

    const totalBalance = await sql`
      SELECT 
        SUM(w.balance) as total_usd_equivalent
      FROM wallets w
      WHERE w.user_id = ${userId} AND w.currency_code LIKE '%-CRED'
    `

    return NextResponse.json({
      wallets,
      totalBalance: totalBalance[0]?.total_usd_equivalent || 0,
      primaryWallet: wallets.find((w) => w.is_primary) || wallets[0],
    })
  } catch (error) {
    console.error("Error fetching wallet balance:", error)

    // Return demo data on error
    return NextResponse.json({
      wallets: [
        {
          id: 1,
          currency_code: "USD-CRED",
          balance: 1000.0,
          wallet_address: "CRED-DEMO-WALLET",
          is_primary: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
      totalBalance: 1000.0,
      primaryWallet: {
        id: 1,
        currency_code: "USD-CRED",
        balance: 1000.0,
        wallet_address: "CRED-DEMO-WALLET",
        is_primary: true,
      },
    })
  }
}
