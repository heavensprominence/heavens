import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["owner", "admin"].includes(session.user.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const configs = await sql`
      SELECT * FROM parity_config 
      ORDER BY currency_code
    `

    return NextResponse.json(configs)
  } catch (error) {
    console.error("Error fetching parity config:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "owner") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { currency_code, auto_enabled, deviation_threshold, max_daily_mint, max_daily_burn } = await request.json()

    await sql`
      UPDATE parity_config 
      SET 
        auto_enabled = ${auto_enabled},
        deviation_threshold = COALESCE(${deviation_threshold}, deviation_threshold),
        max_daily_mint = COALESCE(${max_daily_mint}, max_daily_mint),
        max_daily_burn = COALESCE(${max_daily_burn}, max_daily_burn),
        updated_at = CURRENT_TIMESTAMP
      WHERE currency_code = ${currency_code}
    `

    return NextResponse.json({ message: "Configuration updated successfully" })
  } catch (error) {
    console.error("Error updating parity config:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
