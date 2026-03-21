"use client"

import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, adminSurface } from "@/components/admin/admin-ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function AdminEmailPage() {
  const { state } = useAdmin()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Email management"
        description="Transactional and lifecycle templates with delivery analytics."
      />
      <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0)_40%),#0c0c0c] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.08] hover:bg-transparent">
              <TableHead className="text-white/55">Template</TableHead>
              <TableHead className="text-white/55">Trigger</TableHead>
              <TableHead className="text-white/55">Channel</TableHead>
              <TableHead className="text-white/55">Last send</TableHead>
              <TableHead className="text-white/55">Open rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.emailTemplates.map((e) => (
              <TableRow key={e.id} className="border-white/[0.06]">
                <TableCell className="font-medium text-white">{e.name}</TableCell>
                <TableCell className="font-mono text-xs text-white/60">{e.trigger}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="border-0 bg-white/10 text-white/80">
                    {e.channel}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-white/45">{new Date(e.lastSent).toLocaleString()}</TableCell>
                <TableCell className="text-emerald-400/90">{e.openRate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
