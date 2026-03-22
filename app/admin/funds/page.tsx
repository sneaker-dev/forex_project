"use client"

import { useState } from "react"
import { useAdmin } from "@/components/admin/admin-provider"
import {
  AdminPageHeader,
  AdminPrimaryButton,
  AdminSecondaryButton,
  adminSurface,
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

export default function AdminFundsPage() {
  const { state, setWithdrawalStatus, setDepositStatus, appendLedger } = useAdmin()
  const [adjOpen, setAdjOpen] = useState(false)
  const [userId, setUserId] = useState(state.users[0]?.id ?? "")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")

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
        description="Deposit intake, withdrawal release, and immutable ledger — single operational pane."
        actions={
          <>
            <AdminSecondaryButton onClick={exportLedger}>Reconcile</AdminSecondaryButton>
            <AdminPrimaryButton onClick={() => setAdjOpen(true)}>Post adjustment</AdminPrimaryButton>
          </>
        }
      />

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
          <div className={cn(adminSurface, "overflow-x-auto")}>
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.08] hover:bg-transparent">
                  <TableHead className="text-slate-500">Reference</TableHead>
                  <TableHead className="text-slate-500">Client</TableHead>
                  <TableHead className="text-right text-slate-500">Amount</TableHead>
                  <TableHead className="text-slate-500">Method</TableHead>
                  <TableHead className="text-slate-500">Status</TableHead>
                  <TableHead className="text-slate-500">Requested</TableHead>
                  <TableHead className="text-right text-slate-500">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.deposits.map((d) => (
                  <TableRow key={d.id} className="border-white/[0.06]">
                    <TableCell className="font-mono text-xs text-white/90">{d.id}</TableCell>
                    <TableCell className="text-white">{d.userName}</TableCell>
                    <TableCell className="text-right tabular-nums text-white">${d.amount.toLocaleString()}</TableCell>
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
        </TabsContent>

        <TabsContent value="withdrawals">
          <div className={cn(adminSurface, "overflow-x-auto")}>
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.08] hover:bg-transparent">
                  <TableHead className="text-slate-500">Reference</TableHead>
                  <TableHead className="text-slate-500">Client</TableHead>
                  <TableHead className="text-right text-slate-500">Amount</TableHead>
                  <TableHead className="text-slate-500">Rail</TableHead>
                  <TableHead className="text-slate-500">Status</TableHead>
                  <TableHead className="text-slate-500">Requested</TableHead>
                  <TableHead className="text-right text-slate-500">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.withdrawals.map((w) => (
                  <TableRow key={w.id} className="border-white/[0.06]">
                    <TableCell className="font-mono text-xs text-white/90">{w.id}</TableCell>
                    <TableCell className="text-white">{w.userName}</TableCell>
                    <TableCell className="text-right tabular-nums text-white">${w.amount.toLocaleString()}</TableCell>
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
        </TabsContent>

        <TabsContent value="ledger">
          <div className={cn(adminSurface, "overflow-x-auto")}>
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.08] hover:bg-transparent">
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
