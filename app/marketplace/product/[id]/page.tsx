"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/simple-auth-provider"
import { useToast } from "@/hooks/use-toast"
import {
  ShoppingCart,
  Heart,
  Share2,
  Flag,
  Star,
  Shield,
  Truck,
  RotateCcw,
  MessageCircle,
  Eye,
  Calendar,
  Package,
} from "lucide-react"

interface ProductDetails {
  id: number
  title: string
  description: string
  price: number
  currency_code: string
  seller_id: number
  seller_name: string
  seller_rating: number
  seller_total_sales: number
  category_name: string
  condition: string
  quantity: number
  is_featured: boolean
  images: string[]
  specifications: Record<string, string>
  shipping_info: {
    free_shipping: boolean
    estimated_days: number
    shipping_cost: number
  }
  return_policy: string
  created_at: string
  view_count: number
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()

  const [product, setProduct] = useState<ProductDetails | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProductDetails(params.id as string)
    }
  }, [params.id])

  const fetchProductDetails = async (productId: string) => {
    try {
      const response = await fetch(`/api/marketplace/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
      } else {
        // Demo data for demo mode
        setProduct(getDemoProduct(Number.parseInt(productId)))
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      setProduct(getDemoProduct(Number.parseInt(productId as string)))
    } finally {
      setIsLoading(false)
    }
  }

  const getDemoProduct = (id: number): ProductDetails => ({
    id,
    title: "Professional Camera Kit",
    description:
      "High-quality DSLR camera with multiple lenses and accessories. Perfect for professional photography and videography. Includes camera body, 18-55mm lens, 55-200mm telephoto lens, camera bag, extra batteries, and memory cards. This kit has everything you need to start your photography journey or upgrade your existing setup.",
    price: 1250,
    currency_code: "CRED",
    seller_id: 1,
    seller_name: "PhotoPro Store",
    seller_rating: 4.8,
    seller_total_sales: 156,
    category_name: "Electronics",
    condition: "new",
    quantity: 3,
    is_featured: true,
    images: [
      "/placeholder.svg?height=400&width=400&text=Camera+Kit+1",
      "/placeholder.svg?height=400&width=400&text=Camera+Kit+2",
      "/placeholder.svg?height=400&width=400&text=Camera+Kit+3",
    ],
    specifications: {
      Brand: "Canon",
      Model: "EOS R6 Mark II",
      Sensor: "24.2MP Full Frame CMOS",
      Video: "4K 60fps",
      "ISO Range": "100-102400",
      Weight: "588g (body only)",
    },
    shipping_info: {
      free_shipping: true,
      estimated_days: 3,
      shipping_cost: 0,
    },
    return_policy: "30-day return policy with full refund",
    created_at: new Date().toISOString(),
    view_count: 156,
  })

  const handleAddToCart = async () => {
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
        body: JSON.stringify({ productId: product?.id, quantity }),
      })

      if (response.ok) {
        toast({
          title: "Added to cart",
          description: `${product?.title} has been added to your cart`,
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

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to make a purchase",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Demo Mode",
      description: "Checkout functionality available with database setup",
      variant: "default",
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading product details...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button asChild>
            <Link href="/marketplace">Back to Marketplace</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/marketplace" className="hover:text-foreground">
          Marketplace
        </Link>
        <span>/</span>
        <Link href={`/marketplace/category/${product.category_name.toLowerCase()}`} className="hover:text-foreground">
          {product.category_name}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImageIndex] || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">{product.title}</h1>
              {product.is_featured && <Star className="h-6 w-6 text-yellow-500 fill-current" />}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {product.view_count} views
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Listed {new Date(product.created_at).toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline" className={getConditionColor(product.condition)}>
                {product.condition.replace("_", " ")}
              </Badge>
              <Badge variant="secondary">{product.category_name}</Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                {product.quantity} available
              </Badge>
            </div>
          </div>

          <div className="text-4xl font-bold text-primary">
            {product.price.toLocaleString()} {product.currency_code}
          </div>

          {/* Seller Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{product.seller_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{product.seller_name}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      {product.seller_rating}
                    </div>
                    <span>•</span>
                    <span>{product.seller_total_sales} sales</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="ml-auto">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-4 w-4 text-green-600" />
                <span className="font-semibold">
                  {product.shipping_info.free_shipping
                    ? "Free Shipping"
                    : `Shipping: ${product.shipping_info.shipping_cost} CRED`}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Estimated delivery: {product.shipping_info.estimated_days} days
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="quantity" className="text-sm font-medium">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                  className="border rounded px-3 py-1"
                >
                  {Array.from({ length: Math.min(product.quantity, 10) }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button size="lg" className="flex-1" onClick={handleBuyNow}>
                Buy Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsWishlisted(!isWishlisted)}>
                <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? "fill-current text-red-500" : ""}`} />
                {isWishlisted ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Flag className="h-4 w-4 mr-2" />
                Report
              </Button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-green-600" />
              CRED Escrow Protected
            </div>
            <div className="flex items-center gap-1">
              <RotateCcw className="h-4 w-4 text-blue-600" />
              30-day Returns
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="font-medium">{key}</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Shipping Information</h4>
                <p className="text-muted-foreground">
                  {product.shipping_info.free_shipping
                    ? "Free shipping on this item"
                    : `Shipping cost: ${product.shipping_info.shipping_cost} CRED`}
                </p>
                <p className="text-muted-foreground">
                  Estimated delivery: {product.shipping_info.estimated_days} business days
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Return Policy</h4>
                <p className="text-muted-foreground">{product.return_policy}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
