"use client"

import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { CurrencyShowcase } from "@/components/currency-showcase"
import { RegistrationBonus } from "@/components/registration-bonus"
import { LiveStats } from "@/components/live-stats"
import { PublicLedger } from "@/components/public-ledger"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Hero />
      <LiveStats />
      <RegistrationBonus />
      <CurrencyShowcase />
      <Features />
      <PublicLedger />
    </div>
  )
}
