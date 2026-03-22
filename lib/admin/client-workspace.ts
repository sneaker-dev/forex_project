/**
 * Deterministic "virtual" client workspace rows for admin user detail tabs.
 * Merged with real CRM slices (ledger, trades, KYC queue) where applicable.
 */
import type { ActivityItem, AdminUser, Id, KycItem, LedgerEntry } from "./types"

function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0
  return Math.abs(h)
}

const BANKS = [
  "HDFC Bank",
  "Barclays",
  "HSBC",
  "DBS",
  "Citibank",
  "ING",
  "Revolut Business",
  "Wise",
] as const

export type ClientBankRow = {
  id: string
  label: string
  bankName: string
  country: string
  currency: string
  ibanMasked: string
  bic: string | null
  status: "Verified" | "Pending" | "Rejected"
  addedAt: string
}

export function getVirtualBankAccounts(user: AdminUser): ClientBankRow[] {
  const h = hashId(user.id)
  const primary: ClientBankRow = {
    id: `BA-${user.id}-1`,
    label: "Primary withdrawal",
    bankName: BANKS[h % BANKS.length],
    country: user.country,
    currency: h % 3 === 0 ? "EUR" : h % 3 === 1 ? "USD" : "GBP",
    ibanMasked: `•••• •••• •••• ${1000 + (h % 9000)}`,
    bic: h % 2 === 0 ? "HDFCINBBXXX" : "BARCGB22",
    status: user.kyc === "Verified" ? "Verified" : "Pending",
    addedAt: "2026-02-10T12:00:00Z",
  }
  const secondary: ClientBankRow | null =
    user.tier !== "Retail" || h % 4 === 0
      ? {
          id: `BA-${user.id}-2`,
          label: "Secondary (local)",
          bankName: BANKS[(h + 3) % BANKS.length],
          country: user.country,
          currency: "USD",
          ibanMasked: `•••• •••• •••• ${2000 + (h % 7000)}`,
          bic: "CHASUS33",
          status: "Verified",
          addedAt: "2026-01-22T09:30:00Z",
        }
      : null
  return secondary ? [primary, secondary] : [primary]
}

export type ClientDocRow = {
  id: string
  name: string
  category: "Identity" | "Proof of address" | "Bank" | "Other"
  status: "Uploaded" | "Under review" | "Approved" | "Expired"
  uploadedAt: string
}

export function getDocumentRows(user: AdminUser, kycItems: KycItem[]): ClientDocRow[] {
  const fromKyc = kycItems
    .filter((k) => k.userId === user.id)
    .map((k) => ({
      id: `DOC-KYC-${k.id}`,
      name: `${k.docType} — compliance case`,
      category: "Identity" as const,
      status:
        k.status === "Approved"
          ? ("Approved" as const)
          : k.status === "Rejected"
            ? ("Expired" as const)
            : ("Under review" as const),
      uploadedAt: k.submittedAt,
    }))

  const h = hashId(user.id)
  const extra: ClientDocRow[] = [
    {
      id: `DOC-${user.id}-addr`,
      name: "Utility bill (proof of address)",
      category: "Proof of address",
      status: user.kyc === "Verified" ? "Approved" : "Under review",
      uploadedAt: "2026-02-08T14:20:00Z",
    },
    {
      id: `DOC-${user.id}-bank`,
      name: "Bank statement — last 90 days",
      category: "Bank",
      status: h % 2 === 0 ? "Approved" : "Uploaded",
      uploadedAt: "2026-02-01T11:00:00Z",
    },
  ]

  return [...fromKyc, ...extra]
}

export type ClientMtRow = {
  id: string
  login: string
  server: string
  platform: "MT5" | "MT4" | "Web"
  leverage: string
  balance: number
  equity: number
  status: "Active" | "Read-only" | "Disabled"
}

export function getVirtualTradingAccounts(user: AdminUser): ClientMtRow[] {
  const h = hashId(user.id)
  const lev = user.tier === "VIP" ? "1:200" : user.tier === "Pro" ? "1:500" : "1:500"
  const base = Math.max(0, user.balance)
  return [
    {
      id: `MT-${user.id}-1`,
      login: `${8800000 + (h % 99999)}`,
      server: "ForexPro-Live1",
      platform: "MT5",
      leverage: lev,
      balance: base,
      equity: base + (h % 200) - 100,
      status: user.status === "Suspended" ? "Read-only" : user.status === "Closed" ? "Disabled" : "Active",
    },
    ...(user.tier !== "Retail"
      ? [
          {
            id: `MT-${user.id}-2`,
            login: `${8800000 + (h % 99999) + 17}`,
            server: "ForexPro-Live2",
            platform: "MT5" as const,
            leverage: "1:100",
            balance: base * 0.15,
            equity: base * 0.15 + 12,
            status: "Active" as const,
          },
        ]
      : []),
  ]
}

export type ClientWalletRow = {
  id: string
  asset: string
  network: string
  addressMasked: string
  label: string
  status: "Active" | "Pending verification"
}

export function getVirtualWallets(user: AdminUser): ClientWalletRow[] {
  const h = hashId(user.id)
  return [
    {
      id: `W-${user.id}-usdt`,
      asset: "USDT",
      network: "TRC20",
      addressMasked: `T${"•".repeat(28)}${(h % 9000).toString().padStart(4, "0")}`,
      label: "Default payout",
      status: user.kyc === "Verified" ? "Active" : "Pending verification",
    },
    ...(h % 2 === 0
      ? [
          {
            id: `W-${user.id}-btc`,
            asset: "BTC",
            network: "Bitcoin",
            addressMasked: `bc1q${"•".repeat(28)}`,
            label: "Cold storage (view)",
            status: "Active" as const,
          },
        ]
      : []),
  ]
}

export type TxRow = {
  id: string
  kind: "Ledger" | "Deposit" | "Withdrawal"
  type: string
  amount: number
  currency: string
  status: string
  reference: string
  at: string
}

export function getTransactionsUnified(
  userId: Id,
  ledger: LedgerEntry[],
  deposits: { id: string; userId: string; amount: number; method: string; status: string; requestedAt: string }[],
  withdrawals: { id: string; userId: string; amount: number; method: string; status: string; requestedAt: string }[]
): TxRow[] {
  const rows: TxRow[] = []
  const coveredByLedger = new Set<string>()
  for (const l of ledger) {
    if (l.userId !== userId) continue
    rows.push({
      id: l.id,
      kind: "Ledger",
      type: l.type,
      amount: l.amount,
      currency: l.currency,
      status: l.status,
      reference: l.reference,
      at: l.createdAt,
    })
    coveredByLedger.add(l.reference)
  }
  for (const d of deposits) {
    if (d.userId !== userId) continue
    if (coveredByLedger.has(d.id)) continue
    rows.push({
      id: d.id,
      kind: "Deposit",
      type: "Deposit",
      amount: d.amount,
      currency: "USD",
      status: d.status,
      reference: d.method,
      at: d.requestedAt,
    })
  }
  for (const w of withdrawals) {
    if (w.userId !== userId) continue
    if (coveredByLedger.has(w.id)) continue
    rows.push({
      id: w.id,
      kind: "Withdrawal",
      type: "Withdrawal",
      amount: -w.amount,
      currency: "USD",
      status: w.status,
      reference: w.method,
      at: w.requestedAt,
    })
  }
  return rows.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
}

export type ClientLogRow = {
  id: string
  at: string
  source: string
  message: string
  severity: ActivityItem["severity"]
}

export function getClientLogs(user: AdminUser, activity: ActivityItem[]): ClientLogRow[] {
  const h = hashId(user.id)
  const synthetic: ClientLogRow[] = [
    {
      id: `LOG-${user.id}-1`,
      at: "2026-03-17T08:12:00Z",
      source: "Auth",
      message: "Successful login — web dashboard (Chrome, Windows)",
      severity: "info",
    },
    {
      id: `LOG-${user.id}-2`,
      at: "2026-03-16T19:40:00Z",
      source: "Risk",
      message: "Pre-trade margin check passed (EURUSD cluster)",
      severity: "success",
    },
    {
      id: `LOG-${user.id}-3`,
      at: "2026-03-15T10:02:00Z",
      source: "Payments",
      message: "Deposit webhook received — awaiting treasury match",
      severity: "info",
    },
    ...(user.status === "Suspended"
      ? [
          {
            id: `LOG-${user.id}-sus`,
            at: "2026-03-14T16:00:00Z",
            source: "Compliance",
            message: "Account restricted — manual review (AML rule #442)",
            severity: "warning" as const,
          },
        ]
      : []),
  ]

  const fromGlobal = activity
    .filter((a) => a.target.includes(user.id) || a.action.toLowerCase().includes(user.name.toLowerCase()))
    .map((a) => ({
      id: `LOG-A-${a.id}`,
      at: a.at,
      source: "Desk",
      message: `${a.actor}: ${a.action} — ${a.target}`,
      severity: a.severity,
    }))

  return [...synthetic, ...fromGlobal].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 20 + (h % 5))
}

export type ClientSecurityInfo = {
  mfaEnabled: boolean
  emailVerified: boolean
  phoneVerified: boolean
  lastPasswordChange: string
  sessions: { id: string; device: string; ip: string; lastActive: string; current: boolean }[]
}

export function getVirtualSecurity(user: AdminUser): ClientSecurityInfo {
  const h = hashId(user.id)
  return {
    mfaEnabled: h % 3 !== 0,
    emailVerified: true,
    phoneVerified: user.kyc === "Verified",
    lastPasswordChange: "2026-02-28T11:00:00Z",
    sessions: [
      {
        id: `SES-${user.id}-1`,
        device: "Chrome 122 — Windows 11",
        ip: `103.${(h % 200) + 20}.${(h % 250)}.${(h % 200) + 10}`,
        lastActive: "2026-03-17T08:12:00Z",
        current: true,
      },
      {
        id: `SES-${user.id}-2`,
        device: "Safari — iOS 17",
        ip: `49.${(h % 200) + 10}.${(h % 250)}.12`,
        lastActive: "2026-03-15T21:30:00Z",
        current: false,
      },
    ],
  }
}

export type ClientAffiliateInfo = {
  referralCode: string
  parentIbName: string | null
  tierLabel: "Direct" | "Sub-IB"
  lifetimeCommissionUsd: number
  pendingCommissionUsd: number
  referredClients: number
}

export function getVirtualAffiliate(user: AdminUser): ClientAffiliateInfo {
  const h = hashId(user.id)
  const code = `${user.name.slice(0, 3).toUpperCase()}${(h % 9000) + 1000}`
  return {
    referralCode: code,
    parentIbName: h % 5 === 0 ? "IB Alpha Partners" : null,
    tierLabel: h % 5 === 0 ? "Sub-IB" : "Direct",
    lifetimeCommissionUsd: Math.round((h % 5000) + 120),
    pendingCommissionUsd: Math.round((h % 200) + 40),
    referredClients: (h % 12) + (user.tier === "VIP" ? 8 : 0),
  }
}
