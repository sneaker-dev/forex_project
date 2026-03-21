"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"

interface AdminShellProps {
  children: React.ReactNode
}

let adminSidebarCollapsedMemory: boolean | null = null

export function AdminShell({ children }: AdminShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => adminSidebarCollapsedMemory ?? false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (adminSidebarCollapsedMemory === null) {
      const stored = localStorage.getItem("forexpro-admin-sidebar-collapsed")
      if (stored !== null) {
        const next = stored === "true"
        adminSidebarCollapsedMemory = next
        setCollapsed(next)
      }
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    adminSidebarCollapsedMemory = collapsed
    localStorage.setItem("forexpro-admin-sidebar-collapsed", String(collapsed))
  }, [collapsed, hydrated])

  return (
    <div
      className={cn(
        "admin-scope relative min-h-screen text-[var(--admin-fg)] antialiased",
        "[font-feature-settings:'tnum'_on,_'lnum'_on]"
      )}
    >
      {/* Aurora mesh — cool slate + teal (not reference red/black) */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[#030712]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_120%_80%_at_0%_-20%,rgba(45,212,191,0.14),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(56,189,248,0.08),transparent_50%)]" />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.2]"
        style={{
          backgroundImage: `linear-gradient(rgba(148,163,184,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.03) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="hidden lg:block">
        <AdminSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-[300px] border-white/10 bg-slate-950/95 p-0 backdrop-blur-2xl"
        >
          <VisuallyHidden>
            <SheetTitle>Navigation</SheetTitle>
          </VisuallyHidden>
          <AdminSidebar collapsed={false} isMobile />
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          "relative z-10 min-w-0 transition-all duration-300 ease-out",
          collapsed ? "lg:pl-[76px]" : "lg:pl-[272px]"
        )}
      >
        <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="mx-auto max-w-[1580px] px-4 py-8 lg:px-10">{children}</main>
      </div>
    </div>
  )
}
