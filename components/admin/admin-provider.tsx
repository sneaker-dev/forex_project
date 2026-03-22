"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { ADMIN_SEED } from "@/lib/admin/seed"
import { normalizeAdminState } from "@/lib/admin/normalize-state"
import type {
  AdminState,
  AdminTrade,
  AdminUser,
  CopyMaster,
  KycItem,
  LedgerEntry,
  SupportTicket,
  ThemeSettings,
  UserStatus,
  WithdrawalRequest,
  DepositRequest,
} from "@/lib/admin/types"

const STORAGE_KEY = "forexpro-admin-crm-v3"

/** Keep KYC queue rows aligned when profile KYC is updated from the registry or activation */
function syncKycItemsFromProfileKyc(
  items: KycItem[],
  userId: string,
  kyc: AdminUser["kyc"]
): KycItem[] {
  return items.map((k) => {
    if (k.userId !== userId) return k
    if (k.status === "Approved" || k.status === "Rejected") return k
    if (kyc === "Verified") return { ...k, status: "Approved" }
    if (kyc === "Rejected") return { ...k, status: "Rejected" }
    if (kyc === "Pending") {
      if (k.status === "Queued") return { ...k, status: "In Review" }
      return k
    }
    return k
  })
}

type AdminContextValue = {
  state: AdminState
  hydrated: boolean
  /** Full reset to factory dataset */
  resetToSeed: () => void
  setKycStatus: (id: string, status: KycItem["status"]) => void
  setTicketStatus: (id: string, status: SupportTicket["status"]) => void
  setTicketAssignee: (id: string, assignee: string) => void
  setWithdrawalStatus: (id: string, status: WithdrawalRequest["status"]) => void
  setDepositStatus: (id: string, status: DepositRequest["status"]) => void
  setUserStatus: (id: string, status: UserStatus) => void
  setUserKyc: (id: string, kyc: AdminUser["kyc"]) => void
  appendLedger: (entry: Omit<LedgerEntry, "id"> & { id?: string }) => void
  toggleCopyLink: (id: string, active: boolean) => void
  setMasterStatus: (id: string, status: AdminState["copyMasters"][0]["status"]) => void
  logActivity: (action: string, target: string, actor?: string, severity?: AdminState["activity"][0]["severity"]) => void
  addSupportTicket: (t: Omit<SupportTicket, "id" | "updatedAt">) => void
  addUser: (u: Omit<AdminUser, "id">) => void
  updateUser: (id: string, patch: Partial<AdminUser>) => void
  addTrade: (t: Omit<AdminTrade, "id">) => void
  updateTrade: (id: string, patch: Partial<AdminTrade>) => void
  removeTrade: (id: string) => void
  addCopyMaster: (m: Omit<CopyMaster, "id">) => void
  updateTheme: (patch: Partial<ThemeSettings>) => void
  testOxapayConnection: () => void
  bulkKycToReview: () => void
}

const AdminContext = createContext<AdminContextValue | null>(null)

function load(): AdminState {
  if (typeof window === "undefined") return ADMIN_SEED
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return ADMIN_SEED
    const parsed = JSON.parse(raw) as Partial<AdminState>
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.users)) return ADMIN_SEED
    return normalizeAdminState(parsed)
  } catch {
    return ADMIN_SEED
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminState>(ADMIN_SEED)
  const [hydrated, setHydrated] = useState(false)

  useLayoutEffect(() => {
    setState(load())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* ignore quota */
    }
  }, [state, hydrated])

  const resetToSeed = useCallback(() => {
    setState(ADMIN_SEED)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const logActivity = useCallback(
    (action: string, target: string, actor = "You", severity: AdminState["activity"][0]["severity"] = "info") => {
      const id = `a-${Date.now()}`
      const at = new Date().toISOString()
      setState((s) => ({
        ...s,
        activity: [{ id, at, actor, action, target, severity }, ...s.activity].slice(0, 40),
      }))
    },
    []
  )

  const setKycStatus = useCallback((id: string, status: KycItem["status"]) => {
    setState((s) => ({
      ...s,
      kycItems: s.kycItems.map((k) => (k.id === id ? { ...k, status } : k)),
    }))
    logActivity(`KYC marked ${status}`, id, "Compliance", status === "Approved" ? "success" : status === "Rejected" ? "danger" : "info")
  }, [logActivity])

  const setTicketStatus = useCallback((id: string, status: SupportTicket["status"]) => {
    setState((s) => ({
      ...s,
      tickets: s.tickets.map((t) => (t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t)),
    }))
    logActivity(`Ticket ${status}`, id, "Support", "info")
  }, [logActivity])

  const setTicketAssignee = useCallback((id: string, assignee: string) => {
    setState((s) => ({
      ...s,
      tickets: s.tickets.map((t) => (t.id === id ? { ...t, assignee, updatedAt: new Date().toISOString() } : t)),
    }))
  }, [])

  const setWithdrawalStatus = useCallback(
    (id: string, status: WithdrawalRequest["status"]) => {
      setState((s) => ({
        ...s,
        withdrawals: s.withdrawals.map((w) => (w.id === id ? { ...w, status } : w)),
      }))
      logActivity(`Withdrawal ${status}`, id, "Finance", status === "Rejected" ? "danger" : "success")
    },
    [logActivity]
  )

  const setDepositStatus = useCallback(
    (id: string, status: DepositRequest["status"]) => {
      setState((s) => ({
        ...s,
        deposits: s.deposits.map((d) => (d.id === id ? { ...d, status } : d)),
      }))
      logActivity(`Deposit ${status}`, id, "Finance", status === "Failed" ? "danger" : "success")
    },
    [logActivity]
  )

  const setUserStatus = useCallback(
    (id: string, status: UserStatus) => {
      let activatedKyc = false
      setState((s) => {
        const user = s.users.find((u) => u.id === id)
        if (!user) return s
        activatedKyc = status === "Active" && user.kyc === "Pending"
        const users = s.users.map((u) => {
          if (u.id !== id) return u
          if (activatedKyc) return { ...u, status, kyc: "Verified" as const }
          return { ...u, status }
        })
        const kycItems = activatedKyc ? syncKycItemsFromProfileKyc(s.kycItems, id, "Verified") : s.kycItems
        return { ...s, users, kycItems }
      })
      logActivity(`User ${status}`, id, "Admin", status === "Suspended" ? "warning" : "info")
      if (activatedKyc) {
        logActivity("KYC marked Verified (account activation)", id, "Compliance", "success")
      }
    },
    [logActivity]
  )

  const setUserKyc = useCallback(
    (id: string, kyc: AdminUser["kyc"]) => {
      setState((s) => ({
        ...s,
        users: s.users.map((u) => (u.id === id ? { ...u, kyc } : u)),
        kycItems: syncKycItemsFromProfileKyc(s.kycItems, id, kyc),
      }))
      logActivity(
        `Profile KYC set to ${kyc}`,
        id,
        "Compliance",
        kyc === "Verified" ? "success" : kyc === "Rejected" ? "danger" : "info"
      )
    },
    [logActivity]
  )

  const appendLedger = useCallback((entry: Omit<LedgerEntry, "id"> & { id?: string }) => {
    const id = entry.id ?? `L-${Date.now()}`
    setState((s) => ({
      ...s,
      ledger: [{ ...entry, id }, ...s.ledger].slice(0, 200),
    }))
  }, [])

  const toggleCopyLink = useCallback((id: string, active: boolean) => {
    setState((s) => ({
      ...s,
      copyLinks: s.copyLinks.map((l) => (l.id === id ? { ...l, active } : l)),
    }))
    logActivity(active ? "Copy link resumed" : "Copy link paused", id, "Risk", "info")
  }, [logActivity])

  const setMasterStatus = useCallback(
    (id: string, status: AdminState["copyMasters"][0]["status"]) => {
      setState((s) => ({
        ...s,
        copyMasters: s.copyMasters.map((m) => (m.id === id ? { ...m, status } : m)),
      }))
      logActivity(`Master ${status}`, id, "Copy Desk", "warning")
    },
    [logActivity]
  )

  const addSupportTicket = useCallback(
    (t: Omit<SupportTicket, "id" | "updatedAt">) => {
      const id = `ST-${Date.now().toString(36).toUpperCase()}`
      const updatedAt = new Date().toISOString()
      setState((s) => ({
        ...s,
        tickets: [{ ...t, id, updatedAt }, ...s.tickets],
      }))
      logActivity("Ticket created", id, "Support", "success")
    },
    [logActivity]
  )

  const addUser = useCallback(
    (u: Omit<AdminUser, "id">) => {
      const id = `u-${Date.now().toString(36)}`
      setState((s) => ({
        ...s,
        users: [{ ...u, id }, ...s.users],
      }))
      logActivity("Client registered", id, "Admin", "success")
    },
    [logActivity]
  )

  const updateUser = useCallback(
    (id: string, patch: Partial<AdminUser>) => {
      setState((s) => {
        const nextUsers = s.users.map((x) => (x.id === id ? { ...x, ...patch } : x))
        const kycItems =
          patch.kyc !== undefined ? syncKycItemsFromProfileKyc(s.kycItems, id, patch.kyc) : s.kycItems
        return { ...s, users: nextUsers, kycItems }
      })
      logActivity("Client profile updated", id, "Admin", "info")
    },
    [logActivity]
  )

  const addTrade = useCallback(
    (t: Omit<AdminTrade, "id">) => {
      const id = `T-${Date.now()}`
      setState((s) => ({
        ...s,
        trades: [{ ...t, id }, ...s.trades],
      }))
      logActivity("Trade booked", id, "Desk", "info")
    },
    [logActivity]
  )

  const updateTrade = useCallback(
    (id: string, patch: Partial<AdminTrade>) => {
      setState((s) => ({
        ...s,
        trades: s.trades.map((x) => (x.id === id ? { ...x, ...patch } : x)),
      }))
      logActivity("Trade updated", id, "Desk", "info")
    },
    [logActivity]
  )

  const removeTrade = useCallback(
    (id: string) => {
      setState((s) => ({
        ...s,
        trades: s.trades.filter((x) => x.id !== id),
      }))
      logActivity("Trade voided", id, "Desk", "warning")
    },
    [logActivity]
  )

  const addCopyMaster = useCallback(
    (m: Omit<CopyMaster, "id">) => {
      const id = `M-${Date.now().toString(36).toUpperCase()}`
      setState((s) => ({
        ...s,
        copyMasters: [{ ...m, id }, ...s.copyMasters],
      }))
      logActivity("Master onboarded", id, "Copy Desk", "success")
    },
    [logActivity]
  )

  const updateTheme = useCallback((patch: Partial<ThemeSettings>) => {
    setState((s) => ({
      ...s,
      theme: { ...s.theme, ...patch },
    }))
    logActivity("Theme draft published", "branding", "You", "success")
  }, [logActivity])

  const testOxapayConnection = useCallback(() => {
    const now = new Date().toISOString()
    setState((s) => ({
      ...s,
      oxapay: { ...s.oxapay, status: "Connected" as const, lastSettlement: now },
    }))
    logActivity("Oxapay gateway test OK", "oxapay", "System", "success")
  }, [logActivity])

  const bulkKycToReview = useCallback(() => {
    setState((s) => ({
      ...s,
      kycItems: s.kycItems.map((k) => (k.status === "Queued" ? { ...k, status: "In Review" as const } : k)),
    }))
    logActivity("Bulk KYC → In review", "queue", "Compliance", "info")
  }, [logActivity])

  const value = useMemo<AdminContextValue>(
    () => ({
      state,
      hydrated,
      resetToSeed,
      setKycStatus,
      setTicketStatus,
      setTicketAssignee,
      setWithdrawalStatus,
      setDepositStatus,
      setUserStatus,
      setUserKyc,
      appendLedger,
      toggleCopyLink,
      setMasterStatus,
      logActivity,
      addSupportTicket,
      addUser,
      updateUser,
      addTrade,
      updateTrade,
      removeTrade,
      addCopyMaster,
      updateTheme,
      testOxapayConnection,
      bulkKycToReview,
    }),
    [
      state,
      hydrated,
      resetToSeed,
      setKycStatus,
      setTicketStatus,
      setTicketAssignee,
      setWithdrawalStatus,
      setDepositStatus,
      setUserStatus,
      setUserKyc,
      appendLedger,
      toggleCopyLink,
      setMasterStatus,
      logActivity,
      addSupportTicket,
      addUser,
      updateUser,
      addTrade,
      updateTrade,
      removeTrade,
      addCopyMaster,
      updateTheme,
      testOxapayConnection,
      bulkKycToReview,
    ]
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider")
  return ctx
}
