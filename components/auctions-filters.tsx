"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { WORLD_CURRENCIES } from "@/lib/currencies"
import { Search, Filter } from "lucide-react"

export function AuctionsFilters() {
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    currency: "all",
    location: "",
    priceRange: [0, 10000],
    status: "active",
    bidsVisible: "all",
  })

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div>
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search auctions..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Auction Type */}
        <div>
          <Label>Auction Type</Label>
          <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="forward">Forward Auction</SelectItem>
              <SelectItem value="reverse">Reverse Auction</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Currency */}
        <div>
          <Label>Currency</Label>
          <Select value={filters.currency} onValueChange={(value) => setFilters({ ...filters, currency: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Currencies</SelectItem>
              {WORLD_CURRENCIES.slice(0, 10).map((currency) => (
                <SelectItem key={currency.code} value={`${currency.code}-CRED`}>
                  {currency.emoji} {currency.code}-CRED
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City, State, Country"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
        </div>

        {/* Price Range */}
        <div>
          <Label>Price Range</Label>
          <div className="px-2 py-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
              max={10000}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{filters.priceRange[0]} CRED</span>
              <span>{filters.priceRange[1]} CRED</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <Label>Status</Label>
          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="ended">Ended</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bid Visibility */}
        <div>
          <Label>Bid Visibility</Label>
          <Select value={filters.bidsVisible} onValueChange={(value) => setFilters({ ...filters, bidsVisible: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Auctions</SelectItem>
              <SelectItem value="public">Public Bids</SelectItem>
              <SelectItem value="private">Private Bids</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Apply Filters */}
        <Button className="w-full">Apply Filters</Button>
        <Button variant="outline" className="w-full">
          Clear All
        </Button>
      </CardContent>
    </Card>
  )
}
