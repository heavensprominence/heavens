"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Coins,
  ShoppingBag,
  CreditCard,
  MessageSquare,
  Settings,
  BarChart3,
  Globe,
  Shield,
  Database,
  Gavel,
  HandHeart,
  TrendingUp,
  Languages,
  Palette,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n/i18n-context"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    key: "common.dashboard",
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    key: "admin.users",
  },
  {
    title: "CRED Management",
    href: "/admin/cred",
    icon: Coins,
    key: "admin.credManagement",
  },
  {
    title: "Marketplace",
    href: "/admin/marketplace",
    icon: ShoppingBag,
    key: "admin.marketplace",
  },
  {
    title: "Transactions",
    href: "/admin/transactions",
    icon: CreditCard,
    key: "admin.transactions",
  },
  {
    title: "Financial Assistance",
    href: "/admin/financial",
    icon: HandHeart,
    key: "admin.financial",
  },
  {
    title: "Auctions",
    href: "/admin/auctions",
    icon: Gavel,
    key: "admin.auctions",
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    key: "admin.analytics",
  },
  {
    title: "Global Markets",
    href: "/admin/global",
    icon: Globe,
    key: "admin.globalMarkets",
  },
  {
    title: "Parity System",
    href: "/admin/parity",
    icon: TrendingUp,
    key: "admin.paritySystem",
  },
  {
    title: "AI System",
    href: "/admin/ai",
    icon: Shield,
    key: "admin.aiSystem",
  },
  {
    title: "Database",
    href: "/admin/database",
    icon: Database,
    key: "admin.database",
  },
  {
    title: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
    key: "admin.messages",
  },
]

const settingsItems = [
  {
    title: "General Settings",
    href: "/admin/settings",
    icon: Settings,
    key: "admin.generalSettings",
  },
  {
    title: "Language Settings",
    href: "/admin/settings/language",
    icon: Languages,
    key: "admin.languageSettings",
  },
  {
    title: "Appearance",
    href: "/admin/settings/appearance",
    icon: Palette,
    key: "admin.appearance",
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { t } = useI18n()

  return (
    <div className="flex h-full w-64 flex-col bg-background border-r">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">{t("admin.adminPanel")}</h2>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {t(item.key)}
            </Link>
          ))}
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {t("admin.settings")}
          </h3>
          <div className="space-y-1">
            {settingsItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {t(item.key)}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default AdminSidebar
