"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Check, X, FileText, User, DollarSign, Calendar } from "lucide-react"

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

interface ApplicationDetailsDialogProps {
  application: Application
  isOpen: boolean
  onClose: () => void
  onApprove: () => void
  onReject: () => void
  canReview: boolean
}

export function ApplicationDetailsDialog({
  application,
  isOpen,
  onClose,
  onApprove,
  onReject,
  canReview,
}: ApplicationDetailsDialogProps) {
  const [reviewNotes, setReviewNotes] = useState("")
  const [approvedAmount, setApprovedAmount] = useState(application.amount_requested.toString())

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      case "under_review":
        return "bg-blue-500"
      case "submitted":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "normal":
        return "bg-blue-500"
      case "low":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {application.application_type === "grant" ? "Grant" : "Loan"} Application Details
          </DialogTitle>
          <DialogDescription>Complete information about this financial assistance application</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center gap-4">
            <Badge className={getStatusColor(application.status)}>
              {application.status.replace("_", " ").toUpperCase()}
            </Badge>
            <Badge className={getPriorityColor(application.priority_level)}>
              {application.priority_level.toUpperCase()} PRIORITY
            </Badge>
          </div>

          {/* Applicant Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <h3 className="font-semibold">Applicant Information</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm">{application.applicant_name}</p>
                </div>
                {application.assigned_reviewer_name && (
                  <div>
                    <Label className="text-sm font-medium">Assigned Reviewer</Label>
                    <p className="text-sm">{application.assigned_reviewer_name}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <h3 className="font-semibold">Financial Details</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-sm font-medium">Requested Amount</Label>
                  <p className="text-lg font-bold">
                    {Number(application.amount_requested).toLocaleString()} {application.currency_code}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Application Type</Label>
                  <p className="text-sm capitalize">{application.application_type}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Purpose and Details */}
          <div>
            <Label className="text-sm font-medium">Purpose</Label>
            <div className="mt-2 p-3 bg-muted rounded-lg">
              <p className="text-sm">{application.purpose}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <h3 className="font-semibold">Timeline</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Created</Label>
                <p className="text-sm">{new Date(application.created_at).toLocaleString()}</p>
              </div>
              {application.submitted_at && (
                <div>
                  <Label className="text-sm font-medium">Submitted</Label>
                  <p className="text-sm">{new Date(application.submitted_at).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Review Section */}
          {canReview && ["submitted", "under_review"].includes(application.status) && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold">Review Application</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="approvedAmount">Approved Amount</Label>
                    <Input
                      id="approvedAmount"
                      type="number"
                      value={approvedAmount}
                      onChange={(e) => setApprovedAmount(e.target.value)}
                      placeholder="Enter approved amount"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reviewNotes">Review Notes</Label>
                  <Textarea
                    id="reviewNotes"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add your review comments and conditions..."
                    rows={4}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>

            {canReview && ["submitted", "under_review"].includes(application.status) && (
              <>
                <Button variant="destructive" onClick={onReject}>
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button onClick={onApprove}>
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
