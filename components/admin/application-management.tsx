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
import { ApplicationDetailsDialog } from "./application-details-dialog"
import { useToast } from "@/hooks/use-toast"
import { Search, MoreHorizontal, Eye, Check, X, Clock, Filter, Download } from "lucide-react"

interface Application {
  id: number
  applicant_name: string
  application_type: string
  amount_requested: number
  currency_code: string
  purpose: string
  status: string
  priority_level: string
  created_at: string
  submitted_at: string | null
  assigned_reviewer_name: string | null
}

interface ApplicationManagementProps {
  userRole: string
}

export function ApplicationManagement({ userRole }: ApplicationManagementProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")
  const { toast } = useToast()

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, searchTerm, activeTab])

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/admin/financial/applications")
      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch applications",
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

  const filterApplications = () => {
    let filtered = applications

    // Filter by tab
    switch (activeTab) {
      case "pending":
        filtered = filtered.filter((app) => ["submitted", "under_review"].includes(app.status))
        break
      case "approved":
        filtered = filtered.filter((app) => app.status === "approved")
        break
      case "rejected":
        filtered = filtered.filter((app) => app.status === "rejected")
        break
      case "all":
        // Show all applications
        break
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.application_type.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredApplications(filtered)
  }

  const handleApplicationAction = async (applicationId: number, action: string) => {
    try {
      const response = await fetch("/api/admin/financial/applications/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, action }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Application ${action}d successfully`,
        })
        fetchApplications()
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || `Failed to ${action} application`,
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

  const canReviewApplication = (application: Application) => {
    if (!userRole) return false

    const amount = Number(application.amount_requested)

    if (userRole === "owner") return true
    if (userRole === "super_admin" && amount <= 50000) return true
    if (userRole === "admin" && amount <= 10000) return true

    return false
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500 hover:bg-green-600"
      case "rejected":
        return "bg-red-500 hover:bg-red-600"
      case "under_review":
        return "bg-blue-500 hover:bg-blue-600"
      case "submitted":
        return "bg-yellow-500 hover:bg-yellow-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-600"
      case "high":
        return "text-orange-600"
      case "normal":
        return "text-blue-600"
      case "low":
        return "text-gray-600"
      default:
        return "text-gray-600"
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading applications...</div>
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search applications..."
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
          <TabsTrigger value="pending">
            Pending Review
            {applications.filter((app) => ["submitted", "under_review"].includes(app.status)).length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {applications.filter((app) => ["submitted", "under_review"].includes(app.status)).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All Applications</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{application.applicant_name}</div>
                        {application.assigned_reviewer_name && (
                          <div className="text-sm text-muted-foreground">
                            Reviewer: {application.assigned_reviewer_name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {application.application_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {Number(application.amount_requested).toLocaleString()} {application.currency_code}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">{application.purpose}</div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm font-medium capitalize ${getPriorityColor(application.priority_level)}`}
                      >
                        {application.priority_level}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(application.status)}>
                        {application.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {application.submitted_at
                          ? new Date(application.submitted_at).toLocaleDateString()
                          : new Date(application.created_at).toLocaleDateString()}
                      </div>
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
                              setSelectedApplication(application)
                              setIsDetailsDialogOpen(true)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>

                          {["submitted", "under_review"].includes(application.status) &&
                            canReviewApplication(application) && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleApplicationAction(application.id, "approve")}
                                  className="text-green-600"
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleApplicationAction(application.id, "reject")}
                                  className="text-red-600"
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleApplicationAction(application.id, "assign")}>
                                  <Clock className="mr-2 h-4 w-4" />
                                  Assign Reviewer
                                </DropdownMenuItem>
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

          {filteredApplications.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No applications found matching your criteria.</div>
          )}
        </TabsContent>
      </Tabs>

      {/* Application Details Dialog */}
      {selectedApplication && (
        <ApplicationDetailsDialog
          application={selectedApplication}
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false)
            setSelectedApplication(null)
          }}
          onApprove={() => {
            handleApplicationAction(selectedApplication.id, "approve")
            setIsDetailsDialogOpen(false)
            setSelectedApplication(null)
          }}
          onReject={() => {
            handleApplicationAction(selectedApplication.id, "reject")
            setIsDetailsDialogOpen(false)
            setSelectedApplication(null)
          }}
          canReview={canReviewApplication(selectedApplication)}
        />
      )}
    </div>
  )
}
