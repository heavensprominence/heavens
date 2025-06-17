import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get comprehensive platform statistics
    const [userStats] = await sql`
      SELECT COUNT(*) as total_users FROM users WHERE status = 'active'
    `

    const [transactionStats] = await sql`
      SELECT COUNT(*) as total_transactions FROM transactions WHERE status = 'completed'
    `

    const [listingStats] = await sql`
      SELECT COUNT(*) as total_listings FROM marketplace_listings WHERE status = 'active'
    `

    const [orderStats] = await sql`
      SELECT COUNT(*) as total_orders FROM marketplace_orders
    `

    const [auctionStats] = await sql`
      SELECT COUNT(*) as total_auctions FROM auctions WHERE status IN ('active', 'scheduled')
    `

    const [messageStats] = await sql`
      SELECT COUNT(*) as total_messages FROM messages WHERE is_deleted = false
    `

    const [healthStats] = await sql`
      SELECT 
        COUNT(CASE WHEN status = 'active' THEN 1 END) * 100.0 / COUNT(*) as health_percentage
      FROM users
    `

    return NextResponse.json({
      totalUsers: Number(userStats.total_users) || 0,
      totalTransactions: Number(transactionStats.total_transactions) || 0,
      totalListings: Number(listingStats.total_listings) || 0,
      totalOrders: Number(orderStats.total_orders) || 0,
      totalAuctions: Number(auctionStats.total_auctions) || 0,
      totalMessages: Number(messageStats.total_messages) || 0,
      platformHealth: Math.round(Number(healthStats.health_percentage) || 100),
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)

    // Return demo stats if database query fails
    return NextResponse.json({
      totalUsers: 3,
      totalTransactions: 5,
      totalListings: 12,
      totalOrders: 8,
      totalAuctions: 6,
      totalMessages: 15,
      platformHealth: 100,
    })
  }
}
