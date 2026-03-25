"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, adminSurface, adminTableWrap, adminTabsListClass, adminTabsTriggerClass } from "@/components/admin/admin-ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AccountPricingTier } from "@/lib/admin/types"

export default function AdminForexChargesPage() {
  const { state } = useAdmin()
  const [tier, setTier] = useState<AccountPricingTier>("Standard")

  const rows = useMemo(() => state.forexCharges.filter((r) => r.accountType === tier), [state.forexCharges, tier])

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Forex charges"
        description="Account-wise pricing (Standard / ECN / Raw): dynamic spreads (min + avg), swap, contract size, leverage, and margin."
      />

      <Tabs value={tier} onValueChange={(v) => setTier(v as AccountPricingTier)} className="space-y-4">
        <TabsList className={adminTabsListClass}>
          <TabsTrigger value="Standard" className={adminTabsTriggerClass}>
            Standard
          </TabsTrigger>
          <TabsTrigger value="ECN" className={adminTabsTriggerClass}>
            ECN
          </TabsTrigger>
          <TabsTrigger value="Raw" className={adminTabsTriggerClass}>
            Raw
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className={cn(adminSurface, "overflow-hidden")}>
        <div className="overflow-x-auto">
          <div className={adminTableWrap}>
            <Table>
              <TableHeader>
                <TableRow className="border-transparent hover:bg-transparent">
                  <TableHead className="text-white/55">Symbol</TableHead>
                  <TableHead className="text-white/55">Group</TableHead>
                  <TableHead className="text-white/55">Spread min</TableHead>
                  <TableHead className="text-white/55">Spread avg</TableHead>
                  <TableHead className="text-white/55">Commission</TableHead>
                  <TableHead className="text-white/55">Swap L/S</TableHead>
                  <TableHead className="text-white/55">Contract</TableHead>
                  <TableHead className="text-white/55">Lev max</TableHead>
                  <TableHead className="text-white/55">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={`${r.symbol}-${r.accountType}`} className="border-white/[0.06]">
                    <TableCell className="font-mono font-medium text-white">{r.symbol}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="border-0 bg-white/10 text-white/80">
                        {r.group}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-emerald-300/90">{r.spreadMinPips} pips</TableCell>
                    <TableCell className="text-white/70">{r.spreadAvgPips} pips</TableCell>
                    <TableCell className="text-white/80">{r.commission}</TableCell>
                    <TableCell className="text-xs text-white/70">
                      <span className="text-red-300/90">{r.swapLong}</span>
                      <span className="text-white/30"> / </span>
                      <span className="text-emerald-300/90">{r.swapShort}</span>
                    </TableCell>
                    <TableCell className="text-xs text-white/70">{r.contractSize}</TableCell>
                    <TableCell className="text-xs text-teal-300/90">{r.leverageMax}</TableCell>
                    <TableCell className="text-xs text-white/70">{r.marginRequirementPct}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
