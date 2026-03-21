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
    <div className="min-h-screen bg-[#0a0a0a] text-white antialiased">
      <div className="hidden lg:block">
        <AdminSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] border-white/10 bg-[#050505] p-0">
          <VisuallyHidden>
            <SheetTitle>Admin navigation</SheetTitle>
          </VisuallyHidden>
          <AdminSidebar collapsed={false} isMobile />
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          "relative z-10 min-w-0 transition-all duration-300",
          collapsed ? "lg:pl-[72px]" : "lg:pl-[260px]"
        )}
      >
        <AdminHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
