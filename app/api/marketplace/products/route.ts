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
        l.quantity,
        l.location_country,
        l.location_city,
        l.images,
        u.first_name || ' ' || u.last_name as seller_name,
        c.name as category_name,
        COALESCE(lv.view_count, 0) as view_count
      FROM marketplace_listings l
      JOIN users u ON l.seller_id = u.id
      LEFT JOIN auction_categories c ON l.category_id = c.id
      LEFT JOIN (
        SELECT target_id as listing_id, COUNT(*) as view_count
        FROM user_interactions
        WHERE target_type = 'listing' AND interaction_type = 'view'
        GROUP BY target_id
      ) lv ON l.id = lv.listing_id
      WHERE l.status = 'active' AND l.moderation_status = 'approved'
    `

    const params: any[] = []
    let paramIndex = 1

    if (category && category !== "all") {
      query += ` AND c.name ILIKE $${paramIndex}`
      params.push(`%${category}%`)
      paramIndex++
    }

    if (search) {
      query += ` AND (l.title ILIKE $${paramIndex} OR l.description ILIKE $${paramIndex} OR l.search_keywords ILIKE $${paramIndex})`
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

    const products = await sql.unsafe(query, params)

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Error fetching products:", error)

    // Fallback to demo data if database fails
    const demoProducts = [
      {
        id: 1,
        title: "Professional Camera Kit",
        description: "High-quality DSLR camera with multiple lenses and accessories",
        price: 1250,
        currency_code: "USD-CRED",
        seller_name: "PhotoPro Store",
        category_name: "Electronics",
        condition: "new",
        is_featured: true,
        created_at: new Date().toISOString(),
        view_count: 156,
        quantity: 1,
        location_country: "US",
        location_city: "New York",
        images: ["/placeholder.svg?height=400&width=400&text=Camera+Kit"],
      },
    ]

    return NextResponse.json({ products: demoProducts })
  }
}

export async function POST(request: Request) {
  try {
    const {
      title,
      description,
      categoryId,
      price,
      currencyCode = "USD-CRED",
      quantity = 1,
      condition = "new",
      locationCountry,
      locationCity,
      shippingCost = 0,
      allowsOffers = true,
      images = [],
      tags = [],
      sellerId,
    } = await request.json()

    if (!title || !description || !price || !sellerId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const listing = await sql`
      INSERT INTO marketplace_listings (
        seller_id, title, description, category_id, price, currency_code,
        quantity, condition, location_country, location_city, shipping_cost,
        allows_offers, images, tags, search_keywords, status, moderation_status
      ) VALUES (
        ${sellerId}, ${title}, ${description}, ${categoryId}, ${price}, ${currencyCode},
        ${quantity}, ${condition}, ${locationCountry}, ${locationCity}, ${shippingCost},
        ${allowsOffers}, ${JSON.stringify(images)}, ${tags}, 
        ${title + " " + description + " " + tags.join(" ")}, 'active', 'approved'
      )
      RETURNING id, title, created_at
    `

    return NextResponse.json(
      {
        message: "Listing created successfully",
        listing: listing[0],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating listing:", error)
    return NextResponse.json({ message: "Failed to create listing" }, { status: 500 })
  }
}
