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
    "/admin": { title: "Overview", subtitle: "Operational pulse, liquidity, and risk signals." },
    "/admin/users": { title: "Clients", subtitle: "Registry, tiers, and lifecycle controls." },
    "/admin/trades": { title: "Trades", subtitle: "Execution surveillance across accounts." },
    "/admin/funds": { title: "Treasury", subtitle: "Deposits, withdrawals, and ledger." },
    "/admin/bank-settings": { title: "Bank rails", subtitle: "Settlement paths and cut-off times." },
    "/admin/ib": { title: "IB network", subtitle: "Hierarchy, volume, and commission." },
    "/admin/forex-charges": { title: "Forex charges", subtitle: "Symbol economics and swap curves." },
    "/admin/earnings": { title: "Earnings", subtitle: "Revenue attribution and partner share." },
    "/admin/copy-trading": { title: "Copy trading", subtitle: "Masters, followers, and fee policy." },
    "/admin/prop-firm": { title: "Prop challenges", subtitle: "Rules, phases, and funded stages." },
    "/admin/account-types": { title: "Account types", subtitle: "Product packaging and leverage." },
    "/admin/theme": { title: "Branding", subtitle: "Client portal tokens and density." },
    "/admin/banners": { title: "Banners", subtitle: "Campaign slots and scheduling." },
    "/admin/competitions": { title: "Competitions", subtitle: "Seasons, prizes, eligibility." },
    "/admin/email": { title: "Email", subtitle: "Transactional + lifecycle templates." },
    "/admin/oxapay": { title: "Oxapay", subtitle: "Crypto gateway health and secrets." },
    "/admin/admins": { title: "Staff access", subtitle: "Roles, MFA, and privileged actions." },
    "/admin/kyc": { title: "KYC", subtitle: "Document queue and risk decisions." },
    "/admin/support": { title: "Support", subtitle: "Tickets, SLAs, ownership." },
  }
  if (map[pathname]) return map[pathname]
  if (pathname.startsWith("/admin/users/")) {
    return { title: "Client workspace", subtitle: "Profile, accounts, and activity." }
  }
  return { title: "Admin", subtitle: "Control center" }
}
