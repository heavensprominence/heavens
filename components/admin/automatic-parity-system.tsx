"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Activity, TrendingUp, TrendingDown, Zap, Target } from "lucide-react"

interface ParityConfig {
  currency_code: string
  auto_enabled: boolean
  deviation_threshold: number
  max_daily_mint: number
  max_daily_burn: number
  cooldown_minutes: number
  last_action_at: string | null
}

interface ExchangeRate {
  currency_code: string
  target_rate: number
  current_rate: number
  market_rate: number
  deviation_percentage: number
  last_updated: string
}

interface MonetaryAction {
  id: number
  currency_code: string
  action_type: string
  amount: number
  trigger_rate: number
  target_rate: number
  deviation_threshold: number
  executed_at: string
  reason: string
}

export function AutomaticParitySystem() {
  const [configs, setConfigs] = useState<ParityConfig[]>([])
  const [rates, setRates] = useState<ExchangeRate[]>([])
  const [recentActions, setRecentActions] = useState<MonetaryAction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchParityData()
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchParityData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchParityData = async () => {
    try {
      const [configRes, ratesRes, actionsRes] = await Promise.all([
        fetch("/api/admin/parity/config"),
        fetch("/api/admin/parity/rates"),
        fetch("/api/admin/parity/actions?limit=10"),
      ])

      if (configRes.ok) setConfigs(await configRes.json())
      if (ratesRes.ok) setRates(await ratesRes.json())
      if (actionsRes.ok) setRecentActions(await actionsRes.json())
    } catch (error) {
      console.error("Error fetching parity data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleAutoMode = async (currencyCode: string, enabled: boolean) => {
    try {
      const response = await fetch("/api/admin/parity/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency_code: currencyCode,
          auto_enabled: enabled,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Automatic parity ${enabled ? "enabled" : "disabled"} for ${currencyCode}`,
        })
        fetchParityData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update parity configuration",
        variant: "destructive",
      })
    }
  }

  const triggerManualAction = async (currencyCode: string, actionType: "mint" | "burn") => {
    try {
      const response = await fetch("/api/admin/parity/manual-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency_code: currencyCode,
          action_type: actionType,
          reason: `Manual ${actionType} triggered by admin`,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Manual ${actionType} executed for ${currencyCode}`,
        })
        fetchParityData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to execute manual ${actionType}`,
        variant: "destructive",
      })
    }
  }

  const getDeviationColor = (deviation: number) => {
    const abs = Math.abs(deviation)
    if (abs < 1) return "text-green-600"
    if (abs < 2) return "text-yellow-600"
    if (abs < 5) return "text-orange-600"
    return "text-red-600"
  }

  const getDeviationBadge = (deviation: number) => {
    const abs = Math.abs(deviation)
    if (abs < 1)
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Stable
        </Badge>
      )
    if (abs < 2)
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Watch
        </Badge>
      )
    if (abs < 5)
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          Alert
        </Badge>
      )
    return <Badge variant="destructive">Critical</Badge>
  }

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading parity system...</div>
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Automatic Parity Management
          </CardTitle>
          <CardDescription>
            Real-time monitoring and automatic minting/burning to maintain currency parity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{configs.filter((c) => c.auto_enabled).length}</div>
              <div className="text-sm text-muted-foreground">Auto-Enabled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {rates.filter((r) => Math.abs(r.deviation_percentage) < 1).length}
              </div>
              <div className="text-sm text-muted-foreground">In Parity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {rates.filter((r) => Math.abs(r.deviation_percentage) >= 2).length}
              </div>
              <div className="text-sm text-muted-foreground">Need Action</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{recentActions.length}</div>
              <div className="text-sm text-muted-foreground">Recent Actions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-time Currency Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rates.map((rate) => {
              const config = configs.find((c) => c.currency_code === rate.currency_code)
              return (
                <div key={rate.currency_code} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-semibold">{rate.currency_code}</div>
                      <div className="text-sm text-muted-foreground">Target: {rate.target_rate.toFixed(6)}</div>
                    </div>
                    <div>
                      <div className="font-mono">Current: {rate.current_rate.toFixed(6)}</div>
                      <div className={`text-sm font-medium ${getDeviationColor(rate.deviation_percentage)}`}>
                        {rate.deviation_percentage > 0 ? "+" : ""}
                        {rate.deviation_percentage.toFixed(2)}%
                      </div>
                    </div>
                    {getDeviationBadge(rate.deviation_percentage)}
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={config?.auto_enabled || false}
                      onCheckedChange={(enabled) => toggleAutoMode(rate.currency_code, enabled)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => triggerManualAction(rate.currency_code, "mint")}
                      className="text-green-600"
                    >
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => triggerManualAction(rate.currency_code, "burn")}
                      className="text-red-600"
                    >
                      <TrendingDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Automatic Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Recent Automatic Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  {action.action_type === "auto_mint" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <div>
                    <div className="font-medium">
                      {action.action_type === "auto_mint" ? "Minted" : "Burned"} {action.amount.toLocaleString()}{" "}
                      {action.currency_code}
                    </div>
                    <div className="text-sm text-muted-foreground">{action.reason}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">{new Date(action.executed_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
