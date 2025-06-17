import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { orderId, status } = await request.json()

    if (!orderId || !status) {
      return NextResponse.json({ success: false, message: "Order ID and status are required" }, { status: 400 })
    }

    // Demo mode - just return success
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        message: "Order status updated successfully (demo mode)",
      })
    }

    // Get current order status
    const [currentOrder] = await sql`
      SELECT status FROM orders WHERE id = ${orderId}
    `

    if (!currentOrder) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }

    // Update order status
    await sql`
      UPDATE orders 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${orderId}
    `

    // Add to status history
    await sql`
      INSERT INTO order_status_history (order_id, previous_status, new_status, change_reason)
      VALUES (${orderId}, ${currentOrder.status}, ${status}, 'Status updated by admin')
    `

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
    })
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json({ success: false, message: "Failed to update order status" }, { status: 500 })
  }
}
