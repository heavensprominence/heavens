"use client"
import {
  BarChart3,
  Package,
  ShoppingCart,
  DollarSign,
  Settings,
  Store,
  TrendingUp,
  Users,
  Bell,
  HelpCircle,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useSimpleAuth } from "@/components/simple-auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const navigation = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/seller",
        icon: BarChart3,
      },
      {
        title: "Analytics",
        url: "/seller/analytics",
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "Products",
    items: [
      {
        title: "My Products",
        url: "/seller/products",
        icon: Package,
      },
      {
        title: "Add Product",
        url: "/seller/products/new",
        icon: Package,
      },
    ],
  },
  {
    title: "Sales",
    items: [
      {
        title: "Orders",
        url: "/seller/orders",
        icon: ShoppingCart,
      },
      {
        title: "Revenue",
        url: "/seller/revenue",
        icon: DollarSign,
      },
    ],
  },
  {
    title: "Store",
    items: [
      {
        title: "Storefront",
        url: "/seller/storefront",
        icon: Store,
      },
      {
        title: "Customers",
        url: "/seller/customers",
        icon: Users,
      },
    ],
  },
]

export function SellerSidebar() {
  const { user, logout } = useSimpleAuth()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
            <AvatarFallback>{user?.name?.charAt(0) || user?.email?.charAt(0) || "S"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "Seller"}</p>
            <p className="text-xs text-muted-foreground truncate">Seller Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigation.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/seller/notifications">
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/seller/help">
                    <HelpCircle className="h-4 w-4" />
                    <span>Help Center</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/seller/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button variant="ghost" className="w-full justify-start" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
