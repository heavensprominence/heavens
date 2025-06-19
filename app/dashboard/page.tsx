"use client"

import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Wallet, TrendingUp, Globe } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div className="h-8 w-8 bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-gray-600 flex items-center justify-center rounded-full mx-auto mb-2">
                <span className="text-xs font-bold text-gray-300">₡</span>
              </div>
              <h2 className="text-xl font-bold">HeavensLive</h2>
            </div>
            <p className="mb-4">Please sign in to access your dashboard.</p>
            <Link href="/auth/signin">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Here's your HeavensLive dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline">{user.role}</Badge>
          <Button variant="outline" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CRED Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₡{user.credBalance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">Account verified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Registration bonus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Reach</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">180+</div>
            <p className="text-xs text-muted-foreground">CRED currencies</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/wallet">
              <Button className="w-full" variant="outline">
                Manage Wallet
              </Button>
            </Link>
            <Link href="/classifieds">
              <Button className="w-full" variant="outline">
                Browse Marketplace
              </Button>
            </Link>
            <Link href="/auctions">
              <Button className="w-full" variant="outline">
                View Auctions
              </Button>
            </Link>
            <Link href="/currencies">
              <Button className="w-full" variant="outline">
                CRED Currencies
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest transactions and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Registration Bonus</p>
                  <p className="text-sm text-muted-foreground">Welcome to HeavensLive</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+₡{user.credBalance}</p>
                  <p className="text-xs text-muted-foreground">Account created</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
