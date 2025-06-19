"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Coins } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-context"

export function Hero() {
  const { user } = useAuth()

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
      <div className="container mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
          <Coins className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Heavenslive</h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          The world's most transparent financial platform with CRED currency and fair marketplace
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {user ? (
            <Button size="lg" asChild>
              <Link href="/wallet">
                View Wallet
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button size="lg" asChild>
              <Link href="/auth/signin">
                Get Started & Claim Bonus
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
          <Button variant="outline" size="lg" asChild>
            <Link href="/currencies">Explore CRED</Link>
          </Button>
        </div>

        {user && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-muted-foreground mb-2">Welcome back, Joiner #{user.joinNumber}</p>
            <p className="text-2xl font-bold text-primary">{user.credBalance.toFixed(2)} CRED</p>
          </div>
        )}
      </div>
    </section>
  )
}
