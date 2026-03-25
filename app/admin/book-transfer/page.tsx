"use client"

import { useMemo, useState } from "react"
import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, AdminPrimaryButton, adminSurface, adminTableWrap } from "@/components/admin/admin-ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { AbBookTag } from "@/lib/admin/types"
import { cn } from "@/lib/utils"

/** Demo: derive current book from user id hash */
function demoBook(userId: string): "A" | "B" {
  let h = 0
  for (let i = 0; i < userId.length; i++) h = (h + userId.charCodeAt(i)) % 2
  return h === 0 ? "A" : "B"
}

export default function AdminBookTransferPage() {
  const { state, addAbBookTransfer } = useAdmin()
  const [q, setQ] = useState("")
  const [userId, setUserId] = useState(state.users[0]?.id ?? "")
  const [targetBook, setTargetBook] = useState<"A" | "B">("A")
  const [reason, setReason] = useState("")
  const [tag, setTag] = useState<AbBookTag>("Risk management")

  const selected = state.users.find((u) => u.id === userId)
  const currentBook = selected ? demoBook(selected.id) : "A"

  const matches = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return state.users.slice(0, 8)
    return state.users.filter((u) => u.name.toLowerCase().includes(s) || u.id.toLowerCase().includes(s))
  }, [q, state.users])

  const submit = () => {
    if (!selected) return
    if (!reason.trim()) {
      toast.error("Reason is required.")
      return
    }
    if (targetBook === currentBook) {
      toast.error("Client is already on book " + targetBook)
      return
    }
    addAbBookTransfer({
      userId: selected.id,
      userName: selected.name,
      balanceSnapshot: selected.balance,
      previousBook: currentBook,
      nextBook: targetBook,
      reason: reason.trim(),
      tag,
    })
    toast.success(`Book transfer queued → ${targetBook}`)
    setReason("")
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="A/B book transfer"
        description="Move clients between internalization (A) and hedge/B-book (B) with reason codes and risk tags — audit trail below."
      />

      <div className={cn(adminSurface, "grid gap-6 p-6 lg:grid-cols-2")}>
        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="text-white/70">Search client (name or account ID)</Label>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Type to filter…"
              className="border-white/10 bg-black/50 text-white"
            />
          </div>
          <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-white/[0.06] bg-black/30 p-2">
            {matches.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  setUserId(u.id)
                  setQ("")
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm transition-colors",
                  userId === u.id ? "bg-teal-500/15 text-teal-100" : "text-white/80 hover:bg-white/[0.04]"
                )}
              >
                <span>{u.name}</span>
                <span className="font-mono text-[11px] text-white/40">{u.id}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {selected && (
            <>
              <div className="space-y-1">
                <Label className="text-white/70">Selected</Label>
                <p className="text-sm text-white/90">
                  {selected.name} · <span className="font-mono text-xs text-white/50">{selected.id}</span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-white/[0.06] bg-black/40 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-white/45">Balance</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-white">
                    ${selected.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-black/40 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-white/45">Current book</p>
                  <p className="mt-1 text-lg font-semibold text-teal-300">Book {currentBook}</p>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-white/70">Target book</Label>
                <Select value={targetBook} onValueChange={(v) => setTargetBook(v as "A" | "B")}>
                  <SelectTrigger className="border-white/10 bg-black/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Book A (internalize)</SelectItem>
                    <SelectItem value="B">Book B (hedge)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-white/70">Reason / tag</Label>
                <Select value={tag} onValueChange={(v) => setTag(v as AbBookTag)}>
                  <SelectTrigger className="border-white/10 bg-black/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Risk management">Risk management</SelectItem>
                    <SelectItem value="High profitability">High profitability</SelectItem>
                    <SelectItem value="Manual decision">Manual decision</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-white/70">Narrative</Label>
                <Textarea value={reason} onChange={(e) => setReason(e.target.value)} className="min-h-[80px] border-white/10 bg-black/50 text-white" />
              </div>
              <AdminPrimaryButton type="button" onClick={submit}>
                Execute transfer
              </AdminPrimaryButton>
            </>
          )}
        </div>
      </div>

      <div className={cn(adminSurface, "overflow-hidden")}>
        <div className="border-b border-white/[0.06] px-6 py-4">
          <h3 className="text-sm font-semibold text-white">Recent transfers</h3>
          <p className="text-xs text-white/45">Immutable log for compliance</p>
        </div>
        <div className="overflow-x-auto">
          <div className={adminTableWrap}>
            <Table>
              <TableHeader>
                <TableRow className="border-transparent hover:bg-transparent">
                  <TableHead className="text-slate-500">When</TableHead>
                  <TableHead className="text-slate-500">Client</TableHead>
                  <TableHead className="text-right text-slate-500">Balance snap.</TableHead>
                  <TableHead className="text-slate-500">From</TableHead>
                  <TableHead className="text-slate-500">To</TableHead>
                  <TableHead className="text-slate-500">Tag</TableHead>
                  <TableHead className="text-slate-500">Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.abBookTransfers.map((t) => (
                  <TableRow key={t.id} className="border-white/[0.06]">
                    <TableCell className="whitespace-nowrap text-xs text-white/45">{new Date(t.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="text-white">{t.userName}</TableCell>
                    <TableCell className="text-right tabular-nums text-white">${t.balanceSnapshot.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className="border-0 bg-white/10 text-white/85">Book {t.previousBook}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="border-0 bg-teal-500/20 text-teal-200">Book {t.nextBook}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-white/70">{t.tag}</TableCell>
                    <TableCell className="max-w-[220px] text-xs text-slate-400">{t.reason}</TableCell>
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
