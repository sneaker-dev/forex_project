"use client"

import { useEffect, useState } from "react"
import { useAdmin } from "@/components/admin/admin-provider"
import {
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  adminSurface,
  adminTableWrap,
  adminTabsListClass,
  adminTabsTriggerClass,
} from "@/components/admin/admin-ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import Link from "next/link"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { CopyMaster, CopyMasterApproval } from "@/lib/admin/types"
import { Switch } from "@/components/ui/switch"

function EquitySpark({ pts }: { pts: number[] }) {
  if (!pts.length) return <div className="h-10 w-24 rounded bg-white/5" />
  const min = Math.min(...pts)
  const max = Math.max(...pts)
  const span = max - min || 1
  const w = 80
  const h = 28
  const step = w / (pts.length - 1 || 1)
  const path = pts
    .map((p, i) => {
      const x = i * step
      const y = h - ((p - min) / span) * h
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(" ")
  return (
    <svg width={w} height={h} className="overflow-visible text-teal-400/90">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export default function AdminCopyTradingPage() {
  const {
    state,
    toggleCopyLink,
    setMasterStatus,
    addCopyMaster,
    updateCopyMaster,
    setCopySystemPaused,
    setMasterApproval,
    setMasterFollowersPaused,
    stopAllCopyFollowers,
  } = useAdmin()
  const [feeOpen, setFeeOpen] = useState(false)
  const [onboardOpen, setOnboardOpen] = useState(false)
  const [name, setName] = useState("")
  const [strategy, setStrategy] = useState("")
  const [feePct, setFeePct] = useState("20")

  const activeLinks = state.copyLinks.filter((l) => l.active).length
  const activeMasters = state.copyMasters.filter((m) => m.status === "Active").length

  const submitOnboard = () => {
    const f = Number.parseFloat(feePct)
    if (!name.trim() || !strategy.trim() || !Number.isFinite(f)) {
      toast.error("Name, strategy, and fee % are required.")
      return
    }
    addCopyMaster({
      name: name.trim(),
      strategy: strategy.trim(),
      feePct: f,
    })
    toast.success("Master onboarded")
    setOnboardOpen(false)
    setName("")
    setStrategy("")
    setFeePct("20")
  }

  const approve = (id: string, s: CopyMasterApproval) => {
    setMasterApproval(id, s)
    if (s === "Approved") toast.success("Master approved for marketing")
    else toast.message("Master rejected")
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Copy trade control"
        description="Master approval, fee & profit share, performance, global pause, and follower emergency stop."
        actions={
          <>
            <AdminSecondaryButton onClick={() => setFeeOpen(true)}>Fee matrix</AdminSecondaryButton>
            <AdminPrimaryButton onClick={() => setOnboardOpen(true)}>Onboard master</AdminPrimaryButton>
          </>
        }
      />

      <Dialog open={feeOpen} onOpenChange={setFeeOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-white/10 bg-slate-950 text-slate-100 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Forex fee schedule (reference)</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-white/50">Pricing matrix by account tier — read-only.</p>
          <div className="overflow-x-auto">
            <div className={adminTableWrap}>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.08]">
                    <TableHead className="text-white/55">Symbol</TableHead>
                    <TableHead className="text-white/55">Tier</TableHead>
                    <TableHead className="text-white/55">Min/Avg</TableHead>
                    <TableHead className="text-white/55">Commission</TableHead>
                    <TableHead className="text-white/55">Swap L/S</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.forexCharges.map((r) => (
                    <TableRow key={`${r.symbol}-${r.accountType}`} className="border-white/[0.06]">
                      <TableCell className="font-mono text-xs text-white/90">{r.symbol}</TableCell>
                      <TableCell className="text-white/60">{r.accountType}</TableCell>
                      <TableCell className="text-white/80">
                        {r.spreadMinPips} / {r.spreadAvgPips}
                      </TableCell>
                      <TableCell className="text-white/80">{r.commission}</TableCell>
                      <TableCell className="text-xs text-white/60">
                        {r.swapLong} / {r.swapShort}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="rounded-lg border border-white/[0.06] bg-black/40 p-3">
            <p className="text-xs font-medium uppercase tracking-wider text-white/45">Master performance fees</p>
            <ul className="mt-2 space-y-1 text-sm text-white/80">
              {state.copyMasters.map((m) => (
                <li key={m.id} className="flex justify-between gap-2">
                  <span>{m.name}</span>
                  <span className="font-mono text-teal-300/90">
                    {m.feePct}% · share {m.profitSharePct}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={onboardOpen} onOpenChange={setOnboardOpen}>
        <DialogContent className="border-white/10 bg-slate-950 text-slate-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Onboard master</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label className="text-white/70">Display name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="border-white/10 bg-black/50 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Strategy label</Label>
              <Input value={strategy} onChange={(e) => setStrategy(e.target.value)} className="border-white/10 bg-black/50 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Performance fee (%)</Label>
              <Input value={feePct} onChange={(e) => setFeePct(e.target.value)} className="border-white/10 bg-black/50 text-white" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" className="border-white/10 bg-white/[0.06]" onClick={() => setOnboardOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="bg-teal-600 hover:bg-teal-500" onClick={submitOnboard}>
              Add master
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={cn(adminSurface, "p-5")}>
          <p className="text-xs font-medium uppercase tracking-wider text-white/45">Live masters</p>
          <p className="mt-2 text-3xl font-semibold text-white">{activeMasters}</p>
          <p className="mt-1 text-xs text-white/40">Status Active</p>
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

      <div className={cn(adminSurface, "overflow-hidden p-4")}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">Global copy system</p>
            <p className="text-xs text-white/45">When paused, new follower subscriptions are blocked (links still visible).</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/60">{state.copySystemPaused ? "Paused" : "Running"}</span>
            <Switch checked={!state.copySystemPaused} onCheckedChange={(on) => setCopySystemPaused(!on)} />
            <Button
              type="button"
              variant="destructive"
              className="h-9 bg-rose-600 hover:bg-rose-500"
              onClick={() => {
                stopAllCopyFollowers()
                toast.error("All follower links stopped")
              }}
            >
              Stop all followers
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="control" className="space-y-4">
        <TabsList className={cn(adminTabsListClass, "h-auto w-full flex-wrap justify-start")}>
          <TabsTrigger value="control" className={adminTabsTriggerClass}>
            Master control
          </TabsTrigger>
          <TabsTrigger value="fees" className={adminTabsTriggerClass}>
            Fee management
          </TabsTrigger>
          <TabsTrigger value="perf" className={adminTabsTriggerClass}>
            Performance
          </TabsTrigger>
          <TabsTrigger value="earn" className={adminTabsTriggerClass}>
            Earnings
          </TabsTrigger>
          <TabsTrigger value="links" className={adminTabsTriggerClass}>
            Follower links
          </TabsTrigger>
        </TabsList>

        <TabsContent value="control">
          <div className={cn(adminSurface, "overflow-hidden")}>
            <div className="overflow-x-auto">
              <div className={adminTableWrap}>
                <Table>
                  <TableHeader>
                    <TableRow className="border-transparent hover:bg-transparent">
                      <TableHead className="text-white/55">Master</TableHead>
                      <TableHead className="text-white/55">Approval</TableHead>
                      <TableHead className="text-white/55">Req. win %</TableHead>
                      <TableHead className="text-white/55">Track rec. (mo)</TableHead>
                      <TableHead className="text-white/55">Followers pause</TableHead>
                      <TableHead className="text-white/55">Desk status</TableHead>
                      <TableHead className="text-right text-white/55">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.copyMasters.map((m) => (
                      <MasterControlRow
                        key={m.id}
                        m={m}
                        approve={approve}
                        setMasterFollowersPaused={setMasterFollowersPaused}
                        setMasterStatus={setMasterStatus}
                        updateCopyMaster={updateCopyMaster}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fees">
          <div className={cn(adminSurface, "overflow-hidden")}>
            <div className="overflow-x-auto">
              <div className={adminTableWrap}>
                <Table>
                  <TableHeader>
                    <TableRow className="border-transparent hover:bg-transparent">
                      <TableHead className="text-white/55">Master</TableHead>
                      <TableHead className="text-right text-white/55">Perf. fee %</TableHead>
                      <TableHead className="text-right text-white/55">Profit share %</TableHead>
                      <TableHead className="text-white/55">Save</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.copyMasters.map((m) => (
                      <FeeRow key={m.id} m={m} updateCopyMaster={updateCopyMaster} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="perf">
          <div className="space-y-6">
            {state.copyMasters.map((m) => {
              const hist = m.performanceHistory ?? []
              return (
                <div key={m.id} className={cn(adminSurface, "overflow-hidden")}>
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/[0.06] p-5">
                    <div>
                      <p className="font-semibold text-white">{m.name}</p>
                      <p className="text-xs text-white/45">30d P&amp;L (USD)</p>
                      <p className={cn("mt-1 text-2xl font-semibold tabular-nums tracking-tight", m.pnl30dUsd >= 0 ? "text-emerald-400" : "text-red-400")}>
                        {m.pnl30dUsd >= 0 ? "+" : ""}
                        {m.pnl30dUsd.toLocaleString()}
                      </p>
                      <p className="mt-2 text-[11px] text-white/35">Equity curve (normalized). Below: recent closed-book history.</p>
                    </div>
                    <EquitySpark pts={m.equityHistory} />
                  </div>
                  <div className="overflow-x-auto">
                    <div className={adminTableWrap}>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-transparent hover:bg-transparent">
                            <TableHead className="text-white/55">Time</TableHead>
                            <TableHead className="text-white/55">Symbol</TableHead>
                            <TableHead className="text-white/55">Side</TableHead>
                            <TableHead className="text-right text-white/55">Lots</TableHead>
                            <TableHead className="text-right text-white/55">P&amp;L (USD)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {hist.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center text-sm text-white/40">
                                No history rows yet.
                              </TableCell>
                            </TableRow>
                          ) : (
                            hist.map((h) => (
                              <TableRow key={h.id} className="border-white/[0.06]">
                                <TableCell className="whitespace-nowrap text-xs text-white/50">{new Date(h.at).toLocaleString()}</TableCell>
                                <TableCell className="font-mono text-sm text-white">{h.symbol}</TableCell>
                                <TableCell className={cn(h.side === "BUY" ? "text-emerald-400" : "text-red-400")}>{h.side}</TableCell>
                                <TableCell className="text-right tabular-nums text-white/80">{h.lots}</TableCell>
                                <TableCell
                                  className={cn(
                                    "text-right font-mono tabular-nums",
                                    h.pnlUsd >= 0 ? "text-emerald-400" : "text-red-400"
                                  )}
                                >
                                  {h.pnlUsd >= 0 ? "+" : ""}
                                  {h.pnlUsd.toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="earn">
          <div className={cn(adminSurface, "overflow-hidden")}>
            <div className="overflow-x-auto">
              <div className={adminTableWrap}>
                <Table>
                  <TableHeader>
                    <TableRow className="border-transparent hover:bg-transparent">
                      <TableHead className="text-white/55">Master</TableHead>
                      <TableHead className="text-right text-white/55">Pending payout</TableHead>
                      <TableHead className="text-right text-white/55">Paid out</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.copyMasters.map((m) => (
                      <TableRow key={m.id} className="border-white/[0.06]">
                        <TableCell className="text-white">{m.name}</TableCell>
                        <TableCell className="text-right tabular-nums text-amber-300">${m.pendingPayoutUsd.toLocaleString()}</TableCell>
                        <TableCell className="text-right tabular-nums text-emerald-400">${m.paidOutUsd.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="links">
          <div className={cn(adminSurface, "overflow-hidden")}>
            <div className="overflow-x-auto">
              <div className={adminTableWrap}>
                <Table>
                  <TableHeader>
                    <TableRow className="border-transparent hover:bg-transparent">
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MasterControlRow({
  m,
  approve,
  setMasterFollowersPaused,
  setMasterStatus,
  updateCopyMaster,
}: {
  m: CopyMaster
  approve: (id: string, s: CopyMasterApproval) => void
  setMasterFollowersPaused: (id: string, paused: boolean) => void
  setMasterStatus: (id: string, status: CopyMaster["status"]) => void
  updateCopyMaster: (id: string, patch: Partial<CopyMaster>) => void
}) {
  const [wr, setWr] = useState(String(m.minWinRatePct))
  const [mo, setMo] = useState(String(m.minTrackRecordMonths))
  useEffect(() => {
    setWr(String(m.minWinRatePct))
    setMo(String(m.minTrackRecordMonths))
  }, [m.id, m.minWinRatePct, m.minTrackRecordMonths])

  const saveReqs = () => {
    const win = Number.parseFloat(wr)
    const months = Number.parseInt(mo, 10)
    if (!Number.isFinite(win) || win < 0 || win > 100 || !Number.isFinite(months) || months < 0) {
      toast.error("Enter valid win % (0–100) and months (≥ 0).")
      return
    }
    updateCopyMaster(m.id, { minWinRatePct: win, minTrackRecordMonths: months })
    toast.success("Performance requirements saved")
  }

  return (
    <TableRow className="border-white/[0.06]">
      <TableCell className="font-medium text-white">{m.name}</TableCell>
      <TableCell>
        <Badge
          className={cn(
            "border-0",
            m.approvalStatus === "Approved" && "bg-emerald-500/20 text-emerald-200",
            m.approvalStatus === "Pending" && "bg-amber-500/20 text-amber-100",
            m.approvalStatus === "Rejected" && "bg-red-500/20 text-red-200"
          )}
        >
          {m.approvalStatus}
        </Badge>
      </TableCell>
      <TableCell>
        <Input
          value={wr}
          onChange={(e) => setWr(e.target.value)}
          className="h-8 w-[4.5rem] border-white/10 bg-black/50 text-right text-sm text-white"
        />
      </TableCell>
      <TableCell>
        <Input
          value={mo}
          onChange={(e) => setMo(e.target.value)}
          className="h-8 w-[4rem] border-white/10 bg-black/50 text-right text-sm text-white"
        />
      </TableCell>
      <TableCell>
        <Switch checked={!m.followersPaused} onCheckedChange={(on) => setMasterFollowersPaused(m.id, !on)} />
      </TableCell>
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
        <div className="flex flex-wrap justify-end gap-1">
          <Button size="sm" variant="secondary" className="h-8 border-white/15 bg-white/[0.06] text-white" onClick={saveReqs}>
            Save reqs
          </Button>
          {m.approvalStatus === "Pending" && (
            <>
              <Button size="sm" className="h-8 bg-emerald-600" onClick={() => approve(m.id, "Approved")}>
                Approve
              </Button>
              <Button size="sm" variant="outline" className="h-8 border-white/15" onClick={() => approve(m.id, "Rejected")}>
                Reject
              </Button>
            </>
          )}
          {m.status === "Active" ? (
            <Button size="sm" variant="outline" className="h-8 border-white/15 text-white" onClick={() => setMasterStatus(m.id, "Paused")}>
              Pause
            </Button>
          ) : (
            <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-500" onClick={() => setMasterStatus(m.id, "Active")}>
              Resume
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}

function FeeRow({
  m,
  updateCopyMaster,
}: {
  m: CopyMaster
  updateCopyMaster: (id: string, patch: Partial<CopyMaster>) => void
}) {
  const [fee, setFee] = useState(String(m.feePct))
  const [share, setShare] = useState(String(m.profitSharePct))
  useEffect(() => {
    setFee(String(m.feePct))
    setShare(String(m.profitSharePct))
  }, [m.id, m.feePct, m.profitSharePct])
  return (
    <TableRow className="border-white/[0.06]">
      <TableCell className="font-medium text-white">{m.name}</TableCell>
      <TableCell className="text-right">
        <Input value={fee} onChange={(e) => setFee(e.target.value)} className="ml-auto h-8 w-20 border-white/10 bg-black/50 text-right text-white" />
      </TableCell>
      <TableCell className="text-right">
        <Input value={share} onChange={(e) => setShare(e.target.value)} className="ml-auto h-8 w-20 border-white/10 bg-black/50 text-right text-white" />
      </TableCell>
      <TableCell>
        <Button
          size="sm"
          className="h-8 bg-teal-600"
          onClick={() => {
            const f = Number.parseFloat(fee)
            const sh = Number.parseFloat(share)
            if (!Number.isFinite(f) || !Number.isFinite(sh)) return
            updateCopyMaster(m.id, { feePct: f, profitSharePct: sh })
          }}
        >
          Save
        </Button>
      </TableCell>
    </TableRow>
  )
}
