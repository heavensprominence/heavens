import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { sql } from "@/lib/db"
import { ShoppingBag, Package, DollarSign, TrendingUp, Star, AlertTriangle } from "lucide-react"

async function getMarketplaceStats() {
  try {
    // Get listing statistics
    const listingStats = await sql`
      SELECT 
        COUNT(*) as total_listings,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_listings,
        COUNT(CASE WHEN status = 'sold' THEN 1 END) as sold_listings,
        COUNT(CASE WHEN is_featured = true AND featured_until > CURRENT_TIMESTAMP THEN 1 END) as featured_listings,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as new_listings_7d,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_listings_30d
      FROM listings
    `

    // Get order statistics
    const orderStats = await sql`
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN status = 'disputed' THEN 1 END) as disputed_orders,
        SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END) as total_sales_volume,
        AVG(CASE WHEN status = 'completed' THEN total_amount END) as avg_order_value,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '24 hours' THEN 1 END) as orders_24h
      FROM orders
    `

    // Get category performance
    const categoryStats = await sql`
      SELECT 
        c.name,
        COUNT(l.id) as listing_count,
        COUNT(CASE WHEN l.status = 'active' THEN 1 END) as active_count
      FROM categories c
      LEFT JOIN listings l ON c.id = l.category_id
      WHERE c.parent_id IS NULL
      GROUP BY c.id, c.name
      ORDER BY listing_count DESC
      LIMIT 5
    `

    // Get recent activity
    const recentListings = await sql`
      SELECT 
        l.id,
        l.title,
        l.price,
        l.currency_code,
        l.status,
        l.created_at,
        u.first_name || ' ' || u.last_name as seller_name,
        c.name as category_name
      FROM listings l
      JOIN users u ON l.seller_id = u.id
      JOIN categories c ON l.category_id = c.id
      ORDER BY l.created_at DESC
      LIMIT 5
    `

    // Get escrow statistics
    const escrowStats = await sql`
      SELECT 
        COUNT(CASE WHEN escrow_status = 'funded' THEN 1 END) as funded_escrows,
        COUNT(CASE WHEN escrow_status = 'disputed' THEN 1 END) as disputed_escrows,
        SUM(CASE WHEN escrow_status = 'funded' THEN total_amount ELSE 0 END) as total_escrow_amount
      FROM orders
      WHERE escrow_transaction_id IS NOT NULL
    `

    return {
      listings: listingStats[0],
      orders: orderStats[0],
      categories: categoryStats,
      recentListings,
      escrow: escrowStats[0] || { funded_escrows: 0, disputed_escrows: 0, total_escrow_amount: 0 },
    }
  } catch (error) {
    console.error("Error fetching marketplace stats:", error)
    return {
      listings: {
        total_listings: 0,
        active_listings: 0,
        sold_listings: 0,
        featured_listings: 0,
        new_listings_7d: 0,
        new_listings_30d: 0,
      },
      orders: {
        total_orders: 0,
        pending_orders: 0,
        completed_orders: 0,
        disputed_orders: 0,
        total_sales_volume: 0,
        avg_order_value: 0,
        orders_24h: 0,
      },
      categories: [],
      recentListings: [],
      escrow: { funded_escrows: 0, disputed_escrows: 0, total_escrow_amount: 0 },
    }
  }
}

export async function MarketplaceStats() {
  const stats = await getMarketplaceStats()

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(stats.listings.total_listings).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.listings.active_listings} active • +{stats.listings.new_listings_7d} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(stats.orders.total_orders).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.orders.pending_orders} pending • {stats.orders.orders_24h} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Number(stats.orders.total_sales_volume).toLocaleString()} CRED
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: {Number(stats.orders.avg_order_value || 0).toLocaleString()} CRED
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escrow Protected</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Number(stats.escrow.total_escrow_amount).toLocaleString()} CRED
            </div>
            <p className="text-xs text-muted-foreground">{stats.escrow.funded_escrows} active escrows</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.categories.map((category: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{category.name}</p>
                    <p className="text-xs text-muted-foreground">{category.active_count} active listings</p>
                  </div>
                  <Badge variant="outline">{category.listing_count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentListings.map((listing: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">{listing.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {listing.seller_name} • {listing.category_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {Number(listing.price).toLocaleString()} {listing.currency_code}
                    </p>
                    <Badge
                      variant={
                        listing.status === "active" ? "default" : listing.status === "sold" ? "secondary" : "outline"
                      }
                    >
                      {listing.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(stats.orders.disputed_orders > 0 || stats.escrow.disputed_escrows > 0) && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Marketplace Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-red-700">
              {stats.orders.disputed_orders > 0 && (
                <p>
                  {stats.orders.disputed_orders} disputed order{stats.orders.disputed_orders > 1 ? "s" : ""} require
                  attention.
                </p>
              )}
              {stats.escrow.disputed_escrows > 0 && (
                <p>
                  {stats.escrow.disputed_escrows} escrow dispute{stats.escrow.disputed_escrows > 1 ? "s" : ""} need
                  resolution.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Listings</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.listings.featured_listings}</div>
            <p className="text-xs text-muted-foreground">Currently promoted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.orders.total_orders > 0
                ? Math.round((Number(stats.orders.completed_orders) / Number(stats.orders.total_orders)) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Orders completed successfully</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dispute Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.orders.total_orders > 0
                ? Math.round((Number(stats.orders.disputed_orders) / Number(stats.orders.total_orders)) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Orders in dispute</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
