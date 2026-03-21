"use client"

import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, adminSurface } from "@/components/admin/admin-ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function AdminCompetitionsPage() {
  const { state } = useAdmin()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Competitions"
        description="Season configuration, prize pools, and lifecycle for trader programmes."
      />
      <div className={cn(adminSurface, "overflow-x-auto")}>
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.08] hover:bg-transparent">
              <TableHead className="text-white/55">Season</TableHead>
              <TableHead className="text-white/55">Phase</TableHead>
              <TableHead className="text-white/55">Prize pool</TableHead>
              <TableHead className="text-right text-white/55">Entrants</TableHead>
              <TableHead className="text-white/55">Ends</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.competitions.map((c) => (
              <TableRow key={c.id} className="border-white/[0.06]">
                <TableCell className="font-medium text-white">{c.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="border-0 bg-white/10 text-white/85">
                    {c.phase}
                  </Badge>
                </TableCell>
                <TableCell className="text-emerald-400/90">{c.prizePool}</TableCell>
                <TableCell className="text-right tabular-nums text-white">{c.entrants}</TableCell>
                <TableCell className="text-white/60">{c.endsAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
