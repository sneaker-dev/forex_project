"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowDownToLine, ArrowUpFromLine,
  ArrowLeftRight, Plus, ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const actions = [
  {
    name: "Deposit",
    description: "Add funds instantly",
    Icon: ArrowDownToLine,
    href: "/funds?tab=deposit",
    gradient: "from-emerald-500/20 to-emerald-500/0",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-500",
    hoverBorder: "hover:border-emerald-500/40",
    hoverShadow: "hover:shadow-emerald-500/10",
  },
  {
    name: "Withdraw",
    description: "Cash out your profits",
    Icon: ArrowUpFromLine,
    href: "/funds?tab=withdraw",
    gradient: "from-sky-500/20 to-sky-500/0",
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-500",
    hoverBorder: "hover:border-sky-500/40",
    hoverShadow: "hover:shadow-sky-500/10",
  },
  {
    name: "Transfer",
    description: "Between accounts",
    Icon: ArrowLeftRight,
    href: "/funds?tab=transfer",
    gradient: "from-amber-500/20 to-amber-500/0",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-500",
    hoverBorder: "hover:border-amber-500/40",
    hoverShadow: "hover:shadow-amber-500/10",
  },
  {
    name: "New Account",
    description: "Open trading account",
    Icon: Plus,
    href: "/accounts?new=true",
    gradient: "from-violet-500/20 to-violet-500/0",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-500",
    hoverBorder: "hover:border-violet-500/40",
    hoverShadow: "hover:shadow-violet-500/10",
  },
]

export function QuickActions() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {actions.map((action, index) => (
            <Link
              key={action.name}
              href={action.href}
              className={cn(
                "group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-4 transition-all duration-300 card-hover shadow-sm",
                action.hoverBorder,
                action.hoverShadow
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Gradient fill on hover */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                action.gradient
              )} />

              <div className="relative flex flex-col items-center gap-3 text-center">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg",
                  action.iconBg
                )}>
                  <action.Icon className={cn("h-5 w-5", action.iconColor)} />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-foreground">
                    {action.name}
                  </span>
                  <span className="block text-[10px] text-muted-foreground mt-0.5">
                    {action.description}
                  </span>
                </div>
                <ArrowRight className="absolute top-2 right-2 h-3 w-3 text-muted-foreground/0 group-hover:text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
