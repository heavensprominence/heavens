"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/simple-auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { HelpCircle, Plus, MessageSquare, Clock, CheckCircle, AlertCircle, Search, Filter } from "lucide-react"

interface SupportTicket {
  id: number
  ticketNumber: string
  subject: string
  category: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in_progress" | "waiting" | "resolved" | "closed"
  description: string
  createdAt: string
  updatedAt: string
  assignedTo?: string
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
}

const statusColors = {
  open: "bg-green-100 text-green-800",
  in_progress: "bg-blue-100 text-blue-800",
  waiting: "bg-yellow-100 text-yellow-800",
  resolved: "bg-purple-100 text-purple-800",
  closed: "bg-gray-100 text-gray-800",
}

const statusIcons = {
  open: Clock,
  in_progress: MessageSquare,
  waiting: AlertCircle,
  resolved: CheckCircle,
  closed: CheckCircle,
}

export default function SupportPage() {
  const { user, isAuthenticated } = useAuth()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "general",
    priority: "medium" as const,
    description: "",
  })

  // Demo data
  useEffect(() => {
    if (isAuthenticated) {
      const demoTickets: SupportTicket[] = [
        {
          id: 1,
          ticketNumber: "TKT-2024-001",
          subject: "Payment not processing",
          category: "payment",
          priority: "high",
          status: "in_progress",
          description: "My CRED payment is stuck in pending status",
          createdAt: "2024-01-15T10:00:00Z",
          updatedAt: "2024-01-15T14:30:00Z",
          assignedTo: "Support Team",
        },
        {
          id: 2,
          ticketNumber: "TKT-2024-002",
          subject: "Account verification issue",
          category: "account",
          priority: "medium",
          status: "waiting",
          description: "Unable to complete account verification process",
          createdAt: "2024-01-14T16:20:00Z",
          updatedAt: "2024-01-15T09:15:00Z",
        },
        {
          id: 3,
          ticketNumber: "TKT-2024-003",
          subject: "Marketplace listing not showing",
          category: "marketplace",
          priority: "low",
          status: "resolved",
          description: "My product listing is not visible in search results",
          createdAt: "2024-01-13T11:45:00Z",
          updatedAt: "2024-01-14T10:30:00Z",
          assignedTo: "Technical Team",
        },
      ]
      setTickets(demoTickets)
      setLoading(false)
    }
  }, [isAuthenticated])

  const handleCreateTicket = () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) return

    const ticket: SupportTicket = {
      id: tickets.length + 1,
      ticketNumber: `TKT-2024-${String(tickets.length + 4).padStart(3, "0")}`,
      subject: newTicket.subject,
      category: newTicket.category,
      priority: newTicket.priority,
      status: "open",
      description: newTicket.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setTickets([ticket, ...tickets])
    setNewTicket({ subject: "", category: "general", priority: "medium", description: "" })
    setIsCreateDialogOpen(false)
  }

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign in to access support</h2>
            <p className="text-muted-foreground">Get help with your account and platform issues</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Support Center</h1>
          <p className="text-muted-foreground">Get help and manage your support tickets</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newTicket.category}
                    onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="account">Account</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="marketplace">Marketplace</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value: any) => setNewTicket({ ...newTicket, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of your issue..."
                  rows={4}
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTicket}>Create Ticket</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="waiting">Waiting</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => {
                const StatusIcon = statusIcons[ticket.status]
                return (
                  <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{ticket.ticketNumber}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>
                      <Badge className={priorityColors[ticket.priority]}>{ticket.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="h-4 w-4" />
                        <Badge className={statusColors[ticket.status]}>{ticket.status.replace("_", " ")}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(ticket.updatedAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {filteredTickets.length === 0 && (
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first support ticket to get help"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
