"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ListingDetailsDialog } from "./listing-details-dialog"
import { useToast } from "@/hooks/use-toast"
import { Search, MoreHorizontal, Eye, Check, X, Star, Flag, Filter, Download } from "lucide-react"

interface Listing {
  id: number
  title: string
  seller_name: string
  category_name: string
  price: number
  currency_code: string
  status: string
  is_featured: boolean
  condition: string
  quantity: number
  created_at: string
  view_count: number
}

interface ListingManagementProps {
  userRole: string
}

export function ListingManagement({ userRole }: ListingManagementProps) {
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchListings()
  }, [])

  useEffect(() => {
    filterListings()
  }, [listings, searchTerm, activeTab])

  const fetchListings = async () => {
    try {
      const response = await fetch("/api/admin/marketplace/listings")
      if (response.ok) {
        const data = await response.json()
        setListings(data.listings)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch listings",
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

  const filterListings = () => {
    let filtered = listings

    // Filter by tab
    switch (activeTab) {
      case "active":
        filtered = filtered.filter((listing) => listing.status === "active")
        break
      case "pending":
        filtered = filtered.filter((listing) => listing.status === "draft")
        break
      case "featured":
        filtered = filtered.filter((listing) => listing.is_featured)
        break
      case "sold":
        filtered = filtered.filter((listing) => listing.status === "sold")
        break
      case "all":
        // Show all listings
        break
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.seller_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.category_name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredListings(filtered)
  }

  const handleListingAction = async (listingId: number, action: string) => {
    try {
      const response = await fetch("/api/admin/marketplace/listings/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, action }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Listing ${action}d successfully`,
        })
        fetchListings()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || `Failed to ${action} listing`,
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 hover:bg-green-600"
      case "sold":
        return "bg-blue-500 hover:bg-blue-600"
      case "paused":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "expired":
        return "bg-orange-500 hover:bg-orange-600"
      case "removed":
        return "bg-red-500 hover:bg-red-600"
      case "draft":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "text-green-600"
      case "like_new":
        return "text-blue-600"
      case "good":
        return "text-yellow-600"
      case "fair":
        return "text-orange-600"
      case "poor":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading listings...</div>
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Listings</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            {listings.filter((listing) => listing.status === "draft").length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {listings.filter((listing) => listing.status === "draft").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="featured">
            Featured
            {listings.filter((listing) => listing.is_featured).length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {listings.filter((listing) => listing.is_featured).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sold">Sold</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Listing</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {listing.title}
                          {listing.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Qty: {listing.quantity} • Created {new Date(listing.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{listing.seller_name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{listing.category_name}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {Number(listing.price).toLocaleString()} {listing.currency_code}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium capitalize ${getConditionColor(listing.condition)}`}>
                        {listing.condition.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(listing.status)}>{listing.status.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{listing.view_count || 0}</div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedListing(listing)
                              setIsDetailsDialogOpen(true)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {listing.status === "draft" && (
                            <DropdownMenuItem
                              onClick={() => handleListingAction(listing.id, "approve")}
                              className="text-green-600"
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                          )}

                          {listing.status === "active" && (
                            <>
                              <DropdownMenuItem onClick={() => handleListingAction(listing.id, "pause")}>
                                <X className="mr-2 h-4 w-4" />
                                Pause
                              </DropdownMenuItem>
                              {!listing.is_featured && (
                                <DropdownMenuItem onClick={() => handleListingAction(listing.id, "feature")}>
                                  <Star className="mr-2 h-4 w-4" />
                                  Make Featured
                                </DropdownMenuItem>
                              )}
                            </>
                          )}

                          {listing.status === "paused" && (
                            <DropdownMenuItem
                              onClick={() => handleListingAction(listing.id, "activate")}
                              className="text-green-600"
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => handleListingAction(listing.id, "flag")}
                            className="text-red-600"
                          >
                            <Flag className="mr-2 h-4 w-4" />
                            Flag for Review
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleListingAction(listing.id, "remove")}
                            className="text-red-600"
                          >
                            <X className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredListings.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No listings found matching your criteria.</div>
          )}
        </TabsContent>
      </Tabs>

      {/* Listing Details Dialog */}
      {selectedListing && (
        <ListingDetailsDialog
          listing={selectedListing}
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false)
            setSelectedListing(null)
          }}
          onAction={(action) => {
            handleListingAction(selectedListing.id, action)
            setIsDetailsDialogOpen(false)
            setSelectedListing(null)
          }}
        />
      )}
    </div>
  )
}
