import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { FinancialStats } from "@/components/admin/financial-stats"
import { ApplicationManagement } from "@/components/admin/application-management"
import { LoanManagement } from "@/components/admin/loan-management"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function FinancialPage() {
  const session = await getServerSession(authOptions)

  if (!session || !["admin", "super_admin", "owner"].includes(session.user.role)) {
    redirect("/admin")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Financial Assistance</h1>
        <p className="text-muted-foreground">
          Manage grant and loan applications, review processes, and disbursements across the platform.
        </p>
      </div>

      <FinancialStats />

      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="loans">Active Loans</TabsTrigger>
          <TabsTrigger value="grants">Grant History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Application Management</CardTitle>
              <CardDescription>
                Review and process grant and loan applications with multi-level approval workflows.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApplicationManagement userRole={session.user.role} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans">
          <Card>
            <CardHeader>
              <CardTitle>Loan Management</CardTitle>
              <CardDescription>Monitor active loans, payment schedules, and loan performance metrics.</CardDescription>
            </CardHeader>
            <CardContent>
              <LoanManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grants">
          <Card>
            <CardHeader>
              <CardTitle>Grant History</CardTitle>
              <CardDescription>View all approved and disbursed grants with recipient tracking.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Grant history component will be implemented here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Financial Settings</CardTitle>
              <CardDescription>Configure approval thresholds, limits, and system parameters.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Financial settings component will be implemented here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
