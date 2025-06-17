"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuctionCard } from "@/components/auctions/auction-card"
import { useAuth } from "@/components/simple-auth-provider"
import { Search, Gavel, TrendingUp, Clock, Zap } from "lucide-react"

interface Auction {
  id: number
  title: string
  description: string
  auction_type: "forward" | "reverse" | "dutch" | "sealed_bid"
  starting_price: number
  current_price: number
  reserve_price?: number
  buy_now_price?: number
  currency_code: string
  seller_name: string
  category_name: string
  status: string
  start_time: string
  end_time: string
  total_bids: number
  unique_bidders: number
  image_url?: string
  is_featured: boolean
}

export default function AuctionsPage() {
  const { user, isAuthenticated } = useAuth()
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [auctionType, setAuctionType] = useState<string>("all")
  const [sortBy, setSortBy] = useState("ending_soon")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAuctions()
  }, [])

  useEffect(() => {
    filterAndSortAuctions()
  }, [auctions, searchTerm, selectedCategory, auctionType, sortBy])

  const fetchAuctions = async () => {
    try {
      const response = await fetch("/api/auctions")
      if (response.ok) {
        const data = await response.json()
        setAuctions(data.auctions || [])
      }
    } catch (error) {
      console.error("Error fetching auctions:", error)
      // Set demo data for demo mode
      setAuctions(getDemoAuctions())
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortAuctions = () => {
    let filtered = [...auctions]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (auction) =>
          auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          auction.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((auction) => auction.category_name.toLowerCase() === selectedCategory.toLowerCase())
    }

    // Filter by auction type
    if (auctionType !== "all") {
      filtered = filtered.filter((auction) => auction.auction_type === auctionType)
    }

    // Sort auctions
    switch (sortBy) {
      case "ending_soon":
        filtered.sort((a, b) => new Date(a.end_time).getTime() - new Date(b.end_time).getTime())
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
        break
      case "price_low":
        filtered.sort((a, b) => a.current_price - b.current_price)
        break
      case "price_high":
        filtered.sort((a, b) => b.current_price - a.current_price)
        break
      case "most_bids":
        filtered.sort((a, b) => b.total_bids - a.total_bids)
        break
      default:
        break
    }

    setFilteredAuctions(filtered)
  }

  const getDemoAuctions = (): Auction[] => [
    {
      id: 1,
      title: "Vintage Camera Collection",
      description: "Rare collection of vintage cameras from the 1960s-1980s",
      auction_type: "forward",
      starting_price: 500,
      current_price: 1250,
      reserve_price: 800,
      buy_now_price: 2000,
      currency_code: "CRED",
      seller_name: "Vintage Collector",
      category_name: "Electronics",
      status: "active",
      start_time: new Date(Date.now() - 86400000 * 2).toISOString(),
      end_time: new Date(Date.now() + 86400000).toISOString(),
      total_bids: 23,
      unique_bidders: 8,
      is_featured: true,
    },
    {
      id: 2,
      title: "Web Development Project",
      description: "Looking for the best developer to build an e-commerce website",
      auction_type: "reverse",
      starting_price: 5000,
      current_price: 2800,
      currency_code: "CRED",
      seller_name: "TechStartup Inc",
      category_name: "Services",
      status: "active",
      start_time: new Date(Date.now() - 86400000).toISOString(),
      end_time: new Date(Date.now() + 86400000 * 3).toISOString(),
      total_bids: 15,
      unique_bidders: 12,
      is_featured: false,
    },
    {
      id: 3,
      title: "Original Abstract Painting",
      description: "Hand-painted abstract artwork by emerging artist",
      auction_type: "forward",
      starting_price: 200,
      current_price: 450,
      reserve_price: 300,
      currency_code: "CRED",
      seller_name: "Art Gallery",
      category_name: "Art & Collectibles",
      status: "active",
      start_time: new Date(Date.now() - 86400000 * 3).toISOString(),
      end_time: new Date(Date.now() + 86400000 * 2).toISOString(),
      total_bids: 12,
      unique_bidders: 7,
      is_featured: false,
    },
    {
      id: 4,
      title: "Gaming Laptop - High Performance",
      description: "Latest gaming laptop with RTX 4080 and 32GB RAM",
      auction_type: "forward",
      starting_price: 1000,
      current_price: 1850,
      buy_now_price: 2500,
      currency_code: "CRED",
      seller_name: "Tech Reseller",
      category_name: "Electronics",
      status: "active",
      start_time: new Date(Date.now() - 86400000).toISOString(),
      end_time: new Date(Date.now() + 86400000 * 4).toISOString(),
      total_bids: 31,
      unique_bidders: 15,
      is_featured: true,
    },
    {
      id: 5,
      title: "Logo Design Contest",
      description: "Need a professional logo for my new business",
      auction_type: "reverse",
      starting_price: 500,
      current_price: 150,
      currency_code: "CRED",
      seller_name: "New Business Owner",
      category_name: "Services",
      status: "active",
      start_time: new Date(Date.now() - 86400000 * 2).toISOString(),
      end_time: new Date(Date.now() + 86400000 * 5).toISOString(),
      total_bids: 8,
      unique_bidders: 8,
      is_featured: false,
    },
  ]

  const getActiveAuctions = () => filteredAuctions.filter((a) => a.status === "active")
  const getEndingSoonAuctions = () =>
    filteredAuctions
      .filter((a) => a.status === "active")
      .filter((a) => new Date(a.end_time).getTime() - Date.now() < 86400000) // Less than 24 hours

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading auctions...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Live Auctions</h1>
        <p className="text-muted-foreground">
          Discover amazing deals through competitive bidding. All transactions protected by CRED escrow.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Gavel className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{getActiveAuctions().length}</div>
            <div className="text-sm text-muted-foreground">Live Auctions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{getEndingSoonAuctions().length}</div>
            <div className="text-sm text-muted-foreground">Ending Soon</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{filteredAuctions.reduce((sum, a) => sum + a.total_bids, 0)}</div>
            <div className="text-sm text-muted-foreground">Total Bids</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{filteredAuctions.filter((a) => a.buy_now_price).length}</div>
            <div className="text-sm text-muted-foreground">Buy It Now</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search auctions..."
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
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="art & collectibles">Art & Collectibles</SelectItem>
            <SelectItem value="services">Services</SelectItem>
          </SelectContent>
        </Select>

        <Select value={auctionType} onValueChange={setAuctionType}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Auction Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="forward">Forward Auction</SelectItem>
            <SelectItem value="reverse">Reverse Auction</SelectItem>
            <SelectItem value="dutch">Dutch Auction</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ending_soon">Ending Soon</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
            <SelectItem value="most_bids">Most Bids</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Auction Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Auctions</TabsTrigger>
          <TabsTrigger value="ending_soon">Ending Soon</TabsTrigger>
          <TabsTrigger value="forward">Forward</TabsTrigger>
          <TabsTrigger value="reverse">Reverse</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} isAuthenticated={isAuthenticated} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ending_soon" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getEndingSoonAuctions().map((auction) => (
              <AuctionCard key={auction.id} auction={auction} isAuthenticated={isAuthenticated} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forward" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions
              .filter((a) => a.auction_type === "forward")
              .map((auction) => (
                <AuctionCard key={auction.id} auction={auction} isAuthenticated={isAuthenticated} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="reverse" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions
              .filter((a) => a.auction_type === "reverse")
              .map((auction) => (
                <AuctionCard key={auction.id} auction={auction} isAuthenticated={isAuthenticated} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* No Results */}
      {filteredAuctions.length === 0 && (
        <div className="text-center py-12">
          <Gavel className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No auctions found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search criteria or check back later.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("")
              setSelectedCategory("all")
              setAuctionType("all")
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
            <h3 className="text-xl font-semibold mb-2">Want to start an auction?</h3>
            <p className="text-muted-foreground mb-4">
              Reach more buyers and get the best price for your items through competitive bidding.
            </p>
            <Button asChild>
              <Link href="/seller/auctions/new">Create Auction</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
