"use client"

import {
  Bell, Search, Moon, Sun, Menu, Zap, Command,
  ChevronDown, LogOut, UserCircle2, Settings2, LifeBuoy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useEffect, useState } from "react"

interface DashboardHeaderProps {
  onMenuClick?: () => void
}

const notifications = [
  {
    dot: "bg-emerald-500",
    title: "Deposit Successful",
    body: "Your deposit of $1,000 has been credited",
    time: "2 min ago",
  },
  {
    dot: "bg-sky-500",
    title: "New Competition Started",
    body: "Weekly trading competition is now live",
    time: "1 hr ago",
  },
  {
    dot: "bg-amber-500",
    title: "KYC Approved",
    body: "Your identity verification is complete",
    time: "Yesterday",
  },
]

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = mounted ? resolvedTheme !== "light" : true
  const userAvatar: string | null = null

  const handleQuickTrade = () => {
    router.push('/web-trader')
    toast.success('Opening Web Trader', { description: 'Redirecting to trading platform...' })
  }

  const handleLogout = () => {
    toast.success('Logged out successfully', { description: 'Redirecting to login...' })
    setTimeout(() => router.push('/login'), 1000)
  }

  const handleViewAllNotifications = () => {
    router.push('/analytics')
    toast.info('Notifications', { description: 'Opening announcements and updates...' })
  }

  const handleNotificationClick = (title: string) => {
    if (title.includes('Deposit')) router.push('/funds?tab=deposit')
    else if (title.includes('Competition')) router.push('/competitions')
    else if (title.includes('KYC')) router.push('/profile')
    toast.info(title, { description: 'Opening relevant page...' })
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between px-4 lg:px-6 gap-4",
        isDark ? "border-b border-white/[0.08]" : "border-b border-slate-300/70"
      )}
      style={{
        backgroundImage: isDark
          ? "url('/istockphoto-1369016721-612x612.jpg')"
          : "url('/istockphoto-1369016721-612x612.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        backgroundColor: isDark ? 'rgba(4,10,24,0.94)' : 'rgba(248,250,252,0.95)',
        backgroundBlendMode: 'normal',
      }}
    >
      {/* Left — mobile menu & search */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0 hover:bg-secondary/80"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <div className="relative hidden md:block group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary pointer-events-none" />
          <Input
            type="search"
            placeholder="Search instruments, accounts…"
            className="w-72 pl-9 pr-12 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/30 transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border/50 bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </div>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Live dot */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] font-semibold text-emerald-500">Live</span>
        </div>

        {/* Quick trade */}
        <Button
          size="sm"
          onClick={handleQuickTrade}
          className="hidden sm:flex gap-1.5 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-200 hover:shadow-primary/30 hover:scale-[1.02] font-semibold"
        >
          <Zap className="h-3.5 w-3.5" />
          Quick Trade
        </Button>

        {/* Theme */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative hover:bg-secondary/80"
        >
          <Sun className="h-4.5 w-4.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4.5 w-4.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative hover:bg-secondary/80">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" />
                <Badge className="relative h-4 w-4 rounded-full p-0 flex items-center justify-center text-[9px] bg-primary border-0">
                  3
                </Badge>
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden shadow-2xl">
            <div className="px-4 py-3 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
              <DropdownMenuLabel className="p-0 font-semibold">Notifications</DropdownMenuLabel>
              <p className="text-xs text-muted-foreground mt-0.5">3 unread messages</p>
            </div>
            <div className="p-2 space-y-0.5">
              {notifications.map((n, i) => (
                <DropdownMenuItem
                  key={i}
                  className="flex flex-col items-start gap-1 p-3 rounded-lg cursor-pointer focus:bg-primary/5"
                  onClick={() => handleNotificationClick(n.title)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className={cn("h-2 w-2 rounded-full shrink-0", n.dot)} />
                    <span className="font-medium text-sm flex-1">{n.title}</span>
                    <span className="text-[10px] text-muted-foreground/60 shrink-0">{n.time}</span>
                  </div>
                  <span className="text-xs text-muted-foreground ml-4">{n.body}</span>
                </DropdownMenuItem>
              ))}
            </div>
            <div className="border-t border-border/50 p-2">
              <Button variant="ghost" onClick={handleViewAllNotifications} className="w-full text-xs text-muted-foreground hover:text-foreground h-8">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 gap-2 pl-2 pr-2.5 rounded-full hover:bg-secondary/80">
              <Avatar className="h-7 w-7 border-2 border-primary/20">
                {userAvatar ? <AvatarImage src={userAvatar} alt="User" /> : null}
                <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-bold text-xs">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-[13px] font-semibold">John Doe</span>
                <span className="text-[10px] text-muted-foreground">Pro Trader</span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 shadow-2xl">
            <div className="p-2 border-b border-border/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground font-bold text-sm">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="leading-none">
                  <p className="text-sm font-semibold">John Doe</p>
                  <p className="text-xs text-muted-foreground mt-0.5">john@example.com</p>
                </div>
              </div>
            </div>
            <div className="p-1 space-y-0.5">
              <DropdownMenuItem className="rounded-lg gap-2.5 cursor-pointer" onClick={() => router.push('/profile')}>
                <UserCircle2 className="h-4 w-4 text-muted-foreground" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg gap-2.5 cursor-pointer" onClick={() => router.push('/settings')}>
                <Settings2 className="h-4 w-4 text-muted-foreground" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg gap-2.5 cursor-pointer" onClick={() => router.push('/support')}>
                <LifeBuoy className="h-4 w-4 text-muted-foreground" /> Support
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <div className="p-1">
              <DropdownMenuItem className="rounded-lg gap-2.5 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10" onClick={handleLogout}>
                <LogOut className="h-4 w-4" /> Log out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
