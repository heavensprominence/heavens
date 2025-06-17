"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, ShoppingBag, TrendingUp, HandHeart, Globe } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/i18n-context"

export default function HomePage() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <Badge variant="outline" className="mb-4 border-blue-500 text-blue-400">
              🌍 Global Platform • 195+ Countries
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">{t("home.welcome")}</h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">{t("home.subtitle")}</p>
          </div>

          {/* Registration Bonus Card */}
          <Card className="max-w-md mx-auto mb-12 bg-gradient-to-r from-blue-600 to-purple-600 border-0">
            <CardContent className="p-6 text-center">
              <Coins className="h-12 w-12 text-white mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">{t("home.registrationBonus")}</h3>
              <div className="text-4xl font-bold text-white mb-4">{t("home.credAmount")}</div>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link href="/auth/signup">{t("home.getStarted")}</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
              <CardContent className="p-6 text-center">
                <ShoppingBag className="h-8 w-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{t("home.features.marketplace")}</h3>
                <p className="text-gray-400 text-sm">Buy and sell globally with CRED</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
              <CardContent className="p-6 text-center">
                <Globe className="h-8 w-8 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{t("home.features.currencies")}</h3>
                <p className="text-gray-400 text-sm">Universal CRED parity system</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{t("home.features.trading")}</h3>
                <p className="text-gray-400 text-sm">Advanced trading platform</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors">
              <CardContent className="p-6 text-center">
                <HandHeart className="h-8 w-8 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{t("home.features.grants")}</h3>
                <p className="text-gray-400 text-sm">Islamic-compliant financing</p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">195+</div>
              <div className="text-gray-400">Countries Supported</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1M+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">$50B+</div>
              <div className="text-gray-400">Transaction Volume</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
