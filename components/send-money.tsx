"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WORLD_CURRENCIES } from "@/lib/currencies"
import { Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SendMoney() {
  const { toast } = useToast()
  const [sendData, setSendData] = useState({
    recipient: "",
    amount: "",
    currency: "USD-CRED",
    message: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/wallet/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendData),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Money Sent!",
          description: `Successfully sent ${sendData.amount} ${sendData.currency} to ${sendData.recipient}`,
        })
        setSendData({ recipient: "", amount: "", currency: "USD-CRED", message: "" })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send money",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send money",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Send Money
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="recipient">Recipient Email</Label>
            <Input
              id="recipient"
              type="email"
              placeholder="recipient@example.com"
              value={sendData.recipient}
              onChange={(e) => setSendData({ ...sendData, recipient: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={sendData.amount}
              onChange={(e) => setSendData({ ...sendData, amount: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={sendData.currency} onValueChange={(value) => setSendData({ ...sendData, currency: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WORLD_CURRENCIES.slice(0, 10).map((currency) => (
                  <SelectItem key={currency.code} value={`${currency.code}-CRED`}>
                    {currency.emoji} {currency.code}-CRED
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="What's this payment for?"
              value={sendData.message}
              onChange={(e) => setSendData({ ...sendData, message: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Money"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
