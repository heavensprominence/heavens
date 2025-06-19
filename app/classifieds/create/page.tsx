import { Navigation } from "@/components/navigation"
import { CreateClassifiedForm } from "@/components/create-classified-form"
import { Footer } from "@/components/footer"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function CreateClassifiedPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Create Listing</h1>
            <p className="text-lg text-muted-foreground">
              Post your item for sale or create a wanted ad - completely free!
            </p>
          </div>
          <CreateClassifiedForm />
        </div>
      </div>
      <Footer />
    </div>
  )
}
