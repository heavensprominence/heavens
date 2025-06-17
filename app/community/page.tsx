"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/simple-auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Users, TrendingUp, Pin, Lock, Search, Plus, Eye, MessageCircle, Clock } from "lucide-react"

interface ForumCategory {
  id: number
  name: string
  description: string
  icon: string
  topicCount: number
  postCount: number
  lastActivity: {
    topicTitle: string
    userName: string
    timestamp: string
  }
}

interface ForumTopic {
  id: number
  categoryId: number
  title: string
  content: string
  author: {
    name: string
    avatar: string
  }
  isPinned: boolean
  isLocked: boolean
  viewCount: number
  replyCount: number
  lastReply: {
    userName: string
    timestamp: string
  }
  createdAt: string
}

export default function CommunityPage() {
  const { user, isAuthenticated } = useAuth()
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [recentTopics, setRecentTopics] = useState<ForumTopic[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  // Demo data
  useEffect(() => {
    const demoCategories: ForumCategory[] = [
      {
        id: 1,
        name: "General Discussion",
        description: "General platform discussions and questions",
        icon: "MessageSquare",
        topicCount: 156,
        postCount: 1243,
        lastActivity: {
          topicTitle: "Welcome to Heavenslive!",
          userName: "Admin",
          timestamp: "2024-01-15T10:30:00Z",
        },
      },
      {
        id: 2,
        name: "Marketplace",
        description: "Buy, sell, and trade discussions",
        icon: "ShoppingBag",
        topicCount: 89,
        postCount: 567,
        lastActivity: {
          topicTitle: "Best practices for product listings",
          userName: "SellerPro",
          timestamp: "2024-01-15T09:15:00Z",
        },
      },
      {
        id: 3,
        name: "CRED Trading",
        description: "Cryptocurrency trading and market discussions",
        icon: "Coins",
        topicCount: 234,
        postCount: 1876,
        lastActivity: {
          topicTitle: "CRED price analysis for January",
          userName: "CryptoExpert",
          timestamp: "2024-01-15T08:45:00Z",
        },
      },
      {
        id: 4,
        name: "Technical Support",
        description: "Get help with platform issues",
        icon: "HelpCircle",
        topicCount: 67,
        postCount: 234,
        lastActivity: {
          topicTitle: "Payment processing delays",
          userName: "SupportTeam",
          timestamp: "2024-01-14T16:20:00Z",
        },
      },
    ]

    const demoTopics: ForumTopic[] = [
      {
        id: 1,
        categoryId: 1,
        title: "Welcome to the Heavenslive Community!",
        content: "We're excited to have you join our growing community...",
        author: {
          name: "Admin",
          avatar: "/placeholder.svg",
        },
        isPinned: true,
        isLocked: false,
        viewCount: 1234,
        replyCount: 45,
        lastReply: {
          userName: "NewUser123",
          timestamp: "2024-01-15T10:30:00Z",
        },
        createdAt: "2024-01-01T00:00:00Z",
      },
      {
        id: 2,
        categoryId: 2,
        title: "Tips for successful marketplace selling",
        content: "Here are some proven strategies to increase your sales...",
        author: {
          name: "SellerPro",
          avatar: "/placeholder.svg",
        },
        isPinned: false,
        isLocked: false,
        viewCount: 567,
        replyCount: 23,
        lastReply: {
          userName: "MarketMaster",
          timestamp: "2024-01-15T09:15:00Z",
        },
        createdAt: "2024-01-14T12:00:00Z",
      },
      {
        id: 3,
        categoryId: 3,
        title: "CRED market trends and predictions",
        content: "Let's discuss the current market trends for CRED...",
        author: {
          name: "CryptoExpert",
          avatar: "/placeholder.svg",
        },
        isPinned: false,
        isLocked: false,
        viewCount: 892,
        replyCount: 67,
        lastReply: {
          userName: "TraderJoe",
          timestamp: "2024-01-15T08:45:00Z",
        },
        createdAt: "2024-01-13T15:30:00Z",
      },
    ]

    setCategories(demoCategories)
    setRecentTopics(demoTopics)
    setLoading(false)
  }, [])

  const filteredTopics = recentTopics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.author.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Community Forum</h1>
          <p className="text-muted-foreground">Connect, discuss, and share with the Heavenslive community</p>
        </div>
        {isAuthenticated && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Topic
          </Button>
        )}
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <p className="text-2xl font-bold">12,543</p>
              <p className="text-muted-foreground">Community Members</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <MessageSquare className="h-8 w-8 text-green-600 mr-4" />
            <div>
              <p className="text-2xl font-bold">546</p>
              <p className="text-muted-foreground">Active Topics</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="h-8 w-8 text-purple-600 mr-4" />
            <div>
              <p className="text-2xl font-bold">3,920</p>
              <p className="text-muted-foreground">Total Posts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forum Categories */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Forum Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{category.topicCount} topics</span>
                    <span>{category.postCount} posts</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Last: {category.lastActivity.topicTitle} by {category.lastActivity.userName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Topics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Topics</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={topic.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{topic.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {topic.isPinned && <Pin className="h-4 w-4 text-blue-600" />}
                    {topic.isLocked && <Lock className="h-4 w-4 text-gray-600" />}
                    <h3 className="font-semibold truncate">{topic.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    by {topic.author.name} • {new Date(topic.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{topic.viewCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{topic.replyCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Last reply by {topic.lastReply.userName}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredTopics.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No topics found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search query" : "Be the first to start a discussion!"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
