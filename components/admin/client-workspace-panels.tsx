"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import type { AdminState, AdminUser, SupportTicket } from "@/lib/admin/types"
import {
  getVirtualAffiliate,
  getVirtualBankAccounts,
  getVirtualSecurity,
  getVirtualTradingAccounts,
  getVirtualWallets,
  getClientLogs,
  getDocumentRows,
  getTransactionsUnified,
} from "@/lib/admin/client-workspace"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { adminSurface, adminTableWrap } from "@/components/admin/admin-ui"
import { ExternalLink } from "lucide-react"

function AdminDataTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <div className={adminTableWrap}>{children}</div>
    </div>
  )
}

function badgeVariant(s: string) {
  if (
    s === "Verified" ||
    s === "Approved" ||
    s === "Active" ||
    s === "Completed" ||
    s === "Credited" ||
    s === "Paid" ||
    s === "Resolved" ||
    s === "Closed"
  )
    return "bg-emerald-500/20 text-emerald-200 border-0"
  if (
    s === "Pending" ||
    s === "Under review" ||
    s === "In Review" ||
    s === "Read-only" ||
    s === "Open" ||
    s === "In Progress"
  )
    return "bg-amber-500/20 text-amber-100 border-0"
  if (s === "Rejected" || s === "Failed" || s === "Disabled" || s === "Suspended")
    return "bg-red-500/20 text-red-200 border-0"
  return "bg-white/10 text-white/80 border-0"
}

export function SupportTicketsMini({ user, tickets }: { user: AdminUser; tickets: SupportTicket[] }) {
  const rows = tickets.filter((t) => t.userId === user.id)
  if (rows.length === 0) return null
  return (
    <Card className={cn(adminSurface, "border-0 text-slate-100 shadow-none")}>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold tracking-tight text-slate-50">Open support tickets</CardTitle>
          <CardDescription className="mt-1 text-sm leading-relaxed text-slate-500">
            Live queue items where this client is the requester — same records as Support desk.
          </CardDescription>
        </div>
        <Link
          href="/admin/support"
          className="inline-flex items-center gap-1 text-xs font-medium text-teal-400 hover:text-teal-300"
        >
          Support desk <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <AdminDataTable>
          <Table>
            <TableHeader>
              <TableRow className="border-transparent hover:bg-transparent">
                <TableHead className="text-slate-500">ID</TableHead>
                <TableHead className="text-slate-500">Subject</TableHead>
                <TableHead className="text-slate-500">Priority</TableHead>
                <TableHead className="text-slate-500">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((t) => (
                <TableRow key={t.id} className="border-white/[0.05]">
                  <TableCell className="font-mono text-xs text-white/90">{t.id}</TableCell>
                  <TableCell className="max-w-[280px] text-white/85">{t.subject}</TableCell>
                  <TableCell className="text-white/70">{t.priority}</TableCell>
                  <TableCell>
                    <Badge className={badgeVariant(t.status)}>{t.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminDataTable>
      </CardContent>
    </Card>
  )
}

export function BankAccountsPanel({ user }: { user: AdminUser }) {
  const rows = getVirtualBankAccounts(user)
  return (
    <Card className={cn(adminSurface, "border-0 text-slate-100 shadow-none")}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold tracking-tight text-slate-50">Bank accounts</CardTitle>
        <CardDescription className="mt-1 text-sm leading-relaxed text-slate-500">
          Withdrawal rails on file — masked identifiers. Status mirrors KYC and compliance clearance.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <AdminDataTable>
          <Table>
            <TableHeader>
              <TableRow className="border-transparent hover:bg-transparent">
                <TableHead className="text-slate-500">Label</TableHead>
                <TableHead className="text-slate-500">Bank</TableHead>
                <TableHead className="text-slate-500">Country</TableHead>
                <TableHead className="text-slate-500">Currency</TableHead>
                <TableHead className="text-slate-500">IBAN / account</TableHead>
                <TableHead className="text-slate-500">BIC</TableHead>
                <TableHead className="text-slate-500">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} className="border-white/[0.06]">
                  <TableCell className="font-medium text-white">{r.label}</TableCell>
                  <TableCell className="text-white/85">{r.bankName}</TableCell>
                  <TableCell className="text-white/70">{r.country}</TableCell>
                  <TableCell className="font-mono text-xs text-teal-300/90">{r.currency}</TableCell>
                  <TableCell className="font-mono text-xs text-white/90">{r.ibanMasked}</TableCell>
                  <TableCell className="font-mono text-xs text-white/60">{r.bic ?? "—"}</TableCell>
                  <TableCell>
                    <Badge className={badgeVariant(r.status)}>{r.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminDataTable>
      </CardContent>
    </Card>
  )
}

export function DocumentsPanel({ user, state }: { user: AdminUser; state: AdminState }) {
  const rows = getDocumentRows(user, state.kycItems)
  return (
    <Card className={cn(adminSurface, "border-0 text-slate-100 shadow-none")}>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold tracking-tight text-slate-50">Documents</CardTitle>
          <CardDescription className="mt-1 text-sm leading-relaxed text-slate-500">
            KYC queue and uploaded compliance artifacts — identical lineage to the KYC workspace.
          </CardDescription>
        </div>
        <Link
          href="/admin/kyc"
          className="inline-flex items-center gap-1 text-xs font-medium text-teal-400 hover:text-teal-300"
        >
          Open KYC workspace <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <AdminDataTable>
          <Table>
            <TableHeader>
              <TableRow className="border-transparent hover:bg-transparent">
                <TableHead className="text-slate-500">Document</TableHead>
                <TableHead className="text-slate-500">Category</TableHead>
                <TableHead className="text-slate-500">Status</TableHead>
                <TableHead className="text-slate-500">Uploaded</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} className="border-white/[0.06]">
                  <TableCell className="max-w-[280px] text-white/90">{r.name}</TableCell>
                  <TableCell className="text-white/70">{r.category}</TableCell>
                  <TableCell>
                    <Badge className={badgeVariant(r.status)}>{r.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-white/45">{new Date(r.uploadedAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminDataTable>
      </CardContent>
    </Card>
  )
}

export function TradingAccountsPanel({ user, state }: { user: AdminUser; state: AdminState }) {
  const rows = getVirtualTradingAccounts(user)
  const trades = state.trades.filter((t) => t.userId === user.id)
  return (
    <Card className={cn(adminSurface, "border-0 text-slate-100 shadow-none")}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold tracking-tight text-slate-50">Trading accounts</CardTitle>
        <CardDescription className="mt-1 text-sm leading-relaxed text-slate-500">
          Platform logins, margin posture, and the latest executions pulled from the desk feed for this profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 p-6 pt-0">
        <AdminDataTable>
          <Table>
            <TableHeader>
              <TableRow className="border-transparent hover:bg-transparent">
                <TableHead className="text-slate-500">Login</TableHead>
                <TableHead className="text-slate-500">Server</TableHead>
                <TableHead className="text-slate-500">Platform</TableHead>
                <TableHead className="text-slate-500">Leverage</TableHead>
                <TableHead className="text-right text-slate-500">Balance</TableHead>
                <TableHead className="text-right text-slate-500">Equity</TableHead>
                <TableHead className="text-slate-500">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} className="border-white/[0.06]">
                  <TableCell className="font-mono text-xs text-white">{r.login}</TableCell>
                  <TableCell className="text-white/80">{r.server}</TableCell>
                  <TableCell className="text-white/60">{r.platform}</TableCell>
                  <TableCell className="text-teal-300/90">{r.leverage}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-white">
                    ${r.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-white/90">
                    ${r.equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <Badge className={badgeVariant(r.status)}>{r.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminDataTable>

        {trades.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-semibold tracking-tight text-slate-200">Recent executions (desk)</h4>
            <AdminDataTable>
              <Table>
                <TableHeader>
                  <TableRow className="border-transparent hover:bg-transparent">
                    <TableHead className="text-slate-500">Trade ID</TableHead>
                    <TableHead className="text-slate-500">Symbol</TableHead>
                    <TableHead className="text-slate-500">Side</TableHead>
                    <TableHead className="text-right text-slate-500">Lots</TableHead>
                    <TableHead className="text-slate-500">Status</TableHead>
                    <TableHead className="text-right text-slate-500">P&amp;L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trades.map((t) => (
                    <TableRow key={t.id} className="border-white/[0.06]">
                      <TableCell className="font-mono text-xs text-white/90">{t.id}</TableCell>
                      <TableCell className="font-medium text-white">{t.symbol}</TableCell>
                      <TableCell className={cn(t.side === "BUY" ? "text-emerald-400" : "text-red-400")}>{t.side}</TableCell>
                      <TableCell className="text-right tabular-nums text-white/80">{t.lots.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={badgeVariant(t.status)}>{t.status}</Badge>
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-mono tabular-nums",
                          t.pnl >= 0 ? "text-emerald-400" : "text-red-400"
                        )}
                      >
                        {t.pnl >= 0 ? "+" : ""}
                        {t.pnl.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AdminDataTable>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function WalletsPanel({ user }: { user: AdminUser }) {
  const rows = getVirtualWallets(user)
  return (
    <Card className={cn(adminSurface, "border-0 text-slate-100 shadow-none")}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold tracking-tight text-slate-50">Crypto wallets</CardTitle>
        <CardDescription className="mt-1 text-sm leading-relaxed text-slate-500">
          Whitelisted on-chain payout destinations — addresses are masked for operator safety.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <AdminDataTable>
          <Table>
            <TableHeader>
              <TableRow className="border-transparent hover:bg-transparent">
                <TableHead className="text-slate-500">Label</TableHead>
                <TableHead className="text-slate-500">Asset</TableHead>
                <TableHead className="text-slate-500">Network</TableHead>
                <TableHead className="text-slate-500">Address</TableHead>
                <TableHead className="text-slate-500">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} className="border-white/[0.06]">
                  <TableCell className="text-white/90">{r.label}</TableCell>
                  <TableCell className="font-medium text-white">{r.asset}</TableCell>
                  <TableCell className="text-white/70">{r.network}</TableCell>
                  <TableCell className="max-w-[220px] truncate font-mono text-xs text-white/80">{r.addressMasked}</TableCell>
                  <TableCell>
                    <Badge className={badgeVariant(r.status)}>{r.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminDataTable>
      </CardContent>
    </Card>
  )
}

export function TransactionsPanel({ user, state }: { user: AdminUser; state: AdminState }) {
  const rows = getTransactionsUnified(user.id, state.ledger, state.deposits, state.withdrawals)
  return (
    <Card className={cn(adminSurface, "border-0 text-slate-100 shadow-none")}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold tracking-tight text-slate-50">Transactions</CardTitle>
        <CardDescription className="mt-1 text-sm leading-relaxed text-slate-500">
          Unified treasury view — ledger, deposits, and withdrawals; newest events first.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        {rows.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/[0.08] bg-black/20 px-4 py-8 text-center text-sm text-slate-500">
            No treasury movements recorded for this client yet.
          </p>
        ) : (
          <AdminDataTable>
            <Table>
              <TableHeader>
                <TableRow className="border-transparent hover:bg-transparent">
                  <TableHead className="text-slate-500">Source</TableHead>
                  <TableHead className="text-slate-500">Type</TableHead>
                  <TableHead className="text-right text-slate-500">Amount</TableHead>
                  <TableHead className="text-slate-500">Status</TableHead>
                  <TableHead className="text-slate-500">Reference</TableHead>
                  <TableHead className="text-slate-500">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={`${r.kind}-${r.id}`} className="border-white/[0.06]">
                    <TableCell className="text-xs text-white/55">{r.kind}</TableCell>
                    <TableCell className="text-white/85">{r.type}</TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-mono tabular-nums",
                        r.amount >= 0 ? "text-emerald-400" : "text-red-400"
                      )}
                    >
                      {r.amount >= 0 ? "+" : ""}
                      {r.amount.toFixed(2)} {r.currency}
                    </TableCell>
                    <TableCell>
                      <Badge className={badgeVariant(r.status)}>{r.status}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate font-mono text-xs text-white/80">{r.reference}</TableCell>
                    <TableCell className="text-xs text-white/45">{new Date(r.at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AdminDataTable>
        )}
      </CardContent>
    </Card>
  )
}

export function LogsPanel({ user, state }: { user: AdminUser; state: AdminState }) {
  const rows = getClientLogs(user, state.activity)
  return (
    <Card className={cn(adminSurface, "border-0 text-slate-100 shadow-none")}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold tracking-tight text-slate-50">Activity log</CardTitle>
        <CardDescription className="mt-1 text-sm leading-relaxed text-slate-500">
          Authentication, risk, and payments — merged with desk-wide events when they reference this client.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <AdminDataTable>
          <Table>
            <TableHeader>
              <TableRow className="border-transparent hover:bg-transparent">
                <TableHead className="text-slate-500">Time</TableHead>
                <TableHead className="text-slate-500">Source</TableHead>
                <TableHead className="text-slate-500">Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} className="border-white/[0.06]">
                  <TableCell className="whitespace-nowrap text-xs text-white/45">{new Date(r.at).toLocaleString()}</TableCell>
                  <TableCell className="text-xs font-medium text-teal-400/90">{r.source}</TableCell>
                  <TableCell className="text-sm text-slate-300">{r.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminDataTable>
      </CardContent>
    </Card>
  )
}

export function SecurityPanel({ user }: { user: AdminUser }) {
  const s = getVirtualSecurity(user)
  return (
    <Card className={cn(adminSurface, "border-0 text-slate-100 shadow-none")}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold tracking-tight text-slate-50">Security</CardTitle>
        <CardDescription className="mt-1 text-sm leading-relaxed text-slate-500">
          MFA posture, verification state, password cadence, and live session inventory.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6 pt-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="admin-metric-tile p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">MFA</p>
            <p className="mt-1 text-lg font-semibold text-white">{s.mfaEnabled ? "Enabled" : "Disabled"}</p>
          </div>
          <div className="admin-metric-tile p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Email</p>
            <p className="mt-1 text-lg font-semibold text-emerald-400/90">{s.emailVerified ? "Verified" : "Unverified"}</p>
          </div>
          <div className="admin-metric-tile p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Phone</p>
            <p className="mt-1 text-lg font-semibold text-white">{s.phoneVerified ? "Verified" : "Not set"}</p>
          </div>
          <div className="admin-metric-tile p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Password last</p>
            <p className="mt-1 text-sm font-medium text-white/90">{new Date(s.lastPasswordChange).toLocaleString()}</p>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold tracking-tight text-slate-200">Sessions</h4>
          <AdminDataTable>
            <Table>
            <TableHeader>
              <TableRow className="border-transparent hover:bg-transparent">
                <TableHead className="text-slate-500">Device</TableHead>
                <TableHead className="text-slate-500">IP</TableHead>
                <TableHead className="text-slate-500">Last active</TableHead>
                <TableHead className="text-slate-500">Current</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {s.sessions.map((sess) => (
                <TableRow key={sess.id} className="border-white/[0.06]">
                  <TableCell className="text-white/85">{sess.device}</TableCell>
                  <TableCell className="font-mono text-xs text-white/70">{sess.ip}</TableCell>
                  <TableCell className="text-xs text-white/45">{new Date(sess.lastActive).toLocaleString()}</TableCell>
                  <TableCell>{sess.current ? <Badge className="border-0 bg-emerald-500/20 text-emerald-200">Yes</Badge> : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </AdminDataTable>
        </div>
      </CardContent>
    </Card>
  )
}

export function AffiliatePanel({ user }: { user: AdminUser }) {
  const a = getVirtualAffiliate(user)
  return (
    <Card className={cn(adminSurface, "border-0 text-slate-100 shadow-none")}>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4 pb-2">
        <div>
          <CardTitle className="text-lg font-semibold tracking-tight text-slate-50">Affiliate</CardTitle>
          <CardDescription className="mt-1 text-sm leading-relaxed text-slate-500">
            Referral economics, tiering, and IB linkage — virtual snapshot aligned with the IB network.
          </CardDescription>
        </div>
        <Link href="/admin/ib" className="inline-flex items-center gap-1 text-xs font-medium text-teal-400 hover:text-teal-300">
          IB network <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-6 p-6 pt-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="admin-metric-tile p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Referral code</p>
            <p className="mt-1 font-mono text-lg font-semibold text-teal-300/90">{a.referralCode}</p>
          </div>
          <div className="admin-metric-tile p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Tier</p>
            <p className="mt-1 text-lg font-semibold text-white">{a.tierLabel}</p>
          </div>
          <div className="admin-metric-tile p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Lifetime commission</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-emerald-400">
              ${a.lifetimeCommissionUsd.toLocaleString()}
            </p>
          </div>
          <div className="admin-metric-tile p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Pending</p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-amber-300/90">
              ${a.pendingCommissionUsd.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="admin-metric-tile space-y-2 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Parent IB</p>
          <p className="text-white/90">{a.parentIbName ?? "— (direct client)"}</p>
          <p className="text-sm text-slate-500">Referred clients (rolling): {a.referredClients}</p>
        </div>
      </CardContent>
    </Card>
  )
}
