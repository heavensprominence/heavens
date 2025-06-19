"use client"

import { Navigation } from "@/components/navigation"
import { WalletOverview } from "@/components/wallet-overview"
import { TransactionHistory } from "@/components/transaction-history"
import { SendMoney } from "@/components/send-money"
import { Footer } from "@/components/footer"
import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function WalletPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Your CRED Wallet</h1>
          <p className="text-lg text-muted-foreground">Manage your CRED balance and transactions</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <WalletOverview />
            <TransactionHistory />
          </div>
          <div>
            <SendMoney />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
