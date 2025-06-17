import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { sql } from "@/lib/db"
import { Users, UserCheck, UserX, Crown, Shield, User } from "lucide-react"

async function getUserStats() {
  try {
    const stats = await sql`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users,
        COUNT(CASE WHEN status = 'suspended' THEN 1 END) as suspended_users,
        COUNT(CASE WHEN status = 'banned' THEN 1 END) as banned_users,
        COUNT(CASE WHEN role = 'owner' THEN 1 END) as owners,
        COUNT(CASE WHEN role = 'super_admin' THEN 1 END) as super_admins,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins,
        COUNT(CASE WHEN role = 'user' THEN 1 END) as regular_users,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as new_users_7d,
        COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_users_30d
      FROM users
    `

    return stats[0]
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return {
      total_users: 0,
      active_users: 0,
      suspended_users: 0,
      banned_users: 0,
      owners: 0,
      super_admins: 0,
      admins: 0,
      regular_users: 0,
      new_users_7d: 0,
      new_users_30d: 0,
    }
  }
}

export async function UserStats() {
  const stats = await getUserStats()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Number(stats.total_users).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+{stats.new_users_7d} this week</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <UserCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{Number(stats.active_users).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {((Number(stats.active_users) / Number(stats.total_users)) * 100).toFixed(1)}% of total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Suspended</CardTitle>
          <UserX className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{Number(stats.suspended_users).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">{stats.banned_users} banned</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Users (30d)</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{Number(stats.new_users_30d).toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Growth this month</p>
        </CardContent>
      </Card>

      {/* Role Distribution */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Role Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Crown className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Owners</p>
                <p className="text-lg font-bold">{stats.owners}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Shield className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Super Admins</p>
                <p className="text-lg font-bold">{stats.super_admins}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Shield className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Admins</p>
                <p className="text-lg font-bold">{stats.admins}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Regular Users</p>
                <p className="text-lg font-bold">{Number(stats.regular_users).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
