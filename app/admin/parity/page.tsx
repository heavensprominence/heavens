import { AutomaticParitySystem } from "@/components/admin/automatic-parity-system"

export default function ParityManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Automatic Parity Management</h1>
        <p className="text-muted-foreground">
          Monitor and automatically maintain currency parity through smart minting and burning
        </p>
      </div>

      <AutomaticParitySystem />
    </div>
  )
}
