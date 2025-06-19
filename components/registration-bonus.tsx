"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Star, Users, TrendingUp } from "lucide-react"
import { useAuth } from "@/components/auth-context"
import Link from "next/link"

export function RegistrationBonus() {
  const { user } = useAuth()

  if (user) {
    return null // Don't show bonus to logged-in users
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <Card className="max-w-4xl mx-auto border-2 border-primary/20 shadow-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">🎉 Registration Bonus Available!</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Join Heavenslive today and receive your welcome bonus
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full mb-3">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Current Bonus</h3>
                <p className="text-2xl font-bold text-green-600">15,000 CRED</p>
                <p className="text-sm text-muted-foreground">For joiner #1</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Join Number</h3>
                <p className="text-2xl font-bold text-blue-600">#1</p>
                <p className="text-sm text-muted-foreground">Your position in line</p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Instant Access</h3>
                <p className="text-2xl font-bold text-purple-600">FREE</p>
                <p className="text-sm text-muted-foreground">No fees, no catches</p>
              </div>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                asChild
              >
                <Link href="/auth/signin">
                  Claim Your 15,000 CRED Bonus
                  <Gift className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                * Bonus automatically deposited upon registration. Early joiners get higher bonuses!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
