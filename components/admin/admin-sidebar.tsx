"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { adminLogoutItem, adminNavigation } from "@/lib/admin-nav"
import { ChevronLeft, ChevronRight, LayoutDashboard } from "lucide-react"

interface AdminSidebarProps {
  collapsed?: boolean
  isMobile?: boolean
  onCollapsedChange?: (next: boolean) => void
}

export function AdminSidebar({ collapsed = false, isMobile = false, onCollapsedChange }: AdminSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/[0.08] bg-[#050505] text-white transition-all duration-300",
        collapsed && !isMobile ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-white/[0.08] px-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-600/90">
          <LayoutDashboard className="h-5 w-5 text-white" />
        </div>
        {(!collapsed || isMobile) && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold tracking-tight">ForexPro Admin</p>
            <p className="truncate text-[10px] uppercase tracking-wider text-white/45">CRM</p>
          </div>
        )}
        {!isMobile && onCollapsedChange && (
          <button
            type="button"
            onClick={() => onCollapsedChange(!collapsed)}
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3 scrollbar-thin">
        {adminNavigation.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed && !isMobile ? item.name : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-red-600 text-white shadow-[0_0_0_1px_rgba(220,38,38,0.35)]"
                  : "text-white/70 hover:bg-white/[0.06] hover:text-white"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-white/55")} />
              {(!collapsed || isMobile) && <span className="truncate">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/[0.08] p-2">
        <LogoutLink collapsed={collapsed} isMobile={isMobile} />
      </div>
    </aside>
  )
}

function LogoutLink({ collapsed, isMobile }: { collapsed: boolean; isMobile: boolean }) {
  const Icon = adminLogoutItem.icon
  return (
    <Link
      href={adminLogoutItem.href}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-red-950/50 hover:text-red-400"
    >
      <Icon className="h-4 w-4 shrink-0" />
      {(!collapsed || isMobile) && <span>{adminLogoutItem.name}</span>}
    </Link>
  )
}
