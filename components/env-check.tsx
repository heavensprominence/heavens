"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export function EnvCheck() {
  const [envStatus, setEnvStatus] = useState<{
    database: boolean
    nextauth: boolean
    google: boolean
  }>({
    database: false,
    nextauth: false,
    google: false,
  })
  const [isDevelopment, setIsDevelopment] = useState(false)

  useEffect(() => {
    // Check if we're in development by checking for localhost or development indicators
    const isDev =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.port === "3000"

    setIsDevelopment(isDev)

    if (isDev) {
      // Check environment variables (client-side detection)
      const checkEnv = async () => {
        try {
          const response = await fetch("/api/health")
          if (response.ok) {
            const data = await response.json()
            setEnvStatus(data.env || envStatus)
          }
        } catch (error) {
          console.error("Environment check failed:", error)
        }
      }

      checkEnv()
    }
  }, [])

  if (!isDevelopment) {
    return null // Only show in development
  }

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-sm">Environment Status</CardTitle>
        <CardDescription className="text-xs">Development environment check</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge variant={envStatus.database ? "default" : "destructive"} className="text-xs">
            {envStatus.database ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
            Database
          </Badge>
          <Badge variant={envStatus.nextauth ? "default" : "destructive"} className="text-xs">
            {envStatus.nextauth ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
            Auth System
          </Badge>
          <Badge variant={envStatus.google ? "default" : "secondary"} className="text-xs">
            {envStatus.google ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
            Google OAuth
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
