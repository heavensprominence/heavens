import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const result = await db.query(`
      SELECT 
        c.*,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.name
    `)

    return NextResponse.json({
      categories: result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        slug: row.slug,
        parentId: row.parent_id,
        isActive: row.is_active,
        productCount: Number.parseInt(row.product_count),
        createdAt: row.created_at,
      })),
    })
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, slug, parentId, isActive } = await request.json()

    const result = await db.query(
      `INSERT INTO categories (name, description, slug, parent_id, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, description, slug, parentId || null, isActive],
    )

    return NextResponse.json({ category: result.rows[0] })
  } catch (error) {
    console.error("Failed to create category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
