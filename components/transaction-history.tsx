"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSession } from "next-auth/react"
import type { Transaction } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

export function TransactionHistory() {
  const { data: session } = useSession()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchTransactions()
    }
  }, [session])

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/wallet/transactions")
      const data = await response.json()
      setTransactions(data.transactions)
    } catch (error) {
      console.error("Failed to fetch transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "registration_bonus":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "transfer":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "trading":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "grant":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading transactions...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No transactions yet</div>
            ) : (
              transactions.map((transaction) => (
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
                    <p className="text-sm">{transaction.description}</p>
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
  )
}
