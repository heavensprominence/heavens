import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get real statistics from database
    const [userStats] = await sql`
      SELECT COUNT(*) as total_users,
             COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_users_month
      FROM users
    `

    const [transactionStats] = await sql`
      SELECT COUNT(*) as total_transactions,
             SUM(amount) as total_volume,
             COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as transactions_month
      FROM transactions
      WHERE status = 'completed'
    `

    const [credStats] = await sql`
      SELECT SUM(balance) as total_cred_circulation
      FROM wallets
      WHERE currency_code = 'USD-CRED'
    `

    const [listingStats] = await sql`
      SELECT COUNT(*) as active_listings,
             COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_listings
      FROM listings
      WHERE status = 'active'
    `

    const [orderStats] = await sql`
      SELECT COUNT(*) as total_orders,
             COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders
      FROM orders
    `

    const stats = {
      totalUsers: Number.parseInt(userStats.total_users) || 0,
      newUsersThisMonth: Number.parseInt(userStats.new_users_month) || 0,
      totalTransactions: Number.parseInt(transactionStats.total_transactions) || 0,
      totalVolume: Number.parseFloat(transactionStats.total_volume) || 0,
      transactionsThisMonth: Number.parseInt(transactionStats.transactions_month) || 0,
      credCirculation: Number.parseFloat(credStats.total_cred_circulation) || 0,
      activeListings: Number.parseInt(listingStats.active_listings) || 0,
      featuredListings: Number.parseInt(listingStats.featured_listings) || 0,
      totalOrders: Number.parseInt(orderStats.total_orders) || 0,
      completedOrders: Number.parseInt(orderStats.completed_orders) || 0,
      countriesSupported: 195,
      platformUptime: 99.9,
    }

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
