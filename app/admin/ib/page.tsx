"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, AdminPrimaryButton, adminSurface, adminTableWrap } from "@/components/admin/admin-ui"
import { cn } from "@/lib/utils"
import { Network, Users } from "lucide-react"
import type { IbCommissionBasis, IbNode } from "@/lib/admin/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

const basisLabel: Record<IbCommissionBasis, string> = {
  per_trade: "Per trade",
  per_client: "Per client",
  per_level: "Per level",
}

export default function AdminIbPage() {
  const { state, updateIbNode, addIbNode } = useAdmin()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<IbNode | null>(null)
  const [mapOpen, setMapOpen] = useState<IbNode | null>(null)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [level, setLevel] = useState<1 | 2 | 3>(1)
  const [parentId, setParentId] = useState<string>("")
  const [commissionPct, setCommissionPct] = useState("")
  const [perLotUsd, setPerLotUsd] = useState("")
  const [tierRule, setTierRule] = useState("")
  const [status, setStatus] = useState<"Active" | "Suspended">("Active")
  const [basis, setBasis] = useState<IbCommissionBasis>("per_trade")

  const openCreate = () => {
    setEditing(null)
    setName("")
    setEmail("")
    setLevel(1)
    setParentId("")
    setCommissionPct("30")
    setPerLotUsd("6")
    setTierRule("Standard tier — see policy PDF")
    setStatus("Active")
    setBasis("per_trade")
    setDialogOpen(true)
  }

  const openEdit = (n: IbNode) => {
    setEditing(n)
    setName(n.name)
    setEmail(n.email)
    setLevel(n.level)
    setParentId(n.parentId ?? "")
    setCommissionPct(String(n.commissionPct))
    setPerLotUsd(String(n.perLotUsd))
    setTierRule(n.tierRule)
    setStatus(n.status)
    setBasis(n.commissionBasis)
    setDialogOpen(true)
  }

  const save = () => {
    const pct = Number.parseFloat(commissionPct)
    const pl = Number.parseFloat(perLotUsd)
    if (!name.trim() || !email.trim() || !Number.isFinite(pct) || !Number.isFinite(pl)) {
      toast.error("Name, email, % and $/lot are required.")
      return
    }
    if (editing) {
      updateIbNode(editing.id, {
        name: name.trim(),
        email: email.trim(),
        level,
        parentId: parentId === "" || parentId === "none" ? null : parentId,
        commissionPct: pct,
        perLotUsd: pl,
        tierRule: tierRule.trim(),
        status,
        commissionBasis: basis,
      })
      toast.success("IB updated")
    } else {
      addIbNode({
        name: name.trim(),
        email: email.trim(),
        level,
        parentId: parentId === "" || parentId === "none" ? null : parentId,
        clients: 0,
        volumeUsd: 0,
        commissionUsd: 0,
        commissionPct: pct,
        perLotUsd: pl,
        tierRule: tierRule.trim(),
        status,
        commissionBasis: basis,
        payoutPendingUsd: 0,
        payoutPaidUsd: 0,
        walletBalanceUsd: 0,
        mappedUserIds: [],
      })
      toast.success("IB created")
    }
    setDialogOpen(false)
  }

  const roots = useMemo(() => state.ibNodes.filter((n) => n.parentId === null), [state.ibNodes])

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Introducing broker network"
        description="Commission %, per-lot economics, tier rules, payout wallet, and client mapping — full hierarchy."
        actions={<AdminPrimaryButton onClick={openCreate}>Add IB</AdminPrimaryButton>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="admin-metric-tile p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Pending payouts</p>
          <p className="mt-1 text-xl font-semibold text-amber-300">
            $
            {state.ibNodes.reduce((a, n) => a + n.payoutPendingUsd, 0).toLocaleString()}
          </p>
        </div>
        <div className="admin-metric-tile p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Paid (lifetime)</p>
          <p className="mt-1 text-xl font-semibold text-emerald-400">
            $
            {state.ibNodes.reduce((a, n) => a + n.payoutPaidUsd, 0).toLocaleString()}
          </p>
        </div>
        <div className="admin-metric-tile p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Wallet balance</p>
          <p className="mt-1 text-xl font-semibold text-teal-300">
            $
            {state.ibNodes.reduce((a, n) => a + n.walletBalanceUsd, 0).toLocaleString()}
          </p>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-slate-950 text-slate-100 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit IB" : "Add IB"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="space-y-1">
              <Label className="text-white/70">Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="border-white/10 bg-black/50 text-white" />
            </div>
            <div className="space-y-1">
              <Label className="text-white/70">Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} className="border-white/10 bg-black/50 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-white/70">Level</Label>
                <Select value={String(level)} onValueChange={(v) => setLevel(Number(v) as 1 | 2 | 3)}>
                  <SelectTrigger className="border-white/10 bg-black/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">L1</SelectItem>
                    <SelectItem value="2">L2</SelectItem>
                    <SelectItem value="3">L3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-white/70">Parent</Label>
                <Select value={parentId || "none"} onValueChange={(v) => setParentId(v === "none" ? "" : v)}>
                  <SelectTrigger className="border-white/10 bg-black/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (root)</SelectItem>
                    {state.ibNodes.map((n) => (
                      <SelectItem key={n.id} value={n.id} disabled={editing?.id === n.id}>
                        {n.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-white/70">Commission %</Label>
                <Input value={commissionPct} onChange={(e) => setCommissionPct(e.target.value)} className="border-white/10 bg-black/50 text-white" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/70">$/lot (ref)</Label>
                <Input value={perLotUsd} onChange={(e) => setPerLotUsd(e.target.value)} className="border-white/10 bg-black/50 text-white" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-white/70">Commission basis</Label>
              <Select value={basis} onValueChange={(v) => setBasis(v as IbCommissionBasis)}>
                <SelectTrigger className="border-white/10 bg-black/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="per_trade">{basisLabel.per_trade}</SelectItem>
                  <SelectItem value="per_client">{basisLabel.per_client}</SelectItem>
                  <SelectItem value="per_level">{basisLabel.per_level}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-white/70">Tier rules</Label>
              <Textarea value={tierRule} onChange={(e) => setTierRule(e.target.value)} className="min-h-[72px] border-white/10 bg-black/50 text-white" />
            </div>
            <div className="space-y-1">
              <Label className="text-white/70">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as "Active" | "Suspended")}>
                <SelectTrigger className="border-white/10 bg-black/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Suspended">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" className="border-white/10 bg-white/[0.06]" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="bg-teal-600 hover:bg-teal-500" onClick={save}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!mapOpen} onOpenChange={(o) => !o && setMapOpen(null)}>
        <DialogContent className="border-white/10 bg-slate-950 text-slate-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mapped clients — {mapOpen?.name}</DialogTitle>
          </DialogHeader>
          <ul className="space-y-2 py-2">
            {mapOpen?.mappedUserIds.length === 0 && <p className="text-sm text-white/45">No clients linked yet.</p>}
            {mapOpen?.mappedUserIds.map((uid) => {
              const u = state.users.find((x) => x.id === uid)
              return (
                <li key={uid} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-black/30 px-3 py-2">
                  <span className="text-sm text-white">{u?.name ?? uid}</span>
                  <Button asChild size="sm" variant="outline" className="h-8 border-white/15 text-white">
                    <Link href={`/admin/users/${uid}`}>Open</Link>
                  </Button>
                </li>
              )
            })}
          </ul>
        </DialogContent>
      </Dialog>

      <div className={cn(adminSurface, "overflow-hidden")}>
        <div className="overflow-x-auto">
          <div className={adminTableWrap}>
            <Table>
              <TableHeader>
                <TableRow className="border-transparent hover:bg-transparent">
                  <TableHead className="text-slate-500">IB</TableHead>
                  <TableHead className="text-slate-500">Lvl</TableHead>
                  <TableHead className="text-right text-slate-500">%</TableHead>
                  <TableHead className="text-right text-slate-500">$/lot</TableHead>
                  <TableHead className="text-slate-500">Basis</TableHead>
                  <TableHead className="text-right text-slate-500">Pending</TableHead>
                  <TableHead className="text-right text-slate-500">Paid</TableHead>
                  <TableHead className="text-right text-slate-500">Wallet</TableHead>
                  <TableHead className="text-right text-slate-500">Clients</TableHead>
                  <TableHead className="text-slate-500">Status</TableHead>
                  <TableHead className="text-right text-slate-500">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.ibNodes.map((n) => (
                  <TableRow key={n.id} className="border-white/[0.06]">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                          <Network className="h-4 w-4 text-teal-400/90" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{n.name}</p>
                          <p className="text-[11px] text-white/40">{n.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white/80">L{n.level}</TableCell>
                    <TableCell className="text-right tabular-nums text-teal-300">{n.commissionPct}%</TableCell>
                    <TableCell className="text-right tabular-nums text-white">${n.perLotUsd}</TableCell>
                    <TableCell className="text-xs text-white/70">{basisLabel[n.commissionBasis]}</TableCell>
                    <TableCell className="text-right tabular-nums text-amber-300">${n.payoutPendingUsd.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums text-emerald-400">${n.payoutPaidUsd.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums text-white">${n.walletBalanceUsd.toLocaleString()}</TableCell>
                    <TableCell className="text-right tabular-nums text-white">{n.clients}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "border-0",
                          n.status === "Active" ? "bg-emerald-500/20 text-emerald-200" : "bg-white/10 text-white/50"
                        )}
                      >
                        {n.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="outline" className="h-8 border-white/15 text-white" onClick={() => setMapOpen(n)}>
                          <Users className="mr-1 h-3.5 w-3.5" />
                          Map
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 border-white/15 text-white" onClick={() => openEdit(n)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-white/15 text-white"
                          onClick={() => updateIbNode(n.id, { status: n.status === "Active" ? "Suspended" : "Active" })}
                        >
                          {n.status === "Active" ? "Disable" : "Enable"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Hierarchy</p>
        {roots.map((root) => (
          <IbCard key={root.id} node={root} all={state.ibNodes} depth={0} />
        ))}
      </div>
    </div>
  )
}

function IbCard({ node, all, depth }: { node: IbNode; all: IbNode[]; depth: number }) {
  const children = all.filter((n) => n.parentId === node.id)
  return (
    <div className={cn(adminSurface, "p-5", depth > 0 && "ml-4 border-l-2 border-teal-500/30 pl-5 sm:ml-8")}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
            <Network className="h-5 w-5 text-teal-400/90" />
          </div>
          <div>
            <p className="font-semibold text-white">{node.name}</p>
            <p className="text-xs text-white/45">{node.email}</p>
            <p className="mt-1 text-[11px] text-white/35">
              L{node.level} · {node.commissionPct}% · ${node.perLotUsd}/lot
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 text-right text-sm">
          <div>
            <p className="text-white/45">Clients</p>
            <p className="font-semibold tabular-nums text-white">{node.clients}</p>
          </div>
          <div>
            <p className="text-white/45">Volume</p>
            <p className="font-semibold tabular-nums text-white">${(node.volumeUsd / 1e6).toFixed(2)}M</p>
          </div>
          <div>
            <p className="text-white/45">Commission</p>
            <p className="font-semibold tabular-nums text-emerald-400/90">${node.commissionUsd.toLocaleString()}</p>
          </div>
        </div>
      </div>
      {children.length > 0 && (
        <div className="mt-4 space-y-4 border-t border-white/[0.06] pt-4">
          {children.map((c) => (
            <IbCard key={c.id} node={c} all={all} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
