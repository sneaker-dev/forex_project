"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, AdminPanel, adminSurface } from "@/components/admin/admin-ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, CartesianGrid } from "recharts"

export default function AdminEarningsPage() {
  const { state } = useAdmin()

  const rows = useMemo(() => {
    return state.ibNodes.map((n) => ({
      name: n.name,
      commission: n.commissionUsd,
      volume: n.volumeUsd,
    }))
  }, [state.ibNodes])

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Earnings & partner share"
        description="IB commissions and indexed revenue attribution — finance-grade roll-up."
      />
      <AdminPanel title="Commission by IB (MTD)" description="Synthetic month from seed data">
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows}>
              <defs>
                <linearGradient id="earnIb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(15, 23, 42, 0.96)",
                  border: "1px solid rgba(148, 163, 184, 0.15)",
                  borderRadius: 14,
                  color: "#f1f5f9",
                }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, "Commission"]}
              />
              <Bar dataKey="commission" fill="url(#earnIb)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </AdminPanel>
      <div className={cn(adminSurface, "overflow-x-auto")}>
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.08] hover:bg-transparent">
              <TableHead className="text-white/55">Partner</TableHead>
              <TableHead className="text-right text-white/55">Volume (USD)</TableHead>
              <TableHead className="text-right text-white/55">Commission (USD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.name} className="border-white/[0.06]">
                <TableCell className="font-medium text-white">{r.name}</TableCell>
                <TableCell className="text-right tabular-nums text-white/80">${r.volume.toLocaleString()}</TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-emerald-400/90">
                  ${r.commission.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
