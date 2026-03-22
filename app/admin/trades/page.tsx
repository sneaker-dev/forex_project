"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, AdminPrimaryButton, AdminToolbar, adminSurface } from "@/components/admin/admin-ui"
import { cn } from "@/lib/utils"
import { CheckCircle2, LineChart, Pencil, Search, Trash2, TrendingDown, TrendingUp } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { AdminStatCard } from "@/components/admin/admin-ui"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { AdminTrade } from "@/lib/admin/types"

export default function AdminTradesPage() {
  const { state, addTrade, updateTrade, removeTrade } = useAdmin()
  const [q, setQ] = useState("")
  const [status, setStatus] = useState<string>("all")

  const [createOpen, setCreateOpen] = useState(false)
  const [userId, setUserId] = useState(state.users[0]?.id ?? "")
  const [symbol, setSymbol] = useState("EURUSD")
  const [side, setSide] = useState<AdminTrade["side"]>("BUY")
  const [lots, setLots] = useState("0.1")
  const [openPrice, setOpenPrice] = useState("1.085")
  const [tradeStatus, setTradeStatus] = useState<AdminTrade["status"]>("OPEN")

  const [amend, setAmend] = useState<AdminTrade | null>(null)
  const [amendOpenPrice, setAmendOpenPrice] = useState("")
  const [amendPnl, setAmendPnl] = useState("")

  const metrics = useMemo(() => {
    const total = state.trades.length
    const open = state.trades.filter((t) => t.status === "OPEN").length
    const vol = state.trades.reduce((a, t) => a + t.lots, 0)
    const pnl = state.trades.reduce((a, t) => a + t.pnl, 0)
    return { total, open, vol, pnl }
  }, [state.trades])

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    return state.trades.filter((t) => {
      const match =
        !s ||
        t.id.toLowerCase().includes(s) ||
        t.userName.toLowerCase().includes(s) ||
        t.symbol.toLowerCase().includes(s)
      const st = status === "all" || t.status === status
      return match && st
    })
  }, [state.trades, q, status])

  const openCreate = () => {
    setUserId(state.users[0]?.id ?? "")
    setSymbol("EURUSD")
    setSide("BUY")
    setLots("0.1")
    setOpenPrice("1.085")
    setTradeStatus("OPEN")
    setCreateOpen(true)
  }

  const submitCreate = () => {
    const u = state.users.find((x) => x.id === userId)
    const lv = Number.parseFloat(lots)
    const op = Number.parseFloat(openPrice)
    if (!u || !Number.isFinite(lv) || !Number.isFinite(op)) {
      toast.error("Invalid client, lots, or open price.")
      return
    }
    addTrade({
      userId: u.id,
      userName: u.name,
      symbol: symbol.trim().toUpperCase() || "EURUSD",
      side,
      lots: lv,
      openPrice: op,
      pnl: 0,
      status: tradeStatus,
      openedAt: new Date().toISOString(),
    })
    toast.success("Trade created")
    setCreateOpen(false)
  }

  const openAmendDialog = (t: AdminTrade) => {
    setAmend(t)
    setAmendOpenPrice(String(t.openPrice))
    setAmendPnl(String(t.pnl))
  }

  const submitAmend = () => {
    if (!amend) return
    const op = Number.parseFloat(amendOpenPrice)
    const p = Number.parseFloat(amendPnl)
    if (!Number.isFinite(op) || !Number.isFinite(p)) {
      toast.error("Enter valid numbers for open price and P&L.")
      return
    }
    updateTrade(amend.id, { openPrice: op, pnl: p })
    toast.success("Trade amended")
    setAmend(null)
  }

  const reconcile = (id: string) => {
    updateTrade(id, { status: "CLOSED" })
    toast.success("Trade reconciled (closed)")
  }

  const voidTrade = (t: AdminTrade) => {
    if (typeof window !== "undefined" && !window.confirm(`Void trade ${t.id}? This cannot be undone in the demo.`)) return
    removeTrade(t.id)
    toast.success("Trade voided")
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Trade surveillance"
        description="Cross-account execution, P&amp;L, and lifecycle — integrated with desk workflows."
        actions={
          <AdminPrimaryButton onClick={openCreate}>+ Create trade</AdminPrimaryButton>
        }
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="border-white/10 bg-slate-950 text-slate-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create trade</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label className="text-white/70">Client</Label>
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger className="border-white/10 bg-black/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {state.users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Symbol</Label>
              <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} className="border-white/10 bg-black/50 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-white/70">Side</Label>
                <Select value={side} onValueChange={(v) => setSide(v as AdminTrade["side"])}>
                  <SelectTrigger className="border-white/10 bg-black/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BUY">BUY</SelectItem>
                    <SelectItem value="SELL">SELL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Status</Label>
                <Select value={tradeStatus} onValueChange={(v) => setTradeStatus(v as AdminTrade["status"])}>
                  <SelectTrigger className="border-white/10 bg-black/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">OPEN</SelectItem>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="CLOSED">CLOSED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-white/70">Lots</Label>
                <Input value={lots} onChange={(e) => setLots(e.target.value)} className="border-white/10 bg-black/50 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Open price</Label>
                <Input value={openPrice} onChange={(e) => setOpenPrice(e.target.value)} className="border-white/10 bg-black/50 text-white" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" className="border-white/10 bg-white/[0.06]" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="bg-teal-600 hover:bg-teal-500" onClick={submitCreate}>
              Book trade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!amend} onOpenChange={(o) => !o && setAmend(null)}>
        <DialogContent className="border-white/10 bg-slate-950 text-slate-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Amend trade {amend?.id}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label className="text-white/70">Open price</Label>
              <Input value={amendOpenPrice} onChange={(e) => setAmendOpenPrice(e.target.value)} className="border-white/10 bg-black/50 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">P&amp;L</Label>
              <Input value={amendPnl} onChange={(e) => setAmendPnl(e.target.value)} className="border-white/10 bg-black/50 text-white" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" className="border-white/10 bg-white/[0.06]" onClick={() => setAmend(null)}>
              Cancel
            </Button>
            <Button type="button" className="bg-teal-600 hover:bg-teal-500" onClick={submitAmend}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total trades" value={metrics.total.toLocaleString()} icon={LineChart} hint="All time (dataset)" />
        <AdminStatCard label="Open positions" value={metrics.open.toLocaleString()} hint="Requires margin coverage" />
        <AdminStatCard label="Gross lots" value={metrics.vol.toFixed(2)} hint="Sum of volumes" />
        <AdminStatCard
          label="Unrealized P&amp;L (sample)"
          value={`${metrics.pnl >= 0 ? "+" : ""}$${metrics.pnl.toFixed(2)}`}
          positive={metrics.pnl >= 0}
          delta="Book across visible rows"
        />
      </div>

      <AdminToolbar>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search trade ID, user, symbol…"
            className="border-white/10 bg-black/40 pl-9 text-white placeholder:text-white/35"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full border-white/10 bg-black/40 text-white sm:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="OPEN">OPEN</SelectItem>
            <SelectItem value="CLOSED">CLOSED</SelectItem>
            <SelectItem value="PENDING">PENDING</SelectItem>
          </SelectContent>
        </Select>
      </AdminToolbar>

      <div className={cn(adminSurface, "overflow-x-auto")}>
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.08] hover:bg-transparent">
              <TableHead className="text-white/55">Trade ID</TableHead>
              <TableHead className="text-white/55">User</TableHead>
              <TableHead className="text-white/55">Symbol</TableHead>
              <TableHead className="text-white/55">Side</TableHead>
              <TableHead className="text-right text-white/55">Lots</TableHead>
              <TableHead className="text-right text-white/55">Open</TableHead>
              <TableHead className="text-right text-white/55">P&amp;L</TableHead>
              <TableHead className="text-white/55">Status</TableHead>
              <TableHead className="text-right text-white/55">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((t) => (
              <TableRow key={t.id} className="border-white/[0.06]">
                <TableCell className="font-mono text-xs text-white/90">{t.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-white">{t.userName}</p>
                    <Link href={`/admin/users/${t.userId}`} className="text-[11px] text-teal-400/95 hover:underline">
                      {t.userId}
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-white/85">{t.symbol}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 text-xs font-bold",
                      t.side === "BUY" ? "text-emerald-400" : "text-red-400"
                    )}
                  >
                    {t.side === "BUY" ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    {t.side}
                  </span>
                </TableCell>
                <TableCell className="text-right tabular-nums text-white/80">{t.lots.toFixed(2)}</TableCell>
                <TableCell className="text-right tabular-nums text-white/80">{t.openPrice.toLocaleString()}</TableCell>
                <TableCell
                  className={cn(
                    "text-right font-mono font-medium tabular-nums",
                    t.pnl >= 0 ? "text-emerald-400" : "text-red-400"
                  )}
                >
                  {t.pnl >= 0 ? "+" : ""}
                  {t.pnl.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="border-0 bg-white/10 text-white/90">
                    {t.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white/60 hover:bg-white/10"
                      onClick={() => openAmendDialog(t)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-white/60 hover:bg-white/10"
                      onClick={() => reconcile(t.id)}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-rose-400/85 hover:bg-rose-500/10"
                      onClick={() => voidTrade(t)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
