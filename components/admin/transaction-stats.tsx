import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { sql } from "@/lib/db"
import { CreditCard, Clock, TrendingUp, DollarSign } from "lucide-react"

async function getTransactionStats() {
  try {
    // Get overall transaction statistics
    const overallStats = await sql`
      SELECT 
        COUNT(*) as total_transactions,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_transactions,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_transactions,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_transactions,
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_volume,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '24 hours' THEN 1 END) as transactions_24h,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as transactions_7d
      FROM transactions
    `

    // Get pending transactions by approval level
    const pendingByLevel = await sql`
      SELECT 
        COUNT(CASE WHEN amount <= 10 THEN 1 END) as auto_approval,
        COUNT(CASE WHEN amount > 10 AND amount <= 100 THEN 1 END) as admin_approval,
        COUNT(CASE WHEN amount > 100 AND amount <= 1000 THEN 1 END) as super_admin_approval,
        COUNT(CASE WHEN amount > 1000 THEN 1 END) as owner_approval
      FROM transactions 
      WHERE status = 'pending'
    `

    // Get transaction types breakdown
    const transactionTypes = await sql`
      SELECT 
        transaction_type,
        COUNT(*) as count,
        SUM(amount) as total_amount
      FROM transactions 
      WHERE status = 'completed'
      GROUP BY transaction_type
      ORDER BY count DESC
      LIMIT 10
    `

    // Get recent high-value transactions
    const highValueTransactions = await sql`
      SELECT 
        t.transaction_hash,
        t.amount,
        t.currency_code,
        t.transaction_type,
        t.description,
        t.created_at,
        t.status,
        u1.first_name || ' ' || u1.last_name as from_user,
        u2.first_name || ' ' || u2.last_name as to_user
      FROM transactions t
      LEFT JOIN wallets w1 ON t.from_wallet_id = w1.id
      LEFT JOIN wallets w2 ON t.to_wallet_id = w2.id
      LEFT JOIN users u1 ON w1.user_id = u1.id
      LEFT JOIN users u2 ON w2.user_id = u2.id
      WHERE t.amount > 100
      ORDER BY t.created_at DESC
      LIMIT 5
    `

    return {
      overall: overallStats[0],
      pendingByLevel: pendingByLevel[0],
      transactionTypes,
      highValueTransactions,
    }
  } catch (error) {
    console.error("Error fetching transaction stats:", error)
    return {
      overall: {
        total_transactions: 0,
        completed_transactions: 0,
        pending_transactions: 0,
        failed_transactions: 0,
        total_volume: 0,
        transactions_24h: 0,
        transactions_7d: 0,
      },
      pendingByLevel: {
        auto_approval: 0,
        admin_approval: 0,
        super_admin_approval: 0,
        owner_approval: 0,
      },
      transactionTypes: [],
      highValueTransactions: [],
    }
  }
}

export async function TransactionStats() {
  const stats = await getTransactionStats()

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(stats.overall.total_transactions).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{stats.overall.transactions_24h} in last 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(stats.overall.total_volume).toLocaleString()} CRED</div>
            <p className="text-xs text-muted-foreground">{stats.overall.transactions_7d} transactions this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {Number(stats.overall.pending_transactions).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.overall.total_transactions > 0
                ? Math.round(
                    (Number(stats.overall.completed_transactions) / Number(stats.overall.total_transactions)) * 100,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">{stats.overall.failed_transactions} failed</p>
          </CardContent>
        </Card>
      </div>

      {/* Approval Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals by Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Auto Approval</p>
                <p className="text-xs text-muted-foreground">≤ $10.00</p>
              </div>
              <Badge variant={stats.pendingByLevel.auto_approval > 0 ? "default" : "secondary"}>
                {stats.pendingByLevel.auto_approval}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Admin Level</p>
                <p className="text-xs text-muted-foreground">$10.01 - $100.00</p>
              </div>
              <Badge variant={stats.pendingByLevel.admin_approval > 0 ? "destructive" : "secondary"}>
                {stats.pendingByLevel.admin_approval}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Super Admin</p>
                <p className="text-xs text-muted-foreground">$100.01 - $1,000.00</p>
              </div>
              <Badge variant={stats.pendingByLevel.super_admin_approval > 0 ? "destructive" : "secondary"}>
                {stats.pendingByLevel.super_admin_approval}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Owner Level</p>
                <p className="text-xs text-muted-foreground">$1,000.01+</p>
              </div>
              <Badge variant={stats.pendingByLevel.owner_approval > 0 ? "destructive" : "secondary"}>
                {stats.pendingByLevel.owner_approval}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Types and High Value Transactions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.transactionTypes.map((type: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium capitalize">{type.transaction_type.replace(/_/g, " ")}</p>
                    <p className="text-xs text-muted-foreground">{Number(type.total_amount).toLocaleString()} CRED</p>
                  </div>
                  <Badge variant="outline">{type.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent High-Value Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.highValueTransactions.map((tx: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">
                      {Number(tx.amount).toLocaleString()} {tx.currency_code}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tx.transaction_type.replace(/_/g, " ")} • {new Date(tx.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      tx.status === "completed" ? "default" : tx.status === "pending" ? "secondary" : "destructive"
                    }
                  >
                    {tx.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
