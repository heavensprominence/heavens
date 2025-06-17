import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getUserByEmail, createUser, db } from "@/lib/db"

export async function POST(request: NextRequest) {
  console.log("🔍 Signup API called")

  try {
    const body = await request.json()
    console.log("📝 Signup request:", {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      hasPassword: !!body.password,
    })

    const { firstName, lastName, email, password } = body

    if (!firstName || !lastName || !email || !password) {
      console.log("❌ Missing required fields")
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      console.log("❌ Password too short")
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    console.log("🔍 Checking if user exists:", email)
    const existingUser = await getUserByEmail(email.toLowerCase())
    if (existingUser) {
      console.log("❌ User already exists:", email)
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    console.log("🔐 Hashing password")
    const passwordHash = await bcrypt.hash(password, 12)

    // Get next registration number
    let registrationNumber = 1
    try {
      console.log("🔍 Getting registration number")
      const registrationResult = await db.query(`
        UPDATE system_settings 
        SET setting_value = (CAST(setting_value AS INTEGER) + 1)::TEXT
        WHERE setting_key = 'registration_counter'
        RETURNING setting_value
      `)
      registrationNumber = Number.parseInt(registrationResult[0]?.setting_value || "1")
      console.log("✅ Registration number:", registrationNumber)
    } catch (error) {
      console.error("⚠️ Error getting registration number, using random:", error)
      registrationNumber = Math.floor(Math.random() * 10000) + 1
    }

    // Calculate bonus
    function calculateRegistrationBonus(regNum: number): number {
      if (regNum === 1) return 10000
      if (regNum === 2) return 5000
      if (regNum === 3) return 2500
      if (regNum <= 100) return 1000
      if (regNum <= 1000) return 50
      return 10
    }

    const bonusAmount = calculateRegistrationBonus(registrationNumber)
    console.log("💰 Calculated bonus:", bonusAmount)

    console.log("👤 Creating user")
    const newUser = await createUser({
      email: email.toLowerCase(),
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      registration_number: registrationNumber,
      registration_bonus_amount: bonusAmount,
    })

    console.log("💳 Creating wallet")
    const walletAddress = "CRED" + Date.now().toString(36) + Math.random().toString(36).substring(2, 8)

    await db.query(
      `
      INSERT INTO wallets (user_id, currency_code, balance, wallet_address, is_primary)
      VALUES ($1, $2, $3, $4, $5)
    `,
      [newUser.id, "USD-CRED", bonusAmount, walletAddress, true],
    )

    if (bonusAmount > 0) {
      console.log("💸 Creating bonus transaction")
      const transactionHash = "TX" + Date.now().toString(36) + Math.random().toString(36).substring(2, 8)

      await db.query(
        `
        INSERT INTO transactions (transaction_hash, to_wallet_id, amount, currency_code, transaction_type, status, description, approval_level, completed_at)
        SELECT $1, w.id, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP
        FROM wallets w WHERE w.user_id = $8 AND w.currency_code = $9
      `,
        [
          transactionHash,
          bonusAmount,
          "USD-CRED",
          "registration_bonus",
          "completed",
          "Registration bonus",
          "automatic",
          newUser.id,
          "USD-CRED",
        ],
      )
    }

    console.log("✅ Signup successful for:", email)

    const responseData = {
      success: true,
      user: {
        id: newUser.id.toString(),
        email: newUser.email,
        name: `${newUser.first_name} ${newUser.last_name}`,
        role: newUser.role,
        registrationNumber,
        bonusAmount,
        createdAt: newUser.created_at,
      },
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("🚨 Signup API error:", error)
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
