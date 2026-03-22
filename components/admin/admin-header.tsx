"use client"

import { useEffect, useState } from "react"
import { Menu, MoreHorizontal, RotateCcw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { cn } from "@/lib/utils"

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
    <header className="sticky top-0 z-30 flex min-h-[4.25rem] shrink-0 flex-col gap-3 border-b border-white/[0.06] bg-slate-950/80 px-4 py-3 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/70 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-0">
      <div className="flex min-w-0 flex-1 items-start gap-3 lg:items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mt-0.5 shrink-0 text-slate-400 hover:bg-white/5 hover:text-teal-300 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="min-w-0 flex-1 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-teal-400/80">ForexPro · command</p>
          <h1 className="truncate bg-gradient-to-r from-slate-50 via-slate-200 to-slate-500 bg-clip-text text-xl font-semibold tracking-tight text-transparent drop-shadow-[0_0_24px_rgba(45,212,191,0.08)]">
            {title}
          </h1>
          <p className="truncate text-xs leading-relaxed text-slate-500 [text-wrap:balance]">{subtitle}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 lg:gap-3">
        <div className="relative hidden min-w-[220px] max-w-md flex-1 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            readOnly
            placeholder="Search registry, tickets, executions…"
            className="h-10 cursor-default rounded-xl border-white/10 bg-slate-900/55 pl-10 text-sm text-slate-200 shadow-inner shadow-black/20 placeholder:text-slate-600 focus-visible:border-teal-500/25 focus-visible:ring-2 focus-visible:ring-teal-500/20"
          />
        </div>
        <div className="hidden items-center gap-3 rounded-full border border-white/[0.06] bg-slate-900/50 px-4 py-2 text-[11px] text-slate-500 lg:flex">
          <span className="tabular-nums text-slate-400">{now}</span>
          <span className="h-3 w-px bg-white/10" />
          <span>
            KYC <strong className="text-amber-400/95">{pendingKyc}</strong>
          </span>
          <span className="text-white/15">·</span>
          <span>
            Desk <strong className="text-cyan-400/95">{openTickets}</strong>
          </span>
        </div>
        <div
          title="CRM state saved in this browser (localStorage)"
          className={cn(
            "flex items-center gap-2 rounded-full border border-teal-500/25 bg-teal-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-teal-200/95"
          )}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400/50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
          </span>
          Synced
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-xl text-slate-500 hover:bg-white/5 hover:text-slate-200"
              aria-label="Workspace"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-white/10 bg-slate-900/95 text-slate-100 backdrop-blur-xl">
            <DropdownMenuLabel className="text-slate-500">Workspace</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              className="cursor-pointer focus:bg-teal-500/10 focus:text-teal-100"
              onClick={() => {
                resetToSeed()
                toast.success("Baseline dataset restored")
              }}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset baseline data
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
