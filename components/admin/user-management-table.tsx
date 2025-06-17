"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserEditDialog } from "./user-edit-dialog"
import { useToast } from "@/hooks/use-toast"
import { Search, MoreHorizontal, Edit, UserX, UserCheck, Shield, Crown } from "lucide-react"

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: string
  status: string
  registration_number: number
  registration_bonus_amount: number
  created_at: string
  primary_balance: number
  google_id: string | null
}

interface UserManagementTableProps {
  userRole: string
}

export function UserManagementTable({ userRole }: UserManagementTableProps) {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.registration_number.toString().includes(searchTerm),
    )
    setFilteredUsers(filtered)
  }, [users, searchTerm])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch users",
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

  const handleStatusChange = async (userId: number, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/users/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `User status updated to ${newStatus}`,
        })
        fetchUsers()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to update status",
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

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const response = await fetch("/api/admin/users/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `User role updated to ${newRole}`,
        })
        fetchUsers()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to update role",
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-red-500 hover:bg-red-600"
      case "super_admin":
        return "bg-purple-500 hover:bg-purple-600"
      case "admin":
        return "bg-blue-500 hover:bg-blue-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 hover:bg-green-600"
      case "suspended":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "banned":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const canEditUser = (targetUser: User) => {
    if (userRole === "owner") return true
    if (userRole === "super_admin" && !["owner"].includes(targetUser.role)) return true
    if (userRole === "admin" && targetUser.role === "user") return true
    return false
  }

  const getAvailableRoles = () => {
    switch (userRole) {
      case "owner":
        return ["user", "admin", "super_admin", "owner"]
      case "super_admin":
        return ["user", "admin", "super_admin"]
      case "admin":
        return ["user"]
      default:
        return []
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading users...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Registration</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    {user.google_id && <div className="text-xs text-blue-600">Google OAuth</div>}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">#{user.registration_number}</div>
                    <div className="text-sm text-muted-foreground">
                      {Number(user.registration_bonus_amount).toLocaleString()} CRED bonus
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(user.role)}>{user.role.replace("_", " ").toUpperCase()}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(user.status)}>{user.status.toUpperCase()}</Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {user.primary_balance ? Number(user.primary_balance).toLocaleString() : "0"} CRED
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{new Date(user.created_at).toLocaleDateString()}</div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {canEditUser(user) && (
                        <>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}

                      {/* Status Actions */}
                      {user.status === "active" && canEditUser(user) && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(user.id, "suspended")}
                          className="text-yellow-600"
                        >
                          <UserX className="mr-2 h-4 w-4" />
                          Suspend User
                        </DropdownMenuItem>
                      )}

                      {user.status === "suspended" && canEditUser(user) && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(user.id, "active")}
                            className="text-green-600"
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activate User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(user.id, "banned")}
                            className="text-red-600"
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            Ban User
                          </DropdownMenuItem>
                        </>
                      )}

                      {user.status === "banned" && canEditUser(user) && (
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(user.id, "active")}
                          className="text-green-600"
                        >
                          <UserCheck className="mr-2 h-4 w-4" />
                          Unban User
                        </DropdownMenuItem>
                      )}

                      {/* Role Actions */}
                      {canEditUser(user) && getAvailableRoles().length > 1 && (
                        <>
                          <DropdownMenuSeparator />
                          {getAvailableRoles()
                            .filter((role) => role !== user.role)
                            .map((role) => (
                              <DropdownMenuItem key={role} onClick={() => handleRoleChange(user.id, role)}>
                                {role === "owner" && <Crown className="mr-2 h-4 w-4" />}
                                {(role === "super_admin" || role === "admin") && <Shield className="mr-2 h-4 w-4" />}
                                Make {role.replace("_", " ")}
                              </DropdownMenuItem>
                            ))}
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

      {selectedUser && (
        <UserEditDialog
          user={selectedUser}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
            setSelectedUser(null)
          }}
          onSave={() => {
            fetchUsers()
            setIsEditDialogOpen(false)
            setSelectedUser(null)
          }}
          userRole={userRole}
        />
      )}
    </div>
  )
}
