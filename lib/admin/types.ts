export type Id = string

export type UserStatus = "Active" | "Suspended" | "Pending" | "Closed"

export type AdminUser = {
  id: Id
  name: string
  email: string
  country: string
  status: UserStatus
  joined: string
  lastActive: string
  kyc: "None" | "Pending" | "Verified" | "Rejected"
  balance: number
  tier: "Retail" | "Pro" | "VIP"
}

export type TradeStatus = "OPEN" | "CLOSED" | "PENDING"

export type AdminTrade = {
  id: string
  userId: Id
  userName: string
  symbol: string
  side: "BUY" | "SELL"
  lots: number
  openPrice: number
  pnl: number
  status: TradeStatus
  openedAt: string
}

export type KycItem = {
  id: Id
  userId: Id
  userName: string
  email: string
  country: string
  submittedAt: string
  docType: "Passport" | "National ID" | "Driver License"
  status: "Queued" | "In Review" | "Approved" | "Rejected"
  riskScore: "Low" | "Medium" | "High"
}

export type TicketPriority = "Low" | "Normal" | "High" | "Urgent"
export type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed"

export type SupportTicket = {
  id: string
  userId: Id
  userName: string
  subject: string
  category: "Payments" | "Trading" | "Account" | "Technical" | "Other"
  priority: TicketPriority
  status: TicketStatus
  updatedAt: string
  assignee: string
}

export type LedgerType = "Deposit" | "Withdrawal" | "Transfer" | "Adjustment"

export type LedgerEntry = {
  id: string
  userId: Id
  userName: string
  type: LedgerType
  amount: number
  currency: string
  status: "Completed" | "Pending" | "Failed" | "Review"
  reference: string
  createdAt: string
}

export type WithdrawalRequest = {
  id: string
  userId: Id
  userName: string
  amount: number
  method: string
  status: "Pending" | "Approved" | "Rejected" | "Paid"
  requestedAt: string
}

export type DepositRequest = {
  id: string
  userId: Id
  userName: string
  amount: number
  method: string
  status: "Pending" | "Credited" | "Failed"
  requestedAt: string
}

export type CopyMaster = {
  id: string
  name: string
  strategy: string
  followers: number
  feePct: number
  status: "Active" | "Paused" | "Suspended"
  aum: number
  winRate: number
}

export type CopyLink = {
  id: string
  masterId: string
  masterName: string
  followerEmail: string
  followerId: Id
  allocationUsd: number
  mode: "Conservative" | "Balanced" | "Aggressive"
  active: boolean
  openedAt: string
}

export type ForexChargeRow = {
  symbol: string
  spread: string
  commission: string
  swapLong: string
  swapShort: string
  group: "Majors" | "Metals" | "Indices" | "Crypto"
}

export type IbNode = {
  id: Id
  name: string
  email: string
  level: 1 | 2 | 3
  parentId: Id | null
  clients: number
  volumeUsd: number
  commissionUsd: number
  status: "Active" | "Suspended"
}

export type BankRail = {
  id: string
  name: string
  region: string
  currency: string
  settlement: string
  status: "Live" | "Maintenance" | "Offline"
}

export type AccountTypeDef = {
  id: string
  name: string
  leverage: string
  minDeposit: number
  spread: string
  commission: string
  active: boolean
}

export type Banner = {
  id: string
  title: string
  slot: "Home Hero" | "Dashboard" | "Funds"
  status: "Scheduled" | "Live" | "Ended"
  impressions: number
  ctr: string
  starts: string
  ends: string
}

export type CompetitionAdmin = {
  id: string
  name: string
  phase: "Draft" | "Active" | "Completed"
  prizePool: string
  entrants: number
  endsAt: string
}

export type EmailTemplate = {
  id: string
  name: string
  trigger: string
  channel: "Transactional" | "Marketing"
  lastSent: string
  openRate: string
}

export type PropChallenge = {
  id: string
  name: string
  phases: number
  profitTarget: string
  maxDrawdown: string
  fee: string
  activeAccounts: number
  status: "Live" | "Paused"
}

export type StaffMember = {
  id: Id
  name: string
  email: string
  role: "Superadmin" | "Support" | "Finance" | "Compliance"
  lastLogin: string
  mfa: boolean
  status: "Active" | "Locked"
}

export type ThemeSettings = {
  brandName: string
  primaryHex: string
  accentHex: string
  logoUrl: string
  clientPortalDensity: "Comfortable" | "Compact"
}

export type OxapaySettings = {
  merchantId: string
  webhookSecret: string
  environment: "Sandbox" | "Production"
  lastSettlement: string
  status: "Connected" | "Degraded" | "Disconnected"
}

export type ActivityItem = {
  id: string
  at: string
  actor: string
  action: string
  target: string
  severity: "info" | "success" | "warning" | "danger"
}

export type SeriesPoint = { label: string; deposits: number; withdrawals: number; volume: number }

export type AdminState = {
  users: AdminUser[]
  trades: AdminTrade[]
  kycItems: KycItem[]
  tickets: SupportTicket[]
  ledger: LedgerEntry[]
  withdrawals: WithdrawalRequest[]
  deposits: DepositRequest[]
  copyMasters: CopyMaster[]
  copyLinks: CopyLink[]
  forexCharges: ForexChargeRow[]
  ibNodes: IbNode[]
  bankRails: BankRail[]
  accountTypes: AccountTypeDef[]
  banners: Banner[]
  competitions: CompetitionAdmin[]
  emailTemplates: EmailTemplate[]
  propChallenges: PropChallenge[]
  staff: StaffMember[]
  theme: ThemeSettings
  oxapay: OxapaySettings
  activity: ActivityItem[]
  series: SeriesPoint[]
}
