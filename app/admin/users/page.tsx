import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { UserManagementTable } from "@/components/admin/user-management-table"
import { UserStats } from "@/components/admin/user-stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function UsersPage() {
  const session = await getServerSession(authOptions)

  if (!session || !["admin", "super_admin", "owner"].includes(session.user.role)) {
    redirect("/admin")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage user accounts, roles, and permissions across the platform.</p>
      </div>

      <UserStats />

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            View and manage all registered users. Click on a user to edit their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserManagementTable userRole={session.user.role} />
        </CardContent>
      </Card>
    </div>
  )
}
