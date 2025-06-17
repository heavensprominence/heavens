"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X, ExternalLink } from "lucide-react"

export function DemoModeBanner() {
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if we're in demo mode by testing the health endpoint
    const checkDemoMode = async () => {
      try {
        const response = await fetch("/api/health")
        if (response.ok) {
          const data = await response.json()
          setIsDemoMode(!data.env?.database)
        }
      } catch (error) {
        setIsDemoMode(true)
      }
    }

    checkDemoMode()
  }, [])

  if (!isDemoMode || !isVisible) {
    return null
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50 mx-4 mt-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                  Demo Mode
                </Badge>
                <span className="text-sm font-medium">Database not configured</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Limited functionality. Use <strong>admin@demo.com / demo123</strong> to sign in.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="https://neon.tech" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Get Database
              </a>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
