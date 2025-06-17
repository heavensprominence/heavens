import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { sql } from "@/lib/db"
import { Coins, TrendingUp, TrendingDown, DollarSign } from "lucide-react"

async function getCREDStats() {
  try {
    // Get total CRED in circulation by currency
    const circulation = await sql`
      SELECT 
        currency_code,
        SUM(balance) as total_balance,
        COUNT(DISTINCT user_id) as holders
      FROM wallets 
      WHERE balance > 0
      GROUP BY currency_code
      ORDER BY total_balance DESC
    `

    // Get recent minting/burning activity
    const recentActivity = await sql`
      SELECT 
        transaction_type,
        amount,
        currency_code,
        description,
        created_at
      FROM transactions 
      WHERE transaction_type IN ('minting', 'burning')
      ORDER BY created_at DESC
      LIMIT 10
    `

    // Get total minted vs burned
    const mintBurnStats = await sql`
      SELECT 
        SUM(CASE WHEN transaction_type = 'minting' THEN amount ELSE 0 END) as total_minted,
        SUM(CASE WHEN transaction_type = 'burning' THEN amount ELSE 0 END) as total_burned
      FROM transactions 
      WHERE transaction_type IN ('minting', 'burning')
    `

    return {
      circulation,
      recentActivity,
      mintBurnStats: mintBurnStats[0] || { total_minted: 0, total_burned: 0 },
    }
  } catch (error) {
    console.error("Error fetching CRED stats:", error)
    return {
      circulation: [],
      recentActivity: [],
      mintBurnStats: { total_minted: 0, total_burned: 0 },
    }
  }
}

export async function CREDStats() {
  const stats = await getCREDStats()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            CRED Circulation
          </CardTitle>
          <CardDescription>Total CRED tokens in circulation by currency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.circulation.map((currency: any) => (
              <div key={currency.currency_code} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{currency.currency_code}</p>
                  <p className="text-sm text-muted-foreground">{currency.holders} holders</p>
                </div>
                <Badge variant="secondary">{Number(currency.total_balance).toLocaleString()}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Mint/Burn Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Minted</p>
                <p className="font-bold">{Number(stats.mintBurnStats.total_minted).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Burned</p>
                <p className="font-bold">{Number(stats.mintBurnStats.total_burned).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.recentActivity.map((activity: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 text-sm">
                <div className="flex items-center gap-2">
                  {activity.transaction_type === "minting" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className="capitalize">{activity.transaction_type}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {Number(activity.amount).toLocaleString()} {activity.currency_code}
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(activity.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
