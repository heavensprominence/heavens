import { NextResponse } from "next/server"
import { checkDatabaseConnection, ensureTablesExist } from "@/lib/db-check"

export async function GET() {
  try {
    const isConnected = await checkDatabaseConnection()

    if (!isConnected) {
      return NextResponse.json(
        {
          message: "Database connection failed. Check DATABASE_URL configuration.",
          connected: false,
        },
        { status: 500 },
      )
    }

    const tablesExist = await ensureTablesExist()

    if (!tablesExist) {
      return NextResponse.json(
        {
          message: "Required database tables are missing. Please run the setup scripts.",
          connected: true,
          tablesReady: false,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      message: "Database is ready",
      connected: true,
      tablesReady: true,
    })
  } catch (error) {
    return NextResponse.json(
      {
        message: "Database status check failed",
        connected: false,
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
