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
    sparkPath: "M0,35 Q20,28 40,22 T80,12 L100,8 L100,40 L0,40 Z",
    sparkColor: "#10b981",
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
    sparkPath: "M0,30 Q25,24 50,20 T90,12 L100,9 L100,40 L0,40 Z",
    sparkColor: "#0ea5e9",
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
    sparkPath: "M0,14 Q25,20 50,26 T85,32 L100,35 L100,40 L0,40 Z",
    sparkColor: "#f59e0b",
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
    sparkPath: "M0,36 Q20,28 45,20 T80,10 L100,7 L100,40 L0,40 Z",
    sparkColor: "#8b5cf6",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
      {stats.map((stat, index) => (
        <Card
          key={stat.name}
          className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 card-hover"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          {/* Hover gradient fill */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            stat.gradient
          )} />

          {/* Sparkline decoration */}
          <div className="absolute bottom-0 right-0 w-28 h-14 opacity-25 pointer-events-none">
            <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
              <path d={stat.sparkPath} fill={stat.sparkColor} />
            </svg>
          </div>

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
