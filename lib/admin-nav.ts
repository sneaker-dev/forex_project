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

export const adminNavigation: AdminNavItem[] = [
  { name: "Overview Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Trade Management", href: "/admin/trades", icon: LineChart },
  { name: "Fund Management", href: "/admin/funds", icon: Wallet },
  { name: "Bank Settings", href: "/admin/bank-settings", icon: Landmark },
  { name: "IB Management", href: "/admin/ib", icon: Network },
  { name: "Forex Charges", href: "/admin/forex-charges", icon: Percent },
  { name: "Earnings Report", href: "/admin/earnings", icon: PieChart },
  { name: "Copy Trade Management", href: "/admin/copy-trading", icon: Copy },
  { name: "Prop Firm Challenges", href: "/admin/prop-firm", icon: Trophy },
  { name: "Account Types", href: "/admin/account-types", icon: Boxes },
  { name: "Theme Settings", href: "/admin/theme", icon: Palette },
  { name: "Banner Management", href: "/admin/banners", icon: ImageIcon },
  { name: "Competitions", href: "/admin/competitions", icon: Medal },
  { name: "Email Management", href: "/admin/email", icon: Mail },
  { name: "Oxapay Gateway", href: "/admin/oxapay", icon: Bitcoin },
  { name: "Admin Management", href: "/admin/admins", icon: Shield },
  { name: "KYC Verification", href: "/admin/kyc", icon: BadgeCheck },
  { name: "Support Tickets", href: "/admin/support", icon: Headphones },
]

export const adminLogoutItem = { name: "Log Out", href: "/login", icon: LogOut }

export function adminTitleFromPath(pathname: string): { title: string; subtitle: string } {
  const map: Record<string, { title: string; subtitle: string }> = {
    "/admin": { title: "Overview Dashboard", subtitle: "Welcome back, Admin." },
    "/admin/users": { title: "User Management", subtitle: "Search, review, and manage client accounts." },
    "/admin/trades": { title: "Trade Management", subtitle: "Monitor platform trades and execution." },
    "/admin/funds": { title: "Fund Management", subtitle: "Deposits, withdrawals, and balances." },
    "/admin/bank-settings": { title: "Bank Settings", subtitle: "Configure banking rails and processors." },
    "/admin/ib": { title: "IB Management", subtitle: "Introducing broker hierarchy and payouts." },
    "/admin/forex-charges": { title: "Forex Charges", subtitle: "Spreads, commissions, and swaps." },
    "/admin/earnings": { title: "Earnings Report", subtitle: "Platform revenue and fee analytics." },
    "/admin/copy-trading": { title: "Copy Trade Management", subtitle: "Master / follower linking and fees." },
    "/admin/prop-firm": { title: "Prop Firm Challenges", subtitle: "Challenges, rules, and funded stages." },
    "/admin/account-types": { title: "Account Types", subtitle: "Define tiers, leverage, and conditions." },
    "/admin/theme": { title: "Theme Settings", subtitle: "Branding and client portal appearance." },
    "/admin/banners": { title: "Banner Management", subtitle: "Homepage and dashboard promotions." },
    "/admin/competitions": { title: "Competitions", subtitle: "Seasons, prizes, and leaderboards." },
    "/admin/email": { title: "Email Management", subtitle: "Templates and transactional messaging." },
    "/admin/oxapay": { title: "Oxapay Gateway", subtitle: "Crypto payment gateway configuration." },
    "/admin/admins": { title: "Admin Management", subtitle: "Staff roles and permissions." },
    "/admin/kyc": { title: "KYC Verification", subtitle: "Document review and approvals." },
    "/admin/support": { title: "Support Tickets", subtitle: "Help desk queue and SLAs." },
  }
  if (map[pathname]) return map[pathname]
  if (pathname.startsWith("/admin/users/")) {
    return { title: "Client Details", subtitle: "Profile, accounts, and activity for this user." }
  }
  return { title: "Admin", subtitle: "Control center" }
}
