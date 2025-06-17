import { type NextRequest, NextResponse } from "next/server"

// Demo products data
const generateDemoProducts = () => {
  return [
    {
      id: "PROD-001",
      title: "Wireless Bluetooth Headphones",
      description: "High-quality wireless headphones with noise cancellation",
      price: 89.99,
      currency: "CRED",
      category: "Electronics",
      status: "active",
      stock: 25,
      images: ["/placeholder.svg?height=200&width=200"],
      views: 890,
      sales: 45,
      rating: 4.8,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "PROD-002",
      title: "Smart Fitness Watch",
      description: "Advanced fitness tracking with heart rate monitor",
      price: 199.99,
      currency: "CRED",
      category: "Wearables",
      status: "active",
      stock: 3,
      images: ["/placeholder.svg?height=200&width=200"],
      views: 567,
      sales: 23,
      rating: 4.6,
      createdAt: "2024-01-02T00:00:00Z",
      updatedAt: "2024-01-14T15:45:00Z",
    },
    {
      id: "PROD-003",
      title: "Portable Bluetooth Speaker",
      description: "Waterproof speaker with 12-hour battery life",
      price: 45.99,
      currency: "CRED",
      category: "Audio",
      status: "active",
      stock: 18,
      images: ["/placeholder.svg?height=200&width=200"],
      views: 1234,
      sales: 67,
      rating: 4.9,
      createdAt: "2024-01-03T00:00:00Z",
      updatedAt: "2024-01-13T09:20:00Z",
    },
    {
      id: "PROD-004",
      title: "Gaming Mechanical Keyboard",
      description: "RGB backlit mechanical keyboard for gaming",
      price: 129.99,
      currency: "CRED",
      category: "Gaming",
      status: "draft",
      stock: 0,
      images: ["/placeholder.svg?height=200&width=200"],
      views: 234,
      sales: 0,
      rating: 0,
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-10T00:00:00Z",
    },
    {
      id: "PROD-005",
      title: "Wireless Mouse",
      description: "Ergonomic wireless mouse with precision tracking",
      price: 29.99,
      currency: "CRED",
      category: "Accessories",
      status: "inactive",
      stock: 0,
      images: ["/placeholder.svg?height=200&width=200"],
      views: 456,
      sales: 12,
      rating: 4.3,
      createdAt: "2023-12-15T00:00:00Z",
      updatedAt: "2024-01-05T00:00:00Z",
    },
  ]
}

export async function GET(request: NextRequest) {
  try {
    const products = generateDemoProducts()

    return NextResponse.json({
      products,
      total: products.length,
      success: true,
    })
  } catch (error) {
    console.error("Error fetching seller products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
