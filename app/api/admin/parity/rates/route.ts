import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["owner", "admin"].includes(session.user.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // In demo mode, return simulated exchange rates
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([
        {
          currency_code: "USD-CRED",
          target_rate: 1.0,
          current_rate: 1.0025,
          market_rate: 1.0025,
          deviation_percentage: 0.25,
          last_updated: new Date().toISOString(),
        },
        {
          currency_code: "EUR-CRED",
          target_rate: 1.0,
          current_rate: 0.9982,
          market_rate: 0.9982,
          deviation_percentage: -0.18,
          last_updated: new Date().toISOString(),
        },
        {
          currency_code: "GBP-CRED",
          target_rate: 1.0,
          current_rate: 1.035,
          market_rate: 1.035,
          deviation_percentage: 3.5,
          last_updated: new Date().toISOString(),
        },
      ])
    }

    const rates = await sql`
      SELECT * FROM exchange_rates 
      ORDER BY currency_code
    `

    return NextResponse.json(rates)
  } catch (error) {
    console.error("Error fetching exchange rates:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
