"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Clock, Star } from "lucide-react"
import type { ClassifiedListing } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

export function ClassifiedsGrid() {
  const [listings, setListings] = useState<ClassifiedListing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const response = await fetch("/api/classifieds")
      if (response.ok) {
        const data = await response.json()
        setListings(data.listings || [])
      }
    } catch (error) {
      console.error("Failed to fetch listings:", error)
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

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold mb-2">No listings yet</h3>
        <p className="text-muted-foreground mb-4">Be the first to post something for sale!</p>
        <Button asChild>
          <Link href="/classifieds/create">Create First Listing</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <Card key={listing.id} className="hover:shadow-lg transition-shadow group">
          <div className="relative">
            <img
              src={listing.images[0] || "/placeholder.svg?height=200&width=300"}
              alt={listing.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="absolute top-2 left-2">
              <Badge variant={listing.type === "for_sale" ? "default" : "secondary"}>
                {listing.type === "for_sale" ? "For Sale" : "Wanted"}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
              {listing.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{listing.rating}</span>
                </div>
              )}
            </div>

            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{listing.description}</p>

            <div className="flex items-center justify-between mb-3">
              <div className="text-2xl font-bold text-primary">
                {listing.price.toLocaleString()} {listing.currency}
              </div>
              <Badge variant="outline" className={listing.status === "active" ? "text-green-600" : ""}>
                {listing.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{listing.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}</span>
              </div>
            </div>

            <Button asChild className="w-full">
              <Link href={`/classifieds/${listing.id}`}>
                {listing.type === "for_sale" ? "View Details" : "Make Offer"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
