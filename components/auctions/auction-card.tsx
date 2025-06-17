"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Gavel, Clock, TrendingUp, TrendingDown, Zap, Eye, Users } from "lucide-react"

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

interface AuctionCardProps {
  auction: Auction
  isAuthenticated: boolean
}

export function AuctionCard({ auction, isAuthenticated }: AuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState("")
  const [isWatching, setIsWatching] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const endTime = new Date(auction.end_time).getTime()
      const distance = endTime - now

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h`)
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m`)
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}m ${seconds}s`)
        } else {
          setTimeLeft(`${seconds}s`)
        }
      } else {
        setTimeLeft("Ended")
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [auction.end_time])

  const getAuctionTypeIcon = () => {
    switch (auction.auction_type) {
      case "forward":
        return <TrendingUp className="h-4 w-4" />
      case "reverse":
        return <TrendingDown className="h-4 w-4" />
      case "dutch":
        return <Clock className="h-4 w-4" />
      default:
        return <Gavel className="h-4 w-4" />
    }
  }

  const getAuctionTypeColor = () => {
    switch (auction.auction_type) {
      case "forward":
        return "bg-green-100 text-green-800"
      case "reverse":
        return "bg-blue-100 text-blue-800"
      case "dutch":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTimeLeftColor = () => {
    const now = new Date().getTime()
    const endTime = new Date(auction.end_time).getTime()
    const hoursLeft = (endTime - now) / (1000 * 60 * 60)

    if (hoursLeft < 1) return "text-red-600"
    if (hoursLeft < 24) return "text-orange-600"
    return "text-muted-foreground"
  }

  const getProgressPercentage = () => {
    const now = new Date().getTime()
    const startTime = new Date(auction.start_time).getTime()
    const endTime = new Date(auction.end_time).getTime()
    const totalDuration = endTime - startTime
    const elapsed = now - startTime

    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100)
  }

  const handleWatchAuction = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to watch auctions",
        variant: "destructive",
      })
      return
    }

    setIsWatching(!isWatching)
    toast({
      title: isWatching ? "Stopped watching" : "Now watching",
      description: `You will ${isWatching ? "no longer" : "now"} receive notifications about this auction`,
    })
  }

  const handleQuickBid = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to place bids",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Demo Mode",
      description: "Bidding functionality available with database setup",
      variant: "default",
    })
  }

  return (
    <Link href={`/auctions/${auction.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardHeader className="p-0">
          <div className="relative">
            <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
              {auction.image_url ? (
                <img
                  src={auction.image_url || "/placeholder.svg"}
                  alt={auction.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              ) : (
                <div className="text-muted-foreground">No Image Available</div>
              )}
            </div>

            {auction.is_featured && (
              <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600">Featured</Badge>
            )}

            <Badge className={`absolute top-2 right-2 ${getAuctionTypeColor()}`}>
              {getAuctionTypeIcon()}
              <span className="ml-1 capitalize">{auction.auction_type}</span>
            </Badge>

            {/* Time Left Overlay */}
            <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
              <Clock className="h-3 w-3 inline mr-1" />
              {timeLeft}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg line-clamp-2">{auction.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{auction.description}</p>
            </div>

            {/* Price Information */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {auction.auction_type === "reverse" ? "Lowest Bid" : "Current Bid"}
                </span>
                <span className="text-2xl font-bold text-primary">
                  {auction.current_price.toLocaleString()} {auction.currency_code}
                </span>
              </div>

              {auction.reserve_price && auction.auction_type === "forward" && (
                <div className="text-xs text-muted-foreground">
                  Reserve: {auction.reserve_price.toLocaleString()} {auction.currency_code}
                </div>
              )}

              {auction.buy_now_price && (
                <div className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-blue-500" />
                  <span className="text-sm text-blue-600">
                    Buy Now: {auction.buy_now_price.toLocaleString()} {auction.currency_code}
                  </span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <Progress value={getProgressPercentage()} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Started {new Date(auction.start_time).toLocaleDateString()}</span>
                <span className={getTimeLeftColor()}>{timeLeft}</span>
              </div>
            </div>

            {/* Auction Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Gavel className="h-3 w-3" />
                  {auction.total_bids} bids
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {auction.unique_bidders} bidders
                </div>
              </div>
              <Badge variant="secondary">{auction.category_name}</Badge>
            </div>

            {/* Seller Info */}
            <div className="text-sm text-muted-foreground">
              Seller: <span className="font-medium">{auction.seller_name}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1" onClick={handleQuickBid} disabled={auction.status !== "active"}>
                <Gavel className="h-4 w-4 mr-2" />
                {auction.auction_type === "reverse" ? "Submit Bid" : "Place Bid"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleWatchAuction}>
                <Eye className={`h-4 w-4 ${isWatching ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
