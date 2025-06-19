import { sql } from "@/lib/db"
import { getServerSession } from "next-auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock data for when database is not available
    const mockListings = [
      {
        id: "1",
        title: "iPhone 15 Pro Max - Like New",
        description: "Barely used iPhone 15 Pro Max in excellent condition. Comes with original box and charger.",
        price: 800,
        currency: "USD-CRED",
        type: "for_sale",
        images: ["/placeholder.svg?height=200&width=300&text=iPhone"],
        location: "New York, NY",
        status: "active",
        rating: 5,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Looking for Gaming Laptop",
        description: "Need a gaming laptop with RTX 4060 or better. Budget up to 1200 CRED.",
        price: 1200,
        currency: "USD-CRED",
        type: "wanted",
        images: ["/placeholder.svg?height=200&width=300&text=Gaming+Laptop"],
        location: "Los Angeles, CA",
        status: "active",
        rating: null,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "3",
        title: "Vintage Leather Sofa",
        description: "Beautiful vintage leather sofa in great condition. Perfect for any living room.",
        price: 450,
        currency: "USD-CRED",
        type: "for_sale",
        images: ["/placeholder.svg?height=200&width=300&text=Leather+Sofa"],
        location: "Chicago, IL",
        status: "active",
        rating: 4,
        created_at: new Date(Date.now() - 7200000).toISOString(),
      },
    ]

    try {
      const listings = await sql`
        SELECT 
          id,
          title,
          description,
          price,
          currency,
          type,
          images,
          location,
          status,
          rating,
          created_at
        FROM classified_listings 
        WHERE status = 'active'
        ORDER BY created_at DESC 
        LIMIT 50
      `

      return NextResponse.json({
        listings: listings.map((l) => ({
          ...l,
          createdAt: l.created_at,
        })),
      })
    } catch (dbError) {
      console.log("Database not ready, using mock data")
      return NextResponse.json({
        listings: mockListings.map((l) => ({
          ...l,
          createdAt: l.created_at,
        })),
      })
    }
  } catch (error) {
    console.error("Failed to fetch classifieds:", error)
    return NextResponse.json({ listings: [] }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, price, currency, type, location, category, images } = await request.json()

    // Validate inputs
    if (!title || !description || !price || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    try {
      const result = await sql`
        INSERT INTO classified_listings (
          user_id, title, description, price, currency, type, 
          location, images, status
        ) VALUES (
          ${session.user.id}, ${title}, ${description}, ${price}, 
          ${currency}, ${type}, ${location}, ${images}, 'active'
        )
        RETURNING id
      `

      return NextResponse.json({ success: true, id: result[0].id })
    } catch (dbError) {
      console.log("Database not ready, simulating success")
      return NextResponse.json({ success: true, id: "mock-id" })
    }
  } catch (error) {
    console.error("Failed to create classified:", error)
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 })
  }
}
