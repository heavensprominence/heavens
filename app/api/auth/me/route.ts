import { NextResponse } from "next/server"

export async function GET() {
  // Simple demo response - no JWT needed
  return NextResponse.json({
    user: {
      id: "demo-user",
      email: "demo@heavenslive.com",
      name: "Demo User",
      role: "user",
    },
  })
}
