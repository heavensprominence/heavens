"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, Shield, MessageSquare, Search, DollarSign } from "lucide-react"

interface AIStats {
  total_interactions: number
  active_recommendations: number
  fraud_alerts: number
  ai_conversations: number
  search_queries: number
  pricing_suggestions: number
}

interface FraudAlert {
  id: number
  alert_type: string
  risk_score: number
  description: string
  status: string
  created_at: string
}

export default function AIAdminPage() {
  const [stats, setStats] = useState<AIStats>({
    total_interactions: 0,
    active_recommendations: 0,
    fraud_alerts: 0,
    ai_conversations: 0,
    search_queries: 0,
    pricing_suggestions: 0,
  })
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAIData()
  }, [])

  const fetchAIData = async () => {
    try {
      // In demo mode, show simulated data
      setStats({
        total_interactions: 1247,
        active_recommendations: 89,
        fraud_alerts: 3,
        ai_conversations: 156,
        search_queries: 892,
        pricing_suggestions: 23,
      })

      setFraudAlerts([
        {
          id: 1,
          alert_type: "unusual_transaction",
          risk_score: 0.75,
          description: "Large transaction from new location",
          status: "pending",
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          alert_type: "suspicious_login",
          risk_score: 0.6,
          description: "Login attempt from unusual device",
          status: "pending",
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ])
    } catch (error) {
      console.error("Error fetching AI data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskBadge = (score: number) => {
    if (score >= 0.8) return <Badge variant="destructive">High Risk</Badge>
    if (score >= 0.6) return <Badge className="bg-orange-100 text-orange-800">Medium Risk</Badge>
    return <Badge variant="secondary">Low Risk</Badge>
  }

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading AI dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6" />
        <h1 className="text-2xl font-bold">AI & Automation Dashboard</h1>
      </div>

      {/* AI Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_interactions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">User behavior tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_recommendations}</div>
            <p className="text-xs text-muted-foreground">Active suggestions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Fraud Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.fraud_alerts}</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              AI Chats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ai_conversations}</div>
            <p className="text-xs text-muted-foreground">Conversations handled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Search className="h-4 w-4" />
              Smart Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.search_queries}</div>
            <p className="text-xs text-muted-foreground">Queries processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Price AI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pricing_suggestions}</div>
            <p className="text-xs text-muted-foreground">Pricing suggestions</p>
          </CardContent>
        </Card>
      </div>

      {/* Fraud Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Recent Fraud Alerts
          </CardTitle>
          <CardDescription>AI-detected suspicious activities requiring review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fraudAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Shield className="h-5 w-5 text-red-500" />
                  <div>
                    <div className="font-medium">{alert.alert_type.replace("_", " ").toUpperCase()}</div>
                    <div className="text-sm text-muted-foreground">{alert.description}</div>
                  </div>
                  {getRiskBadge(alert.risk_score)}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">{new Date(alert.created_at).toLocaleDateString()}</div>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Features Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Features Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Smart Recommendations</span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Fraud Detection</span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>AI Chatbot</span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Smart Search</span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Dynamic Pricing</span>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Recommendation Click Rate</span>
              <span className="font-bold text-green-600">23.4%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Fraud Detection Accuracy</span>
              <span className="font-bold text-green-600">94.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>AI Chat Resolution Rate</span>
              <span className="font-bold text-green-600">78.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Search Success Rate</span>
              <span className="font-bold text-green-600">89.1%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pricing Optimization</span>
              <span className="font-bold text-green-600">+12.3%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
