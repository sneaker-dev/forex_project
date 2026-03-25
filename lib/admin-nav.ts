import type { LucideIcon } from "lucide-react"
import {
  LayoutDashboard,
  Users,
  LineChart,
  Wallet,
  Landmark,
  Network,
  Percent,
  PieChart,
  Copy,
  Trophy,
  Boxes,
  Palette,
  ImageIcon,
  Medal,
  Mail,
  Bitcoin,
  Shield,
  BadgeCheck,
  Headphones,
  LogOut,
  UserPlus,
  ArrowLeftRight,
} from "lucide-react"

export type AdminNavItem = {
  name: string
  href: string
  icon: LucideIcon
}

/** Grouped navigation — same routes, clearer hierarchy */
export type AdminNavSection = {
  id: string
  label: string
  items: AdminNavItem[]
}

export const adminNavSections: AdminNavSection[] = [
  {
    id: "intel",
    label: "Intelligence",
    items: [{ name: "Overview", href: "/admin", icon: LayoutDashboard }],
  },
  {
    id: "ops",
    label: "Operations",
    items: [
      { name: "Clients", href: "/admin/users", icon: Users },
      { name: "Trades", href: "/admin/trades", icon: LineChart },
      { name: "Treasury", href: "/admin/funds", icon: Wallet },
      { name: "Bank rails", href: "/admin/bank-settings", icon: Landmark },
      { name: "Leads", href: "/admin/leads", icon: UserPlus },
      { name: "A/B book", href: "/admin/book-transfer", icon: ArrowLeftRight },
    ],
  },
  {
    id: "growth",
    label: "Partners & product",
    items: [
      { name: "IB network", href: "/admin/ib", icon: Network },
      { name: "Forex charges", href: "/admin/forex-charges", icon: Percent },
      { name: "Earnings", href: "/admin/earnings", icon: PieChart },
      { name: "Copy trading", href: "/admin/copy-trading", icon: Copy },
      { name: "Prop challenges", href: "/admin/prop-firm", icon: Trophy },
      { name: "Account types", href: "/admin/account-types", icon: Boxes },
    ],
  },
  {
    id: "experience",
    label: "Experience",
    items: [
      { name: "Branding", href: "/admin/theme", icon: Palette },
      { name: "Banners", href: "/admin/banners", icon: ImageIcon },
      { name: "Competitions", href: "/admin/competitions", icon: Medal },
      { name: "Email", href: "/admin/email", icon: Mail },
      { name: "Oxapay", href: "/admin/oxapay", icon: Bitcoin },
    ],
  },
  {
    id: "gov",
    label: "Governance",
    items: [
      { name: "Staff access", href: "/admin/admins", icon: Shield },
      { name: "KYC", href: "/admin/kyc", icon: BadgeCheck },
      { name: "Support", href: "/admin/support", icon: Headphones },
    ],
  },
]

export const adminNavigation: AdminNavItem[] = adminNavSections.flatMap((s) => s.items)

export const adminLogoutItem = { name: "Sign out", href: "/login", icon: LogOut }

export function adminTitleFromPath(pathname: string): { title: string; subtitle: string } {
  const map: Record<string, { title: string; subtitle: string }> = {
    "/admin": { title: "Overview", subtitle: "Operational pulse — liquidity, exposure, and risk in one glance." },
    "/admin/users": { title: "Clients", subtitle: "Lifecycle, tiers, and KYC — each field persists to the workspace." },
    "/admin/trades": { title: "Trades", subtitle: "Execution surveillance and symbol-level forensics." },
    "/admin/funds": { title: "Treasury", subtitle: "Deposits, withdrawals, and ledger with full traceability." },
    "/admin/bank-settings": { title: "Bank rails", subtitle: "Settlement paths, correspondent banks, and cut-offs." },
    "/admin/ib": { title: "IB network", subtitle: "Hierarchy, volume curves, and commission economics." },
    "/admin/forex-charges": { title: "Forex charges", subtitle: "Symbol economics, spreads, and swap curves." },
    "/admin/earnings": { title: "Earnings", subtitle: "Revenue attribution, partner share, and accruals." },
    "/admin/copy-trading": { title: "Copy trading", subtitle: "Masters, followers, allocation, and fee policy." },
    "/admin/prop-firm": { title: "Prop challenges", subtitle: "Rules, evaluation phases, and funded milestones." },
    "/admin/account-types": { title: "Account types", subtitle: "Product packaging, leverage, and entitlements." },
    "/admin/theme": { title: "Branding", subtitle: "Portal tokens, typography, and visual density." },
    "/admin/banners": { title: "Banners", subtitle: "Campaign slots, scheduling, and audience targeting." },
    "/admin/competitions": { title: "Competitions", subtitle: "Seasons, prizes, eligibility, and leaderboards." },
    "/admin/email": { title: "Email", subtitle: "Transactional sends and lifecycle nurture templates." },
    "/admin/oxapay": { title: "Oxapay", subtitle: "Crypto gateway posture, health, and credential scope." },
    "/admin/admins": { title: "Staff access", subtitle: "Roles, MFA, session policy, and privileged actions." },
    "/admin/kyc": { title: "KYC", subtitle: "Document queue, risk decisions, and audit trail." },
    "/admin/support": { title: "Support", subtitle: "Tickets, SLAs, ownership, and resolution quality." },
    "/admin/leads": { title: "Leads", subtitle: "Pipeline, assignment, conversion, and follow-ups." },
    "/admin/book-transfer": { title: "A/B book", subtitle: "Internalize vs hedge transfers with audit trail." },
  }
  if (map[pathname]) return map[pathname]
  if (pathname.startsWith("/admin/users/")) {
    return { title: "Client workspace", subtitle: "Profile, accounts, treasury, and activity — unified." }
  }
  return { title: "Admin", subtitle: "Control center for the ForexPro desk." }
}
