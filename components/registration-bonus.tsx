"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Coins } from "lucide-react"
import { useAuth } from "@/components/auth-context"

export function RegistrationBonus() {
  const [showBonus, setShowBonus] = useState(false)
  const [claimed, setClaimed] = useState(false)
  const { user, updateCredBalance } = useAuth()

  useEffect(() => {
    if (user && !claimed) {
      const hasClaimedBonus = localStorage.getItem(`bonus_claimed_${user.id}`)
      if (!hasClaimedBonus) {
        setShowBonus(true)
      } else {
        setClaimed(true)
      }
    }
  }, [user, claimed])

  const claimBonus = () => {
    if (user) {
      const newBalance = user.credBalance + 100
      updateCredBalance(newBalance)
      localStorage.setItem(`bonus_claimed_${user.id}`, "true")
      setClaimed(true)
      setShowBonus(false)
    }
  }

  if (!user || !showBonus || claimed) {
    return null
  }

  return (
    <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
          <Gift className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
        </div>
        <CardTitle className="text-xl text-yellow-800 dark:text-yellow-200">Welcome Bonus!</CardTitle>
        <CardDescription className="text-yellow-700 dark:text-yellow-300">
          Congratulations on joining HeavensLive! Claim your welcome bonus now.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-4 flex items-center justify-center space-x-2">
          <Coins className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          <span className="text-3xl font-bold text-yellow-800 dark:text-yellow-200">₡100</span>
        </div>
        <p className="mb-4 text-sm text-yellow-700 dark:text-yellow-300">
          Use your CRED to trade, bid on auctions, and explore our marketplace!
        </p>
        <Button onClick={claimBonus} className="bg-yellow-600 hover:bg-yellow-700 text-white">
          Claim Your Bonus
        </Button>
      </CardContent>
    </Card>
  )
}
