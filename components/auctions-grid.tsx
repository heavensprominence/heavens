"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users, TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react"
import type { Auction } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

export function AuctionsGrid() {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAuctions()

    // Set up real-time updates
    const interval = setInterval(fetchAuctions, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchAuctions = async () => {
    try {
      const response = await fetch("/api/auctions")
      if (response.ok) {
        const data = await response.json()
        setAuctions(data.auctions || [])
      }
    } catch (error) {
      console.error("Failed to fetch auctions:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-t-lg" />
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-3 bg-muted rounded mb-4" />
              <div className="h-6 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (auctions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔨</div>
        <h3 className="text-xl font-semibold mb-2">No auctions yet</h3>
        <p className="text-muted-foreground mb-4">Be the first to start an auction!</p>
        <Button asChild>
          <Link href="/auctions/create">Create First Auction</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {auctions.map((auction) => (
        <Card key={auction.id} className="hover:shadow-lg transition-shadow">
          <div className="relative">
            <img
              src={auction.images[0] || "/placeholder.svg?height=200&width=300"}
              alt={auction.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="absolute top-2 left-2 flex gap-2">
              <Badge variant={auction.type === "forward" ? "default" : "secondary"}>
                {auction.type === "forward" ? (
                  <>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Forward
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 mr-1" />
                    Reverse
                  </>
                )}
              </Badge>
              <Badge variant="outline" className="bg-white/90">
                {auction.bidsVisible ? (
                  <>
                    <Eye className="h-3 w-3 mr-1" />
                    Public
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3 w-3 mr-1" />
                    Private
                  </>
                )}
              </Badge>
            </div>
            <div className="absolute top-2 right-2">
              <Badge variant={auction.status === "active" ? "default" : "secondary"}>{auction.status}</Badge>
            </div>
          </div>

          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{auction.title}</h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{auction.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Starting Price:</span>
                <span className="font-semibold">
                  {auction.startingPrice.toLocaleString()} {auction.currency}
                </span>
              </div>
              {auction.reservePrice && (
                <div className="flex justify-between text-sm">
                  <span>Reserve:</span>
                  <span className="font-semibold">
                    {auction.reservePrice.toLocaleString()} {auction.currency}
                  </span>
                </div>
              )}
              {auction.buyNowPrice && (
                <div className="flex justify-between text-sm">
                  <span>Buy Now:</span>
                  <span className="font-semibold text-green-600">
                    {auction.buyNowPrice.toLocaleString()} {auction.currency}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  {auction.status === "active"
                    ? `Ends ${formatDistanceToNow(new Date(auction.endsAt), { addSuffix: true })}`
                    : `Ended ${formatDistanceToNow(new Date(auction.endsAt), { addSuffix: true })}`}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>0 bids</span>
              </div>
            </div>

            <Button asChild className="w-full">
              <Link href={`/auctions/${auction.id}`}>{auction.status === "active" ? "Place Bid" : "View Results"}</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
