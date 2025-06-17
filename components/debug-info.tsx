"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, Database, Shield } from "lucide-react"

export function DebugInfo() {
  const [showDebug, setShowDebug] = useState(false)

  if (!showDebug) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDebug(true)}
          className="bg-background/80 backdrop-blur"
        >
          <Eye className="h-4 w-4 mr-2" />
          Debug
        </Button>
      </div>
    )
  }

  const checkDatabaseConnection = async () => {
    try {
      const response = await fetch("/api/health/database")
      const data = await response.json()
      console.log("Database health check:", data)
    } catch (error) {
      console.error("Database health check failed:", error)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Debug Information</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowDebug(false)}>
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Environment:</span>
              <Badge variant="outline">{process.env.NODE_ENV || "development"}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Database:</span>
              <Badge variant={process.env.DATABASE_URL ? "default" : "destructive"}>
                {process.env.DATABASE_URL ? "Connected" : "Not configured"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Auth:</span>
              <Badge variant="default">SimpleAuth</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Button variant="outline" size="sm" onClick={checkDatabaseConnection} className="w-full">
              <Database className="h-4 w-4 mr-2" />
              Test Database
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log("Current user:", localStorage.getItem("heavenslive_user"))}
              className="w-full"
            >
              <Shield className="h-4 w-4 mr-2" />
              Check Auth
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
