"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"
import { Wallet, TrendingUp, ShoppingCart, Gavel, Gift } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalTransactions: 0,
    activeListings: 0,
    completedTrades: 0,
    referrals: 0,
  })

  useEffect(() => {
    if (user) {
      // Load user stats from localStorage
      const userStats = localStorage.getItem(`user_stats_${user.id}`)
      if (userStats) {
        setStats(JSON.parse(userStats))
      }
    }
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Please sign in to access your dashboard</h1>
          <Link href="/auth/signin">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-400">Manage your CRED, trades, and marketplace activities</p>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">CRED Balance</CardTitle>
              <Wallet className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₡{user.credBalance.toLocaleString()}</div>
              <p className="text-xs text-gray-500">≈ ${(user.credBalance * 0.001).toFixed(2)} USD</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Transactions</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalTransactions}</div>
              <p className="text-xs text-gray-500">All time</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Active Listings</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeListings}</div>
              <p className="text-xs text-gray-500">In marketplace</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Completed Trades</CardTitle>
              <Gavel className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.completedTrades}</div>
              <p className="text-xs text-gray-500">Successful deals</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-yellow-500" />
                Wallet Management
              </CardTitle>
              <CardDescription className="text-gray-400">
                Send, receive, and convert CRED to other currencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/wallet">
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900">Open Wallet</Button>
                </Link>
                <Link href="/wallet/convert">
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                    Convert Currency
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5 text-blue-500" />
                Marketplace
              </CardTitle>
              <CardDescription className="text-gray-400">Buy, sell, and trade items with other users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/marketplace">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">Browse Marketplace</Button>
                </Link>
                <Link href="/marketplace/sell">
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                    List Item for Sale
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Gavel className="mr-2 h-5 w-5 text-purple-500" />
                Auctions
              </CardTitle>
              <CardDescription className="text-gray-400">Participate in forward and reverse auctions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/auctions">
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">View Auctions</Button>
                </Link>
                <Link href="/auctions/create">
                  <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-700">
                    Create Auction
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-gray-400">Your latest transactions and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center">
                  <Gift className="h-5 w-5 text-yellow-500 mr-3" />
                  <div>
                    <p className="text-white font-medium">Registration Bonus Received</p>
                    <p className="text-sm text-gray-400">Welcome to HeavensLive!</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-500 font-medium">+₡{user.credBalance.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>

              <div className="text-center py-8">
                <p className="text-gray-500">No other activities yet. Start trading to see more!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
