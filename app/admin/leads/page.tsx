"use client"

import { useMemo, useState } from "react"
import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, adminSurface, adminTableWrap } from "@/components/admin/admin-ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import type { Lead, LeadStatus } from "@/lib/admin/types"
import { cn } from "@/lib/utils"

const AGENTS = ["Unassigned", "R. Patel", "L. Chen", "A. Sterling", "Guest Ops"]

/** Local calendar day bounds for ISO timestamps (createdAt, etc.). */
function isSameLocalDay(iso: string, dayStart: Date, dayEnd: Date) {
  const t = new Date(iso).getTime()
  return t >= dayStart.getTime() && t < dayEnd.getTime()
}

function phoneToTelHref(phone: string) {
  const compact = phone.replace(/\s/g, "")
  if (!compact) return undefined
  return `tel:${compact}`
}

export default function AdminLeadsPage() {
  const { state, addLead, updateLead, addUser } = useAdmin()
  const [sourceF, setSourceF] = useState<string>("all")
  const [statusF, setStatusF] = useState<string>("all")
  const [agentF, setAgentF] = useState<string>("all")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  const [noteOpen, setNoteOpen] = useState<string | null>(null)
  const [noteText, setNoteText] = useState("")

  const [schedOpen, setSchedOpen] = useState<string | null>(null)
  const [schedWhen, setSchedWhen] = useState("")
  const [viewLead, setViewLead] = useState<Lead | null>(null)

  const today = new Date().toISOString().slice(0, 10)

  const metrics = useMemo(() => {
    const now = new Date()
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayEnd.getDate() + 1)

    const total = state.leads.length
    const newToday = state.leads.filter(
      (l) => l.status === "New" && isSameLocalDay(l.createdAt, dayStart, dayEnd)
    ).length
    const converted = state.leads.filter((l) => l.status === "Converted").length
    const pending = state.leads.filter((l) => l.status === "Contacted" || l.status === "New").length
    return { total, newToday, converted, pending }
  }, [state.leads])

  const filtered = useMemo(() => {
    return state.leads.filter((l) => {
      if (sourceF !== "all" && l.source !== sourceF) return false
      if (statusF !== "all" && l.status !== statusF) return false
      if (agentF !== "all" && l.assignedTo !== agentF) return false
      if (from && l.lastContact !== "—" && l.lastContact < `${from}T00:00:00.000Z`) return false
      if (to && l.lastContact !== "—" && l.lastContact > `${to}T23:59:59.999Z`) return false
      return true
    })
  }, [state.leads, sourceF, statusF, agentF, from, to])

  const appendNote = (id: string) => {
    const lead = state.leads.find((l) => l.id === id)
    if (!lead) return
    const line = `[${new Date().toISOString().slice(0, 16)}] ${noteText.trim()}`
    updateLead(id, { notes: lead.notes ? `${lead.notes}\n${line}` : line })
    toast.success("Note added")
    setNoteOpen(null)
    setNoteText("")
  }

  const convertToClient = (id: string) => {
    const lead = state.leads.find((l) => l.id === id)
    if (!lead) return
    addUser({
      name: lead.name,
      email: lead.email,
      country: lead.country,
      status: "Pending",
      joined: today,
      lastActive: "Just now",
      kyc: "None",
      balance: 0,
      tier: "Retail",
    })
    updateLead(id, { status: "Converted", lastContact: new Date().toISOString() })
    toast.success("Client created from lead")
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Lead management"
        description="Pipeline metrics, assignment, status, notes, and conversion into the client registry."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="admin-metric-tile p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Total leads</p>
          <p className="mt-1 text-2xl font-semibold text-white">{metrics.total}</p>
        </div>
        <div className="admin-metric-tile p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">New today</p>
          <p className="mt-1 text-2xl font-semibold text-teal-300">{metrics.newToday}</p>
        </div>
        <div className="admin-metric-tile p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Converted</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-400">{metrics.converted}</p>
        </div>
        <div className="admin-metric-tile p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Pending follow-ups</p>
          <p className="mt-1 text-2xl font-semibold text-amber-300">{metrics.pending}</p>
        </div>
      </div>

      <div className={cn(adminSurface, "flex flex-wrap items-end gap-3 p-4")}>
        <div className="space-y-1">
          <Label className="text-[11px] text-white/45">Source</Label>
          <Select value={sourceF} onValueChange={setSourceF}>
            <SelectTrigger className="h-9 w-[140px] border-white/10 bg-black/40 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Ads">Ads</SelectItem>
              <SelectItem value="IB">IB</SelectItem>
              <SelectItem value="Organic">Organic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] text-white/45">Status</Label>
          <Select value={statusF} onValueChange={setStatusF}>
            <SelectTrigger className="h-9 w-[160px] border-white/10 bg-black/40 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="New">New</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Converted">Converted</SelectItem>
              <SelectItem value="Lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] text-white/45">Agent</Label>
          <Select value={agentF} onValueChange={setAgentF}>
            <SelectTrigger className="h-9 w-[160px] border-white/10 bg-black/40 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {AGENTS.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <div className="space-y-1">
            <Label className="text-[11px] text-white/45">From</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-9 border-white/10 bg-black/40 text-white" />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] text-white/45">To</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-9 border-white/10 bg-black/40 text-white" />
          </div>
        </div>
      </div>

      <Dialog open={!!noteOpen} onOpenChange={(o) => !o && setNoteOpen(null)}>
        <DialogContent className="border-white/10 bg-slate-950 text-slate-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add note</DialogTitle>
          </DialogHeader>
          <Textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} className="min-h-[100px] border-white/10 bg-black/50 text-white" />
          <DialogFooter>
            <Button type="button" className="bg-teal-600" onClick={() => noteOpen && appendNote(noteOpen)}>
              Save note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewLead} onOpenChange={(o) => !o && setViewLead(null)}>
        <DialogContent className="border-white/10 bg-slate-950 text-slate-100 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Lead details</DialogTitle>
          </DialogHeader>
          {viewLead && (
            <div className="space-y-3 text-sm">
              <div className="grid gap-1">
                <p className="text-xs uppercase text-white/45">Name</p>
                <p className="font-medium text-white">{viewLead.name}</p>
              </div>
              <div className="grid gap-1">
                <p className="text-xs uppercase text-white/45">Contact</p>
                <p className="text-white/85">{viewLead.phone}</p>
                <p className="text-white/60">{viewLead.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs uppercase text-white/45">Source</p>
                  <p className="text-white/85">{viewLead.source}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-white/45">Country</p>
                  <p className="text-white/85">{viewLead.country}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs uppercase text-white/45">Status</p>
                  <p className="text-white/85">{viewLead.status}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-white/45">Assigned</p>
                  <p className="text-white/85">{viewLead.assignedTo}</p>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase text-white/45">Created</p>
                <p className="text-white/85">{new Date(viewLead.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-white/45">Last contact</p>
                <p className="text-white/85">
                  {viewLead.lastContact === "—" ? "—" : new Date(viewLead.lastContact).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-white/45">Notes</p>
                <p className="max-h-40 overflow-y-auto whitespace-pre-wrap rounded border border-white/10 bg-black/40 p-2 text-white/80">
                  {viewLead.notes || "—"}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" className="border-white/15" onClick={() => setViewLead(null)}>
              Close
            </Button>
            {viewLead && phoneToTelHref(viewLead.phone) && (
              <Button type="button" className="bg-teal-600" asChild>
                <a href={phoneToTelHref(viewLead.phone)}>Call</a>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!schedOpen} onOpenChange={(o) => !o && setSchedOpen(null)}>
        <DialogContent className="border-white/10 bg-slate-950 text-slate-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule follow-up</DialogTitle>
          </DialogHeader>
          <Input type="datetime-local" value={schedWhen} onChange={(e) => setSchedWhen(e.target.value)} className="border-white/10 bg-black/50 text-white" />
          <DialogFooter>
            <Button
              type="button"
              className="bg-teal-600"
              onClick={() => {
                if (!schedOpen) return
                const lead = state.leads.find((l) => l.id === schedOpen)
                if (!lead) return
                const line = `[Follow-up ${schedWhen || "TBD"}] scheduled`
                updateLead(schedOpen, { notes: lead.notes ? `${lead.notes}\n${line}` : line, lastContact: new Date().toISOString() })
                toast.success("Follow-up logged")
                setSchedOpen(null)
                setSchedWhen("")
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className={cn(adminSurface, "overflow-hidden")}>
        <div className="overflow-x-auto">
          <div className={adminTableWrap}>
            <Table>
              <TableHeader>
                <TableRow className="border-transparent hover:bg-transparent">
                  <TableHead className="text-slate-500">Name</TableHead>
                  <TableHead className="text-slate-500">Phone / Email</TableHead>
                  <TableHead className="text-slate-500">Source</TableHead>
                  <TableHead className="text-slate-500">Country</TableHead>
                  <TableHead className="text-slate-500">Status</TableHead>
                  <TableHead className="text-slate-500">Assigned</TableHead>
                  <TableHead className="text-slate-500">Last contact</TableHead>
                  <TableHead className="text-right text-slate-500">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((l) => (
                  <TableRow key={l.id} className="border-white/[0.06]">
                    <TableCell className="font-medium text-white">{l.name}</TableCell>
                    <TableCell>
                      <p className="text-sm text-white/85">{l.phone}</p>
                      <p className="text-xs text-white/45">{l.email}</p>
                    </TableCell>
                    <TableCell className="text-white/70">{l.source}</TableCell>
                    <TableCell className="text-white/70">{l.country}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="border-0 bg-white/10 text-white/85">
                        {l.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={l.assignedTo}
                        onValueChange={(v) => updateLead(l.id, { assignedTo: v })}
                      >
                        <SelectTrigger className="h-8 w-[140px] border-white/10 bg-black/40 text-xs text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AGENTS.map((a) => (
                            <SelectItem key={a} value={a}>
                              {a}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-xs text-white/45">{l.lastContact === "—" ? "—" : new Date(l.lastContact).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-1">
                        <Button size="sm" variant="outline" className="h-8 border-white/15 text-[11px] text-white" onClick={() => setViewLead(l)}>
                          View
                        </Button>
                        {phoneToTelHref(l.phone) && (
                          <Button size="sm" variant="outline" className="h-8 border-white/15 text-[11px] text-white" asChild>
                            <a href={phoneToTelHref(l.phone)}>Call</a>
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="h-8 border-white/15 text-[11px] text-white" onClick={() => setNoteOpen(l.id)}>
                          Note
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 border-white/15 text-[11px] text-white" onClick={() => setSchedOpen(l.id)}>
                          Follow-up
                        </Button>
                        <Select
                          value={l.status}
                          onValueChange={(v) => updateLead(l.id, { status: v as LeadStatus, lastContact: new Date().toISOString() })}
                        >
                          <SelectTrigger className="h-8 w-[120px] border-white/10 bg-black/40 text-[11px] text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="New">New</SelectItem>
                            <SelectItem value="Contacted">Contacted</SelectItem>
                            <SelectItem value="Converted">Converted</SelectItem>
                            <SelectItem value="Lost">Lost</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          className="h-8 bg-emerald-600 text-[11px]"
                          disabled={l.status === "Converted"}
                          onClick={() => convertToClient(l.id)}
                        >
                          Convert
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
    </div>
  )
}
