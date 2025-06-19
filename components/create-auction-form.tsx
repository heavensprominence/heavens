"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { WORLD_CURRENCIES } from "@/lib/currencies"
import { X, Plus, TrendingUp, TrendingDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function CreateAuctionForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "forward",
    startingPrice: "",
    reservePrice: "",
    buyNowPrice: "",
    currency: "USD-CRED",
    duration: "7",
    location: "",
    bidsVisible: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/auctions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          startingPrice: Number.parseFloat(formData.startingPrice),
          reservePrice: formData.reservePrice ? Number.parseFloat(formData.reservePrice) : null,
          buyNowPrice: formData.buyNowPrice ? Number.parseFloat(formData.buyNowPrice) : null,
          duration: Number.parseInt(formData.duration),
          images,
        }),
      })

      if (response.ok) {
        toast({
          title: "Auction Created!",
          description: "Your auction has been posted successfully.",
        })
        router.push("/auctions")
      } else {
        throw new Error("Failed to create auction")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create auction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addImagePlaceholder = () => {
    if (images.length < 5) {
      setImages([...images, `/placeholder.svg?height=200&width=300&text=Image ${images.length + 1}`])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Auction Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Auction Type */}
          <div>
            <Label>Auction Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="forward" id="forward" />
                <Label htmlFor="forward" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Forward Auction (Highest bid wins)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reverse" id="reverse" />
                <Label htmlFor="reverse" className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4" />
                  Reverse Auction (Lowest bid wins)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="What are you auctioning?"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Provide details about the item or service..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startingPrice">
                {formData.type === "forward" ? "Starting Price *" : "Maximum Budget *"}
              </Label>
              <Input
                id="startingPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.startingPrice}
                onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WORLD_CURRENCIES.slice(0, 10).map((currency) => (
                    <SelectItem key={currency.code} value={`${currency.code}-CRED`}>
                      {currency.emoji} {currency.code}-CRED
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Optional Pricing */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="reservePrice">
                {formData.type === "forward" ? "Reserve Price (Optional)" : "Minimum Budget (Optional)"}
              </Label>
              <Input
                id="reservePrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.reservePrice}
                onChange={(e) => setFormData({ ...formData, reservePrice: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="buyNowPrice">Buy Now Price (Optional)</Label>
              <Input
                id="buyNowPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.buyNowPrice}
                onChange={(e) => setFormData({ ...formData, buyNowPrice: e.target.value })}
              />
            </div>
          </div>

          {/* Duration and Location */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (Days) *</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData({ ...formData, duration: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Day</SelectItem>
                  <SelectItem value="3">3 Days</SelectItem>
                  <SelectItem value="5">5 Days</SelectItem>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="10">10 Days</SelectItem>
                  <SelectItem value="14">14 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="City, State, Country"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Bid Visibility */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="bidsVisible"
              checked={formData.bidsVisible}
              onCheckedChange={(checked) => setFormData({ ...formData, bidsVisible: checked as boolean })}
            />
            <Label htmlFor="bidsVisible">Make bids visible to all participants</Label>
          </div>

          {/* Images */}
          <div>
            <Label>Images (up to 5)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {images.length < 5 && (
                <Button type="button" variant="outline" className="h-32 border-dashed" onClick={addImagePlaceholder}>
                  <div className="text-center">
                    <Plus className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm">Add Image</span>
                  </div>
                </Button>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Creating..." : "Create Auction"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
