"use client"

import { useState } from "react"
import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, AdminPrimaryButton, adminSurface } from "@/components/admin/admin-ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { toast } from "sonner"
import type { SupportTicket } from "@/lib/admin/types"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const ASSIGNEES = ["Unassigned", "Support Team A", "Support Team B", "Finance Desk", "Compliance"]

export default function AdminSupportPage() {
  const { state, setTicketStatus, setTicketAssignee, addSupportTicket } = useAdmin()
  const [open, setOpen] = useState(false)
  const [userId, setUserId] = useState(state.users[0]?.id ?? "")
  const [subject, setSubject] = useState("")
  const [category, setCategory] = useState<SupportTicket["category"]>("Payments")
  const [priority, setPriority] = useState<SupportTicket["priority"]>("Normal")
  const [assignee, setAssignee] = useState("Unassigned")

  const resetForm = () => {
    setUserId(state.users[0]?.id ?? "")
    setSubject("")
    setCategory("Payments")
    setPriority("Normal")
    setAssignee("Unassigned")
  }

  const submit = () => {
    const u = state.users.find((x) => x.id === userId)
    if (!u || !subject.trim()) {
      toast.error("Pick a client and enter a subject.")
      return
    }
    addSupportTicket({
      userId: u.id,
      userName: u.name,
      subject: subject.trim(),
      category,
      priority,
      status: "Open",
      assignee,
    })
    toast.success("Ticket created")
    setOpen(false)
    resetForm()
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Support desk"
        description="SLA-aware queue with routing, ownership, and resolution states."
        actions={
          <AdminPrimaryButton
            onClick={() => {
              resetForm()
              setOpen(true)
            }}
          >
            New ticket
          </AdminPrimaryButton>
        }
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-white/10 bg-slate-950 text-slate-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New support ticket</DialogTitle>
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
                      {u.name} ({u.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Subject</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary"
                className="border-white/10 bg-black/50 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-white/70">Category</Label>
                <Select value={category} onValueChange={(v) => setCategory(v as SupportTicket["category"])}>
                  <SelectTrigger className="border-white/10 bg-black/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Payments">Payments</SelectItem>
                    <SelectItem value="Trading">Trading</SelectItem>
                    <SelectItem value="Account">Account</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as SupportTicket["priority"])}>
                  <SelectTrigger className="border-white/10 bg-black/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Assignee</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger className="border-white/10 bg-black/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSIGNEES.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" className="border-white/10 bg-white/[0.06]" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="bg-teal-600 hover:bg-teal-500" onClick={submit}>
              Create ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className={cn(adminSurface, "overflow-x-auto")}>
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.08] hover:bg-transparent">
              <TableHead className="text-white/55">ID</TableHead>
              <TableHead className="text-white/55">Client</TableHead>
              <TableHead className="text-white/55">Subject</TableHead>
              <TableHead className="text-white/55">Category</TableHead>
              <TableHead className="text-white/55">Priority</TableHead>
              <TableHead className="text-white/55">Status</TableHead>
              <TableHead className="text-white/55">Assignee</TableHead>
              <TableHead className="text-right text-white/55">Resolve</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.tickets.map((t) => (
              <TableRow key={t.id} className="border-white/[0.06]">
                <TableCell className="font-mono text-xs text-white/90">{t.id}</TableCell>
                <TableCell>
                  <Link href={`/admin/users/${t.userId}`} className="text-white hover:underline">
                    {t.userName}
                  </Link>
                </TableCell>
                <TableCell className="max-w-[220px] text-white/85">{t.subject}</TableCell>
                <TableCell className="text-white/60">{t.category}</TableCell>
                <TableCell>
                  <PriorityBadge p={t.priority} />
                </TableCell>
                <TableCell className="text-white/75">{t.status}</TableCell>
                <TableCell>
                  <Select value={t.assignee} onValueChange={(v) => setTicketAssignee(t.id, v)}>
                    <SelectTrigger className="h-8 w-[150px] border-white/10 bg-black/50 text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ASSIGNEES.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <TicketActions t={t} onSet={setTicketStatus} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function PriorityBadge({ p }: { p: SupportTicket["priority"] }) {
  const cls =
    p === "Urgent"
      ? "bg-red-500/20 text-red-200"
      : p === "High"
        ? "bg-orange-500/20 text-orange-200"
        : p === "Normal"
          ? "bg-sky-500/20 text-sky-100"
          : "bg-white/10 text-white/70"
  return (
    <Badge className={cn("border-0", cls)}>{p}</Badge>
  )
}

function TicketActions({
  t,
  onSet,
}: {
  t: SupportTicket
  onSet: (id: string, s: SupportTicket["status"]) => void
}) {
  if (t.status === "Resolved" || t.status === "Closed") return <span className="text-xs text-white/35">—</span>
  return (
    <div className="flex justify-end gap-1">
      <button
        type="button"
        className="text-xs font-medium text-emerald-400 hover:underline"
        onClick={() => onSet(t.id, "Resolved")}
      >
        Resolve
      </button>
    </div>
  )
}
