import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { listingId, action } = await request.json()

    if (!listingId || !action) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    let newStatus = ""
    const updateFields: any = {}

    switch (action) {
      case "approve":
        newStatus = "active"
        updateFields.published_at = new Date().toISOString()
        break
      case "pause":
        newStatus = "paused"
        break
      case "activate":
        newStatus = "active"
        break
      case "remove":
        newStatus = "removed"
        break
      case "feature":
        updateFields.is_featured = true
        updateFields.featured_until = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        break
      case "flag":
        // Add to moderation queue
        updateFields.status = "paused"
        break
      default:
        return NextResponse.json({ message: "Invalid action" }, { status: 400 })
    }

    // Update listing
    if (newStatus) {
      await sql`
        UPDATE listings 
        SET status = ${newStatus}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${listingId}
      `
    }

    // Apply additional updates
    if (Object.keys(updateFields).length > 0) {
      const setClause = Object.keys(updateFields)
        .map((key) => `${key} = $${Object.keys(updateFields).indexOf(key) + 2}`)
        .join(", ")

      await sql`
        UPDATE listings 
        SET ${sql.unsafe(setClause)}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${listingId}
      `
    }

    // Create featured listing record if featuring
    if (action === "feature") {
      const transactionHash = "TX" + Date.now().toString(36) + Math.random().toString(36).substring(2, 8)

      // Create payment transaction for featured listing
      await sql`
        INSERT INTO transactions (
          transaction_hash, from_wallet_id, amount, currency_code, 
          transaction_type, status, description, reference_id, reference_type,
          approval_level, completed_at
        ) 
        SELECT 
          ${transactionHash}, w.id, 0.19, 'USD-CRED',
          'featured_listing_fee', 'completed',
          'Featured listing fee', ${listingId}, 'listing',
          'automatic', CURRENT_TIMESTAMP
        FROM wallets w 
        JOIN listings l ON w.user_id = l.seller_id
        WHERE l.id = ${listingId} AND w.is_primary = true
      `

      // Create featured listing record
      await sql`
        INSERT INTO featured_listings (
          listing_id, user_id, feature_type, start_date, end_date, 
          monthly_fee, payment_status, created_at
        )
        SELECT 
          ${listingId}, l.seller_id, 'homepage', CURRENT_DATE, 
          CURRENT_DATE + INTERVAL '30 days', 0.19, 'paid', CURRENT_TIMESTAMP
        FROM listings l
        WHERE l.id = ${listingId}
      `
    }

    // Log admin action
    await sql`
      INSERT INTO admin_actions (admin_id, action_type, details, created_at)
      VALUES (1, 'listing_moderation', ${JSON.stringify({
        listingId,
        action,
        newStatus: newStatus || "no_change",
      })}, CURRENT_TIMESTAMP)
    `

    return NextResponse.json({
      message: `Listing ${action}d successfully`,
      status: newStatus || "updated",
    })
  } catch (error) {
    console.error("Error processing listing action:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
