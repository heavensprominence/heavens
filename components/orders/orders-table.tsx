"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { OrderDetailsDialog } from "./order-details-dialog"
import { useToast } from "@/hooks/use-toast"
import { Eye, MoreHorizontal, Package, Truck, CheckCircle, XCircle } from "lucide-react"

interface Order {
  id: number
  order_number: string
  buyer_name: string
  seller_name: string
  total_amount: number
  currency_code: string
  status: string
  source_type: string
  created_at: string
  updated_at: string
}

interface OrdersTableProps {
  orders: Order[]
  onOrderUpdate: () => void
}

export function OrdersTable({ orders, onOrderUpdate }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const { toast } = useToast()

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 hover:bg-green-600"
      case "delivered":
        return "bg-blue-500 hover:bg-blue-600"
      case "shipped":
        return "bg-purple-500 hover:bg-purple-600"
      case "processing":
        return "bg-orange-500 hover:bg-orange-600"
      case "pending_payment":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "cancelled":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case "marketplace":
        return "bg-blue-100 text-blue-800"
      case "auction":
        return "bg-purple-100 text-purple-800"
      case "direct":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch("/api/orders/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Order status updated successfully",
        })
        onOrderUpdate()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to update order status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    }
  }

  if (!orders.length) {
    return (
      <div className="text-center py-8">
        <Package className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No orders found</p>
      </div>
    )
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="font-medium">{order.order_number}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{order.buyer_name}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{order.seller_name}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {Number(order.total_amount).toLocaleString()} {order.currency_code}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getSourceBadgeColor(order.source_type)}>{order.source_type.toUpperCase()}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(order.status)}>
                    {order.status.replace(/_/g, " ").toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{new Date(order.created_at).toLocaleDateString()}</div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedOrder(order)
                          setIsDetailsDialogOpen(true)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      {order.status === "pending_payment" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(order.id, "payment_confirmed")}
                          className="text-green-600"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Confirm Payment
                        </DropdownMenuItem>
                      )}

                      {order.status === "payment_confirmed" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(order.id, "processing")}
                          className="text-blue-600"
                        >
                          <Package className="mr-2 h-4 w-4" />
                          Start Processing
                        </DropdownMenuItem>
                      )}

                      {order.status === "processing" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(order.id, "shipped")}
                          className="text-purple-600"
                        >
                          <Truck className="mr-2 h-4 w-4" />
                          Mark as Shipped
                        </DropdownMenuItem>
                      )}

                      {order.status === "shipped" && (
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(order.id, "delivered")}
                          className="text-green-600"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Delivered
                        </DropdownMenuItem>
                      )}

                      {(order.status === "pending_payment" || order.status === "payment_confirmed") && (
                        <DropdownMenuItem
                          onClick={() => handleStatusUpdate(order.id, "cancelled")}
                          className="text-red-600"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel Order
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false)
            setSelectedOrder(null)
          }}
          onStatusUpdate={(newStatus) => {
            handleStatusUpdate(selectedOrder.id, newStatus)
            setIsDetailsDialogOpen(false)
            setSelectedOrder(null)
          }}
        />
      )}
    </>
  )
}
