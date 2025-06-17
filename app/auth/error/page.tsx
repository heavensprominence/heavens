"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"

const errorMessages = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during authentication.",
  Signin: "Try signing in with a different account.",
  OAuthSignin: "Try signing in with a different account.",
  OAuthCallback: "Try signing in with a different account.",
  OAuthCreateAccount: "Try signing in with a different account.",
  EmailCreateAccount: "Try signing in with a different account.",
  Callback: "Try signing in with a different account.",
  OAuthAccountNotLinked: "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "Check your email address.",
  CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
  SessionRequired: "Please sign in to access this page.",
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") as keyof typeof errorMessages

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>{errorMessages[error] || errorMessages.Default}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error === "Configuration" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Server Configuration Issue</p>
                <p className="mt-1">
                  The authentication service is not properly configured. Please contact support or try again later.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href="/auth/signin">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>

          {process.env.NODE_ENV === "development" && error && (
            <div className="mt-4 p-3 bg-gray-100 rounded-md">
              <p className="text-xs text-gray-600">
                <strong>Debug Info:</strong> Error type: {error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
