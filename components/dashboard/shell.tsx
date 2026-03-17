"use client"

import { DashboardSidebar } from "./sidebar"
import { DashboardHeader } from "./header"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface DashboardShellProps {
  children: React.ReactNode
}

let sidebarCollapsedMemory: boolean | null = null

export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => sidebarCollapsedMemory ?? false)
  const [isSidebarStateHydrated, setIsSidebarStateHydrated] = useState(false)

  useEffect(() => {
    if (sidebarCollapsedMemory === null) {
      const stored = localStorage.getItem("forexpro-sidebar-collapsed")
      if (stored !== null) {
        const nextValue = stored === "true"
        sidebarCollapsedMemory = nextValue
        setCollapsed(nextValue)
      }
    }
    setIsSidebarStateHydrated(true)
  }, [])

  useEffect(() => {
    if (!isSidebarStateHydrated) return
    sidebarCollapsedMemory = collapsed
    localStorage.setItem("forexpro-sidebar-collapsed", String(collapsed))
  }, [collapsed, isSidebarStateHydrated])

  return (
    <div className="min-h-screen">

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      </div>

      {/* Mobile sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[260px] p-0 bg-sidebar/80 border-sidebar-border/50">
          <VisuallyHidden>
            <SheetTitle>Navigation Menu</SheetTitle>
          </VisuallyHidden>
          <DashboardSidebar collapsed={false} onCollapsedChange={() => {}} isMobile />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className={cn("transition-all duration-300 relative z-10 min-w-0", collapsed ? "lg:pl-[72px]" : "lg:pl-[260px]")}>
        <DashboardHeader onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="p-4 lg:p-6 animate-fade-in min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
