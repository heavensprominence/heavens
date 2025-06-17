import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { buyerId, listingId, quantity = 1, shippingAddress } = await request.json()

    if (!buyerId || !listingId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Get listing details
    const listing = await sql`
      SELECT 
        l.id, l.seller_id, l.title, l.price, l.currency_code, 
        l.quantity as available_quantity, l.shipping_cost,
        u.first_name || ' ' || u.last_name as seller_name
      FROM marketplace_listings l
      JOIN users u ON l.seller_id = u.id
      WHERE l.id = ${listingId} AND l.status = 'active'
    `

    if (listing.length === 0) {
      return NextResponse.json({ message: "Listing not found or unavailable" }, { status: 404 })
    }

    const item = listing[0]

    if (item.available_quantity < quantity) {
      return NextResponse.json({ message: "Insufficient quantity available" }, { status: 400 })
    }

    if (item.seller_id === buyerId) {
      return NextResponse.json({ message: "Cannot buy your own listing" }, { status: 400 })
    }

    // Calculate totals
    const unitPrice = item.price
    const shippingCost = item.shipping_cost || 0
    const totalAmount = unitPrice * quantity + shippingCost

    // Generate order number
    const orderNumber =
      "ORD-" +
      new Date().getFullYear() +
      "-" +
      String(Date.now()).slice(-6) +
      Math.random().toString(36).substring(2, 4).toUpperCase()

    // Create order
    const order = await sql`
      INSERT INTO marketplace_orders (
        order_number, buyer_id, seller_id, listing_id, quantity,
        unit_price, shipping_cost, total_amount, currency_code,
        status, payment_status, shipping_address
      ) VALUES (
        ${orderNumber}, ${buyerId}, ${item.seller_id}, ${listingId}, ${quantity},
        ${unitPrice}, ${shippingCost}, ${totalAmount}, ${item.currency_code},
        'pending', 'pending', ${JSON.stringify(shippingAddress)}
      )
      RETURNING id, order_number, total_amount, created_at
    `

    // Create escrow transaction
    const transactionHash = "ESC" + Date.now().toString(36) + Math.random().toString(36).substring(2, 8).toUpperCase()

    const escrowTransaction = await sql`
      INSERT INTO transactions (
        transaction_hash, amount, currency_code, transaction_type,
        status, description, reference_id, reference_type, approval_level
      ) VALUES (
        ${transactionHash}, ${totalAmount}, ${item.currency_code}, 'escrow_hold',
        'pending', 'Escrow for order ${orderNumber}', ${order[0].id}, 'marketplace_order', 'automatic'
      )
      RETURNING id
    `

    // Update order with escrow transaction
    await sql`
      UPDATE marketplace_orders 
      SET escrow_transaction_id = ${escrowTransaction[0].id}
      WHERE id = ${order[0].id}
    `

    // Log order creation
    await sql`
      INSERT INTO admin_actions (admin_id, action_type, details, notes)
      VALUES (
        ${buyerId}, 'order_created',
        ${JSON.stringify({
          orderId: order[0].id,
          orderNumber,
          listingId,
          totalAmount,
          escrowTransactionId: escrowTransaction[0].id,
        })},
        'New marketplace order created'
      )
    `

    return NextResponse.json(
      {
        message: "Order created successfully",
        order: {
          id: order[0].id,
          orderNumber,
          totalAmount: order[0].total_amount,
          status: "pending",
          paymentStatus: "pending",
          escrowTransactionHash: transactionHash,
          createdAt: order[0].created_at,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 })
  }
}
