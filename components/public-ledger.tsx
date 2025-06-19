"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, ArrowUpRight, ArrowDownLeft, Gift, ShoppingBag, RefreshCw } from "lucide-react"
import Link from "next/link"

interface Transaction {
  id: string
  amount: number
  currency: string
  type: "send" | "receive" | "bonus" | "purchase" | "sale"
  description: string
  from_user_name?: string
  to_user_name?: string
  created_at: string
}

const getTransactionIcon = (type: string) => {
  switch (type) {
    case "send":
      return <ArrowUpRight className="w-4 h-4 text-red-500" />
    case "receive":
      return <ArrowDownLeft className="w-4 h-4 text-green-500" />
    case "bonus":
      return <Gift className="w-4 h-4 text-yellow-500" />
    case "purchase":
    case "sale":
      return <ShoppingBag className="w-4 h-4 text-blue-500" />
    default:
      return <ArrowUpRight className="w-4 h-4" />
  }
}

const getTransactionColor = (type: string) => {
  switch (type) {
    case "send":
      return "destructive"
    case "receive":
      return "default"
    case "bonus":
      return "secondary"
    case "purchase":
    case "sale":
      return "outline"
    default:
      return "outline"
  }
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "Just now"
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return `${Math.floor(diffInMinutes / 1440)}d ago`
}

export function PublicLedger() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    try {
      setError(null)
      const response = await fetch("/api/ledger/public")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setTransactions(data.transactions || [])
      } else {
        throw new Error(data.error || "Failed to fetch transactions")
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch transactions")
      // Don't set empty array on error, keep existing transactions
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchTransactions, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading && transactions.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Public Transaction Ledger
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Public Transaction Ledger</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Complete transparency - view all platform transactions in real-time
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Recent Transactions
                  <Badge variant="secondary" className="ml-2">
                    Live
                  </Badge>
                </CardTitle>
                <Button variant="outline" size="sm" onClick={fetchTransactions} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">Error: {error}</p>
                </div>
              )}

              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {error ? "Unable to load transactions" : "No transactions yet. Be the first to join!"}
                  </div>
                ) : (
                  transactions.slice(0, 10).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.from_user_name && transaction.to_user_name
                              ? `${transaction.from_user_name} → ${transaction.to_user_name}`
                              : transaction.to_user_name || "System Transaction"}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {formatTimeAgo(transaction.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-medium">
                            {transaction.currency === "CRED" ? "₡" : ""}
                            {transaction.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{transaction.currency}</div>
                        </div>
                        <Badge variant={getTransactionColor(transaction.type) as any}>{transaction.type}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {transactions.length > 10 && (
                <div className="text-center mt-6">
                  <Button variant="outline" asChild>
                    <Link href="/ledger">View All Transactions</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
