import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Demo mode - return mock data if no database
    if (!process.env.DATABASE_URL) {
      const mockOrders = [
        {
          id: 1,
          order_number: "ORD-2024-001",
          buyer_name: "John Doe",
          seller_name: "Tech Store",
          total_amount: 299.99,
          currency_code: "CRED",
          status: "processing",
          source_type: "marketplace",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 2,
          order_number: "ORD-2024-002",
          buyer_name: "Jane Smith",
          seller_name: "Electronics Hub",
          total_amount: 149.5,
          currency_code: "CRED",
          status: "shipped",
          source_type: "auction",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 3,
          order_number: "ORD-2024-003",
          buyer_name: "Mike Johnson",
          seller_name: "Audio World",
          total_amount: 89.99,
          currency_code: "CRED",
          status: "delivered",
          source_type: "marketplace",
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 4,
          order_number: "ORD-2024-004",
          buyer_name: "Sarah Wilson",
          seller_name: "Tech Store",
          total_amount: 199.99,
          currency_code: "CRED",
          status: "pending_payment",
          source_type: "marketplace",
          created_at: new Date(Date.now() - 3600000).toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 5,
          order_number: "ORD-2024-005",
          buyer_name: "David Brown",
          seller_name: "Gaming Store",
          total_amount: 449.99,
          currency_code: "CRED",
          status: "completed",
          source_type: "auction",
          created_at: new Date(Date.now() - 259200000).toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]

      return NextResponse.json({
        success: true,
        orders: mockOrders,
        total: mockOrders.length,
      })
    }

    // Real database query
    const orders = await sql`
      SELECT 
        o.id,
        o.order_number,
        buyer.username as buyer_name,
        seller.username as seller_name,
        o.total_amount,
        o.currency_code,
        o.status,
        o.source_type,
        o.created_at,
        o.updated_at
      FROM orders o
      LEFT JOIN users buyer ON o.buyer_id = buyer.id
      LEFT JOIN users seller ON o.seller_id = seller.id
      ORDER BY o.created_at DESC
    `

    return NextResponse.json({
      success: true,
      orders,
      total: orders.length,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch orders" }, { status: 500 })
  }
}
