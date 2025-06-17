import { DatabaseSetupWizard } from "@/components/admin/database-setup-wizard"

export default function AdminPage() {
  return (
    <div>
      {/* Show setup wizard if database is not configured */}
      <DatabaseSetupWizard />
      {/* Add a prominent call-to-action card for database setup when in demo mode. */}
    </div>
  )
}
