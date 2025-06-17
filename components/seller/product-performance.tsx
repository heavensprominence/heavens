"use client"

import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp, Eye } from "lucide-react"

interface Product {
  id: string
  title: string
  sales: number
  revenue: number
  views: number
  rating: number
}

interface ProductPerformanceProps {
  products: Product[]
}

export function ProductPerformance({ products }: ProductPerformanceProps) {
  if (!products.length) {
    return (
      <div className="text-center py-8">
        <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No product data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {products.map((product, index) => (
        <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-bold">#{index + 1}</span>
            </div>
            <div>
              <p className="font-medium">{product.title}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{product.sales} sales</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {product.views}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current text-yellow-400" />
                  {product.rating}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold">{product.revenue.toFixed(2)} CRED</p>
            <Badge variant="secondary" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Top Seller
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
