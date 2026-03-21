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

const TOOLTIP_STYLE = {
  background: "rgba(15, 23, 42, 0.96)",
  border: "1px solid rgba(148, 163, 184, 0.15)",
  borderRadius: 14,
  color: "#f1f5f9",
  boxShadow: "0 16px 48px -12px rgba(0,0,0,0.6)",
}

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
    <div className="space-y-10">
      <AdminPageHeader
        title="Operational intelligence"
        description="A consolidated view of registry health, liquidity, and desk workload. Data persists in-browser for review sessions."
        actions={
          <>
            <Button
              asChild
              variant="secondary"
              className="rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]"
            >
              <Link href="/admin/users">Client registry</Link>
            </Button>
            <AdminPrimaryButton asChild>
              <Link href="/admin/trades">Execution monitor</Link>
            </AdminPrimaryButton>
          </>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Registered clients"
          value={String(kpis.totalUsers)}
          delta="Rolling growth +12% (index)"
          positive
          hint="Unique profiles"
          icon={Users}
        />
        <AdminStatCard
          label="Active relationships"
          value={String(kpis.activeToday)}
          delta="Accounts in good standing"
          positive
          hint="Status: Active"
          icon={Activity}
        />
        <AdminStatCard
          label="7d deposit index"
          value={`$${(kpis.dep / 1000).toFixed(0)}k`}
          delta="Treasury inflow signal"
          positive
          hint="Indexed, not settled cash"
          icon={Wallet}
        />
        <AdminStatCard
          label="7d withdrawal index"
          value={`$${(kpis.wdr / 1000).toFixed(0)}k`}
          delta={kpis.netFlow >= 0 ? "Net liquidity positive" : "Net liquidity draw"}
          positive={kpis.netFlow >= 0}
          hint={`Net ${kpis.netFlow >= 0 ? "+" : ""}$${(kpis.netFlow / 1000).toFixed(1)}k`}
          icon={CreditCard}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <AdminPanel
          title="Liquidity bands"
          description="Deposit vs withdrawal pressure — use for intraday treasury posture"
          className="xl:col-span-2"
        >
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={state.series}>
                <defs>
                  <linearGradient id="adminDep" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="adminWdr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={TOOLTIP_STYLE}
                  formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name === "deposits" ? "Deposits" : "Withdrawals"]}
                />
                <Area type="monotone" dataKey="deposits" stroke="#2dd4bf" strokeWidth={2} fillOpacity={1} fill="url(#adminDep)" name="deposits" />
                <Area type="monotone" dataKey="withdrawals" stroke="#a5b4fc" strokeWidth={2} fillOpacity={1} fill="url(#adminWdr)" name="withdrawals" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminPanel>

        <AdminPanel title="Attention queue" description="What the desk should clear next">
          <ul className="space-y-3">
            <QueueRow label="KYC pending" value={kpis.pendingKyc} href="/admin/kyc" accent="amber" />
            <QueueRow label="Withdrawals" value={kpis.pendingWd} href="/admin/funds" accent="rose" />
            <QueueRow label="Deposits" value={kpis.pendingDp} href="/admin/funds" accent="cyan" />
            <QueueRow label="Open risk" value={kpis.openTrades} href="/admin/trades" accent="emerald" />
          </ul>
        </AdminPanel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminPanel
          title="Volume index (7d)"
          description="Synthetic activity — not a regulatory report"
          action={<LineChart className="h-4 w-4 text-slate-600" />}
        >
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={state.series}>
                <defs>
                  <linearGradient id="adminVolBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2dd4bf" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#0891b2" stopOpacity={0.45} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
                <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`${v.toFixed(2)}M`, "Volume"]} />
                <Bar dataKey="volume" fill="url(#adminVolBar)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminPanel>

        <AdminPanel title="Audit trail" description="Privileged actions on this workstation">
          <ul className="max-h-[220px] space-y-2 overflow-y-auto pr-1">
            {state.activity.map((a) => (
              <li
                key={a.id}
                className="flex gap-3 rounded-xl border border-white/[0.06] bg-slate-900/40 px-3 py-2.5 text-sm backdrop-blur-sm"
              >
                <span
                  className={cn(
                    "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                    a.severity === "success" && "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]",
                    a.severity === "warning" && "bg-amber-400",
                    a.severity === "danger" && "bg-rose-500",
                    a.severity === "info" && "bg-cyan-400"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-200">{a.action}</p>
                  <p className="text-xs text-slate-500">
                    {a.actor} · <span className="font-mono text-slate-400">{a.target}</span>
                  </p>
                  <p className="text-[10px] text-slate-600">{formatDistanceToNow(new Date(a.at), { addSuffix: true })}</p>
                </div>
              </li>
            ))}
          </ul>
        </AdminPanel>
      </div>

      <div className={cn(adminSurface, "overflow-hidden")}>
        <div className="flex flex-col gap-4 border-b border-white/[0.06] px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Latest registrations</h3>
            <p className="text-sm text-slate-500">Onboarded profiles — escalate to KYC as needed</p>
          </div>
          <Button asChild variant="ghost" className="gap-1 rounded-xl text-teal-400 hover:bg-teal-500/10 hover:text-teal-300">
            <Link href="/admin/users">
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="divide-y divide-white/[0.06]">
          {recentUsers.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
              <div>
                <p className="font-medium text-slate-100">{u.name}</p>
                <p className="text-xs text-slate-500">{u.email}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="border-0 bg-white/[0.06] text-slate-300">
                  {u.tier}
                </Badge>
                <Badge
                  className={cn(
                    "border-0",
                    u.kyc === "Verified" && "bg-emerald-500/15 text-emerald-300",
                    u.kyc === "Pending" && "bg-amber-500/15 text-amber-200",
                    u.kyc === "Rejected" && "bg-rose-500/15 text-rose-200",
                    u.kyc === "None" && "bg-white/[0.06] text-slate-400"
                  )}
                >
                  KYC {u.kyc}
                </Badge>
                <span className="text-xs text-slate-600">Joined {u.joined}</span>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="rounded-lg border-white/10 bg-transparent text-slate-200 hover:bg-white/5"
                >
                  <Link href={`/admin/users/${u.id}`}>Open</Link>
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
  accent,
}: {
  label: string
  value: number
  href: string
  accent: "amber" | "rose" | "cyan" | "emerald"
}) {
  const num =
    accent === "amber"
      ? "text-amber-300"
      : accent === "rose"
        ? "text-rose-300"
        : accent === "cyan"
          ? "text-cyan-300"
          : "text-emerald-300"
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-slate-900/30 px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <div className="flex items-center gap-3">
        <span className={cn("text-lg font-semibold tabular-nums", num)}>{value}</span>
        <Link href={href} className="text-xs font-semibold text-teal-400/95 hover:text-teal-300">
          Open
        </Link>
      </div>
    </li>
  )
}
