"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, RefreshCw, Database, ExternalLink, CheckCircle } from "lucide-react"

interface DatabaseStatus {
  connected: boolean
  configured: boolean
  error?: string
}

export function DatabaseStatus() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkConnection = async () => {
    setIsChecking(true)
    try {
      const response = await fetch("/api/admin/database-status")
      if (response.ok) {
        const data = await response.json()
        setStatus({
          connected: data.connected,
          configured: data.tablesReady !== false, // Assume configured if tables are ready
          error: data.error,
        })
      } else {
        const data = await response.json()
        setStatus({
          connected: false,
          configured: false,
          error: data.message || "Database check failed",
        })
      }
    } catch (err) {
      setStatus({
        connected: false,
        configured: false,
        error: "Failed to check database status",
      })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  // Don't show anything if database is working perfectly
  if (status?.connected && status?.configured) {
    return null
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50 mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isChecking ? (
            <RefreshCw className="h-5 w-5 animate-spin" />
          ) : status?.connected ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          )}
          Database Status
        </CardTitle>
        <CardDescription>
          {isChecking && "Checking database connection..."}
          {!isChecking && !status?.configured && "Database not configured - running in demo mode"}
          {!isChecking && status?.configured && !status?.connected && "Database connection issue"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={status?.configured ? "default" : "secondary"}>
              <Database className="h-3 w-3 mr-1" />
              {status?.configured ? "Configured" : "Not Configured"}
            </Badge>
            <Badge variant={status?.connected ? "default" : "destructive"}>
              {status?.connected ? "Connected" : "Disconnected"}
            </Badge>
          </div>

          {status?.error && (
            <div className="text-sm text-muted-foreground bg-white p-3 rounded border">
              <strong>Error:</strong> {status.error}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button onClick={checkConnection} size="sm" disabled={isChecking}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
              {isChecking ? "Checking..." : "Retry Connection"}
            </Button>

            {!status?.configured && (
              <Button variant="outline" size="sm" asChild>
                <a href="https://neon.tech" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Get Database
                </a>
              </Button>
            )}
          </div>

          {!status?.configured && (
            <div className="text-xs text-muted-foreground bg-white p-3 rounded border">
              <p className="font-medium mb-2">To set up the database:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Create a free Neon database at neon.tech</li>
                <li>Copy your connection string</li>
                <li>Add it as DATABASE_URL environment variable</li>
                <li>Run the database setup scripts</li>
              </ol>
              <p className="mt-2 text-yellow-700">
                <strong>Note:</strong> The app works in demo mode without a database, but features will be limited.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
