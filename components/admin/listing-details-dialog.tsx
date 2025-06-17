"use client"

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
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, Star, Flag, Package, DollarSign, Eye } from "lucide-react"

interface Listing {
  id: number
  title: string
  seller_name: string
  category_name: string
  price: number
  currency_code: string
  status: string
  is_featured: boolean
  condition: string
  quantity: number
  created_at: string
  view_count: number
}

interface ListingDetailsDialogProps {
  listing: Listing
  isOpen: boolean
  onClose: () => void
  onAction: (action: string) => void
}

export function ListingDetailsDialog({ listing, isOpen, onClose, onAction }: ListingDetailsDialogProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "sold":
        return "bg-blue-500"
      case "paused":
        return "bg-yellow-500"
      case "expired":
        return "bg-orange-500"
      case "removed":
        return "bg-red-500"
      case "draft":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "text-green-600"
      case "like_new":
        return "text-blue-600"
      case "good":
        return "text-yellow-600"
      case "fair":
        return "text-orange-600"
      case "poor":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Listing Details
          </DialogTitle>
          <DialogDescription>Complete information about this marketplace listing</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Featured */}
          <div className="flex items-center gap-4">
            <Badge className={getStatusColor(listing.status)}>{listing.status.toUpperCase()}</Badge>
            {listing.is_featured && (
              <Badge className="bg-yellow-500">
                <Star className="h-3 w-3 mr-1 fill-current" />
                FEATURED
              </Badge>
            )}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{listing.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Price</span>
                    <span className="text-lg font-bold">
                      {Number(listing.price).toLocaleString()} {listing.currency_code}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Condition</span>
                    <span className={`text-sm font-medium capitalize ${getConditionColor(listing.condition)}`}>
                      {listing.condition.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Quantity</span>
                    <span className="text-sm">{listing.quantity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Category</span>
                    <Badge variant="outline">{listing.category_name}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Seller Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Seller</span>
                    <span className="text-sm">{listing.seller_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Listing ID</span>
                    <span className="text-sm font-mono">#{listing.id}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Views</span>
                    <span className="text-sm">{listing.view_count || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Created</span>
                    <span className="text-sm">{new Date(listing.created_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Description Section */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                This is a sample description for the listing. In a real implementation, this would contain the actual
                listing description from the database.
              </p>
            </div>
          </div>

          {/* Images Section */}
          <div>
            <h3 className="font-semibold mb-2">Images</h3>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Information */}
          <div>
            <h3 className="font-semibold mb-2">Shipping & Delivery</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium">Shipping Cost</p>
                <p className="text-sm text-muted-foreground">Free shipping</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-sm font-medium">Processing Time</p>
                <p className="text-sm text-muted-foreground">1-3 business days</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>

            {listing.status === "draft" && (
              <Button onClick={() => onAction("approve")}>
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
            )}

            {listing.status === "active" && (
              <>
                <Button variant="outline" onClick={() => onAction("pause")}>
                  <X className="mr-2 h-4 w-4" />
                  Pause
                </Button>
                {!listing.is_featured && (
                  <Button onClick={() => onAction("feature")}>
                    <Star className="mr-2 h-4 w-4" />
                    Make Featured
                  </Button>
                )}
              </>
            )}

            {listing.status === "paused" && (
              <Button onClick={() => onAction("activate")}>
                <Check className="mr-2 h-4 w-4" />
                Activate
              </Button>
            )}

            <Button variant="destructive" onClick={() => onAction("flag")}>
              <Flag className="mr-2 h-4 w-4" />
              Flag
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
