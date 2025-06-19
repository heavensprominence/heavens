"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-context"
import { ShoppingCart, Search, Plus } from "lucide-react"
import Link from "next/link"

interface MarketplaceItem {
  id: string
  title: string
  description: string
  price: number
  seller: string
  category: string
  condition: string
  images: string[]
  timestamp: string
  status: "active" | "sold" | "pending"
}

export default function MarketplacePage() {
  const { user } = useAuth()
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    // Load marketplace items
    const marketplaceItems = localStorage.getItem("marketplace_items")
    if (marketplaceItems) {
      setItems(JSON.parse(marketplaceItems))
    } else {
      // Initialize with sample items
      const sampleItems: MarketplaceItem[] = [
        {
          id: "1",
          title: "Vintage Camera",
          description: "Professional vintage camera in excellent condition. Perfect for photography enthusiasts.",
          price: 2500,
          seller: "PhotoPro",
          category: "Electronics",
          condition: "Excellent",
          images: ["/placeholder.svg?height=200&width=200&text=Camera"],
          timestamp: new Date().toISOString(),
          status: "active",
        },
        {
          id: "2",
          title: "Handmade Wooden Table",
          description: "Beautiful handcrafted wooden dining table. Seats 6 people comfortably.",
          price: 5000,
          seller: "WoodCrafter",
          category: "Furniture",
          condition: "New",
          images: ["/placeholder.svg?height=200&width=200&text=Table"],
          timestamp: new Date().toISOString(),
          status: "active",
        },
        {
          id: "3",
          title: "Gaming Laptop",
          description: "High-performance gaming laptop with RTX graphics. Perfect for gaming and work.",
          price: 8000,
          seller: "TechGuru",
          category: "Electronics",
          condition: "Like New",
          images: ["/placeholder.svg?height=200&width=200&text=Laptop"],
          timestamp: new Date().toISOString(),
          status: "active",
        },
      ]
      setItems(sampleItems)
      localStorage.setItem("marketplace_items", JSON.stringify(sampleItems))
    }
  }, [])

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory && item.status === "active"
  })

  const categories = ["all", ...Array.from(new Set(items.map((item) => item.category)))]

  const handlePurchase = (item: MarketplaceItem) => {
    if (!user) {
      alert("Please sign in to make purchases")
      return
    }

    if (user.credBalance < item.price) {
      alert("Insufficient CRED balance")
      return
    }

    // Process purchase
    const updatedItems = items.map((i) => (i.id === item.id ? { ...i, status: "sold" as const } : i))
    setItems(updatedItems)
    localStorage.setItem("marketplace_items", JSON.stringify(updatedItems))

    // Update user balance
    const newBalance = user.credBalance - item.price
    // This would normally call updateCredBalance from auth context

    // Add transaction to history
    const transaction = {
      id: Date.now().toString(),
      type: "purchase",
      amount: item.price,
      item: item.title,
      seller: item.seller,
      timestamp: new Date().toISOString(),
      status: "completed",
    }

    const userTransactions = JSON.parse(localStorage.getItem(`transactions_${user.id}`) || "[]")
    userTransactions.unshift(transaction)
    localStorage.setItem(`transactions_${user.id}`, JSON.stringify(userTransactions))

    alert(`Successfully purchased ${item.title} for ₡${item.price}!`)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Marketplace</h1>
              <p className="text-gray-400">Buy and sell items with CRED</p>
            </div>
            <Link href="/marketplace/sell">
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                <Plus className="mr-2 h-4 w-4" />
                List Item
              </Button>
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "border-gray-600 text-gray-300 hover:bg-gray-800"
                  }
                >
                  {category === "all" ? "All" : category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader className="p-0">
                <img
                  src={item.images[0] || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-white text-lg">{item.title}</CardTitle>
                  <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                    {item.condition}
                  </Badge>
                </div>
                <CardDescription className="text-gray-400 mb-3 line-clamp-2">{item.description}</CardDescription>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-2xl font-bold text-yellow-500">₡{item.price.toLocaleString()}</span>
                  <Badge className="bg-blue-500/20 text-blue-400">{item.category}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">by {item.seller}</span>
                  <Button
                    onClick={() => handlePurchase(item)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                    disabled={!user || (user && user.credBalance < item.price)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Buy Now
                  </Button>
                </div>
                {user && user.credBalance < item.price && (
                  <p className="text-red-400 text-xs mt-2">Insufficient balance</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
