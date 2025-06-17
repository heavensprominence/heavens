import { sql } from "@/lib/db"

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL environment variable is not set")
      return false
    }

    // Simple connection test
    await sql`SELECT 1 as test`
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

export async function ensureTablesExist(): Promise<boolean> {
  try {
    // Check if required tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'wallets', 'transactions', 'system_settings', 'admin_actions')
    `

    const requiredTables = ["users", "wallets", "transactions", "system_settings"]
    const existingTables = tables.map((t: any) => t.table_name)

    const missingTables = requiredTables.filter((table) => !existingTables.includes(table))

    if (missingTables.length > 0) {
      console.error("Missing required tables:", missingTables)
      return false
    }

    return true
  } catch (error) {
    console.error("Error checking tables:", error)
    return false
  }
}
