import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const categories = await sql`
      SELECT 
        c.id,
        c.name,
        c.description,
        c.sort_order,
        COUNT(l.id) as product_count
      FROM auction_categories c
      LEFT JOIN marketplace_listings l ON c.id = l.category_id AND l.status = 'active'
      WHERE c.is_active = true
      GROUP BY c.id, c.name, c.description, c.sort_order
      ORDER BY c.sort_order ASC, c.name ASC
    `

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error fetching categories:", error)

    // Fallback to demo data
    const demoCategories = [
      { id: 1, name: "Electronics", description: "Electronic devices and gadgets", product_count: 3 },
      { id: 2, name: "Fashion", description: "Clothing and accessories", product_count: 1 },
      { id: 3, name: "Home & Garden", description: "Home and garden items", product_count: 2 },
      { id: 4, name: "Sports", description: "Sports equipment", product_count: 1 },
    ]

    return NextResponse.json({ categories: demoCategories })
  }
}
