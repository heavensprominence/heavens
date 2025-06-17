import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = Number.parseInt(params.id)

    // Demo mode - return mock data if no database
    if (!process.env.DATABASE_URL) {
      const mockOrderDetails = {
        id: orderId,
        order_number: `ORD-2024-00${orderId}`,
        buyer_name: "John Doe",
        seller_name: "Tech Store",
        total_amount: 299.99,
        currency_code: "CRED",
        status: "processing",
        source_type: "marketplace",
        shipping_address_line1: "123 Main St",
        shipping_city: "New York",
        shipping_state: "NY",
        shipping_postal_code: "10001",
        shipping_country: "USA",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: [
          {
            id: 1,
            product_name: "Premium Wireless Headphones",
            product_sku: "PWH-001",
            quantity: 1,
            unit_price: 299.99,
            total_price: 299.99,
          },
        ],
        status_history: [
          {
            id: 1,
            previous_status: null,
            new_status: "pending_payment",
            change_reason: "Order created",
            created_at: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: 2,
            previous_status: "pending_payment",
            new_status: "payment_confirmed",
            change_reason: "Payment processed successfully",
            created_at: new Date(Date.now() - 1800000).toISOString(),
          },
          {
            id: 3,
            previous_status: "payment_confirmed",
            new_status: "processing",
            change_reason: "Order being prepared for shipment",
            created_at: new Date().toISOString(),
          },
        ],
        messages: [
          {
            id: 1,
            subject: "Order Processing Update",
            message: "Your order is being prepared and will ship within 24 hours.",
            created_at: new Date().toISOString(),
          },
        ],
      }

      return NextResponse.json({
        success: true,
        order: mockOrderDetails,
      })
    }

    // Real database queries
    const [orderDetails] = await sql`
      SELECT 
        o.*,
        buyer.username as buyer_name,
        seller.username as seller_name
      FROM orders o
      LEFT JOIN users buyer ON o.buyer_id = buyer.id
      LEFT JOIN users seller ON o.seller_id = seller.id
      WHERE o.id = ${orderId}
    `

    if (!orderDetails) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 })
    }

    // Get order items
    const items = await sql`
      SELECT * FROM order_items 
      WHERE order_id = ${orderId}
      ORDER BY id
    `

    // Get status history
    const statusHistory = await sql`
      SELECT 
        osh.*,
        u.username as changed_by_name
      FROM order_status_history osh
      LEFT JOIN users u ON osh.changed_by = u.id
      WHERE osh.order_id = ${orderId}
      ORDER BY osh.created_at ASC
    `

    // Get messages
    const messages = await sql`
      SELECT 
        om.*,
        sender.username as sender_name,
        recipient.username as recipient_name
      FROM order_messages om
      LEFT JOIN users sender ON om.sender_id = sender.id
      LEFT JOIN users recipient ON om.recipient_id = recipient.id
      WHERE om.order_id = ${orderId}
      ORDER BY om.created_at ASC
    `

    return NextResponse.json({
      success: true,
      order: {
        ...orderDetails,
        items,
        status_history: statusHistory,
        messages,
      },
    })
  } catch (error) {
    console.error("Error fetching order details:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch order details" }, { status: 500 })
  }
}
