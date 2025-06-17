import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { MarketplaceStats } from "@/components/admin/marketplace-stats"
import { ListingManagement } from "@/components/admin/listing-management"
import { OrderManagement } from "@/components/admin/order-management"
import { CategoryManagement } from "@/components/admin/category-management"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function MarketplacePage() {
  const session = await getServerSession(authOptions)

  if (!session || !["admin", "super_admin", "owner"].includes(session.user.role)) {
    redirect("/admin")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Marketplace Management</h1>
        <p className="text-muted-foreground">
          Manage listings, orders, categories, and marketplace operations across the global platform.
        </p>
      </div>

      <MarketplaceStats />

      <Tabs defaultValue="listings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          <Card>
            <CardHeader>
              <CardTitle>Listing Management</CardTitle>
              <CardDescription>
                Monitor, approve, and manage all marketplace listings with moderation tools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ListingManagement userRole={session.user.role} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>
                Track orders, manage escrow, and handle order-related issues and disputes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrderManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Management</CardTitle>
              <CardDescription>
                Organize marketplace categories, subcategories, and product classification.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes">
          <Card>
            <CardHeader>
              <CardTitle>Dispute Resolution</CardTitle>
              <CardDescription>
                Handle buyer-seller disputes, investigate claims, and manage resolutions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Dispute management component will be implemented here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="featured">
          <Card>
            <CardHeader>
              <CardTitle>Featured Listings</CardTitle>
              <CardDescription>Manage paid promotions, featured placements, and advertising revenue.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Featured listings management component will be implemented here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Settings</CardTitle>
              <CardDescription>Configure fees, policies, and global marketplace parameters.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Marketplace settings component will be implemented here.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
