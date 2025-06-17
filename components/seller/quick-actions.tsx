"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Package, BarChart3, Settings, MessageSquare, HelpCircle } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "Add Product",
      description: "List a new product",
      icon: Plus,
      href: "/seller/products/new",
      variant: "default" as const,
    },
    {
      title: "Manage Inventory",
      description: "Update stock levels",
      icon: Package,
      href: "/seller/inventory",
      variant: "outline" as const,
    },
    {
      title: "View Analytics",
      description: "Check performance",
      icon: BarChart3,
      href: "/seller/analytics",
      variant: "outline" as const,
    },
    {
      title: "Store Settings",
      description: "Configure your store",
      icon: Settings,
      href: "/seller/settings",
      variant: "outline" as const,
    },
    {
      title: "Customer Support",
      description: "Help customers",
      icon: MessageSquare,
      href: "/seller/support",
      variant: "outline" as const,
    },
    {
      title: "Help Center",
      description: "Get assistance",
      icon: HelpCircle,
      href: "/seller/help",
      variant: "outline" as const,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => (
          <Button key={action.title} variant={action.variant} className="w-full justify-start h-auto p-3" asChild>
            <a href={action.href}>
              <action.icon className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </a>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
