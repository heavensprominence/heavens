import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const result = await db.query(`
      SELECT 
        o.id,
        o.order_number,
        u.name as customer_name,
        u.email as customer_email,
        o.status,
        o.total_amount as total,
        o.currency,
        o.created_at,
        COUNT(oi.id) as items
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, u.name, u.email
      ORDER BY o.created_at DESC
      LIMIT 100
    `)

    return NextResponse.json({
      orders: result.rows.map((row) => ({
        id: row.id,
        orderNumber: row.order_number,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        status: row.status,
        total: Number.parseFloat(row.total),
        currency: row.currency,
        createdAt: row.created_at,
        items: Number.parseInt(row.items),
      })),
    })
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
