"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Star, Plus, ArrowUpRight, AlertCircle } from "lucide-react"
import { SellerStats } from "@/components/seller/seller-stats"
import { RecentOrders } from "@/components/seller/recent-orders"
import { ProductPerformance } from "@/components/seller/product-performance"
import { QuickActions } from "@/components/seller/quick-actions"

interface DashboardData {
  stats: {
    totalProducts: number
    activeListings: number
    totalOrders: number
    pendingOrders: number
    totalRevenue: number
    monthlyRevenue: number
    averageRating: number
    totalViews: number
  }
  recentOrders: any[]
  topProducts: any[]
  notifications: any[]
}

export default function SellerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/seller/dashboard")
      if (response.ok) {
        const dashboardData = await response.json()
        setData(dashboardData)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
          <p className="text-muted-foreground">Manage your products, orders, and grow your business</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View Storefront
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <SellerStats data={data?.stats} />

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest orders from your customers</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <RecentOrders orders={data?.recentOrders || []} />
            </CardContent>
          </Card>

          {/* Product Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Your best-selling products this month</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductPerformance products={data?.topProducts || []} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions />

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.notifications?.length ? (
                data.notifications.map((notification, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No new notifications</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Seller Rating */}
          <Card>
            <CardHeader>
              <CardTitle>Seller Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= (data?.stats?.averageRating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold">{data?.stats?.averageRating?.toFixed(1) || "0.0"}</span>
              </div>
              <p className="text-sm text-muted-foreground">Based on customer reviews</p>
              <Button variant="outline" size="sm" className="w-full mt-3">
                View Reviews
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
