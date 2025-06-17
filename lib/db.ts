import { neon } from "@neondatabase/serverless"

// Enhanced database connection with error handling
let sql: any

try {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is not set")
    throw new Error("Database URL not configured")
  }

  sql = neon(process.env.DATABASE_URL)
  console.log("✅ Database connection initialized")
} catch (error) {
  console.error("❌ Database initialization failed:", error)
  // Fallback to prevent crashes
  sql = () => Promise.resolve([])
}

export const db = {
  query: async (text: string, params?: any[]) => {
    try {
      console.log("🔍 Executing query:", text.substring(0, 100) + "...")
      const result = await sql(text, params)
      console.log("✅ Query successful, rows:", result.length)
      return result
    } catch (error) {
      console.error("❌ Database query error:", error)
      console.error("Query:", text)
      console.error("Params:", params)
      throw error
    }
  },
}

// Enhanced helper functions with error handling
export async function getUserById(id: number) {
  try {
    console.log("🔍 Getting user by ID:", id)
    const result = await db.query(
      `
      SELECT u.*, 
             w.wallet_address as primary_wallet,
             w.balance as primary_balance
      FROM users u
      LEFT JOIN wallets w ON u.id = w.user_id AND w.is_primary = true
      WHERE u.id = $1
    `,
      [id],
    )

    console.log("✅ User query result:", result.length > 0 ? "Found" : "Not found")
    return result[0] || null
  } catch (error) {
    console.error("❌ Error fetching user by ID:", error)
    return null
  }
}

export async function getUserByEmail(email: string) {
  try {
    console.log("🔍 Getting user by email:", email)
    const result = await db.query(
      `
      SELECT * FROM users WHERE email = $1
    `,
      [email],
    )

    console.log("✅ User email query result:", result.length > 0 ? "Found" : "Not found")
    return result[0] || null
  } catch (error) {
    console.error("❌ Error fetching user by email:", error)
    return null
  }
}

export async function createUser(userData: {
  email: string
  password_hash: string
  first_name: string
  last_name: string
  registration_number: number
  registration_bonus_amount: number
}) {
  try {
    console.log("🔍 Creating user:", userData.email)
    const result = await db.query(
      `
      INSERT INTO users (email, password_hash, first_name, last_name, registration_number, registration_bonus_amount)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `,
      [
        userData.email,
        userData.password_hash,
        userData.first_name,
        userData.last_name,
        userData.registration_number,
        userData.registration_bonus_amount,
      ],
    )

    console.log("✅ User created successfully:", result[0]?.id)
    return result[0]
  } catch (error) {
    console.error("❌ Error creating user:", error)
    throw error
  }
}

export async function getPublicLedger(limit = 10, offset = 0) {
  try {
    console.log("🔍 Getting public ledger, limit:", limit, "offset:", offset)
    const result = await db.query(
      `
      SELECT 
        t.transaction_hash,
        t.amount,
        t.currency_code,
        t.transaction_type,
        t.description,
        t.created_at,
        t.completed_at,
        CASE 
          WHEN t.from_wallet_id IS NOT NULL THEN 'CRED***' || RIGHT(w1.wallet_address, 4)
          ELSE NULL
        END as from_address,
        CASE 
          WHEN t.to_wallet_id IS NOT NULL THEN 'CRED***' || RIGHT(w2.wallet_address, 4)
          ELSE NULL
        END as to_address
      FROM transactions t
      LEFT JOIN wallets w1 ON t.from_wallet_id = w1.id
      LEFT JOIN wallets w2 ON t.to_wallet_id = w2.id
      WHERE t.status = 'completed'
      ORDER BY t.completed_at DESC
      LIMIT $1 OFFSET $2
    `,
      [limit, offset],
    )

    console.log("✅ Public ledger query result:", result.length, "transactions")
    return result
  } catch (error) {
    console.error("❌ Error fetching public ledger:", error)
    return []
  }
}

export default db
