import { Navigation } from "@/components/navigation"
import { AuctionsGrid } from "@/components/auctions-grid"
import { AuctionsFilters } from "@/components/auctions-filters"
import { CreateAuctionButton } from "@/components/create-auction-button"
import { Footer } from "@/components/footer"

export default function AuctionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Auctions Marketplace</h1>
            <p className="text-lg text-muted-foreground">
              Forward and reverse auctions with CRED currency - transparent and fair!
            </p>
          </div>
          <CreateAuctionButton />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <AuctionsFilters />
          </div>
          <div className="lg:col-span-3">
            <AuctionsGrid />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
