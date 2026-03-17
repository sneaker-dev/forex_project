"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  CandlestickChart, Coins, ShieldCheck, Gauge,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react"

const stats = [
  {
    name: "Total Balance",
    value: "$124,580.00",
    change: "+12.5%",
    changeAmount: "+$13,876.50",
    positive: true,
    Icon: Coins,
    gradient: "from-emerald-500/15 to-emerald-500/0",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  {
    name: "Equity",
    value: "$118,245.50",
    change: "+8.2%",
    changeAmount: "+$8,972.30",
    positive: true,
    Icon: CandlestickChart,
    gradient: "from-sky-500/15 to-sky-500/0",
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-500",
  },
  {
    name: "Margin Used",
    value: "$24,500.00",
    change: "-3.1%",
    changeAmount: "-$785.50",
    positive: false,
    Icon: ShieldCheck,
    gradient: "from-amber-500/15 to-amber-500/0",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
  {
    name: "Free Margin",
    value: "$93,745.50",
    change: "+15.8%",
    changeAmount: "+$12,803.20",
    positive: true,
    Icon: Gauge,
    gradient: "from-violet-500/15 to-violet-500/0",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
      {stats.map((stat, index) => (
        <Card
          key={stat.name}
          className="group relative overflow-hidden bg-card border-border card-hover"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <CardContent className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg",
                stat.iconBg
              )}>
                <stat.Icon className={cn("h-5 w-5", stat.iconColor)} />
              </div>
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
                stat.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-400"
              )}>
                {stat.positive
                  ? <ArrowUpRight className="h-3 w-3" />
                  : <ArrowDownRight className="h-3 w-3" />}
                {stat.change}
              </div>
            </div>

            <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
            <p className="text-[22px] font-bold text-foreground number-ticker tracking-tight mt-0.5">
              {stat.value}
            </p>
            <p className={cn(
              "text-xs mt-1",
              stat.positive ? "text-emerald-500/70" : "text-red-400/70"
            )}>
              {stat.changeAmount} this month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
