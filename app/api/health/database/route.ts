import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    console.log("🔍 Database health check started")

    // Test basic connection
    const result = await db.query("SELECT 1 as test")
    console.log("✅ Basic connection test passed")

    // Test users table
    const userCount = await db.query("SELECT COUNT(*) as count FROM users")
    console.log("✅ Users table accessible, count:", userCount[0]?.count)

    // Test transactions table
    const transactionCount = await db.query("SELECT COUNT(*) as count FROM transactions")
    console.log("✅ Transactions table accessible, count:", transactionCount[0]?.count)

    return NextResponse.json({
      success: true,
      status: "healthy",
      checks: {
        connection: true,
        users_table: true,
        transactions_table: true,
        user_count: Number.parseInt(userCount[0]?.count || "0"),
        transaction_count: Number.parseInt(transactionCount[0]?.count || "0"),
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("🚨 Database health check failed:", error)

    return NextResponse.json(
      {
        success: false,
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
