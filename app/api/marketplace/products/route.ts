import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")
  const sort = searchParams.get("sort") || "newest"
  const limit = Number.parseInt(searchParams.get("limit") || "20")
  const offset = Number.parseInt(searchParams.get("offset") || "0")

  try {
    let query = `
      SELECT 
        l.id,
        l.title,
        l.description,
        l.price,
        l.currency_code,
        l.condition,
        l.is_featured,
        l.created_at,
        u.first_name || ' ' || u.last_name as seller_name,
        c.name as category_name,
        COALESCE(lv.view_count, 0) as view_count,
        l.images
      FROM listings l
      JOIN users u ON l.seller_id = u.id
      JOIN categories c ON l.category_id = c.id
      LEFT JOIN (
        SELECT listing_id, COUNT(*) as view_count
        FROM listing_views
        GROUP BY listing_id
      ) lv ON l.id = lv.listing_id
      WHERE l.status = 'active'
    `

    const params: any[] = []
    let paramIndex = 1

    if (category && category !== "all") {
      query += ` AND c.name ILIKE $${paramIndex}`
      params.push(`%${category}%`)
      paramIndex++
    }

    if (search) {
      query += ` AND (l.title ILIKE $${paramIndex} OR l.description ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    // Add sorting
    switch (sort) {
      case "price_low":
        query += " ORDER BY l.price ASC"
        break
      case "price_high":
        query += " ORDER BY l.price DESC"
        break
      case "popular":
        query += " ORDER BY COALESCE(lv.view_count, 0) DESC"
        break
      case "featured":
        query += " ORDER BY l.is_featured DESC, l.created_at DESC"
        break
      case "newest":
      default:
        query += " ORDER BY l.created_at DESC"
        break
    }

    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const products = await sql(query, params)

    return NextResponse.json({
      success: true,
      products,
      total: products.length,
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
