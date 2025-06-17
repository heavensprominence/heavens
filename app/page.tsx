"use client"

import { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PublicLedger } from "@/components/public-ledger"
import { SimpleAuthStatus } from "@/components/simple-auth-status"
import { EnvCheck } from "@/components/env-check"
import { Coins, ShoppingBag, Gavel, HandHeart, Shield, Globe, Zap, Users } from "lucide-react"

export default function HomePage() {
  const [showDevTools, setShowDevTools] = useState(false)

  useEffect(() => {
    // Check if we're in development by checking for localhost or development indicators
    const isDev =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.port === "3000"

    setShowDevTools(isDev)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Development Status - Only shown in development */}
      {showDevTools && (
        <div className="container mx-auto px-4 pt-4">
          <EnvCheck />
          <SimpleAuthStatus />
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-primary">Heavenslive</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            The world's most transparent financial platform featuring CRED cryptocurrency, global marketplace, and
            interest-free financial assistance.
          </p>

          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Coins className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold">Registration Bonus</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-3xl font-bold text-primary">10,000 CRED</div>
                  <div className="text-sm text-muted-foreground">Bonus for next registration</div>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Limited spots available</span>
                </div>

                <div className="text-xs bg-secondary/50 px-3 py-1 rounded-full">First Come, First Served</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Coins className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>CRED Currency</CardTitle>
                <CardDescription>
                  Fully transparent, environmentally friendly cryptocurrency with global parity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild>
                  <Link href="/trading">Start Trading</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <ShoppingBag className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Global Marketplace</CardTitle>
                <CardDescription>
                  Buy and sell goods and services worldwide with built-in escrow protection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild>
                  <Link href="/marketplace">Browse Listings</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Gavel className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Auction System</CardTitle>
                <CardDescription>
                  Forward and reverse auctions for competitive pricing and service procurement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild>
                  <Link href="/auctions">View Auctions</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <HandHeart className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Financial Assistance</CardTitle>
                <CardDescription>
                  Grants, interest-free loans, and competitive lending with transparent approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild>
                  <Link href="/financial">Apply Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Heavenslive?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Fully Transparent</h3>
              <p className="text-muted-foreground">
                Every transaction is recorded on our public ledger. No hidden fees, no surprises.
              </p>
            </div>
            <div className="text-center">
              <Globe className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
              <p className="text-muted-foreground">
                Trade with anyone, anywhere. Multi-currency support with real-time parity.
              </p>
            </div>
            <div className="text-center">
              <Zap className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Instant transactions, real-time updates, and immediate confirmations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Public Ledger Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Public Transaction Ledger</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Complete transparency - view all platform transactions in real-time. Privacy is maintained while ensuring
              full accountability.
            </p>
          </div>

          <Suspense fallback={<div className="text-center">Loading transactions...</div>}>
            <PublicLedger />
          </Suspense>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users already benefiting from our transparent financial platform
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/signup">Create Your Free Account</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
