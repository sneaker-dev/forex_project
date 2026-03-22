import type { AdminState, AdminUser, UserStatus } from "./types"
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
    withdrawals: parsed.withdrawals ?? ADMIN_SEED.withdrawals,
    deposits: parsed.deposits ?? ADMIN_SEED.deposits,
    copyMasters: parsed.copyMasters ?? ADMIN_SEED.copyMasters,
    copyLinks: parsed.copyLinks ?? ADMIN_SEED.copyLinks,
    forexCharges: parsed.forexCharges ?? ADMIN_SEED.forexCharges,
    ibNodes: parsed.ibNodes ?? ADMIN_SEED.ibNodes,
    bankRails: parsed.bankRails ?? ADMIN_SEED.bankRails,
    accountTypes: parsed.accountTypes ?? ADMIN_SEED.accountTypes,
    banners: parsed.banners ?? ADMIN_SEED.banners,
    competitions: parsed.competitions ?? ADMIN_SEED.competitions,
    emailTemplates: parsed.emailTemplates ?? ADMIN_SEED.emailTemplates,
    propChallenges: parsed.propChallenges ?? ADMIN_SEED.propChallenges,
    staff: parsed.staff ?? ADMIN_SEED.staff,
    theme: parsed.theme ?? ADMIN_SEED.theme,
    oxapay: parsed.oxapay ?? ADMIN_SEED.oxapay,
    activity: parsed.activity ?? ADMIN_SEED.activity,
    series: parsed.series ?? ADMIN_SEED.series,
  }
  return merged
}
