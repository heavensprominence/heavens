import { NextResponse } from "next/server"

export async function GET() {
  const envStatus = {
    database: !!process.env.DATABASE_URL,
    nextauth: !!process.env.NEXTAUTH_SECRET,
    google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  }

  return NextResponse.json({
    status: "ok",
    env: envStatus,
    timestamp: new Date().toISOString(),
  })
}
