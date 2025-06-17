import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, countryCode = "US" } = await request.json()

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          message: "Database not configured. Signup is disabled in demo mode. Use admin@demo.com / demo123 to sign in.",
        },
        { status: 503 },
      )
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Get next registration number and calculate bonus
    const registrationResult = await sql`
      UPDATE system_settings 
      SET setting_value = (CAST(setting_value AS INTEGER) + 1)::TEXT
      WHERE setting_key = 'registration_counter'
      RETURNING setting_value
    `

    const registrationNumber = Number.parseInt(registrationResult[0].setting_value)

    // Calculate registration bonus
    function calculateRegistrationBonus(regNum: number): number {
      if (regNum === 1) return 10000
      if (regNum === 2) return 5000
      if (regNum === 3) return 2500
      if (regNum <= 100) return 1000
      if (regNum <= 1000) return 50
      return 10
    }

    const bonusAmount = calculateRegistrationBonus(registrationNumber)

    // Create user
    const newUser = await sql`
      INSERT INTO users (
        email, password_hash, first_name, last_name, registration_number, 
        registration_bonus_amount, country_code, email_verified, status
      )
      VALUES (
        ${email}, ${hashedPassword}, ${firstName}, ${lastName}, ${registrationNumber}, 
        ${bonusAmount}, ${countryCode}, true, 'active'
      )
      RETURNING id, email, first_name, last_name, registration_number
    `

    const userId = newUser[0].id

    // Create primary wallet
    const walletAddress = "CRED" + Date.now().toString(36) + Math.random().toString(36).substring(2, 8).toUpperCase()

    await sql`
      INSERT INTO wallets (user_id, currency_code, balance, wallet_address, is_primary)
      VALUES (${userId}, 'USD-CRED', ${bonusAmount}, ${walletAddress}, true)
    `

    // Create registration bonus transaction
    if (bonusAmount > 0) {
      const transactionHash = "TX" + Date.now().toString(36) + Math.random().toString(36).substring(2, 8).toUpperCase()

      const wallet = await sql`
        SELECT id FROM wallets WHERE user_id = ${userId} AND currency_code = 'USD-CRED'
      `

      await sql`
        INSERT INTO transactions (
          transaction_hash, to_wallet_id, amount, currency_code, 
          transaction_type, status, description, approval_level, completed_at
        ) VALUES (
          ${transactionHash}, ${wallet[0].id}, ${bonusAmount}, 'USD-CRED',
          'registration_bonus', 'completed', 
          'Registration bonus for user #${registrationNumber}', 
          'automatic', CURRENT_TIMESTAMP
        )
      `
    }

    // Log admin action
    await sql`
      INSERT INTO admin_actions (admin_id, action_type, target_user_id, details, notes)
      VALUES (
        1, 'user_registration', ${userId}, 
        ${JSON.stringify({
          registrationNumber,
          bonusAmount,
          countryCode,
          walletAddress,
        })},
        'New user registration with bonus'
      )
    `

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: userId,
          email: newUser[0].email,
          name: `${newUser[0].first_name} ${newUser[0].last_name}`,
          registrationNumber,
          bonusAmount,
          walletAddress,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      {
        message: "Registration failed. Please try again.",
      },
      { status: 500 },
    )
  }
}
