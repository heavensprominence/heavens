import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getUserByEmail } from "@/lib/db"

export async function POST(request: NextRequest) {
  console.log("🔍 Login API called")

  try {
    const body = await request.json()
    console.log("📝 Request body received:", { email: body.email, hasPassword: !!body.password })

    const { email, password } = body

    if (!email || !password) {
      console.log("❌ Missing email or password")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log("🔍 Looking up user:", email)
    const user = await getUserByEmail(email.toLowerCase())

    if (!user) {
      console.log("❌ User not found:", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("✅ User found, verifying password")
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      console.log("❌ Invalid password for user:", email)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("✅ Login successful for user:", email)

    const responseData = {
      success: true,
      user: {
        id: user.id.toString(),
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        role: user.role,
        status: user.status,
        registrationNumber: user.registration_number,
        bonusAmount: user.registration_bonus_amount,
        createdAt: user.created_at,
      },
    }

    console.log("📤 Sending response:", { success: true, userId: user.id })
    return NextResponse.json(responseData)
  } catch (error) {
    console.error("🚨 Login API error:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
