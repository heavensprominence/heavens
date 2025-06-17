"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/simple-auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  MessageSquare,
  Send,
  Search,
  Plus,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  Archive,
  Trash2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Conversation {
  id: string
  type: string
  subject?: string
  participants: number[]
  lastMessage: {
    content: string
    timestamp: string
    sender: string
  }
  unreadCount: number
  isArchived: boolean
}

interface Message {
  id: number
  senderId: number
  senderName: string
  content: string
  messageType: string
  timestamp: string
  isRead: boolean
}

export default function MessagesPage() {
  const { user, isAuthenticated } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  // Demo data for conversations
  useEffect(() => {
    if (isAuthenticated) {
      const demoConversations: Conversation[] = [
        {
          id: "conv-1",
          type: "direct",
          subject: "iPhone 15 Pro Purchase",
          participants: [1, 2],
          lastMessage: {
            content: "Is the phone still available?",
            timestamp: "2024-01-15T10:30:00Z",
            sender: "John Doe",
          },
          unreadCount: 2,
          isArchived: false,
        },
        {
          id: "conv-2",
          type: "direct",
          subject: "Auction Question",
          participants: [1, 3],
          lastMessage: {
            content: "When does the auction end?",
            timestamp: "2024-01-15T09:15:00Z",
            sender: "Jane Smith",
          },
          unreadCount: 0,
          isArchived: false,
        },
        {
          id: "conv-3",
          type: "support",
          subject: "Payment Issue",
          participants: [1, 4],
          lastMessage: {
            content: "We've resolved your payment issue. Please try again.",
            timestamp: "2024-01-14T16:45:00Z",
            sender: "Support Team",
          },
          unreadCount: 1,
          isArchived: false,
        },
      ]
      setConversations(demoConversations)
      setLoading(false)
    }
  }, [isAuthenticated])

  // Demo messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      const demoMessages: Message[] = [
        {
          id: 1,
          senderId: 2,
          senderName: "John Doe",
          content: "Hi! I'm interested in your iPhone 15 Pro listing.",
          messageType: "text",
          timestamp: "2024-01-15T10:00:00Z",
          isRead: true,
        },
        {
          id: 2,
          senderId: 1,
          senderName: user?.name || "You",
          content: "Hello! Yes, it's still available. Would you like to know more details?",
          messageType: "text",
          timestamp: "2024-01-15T10:15:00Z",
          isRead: true,
        },
        {
          id: 3,
          senderId: 2,
          senderName: "John Doe",
          content: "Is the phone still available?",
          messageType: "text",
          timestamp: "2024-01-15T10:30:00Z",
          isRead: false,
        },
      ]
      setMessages(demoMessages)
    }
  }, [selectedConversation, user])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: messages.length + 1,
      senderId: user?.id || 1,
      senderName: user?.name || "You",
      content: newMessage,
      messageType: "text",
      timestamp: new Date().toISOString(),
      isRead: false,
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.sender.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sign in to access messages</h2>
            <p className="text-muted-foreground">Connect with buyers and sellers on the platform</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Communicate with buyers and sellers</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-300px)]">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-accent transition-colors ${
                    selectedConversation === conversation.id ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>{conversation.lastMessage.sender.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">
                          {conversation.subject || conversation.lastMessage.sender}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="default" className="ml-2">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(conversation.lastMessage.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Message Thread */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">John Doe</h3>
                      <p className="text-sm text-muted-foreground">Online</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-400px)] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user?.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.senderId === user?.id ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <Separator />
                <div className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                    </div>
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-full">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground text-center">
                Choose a conversation from the list to start messaging
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
