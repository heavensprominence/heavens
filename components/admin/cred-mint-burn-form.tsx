"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Coins, Plus, Minus } from "lucide-react"

const CURRENCIES = [
  "USD-CRED",
  "CAD-CRED",
  "EUR-CRED",
  "GBP-CRED",
  "JPY-CRED",
  "AUD-CRED",
  "CHF-CRED",
  "CNY-CRED",
  "INR-CRED",
  "BRL-CRED",
]

export function CREDMintBurnForm() {
  const [operation, setOperation] = useState<"mint" | "burn">("mint")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("")
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || !currency || !reason) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/cred/mint-burn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation,
          amount: Number.parseFloat(amount),
          currency,
          reason,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Successfully ${operation === "mint" ? "minted" : "burned"} ${amount} ${currency}`,
        })
        setAmount("")
        setCurrency("")
        setReason("")
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Operation failed",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Mint/Burn CRED
        </CardTitle>
        <CardDescription>Create or destroy CRED tokens to maintain currency parity</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant={operation === "mint" ? "default" : "outline"}
              onClick={() => setOperation("mint")}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Mint
            </Button>
            <Button
              type="button"
              variant={operation === "burn" ? "default" : "outline"}
              onClick={() => setOperation("burn")}
              className="flex items-center gap-2"
            >
              <Minus className="h-4 w-4" />
              Burn
            </Button>
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to mint/burn"
              required
            />
          </div>

          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select value={currency} onValueChange={setCurrency} required>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((curr) => (
                  <SelectItem key={curr} value={curr}>
                    {curr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the reason for this operation..."
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : `${operation === "mint" ? "Mint" : "Burn"} CRED`}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
