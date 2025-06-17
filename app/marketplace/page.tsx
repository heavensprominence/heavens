"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/marketplace/product-card"
import { useAuth } from "@/components/simple-auth-provider"
import { Search, Grid, List, Star, TrendingUp, Clock, ShoppingCart } from "lucide-react"

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

interface Category {
  id: number
  name: string
  slug: string
  product_count: number
}

export default function MarketplacePage() {
  const { user, isAuthenticated } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMarketplaceData()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchTerm, selectedCategory, sortBy])

  const fetchMarketplaceData = async () => {
    try {
      // Fetch products and categories
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/marketplace/products"),
        fetch("/api/marketplace/categories"),
      ])

      if (productsRes.ok && categoriesRes.ok) {
        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        setProducts(productsData.products || [])
        setCategories(categoriesData.categories || [])
      }
    } catch (error) {
      console.error("Error fetching marketplace data:", error)
      // Set demo data for demo mode
      setProducts(getDemoProducts())
      setCategories(getDemoCategories())
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = [...products]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category_name.toLowerCase() === selectedCategory.toLowerCase())
    }

    // Sort products
    switch (sortBy) {
      case "price_low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price_high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "popular":
        filtered.sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
        break
      case "featured":
        filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))
        break
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
    }

    setFilteredProducts(filtered)
  }

  const getDemoProducts = (): Product[] => [
    {
      id: 1,
      title: "Professional Camera Kit",
      description: "High-quality DSLR camera with multiple lenses and accessories",
      price: 1250,
      currency_code: "CRED",
      seller_name: "PhotoPro Store",
      category_name: "Electronics",
      condition: "new",
      is_featured: true,
      created_at: new Date().toISOString(),
      view_count: 156,
    },
    {
      id: 2,
      title: "Vintage Leather Jacket",
      description: "Authentic vintage leather jacket in excellent condition",
      price: 180,
      currency_code: "CRED",
      seller_name: "Vintage Finds",
      category_name: "Fashion",
      condition: "good",
      is_featured: false,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      view_count: 89,
    },
    {
      id: 3,
      title: "Smart Home Security System",
      description: "Complete wireless security system with cameras and sensors",
      price: 450,
      currency_code: "CRED",
      seller_name: "TechSafe Solutions",
      category_name: "Electronics",
      condition: "new",
      is_featured: true,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      view_count: 234,
    },
    {
      id: 4,
      title: "Handcrafted Wooden Table",
      description: "Beautiful oak dining table, handcrafted by local artisan",
      price: 680,
      currency_code: "CRED",
      seller_name: "Artisan Woods",
      category_name: "Furniture",
      condition: "new",
      is_featured: false,
      created_at: new Date(Date.now() - 259200000).toISOString(),
      view_count: 67,
    },
    {
      id: 5,
      title: "Gaming Laptop - High Performance",
      description: "Latest gaming laptop with RTX graphics and fast processor",
      price: 1850,
      currency_code: "CRED",
      seller_name: "Gaming Central",
      category_name: "Electronics",
      condition: "like_new",
      is_featured: true,
      created_at: new Date(Date.now() - 345600000).toISOString(),
      view_count: 312,
    },
    {
      id: 6,
      title: "Organic Skincare Set",
      description: "Complete organic skincare routine with natural ingredients",
      price: 95,
      currency_code: "CRED",
      seller_name: "Natural Beauty Co",
      category_name: "Health & Beauty",
      condition: "new",
      is_featured: false,
      created_at: new Date(Date.now() - 432000000).toISOString(),
      view_count: 45,
    },
  ]

  const getDemoCategories = (): Category[] => [
    { id: 1, name: "Electronics", slug: "electronics", product_count: 3 },
    { id: 2, name: "Fashion", slug: "fashion", product_count: 1 },
    { id: 3, name: "Furniture", slug: "furniture", product_count: 1 },
    { id: 4, name: "Health & Beauty", slug: "health-beauty", product_count: 1 },
  ]

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading marketplace...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Global Marketplace</h1>
        <p className="text-muted-foreground">
          Discover amazing products from sellers worldwide. All transactions protected by CRED escrow.
        </p>
      </div>

      {/* Featured Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <ShoppingCart className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-sm text-muted-foreground">Active Listings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{products.filter((p) => p.is_featured).length}</div>
            <div className="text-sm text-muted-foreground">Featured Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-sm text-muted-foreground">Support</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name} ({category.product_count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
            <SelectItem value="featured">Featured First</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
          {selectedCategory !== "all" && ` in ${selectedCategory}`}
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div
          className={
            viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
          }
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} viewMode={viewMode} isAuthenticated={isAuthenticated} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">No products found matching your criteria.</div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setSelectedCategory("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Call to Action for Sellers */}
      {isAuthenticated && (
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold mb-2">Want to sell on Heavenslive?</h3>
            <p className="text-muted-foreground mb-4">
              Join thousands of sellers and start earning CRED today. Low fees, global reach, escrow protection.
            </p>
            <Button asChild>
              <Link href="/seller/dashboard">Start Selling</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
