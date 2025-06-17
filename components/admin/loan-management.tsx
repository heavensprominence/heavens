"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Search, Calendar, DollarSign, TrendingDown, AlertTriangle } from "lucide-react"

interface Loan {
  id: number
  borrower_name: string
  principal_amount: number
  outstanding_balance: number
  total_paid: number
  monthly_payment: number
  currency_code: string
  status: string
  disbursement_date: string
  maturity_date: string
  next_payment_date: string
  payments_made: number
  total_payments: number
}

export function LoanManagement() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchLoans()
  }, [])

  useEffect(() => {
    const filtered = loans.filter(
      (loan) =>
        loan.borrower_name.toLowerCase().includes(searchTerm.toLowerCase()) || loan.id.toString().includes(searchTerm),
    )
    setFilteredLoans(filtered)
  }, [loans, searchTerm])

  const fetchLoans = async () => {
    try {
      const response = await fetch("/api/admin/financial/loans")
      if (response.ok) {
        const data = await response.json()
        setLoans(data.loans)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch loans",
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 hover:bg-green-600"
      case "completed":
        return "bg-blue-500 hover:bg-blue-600"
      case "defaulted":
        return "bg-red-500 hover:bg-red-600"
      case "forgiven":
        return "bg-purple-500 hover:bg-purple-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const calculateProgress = (totalPaid: number, principalAmount: number) => {
    return Math.min((totalPaid / principalAmount) * 100, 100)
  }

  const isOverdue = (nextPaymentDate: string) => {
    return new Date(nextPaymentDate) < new Date()
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading loans...</div>
  }

  const activeLoans = loans.filter((loan) => loan.status === "active")
  const overdueLoans = activeLoans.filter((loan) => isOverdue(loan.next_payment_date))
  const totalOutstanding = loans.reduce((sum, loan) => sum + loan.outstanding_balance, 0)
  const totalDisbursed = loans.reduce((sum, loan) => sum + loan.principal_amount, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLoans.length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOutstanding.toLocaleString()} CRED</div>
            <p className="text-xs text-muted-foreground">Across all loans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueLoans.length}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recovery Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalDisbursed > 0 ? Math.round(((totalDisbursed - totalOutstanding) / totalDisbursed) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Amount recovered</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Controls */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search loans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Loans Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Borrower</TableHead>
              <TableHead>Loan Amount</TableHead>
              <TableHead>Outstanding</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Monthly Payment</TableHead>
              <TableHead>Next Payment</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLoans.map((loan) => (
              <TableRow key={loan.id} className={isOverdue(loan.next_payment_date) ? "bg-red-50" : ""}>
                <TableCell>
                  <div>
                    <div className="font-medium">{loan.borrower_name}</div>
                    <div className="text-sm text-muted-foreground">Loan #{loan.id}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {loan.principal_amount.toLocaleString()} {loan.currency_code}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Disbursed: {new Date(loan.disbursement_date).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {loan.outstanding_balance.toLocaleString()} {loan.currency_code}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Paid: {loan.total_paid.toLocaleString()} {loan.currency_code}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Progress value={calculateProgress(loan.total_paid, loan.principal_amount)} className="w-20" />
                    <div className="text-xs text-muted-foreground">
                      {loan.payments_made}/{loan.total_payments} payments
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {loan.monthly_payment.toLocaleString()} {loan.currency_code}
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`text-sm ${isOverdue(loan.next_payment_date) ? "text-red-600 font-medium" : ""}`}>
                    {new Date(loan.next_payment_date).toLocaleDateString()}
                    {isOverdue(loan.next_payment_date) && <div className="text-xs text-red-600">OVERDUE</div>}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(loan.status)}>{loan.status.toUpperCase()}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredLoans.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No loans found matching your criteria.</div>
      )}
    </div>
  )
}
