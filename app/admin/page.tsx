"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, AdminPanel, AdminStatCard, AdminPrimaryButton, adminSurface } from "@/components/admin/admin-ui"
import { cn } from "@/lib/utils"
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  LineChart,
  Users,
  Wallet,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AdminOverviewPage() {
  const { state } = useAdmin()

  const kpis = useMemo(() => {
    const totalUsers = state.users.length
    const activeToday = state.users.filter((u) => u.status === "Active").length
    const vol = state.series.reduce((a, b) => a + b.volume, 0)
    const dep = state.series.reduce((a, b) => a + b.deposits, 0)
    const wdr = state.series.reduce((a, b) => a + b.withdrawals, 0)
    const openTrades = state.trades.filter((t) => t.status === "OPEN").length
    const pendingWd = state.withdrawals.filter((w) => w.status === "Pending").length
    const pendingKyc = state.kycItems.filter((k) => k.status === "Queued" || k.status === "In Review").length
    const pendingDp = state.deposits.filter((d) => d.status === "Pending").length
    return {
      totalUsers,
      activeToday,
      dep,
      wdr,
      netFlow: dep - wdr,
      openTrades,
      pendingWd,
      pendingKyc,
      pendingDp,
      vol,
    }
  }, [state])

  const recentUsers = useMemo(() => {
    return [...state.users]
      .sort((a, b) => (a.joined < b.joined ? 1 : -1))
      .slice(0, 6)
  }, [state.users])

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Operations overview"
        description="Real-time snapshot of clients, flows, and risk — data persists locally for this workstation session."
        actions={
          <>
            <Button
              asChild
              variant="secondary"
              className="border border-white/10 bg-white/[0.06] text-white hover:bg-white/10"
            >
              <Link href="/admin/users">Open user registry</Link>
            </Button>
            <AdminPrimaryButton asChild>
              <Link href="/admin/trades">Trade monitor</Link>
            </AdminPrimaryButton>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total clients"
          value={String(kpis.totalUsers)}
          delta="vs last month +12%"
          positive
          hint="Registered profiles"
          icon={Users}
        />
        <AdminStatCard
          label="Active accounts"
          value={String(kpis.activeToday)}
          delta="Engaged profiles"
          positive
          hint="Status = Active"
          icon={Activity}
        />
        <AdminStatCard
          label="7d deposits (index)"
          value={`$${(kpis.dep / 1000).toFixed(0)}k`}
          delta="Rolling window (chart data)"
          positive
          hint="Not bank settlement"
          icon={Wallet}
        />
        <AdminStatCard
          label="7d withdrawals (index)"
          value={`$${(kpis.wdr / 1000).toFixed(0)}k`}
          delta={kpis.netFlow >= 0 ? "Net inflow" : "Net outflow"}
          positive={kpis.netFlow >= 0}
          hint={`Net ${kpis.netFlow >= 0 ? "+" : ""}$${(kpis.netFlow / 1000).toFixed(1)}k`}
          icon={CreditCard}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <AdminPanel title="Liquidity & volume" description="Indexed flows — use for trend monitoring" className="xl:col-span-2">
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={state.series}>
                <defs>
                  <linearGradient id="adminDep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="adminWdr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    background: "#0f0f0f",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "#fff",
                  }}
                  formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name === "deposits" ? "Deposits" : "Withdrawals"]}
                />
                <Area type="monotone" dataKey="deposits" stroke="#f87171" strokeWidth={2} fillOpacity={1} fill="url(#adminDep)" name="deposits" />
                <Area type="monotone" dataKey="withdrawals" stroke="#34d399" strokeWidth={2} fillOpacity={1} fill="url(#adminWdr)" name="withdrawals" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminPanel>

        <AdminPanel title="Risk & queues" description="Items needing attention">
          <ul className="space-y-3">
            <QueueRow label="Pending KYC" value={kpis.pendingKyc} href="/admin/kyc" tone="amber" />
            <QueueRow label="Pending withdrawals" value={kpis.pendingWd} href="/admin/funds" tone="red" />
            <QueueRow label="Pending deposits" value={kpis.pendingDp} href="/admin/funds" tone="sky" />
            <QueueRow label="Open positions" value={kpis.openTrades} href="/admin/trades" tone="emerald" />
          </ul>
        </AdminPanel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminPanel
          title="Notional volume (7d)"
          description="Synthetic index for desk monitoring"
          action={
            <LineChart className="h-4 w-4 text-white/35" />
          }
        >
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={state.series}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#0f0f0f",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "#fff",
                  }}
                  formatter={(v: number) => [`${v.toFixed(2)}M`, "Volume index"]}
                />
                <Bar dataKey="volume" fill="rgba(248,113,113,0.55)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminPanel>

        <AdminPanel title="Audit stream" description="Latest privileged actions on this workstation">
          <ul className="max-h-[220px] space-y-3 overflow-y-auto pr-1">
            {state.activity.map((a) => (
              <li
                key={a.id}
                className="flex gap-3 rounded-xl border border-white/[0.06] bg-black/30 px-3 py-2.5 text-sm"
              >
                <span
                  className={cn(
                    "mt-1 h-2 w-2 shrink-0 rounded-full",
                    a.severity === "success" && "bg-emerald-400",
                    a.severity === "warning" && "bg-amber-400",
                    a.severity === "danger" && "bg-red-500",
                    a.severity === "info" && "bg-sky-400"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white/90">{a.action}</p>
                  <p className="text-xs text-white/45">
                    {a.actor} · <span className="font-mono text-white/55">{a.target}</span>
                  </p>
                  <p className="text-[10px] text-white/35">
                    {formatDistanceToNow(new Date(a.at), { addSuffix: true })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </AdminPanel>
      </div>

      <div className={cn(adminSurface, "overflow-hidden")}>
        <div className="flex flex-col gap-4 border-b border-white/[0.06] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Recent registrations</h3>
            <p className="text-sm text-white/45">Newest profiles — drill into compliance and lifecycle</p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="gap-1 text-red-400 hover:bg-white/5 hover:text-red-300"
          >
            <Link href="/admin/users">
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="divide-y divide-white/[0.06]">
          {recentUsers.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
              <div>
                <p className="font-medium text-white">{u.name}</p>
                <p className="text-xs text-white/45">{u.email}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="border-0 bg-white/10 text-white/80">
                  {u.tier}
                </Badge>
                <Badge
                  className={cn(
                    "border-0",
                    u.kyc === "Verified" && "bg-emerald-500/20 text-emerald-200",
                    u.kyc === "Pending" && "bg-amber-500/20 text-amber-100",
                    u.kyc === "Rejected" && "bg-red-500/20 text-red-200",
                    u.kyc === "None" && "bg-white/10 text-white/70"
                  )}
                >
                  KYC {u.kyc}
                </Badge>
                <span className="text-xs text-white/40">Joined {u.joined}</span>
                <Button asChild size="sm" variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10">
                  <Link href={`/admin/users/${u.id}`}>Profile</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function QueueRow({
  label,
  value,
  href,
  tone,
}: {
  label: string
  value: number
  href: string
  tone: "amber" | "red" | "sky" | "emerald"
}) {
  const ring =
    tone === "amber"
      ? "text-amber-300"
      : tone === "red"
        ? "text-red-300"
        : tone === "sky"
          ? "text-sky-300"
          : "text-emerald-300"
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-black/25 px-4 py-3">
      <span className="text-sm text-white/70">{label}</span>
      <div className="flex items-center gap-3">
        <span className={cn("text-lg font-semibold tabular-nums", ring)}>{value}</span>
        <Link href={href} className="text-xs font-medium text-red-400/90 hover:text-red-300">
          Open
        </Link>
      </div>
    </li>
  )
}
