"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  CreditCard,
  Settings,
  BarChart3,
  Coins,
  FileText,
  Shield,
  Gavel,
  MessageSquare,
  Home,
  LogOut,
} from "lucide-react"
import { signOut } from "next-auth/react"

interface AdminSidebarProps {
  userRole: string
}

export function AdminSidebar({ userRole }: AdminSidebarProps) {
  const pathname = usePathname()

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: Home,
      roles: ["admin", "super_admin", "owner"],
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      roles: ["admin", "super_admin", "owner"],
    },
    {
      name: "Transactions",
      href: "/admin/transactions",
      icon: CreditCard,
      roles: ["admin", "super_admin", "owner"],
    },
    {
      name: "CRED Management",
      href: "/admin/cred",
      icon: Coins,
      roles: ["owner"],
    },
    {
      name: "Grants & Loans",
      href: "/admin/financial",
      icon: FileText,
      roles: ["admin", "super_admin", "owner"],
    },
    {
      name: "Marketplace",
      href: "/admin/marketplace",
      icon: Gavel,
      roles: ["admin", "super_admin", "owner"],
    },
    {
      name: "Communications",
      href: "/admin/communications",
      icon: MessageSquare,
      roles: ["admin", "super_admin", "owner"],
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
      roles: ["super_admin", "owner"],
    },
    {
      name: "System Settings",
      href: "/admin/settings",
      icon: Settings,
      roles: ["super_admin", "owner"],
    },
    {
      name: "Admin Management",
      href: "/admin/admins",
      icon: Shield,
      roles: ["owner"],
    },
  ]

  const filteredNavigation = navigation.filter((item) => item.roles.includes(userRole))

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-red-500"
      case "super_admin":
        return "bg-purple-500"
      case "admin":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <Coins className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Admin Panel</span>
        </div>
        <Badge className={cn("mt-2", getRoleBadgeColor(userRole))}>{userRole.replace("_", " ").toUpperCase()}</Badge>
      </div>

      <nav className="mt-6">
        <div className="px-3">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Button variant="outline" className="w-full" onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
