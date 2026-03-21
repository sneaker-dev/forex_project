"use client"

import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, adminSurface } from "@/components/admin/admin-ui"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function AdminAccountTypesPage() {
  const { state } = useAdmin()
  const [on, setOn] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(state.accountTypes.map((a) => [a.id, a.active]))
  )

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Account types"
        description="Product packaging: leverage, minimums, and execution economics."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {state.accountTypes.map((a) => (
          <div key={a.id} className={cn(adminSurface, "flex flex-col p-6 transition hover:border-white/[0.12]")}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-white">{a.name}</h3>
              <Switch checked={on[a.id] ?? false} onCheckedChange={(v) => setOn((s) => ({ ...s, [a.id]: v }))} />
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-white/45">Leverage</dt>
                <dd className="font-medium text-white/90">{a.leverage}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/45">Min deposit</dt>
                <dd className="font-medium text-white/90">${a.minDeposit.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/45">Spread</dt>
                <dd className="text-white/80">{a.spread}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/45">Commission</dt>
                <dd className="text-white/80">{a.commission}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </div>
  )
}
