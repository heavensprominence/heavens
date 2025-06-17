"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Package } from "lucide-react"

interface Order {
  id: string
  customer: string
  product: string
  amount: number
  status: string
  date: string
}

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!orders.length) {
    return (
      <div className="text-center py-8">
        <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No recent orders</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{order.id}</span>
              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{order.customer}</p>
            <p className="text-sm font-medium">{order.product}</p>
          </div>
          <div className="text-right">
            <p className="font-bold">{order.amount.toFixed(2)} CRED</p>
            <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
          </div>
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
