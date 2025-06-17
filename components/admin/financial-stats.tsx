import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { sql } from "@/lib/db"
import { HandHeart, DollarSign, Clock, TrendingUp, AlertTriangle } from "lucide-react"

async function getFinancialStats() {
  try {
    // Get application statistics
    const applicationStats = await sql`
      SELECT 
        COUNT(*) as total_applications,
        COUNT(CASE WHEN status = 'submitted' THEN 1 END) as pending_review,
        COUNT(CASE WHEN status = 'under_review' THEN 1 END) as under_review,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected,
        COUNT(CASE WHEN application_type = 'grant' THEN 1 END) as grant_applications,
        COUNT(CASE WHEN application_type = 'loan' THEN 1 END) as loan_applications,
        SUM(CASE WHEN status = 'approved' THEN approved_amount ELSE 0 END) as total_approved_amount,
        AVG(CASE WHEN status = 'approved' THEN approved_amount END) as avg_approved_amount
      FROM financial_applications
    `

    // Get loan statistics
    const loanStats = await sql`
      SELECT 
        COUNT(*) as active_loans,
        SUM(outstanding_balance) as total_outstanding,
        SUM(total_paid) as total_repaid,
        COUNT(CASE WHEN status = 'defaulted' THEN 1 END) as defaulted_loans,
        AVG(outstanding_balance) as avg_loan_balance
      FROM loans
      WHERE status = 'active'
    `

    // Get recent applications
    const recentApplications = await sql`
      SELECT 
        fa.id,
        fa.application_type,
        fa.amount_requested,
        fa.status,
        fa.created_at,
        u.first_name || ' ' || u.last_name as applicant_name
      FROM financial_applications fa
      JOIN users u ON fa.applicant_id = u.id
      ORDER BY fa.created_at DESC
      LIMIT 5
    `

    // Get overdue payments
    const overduePayments = await sql`
      SELECT COUNT(*) as overdue_count
      FROM loan_payments 
      WHERE status = 'scheduled' 
      AND due_date < CURRENT_DATE
    `

    return {
      applications: applicationStats[0],
      loans: loanStats[0] || {
        active_loans: 0,
        total_outstanding: 0,
        total_repaid: 0,
        defaulted_loans: 0,
        avg_loan_balance: 0,
      },
      recentApplications,
      overduePayments: overduePayments[0].overdue_count || 0,
    }
  } catch (error) {
    console.error("Error fetching financial stats:", error)
    return {
      applications: {
        total_applications: 0,
        pending_review: 0,
        under_review: 0,
        approved: 0,
        rejected: 0,
        grant_applications: 0,
        loan_applications: 0,
        total_approved_amount: 0,
        avg_approved_amount: 0,
      },
      loans: {
        active_loans: 0,
        total_outstanding: 0,
        total_repaid: 0,
        defaulted_loans: 0,
        avg_loan_balance: 0,
      },
      recentApplications: [],
      overduePayments: 0,
    }
  }
}

export async function FinancialStats() {
  const stats = await getFinancialStats()

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <HandHeart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(stats.applications.total_applications).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.applications.grant_applications} grants, {stats.applications.loan_applications} loans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {Number(stats.applications.pending_review + stats.applications.under_review).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Number(stats.applications.total_approved_amount).toLocaleString()} CRED
            </div>
            <p className="text-xs text-muted-foreground">
              Avg: {Number(stats.applications.avg_approved_amount || 0).toLocaleString()} CRED
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{Number(stats.loans.active_loans).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {Number(stats.loans.total_outstanding).toLocaleString()} CRED outstanding
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Application Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Review</span>
                <Badge variant="secondary">{stats.applications.pending_review}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Under Review</span>
                <Badge variant="secondary">{stats.applications.under_review}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Approved</span>
                <Badge variant="default">{stats.applications.approved}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Rejected</span>
                <Badge variant="destructive">{stats.applications.rejected}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentApplications.map((app: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">{app.applicant_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {app.application_type} • {Number(app.amount_requested).toLocaleString()} CRED
                    </p>
                  </div>
                  <Badge
                    variant={
                      app.status === "approved" ? "default" : app.status === "rejected" ? "destructive" : "secondary"
                    }
                  >
                    {app.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {stats.overduePayments > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Payment Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              {stats.overduePayments} loan payment{stats.overduePayments > 1 ? "s are" : " is"} overdue and require
              {stats.overduePayments > 1 ? "" : "s"} attention.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
