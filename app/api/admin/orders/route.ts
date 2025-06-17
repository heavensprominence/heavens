import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Get orders with buyer and seller information
    const orders = await sql`
      SELECT 
        o.*,
        u1.name as buyer_name,
        u2.name as seller_name,
        COUNT(oi.id) as items_count
      FROM orders o
      LEFT JOIN users u1 ON o.buyer_id = u1.id
      LEFT JOIN users u2 ON o.seller_id = u2.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, u1.name, u2.name
      ORDER BY o.created_at DESC
      LIMIT 50
    `

    return NextResponse.json({
      success: true,
      orders: orders || [],
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch orders",
      orders: [],
    })
  }
}
