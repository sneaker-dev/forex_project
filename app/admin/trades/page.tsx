"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { adminTradeMetrics, adminTrades } from "@/lib/admin-mock-data"
import { cn } from "@/lib/utils"
import { Pencil, Search, Trash2, CheckCircle2, TrendingDown, TrendingUp } from "lucide-react"
import { toast } from "sonner"

export default function AdminTradesPage() {
  const [status, setStatus] = useState("all")
  const [q, setQ] = useState("")

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    return adminTrades.filter((t) => {
      if (status !== "all" && t.status !== status) return false
      if (!s) return true
      return (
        t.id.toLowerCase().includes(s) ||
        t.userName.toLowerCase().includes(s) ||
        t.symbol.toLowerCase().includes(s)
      )
    })
  }, [q, status])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminTradeMetrics.map((m) => (
          <Card key={m.label} className="border-white/10 bg-[#111]/90 text-white shadow-none">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-white/55">{m.label}</p>
              <p className={cn("mt-2 text-2xl font-bold tracking-tight", m.highlight && "text-emerald-400")}>
                {m.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-[#111]/90 text-white shadow-none">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-white">All Trades</CardTitle>
            <CardDescription className="text-white/50">Platform-wide execution log (demo data)</CardDescription>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-500"
              onClick={() => toast.message("Create trade", { description: "Opens ticket composer (demo)." })}
            >
              + Create Trade
            </Button>
            <div className="relative flex-1 sm:min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search trades..."
                className="border-white/10 bg-black/40 pl-9 text-white placeholder:text-white/35"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="border-white/10 bg-black/40 text-white sm:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="CLOSED">CLOSED</SelectItem>
                <SelectItem value="OPEN">OPEN</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/55">Trade ID</TableHead>
                <TableHead className="text-white/55">User</TableHead>
                <TableHead className="text-white/55">Symbol</TableHead>
                <TableHead className="text-white/55">Side</TableHead>
                <TableHead className="text-white/55">Lots</TableHead>
                <TableHead className="text-white/55">Open Price</TableHead>
                <TableHead className="text-white/55">P&amp;L</TableHead>
                <TableHead className="text-white/55">Status</TableHead>
                <TableHead className="text-right text-white/55">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((t) => (
                <TableRow key={t.id} className="border-white/10">
                  <TableCell className="font-mono text-xs text-white/90">{t.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-white">{t.userName}</p>
                      <p className="text-[11px] text-white/40">{t.userId}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-white/80">{t.symbol}</TableCell>
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
                  <TableCell className="tabular-nums text-white/80">{t.lots}</TableCell>
                  <TableCell className="tabular-nums text-white/80">{t.openPrice}</TableCell>
                  <TableCell
                    className={cn(
                      "tabular-nums font-medium",
                      t.pnlPositive ? "text-emerald-400" : "text-red-400"
                    )}
                  >
                    {t.pnlPositive ? "+" : ""}
                    {t.pnl}
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
                        className="h-8 w-8 text-white/60 hover:bg-white/10 hover:text-white"
                        onClick={() => toast.message("Edit trade", { description: t.id })}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-white/60 hover:bg-white/10 hover:text-white"
                        onClick={() => toast.message("Verify trade", { description: t.id })}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-400/80 hover:bg-red-500/10 hover:text-red-300"
                        onClick={() => toast.message("Delete trade", { description: t.id })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
