"use client"

import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, AdminPrimaryButton, adminSurface } from "@/components/admin/admin-ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { SupportTicket } from "@/lib/admin/types"

const ASSIGNEES = ["Unassigned", "Support Team A", "Support Team B", "Finance Desk", "Compliance"]

export default function AdminSupportPage() {
  const { state, setTicketStatus, setTicketAssignee } = useAdmin()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Support desk"
        description="SLA-aware queue with routing, ownership, and resolution states."
        actions={
          <AdminPrimaryButton onClick={() => toast.message("Create ticket", { description: "Internal ticket composer." })}>
            New ticket
          </AdminPrimaryButton>
        }
      />

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
