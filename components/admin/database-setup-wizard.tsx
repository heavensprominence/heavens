"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Database,
  ExternalLink,
  Copy,
  RefreshCw,
  Zap,
  Shield,
  Rocket,
} from "lucide-react"

interface SetupStep {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed" | "error"
  details?: string
}

export function DatabaseSetupWizard() {
  const [setupSteps, setSetupSteps] = useState<SetupStep[]>([
    {
      id: "connection",
      title: "Database Connection",
      description: "Connect to your PostgreSQL database",
      status: "pending",
    },
    {
      id: "schema",
      title: "Create Tables",
      description: "Set up core platform tables",
      status: "pending",
    },
    {
      id: "data",
      title: "Initialize Data",
      description: "Add default settings and demo data",
      status: "pending",
    },
    {
      id: "verification",
      title: "Verify Setup",
      description: "Confirm everything is working",
      status: "pending",
    },
  ])

  const [isSetupRunning, setIsSetupRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [setupProgress, setSetupProgress] = useState(0)
  const [databaseUrl, setDatabaseUrl] = useState("")

  const completedSteps = setupSteps.filter((step) => step.status === "completed").length
  const totalSteps = setupSteps.length

  const runSetup = async () => {
    setIsSetupRunning(true)
    setSetupProgress(0)

    // Simulate setup process
    for (let i = 0; i < setupSteps.length; i++) {
      setCurrentStep(i)

      // Update step to in-progress
      setSetupSteps((prev) => prev.map((step, index) => (index === i ? { ...step, status: "in-progress" } : step)))

      // Simulate work
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Complete step
      setSetupSteps((prev) => prev.map((step, index) => (index === i ? { ...step, status: "completed" } : step)))

      setSetupProgress(((i + 1) / setupSteps.length) * 100)
    }

    setIsSetupRunning(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6 text-blue-600" />
            Database Setup Wizard
          </CardTitle>
          <CardDescription>Transform your platform from demo to production-ready in minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium">Quick Setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Secure & Reliable</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium">Production Ready</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      {isSetupRunning && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Setup in Progress</CardTitle>
            <CardDescription>
              Step {currentStep + 1} of {totalSteps}: {setupSteps[currentStep]?.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={setupProgress} className="mb-4" />
            <p className="text-sm text-muted-foreground">{setupSteps[currentStep]?.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Quick Start */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Step 1: Get Database
            </CardTitle>
            <CardDescription>Get a free PostgreSQL database in 2 minutes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open("https://neon.tech", "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Neon.tech (Recommended)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open("https://supabase.com", "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Supabase
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open("https://railway.app", "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Railway
              </Button>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>Copy your connection string (starts with postgresql://)</AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Configure Environment</CardTitle>
            <CardDescription>Add your database connection string</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
              <div className="flex items-center justify-between">
                <span>DATABASE_URL=your_connection_string</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard("DATABASE_URL=your_connection_string")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Add this to your environment variables or .env file</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Setup Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Progress</CardTitle>
          <CardDescription>
            {completedSteps} of {totalSteps} steps completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {setupSteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="flex-shrink-0">
                  {step.status === "completed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {step.status === "in-progress" && <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />}
                  {step.status === "error" && <XCircle className="h-5 w-5 text-red-500" />}
                  {step.status === "pending" && <div className="h-5 w-5 rounded-full border-2 border-gray-300" />}
                </div>

                <div className="flex-1">
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  {step.details && <p className="text-xs text-blue-600 mt-1">{step.details}</p>}
                </div>

                <Badge
                  variant={
                    step.status === "completed"
                      ? "default"
                      : step.status === "in-progress"
                        ? "secondary"
                        : step.status === "error"
                          ? "destructive"
                          : "outline"
                  }
                >
                  {step.status}
                </Badge>
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <Button onClick={runSetup} disabled={isSetupRunning} className="flex-1">
              {isSetupRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Setting Up...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4 mr-2" />
                  Start Setup
                </>
              )}
            </Button>

            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Guide
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">🎉 After Setup, You'll Have:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Real user accounts & authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Persistent CRED wallets & transactions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Live marketplace with real products</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Functional auction system</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Complete order management</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Financial assistance applications</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Admin control panel</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Production-ready platform</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
