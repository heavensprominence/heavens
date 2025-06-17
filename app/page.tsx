"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useI18n } from "@/lib/i18n/i18n-context"
import { Coins, Globe, Shield, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t("home.welcome")}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto">{t("home.subtitle")}</p>

          {/* Registration Bonus Card */}
          <Card className="max-w-md mx-auto mb-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Coins className="h-8 w-8 text-blue-600 mr-2" />
                <span className="text-lg font-semibold">{t("home.registrationBonus")}</span>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{t("home.credAmount")}</div>
              <p className="text-sm text-muted-foreground">Bonus for next registration</p>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/auth/signup">{t("home.getStarted")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/signin">{t("nav.signIn")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t("home.features.marketplace")}</h3>
                <p className="text-muted-foreground">Buy and sell globally with CRED</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Coins className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t("home.features.currencies")}</h3>
                <p className="text-muted-foreground">Universal CRED parity system</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t("home.features.trading")}</h3>
                <p className="text-muted-foreground">Advanced trading platform</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t("home.features.grants")}</h3>
                <p className="text-muted-foreground">Islamic-compliant financing</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">195+</div>
              <div className="text-muted-foreground">Countries Supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">1M+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">$50B+</div>
              <div className="text-muted-foreground">Transaction Volume</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users already benefiting from our transparent financial platform
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Link href="/auth/signup">Create Your Free Account</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
