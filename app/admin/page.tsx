"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, TrendingUp } from "lucide-react"
import { adminOverviewKpis, adminPlatformOverview, adminRecentUsers } from "@/lib/admin-mock-data"
import { cn } from "@/lib/utils"

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {adminOverviewKpis.map((k) => (
          <Card key={k.label} className="border-white/10 bg-[#111]/90 text-white shadow-none">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-white/55">{k.label}</p>
              <div className="mt-2 flex items-end justify-between gap-2">
                <p className="text-2xl font-bold tracking-tight">{k.value}</p>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-semibold",
                    k.positive ? "text-emerald-400" : "text-red-400"
                  )}
                >
                  {k.positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  {k.delta}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-[#111]/90 text-white shadow-none">
          <CardHeader>
            <CardTitle className="text-white">Recent Users</CardTitle>
            <CardDescription className="text-white/50">Latest registrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-0">
            {adminRecentUsers.map((u, i) => (
              <div
                key={u.email}
                className={cn(
                  "flex items-center justify-between gap-4 border-white/5 py-3 text-sm",
                  i !== adminRecentUsers.length - 1 && "border-b"
                )}
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">{u.name}</p>
                  <p className="truncate text-xs text-white/45">{u.email}</p>
                </div>
                <span className="shrink-0 text-xs text-white/50">{u.date}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-[#111]/90 text-white shadow-none">
          <CardHeader>
            <CardTitle className="text-white">Platform Overview</CardTitle>
            <CardDescription className="text-white/50">Operational snapshot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {adminPlatformOverview.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-black/30 px-4 py-3 text-sm"
              >
                <span className="text-white/70">{row.label}</span>
                <span className="font-semibold tabular-nums text-white">{row.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
