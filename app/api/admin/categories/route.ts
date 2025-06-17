import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const categories = await sql`
      SELECT * FROM categories 
      ORDER BY name ASC
    `

    return NextResponse.json({
      success: true,
      categories: categories || [],
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch categories",
      categories: [],
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, slug, parent_id, is_active } = body

    const result = await sql`
      INSERT INTO categories (name, description, slug, parent_id, is_active)
      VALUES (${name}, ${description}, ${slug}, ${parent_id}, ${is_active})
      RETURNING *
    `

    return NextResponse.json({
      success: true,
      category: result[0],
    })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create category",
      },
      { status: 500 },
    )
  }
}
