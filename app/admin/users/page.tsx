"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, AdminPrimaryButton, AdminSecondaryButton, AdminToolbar, adminSurface } from "@/components/admin/admin-ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { downloadCsv } from "@/lib/admin/download"
import type { AdminUser, UserStatus } from "@/lib/admin/types"

const PAGE_SIZE = 8

export default function AdminUsersPage() {
  const { state, setUserStatus, addUser } = useAdmin()
  const [q, setQ] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(0)
  const [newOpen, setNewOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [country, setCountry] = useState("")
  const [tier, setTier] = useState<AdminUser["tier"]>("Retail")

  const exportCsv = () => {
    const headers = ["id", "name", "email", "country", "status", "tier", "kyc", "balance", "joined", "lastActive"]
    const rows = state.users.map((u) => [
      u.id,
      u.name,
      u.email,
      u.country,
      u.status,
      u.tier,
      u.kyc,
      u.balance,
      u.joined,
      u.lastActive,
    ])
    downloadCsv(`clients-${new Date().toISOString().slice(0, 10)}.csv`, headers, rows)
    toast.success("CSV downloaded")
  }

  const submitNew = () => {
    if (!name.trim() || !email.trim() || !country.trim()) {
      toast.error("Name, email, and country are required.")
      return
    }
    const today = new Date().toISOString().slice(0, 10)
    addUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      country: country.trim(),
      status: "Pending",
      joined: today,
      lastActive: "Just now",
      kyc: "None",
      balance: 0,
      tier,
    })
    toast.success("Client created")
    setNewOpen(false)
    setName("")
    setEmail("")
    setCountry("")
    setTier("Retail")
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return state.users.filter((u) => {
      const match =
        !s ||
        u.name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        u.country.toLowerCase().includes(s) ||
        u.id.toLowerCase().includes(s)
      const st = statusFilter === "all" || u.status === statusFilter
      return match && st
    })
  }, [state.users, q, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageSafe = Math.min(page, pageCount - 1)
  const slice = filtered.slice(pageSafe * PAGE_SIZE, pageSafe * PAGE_SIZE + PAGE_SIZE)

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Client registry"
        description="Authoritative list of trading profiles, tiers, and verification posture."
        actions={
          <>
            <AdminSecondaryButton onClick={exportCsv}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </AdminSecondaryButton>
            <AdminPrimaryButton onClick={() => setNewOpen(true)}>New client</AdminPrimaryButton>
          </>
        }
      />

      <AdminToolbar>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <Input
            value={q}
            onChange={(e) => {
              setPage(0)
              setQ(e.target.value)
            }}
            placeholder="Search name, email, country, client ID…"
            className="border-white/10 bg-black/40 pl-9 text-white placeholder:text-white/35"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setPage(0)
            setStatusFilter(v)
          }}
        >
          <SelectTrigger className="w-full border-white/10 bg-black/40 text-white sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </AdminToolbar>

      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="border-white/10 bg-slate-950 text-slate-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New client</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label className="text-white/70">Full name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-white/10 bg-black/40 text-white"
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-white/10 bg-black/40 text-white"
                placeholder="jane@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Country</Label>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="border-white/10 bg-black/40 text-white"
                placeholder="United Kingdom"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Tier</Label>
              <Select value={tier} onValueChange={(v) => setTier(v as AdminUser["tier"])}>
                <SelectTrigger className="border-white/10 bg-black/40 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" className="border-white/10 bg-white/[0.06]" onClick={() => setNewOpen(false)}>
              Cancel
            </Button>
            <Button type="button" className="bg-teal-600 hover:bg-teal-500" onClick={submitNew}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className={cn(adminSurface, "overflow-hidden")}>
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.08] hover:bg-transparent">
              <TableHead className="text-slate-500">Client</TableHead>
              <TableHead className="text-slate-500">Country</TableHead>
              <TableHead className="text-slate-500">Tier</TableHead>
              <TableHead className="text-slate-500">KYC</TableHead>
              <TableHead className="text-right text-slate-500">Balance</TableHead>
              <TableHead className="text-slate-500">Status</TableHead>
              <TableHead className="text-right text-slate-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slice.map((u) => (
              <TableRow key={u.id} className="border-white/[0.06]">
                <TableCell>
                  <div>
                    <p className="font-medium text-slate-100">{u.name}</p>
                    <p className="text-xs text-white/45">{u.email}</p>
                    <p className="font-mono text-[10px] text-white/30">{u.id}</p>
                  </div>
                </TableCell>
                <TableCell className="text-white/70">{u.country}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="border-0 bg-white/10 text-white/85">
                    {u.tier}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      u.kyc === "Verified" && "text-emerald-400",
                      u.kyc === "Pending" && "text-amber-300",
                      u.kyc === "Rejected" && "text-red-400"
                    )}
                  >
                    {u.kyc}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums text-white/90">
                  ${u.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  <Select
                    value={u.status}
                    onValueChange={(v) => setUserStatus(u.id, v as UserStatus)}
                  >
                    <SelectTrigger className="h-8 w-[130px] border-white/10 bg-black/50 text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm" variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10">
                    <Link href={`/admin/users/${u.id}`}>Open</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] px-4 py-3 text-xs text-white/45">
          <span>
            Showing {slice.length ? pageSafe * PAGE_SIZE + 1 : 0}–{pageSafe * PAGE_SIZE + slice.length} of {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/60 hover:bg-white/10"
              disabled={pageSafe <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/60 hover:bg-white/10"
              disabled={pageSafe >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
