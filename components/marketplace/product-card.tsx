"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Heart, ShoppingCart, Eye, Star } from "lucide-react"

interface Product {
  id: number
  title: string
  description: string
  price: number
  currency_code: string
  seller_name: string
  category_name: string
  condition: string
  is_featured: boolean
  image_url?: string
  created_at: string
  view_count: number
}

interface ProductCardProps {
  product: Product
  viewMode: "grid" | "list"
  isAuthenticated: boolean
}

export function ProductCard({ product, viewMode, isAuthenticated }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { toast } = useToast()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      })
      return
    }

    setIsAddingToCart(true)

    try {
      const response = await fetch("/api/marketplace/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      })

      if (response.ok) {
        toast({
          title: "Added to cart",
          description: `${product.title} has been added to your cart`,
        })
      } else {
        throw new Error("Failed to add to cart")
      }
    } catch (error) {
      toast({
        title: "Demo Mode",
        description: "Cart functionality available with database setup",
        variant: "default",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save items to your wishlist",
        variant: "destructive",
      })
      return
    }

    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.title} ${isWishlisted ? "removed from" : "added to"} your wishlist`,
    })
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "bg-green-100 text-green-800"
      case "like_new":
        return "bg-blue-100 text-blue-800"
      case "good":
        return "bg-yellow-100 text-yellow-800"
      case "fair":
        return "bg-orange-100 text-orange-800"
      case "poor":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  if (viewMode === "list") {
    return (
      <Link href={`/marketplace/product/${product.id}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                {product.image_url ? (
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-muted-foreground text-xs text-center">No Image</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg truncate flex items-center gap-2">
                      {product.title}
                      {product.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleWishlist}
                    className={isWishlisted ? "text-red-500" : "text-muted-foreground"}
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {product.price.toLocaleString()} {product.currency_code}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{product.seller_name}</span>
                      <span>•</span>
                      <Badge variant="outline" className={getConditionColor(product.condition)}>
                        {product.condition.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {product.view_count || 0}
                    </div>
                    <Button onClick={handleAddToCart} disabled={isAddingToCart} size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {isAddingToCart ? "Adding..." : "Add to Cart"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={`/marketplace/product/${product.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="p-0">
          <div className="relative">
            <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
              {product.image_url ? (
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              ) : (
                <div className="text-muted-foreground">No Image Available</div>
              )}
            </div>

            {product.is_featured && (
              <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleWishlist}
              className={`absolute top-2 right-2 ${isWishlisted ? "text-red-500" : "text-white"} bg-black/20 hover:bg-black/40`}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2">{product.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

            <div className="flex items-center justify-between">
              <Badge variant="outline" className={getConditionColor(product.condition)}>
                {product.condition.replace("_", " ")}
              </Badge>
              <Badge variant="secondary">{product.category_name}</Badge>
            </div>

            <div className="text-2xl font-bold text-primary">
              {product.price.toLocaleString()} {product.currency_code}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{product.seller_name}</span>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {product.view_count || 0}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{formatTimeAgo(product.created_at)}</span>
            </div>
          </div>

          <Button className="w-full mt-4" onClick={handleAddToCart} disabled={isAddingToCart}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}
