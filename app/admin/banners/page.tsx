"use client"

import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, adminSurface } from "@/components/admin/admin-ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function AdminBannersPage() {
  const { state } = useAdmin()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Banner management"
        description="Promotional placements across portal surfaces with scheduling and performance."
      />
      <div className={cn(adminSurface, "overflow-x-auto")}>
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.08] hover:bg-transparent">
              <TableHead className="text-white/55">Campaign</TableHead>
              <TableHead className="text-white/55">Slot</TableHead>
              <TableHead className="text-white/55">Status</TableHead>
              <TableHead className="text-right text-white/55">Impressions</TableHead>
              <TableHead className="text-white/55">CTR</TableHead>
              <TableHead className="text-white/55">Window</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.banners.map((b) => (
              <TableRow key={b.id} className="border-white/[0.06]">
                <TableCell className="font-medium text-white">{b.title}</TableCell>
                <TableCell className="text-white/70">{b.slot}</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "border-0",
                      b.status === "Live" && "bg-emerald-500/20 text-emerald-200",
                      b.status === "Scheduled" && "bg-sky-500/20 text-sky-100",
                      b.status === "Ended" && "bg-white/10 text-white/60"
                    )}
                  >
                    {b.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums text-white/85">{b.impressions.toLocaleString()}</TableCell>
                <TableCell className="text-white/75">{b.ctr}</TableCell>
                <TableCell className="text-xs text-white/50">
                  {b.starts} → {b.ends}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
