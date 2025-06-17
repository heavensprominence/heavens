"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, AlertCircle, CheckCircle } from "lucide-react"

export function AuthStatus() {
  const { data: session, status } = useSession()

  if (process.env.NODE_ENV !== "development") {
    return null
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
            <Badge
              variant={status === "authenticated" ? "default" : status === "loading" ? "secondary" : "destructive"}
            >
              {status === "authenticated" && <CheckCircle className="w-3 h-3 mr-1" />}
              {status === "unauthenticated" && <AlertCircle className="w-3 h-3 mr-1" />}
              {status}
            </Badge>
          </div>

          {session && (
            <div className="text-xs space-y-1">
              <p>
                <strong>User:</strong> {session.user?.name}
              </p>
              <p>
                <strong>Email:</strong> {session.user?.email}
              </p>
              <p>
                <strong>Role:</strong> {session.user?.role}
              </p>
              <p>
                <strong>ID:</strong> {session.user?.id}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
