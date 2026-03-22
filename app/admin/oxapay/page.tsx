"use client"

import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, AdminPrimaryButton, adminSurface } from "@/components/admin/admin-ui"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function AdminOxapayPage() {
  const { state, testOxapayConnection } = useAdmin()
  const o = state.oxapay

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Oxapay gateway"
        description="Crypto payment routing, webhooks, and settlement health."
        actions={
          <AdminPrimaryButton
            onClick={() => {
              testOxapayConnection()
              toast.success("Connection OK — status updated")
            }}
          >
            Test connection
          </AdminPrimaryButton>
        }
      />
      <div className={cn(adminSurface, "grid gap-6 p-6 lg:grid-cols-[1fr_280px]")}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white/70">Merchant ID</Label>
            <Input readOnly value={o.merchantId} className="border-white/10 bg-black/50 font-mono text-sm text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-white/70">Webhook secret</Label>
            <Input readOnly value={o.webhookSecret} className="border-white/10 bg-black/50 font-mono text-sm text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-white/70">Environment</Label>
            <Input readOnly value={o.environment} className="border-white/10 bg-black/50 text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-white/70">Last settlement</Label>
            <Input readOnly value={new Date(o.lastSettlement).toLocaleString()} className="border-white/10 bg-black/50 text-white" />
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-xl border border-white/[0.06] bg-black/40 p-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/45">Link status</p>
            <Badge
              className={cn(
                "mt-3 border-0 px-3 py-1",
                o.status === "Connected" && "bg-emerald-500/20 text-emerald-200",
                o.status === "Degraded" && "bg-amber-500/20 text-amber-100",
                o.status === "Disconnected" && "bg-red-500/20 text-red-200"
              )}
            >
              {o.status}
            </Badge>
          </div>
          <p className="text-xs text-white/40">Rotate secrets from the payment provider console; updates propagate within 60s.</p>
        </div>
      </div>
    </div>
  )
}
