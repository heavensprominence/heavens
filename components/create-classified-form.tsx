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
import { WORLD_CURRENCIES } from "@/lib/currencies"
import { X, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export function CreateClassifiedForm() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    currency: "USD-CRED",
    type: "for_sale",
    location: "",
    category: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/classifieds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number.parseFloat(formData.price),
          images,
        }),
      })

      if (response.ok) {
        toast({
          title: "Listing Created!",
          description: "Your listing has been posted successfully.",
        })
        router.push("/classifieds")
      } else {
        throw new Error("Failed to create listing")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
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
        <CardTitle>Listing Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Listing Type */}
          <div>
            <Label>Listing Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
              className="flex gap-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="for_sale" id="for_sale" />
                <Label htmlFor="for_sale">For Sale</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wanted" id="wanted" />
                <Label htmlFor="wanted">Wanted</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="What are you selling/looking for?"
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
              placeholder="Provide details about the item..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          {/* Price and Currency */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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

          {/* Location */}
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

          {/* Category */}
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="vehicles">Vehicles</SelectItem>
                <SelectItem value="real-estate">Real Estate</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="tools">Tools</SelectItem>
                <SelectItem value="art">Art</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
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
              {loading ? "Creating..." : "Create Listing"}
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
