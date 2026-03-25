"use client"

import { useMemo, useState } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { downloadCsv } from "@/lib/admin/download"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { TreasuryRail } from "@/lib/admin/types"

export default function AdminFundsPage() {
  const { state, setWithdrawalStatus, setDepositStatus, appendLedger } = useAdmin()
  const [adjOpen, setAdjOpen] = useState(false)
  const [userId, setUserId] = useState(state.users[0]?.id ?? "")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")

  const [railFilter, setRailFilter] = useState<TreasuryRail | "all">("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [clientQ, setClientQ] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [amtMin, setAmtMin] = useState("")
  const [amtMax, setAmtMax] = useState("")

  const totals = useMemo(() => {
    const depCredited = state.deposits.filter((d) => d.status === "Credited").reduce((a, d) => a + d.amount, 0)
    const wdPaid = state.withdrawals.filter((w) => w.status === "Paid").reduce((a, w) => a + w.amount, 0)
    const pendingWd = state.withdrawals.filter((w) => w.status === "Pending" || w.status === "Approved").reduce((a, w) => a + w.amount, 0)
    const net = depCredited - wdPaid
    return { depCredited, wdPaid, pendingWd, net }
  }, [state.deposits, state.withdrawals])

  const passesCommon = (userName: string, amountVal: number, status: string, at: string) => {
    if (clientQ.trim()) {
      const q = clientQ.trim().toLowerCase()
      if (!userName.toLowerCase().includes(q)) return false
    }
    if (statusFilter !== "all" && status !== statusFilter) return false
    if (dateFrom && at < `${dateFrom}T00:00:00.000Z`) return false
    if (dateTo && at > `${dateTo}T23:59:59.999Z`) return false
    const mn = Number.parseFloat(amtMin)
    const mx = Number.parseFloat(amtMax)
    if (Number.isFinite(mn) && amountVal < mn) return false
    if (Number.isFinite(mx) && amountVal > mx) return false
    return true
  }

  const depositsFiltered = useMemo(() => {
    return state.deposits.filter((d) => {
      if (railFilter !== "all" && d.rail !== railFilter) return false
      return passesCommon(d.userName, d.amount, d.status, d.requestedAt)
    })
  }, [state.deposits, railFilter, clientQ, statusFilter, dateFrom, dateTo, amtMin, amtMax])

  const withdrawalsFiltered = useMemo(() => {
    return state.withdrawals.filter((w) => {
      if (railFilter !== "all" && w.rail !== railFilter) return false
      return passesCommon(w.userName, w.amount, w.status, w.requestedAt)
    })
  }, [state.withdrawals, railFilter, clientQ, statusFilter, dateFrom, dateTo, amtMin, amtMax])

  const exportLedger = () => {
    const headers = ["id", "userId", "userName", "type", "amount", "currency", "status", "reference", "createdAt"]
    const rows = state.ledger.map((r) => [
      r.id,
      r.userId,
      r.userName,
      r.type,
      r.amount,
      r.currency,
      r.status,
      r.reference,
      r.createdAt,
    ])
    downloadCsv(`ledger-reconcile-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows)
    toast.success("Ledger export downloaded")
  }

  const postAdjustment = () => {
    const u = state.users.find((x) => x.id === userId)
    const amt = Number.parseFloat(amount)
    if (!u || !Number.isFinite(amt) || !note.trim()) {
      toast.error("Pick a client, enter amount, and a note.")
      return
    }
    appendLedger({
      userId: u.id,
      userName: u.name,
      type: "Adjustment",
      amount: amt,
      currency: "USD",
      status: "Completed",
      reference: note.trim().slice(0, 80),
      createdAt: new Date().toISOString(),
    })
    toast.success("Adjustment posted to ledger")
    setAdjOpen(false)
    setAmount("")
    setNote("")
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Treasury & settlements"
        description="Deposits, withdrawals, rails (UPI / crypto / bank), and immutable ledger — filters apply to intake queues."
        actions={
          <>
            <AdminSecondaryButton onClick={exportLedger}>Reconcile</AdminSecondaryButton>
            <AdminPrimaryButton onClick={() => setAdjOpen(true)}>Post adjustment</AdminPrimaryButton>
          </>
        }
      />

      <Tabs defaultValue="kpi-dep" className="w-full">
        <TabsList
          className={cn(adminTabsListClass, "grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-4")}
        >
          <TabsTrigger value="kpi-dep" className={adminTabsTriggerClass}>
            Total deposits
          </TabsTrigger>
          <TabsTrigger value="kpi-wd" className={adminTabsTriggerClass}>
            Withdrawals paid
          </TabsTrigger>
          <TabsTrigger value="kpi-net" className={adminTabsTriggerClass}>
            Net flow
          </TabsTrigger>
          <TabsTrigger value="kpi-pend" className={adminTabsTriggerClass}>
            Pending WD
          </TabsTrigger>
        </TabsList>
        <TabsContent value="kpi-dep" className="mt-4 outline-none">
          <div className="admin-metric-tile p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Total deposits (credited)</p>
            <p className="mt-2 text-4xl font-semibold tabular-nums tracking-tight text-emerald-400">
              ${totals.depCredited.toLocaleString()}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Sum of all deposit requests marked <span className="text-slate-400">Credited</span> — intake actually booked to client wallets.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="kpi-wd" className="mt-4 outline-none">
          <div className="admin-metric-tile p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Total withdrawals (paid)</p>
            <p className="mt-2 text-4xl font-semibold tabular-nums tracking-tight text-slate-100">
              ${totals.wdPaid.toLocaleString()}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Outbound cash already released (<span className="text-slate-400">Paid</span>) across all rails.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="kpi-net" className="mt-4 outline-none">
          <div className="admin-metric-tile p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Net flow</p>
            <p
              className={cn(
                "mt-2 text-4xl font-semibold tabular-nums tracking-tight",
                totals.net >= 0 ? "text-teal-300" : "text-rose-300"
              )}
            >
              {totals.net >= 0 ? "+" : ""}${totals.net.toLocaleString()}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">Credited deposits minus paid withdrawals (treasury pulse).</p>
          </div>
        </TabsContent>
        <TabsContent value="kpi-pend" className="mt-4 outline-none">
          <div className="admin-metric-tile p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Pending withdrawals</p>
            <p className="mt-2 text-4xl font-semibold tabular-nums tracking-tight text-amber-300">${totals.pendingWd.toLocaleString()}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Outstanding exposure in <span className="text-slate-400">Pending</span> or <span className="text-slate-400">Approved</span> states.
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={adjOpen} onOpenChange={setAdjOpen}>
        <DialogContent className="border-white/10 bg-slate-950 text-slate-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manual ledger adjustment</DialogTitle>
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
              <Label className="text-white/70">Amount (USD, signed)</Label>
              <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="-25.00" className="border-white/10 bg-black/50 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Reference / note</Label>
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} className="min-h-[80px] border-white/10 bg-black/50 text-white" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" className="border-white/10 bg-white/[0.06]" onClick={() => setAdjOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="bg-teal-600 hover:bg-teal-500" onClick={postAdjustment}>
              Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className={cn(adminSurface, "p-4")}>
        <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Filters</p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label className="text-[11px] text-white/45">Payment rail</Label>
            <Select value={railFilter} onValueChange={(v) => setRailFilter(v as TreasuryRail | "all")}>
              <SelectTrigger className="h-9 w-[140px] border-white/10 bg-black/40 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All rails</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Crypto">Crypto</SelectItem>
                <SelectItem value="Bank">Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] text-white/45">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 w-[160px] border-white/10 bg-black/40 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Credited">Credited</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] text-white/45">Client</Label>
            <Input
              value={clientQ}
              onChange={(e) => setClientQ(e.target.value)}
              placeholder="Name contains…"
              className="h-9 w-[180px] border-white/10 bg-black/40 text-white"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="space-y-1">
              <Label className="text-[11px] text-white/45">From</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-9 border-white/10 bg-black/40 text-white" />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-white/45">To</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-9 border-white/10 bg-black/40 text-white" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="space-y-1">
              <Label className="text-[11px] text-white/45">Amt min</Label>
              <Input value={amtMin} onChange={(e) => setAmtMin(e.target.value)} placeholder="0" className="h-9 w-24 border-white/10 bg-black/40 text-white" />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-white/45">Amt max</Label>
              <Input value={amtMax} onChange={(e) => setAmtMax(e.target.value)} placeholder="∞" className="h-9 w-24 border-white/10 bg-black/40 text-white" />
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="deposits" className="space-y-4">
        <TabsList className={adminTabsListClass}>
          <TabsTrigger value="deposits" className={adminTabsTriggerClass}>
            Deposits
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className={adminTabsTriggerClass}>
            Withdrawals
          </TabsTrigger>
          <TabsTrigger value="ledger" className={adminTabsTriggerClass}>
            Ledger
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposits">
          <div className={cn(adminSurface, "overflow-hidden")}>
            <div className="overflow-x-auto">
              <div className={adminTableWrap}>
                <Table>
                  <TableHeader>
                    <TableRow className="border-transparent hover:bg-transparent">
                      <TableHead className="text-slate-500">Reference</TableHead>
                      <TableHead className="text-slate-500">Client</TableHead>
                      <TableHead className="text-right text-slate-500">Amount</TableHead>
                      <TableHead className="text-slate-500">Rail</TableHead>
                      <TableHead className="text-slate-500">Method</TableHead>
                      <TableHead className="text-slate-500">Status</TableHead>
                      <TableHead className="text-slate-500">Requested</TableHead>
                      <TableHead className="text-right text-slate-500">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {depositsFiltered.map((d) => (
                      <TableRow key={d.id} className="border-white/[0.06]">
                        <TableCell className="font-mono text-xs text-white/90">{d.id}</TableCell>
                        <TableCell className="text-white">{d.userName}</TableCell>
                        <TableCell className="text-right tabular-nums text-white">${d.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="border-0 bg-white/10 text-white/80">
                            {d.rail}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white/70">{d.method}</TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "border-0",
                              d.status === "Credited" && "bg-emerald-500/20 text-emerald-200",
                              d.status === "Pending" && "bg-amber-500/20 text-amber-100",
                              d.status === "Failed" && "bg-red-500/20 text-red-200"
                            )}
                          >
                            {d.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-white/45">{new Date(d.requestedAt).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          {d.status === "Pending" && (
                            <div className="flex justify-end gap-1">
                              <Button
                                size="sm"
                                className="h-8 bg-emerald-600 hover:bg-emerald-500"
                                onClick={() => setDepositStatus(d.id, "Credited")}
                              >
                                Credit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-red-500/40 text-red-300 hover:bg-red-500/10"
                                onClick={() => setDepositStatus(d.id, "Failed")}
                              >
                                Fail
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="withdrawals">
          <div className={cn(adminSurface, "overflow-hidden")}>
            <div className="overflow-x-auto">
              <div className={adminTableWrap}>
                <Table>
                  <TableHeader>
                    <TableRow className="border-transparent hover:bg-transparent">
                      <TableHead className="text-slate-500">Reference</TableHead>
                      <TableHead className="text-slate-500">Client</TableHead>
                      <TableHead className="text-right text-slate-500">Amount</TableHead>
                      <TableHead className="text-slate-500">Rail</TableHead>
                      <TableHead className="text-slate-500">Rail detail</TableHead>
                      <TableHead className="text-slate-500">Status</TableHead>
                      <TableHead className="text-slate-500">Requested</TableHead>
                      <TableHead className="text-right text-slate-500">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawalsFiltered.map((w) => (
                      <TableRow key={w.id} className="border-white/[0.06]">
                        <TableCell className="font-mono text-xs text-white/90">{w.id}</TableCell>
                        <TableCell className="text-white">{w.userName}</TableCell>
                        <TableCell className="text-right tabular-nums text-white">${w.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="border-0 bg-white/10 text-white/80">
                            {w.rail}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white/70">{w.method}</TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              "border-0",
                              w.status === "Paid" && "bg-emerald-500/20 text-emerald-200",
                              w.status === "Pending" && "bg-amber-500/20 text-amber-100",
                              w.status === "Approved" && "bg-sky-500/20 text-sky-100",
                              w.status === "Rejected" && "bg-red-500/20 text-red-200"
                            )}
                          >
                            {w.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-white/45">{new Date(w.requestedAt).toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          {w.status === "Pending" && (
                            <div className="flex justify-end gap-1">
                              <Button
                                size="sm"
                                className="h-8 bg-emerald-600 hover:bg-emerald-500"
                                onClick={() => setWithdrawalStatus(w.id, "Approved")}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-red-500/40 text-red-300"
                                onClick={() => setWithdrawalStatus(w.id, "Rejected")}
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                          {w.status === "Approved" && (
                            <Button
                              size="sm"
                              className="h-8 bg-gradient-to-r from-teal-500 to-cyan-500 font-semibold text-slate-950 hover:from-teal-400 hover:to-cyan-400"
                              onClick={() => setWithdrawalStatus(w.id, "Paid")}
                            >
                              Mark paid
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ledger">
          <div className={cn(adminSurface, "overflow-hidden")}>
            <div className="overflow-x-auto">
              <div className={adminTableWrap}>
                <Table>
                  <TableHeader>
                    <TableRow className="border-transparent hover:bg-transparent">
                      <TableHead className="text-slate-500">Entry</TableHead>
                      <TableHead className="text-slate-500">Client</TableHead>
                      <TableHead className="text-slate-500">Type</TableHead>
                      <TableHead className="text-right text-slate-500">Amount</TableHead>
                      <TableHead className="text-slate-500">Status</TableHead>
                      <TableHead className="text-slate-500">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.ledger.map((r) => (
                      <TableRow key={r.id} className="border-white/[0.06]">
                        <TableCell className="font-mono text-xs text-white/90">{r.id}</TableCell>
                        <TableCell className="text-white">{r.userName}</TableCell>
                        <TableCell className="text-white/75">{r.type}</TableCell>
                        <TableCell
                          className={cn(
                            "text-right font-mono tabular-nums",
                            r.amount >= 0 ? "text-emerald-400" : "text-red-400"
                          )}
                        >
                          {r.amount >= 0 ? "+" : ""}
                          {r.amount.toFixed(2)} {r.currency}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="border-0 bg-white/10 text-white/85">
                            {r.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-white/45">{new Date(r.createdAt).toLocaleString()}</TableCell>
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
