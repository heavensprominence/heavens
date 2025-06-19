import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { RegistrationBonus } from "@/components/registration-bonus"
import { PublicLedger } from "@/components/public-ledger"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Features />
      <RegistrationBonus />
      <PublicLedger />
    </div>
  )
}
