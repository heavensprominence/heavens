import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const listings = await sql`
      SELECT 
        l.id,
        l.title,
        l.price,
        l.currency_code,
        l.status,
        l.is_featured,
        l.condition,
        l.quantity,
        l.created_at,
        u.first_name || ' ' || u.last_name as seller_name,
        c.name as category_name,
        COALESCE(lv.view_count, 0) as view_count
      FROM listings l
      JOIN users u ON l.seller_id = u.id
      JOIN categories c ON l.category_id = c.id
      LEFT JOIN (
        SELECT listing_id, COUNT(*) as view_count
        FROM listing_views
        GROUP BY listing_id
      ) lv ON l.id = lv.listing_id
      ORDER BY l.created_at DESC
      LIMIT 100
    `

    return NextResponse.json({ listings })
  } catch (error) {
    console.error("Error fetching listings:", error)
    return NextResponse.json({ message: "Failed to fetch listings" }, { status: 500 })
  }
}
