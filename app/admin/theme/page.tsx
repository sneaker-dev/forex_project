"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, AdminPrimaryButton, adminSurface } from "@/components/admin/admin-ui"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import Image from "next/image"

export default function AdminThemePage() {
  const { state } = useAdmin()
  const [t, setT] = useState(state.theme)

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Client portal theme"
        description="Brand tokens applied to the trader-facing application shell."
        actions={
          <AdminPrimaryButton
            onClick={() => toast.success("Theme draft saved", { description: "Would propagate to edge config in production." })}
          >
            Publish draft
          </AdminPrimaryButton>
        }
      />
      <div className={cn(adminSurface, "grid gap-6 p-6 lg:grid-cols-2")}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white/70">Brand name</Label>
            <Input value={t.brandName} onChange={(e) => setT({ ...t, brandName: e.target.value })} className="border-white/10 bg-black/50 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/70">Primary</Label>
              <Input type="text" value={t.primaryHex} onChange={(e) => setT({ ...t, primaryHex: e.target.value })} className="border-white/10 bg-black/50 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Accent</Label>
              <Input type="text" value={t.accentHex} onChange={(e) => setT({ ...t, accentHex: e.target.value })} className="border-white/10 bg-black/50 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-white/70">Density</Label>
            <Select value={t.clientPortalDensity} onValueChange={(v) => setT({ ...t, clientPortalDensity: v as typeof t.clientPortalDensity })}>
              <SelectTrigger className="border-white/10 bg-black/50 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Comfortable">Comfortable</SelectItem>
                <SelectItem value="Compact">Compact</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-3">
          <Label className="text-white/70">Logo preview</Label>
          <div className="flex items-center justify-center rounded-xl border border-white/10 bg-black/40 p-8">
            <Image src={t.logoUrl} alt="" width={64} height={64} className="h-16 w-16 object-contain" />
          </div>
          <p className="text-xs text-white/40">Raster/SVG served from CDN in production; path stored as reference.</p>
        </div>
      </div>
    </div>
  )
}
