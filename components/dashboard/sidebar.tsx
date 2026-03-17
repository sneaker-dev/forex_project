"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  CandlestickChart,
  ArrowLeftRight,
  BarChart2,
  Globe2,
  Newspaper,
  Users2,
  Trophy,
  UserCircle2,
  Settings2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BadgeDollarSign,
} from "lucide-react"

const navigation = [
  { name: "Dashboard",        href: "/",            icon: LayoutDashboard },
  { name: "Trading Accounts", href: "/accounts",    icon: CandlestickChart },
  { name: "Funds",            href: "/funds",       icon: BadgeDollarSign },
  { name: "Trading Activity", href: "/trading",     icon: BarChart2 },
  { name: "Web Trader",       href: "/web-trader",  icon: Globe2 },
  { name: "Analytics",        href: "/analytics",   icon: Newspaper },
  { name: "Referrals",        href: "/referrals",   icon: Users2 },
  { name: "Competitions",     href: "/competitions",icon: Trophy },
  { name: "Profile",          href: "/profile",     icon: UserCircle2 },
]

interface DashboardSidebarProps {
  collapsed: boolean
  onCollapsedChange: (value: boolean) => void
  isMobile?: boolean
}

export function DashboardSidebar({ collapsed, onCollapsedChange, isMobile = false }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = mounted ? resolvedTheme !== "light" : true

  const handleLogout = () => {
    toast.success("Logged out", { description: "Redirecting to login..." })
    router.push("/login")
  }

  return (
    <aside
      className={cn(
        isMobile ? "relative h-full w-full" : "fixed left-0 top-0 z-40 h-screen",
        "transition-all duration-300 ease-out overflow-x-hidden",
        isDark ? "border-r border-white/[0.08]" : "border-r border-slate-300/70",
        isMobile ? "w-[260px]" : collapsed ? "w-[72px]" : "w-[260px]"
      )}
      style={{
        backgroundImage: isDark
          ? "url('/istockphoto-1369016721-612x612.jpg')"
          : "url('/360_F_298846909_mssb9MpliUGU22kW0r0i7dMjPwdGMkZy.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'left center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Theme overlay for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, rgba(4,10,24,0.87) 0%, rgba(6,14,32,0.92) 100%)'
            : 'linear-gradient(180deg, rgba(248,250,252,0.90) 0%, rgba(241,245,249,0.94) 100%)',
        }}
      />

      <div className="relative flex h-full flex-col">
        {/* Logo */}
        <div className={cn(
          "flex h-16 items-center border-b border-sidebar-border/50 px-4",
          collapsed ? "justify-center" : "gap-3"
        )}>
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-lg shadow-primary/20">
            {/* Real logo image from our local generated asset */}
            <img
              src="/exchange-currency_11500178.png"
              alt="ForexPro"
              className="h-full w-full object-cover"
            />
            <span className="absolute -top-0.5 -right-0.5">
              <Sparkles className="h-3 w-3 text-yellow-400 drop-shadow" />
            </span>
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-none">
              <span className="text-[17px] font-bold text-sidebar-foreground tracking-tight">ForexPro</span>
              <span className="text-[9px] text-sidebar-foreground/40 uppercase tracking-[0.15em] mt-0.5">
                Trading Platform
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn("sidebar-scroll flex-1 overflow-y-auto py-4 space-y-0.5", collapsed ? "px-2" : "px-3")}>
          {navigation.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={cn(
                  "group flex items-center rounded-xl py-2.5 text-sm font-medium transition-all duration-200",
                  collapsed ? "justify-center px-2" : "gap-3 px-3",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-sidebar-foreground/55 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary/20 shadow-inner"
                    : "bg-sidebar-accent/25 group-hover:bg-sidebar-accent/50"
                )}>
                  <item.icon className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-primary" : ""
                  )} />
                </div>
                {!collapsed && <span className="truncate">{item.name}</span>}
                {isActive && !collapsed && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom links */}
        <div className={cn("border-t border-sidebar-border/50 space-y-0.5", collapsed ? "p-2" : "p-3")}>
          <Link
            href="/settings"
            title={collapsed ? "Settings" : undefined}
            className={cn(
              "group flex items-center rounded-xl py-2.5 text-sm font-medium text-sidebar-foreground/55 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground transition-all duration-200",
              collapsed ? "justify-center px-2" : "gap-3 px-3"
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent/25 group-hover:bg-sidebar-accent/50 transition-all duration-200">
              <Settings2 className="h-[18px] w-[18px] transition-transform duration-300 group-hover:rotate-90" />
            </div>
            {!collapsed && <span>Settings</span>}
          </Link>
          <button
            className={cn(
              "group flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-sidebar-foreground/55 hover:bg-destructive/10 hover:text-destructive transition-all duration-200",
              collapsed ? "justify-center px-2" : "gap-3 px-3"
            )}
            title={collapsed ? "Log out" : undefined}
            onClick={handleLogout}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent/25 group-hover:bg-destructive/20 transition-all duration-200">
              <LogOut className="h-[18px] w-[18px] transition-transform duration-200 group-hover:-translate-x-0.5" />
            </div>
            {!collapsed && <span>Log out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-20 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar shadow-md text-sidebar-foreground hover:bg-sidebar-accent hover:scale-110 transition-all duration-200"
            onClick={() => onCollapsedChange(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>
    </aside>
  )
}
