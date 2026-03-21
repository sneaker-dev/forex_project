"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { adminLogoutItem, adminNavSections } from "@/lib/admin-nav"
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react"

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
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/[0.07] bg-slate-950/75 backdrop-blur-2xl transition-all duration-300 ease-out",
        collapsed && !isMobile ? "w-[76px]" : "w-[272px]"
      )}
    >
      {/* Brand */}
      <div className="flex h-[4.25rem] items-center gap-3 border-b border-white/[0.06] px-4">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400/25 to-cyan-500/20 ring-1 ring-teal-400/30"
          )}
        >
          <Sparkles className="h-[1.15rem] w-[1.15rem] text-teal-300" strokeWidth={1.75} />
        </div>
        {(!collapsed || isMobile) && (
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold tracking-tight text-slate-100">ForexPro</p>
            <p className="truncate text-[10px] font-medium uppercase tracking-[0.22em] text-teal-400/80">
              Command
            </p>
          </div>
        )}
        {!isMobile && onCollapsedChange && (
          <button
            type="button"
            onClick={() => onCollapsedChange(!collapsed)}
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/5 hover:text-teal-300"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto overflow-x-hidden px-3 py-5 scrollbar-thin">
        {adminNavSections.map((section) => (
          <div key={section.id}>
            {(!collapsed || isMobile) && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {section.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed && !isMobile ? item.name : undefined}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl py-2.5 pl-3 pr-2 text-[13px] font-medium transition-all duration-200",
                        active
                          ? "bg-gradient-to-r from-teal-500/15 to-transparent text-teal-100 shadow-[inset_3px_0_0_0_rgba(45,212,191,0.95)]"
                          : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-[17px] w-[17px] shrink-0 transition-colors",
                          active ? "text-teal-300" : "text-slate-500 group-hover:text-teal-400/80"
                        )}
                        strokeWidth={1.75}
                      />
                      {(!collapsed || isMobile) && (
                        <span className="truncate leading-snug">{item.name}</span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/[0.06] p-3">
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
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-slate-200"
    >
      <Icon className="h-[17px] w-[17px] shrink-0 opacity-70" strokeWidth={1.75} />
      {(!collapsed || isMobile) && <span>{adminLogoutItem.name}</span>}
    </Link>
  )
}
