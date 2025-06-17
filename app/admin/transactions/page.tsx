import { TransactionMonitoring } from "@/components/admin/transaction-monitoring"
import { TransactionStats } from "@/components/admin/transaction-stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TransactionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Transaction Monitoring</h1>
        <p className="text-muted-foreground">
          Monitor, approve, and manage all platform transactions with multi-level approval workflows.
        </p>
      </div>

      <TransactionStats />

      <Card>
        <CardHeader>
          <CardTitle>Transaction Management</CardTitle>
          <CardDescription>
            Review pending transactions, approve or reject based on amount thresholds, and monitor transaction flow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransactionMonitoring />
        </CardContent>
      </Card>
    </div>
  )
}
