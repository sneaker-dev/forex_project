"use client"

import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, AdminPrimaryButton, AdminSecondaryButton, adminSurface } from "@/components/admin/admin-ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import Link from "next/link"

export default function AdminCopyTradingPage() {
  const { state, toggleCopyLink, setMasterStatus } = useAdmin()

  const activeLinks = state.copyLinks.filter((l) => l.active).length
  const activeMasters = state.copyMasters.filter((m) => m.status === "Active").length

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Copy trade control"
        description="Master programmes, performance economics, and follower links — risk and commercial governance."
        actions={
          <>
            <AdminSecondaryButton onClick={() => toast.message("Fee schedule", { description: "Opens pricing matrix." })}>
              Fee matrix
            </AdminSecondaryButton>
            <AdminPrimaryButton onClick={() => toast.message("Onboard master", { description: "Master onboarding wizard." })}>
              Onboard master
            </AdminPrimaryButton>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={cn(adminSurface, "p-5")}>
          <p className="text-xs font-medium uppercase tracking-wider text-white/45">Live masters</p>
          <p className="mt-2 text-3xl font-semibold text-white">{activeMasters}</p>
          <p className="mt-1 text-xs text-white/40">Approved for marketing</p>
        </div>
        <div className={cn(adminSurface, "p-5")}>
          <p className="text-xs font-medium uppercase tracking-wider text-white/45">Active follower links</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-400">{activeLinks}</p>
          <p className="mt-1 text-xs text-white/40">Copying enabled</p>
        </div>
        <div className={cn(adminSurface, "p-5")}>
          <p className="text-xs font-medium uppercase tracking-wider text-white/45">Aggregate AUM</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            ${(state.copyMasters.reduce((a, m) => a + m.aum, 0) / 1e6).toFixed(2)}M
          </p>
          <p className="mt-1 text-xs text-white/40">Across all masters</p>
        </div>
      </div>

      <div className={cn(adminSurface, "overflow-x-auto")}>
        <div className="border-b border-white/[0.06] px-6 py-4">
          <h3 className="text-sm font-semibold text-white">Master providers</h3>
          <p className="text-xs text-white/45">Commercial terms and distribution</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.08] hover:bg-transparent">
              <TableHead className="text-white/55">ID</TableHead>
              <TableHead className="text-white/55">Name</TableHead>
              <TableHead className="text-white/55">Strategy</TableHead>
              <TableHead className="text-right text-white/55">Followers</TableHead>
              <TableHead className="text-right text-white/55">Win rate</TableHead>
              <TableHead className="text-right text-white/55">Fee</TableHead>
              <TableHead className="text-white/55">Status</TableHead>
              <TableHead className="text-right text-white/55">Control</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.copyMasters.map((m) => (
              <TableRow key={m.id} className="border-white/[0.06]">
                <TableCell className="font-mono text-xs">{m.id}</TableCell>
                <TableCell className="font-medium text-white">{m.name}</TableCell>
                <TableCell className="text-white/70">{m.strategy}</TableCell>
                <TableCell className="text-right tabular-nums text-white/85">{m.followers.toLocaleString()}</TableCell>
                <TableCell className="text-right text-emerald-400/90">{m.winRate}%</TableCell>
                <TableCell className="text-right text-white/80">{m.feePct}%</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "border-0",
                      m.status === "Active" && "bg-emerald-500/20 text-emerald-200",
                      m.status === "Paused" && "bg-amber-500/20 text-amber-100",
                      m.status === "Suspended" && "bg-red-500/20 text-red-200"
                    )}
                  >
                    {m.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {m.status === "Active" ? (
                    <Button size="sm" variant="outline" className="h-8 border-white/15 text-white" onClick={() => setMasterStatus(m.id, "Paused")}>
                      Pause
                    </Button>
                  ) : (
                    <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-500" onClick={() => setMasterStatus(m.id, "Active")}>
                      Resume
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className={cn(adminSurface, "overflow-x-auto")}>
        <div className="border-b border-white/[0.06] px-6 py-4">
          <h3 className="text-sm font-semibold text-white">Follower links</h3>
          <p className="text-xs text-white/45">Allocation and risk posture</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.08] hover:bg-transparent">
              <TableHead className="text-white/55">Link</TableHead>
              <TableHead className="text-white/55">Master</TableHead>
              <TableHead className="text-white/55">Follower</TableHead>
              <TableHead className="text-right text-white/55">Allocation</TableHead>
              <TableHead className="text-white/55">Mode</TableHead>
              <TableHead className="text-white/55">State</TableHead>
              <TableHead className="text-right text-white/55">Toggle</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.copyLinks.map((l) => (
              <TableRow key={l.id} className="border-white/[0.06]">
                <TableCell className="font-mono text-xs">{l.id}</TableCell>
                <TableCell className="text-white">{l.masterName}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-white/85">{l.followerEmail}</p>
                    <Link href={`/admin/users/${l.followerId}`} className="text-[11px] text-teal-400/95 hover:underline">
                      Open client
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="text-right tabular-nums text-white">${l.allocationUsd.toLocaleString()}</TableCell>
                <TableCell className="text-white/70">{l.mode}</TableCell>
                <TableCell>
                  <Badge className={l.active ? "border-0 bg-emerald-500/20 text-emerald-200" : "border-0 bg-white/10 text-white/60"}>
                    {l.active ? "Active" : "Stopped"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 border-white/15 text-white"
                    onClick={() => toggleCopyLink(l.id, !l.active)}
                  >
                    {l.active ? "Stop" : "Resume"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
