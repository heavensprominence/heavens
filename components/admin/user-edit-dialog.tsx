"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

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
  phone?: string
  country_code?: string
}

interface UserEditDialogProps {
  user: User
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  userRole: string
}

export function UserEditDialog({ user, isOpen, onClose, onSave, userRole }: UserEditDialogProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country_code: "",
    role: "",
    status: "",
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        country_code: user.country_code || "",
        role: user.role || "",
        status: user.status || "",
        notes: "",
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/users/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User updated successfully",
        })
        onSave()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to update user",
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

  const getAvailableStatuses = () => {
    return ["active", "suspended", "banned"]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and permissions. Changes will be logged for audit purposes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Info Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Registration #{user.registration_number}</p>
                <p className="text-sm text-muted-foreground">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                <p className="text-sm text-muted-foreground">
                  Bonus: {Number(user.registration_bonus_amount).toLocaleString()} CRED
                </p>
              </div>
              {user.google_id && <Badge variant="outline">Google OAuth</Badge>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Optional"
                />
              </div>
              <div>
                <Label htmlFor="country_code">Country</Label>
                <Input
                  id="country_code"
                  value={formData.country_code}
                  onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
                  placeholder="e.g., CA, US, UK"
                  maxLength={3}
                />
              </div>
            </div>
          </div>

          {/* Role and Status Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableRoles().map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.replace("_", " ").toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableStatuses().map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <Label htmlFor="notes">Admin Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about this user or the changes made..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
