"use client"

import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, adminSurface } from "@/components/admin/admin-ui"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Target, Shield } from "lucide-react"

export default function AdminPropFirmPage() {
  const { state } = useAdmin()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Prop firm challenges"
        description="Challenge economics, drawdown rules, and funded-stage progression."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {state.propChallenges.map((p) => (
          <div key={p.id} className={cn(adminSurface, "p-6")}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-white/45">{p.id}</p>
                <h3 className="mt-1 text-lg font-semibold text-white">{p.name}</h3>
              </div>
              <Badge
                className={cn(
                  "border-0",
                  p.status === "Live" && "bg-emerald-500/20 text-emerald-200",
                  p.status === "Paused" && "bg-amber-500/20 text-amber-100"
                )}
              >
                {p.status}
              </Badge>
            </div>
            <div className="mt-4 space-y-3 text-sm text-white/75">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-red-400/80" />
                <span>Profit targets: {p.profitTarget}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-sky-400/80" />
                <span>Drawdown: {p.maxDrawdown}</span>
              </div>
              <p>
                <span className="text-white/45">Fee: </span>
                {p.fee}
              </p>
              <p>
                <span className="text-white/45">Phases: </span>
                {p.phases}
              </p>
              <p>
                <span className="text-white/45">Active accounts: </span>
                <span className="font-semibold text-white">{p.activeAccounts}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
