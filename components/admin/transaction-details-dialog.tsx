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
import { Check, X, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: number
  transaction_hash: string
  amount: number
  currency_code: string
  transaction_type: string
  status: string
  description: string
  created_at: string
  completed_at: string | null
  from_user: string | null
  to_user: string | null
  approval_level: string
  approved_by: number | null
  approver_name: string | null
}

interface TransactionDetailsDialogProps {
  transaction: Transaction
  isOpen: boolean
  onClose: () => void
  onApprove: () => void
  onReject: () => void
  canApprove: boolean
}

export function TransactionDetailsDialog({
  transaction,
  isOpen,
  onClose,
  onApprove,
  onReject,
  canApprove,
}: TransactionDetailsDialogProps) {
  const { toast } = useToast()

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Transaction hash copied to clipboard",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>Complete information about this transaction</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Hash */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium">Transaction Hash</p>
              <p className="text-xs text-muted-foreground font-mono">{transaction.transaction_hash}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => copyToClipboard(transaction.transaction_hash)}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Amount</p>
              <p className="text-2xl font-bold">
                {Number(transaction.amount).toLocaleString()} {transaction.currency_code}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <Badge className={getStatusColor(transaction.status)}>{transaction.status.toUpperCase()}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Type</p>
              <p className="capitalize">{transaction.transaction_type.replace(/_/g, " ")}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Approval Level</p>
              <p className="capitalize">{transaction.approval_level.replace(/_/g, " ")}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-sm font-medium">Description</p>
            <p className="text-sm text-muted-foreground">{transaction.description}</p>
          </div>

          {/* Parties Involved */}
          {(transaction.from_user || transaction.to_user) && (
            <div>
              <p className="text-sm font-medium mb-2">Parties Involved</p>
              <div className="space-y-2">
                {transaction.from_user && (
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">From: {transaction.from_user}</span>
                  </div>
                )}
                {transaction.to_user && (
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">To: {transaction.to_user}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Created</p>
              <p className="text-sm text-muted-foreground">{new Date(transaction.created_at).toLocaleString()}</p>
            </div>
            {transaction.completed_at && (
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-sm text-muted-foreground">{new Date(transaction.completed_at).toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Approver Information */}
          {transaction.approver_name && (
            <div>
              <p className="text-sm font-medium">Approved By</p>
              <p className="text-sm text-muted-foreground">{transaction.approver_name}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>

            {transaction.status === "pending" && canApprove && (
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
