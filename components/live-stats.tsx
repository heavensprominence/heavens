"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, TrendingUp, Coins, Globe } from "lucide-react"

export function LiveStats() {
  const [stats, setStats] = useState({
    users: 12847,
    transactions: 89234,
    volume: 2847392,
    currencies: 180,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        users: prev.users + Math.floor(Math.random() * 3) + 1,
        transactions: prev.transactions + Math.floor(Math.random() * 8) + 2,
        volume: prev.volume + Math.floor(Math.random() * 5000) + 1000,
        currencies: 180,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 px-4 bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Live Platform Statistics</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{stats.users.toLocaleString()}</div>
              <div className="text-gray-400">Active Users</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{stats.transactions.toLocaleString()}</div>
              <div className="text-gray-400">Transactions</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-6 text-center">
              <Coins className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">₡{stats.volume.toLocaleString()}</div>
              <div className="text-gray-400">CRED Volume</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-6 text-center">
              <Globe className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{stats.currencies}+</div>
              <div className="text-gray-400">Currencies</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
