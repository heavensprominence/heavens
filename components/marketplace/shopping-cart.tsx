"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/components/simple-auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Plus, Minus, Trash2, CreditCard } from "lucide-react"

interface CartItem {
  id: number
  product_id: number
  product_title: string
  product_price: number
  currency_code: string
  quantity: number
  seller_name: string
  image_url?: string
}

export function ShoppingCartComponent() {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartItems()
    }
  }, [isAuthenticated])

  const fetchCartItems = async () => {
    try {
      const response = await fetch("/api/marketplace/cart")
      if (response.ok) {
        const data = await response.json()
        setCartItems(data.items || [])
      }
    } catch (error) {
      console.error("Error fetching cart:", error)
      // Demo cart items
      setCartItems([
        {
          id: 1,
          product_id: 1,
          product_title: "Professional Camera Kit",
          product_price: 1250,
          currency_code: "CRED",
          quantity: 1,
          seller_name: "PhotoPro Store",
        },
        {
          id: 2,
          product_id: 2,
          product_title: "Vintage Leather Jacket",
          product_price: 180,
          currency_code: "CRED",
          quantity: 2,
          seller_name: "Vintage Finds",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      const response = await fetch("/api/marketplace/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      })

      if (response.ok) {
        setCartItems((items) => items.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
      }
    } catch (error) {
      toast({
        title: "Demo Mode",
        description: "Cart updates available with database setup",
        variant: "default",
      })
    }
  }

  const removeItem = async (itemId: number) => {
    try {
      const response = await fetch("/api/marketplace/cart/remove", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      })

      if (response.ok) {
        setCartItems((items) => items.filter((item) => item.id !== itemId))
        toast({
          title: "Item removed",
          description: "Item has been removed from your cart",
        })
      }
    } catch (error) {
      setCartItems((items) => items.filter((item) => item.id !== itemId))
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      })
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product_price * item.quantity, 0)
  }

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to checkout",
        variant: "destructive",
      })
      return
    }

    setIsCheckingOut(true)

    try {
      const response = await fetch("/api/marketplace/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      })

      if (response.ok) {
        toast({
          title: "Order placed!",
          description: "Your order has been placed successfully",
        })
        setCartItems([])
      }
    } catch (error) {
      toast({
        title: "Demo Mode",
        description: "Checkout functionality available with database setup",
        variant: "default",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="h-12 w-12 text-muted-foreground mx-auto mb-4">Cart</div>
          <h3 className="text-lg font-semibold mb-2">Sign in to view your cart</h3>
          <p className="text-muted-foreground">Please sign in to add items to your cart and checkout.</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div>Loading cart...</div>
        </CardContent>
      </Card>
    )
  }

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="h-12 w-12 text-muted-foreground mx-auto mb-4">Cart</div>
          <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground mb-4">Add some items to your cart to get started.</p>
          <Button asChild>
            <a href="/marketplace">Continue Shopping</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="h-5 w-5">Cart</div>
          Shopping Cart ({cartItems.length} items)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
              {item.image_url ? (
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.product_title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-xs text-muted-foreground">No Image</div>
              )}
            </div>

            <div className="flex-1">
              <h4 className="font-semibold">{item.product_title}</h4>
              <p className="text-sm text-muted-foreground">{item.seller_name}</p>
              <p className="font-semibold text-primary">
                {item.product_price.toLocaleString()} {item.currency_code}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{item.quantity}</span>
              <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-right">
              <div className="font-semibold">
                {(item.product_price * item.quantity).toLocaleString()} {item.currency_code}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <Separator />

        <div className="space-y-4">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total:</span>
            <span className="text-primary">{calculateTotal().toLocaleString()} CRED</span>
          </div>

          <div className="space-y-2">
            <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isCheckingOut}>
              <CreditCard className="h-4 w-4 mr-2" />
              {isCheckingOut ? "Processing..." : "Checkout with CRED"}
            </Button>

            <div className="text-xs text-center text-muted-foreground">
              🔒 Secured by CRED Escrow • Buyer Protection Guaranteed
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
