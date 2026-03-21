"use client"

import { useEffect, useState } from "react"
import { Menu, MoreHorizontal, RotateCcw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { adminTitleFromPath } from "@/lib/admin-nav"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAdmin } from "@/components/admin/admin-provider"
import { toast } from "sonner"

interface AdminHeaderProps {
  onMenuClick?: () => void
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname()
  const { title, subtitle } = adminTitleFromPath(pathname)
  const { resetToSeed, state } = useAdmin()
  const [now, setNow] = useState<string>("")

  useEffect(() => {
    const tick = () => {
      setNow(
        new Intl.DateTimeFormat("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date())
      )
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const pendingKyc = state.kycItems.filter((k) => k.status === "Queued" || k.status === "In Review").length
  const openTickets = state.tickets.filter((t) => t.status === "Open" || t.status === "In Progress").length

  return (
    <header className="sticky top-0 z-30 flex min-h-16 shrink-0 flex-col gap-3 border-b border-white/[0.08] bg-[#070707]/95 px-4 py-3 backdrop-blur-md lg:flex-row lg:items-center lg:justify-between lg:px-6 lg:py-0">
      <div className="flex min-w-0 flex-1 items-start gap-3 lg:items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mt-0.5 shrink-0 text-white hover:bg-white/10 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold tracking-tight text-white">{title}</h1>
          <p className="truncate text-xs text-white/50">{subtitle}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:gap-3">
        <div className="relative hidden min-w-[200px] max-w-xs flex-1 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <Input
            readOnly
            placeholder="Search clients, tickets, trades…"
            className="h-9 border-white/10 bg-black/40 pl-9 text-sm text-white placeholder:text-white/35"
          />
        </div>
        <div className="hidden items-center gap-2 text-xs text-white/45 lg:flex">
          <span className="tabular-nums">{now}</span>
          <span className="text-white/25">|</span>
          <span>
            KYC <strong className="text-amber-300/90">{pendingKyc}</strong>
          </span>
          <span className="text-white/25">·</span>
          <span>
            Tickets <strong className="text-sky-300/90">{openTickets}</strong>
          </span>
        </div>
        <Badge className="gap-1.5 border border-red-500/40 bg-red-950/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-100">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          Live
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Workspace menu"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-white/10 bg-[#111] text-white">
            <DropdownMenuLabel className="text-white/70">Workspace</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              className="cursor-pointer focus:bg-white/10 focus:text-white"
              onClick={() => {
                resetToSeed()
                toast.success("CRM data restored to baseline")
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to baseline dataset
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
