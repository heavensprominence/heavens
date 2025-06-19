"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Coins, ShoppingCart, Gavel, TrendingUp, Wallet, Gift, Shield, BarChart3, Users } from "lucide-react"

const features = [
  {
    icon: Coins,
    title: "CRED Currency",
    description: "Universal stable coin backed by 180+ global currencies",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: ShoppingCart,
    title: "Classifieds",
    description: "Buy and sell anything with CRED payments",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Gavel,
    title: "Auctions",
    description: "Forward and reverse auctions with smart contracts",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: TrendingUp,
    title: "Trading",
    description: "Real-time currency trading with zero fees",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Wallet,
    title: "Multi-Wallet",
    description: "Secure wallets for all 180+ supported currencies",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Gift,
    title: "Registration Bonus",
    description: "Get up to ₡15,000 CRED for joining early",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    icon: Shield,
    title: "Public Ledger",
    description: "Transparent blockchain-based transaction history",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Advanced trading charts and market analysis",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with traders and marketplace users",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
]

export function Features() {
  return (
    <section className="py-16 px-4 bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Platform Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-700 border-gray-600 hover:bg-gray-650 transition-colors">
              <CardContent className="p-6">
                <div className={`${feature.bgColor} p-3 rounded-lg w-fit mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-600">
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
