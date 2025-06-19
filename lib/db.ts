// Simplified database module that doesn't cause import issues
export const sql = null

export async function createTables() {
  console.log("Database not configured - using mock data")
  return Promise.resolve()
}
