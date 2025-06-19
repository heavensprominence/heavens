import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { RegistrationBonus } from "@/components/registration-bonus"
import { PublicLedger } from "@/components/public-ledger"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <RegistrationBonus />
      <PublicLedger />
      <Features />
      <Footer />
    </div>
  )
}
