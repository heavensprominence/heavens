import { createTables } from "../lib/db.js"

async function initializeDatabase() {
  try {
    console.log("Creating tables...")
    await createTables()

    console.log("Database initialized successfully!")
  } catch (error) {
    console.error("Failed to initialize database:", error)
  }
}

initializeDatabase()
