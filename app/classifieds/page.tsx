import { Navigation } from "@/components/navigation"
import { ClassifiedsGrid } from "@/components/classifieds-grid"
import { ClassifiedsFilters } from "@/components/classifieds-filters"
import { CreateClassifiedButton } from "@/components/create-classified-button"
import { Footer } from "@/components/footer"

export default function ClassifiedsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Classifieds Marketplace</h1>
            <p className="text-lg text-muted-foreground">
              Buy and sell items with CRED currency - completely free, no fees!
            </p>
          </div>
          <CreateClassifiedButton />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ClassifiedsFilters />
          </div>
          <div className="lg:col-span-3">
            <ClassifiedsGrid />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
