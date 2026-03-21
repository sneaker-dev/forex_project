"use client"

import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, adminSurface } from "@/components/admin/admin-ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function AdminBankSettingsPage() {
  const { state } = useAdmin()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Banking rails"
        description="Settlement paths, currencies, and operational status for treasury."
      />
      <div className={cn(adminSurface, "overflow-x-auto")}>
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.08] hover:bg-transparent">
              <TableHead className="text-white/55">Rail</TableHead>
              <TableHead className="text-white/55">Region</TableHead>
              <TableHead className="text-white/55">Currencies</TableHead>
              <TableHead className="text-white/55">Settlement</TableHead>
              <TableHead className="text-white/55">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.bankRails.map((b) => (
              <TableRow key={b.id} className="border-white/[0.06]">
                <TableCell className="font-medium text-white">{b.name}</TableCell>
                <TableCell className="text-white/70">{b.region}</TableCell>
                <TableCell className="text-white/80">{b.currency}</TableCell>
                <TableCell className="text-white/60">{b.settlement}</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "border-0",
                      b.status === "Live" && "bg-emerald-500/20 text-emerald-200",
                      b.status === "Maintenance" && "bg-amber-500/20 text-amber-100",
                      b.status === "Offline" && "bg-red-500/20 text-red-200"
                    )}
                  >
                    {b.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
