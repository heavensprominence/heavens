import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  CreditCard,
  ShoppingBag,
  Gavel,
  HandHeart,
  MessageSquare,
  TrendingUp,
  Globe,
  Shield,
  Zap,
  Database,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

async function getDashboardStats() {
  // In a real app, this would fetch from your database
  // For now, showing the structure with demo data
  return {
    totalUsers: 3,
    totalTransactions: 0,
    totalListings: 0,
    totalOrders: 0,
    totalAuctions: 0,
    supportedCountries: 195,
    supportedCurrencies: 12,
    systemHealth: 100,
  }
}

export default async function PlatformDashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Globe className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Heavenslive Platform</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Universal Global Commerce Platform - Connecting 8+ Billion People Through Inclusive Technology
          </p>
          <Badge className="bg-green-100 text-green-800 px-4 py-2">
            <CheckCircle className="h-4 w-4 mr-2" />
            Database Foundation Complete
          </Badge>
        </div>

        {/* System Status */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Database className="h-5 w-5" />
              Platform Status: OPERATIONAL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.systemHealth}%</div>
                <div className="text-sm text-green-700">System Health</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.supportedCountries}</div>
                <div className="text-sm text-blue-700">Countries Supported</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.supportedCurrencies}</div>
                <div className="text-sm text-purple-700">Currency Pairs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">9/9</div>
                <div className="text-sm text-orange-700">Database Scripts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Platform Features */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                User Management
              </CardTitle>
              <CardDescription>Global user base with role-based access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Users:</span>
                  <Badge>{stats.totalUsers}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Registration Bonuses:</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span>2FA Security:</span>
                  <Badge variant="outline">Available</Badge>
                </div>
              </div>
              <Button asChild className="w-full mt-4">
                <Link href="/admin/users">Manage Users</Link>
              </Button>
            </CardContent>
          </Card>

          {/* CRED Financial System */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                CRED Financial System
              </CardTitle>
              <CardDescription>Multi-currency digital wallet system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Transactions:</span>
                  <Badge>{stats.totalTransactions}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Auto Parity:</span>
                  <Badge variant="secondary">Owner Controlled</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Global Currencies:</span>
                  <Badge variant="outline">{stats.supportedCurrencies}</Badge>
                </div>
              </div>
              <Button asChild className="w-full mt-4">
                <Link href="/admin/cred">Manage CRED</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Global Marketplace */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-purple-600" />
                Global Marketplace
              </CardTitle>
              <CardDescription>Universal commerce platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Active Listings:</span>
                  <Badge>{stats.totalListings}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Orders:</span>
                  <Badge variant="secondary">{stats.totalOrders}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Escrow Protection:</span>
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>
              <Button asChild className="w-full mt-4">
                <Link href="/marketplace">Browse Marketplace</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Auction System */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-orange-600" />
                Auction System
              </CardTitle>
              <CardDescription>Real-time bidding platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Active Auctions:</span>
                  <Badge>{stats.totalAuctions}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Auto-bidding:</span>
                  <Badge variant="secondary">Available</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Categories:</span>
                  <Badge variant="outline">8</Badge>
                </div>
              </div>
              <Button asChild className="w-full mt-4">
                <Link href="/auctions">View Auctions</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Financial Assistance */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HandHeart className="h-5 w-5 text-red-600" />
                Financial Assistance
              </CardTitle>
              <CardDescription>Grants and loans system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Grant Applications:</span>
                  <Badge>0</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Active Loans:</span>
                  <Badge variant="secondary">0</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Max Grant:</span>
                  <Badge variant="outline">50K CRED</Badge>
                </div>
              </div>
              <Button asChild className="w-full mt-4">
                <Link href="/admin/financial">Manage Financial Aid</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Communication Hub */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-indigo-600" />
                Communication Hub
              </CardTitle>
              <CardDescription>Messages, support, and community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Support Tickets:</span>
                  <Badge>0</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Messages:</span>
                  <Badge variant="secondary">0</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Notifications:</span>
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>
              <Button asChild className="w-full mt-4">
                <Link href="/messages">Communication Center</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Global Reach */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Globe className="h-6 w-6" />
              Universal Global Access
            </CardTitle>
            <CardDescription className="text-blue-100">
              Breaking down barriers, connecting humanity through inclusive commerce
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">195+</div>
                <div className="text-sm text-blue-100">Countries Supported</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">8B+</div>
                <div className="text-sm text-blue-100">People Reached</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">100+</div>
                <div className="text-sm text-blue-100">Languages</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-blue-100">Global Operations</div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white/10 rounded-lg">
              <p className="text-sm">
                <strong>Inclusive Vision:</strong> Supporting all markets including Iran, North Korea, Cuba, and every
                nation on Earth. Technology should unite, not divide. Commerce should be universal, not restricted.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Button asChild size="lg" className="h-16">
            <Link href="/admin" className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Dashboard
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-16">
            <Link href="/admin/parity" className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Currency Parity Control
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-16">
            <Link href="/admin/analytics" className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              AI Analytics
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
