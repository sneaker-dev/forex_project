"use client"

import { useState } from "react"
import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, AdminPrimaryButton, AdminSecondaryButton, adminSurface } from "@/components/admin/admin-ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import Link from "next/link"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { CopyMaster } from "@/lib/admin/types"

export default function AdminCopyTradingPage() {
  const { state, toggleCopyLink, setMasterStatus, addCopyMaster } = useAdmin()
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
    const m: Omit<CopyMaster, "id"> = {
      name: name.trim(),
      strategy: strategy.trim(),
      followers: 0,
      feePct: f,
      status: "Active",
      aum: 0,
      winRate: 65,
    }
    addCopyMaster(m)
    toast.success("Master onboarded")
    setOnboardOpen(false)
    setName("")
    setStrategy("")
    setFeePct("20")
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Copy trade control"
        description="Master programmes, performance economics, and follower links — risk and commercial governance."
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
          <p className="text-sm text-white/50">Spreads from the pricing matrix (read-only).</p>
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.08]">
                <TableHead className="text-white/55">Symbol</TableHead>
                <TableHead className="text-white/55">Group</TableHead>
                <TableHead className="text-white/55">Spread</TableHead>
                <TableHead className="text-white/55">Commission</TableHead>
                <TableHead className="text-white/55">Swap L/S</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.forexCharges.map((r) => (
                <TableRow key={r.symbol} className="border-white/[0.06]">
                  <TableCell className="font-mono text-xs text-white/90">{r.symbol}</TableCell>
                  <TableCell className="text-white/60">{r.group}</TableCell>
                  <TableCell className="text-white/80">{r.spread}</TableCell>
                  <TableCell className="text-white/80">{r.commission}</TableCell>
                  <TableCell className="text-xs text-white/60">
                    {r.swapLong} / {r.swapShort}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="rounded-lg border border-white/[0.06] bg-black/40 p-3">
            <p className="text-xs font-medium uppercase tracking-wider text-white/45">Master performance fees</p>
            <ul className="mt-2 space-y-1 text-sm text-white/80">
              {state.copyMasters.map((m) => (
                <li key={m.id} className="flex justify-between gap-2">
                  <span>{m.name}</span>
                  <span className="font-mono text-teal-300/90">{m.feePct}%</span>
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
