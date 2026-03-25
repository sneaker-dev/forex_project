"use client"

import { useRef, useState } from "react"
import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, AdminPrimaryButton, adminSurface, adminTableWrap, adminTabsListClass, adminTabsTriggerClass } from "@/components/admin/admin-ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import type { CompetitionAdmin, CompetitionLifecycle, CompetitionPhase } from "@/lib/admin/types"

export default function AdminCompetitionsPage() {
  const { state, addCompetition } = useAdmin()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [startsAt, setStartsAt] = useState("")
  const [endsAt, setEndsAt] = useState("")
  const [lifecycleStatus, setLifecycleStatus] = useState<CompetitionLifecycle>("Scheduled")
  const [phase, setPhase] = useState<CompetitionPhase>("Draft")
  const [entryFeeUsd, setEntryFeeUsd] = useState("0")
  const [maxParticipants, setMaxParticipants] = useState("")
  const [std, setStd] = useState(true)
  const [ecn, setEcn] = useState(true)
  const [vip, setVip] = useState(false)
  const [reEntry, setReEntry] = useState(false)
  const [prizePool, setPrizePool] = useState("$10,000")
  const [prizeDistribution, setPrizeDistribution] = useState("Top 10 split evenly")
  const [bannerUrl, setBannerUrl] = useState("")
  const bannerFileRef = useRef<HTMLInputElement>(null)
  const [terms, setTerms] = useState("")
  const [leaderboardVisible, setLeaderboardVisible] = useState(true)

  const onBannerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Choose an image file (PNG, JPG, WebP, …).")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const url = typeof reader.result === "string" ? reader.result : ""
      if (url) {
        setBannerUrl(url)
        toast.success("Banner image loaded (stored as preview URL for this session).")
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ""
  }

  const submit = () => {
    if (!name.trim() || !startsAt || !endsAt) {
      toast.error("Name, start, and end are required.")
      return
    }
    const fee = Number.parseFloat(entryFeeUsd)
    const maxP = maxParticipants.trim() === "" ? null : Number.parseInt(maxParticipants, 10)
    const allowed: ("Standard" | "ECN" | "VIP")[] = []
    if (std) allowed.push("Standard")
    if (ecn) allowed.push("ECN")
    if (vip) allowed.push("VIP")
    if (allowed.length === 0) {
      toast.error("Select at least one account type.")
      return
    }
    addCompetition({
      name: name.trim(),
      description: description.trim() || "—",
      phase,
      lifecycleStatus,
      prizePool: prizePool.trim() || "$0",
      entrants: 0,
      startsAt: new Date(startsAt).toISOString(),
      endsAt: new Date(endsAt).toISOString(),
      entryFeeUsd: Number.isFinite(fee) ? fee : 0,
      maxParticipants: maxP !== null && Number.isFinite(maxP) ? maxP : null,
      allowedAccountTypes: allowed,
      reEntryAllowed: reEntry,
      prizeDistribution: prizeDistribution.trim(),
      bannerUrl: bannerUrl.trim(),
      terms: terms.trim() || "—",
      leaderboardVisible,
    })
    toast.success("Competition created")
    setName("")
    setDescription("")
    setStartsAt("")
    setEndsAt("")
    setBannerUrl("")
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Competitions"
        description="Season configuration, prize pools, eligibility, and leaderboard visibility."
      />

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className={adminTabsListClass}>
          <TabsTrigger value="list" className={adminTabsTriggerClass}>
            Competitions
          </TabsTrigger>
          <TabsTrigger value="create" className={adminTabsTriggerClass}>
            Create competition
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className={cn(adminSurface, "overflow-hidden")}>
            <div className="overflow-x-auto">
              <div className={adminTableWrap}>
                <Table>
                  <TableHeader>
                    <TableRow className="border-transparent hover:bg-transparent">
                      <TableHead className="text-white/55">Season</TableHead>
                      <TableHead className="text-white/55">Phase</TableHead>
                      <TableHead className="text-white/55">Lifecycle</TableHead>
                      <TableHead className="text-white/55">Prize pool</TableHead>
                      <TableHead className="text-right text-white/55">Entrants</TableHead>
                      <TableHead className="text-white/55">Ends</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.competitions.map((c) => (
                      <TableRow key={c.id} className="border-white/[0.06]">
                        <TableCell className="font-medium text-white">{c.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="border-0 bg-white/10 text-white/85">
                            {c.phase}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-white/60">{c.lifecycleStatus}</TableCell>
                        <TableCell className="text-emerald-400/90">{c.prizePool}</TableCell>
                        <TableCell className="text-right tabular-nums text-white">{c.entrants}</TableCell>
                        <TableCell className="text-white/60">{new Date(c.endsAt).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="create">
          <div className={cn(adminSurface, "grid max-w-3xl gap-4 p-6")}>
            <div className="space-y-1">
              <Label className="text-white/70">Competition name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="border-white/10 bg-black/50 text-white" />
            </div>
            <div className="space-y-1">
              <Label className="text-white/70">Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[80px] border-white/10 bg-black/50 text-white" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-white/70">Start date &amp; time</Label>
                <Input type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className="border-white/10 bg-black/50 text-white" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/70">End date &amp; time</Label>
                <Input type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} className="border-white/10 bg-black/50 text-white" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-white/70">Phase</Label>
                <Select value={phase} onValueChange={(v) => setPhase(v as CompetitionPhase)}>
                  <SelectTrigger className="border-white/10 bg-black/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-white/70">Lifecycle status</Label>
                <Select value={lifecycleStatus} onValueChange={(v) => setLifecycleStatus(v as CompetitionLifecycle)}>
                  <SelectTrigger className="border-white/10 bg-black/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Live">Live</SelectItem>
                    <SelectItem value="Ended">Ended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-white/70">Entry fee (USD)</Label>
                <Input value={entryFeeUsd} onChange={(e) => setEntryFeeUsd(e.target.value)} className="border-white/10 bg-black/50 text-white" />
              </div>
              <div className="space-y-1">
                <Label className="text-white/70">Max participants (optional)</Label>
                <Input
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(e.target.value)}
                  placeholder="Unlimited"
                  className="border-white/10 bg-black/50 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Allowed account types</Label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm text-white/80">
                  <Checkbox checked={std} onCheckedChange={(v) => setStd(!!v)} />
                  Standard
                </label>
                <label className="flex items-center gap-2 text-sm text-white/80">
                  <Checkbox checked={ecn} onCheckedChange={(v) => setEcn(!!v)} />
                  ECN
                </label>
                <label className="flex items-center gap-2 text-sm text-white/80">
                  <Checkbox checked={vip} onCheckedChange={(v) => setVip(!!v)} />
                  VIP
                </label>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-white/80">
              <Checkbox checked={reEntry} onCheckedChange={(v) => setReEntry(!!v)} />
              Re-entry allowed
            </label>
            <div className="space-y-1">
              <Label className="text-white/70">Total prize pool</Label>
              <Input value={prizePool} onChange={(e) => setPrizePool(e.target.value)} className="border-white/10 bg-black/50 text-white" />
            </div>
            <div className="space-y-1">
              <Label className="text-white/70">Prize distribution</Label>
              <Textarea value={prizeDistribution} onChange={(e) => setPrizeDistribution(e.target.value)} className="border-white/10 bg-black/50 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/70">Banner image</Label>
              <p className="text-xs text-white/45">Upload a file (stored as a data URL in admin state) or paste an HTTPS URL.</p>
              <div className="flex flex-wrap items-center gap-2">
                <input ref={bannerFileRef} type="file" accept="image/*" className="hidden" onChange={onBannerFile} />
                <AdminPrimaryButton type="button" className="h-9" onClick={() => bannerFileRef.current?.click()}>
                  Upload image
                </AdminPrimaryButton>
                <Input
                  value={bannerUrl.startsWith("data:") ? "" : bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="Or paste banner URL (https://…)"
                  className="min-w-[200px] flex-1 border-white/10 bg-black/50 text-white"
                />
              </div>
              {bannerUrl ? (
                <div className="mt-2 overflow-hidden rounded-md border border-white/10 bg-black/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={bannerUrl} alt="Banner preview" className="max-h-40 w-full object-cover" />
                </div>
              ) : null}
            </div>
            <div className="space-y-1">
              <Label className="text-white/70">Terms &amp; conditions</Label>
              <Textarea value={terms} onChange={(e) => setTerms(e.target.value)} className="min-h-[100px] border-white/10 bg-black/50 text-white" />
            </div>
            <label className="flex items-center gap-2 text-sm text-white/80">
              <Checkbox checked={leaderboardVisible} onCheckedChange={(v) => setLeaderboardVisible(!!v)} />
              Leaderboard visible to clients
            </label>
            <AdminPrimaryButton type="button" onClick={submit}>
              Create competition
            </AdminPrimaryButton>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
