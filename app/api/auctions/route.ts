import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")
  const status = searchParams.get("status") || "active"
  const limit = Number.parseInt(searchParams.get("limit") || "20")
  const offset = Number.parseInt(searchParams.get("offset") || "0")

  try {
    let query = `
      SELECT 
        a.id,
        a.title,
        a.description,
        'forward' as auction_type,
        a.starting_price,
        COALESCE(a.current_bid, a.starting_price) as current_price,
        a.reserve_price,
        a.currency_code,
        a.start_time,
        a.end_time,
        a.status,
        a.condition,
        a.images,
        a.location_country,
        a.location_city,
        u.first_name || ' ' || u.last_name as seller_name,
        c.name as category_name,
        COALESCE(bid_stats.total_bids, 0) as total_bids,
        COALESCE(bid_stats.unique_bidders, 0) as unique_bidders,
        CASE WHEN a.end_time > CURRENT_TIMESTAMP THEN false ELSE true END as is_ended
      FROM auctions a
      JOIN users u ON a.seller_id = u.id
      LEFT JOIN auction_categories c ON a.category_id = c.id
      LEFT JOIN (
        SELECT 
          auction_id,
          COUNT(*) as total_bids,
          COUNT(DISTINCT bidder_id) as unique_bidders
        FROM auction_bids
        WHERE status = 'active'
        GROUP BY auction_id
      ) bid_stats ON a.id = bid_stats.auction_id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (status !== "all") {
      query += ` AND a.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (category && category !== "all") {
      query += ` AND c.name ILIKE $${paramIndex}`
      params.push(`%${category}%`)
      paramIndex++
    }

    if (search) {
      query += ` AND (a.title ILIKE $${paramIndex} OR a.description ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    query += ` ORDER BY 
      CASE WHEN a.end_time > CURRENT_TIMESTAMP THEN 0 ELSE 1 END,
      a.end_time ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const auctions = await sql.unsafe(query, params)

    return NextResponse.json({ auctions })
  } catch (error) {
    console.error("Error fetching auctions:", error)

    // Fallback to demo data
    const demoAuctions = [
      {
        id: 1,
        title: "Vintage Camera Collection",
        description: "Rare collection of vintage cameras from the 1960s-1980s",
        auction_type: "forward",
        starting_price: 500,
        current_price: 1250,
        reserve_price: 800,
        currency_code: "USD-CRED",
        seller_name: "Vintage Collector",
        category_name: "Electronics",
        status: "active",
        start_time: new Date(Date.now() - 86400000 * 2).toISOString(),
        end_time: new Date(Date.now() + 86400000).toISOString(),
        total_bids: 23,
        unique_bidders: 8,
        is_featured: true,
        condition: "good",
        location_country: "US",
        location_city: "New York",
      },
    ]

    return NextResponse.json({ auctions: demoAuctions })
  }
}

export async function POST(request: Request) {
  try {
    const {
      sellerId,
      title,
      description,
      categoryId,
      startingPrice,
      reservePrice,
      currencyCode = "USD-CRED",
      startTime,
      endTime,
      condition = "new",
      locationCountry,
      locationCity,
      images = [],
    } = await request.json()

    if (!sellerId || !title || !description || !startingPrice || !startTime || !endTime) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const auction = await sql`
      INSERT INTO auctions (
        seller_id, title, description, category_id, starting_price, reserve_price,
        currency_code, start_time, end_time, condition, location_country, 
        location_city, images, status
      ) VALUES (
        ${sellerId}, ${title}, ${description}, ${categoryId}, ${startingPrice}, ${reservePrice},
        ${currencyCode}, ${startTime}, ${endTime}, ${condition}, ${locationCountry},
        ${locationCity}, ${JSON.stringify(images)}, 'scheduled'
      )
      RETURNING id, title, start_time, end_time
    `

    return NextResponse.json(
      {
        message: "Auction created successfully",
        auction: auction[0],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating auction:", error)
    return NextResponse.json({ message: "Failed to create auction" }, { status: 500 })
  }
}
