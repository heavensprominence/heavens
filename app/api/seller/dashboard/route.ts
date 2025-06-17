import { type NextRequest, NextResponse } from "next/server"

// Demo data for seller dashboard
const generateDemoData = () => {
  return {
    stats: {
      totalProducts: 24,
      activeListings: 18,
      totalOrders: 156,
      pendingOrders: 8,
      totalRevenue: 2847.5,
      monthlyRevenue: 892.3,
      averageRating: 4.7,
      totalViews: 3420,
    },
    recentOrders: [
      {
        id: "ORD-001",
        customer: "John Smith",
        product: "Wireless Headphones",
        amount: 89.99,
        status: "pending",
        date: "2024-01-15T10:30:00Z",
      },
      {
        id: "ORD-002",
        customer: "Sarah Johnson",
        product: "Smart Watch",
        amount: 199.99,
        status: "shipped",
        date: "2024-01-14T15:45:00Z",
      },
      {
        id: "ORD-003",
        customer: "Mike Davis",
        product: "Bluetooth Speaker",
        amount: 45.99,
        status: "delivered",
        date: "2024-01-13T09:20:00Z",
      },
    ],
    topProducts: [
      {
        id: "PROD-001",
        title: "Wireless Headphones",
        sales: 45,
        revenue: 2249.55,
        views: 890,
        rating: 4.8,
      },
      {
        id: "PROD-002",
        title: "Smart Watch",
        sales: 23,
        revenue: 1199.77,
        views: 567,
        rating: 4.6,
      },
      {
        id: "PROD-003",
        title: "Bluetooth Speaker",
        sales: 67,
        revenue: 1398.33,
        views: 1234,
        rating: 4.9,
      },
    ],
    notifications: [
      {
        title: "New Order Received",
        message: "Order #ORD-001 for Wireless Headphones",
        time: "2 hours ago",
        type: "order",
      },
      {
        title: "Low Stock Alert",
        message: "Smart Watch has only 3 units left",
        time: "5 hours ago",
        type: "inventory",
      },
      {
        title: "Payment Received",
        message: "89.99 CRED deposited to your account",
        time: "1 day ago",
        type: "payment",
      },
    ],
  }
}

export async function GET(request: NextRequest) {
  try {
    // In demo mode, return mock data
    const demoData = generateDemoData()

    return NextResponse.json(demoData)
  } catch (error) {
    console.error("Error fetching seller dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
