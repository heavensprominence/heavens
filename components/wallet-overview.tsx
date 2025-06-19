"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, TrendingUp, Gift, Users } from "lucide-react"
import { useAuth } from "@/components/auth-context"

export function WalletOverview() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CRED Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{user.credBalance.toFixed(2)} CRED</div>
          <p className="text-xs text-muted-foreground">≈ ${user.credBalance.toFixed(2)} USD</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Join Number</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">#{user.joinNumber.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Early adopter status</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Registration Bonus</CardTitle>
          <Gift className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">Claimed</div>
          <p className="text-xs text-muted-foreground">Welcome bonus received</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Account Status</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="default">Active</Badge>
            <Badge variant="secondary">{user.role}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">All features available</p>
        </CardContent>
      </Card>
    </div>
  )
}
