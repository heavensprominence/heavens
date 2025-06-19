import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return default values for now
    return NextResponse.json({
      nextJoinNumber: 1,
    })
  } catch (error) {
    console.error("Failed to fetch join number:", error)
    return NextResponse.json({ nextJoinNumber: 1 })
  }
}
