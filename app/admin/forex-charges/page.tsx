"use client"

import { cn } from "@/lib/utils"
import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, adminSurface } from "@/components/admin/admin-ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function AdminForexChargesPage() {
  const { state } = useAdmin()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Forex charges"
        description="Symbol-level economics: spread, commission, and overnight swap by product group."
      />
      <div className={cn(adminSurface, "overflow-x-auto")}>
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.08] hover:bg-transparent">
              <TableHead className="text-white/55">Symbol</TableHead>
              <TableHead className="text-white/55">Group</TableHead>
              <TableHead className="text-white/55">Spread</TableHead>
              <TableHead className="text-white/55">Commission</TableHead>
              <TableHead className="text-white/55">Swap long</TableHead>
              <TableHead className="text-white/55">Swap short</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.forexCharges.map((r) => (
              <TableRow key={r.symbol} className="border-white/[0.06]">
                <TableCell className="font-mono font-medium text-white">{r.symbol}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="border-0 bg-white/10 text-white/80">
                    {r.group}
                  </Badge>
                </TableCell>
                <TableCell className="text-white/80">{r.spread}</TableCell>
                <TableCell className="text-white/80">{r.commission}</TableCell>
                <TableCell className="text-red-300/90">{r.swapLong}</TableCell>
                <TableCell className="text-emerald-300/90">{r.swapShort}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
