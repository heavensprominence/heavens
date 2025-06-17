"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, DollarSign, Clock, CheckCircle, TrendingUp } from "lucide-react"

interface Order {
  id: number
  total_amount: number
  status: string
  created_at: string
}

interface OrderStatsProps {
  orders: Order[]
}

export function OrderStats({ orders }: OrderStatsProps) {
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0)
  const pendingOrders = orders.filter((order) => order.status === "pending_payment").length
  const completedOrders = orders.filter((order) => order.status === "completed").length
  const processingOrders = orders.filter((order) =>
    ["payment_confirmed", "processing", "shipped"].includes(order.status),
  ).length

  // Calculate this month's stats
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const thisMonthOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_at)
    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
  })
  const monthlyRevenue = thisMonthOrders.reduce((sum, order) => sum + Number(order.total_amount), 0)

  const stats = [
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      description: "All time orders",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Total Revenue",
      value: `${totalRevenue.toLocaleString()} CRED`,
      description: "All time earnings",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Monthly Revenue",
      value: `${monthlyRevenue.toLocaleString()} CRED`,
      description: "This month's earnings",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toLocaleString(),
      description: "Awaiting payment",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Processing",
      value: processingOrders.toLocaleString(),
      description: "Being fulfilled",
      icon: Package,
      color: "text-orange-600",
    },
    {
      title: "Completed",
      value: completedOrders.toLocaleString(),
      description: "Successfully delivered",
      icon: CheckCircle,
      color: "text-green-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
