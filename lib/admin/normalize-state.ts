import type {
  ActivityItem,
  AdminState,
  AdminUser,
  CompetitionAdmin,
  CopyMaster,
  DepositRequest,
  EmailTemplate,
  ForexChargeRow,
  IbNode,
  Lead,
  UserStatus,
  WithdrawalRequest,
} from "./types"
import { ADMIN_SEED } from "./seed"

const USER_STATUSES: UserStatus[] = ["Active", "Pending", "Suspended", "Closed"]
const KYC_LEVELS = ["None", "Pending", "Verified", "Rejected"] as const

function normalizeStatus(v: unknown): UserStatus {
  if (typeof v === "string" && USER_STATUSES.includes(v as UserStatus)) return v as UserStatus
  return "Pending"
}

function normalizeKyc(v: unknown): AdminUser["kyc"] {
  if (typeof v === "string" && (KYC_LEVELS as readonly string[]).includes(v)) return v as AdminUser["kyc"]
  return "Pending"
}

function normalizeUser(u: AdminUser): AdminUser {
  return {
    ...u,
    status: normalizeStatus(u.status),
    kyc: normalizeKyc(u.kyc),
  }
}

function inferRail(method: string): import("./types").TreasuryRail {
  const m = method.toLowerCase()
  if (m.includes("upi")) return "UPI"
  if (m.includes("oxapay") || m.includes("crypto") || m.includes("btc") || m.includes("usdt")) return "Crypto"
  return "Bank"
}

function mergeDeposit(d: DepositRequest): DepositRequest {
  return { ...d, rail: d.rail ?? inferRail(d.method) }
}

function mergeWithdrawal(w: WithdrawalRequest): WithdrawalRequest {
  return { ...w, rail: w.rail ?? inferRail(w.method) }
}

function mergeCopyMaster(m: CopyMaster): CopyMaster {
  const s = ADMIN_SEED.copyMasters.find((x) => x.id === m.id)
  if (!s) {
    const base = ADMIN_SEED.copyMasters[0]
    return {
      ...base,
      ...m,
      equityHistory: Array.isArray(m.equityHistory) && m.equityHistory.length > 0 ? m.equityHistory : base.equityHistory,
      performanceHistory:
        Array.isArray(m.performanceHistory) && m.performanceHistory.length > 0 ? m.performanceHistory : base.performanceHistory,
    }
  }
  return {
    ...s,
    ...m,
    equityHistory: Array.isArray(m.equityHistory) && m.equityHistory.length > 0 ? m.equityHistory : s.equityHistory,
    performanceHistory:
      Array.isArray(m.performanceHistory) && m.performanceHistory.length > 0 ? m.performanceHistory : s.performanceHistory,
  }
}

function mergeIb(n: IbNode): IbNode {
  const s = ADMIN_SEED.ibNodes.find((x) => x.id === n.id)
  if (!s) {
    return {
      ...n,
      mappedUserIds: Array.isArray(n.mappedUserIds) ? n.mappedUserIds : [],
    }
  }
  return {
    ...s,
    ...n,
    mappedUserIds: Array.isArray(n.mappedUserIds) ? n.mappedUserIds : s.mappedUserIds,
  }
}

function mergeForexRow(r: ForexChargeRow): ForexChargeRow {
  const legacy = r as ForexChargeRow & { accountType?: ForexChargeRow["accountType"] }
  const accountType = legacy.accountType ?? "Standard"
  const s = ADMIN_SEED.forexCharges.find((x) => x.symbol === r.symbol && x.accountType === accountType)
  if (s) return { ...s, ...r, accountType }
  const spreadLabel = r.spread ?? (r.spreadMinPips && r.spreadAvgPips ? `${r.spreadMinPips}–${r.spreadAvgPips}` : "—")
  return {
    symbol: r.symbol,
    accountType,
    spreadMinPips: r.spreadMinPips ?? spreadLabel,
    spreadAvgPips: r.spreadAvgPips ?? spreadLabel,
    spread: spreadLabel,
    commission: r.commission ?? "—",
    swapLong: r.swapLong ?? "—",
    swapShort: r.swapShort ?? "—",
    contractSize: r.contractSize ?? "100,000",
    leverageMax: r.leverageMax ?? "1:500",
    marginRequirementPct: r.marginRequirementPct ?? "0.2%",
    group: r.group ?? "Majors",
  }
}

function mergeCompetition(c: CompetitionAdmin): CompetitionAdmin {
  const s = ADMIN_SEED.competitions.find((x) => x.id === c.id) ?? ADMIN_SEED.competitions[0]
  const extra = Object.fromEntries(
    Object.entries(c as Record<string, unknown>).filter(([, v]) => v !== undefined)
  ) as Partial<CompetitionAdmin>
  return {
    ...s,
    ...extra,
    allowedAccountTypes:
      Array.isArray(extra.allowedAccountTypes) && extra.allowedAccountTypes.length > 0
        ? extra.allowedAccountTypes
        : s.allowedAccountTypes,
  }
}

function mergeEmail(e: EmailTemplate): EmailTemplate {
  const s = ADMIN_SEED.emailTemplates.find((x) => x.id === e.id) ?? ADMIN_SEED.emailTemplates[0]
  const extra = Object.fromEntries(
    Object.entries(e as Record<string, unknown>).filter(([, v]) => v !== undefined)
  ) as Partial<EmailTemplate>
  return { ...s, ...extra }
}

function mergeLead(l: Lead): Lead {
  const s = ADMIN_SEED.leads.find((x) => x.id === l.id)
  const merged = s ? { ...s, ...l } : l
  return {
    ...merged,
    createdAt: merged.createdAt ?? new Date().toISOString(),
  }
}

/** Heal persisted state where logActivity used Date.now() ids (collisions in same ms). */
function dedupeActivityById(items: ActivityItem[]): ActivityItem[] {
  const seen = new Set<string>()
  return items.filter((a) => {
    if (seen.has(a.id)) return false
    seen.add(a.id)
    return true
  })
}

/**
 * Merge persisted JSON with seed defaults and fix invalid enum values
 * (e.g. corrupted localStorage or manual edits).
 */
export function normalizeAdminState(parsed: Partial<AdminState>): AdminState {
  const merged: AdminState = {
    ...ADMIN_SEED,
    ...parsed,
    users: Array.isArray(parsed.users) ? parsed.users.map(normalizeUser) : ADMIN_SEED.users,
    trades: parsed.trades ?? ADMIN_SEED.trades,
    kycItems: parsed.kycItems ?? ADMIN_SEED.kycItems,
    tickets: parsed.tickets ?? ADMIN_SEED.tickets,
    ledger: parsed.ledger ?? ADMIN_SEED.ledger,
    withdrawals: Array.isArray(parsed.withdrawals)
      ? parsed.withdrawals.map((w) => mergeWithdrawal(w as WithdrawalRequest))
      : ADMIN_SEED.withdrawals,
    deposits: Array.isArray(parsed.deposits)
      ? parsed.deposits.map((d) => mergeDeposit(d as DepositRequest))
      : ADMIN_SEED.deposits,
    copyMasters: Array.isArray(parsed.copyMasters)
      ? parsed.copyMasters.map((m) => mergeCopyMaster(m as CopyMaster))
      : ADMIN_SEED.copyMasters,
    copyLinks: parsed.copyLinks ?? ADMIN_SEED.copyLinks,
    forexCharges: Array.isArray(parsed.forexCharges)
      ? parsed.forexCharges.map((r) => mergeForexRow(r as ForexChargeRow))
      : ADMIN_SEED.forexCharges,
    ibNodes: Array.isArray(parsed.ibNodes) ? parsed.ibNodes.map((n) => mergeIb(n as IbNode)) : ADMIN_SEED.ibNodes,
    bankRails: parsed.bankRails ?? ADMIN_SEED.bankRails,
    accountTypes: parsed.accountTypes ?? ADMIN_SEED.accountTypes,
    banners: parsed.banners ?? ADMIN_SEED.banners,
    competitions: Array.isArray(parsed.competitions)
      ? parsed.competitions.map((c) => mergeCompetition(c as CompetitionAdmin))
      : ADMIN_SEED.competitions,
    emailTemplates: Array.isArray(parsed.emailTemplates)
      ? parsed.emailTemplates.map((e) => mergeEmail(e as EmailTemplate))
      : ADMIN_SEED.emailTemplates,
    propChallenges: parsed.propChallenges ?? ADMIN_SEED.propChallenges,
    staff: parsed.staff ?? ADMIN_SEED.staff,
    theme: parsed.theme ?? ADMIN_SEED.theme,
    oxapay: parsed.oxapay ?? ADMIN_SEED.oxapay,
    activity: dedupeActivityById(
      Array.isArray(parsed.activity) ? (parsed.activity as ActivityItem[]) : ADMIN_SEED.activity
    ),
    series: parsed.series ?? ADMIN_SEED.series,
    copySystemPaused: typeof parsed.copySystemPaused === "boolean" ? parsed.copySystemPaused : ADMIN_SEED.copySystemPaused,
    leads: Array.isArray(parsed.leads) ? parsed.leads.map((l) => mergeLead(l as Lead)) : ADMIN_SEED.leads,
    abBookTransfers: parsed.abBookTransfers ?? ADMIN_SEED.abBookTransfers,
  }
  return merged
}
