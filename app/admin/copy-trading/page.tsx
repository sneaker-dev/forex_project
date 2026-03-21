"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const masters = [
  { id: "M-001", name: "Hawk FX", strategy: "XAU Scalping", followers: 1820, fee: "20%", status: "Active" },
  { id: "M-002", name: "ByteX Quant", strategy: "Intraday", followers: 1540, fee: "18%", status: "Active" },
  { id: "M-003", name: "Voyager Macro", strategy: "Swing", followers: 890, fee: "15%", status: "Paused" },
]

const links = [
  { id: "L-9001", master: "Hawk FX", follower: "mdhani212@proton.me", allocation: "$1,000", mode: "Balanced", active: true },
  { id: "L-9002", master: "ByteX Quant", follower: "diptesh@example.com", allocation: "$2,500", mode: "Aggressive", active: true },
  { id: "L-9003", master: "Voyager Macro", follower: "demo@example.com", allocation: "$500", mode: "Conservative", active: false },
]

export default function AdminCopyTradingPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-white/10 bg-[#111]/90 text-white">
          <CardHeader>
            <CardTitle className="text-white">Master accounts</CardTitle>
            <CardDescription className="text-white/50">Approved strategy providers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{masters.length}</p>
            <p className="text-xs text-white/45">Configure onboarding and performance fees.</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#111]/90 text-white">
          <CardHeader>
            <CardTitle className="text-white">Active links</CardTitle>
            <CardDescription className="text-white/50">Follower allocations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-400">{links.filter((l) => l.active).length}</p>
            <p className="text-xs text-white/45">Live copy relationships</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#111]/90 text-white">
          <CardHeader>
            <CardTitle className="text-white">Risk events (24h)</CardTitle>
            <CardDescription className="text-white/50">Auto-pause / drawdown</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-300">0</p>
            <p className="text-xs text-white/45">Demo counter</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-[#111]/90 text-white shadow-none">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-white">Master providers</CardTitle>
            <CardDescription className="text-white/50">Visibility and fee policy</CardDescription>
          </div>
          <Button type="button" className="bg-red-600 hover:bg-red-500" onClick={() => toast.message("Add master (demo)")}>
            + Add master
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/55">ID</TableHead>
                <TableHead className="text-white/55">Name</TableHead>
                <TableHead className="text-white/55">Strategy</TableHead>
                <TableHead className="text-white/55">Followers</TableHead>
                <TableHead className="text-white/55">Perf. fee</TableHead>
                <TableHead className="text-white/55">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {masters.map((m) => (
                <TableRow key={m.id} className="border-white/10">
                  <TableCell className="font-mono text-xs">{m.id}</TableCell>
                  <TableCell className="font-medium text-white">{m.name}</TableCell>
                  <TableCell className="text-white/70">{m.strategy}</TableCell>
                  <TableCell className="tabular-nums text-white/80">{m.followers.toLocaleString()}</TableCell>
                  <TableCell className="text-white/80">{m.fee}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        m.status === "Active"
                          ? "border-0 bg-emerald-500/20 text-emerald-200"
                          : "border-0 bg-amber-500/20 text-amber-100"
                      }
                    >
                      {m.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-[#111]/90 text-white shadow-none">
        <CardHeader>
          <CardTitle className="text-white">Copy links</CardTitle>
          <CardDescription className="text-white/50">Master ↔ follower relationships</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/55">Link ID</TableHead>
                <TableHead className="text-white/55">Master</TableHead>
                <TableHead className="text-white/55">Follower</TableHead>
                <TableHead className="text-white/55">Allocation</TableHead>
                <TableHead className="text-white/55">Mode</TableHead>
                <TableHead className="text-white/55">State</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((l) => (
                <TableRow key={l.id} className="border-white/10">
                  <TableCell className="font-mono text-xs">{l.id}</TableCell>
                  <TableCell className="text-white">{l.master}</TableCell>
                  <TableCell className="text-white/75">{l.follower}</TableCell>
                  <TableCell className="tabular-nums text-white/80">{l.allocation}</TableCell>
                  <TableCell className="text-white/70">{l.mode}</TableCell>
                  <TableCell>
                    <Badge className={l.active ? "border-0 bg-emerald-500/20 text-emerald-200" : "border-0 bg-white/10 text-white/70"}>
                      {l.active ? "Active" : "Stopped"}
                    </Badge>
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
