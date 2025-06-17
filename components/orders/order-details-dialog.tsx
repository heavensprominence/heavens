"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

interface OrderDetailsDialogProps {
  order: Order
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: (status: string) => void
}

export function OrderDetailsDialog({ order, isOpen, onClose, onStatusUpdate }: OrderDetailsDialogProps) {
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen && order) {
      fetchOrderDetails()
    }
  }, [isOpen, order])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${order.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrderDetails(data.order)
      }
    } catch (error) {
      console.error("Error fetching order details:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.order_number)
    toast({
      title: "Copied",
      description: "Order number copied to clipboard",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "delivered":
        return "bg-blue-500"
      case "shipped":
        return "bg-purple-500"
      case "processing":
        return "bg-orange-500"
      case "pending_payment":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Order Details
            <Badge className={getStatusColor(order.status)}>{order.status.replace(/_/g, " ").toUpperCase()}</Badge>
          </DialogTitle>
          <DialogDescription>Complete information about this order</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Header */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium">Order Number</p>
              <p className="text-lg font-bold">{order.order_number}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Total Amount</p>
              <p className="text-2xl font-bold">
                {Number(order.total_amount).toLocaleString()} {order.currency_code}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={copyOrderNumber}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="communication">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p>{order.buyer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Order Source</p>
                      <Badge variant="outline">{order.source_type.toUpperCase()}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Seller Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm font-medium">Seller</p>
                      <p>{order.seller_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Order Date</p>
                      <p>{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {orderDetails?.shipping_address_line1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <p>{orderDetails.shipping_address_line1}</p>
                      {orderDetails.shipping_address_line2 && <p>{orderDetails.shipping_address_line2}</p>}
                      <p>
                        {orderDetails.shipping_city}, {orderDetails.shipping_state} {orderDetails.shipping_postal_code}
                      </p>
                      <p>{orderDetails.shipping_country}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="items" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Items</CardTitle>
                  <CardDescription>Products included in this order</CardDescription>
                </CardHeader>
                <CardContent>
                  {orderDetails?.items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg mb-2">
                      <div className="flex-1">
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">SKU: {item.product_sku || "N/A"}</p>
                        <p className="text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{Number(item.total_price).toLocaleString()} CRED</p>
                        <p className="text-sm text-muted-foreground">
                          {Number(item.unit_price).toLocaleString()} CRED each
                        </p>
                      </div>
                    </div>
                  )) || <p className="text-center py-4 text-muted-foreground">No items found</p>}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Timeline</CardTitle>
                  <CardDescription>Status changes and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  {orderDetails?.status_history?.map((status: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 pb-4">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium">{status.new_status.replace(/_/g, " ").toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">{status.change_reason}</p>
                        <p className="text-xs text-muted-foreground">{new Date(status.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  )) || <p className="text-center py-4 text-muted-foreground">No timeline data available</p>}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communication" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Messages</CardTitle>
                  <CardDescription>Communication between buyer and seller</CardDescription>
                </CardHeader>
                <CardContent>
                  {orderDetails?.messages?.map((message: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg mb-2">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{message.subject}</p>
                        <p className="text-xs text-muted-foreground">{new Date(message.created_at).toLocaleString()}</p>
                      </div>
                      <p className="text-sm">{message.message}</p>
                    </div>
                  )) || <p className="text-center py-4 text-muted-foreground">No messages found</p>}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>

            {order.status === "pending_payment" && (
              <Button onClick={() => onStatusUpdate("payment_confirmed")}>Confirm Payment</Button>
            )}

            {order.status === "payment_confirmed" && (
              <Button onClick={() => onStatusUpdate("processing")}>Start Processing</Button>
            )}

            {order.status === "processing" && (
              <Button onClick={() => onStatusUpdate("shipped")}>Mark as Shipped</Button>
            )}

            {order.status === "shipped" && (
              <Button onClick={() => onStatusUpdate("delivered")}>Mark as Delivered</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
