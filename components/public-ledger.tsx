import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPublicLedger } from "@/lib/db"

function formatTimeAgo(date: string | Date): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  return `${Math.floor(diffInSeconds / 86400)}d ago`
}

export async function PublicLedger() {
  let transactions = []

  try {
    transactions = await getPublicLedger(10, 0)
  } catch (error) {
    console.error("Error fetching transactions:", error)
    // Return empty state if database isn't ready
    transactions = []
  }

  if (transactions.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions yet. Be the first to join and receive your registration bonus!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction: any) => (
            <div key={transaction.transaction_hash} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{transaction.transaction_type.replace("_", " ").toUpperCase()}</Badge>
                  <span className="text-sm text-muted-foreground">{formatTimeAgo(transaction.completed_at)}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {transaction.from_address && <span>From: {transaction.from_address} → </span>}
                  {transaction.to_address && <span>To: {transaction.to_address}</span>}
                </div>
                {transaction.description && <p className="text-sm mt-1">{transaction.description}</p>}
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {transaction.amount} {transaction.currency_code}
                </div>
                <div className="text-xs text-muted-foreground">{transaction.transaction_hash.substring(0, 8)}...</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
