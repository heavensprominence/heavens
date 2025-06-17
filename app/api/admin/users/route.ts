import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !["admin", "super_admin", "owner"].includes(session.user.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check database connection
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ message: "Database not configured" }, { status: 500 })
    }

    const users = await sql`
      SELECT 
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        u.role,
        u.status,
        u.registration_number,
        u.registration_bonus_amount,
        u.created_at,
        u.google_id,
        u.phone,
        u.country_code,
        COALESCE(w.balance, 0) as primary_balance
      FROM users u
      LEFT JOIN wallets w ON u.id = w.user_id AND w.is_primary = true
      ORDER BY u.created_at DESC
    `

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      {
        message: "Database connection error. Please ensure the database is properly configured.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
