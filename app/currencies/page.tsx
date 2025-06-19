import { Navigation } from "@/components/navigation"
import { CurrencyGrid } from "@/components/currency-grid"
import { QRGenerator } from "@/components/qr-generator"
import { PaperCurrencyOrder } from "@/components/paper-currency-order"
import { Footer } from "@/components/footer"

export default function CurrenciesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">CRED Currency System</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stable coins pegged to world currencies. Transparent, environmentally friendly, and globally accessible.
          </p>
        </div>

        <CurrencyGrid />
        <QRGenerator />
        <PaperCurrencyOrder />
      </div>
      <Footer />
    </div>
  )
}
