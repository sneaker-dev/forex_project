"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Megaphone, Gift, AlertTriangle, Info, ArrowRight, Bell, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const announcements = [
  {
    id: "1",
    title: "50% Deposit Bonus",
    description: "Get 50% bonus on your next deposit. Limited time offer for all traders!",
    type: "promo" as const,
    date: "Mar 15, 2026",
    isNew: true,
  },
  {
    id: "2",
    title: "Trading Competition Live",
    description: "Join our weekly competition with $10,000 prize pool. Top 10 traders win big!",
    type: "event" as const,
    date: "Mar 14, 2026",
    isNew: true,
  },
  {
    id: "3",
    title: "Scheduled Maintenance",
    description: "Platform maintenance on Sunday, 2:00 AM - 4:00 AM UTC. Plan your trades accordingly.",
    type: "warning" as const,
    date: "Mar 13, 2026",
    isNew: false,
  },
]

const typeConfig = {
  promo: {
    icon: Gift,
    badge: "Promotion",
    badgeClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    borderColor: "hover:border-emerald-500/30",
  },
  event: {
    icon: Megaphone,
    badge: "Event",
    badgeClass: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    borderColor: "hover:border-blue-500/30",
  },
  warning: {
    icon: AlertTriangle,
    badge: "Notice",
    badgeClass: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    borderColor: "hover:border-amber-500/30",
  },
  info: {
    icon: Info,
    badge: "Info",
    badgeClass: "bg-muted text-muted-foreground border-border",
    iconBg: "bg-secondary",
    iconColor: "text-muted-foreground",
    borderColor: "hover:border-border",
  },
}

export function Announcements() {
  const router = useRouter()

  const handleAnnouncementClick = (id: string, title: string) => {
    toast.info(title, { description: "Opening related section..." })
    if (id === "1") router.push("/funds?tab=deposit")
    else if (id === "2") router.push("/competitions")
    else router.push("/analytics")
  }

  return (
    <Card className="bg-card border-border animate-slide-up" style={{ animationDelay: '400ms' }}>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">Announcements</CardTitle>
            <p className="text-xs text-muted-foreground">Latest updates and news</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-muted-foreground hover:text-foreground group"
          onClick={() => router.push("/analytics")}
        >
          View All
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map((announcement, index) => {
            const config = typeConfig[announcement.type]
            const Icon = config.icon
            return (
              <div
                key={announcement.id}
                onClick={() => handleAnnouncementClick(announcement.id, announcement.title)}
                className={cn(
                  "group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-300 cursor-pointer card-hover",
                  config.borderColor
                )}
                style={{ animationDelay: `${(index + 5) * 50}ms` }}
              >
                {/* New badge */}
                {announcement.isNew && (
                  <div className="absolute -top-2 -right-2">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                      <Sparkles className="h-2.5 w-2.5" />
                      NEW
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between gap-2">
                  <div className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110",
                    config.iconBg
                  )}>
                    <Icon className={cn("h-5 w-5", config.iconColor)} />
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] border", config.badgeClass)}>
                    {config.badge}
                  </Badge>
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {announcement.title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {announcement.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <span className="text-[10px] text-muted-foreground">{announcement.date}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5" />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
