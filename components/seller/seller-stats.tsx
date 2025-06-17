"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, DollarSign, TrendingUp, Eye } from "lucide-react"

interface SellerStatsProps {
  data?: {
    totalProducts: number
    activeListings: number
    totalOrders: number
    pendingOrders: number
    totalRevenue: number
    monthlyRevenue: number
    averageRating: number
    totalViews: number
  }
}

export function SellerStats({ data }: SellerStatsProps) {
  const stats = data || {
    totalProducts: 0,
    activeListings: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    totalViews: 0,
  }

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      description: `${stats.activeListings} active listings`,
      icon: Package,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      description: `${stats.pendingOrders} pending`,
      icon: ShoppingCart,
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Revenue",
      value: `${stats.totalRevenue.toFixed(2)} CRED`,
      description: `${stats.monthlyRevenue.toFixed(2)} CRED this month`,
      icon: DollarSign,
      trend: "+23%",
      trendUp: true,
    },
    {
      title: "Store Views",
      value: stats.totalViews.toLocaleString(),
      description: "Total profile visits",
      icon: Eye,
      trend: "+15%",
      trendUp: true,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <Badge variant={stat.trendUp ? "default" : "secondary"} className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.trend}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
