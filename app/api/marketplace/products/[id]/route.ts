import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = Number.parseInt(params.id)

    // Record view interaction
    try {
      await sql`
        INSERT INTO user_interactions (user_id, interaction_type, target_type, target_id, metadata)
        VALUES (1, 'view', 'listing', ${productId}, '{"source": "product_page"}')
      `
    } catch (error) {
      // Ignore interaction logging errors
    }

    const [product] = await sql`
      SELECT 
        l.*,
        u.first_name || ' ' || u.last_name as seller_name,
        u.id as seller_id,
        c.name as category_name,
        COALESCE(seller_stats.rating, 4.5) as seller_rating,
        COALESCE(seller_stats.total_sales, 0) as seller_total_sales,
        COALESCE(view_count.views, 0) as view_count
      FROM marketplace_listings l
      JOIN users u ON l.seller_id = u.id
      LEFT JOIN auction_categories c ON l.category_id = c.id
      LEFT JOIN (
        SELECT 
          seller_id,
          AVG(rating) as rating,
          COUNT(*) as total_sales
        FROM order_reviews r
        JOIN marketplace_orders o ON r.order_id = o.id
        WHERE r.reviewed_user_id = o.seller_id
        GROUP BY seller_id
      ) seller_stats ON u.id = seller_stats.seller_id
      LEFT JOIN (
        SELECT target_id, COUNT(*) as views
        FROM user_interactions
        WHERE target_type = 'listing' AND interaction_type = 'view'
        GROUP BY target_id
      ) view_count ON l.id = view_count.target_id
      WHERE l.id = ${productId} AND l.status = 'active'
    `

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Parse JSON fields
    const productDetails = {
      ...product,
      images: product.images || [],
      tags: product.tags || [],
      specifications: {
        Condition: product.condition,
        Location: `${product.location_city}, ${product.location_country}`,
        "Quantity Available": product.quantity.toString(),
        Currency: product.currency_code,
        "Shipping Cost": product.shipping_cost > 0 ? `${product.shipping_cost} ${product.currency_code}` : "Free",
      },
      shipping_info: {
        free_shipping: product.shipping_cost === 0,
        estimated_days: 3,
        shipping_cost: product.shipping_cost,
      },
      return_policy: "30-day return policy with full refund",
    }

    return NextResponse.json({ product: productDetails })
  } catch (error) {
    console.error("Error fetching product details:", error)

    // Fallback to demo data
    const demoProduct = {
      id: Number.parseInt(params.id),
      title: "Professional Camera Kit",
      description:
        "High-quality DSLR camera with multiple lenses and accessories. Perfect for professional photography and videography.",
      price: 1250,
      currency_code: "USD-CRED",
      seller_id: 1,
      seller_name: "PhotoPro Store",
      seller_rating: 4.8,
      seller_total_sales: 156,
      category_name: "Electronics",
      condition: "new",
      quantity: 3,
      is_featured: true,
      images: ["/placeholder.svg?height=400&width=400&text=Camera+Kit"],
      specifications: {
        Brand: "Canon",
        Model: "EOS R6 Mark II",
        Condition: "New",
        Warranty: "2 years",
      },
      shipping_info: {
        free_shipping: true,
        estimated_days: 3,
        shipping_cost: 0,
      },
      return_policy: "30-day return policy with full refund",
      created_at: new Date().toISOString(),
      view_count: 156,
    }

    return NextResponse.json({ product: demoProduct })
  }
}
