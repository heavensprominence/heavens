import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CREDMintBurnForm } from "@/components/admin/cred-mint-burn-form"
import { CREDStats } from "@/components/admin/cred-stats"

export default async function CREDManagementPage() {
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== "owner") {
    redirect("/admin")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">CRED Management</h1>
        <p className="text-muted-foreground">
          Mint and burn CRED tokens to maintain currency parity and system stability.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <CREDStats />
        <CREDMintBurnForm />
      </div>
    </div>
  )
}
