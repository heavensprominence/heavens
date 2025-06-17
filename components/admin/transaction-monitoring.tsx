"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TransactionDetailsDialog } from "./transaction-details-dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/simple-auth-provider"
import { Search, MoreHorizontal, Eye, Check, X, Filter, Download, RefreshCw } from "lucide-react"

interface Transaction {
  id: number
  transaction_hash: string
  amount: number
  currency_code: string
  transaction_type: string
  status: string
  description: string
  created_at: string
  completed_at: string | null
  from_user: string | null
  to_user: string | null
  approval_level: string
  approved_by: number | null
  approver_name: string | null
}

export function TransactionMonitoring() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    filterTransactions()
  }, [transactions, searchTerm, activeTab])

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/admin/transactions")
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch transactions",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterTransactions = () => {
    let filtered = transactions

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((tx) => tx.status === activeTab)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (tx) =>
          tx.transaction_hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.transaction_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (tx.from_user && tx.from_user.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (tx.to_user && tx.to_user.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredTransactions(filtered)
  }

  const handleApproveTransaction = async (transactionId: number) => {
    try {
      const response = await fetch("/api/admin/transactions/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, action: "approve" }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Transaction approved successfully",
        })
        fetchTransactions()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to approve transaction",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const handleRejectTransaction = async (transactionId: number) => {
    try {
      const response = await fetch("/api/admin/transactions/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, action: "reject" }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Transaction rejected",
        })
        fetchTransactions()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to reject transaction",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const canApproveTransaction = (transaction: Transaction) => {
    if (!user) return false

    const amount = Number(transaction.amount)

    if (user.role === "owner") return true
    if (user.role === "super_admin" && amount <= 1000) return true
    if (user.role === "admin" && amount <= 100) return true

    return false
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 hover:bg-green-600"
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "failed":
        return "bg-red-500 hover:bg-red-600"
      case "cancelled":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "registration_bonus":
        return "text-green-600"
      case "transfer":
        return "text-blue-600"
      case "minting":
        return "text-purple-600"
      case "burning":
        return "text-red-600"
      case "grant":
        return "text-emerald-600"
      case "loan_disbursement":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading transactions...</div>
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchTransactions}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            {transactions.filter((tx) => tx.status === "pending").length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {transactions.filter((tx) => tx.status === "pending").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Parties</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.transaction_hash.substring(0, 12)}...</div>
                        <div className="text-sm text-muted-foreground">{transaction.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm font-medium capitalize ${getTransactionTypeColor(transaction.transaction_type)}`}
                      >
                        {transaction.transaction_type.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {Number(transaction.amount).toLocaleString()} {transaction.currency_code}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {transaction.from_user && <div>From: {transaction.from_user}</div>}
                        {transaction.to_user && <div>To: {transaction.to_user}</div>}
                        {!transaction.from_user && !transaction.to_user && (
                          <span className="text-muted-foreground">System</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(transaction.status)}>
                        {transaction.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(transaction.created_at).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTransaction(transaction)
                              setIsDetailsDialogOpen(true)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>

                          {transaction.status === "pending" && canApproveTransaction(transaction) && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleApproveTransaction(transaction.id)}
                                className="text-green-600"
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRejectTransaction(transaction.id)}
                                className="text-red-600"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No transactions found matching your criteria.</div>
          )}
        </TabsContent>
      </Tabs>

      {/* Transaction Details Dialog */}
      {selectedTransaction && (
        <TransactionDetailsDialog
          transaction={selectedTransaction}
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false)
            setSelectedTransaction(null)
          }}
          onApprove={() => {
            handleApproveTransaction(selectedTransaction.id)
            setIsDetailsDialogOpen(false)
            setSelectedTransaction(null)
          }}
          onReject={() => {
            handleRejectTransaction(selectedTransaction.id)
            setIsDetailsDialogOpen(false)
            setSelectedTransaction(null)
          }}
          canApprove={canApproveTransaction(selectedTransaction)}
        />
      )}
    </div>
  )
}
