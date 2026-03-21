"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { adminTitleFromPath } from "@/lib/admin-nav"
import { usePathname } from "next/navigation"

interface AdminHeaderProps {
  onMenuClick?: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname()
  const { title, subtitle } = adminTitleFromPath(pathname)

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-white/[0.08] bg-[#0a0a0a] px-4 lg:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 text-white hover:bg-white/10 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight text-white">{title}</h1>
          <p className="truncate text-xs text-white/50">{subtitle}</p>
        </div>
      </div>
      <Badge className="shrink-0 gap-1.5 border border-red-500/40 bg-red-950/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-100">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
        </span>
        Admin Mode
      </Badge>
    </header>
  )
}
