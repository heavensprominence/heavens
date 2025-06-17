"use client"

import type React from "react"
import { SessionProvider } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    // Listen for NextAuth errors
    const handleError = (event: any) => {
      if (event.detail?.error?.includes("CLIENT_FETCH_ERROR")) {
        setHasError(true)
      }
    }

    window.addEventListener("nextauth:error", handleError)
    return () => window.removeEventListener("nextauth:error", handleError)
  }, [])

  const handleRetry = () => {
    setHasError(false)
    setRetryCount((prev) => prev + 1)
    // Force a page reload to retry authentication
    window.location.reload()
  }

  if (hasError && retryCount < 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle>Authentication Service Issue</CardTitle>
            <CardDescription>
              There's a temporary issue with the authentication service. This usually resolves quickly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Connection
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">Attempt {retryCount + 1} of 3</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <SessionProvider
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  )
}
