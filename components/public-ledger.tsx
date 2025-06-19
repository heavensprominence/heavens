"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react"
import type { Transaction } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

export function PublicLedger() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()

    // Set up real-time updates
    const interval = setInterval(fetchTransactions, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/ledger/public")
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions || [])
      } else {
        console.error("Failed to fetch transactions:", response.status)
        setTransactions([])
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "minting":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "burning":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "registration_bonus":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "transfer":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "grant":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "loan_interest_free":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400"
      case "loan_interest_bearing":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      case "trading":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const formatTransactionType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const maskSensitiveInfo = (description: string) => {
    // Replace email addresses and sensitive info with asterisks
    return description
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "***@***.***")
      .replace(/\b\d{4,}\b/g, "****")
  }

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Public Ledger</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">Loading transactions...</div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              📊 Public Ledger
              <Badge variant="secondary" className="ml-2">
                Live
              </Badge>
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Real-time view of the last 10 transactions on the Heavenslive platform
            </p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {transactions && transactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions yet. Be the first to join!
                  </div>
                ) : (
                  (transactions || []).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getTransactionTypeColor(transaction.type)}>
                            {formatTransactionType(transaction.type)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm">{maskSensitiveInfo(transaction.description)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {transaction.amount > 0 ? "+" : ""}
                          {transaction.amount.toLocaleString()} {transaction.currency}
                        </p>
                        <Badge variant={transaction.status === "approved" ? "default" : "secondary"}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
