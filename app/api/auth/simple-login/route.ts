import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password required" }, { status: 400 })
    }

    // Check if database is available
    if (!process.env.DATABASE_URL) {
      // Demo mode - allow a demo admin login
      if (email === "admin@demo.com" && password === "demo123") {
        return NextResponse.json({
          id: "1",
          email: "admin@demo.com",
          name: "Demo Admin",
          role: "owner",
        })
      }

      return NextResponse.json(
        {
          message: "Database not configured. Use admin@demo.com / demo123 for demo.",
        },
        { status: 503 },
      )
    }

    const user = await sql`
      SELECT id, email, password_hash, first_name, last_name, role, status
      FROM users 
      WHERE email = ${email} AND status = 'active'
    `

    if (user.length === 0) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password_hash)

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({
      id: user[0].id.toString(),
      email: user[0].email,
      name: `${user[0].first_name} ${user[0].last_name}`,
      role: user[0].role,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        message: "Database connection error. Try demo mode: admin@demo.com / demo123",
      },
      { status: 500 },
    )
  }
}
