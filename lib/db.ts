import { neon } from "@neondatabase/serverless"

// Validate DATABASE_URL with better error handling
const getDatabaseUrl = () => {
  const url = process.env.DATABASE_URL

  if (!url) {
    console.warn("⚠️  DATABASE_URL environment variable is not set")
    console.warn("📝 To fix this:")
    console.warn("   1. Add DATABASE_URL to your environment variables")
    console.warn("   2. Or run the database setup scripts first")
    console.warn("   3. The app will run in demo mode without database features")

    // Return a placeholder that won't crash but will be handled gracefully
    return "postgresql://placeholder:placeholder@placeholder:5432/placeholder"
  }

  return url
}

export const sql = neon(getDatabaseUrl())

// Add connection wrapper with retry logic and graceful fallbacks
export async function executeQuery(query: any, retries = 3): Promise<any> {
  // If no real database URL, return empty results
  if (!process.env.DATABASE_URL) {
    console.warn("Database query skipped - no DATABASE_URL configured")
    return []
  }

  for (let i = 0; i < retries; i++) {
    try {
      return await query
    } catch (error) {
      console.error(`Database query failed (attempt ${i + 1}/${retries}):`, error)

      if (i === retries - 1) {
        // On final failure, return empty results instead of throwing
        console.warn("Database query failed - returning empty results")
        return []
      }

      // Wait before retry (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }
}

// Database helper functions with improved error handling
export async function getUserById(id: number) {
  try {
    if (!process.env.DATABASE_URL) {
      return null
    }

    const result = await executeQuery(sql`
      SELECT u.*, 
             w.wallet_address as primary_wallet,
             w.balance as primary_balance
      FROM users u
      LEFT JOIN wallets w ON u.id = w.user_id AND w.is_primary = true
      WHERE u.id = ${id}
    `)
    return result[0] || null
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function getUserWallets(userId: number) {
  try {
    if (!process.env.DATABASE_URL) {
      return []
    }

    return await executeQuery(sql`
      SELECT * FROM wallets 
      WHERE user_id = ${userId}
      ORDER BY is_primary DESC, currency_code ASC
    `)
  } catch (error) {
    console.error("Error fetching wallets:", error)
    return []
  }
}

export async function getPublicLedger(limit = 10, offset = 0) {
  try {
    if (!process.env.DATABASE_URL) {
      // Return demo data when no database is configured
      return [
        {
          transaction_hash: "TX_DEMO_001",
          amount: "1000.00",
          currency_code: "USD-CRED",
          transaction_type: "registration_bonus",
          description: "Demo registration bonus",
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
          from_address: null,
          to_address: "CRED***DEMO",
        },
        {
          transaction_hash: "TX_DEMO_002",
          amount: "50.00",
          currency_code: "USD-CRED",
          transaction_type: "transfer",
          description: "Demo transfer",
          created_at: new Date(Date.now() - 3600000).toISOString(),
          completed_at: new Date(Date.now() - 3600000).toISOString(),
          from_address: "CRED***DEMO",
          to_address: "CRED***USER",
        },
      ]
    }

    return await executeQuery(sql`
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
      LIMIT ${limit} OFFSET ${offset}
    `)
  } catch (error) {
    console.error("Error fetching public ledger:", error)
    // Return demo data on error
    return [
      {
        transaction_hash: "TX_DEMO_001",
        amount: "1000.00",
        currency_code: "USD-CRED",
        transaction_type: "registration_bonus",
        description: "Demo registration bonus",
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        from_address: null,
        to_address: "CRED***DEMO",
      },
    ]
  }
}

// Database health check
export async function checkDatabaseHealth(): Promise<{
  connected: boolean
  configured: boolean
  error?: string
}> {
  const configured =
    !!process.env.DATABASE_URL &&
    process.env.DATABASE_URL !== "postgresql://placeholder:placeholder@placeholder:5432/placeholder"

  if (!configured) {
    return {
      connected: false,
      configured: false,
      error: "DATABASE_URL not configured",
    }
  }

  try {
    await sql`SELECT 1 as test`
    return {
      connected: true,
      configured: true,
    }
  } catch (error) {
    return {
      connected: false,
      configured: true,
      error: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

// Add this export at the end of the file
export const db = sql
