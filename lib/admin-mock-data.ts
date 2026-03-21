export const adminOverviewKpis = [
  { label: "Total Users", value: "135", delta: "+12%", positive: true },
  { label: "Active Today", value: "94", delta: "+5%", positive: true },
  { label: "Total Deposits", value: "$125,000", delta: "+18%", positive: true },
  { label: "Total Withdrawals", value: "$45,000", delta: "-3%", positive: false },
]

export const adminRecentUsers = [
  { name: "mdhani", email: "mdhani212@proton.me", date: "Mar 12, 2026" },
  { name: "coder", email: "coder@example.com", date: "Mar 10, 2026" },
  { name: "Demo", email: "demo@example.com", date: "Mar 8, 2026" },
  { name: "Tejas", email: "tejas@example.com", date: "Mar 4, 2026" },
  { name: "Swapnil", email: "swapnil@example.com", date: "Feb 24, 2026" },
]

export const adminPlatformOverview = [
  { label: "New Users This Week", value: "40" },
  { label: "Pending KYC", value: "27" },
  { label: "Active Trades", value: "156" },
  { label: "Pending Withdrawals", value: "12" },
]

export const adminTradeMetrics: { label: string; value: string; highlight?: boolean }[] = [
  { label: "Total Trades", value: "2,321" },
  { label: "Open Positions", value: "0" },
  { label: "Total Volume", value: "$0.09M" },
  { label: "Platform P&L", value: "+$42.41", highlight: true },
]

export type AdminTradeRow = {
  id: string
  userName: string
  userId: string
  symbol: string
  side: "BUY" | "SELL"
  lots: string
  openPrice: string
  pnl: string
  pnlPositive: boolean
  status: string
}

export const adminTrades: AdminTradeRow[] = [
  {
    id: "T2373926440",
    userName: "Diptesh",
    userId: "usr_8f3a9c2e1d0047b1",
    symbol: "XAUUSD.i",
    side: "SELL",
    lots: "0.01",
    openPrice: "2,650.42",
    pnl: "-12.40",
    pnlPositive: false,
    status: "CLOSED",
  },
  {
    id: "T2373926011",
    userName: "mdhani",
    userId: "usr_a1029384756abcdef",
    symbol: "EURUSD",
    side: "BUY",
    lots: "0.10",
    openPrice: "1.0854",
    pnl: "+54.20",
    pnlPositive: true,
    status: "CLOSED",
  },
  {
    id: "T2373925882",
    userName: "Tejas",
    userId: "usr_beadfeed0001",
    symbol: "GBPUSD",
    side: "BUY",
    lots: "0.05",
    openPrice: "1.2622",
    pnl: "+8.11",
    pnlPositive: true,
    status: "CLOSED",
  },
]

export type AdminUserRow = {
  id: string
  name: string
  email: string
  country: string
  status: "Active" | "Suspended" | "Pending"
  joined: string
}

export const adminUsers: AdminUserRow[] = [
  { id: "u1", name: "mdhani", email: "mdhani212@proton.me", country: "India", status: "Active", joined: "Mar 12, 2026" },
  { id: "u2", name: "Diptesh", email: "diptesh@example.com", country: "UAE", status: "Active", joined: "Mar 10, 2026" },
  { id: "u3", name: "Demo Trader", email: "demo@example.com", country: "UK", status: "Pending", joined: "Mar 8, 2026" },
  { id: "u4", name: "Tejas", email: "tejas@example.com", country: "India", status: "Active", joined: "Mar 4, 2026" },
  { id: "u5", name: "Swapnil", email: "swapnil@example.com", country: "India", status: "Suspended", joined: "Feb 24, 2026" },
]
