import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // In demo mode, assume all users are verified sellers
    return NextResponse.json({
      isVerified: true,
      verificationStatus: "approved",
      sellerLevel: "standard",
      joinDate: "2024-01-01",
      totalSales: 156,
      rating: 4.7,
    })
  } catch (error) {
    console.error("Error checking seller status:", error)
    return NextResponse.json({ error: "Failed to check seller status" }, { status: 500 })
  }
}
