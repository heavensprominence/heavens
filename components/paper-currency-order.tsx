"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { WORLD_CURRENCIES } from "@/lib/currencies"
import { Banknote, Truck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function PaperCurrencyOrder() {
  const { toast } = useToast()
  const [orderData, setOrderData] = useState({
    currency: "",
    denominations: "",
    quantity: "",
    shippingAddress: "",
    specialInstructions: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // In a real implementation, this would submit to your backend
    toast({
      title: "Order Submitted!",
      description: "Your paper currency order has been submitted. You'll receive a confirmation email shortly.",
    })

    // Reset form
    setOrderData({
      currency: "",
      denominations: "",
      quantity: "",
      shippingAddress: "",
      specialInstructions: "",
    })
  }

  const currencyDesigns = [
    {
      code: "USD-CRED",
      image: "/placeholder.svg?height=200&width=400",
      description: "Features liberty bell and eagle motifs in blue and green",
    },
    {
      code: "EUR-CRED",
      image: "/placeholder.svg?height=200&width=400",
      description: "Classical architecture and stars design in purple and gold",
    },
    {
      code: "GBP-CRED",
      image: "/placeholder.svg?height=200&width=400",
      description: "Crown and rose motifs in traditional British colors",
    },
    {
      code: "CAD-CRED",
      image: "/placeholder.svg?height=200&width=400",
      description: "Maple leaf and mountain designs in red and white",
    },
    {
      code: "JPY-CRED",
      image: "/placeholder.svg?height=200&width=400",
      description: "Cherry blossom and traditional patterns in elegant pastels",
    },
    {
      code: "AUD-CRED",
      image: "/placeholder.svg?height=200&width=400",
      description: "Kangaroo and Southern Cross in earth tones",
    },
  ]

  return (
    <section className="mb-16">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5" />
            Paper Currency Orders
          </CardTitle>
          <p className="text-muted-foreground">
            Order physical CRED currency notes shipped worldwide - completely free shipping!
          </p>
        </CardHeader>
        <CardContent>
          {/* Currency Design Gallery */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Currency Designs</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currencyDesigns.map((design) => (
                <Card key={design.code} className="overflow-hidden">
                  <img
                    src={design.image || "/placeholder.svg"}
                    alt={`${design.code} design`}
                    className="w-full h-32 object-cover"
                  />
                  <CardContent className="p-3">
                    <h4 className="font-semibold text-sm">{design.code}</h4>
                    <p className="text-xs text-muted-foreground">{design.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="currency">Currency Type</Label>
                <Select
                  value={orderData.currency}
                  onValueChange={(value) => setOrderData({ ...orderData, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency to order" />
                  </SelectTrigger>
                  <SelectContent>
                    {WORLD_CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={`${currency.code}-CRED`}>
                        {currency.emoji} {currency.code}-CRED ({currency.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="denominations">Denominations Wanted</Label>
                <Input
                  id="denominations"
                  placeholder="e.g., 1, 5, 10, 20, 50, 100"
                  value={orderData.denominations}
                  onChange={(e) => setOrderData({ ...orderData, denominations: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="quantity">Quantity of Each</Label>
                <Input
                  id="quantity"
                  placeholder="e.g., 10 of each denomination"
                  value={orderData.quantity}
                  onChange={(e) => setOrderData({ ...orderData, quantity: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="shippingAddress">Shipping Address</Label>
                <Textarea
                  id="shippingAddress"
                  placeholder="Full shipping address including postal code and country"
                  value={orderData.shippingAddress}
                  onChange={(e) => setOrderData({ ...orderData, shippingAddress: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
              <Textarea
                id="specialInstructions"
                placeholder="Any special requests or delivery instructions"
                value={orderData.specialInstructions}
                onChange={(e) => setOrderData({ ...orderData, specialInstructions: e.target.value })}
              />
            </div>

            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800 dark:text-green-400">Free Worldwide Shipping</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                All paper currency orders ship completely free worldwide. Processing time is 5-10 business days.
              </p>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Submit Order (Free Shipping)
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
