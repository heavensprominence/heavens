"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, Package } from "lucide-react"
import { ProductManagementTable } from "@/components/seller/product-management-table"

export default function SellerProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/seller/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || product.status === activeTab
    return matchesSearch && matchesTab
  })

  const productCounts = {
    all: products.length,
    active: products.filter((p: any) => p.status === "active").length,
    draft: products.filter((p: any) => p.status === "draft").length,
    inactive: products.filter((p: any) => p.status === "inactive").length,
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Products</h1>
          <p className="text-muted-foreground">Manage your product listings and inventory</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Product Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({productCounts.all})</TabsTrigger>
          <TabsTrigger value="active">Active ({productCounts.active})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({productCounts.draft})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({productCounts.inactive})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <ProductManagementTable products={filteredProducts} onProductUpdate={fetchProducts} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm
                    ? `No products match "${searchTerm}"`
                    : activeTab === "all"
                      ? "You haven't created any products yet"
                      : `No ${activeTab} products found`}
                </p>
                {!searchTerm && activeTab === "all" && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Product
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
