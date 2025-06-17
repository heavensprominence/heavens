"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/simple-auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, CheckCircle, XCircle } from "lucide-react"

export function SimpleAuthStatus() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [isDevelopment, setIsDevelopment] = useState(false)

  useEffect(() => {
    // Check if we're in development by checking for localhost or development indicators
    const isDev =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.port === "3000"

    setIsDevelopment(isDev)
  }, [])

  if (!isDevelopment) {
    return null // Only show in development
  }

  return (
    <Card className="mb-4 border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <User className="h-4 w-4" />
          Authentication Status
        </CardTitle>
        <CardDescription className="text-xs">Current session information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant={isAuthenticated ? "default" : isLoading ? "secondary" : "destructive"}>
              {isAuthenticated && <CheckCircle className="w-3 h-3 mr-1" />}
              {!isAuthenticated && !isLoading && <XCircle className="w-3 h-3 mr-1" />}
              {isLoading ? "Loading..." : isAuthenticated ? "Authenticated" : "Not Authenticated"}
            </Badge>
          </div>

          {user && (
            <div className="text-xs space-y-1">
              <p>
                <strong>User:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              <p>
                <strong>ID:</strong> {user.id}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
