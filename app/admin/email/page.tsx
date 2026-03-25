"use client"

import { useState } from "react"
import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, adminSurface } from "@/components/admin/admin-ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { EmailSegment, EmailTemplate } from "@/lib/admin/types"

const VARIABLES = ["{{Name}}", "{{Email}}", "{{Balance}}", "{{Country}}", "{{Tier}}", "{{reference}}", "{{amount}}", "{{status}}"]

export default function AdminEmailPage() {
  const { state, updateEmailTemplate } = useAdmin()
  const [selected, setSelected] = useState<EmailTemplate | null>(state.emailTemplates[0] ?? null)

  const save = () => {
    if (!selected) return
    updateEmailTemplate(selected.id, {
      subjectLine: selected.subjectLine,
      bodyHtml: selected.bodyHtml,
      enabled: selected.enabled,
      segment: selected.segment,
    })
    toast.success("Template saved")
  }

  const pick = (id: string) => {
    const t = state.emailTemplates.find((x) => x.id === id)
    if (t) setSelected({ ...t })
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Email management"
        description="Edit subject and body, insert merge variables, toggle automation, and choose audience segments."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={cn(adminSurface, "overflow-hidden")}>
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.08] hover:bg-transparent">
                <TableHead className="text-white/55">Template</TableHead>
                <TableHead className="text-white/55">Trigger</TableHead>
                <TableHead className="text-white/55">On</TableHead>
                <TableHead className="text-white/55">Segment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.emailTemplates.map((e) => (
                <TableRow
                  key={e.id}
                  className={cn("cursor-pointer border-white/[0.06]", selected?.id === e.id && "bg-white/[0.04]")}
                  onClick={() => pick(e.id)}
                >
                  <TableCell className="font-medium text-white">{e.name}</TableCell>
                  <TableCell className="font-mono text-xs text-white/60">{e.trigger}</TableCell>
                  <TableCell>
                    <Badge className={e.enabled ? "border-0 bg-emerald-500/20 text-emerald-200" : "border-0 bg-white/10 text-white/50"}>
                      {e.enabled ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-white/70">{e.segment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {selected && (
          <div className={cn(adminSurface, "space-y-4 p-6")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-white">{selected.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50">Automation</span>
                <Switch
                  checked={selected.enabled}
                  onCheckedChange={(on) => setSelected({ ...selected, enabled: on })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-white/70">Send to (segmentation)</Label>
              <Select
                value={selected.segment}
                onValueChange={(v) => setSelected({ ...selected, segment: v as EmailSegment })}
              >
                <SelectTrigger className="border-white/10 bg-black/50 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All users</SelectItem>
                  <SelectItem value="ibs">IBs</SelectItem>
                  <SelectItem value="active_traders">Active traders</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-white/70">Subject</Label>
              <Input
                value={selected.subjectLine}
                onChange={(e) => setSelected({ ...selected, subjectLine: e.target.value })}
                className="border-white/10 bg-black/50 text-white"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-white/70">Body (HTML)</Label>
              <Textarea
                value={selected.bodyHtml}
                onChange={(e) => setSelected({ ...selected, bodyHtml: e.target.value })}
                className="min-h-[180px] border-white/10 bg-black/50 font-mono text-sm text-white"
              />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/45">Variables — click to append</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {VARIABLES.map((v) => (
                  <Button
                    key={v}
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-7 border-white/15 font-mono text-[11px] text-teal-300"
                    onClick={() => setSelected({ ...selected, bodyHtml: selected.bodyHtml + v })}
                  >
                    {v}
                  </Button>
                ))}
              </div>
            </div>
            <Button type="button" className="bg-teal-600 hover:bg-teal-500" onClick={save}>
              Save template
            </Button>
            <p className="text-[11px] text-white/35">
              Channel: {selected.channel} · Last send {new Date(selected.lastSent).toLocaleString()} · Open {selected.openRate}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
