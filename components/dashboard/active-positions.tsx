"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ArrowRight, TrendingUp, TrendingDown, Activity } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const positions = [
  {
    id: "1",
    symbol: "EUR/USD",
    type: "Buy",
    volume: "1.00",
    openPrice: "1.0845",
    currentPrice: "1.0892",
    profit: "+$470.00",
    profitPercent: "+4.33%",
    profitType: "positive" as const,
  },
  {
    id: "2",
    symbol: "GBP/USD",
    type: "Sell",
    volume: "0.50",
    openPrice: "1.2715",
    currentPrice: "1.2680",
    profit: "+$175.00",
    profitPercent: "+2.75%",
    profitType: "positive" as const,
  },
  {
    id: "3",
    symbol: "USD/JPY",
    type: "Buy",
    volume: "2.00",
    openPrice: "149.25",
    currentPrice: "148.90",
    profit: "-$235.00",
    profitPercent: "-0.23%",
    profitType: "negative" as const,
  },
  {
    id: "4",
    symbol: "XAU/USD",
    type: "Buy",
    volume: "0.10",
    openPrice: "2025.50",
    currentPrice: "2048.30",
    profit: "+$228.00",
    profitPercent: "+1.13%",
    profitType: "positive" as const,
  },
]

const totalProfit = positions.reduce((sum, pos) => {
  const value = parseFloat(pos.profit.replace(/[^0-9.-]/g, ''))
  return sum + value
}, 0)

export function ActivePositions() {
  const router = useRouter()

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">Active Positions</CardTitle>
            <p className="text-xs text-muted-foreground">{positions.length} open trades</p>
          </div>
        </div>
        <Link href="/trading">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground group">
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Summary bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 mb-4">
          <span className="text-sm text-muted-foreground">Total P/L</span>
          <span className={cn(
            "text-lg font-bold number-ticker",
            totalProfit >= 0 ? "text-success" : "text-destructive"
          )}>
            {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
          </span>
        </div>

        {/* Position cards */}
        <div className="space-y-2">
          {positions.map((position, index) => (
            <div 
              key={position.id}
              onClick={() => {
                toast.info(position.symbol, { description: "Opening trade details..." })
                router.push(`/trading?symbol=${encodeURIComponent(position.symbol)}`)
              }}
              className="group relative flex items-center gap-4 p-3 rounded-xl border border-border/50 bg-card/50 hover:bg-secondary/30 transition-all duration-200 cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Symbol & Type */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{position.symbol}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1.5 py-0 h-5 border-0",
                      position.type === "Buy"
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    )}
                  >
                    {position.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">Vol: {position.volume}</span>
                  <span className="text-muted-foreground/30">|</span>
                  <span className="text-xs text-muted-foreground">{position.openPrice} → {position.currentPrice}</span>
                </div>
              </div>

              {/* Profit */}
              <div className="text-right">
                <div className={cn(
                  "flex items-center gap-1 font-semibold",
                  position.profitType === "positive" ? "text-success" : "text-destructive"
                )}>
                  {position.profitType === "positive" ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  {position.profit}
                </div>
                <span className={cn(
                  "text-xs",
                  position.profitType === "positive" ? "text-success/70" : "text-destructive/70"
                )}>
                  {position.profitPercent}
                </span>
              </div>

              {/* Hover indicator */}
              <div className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100",
                position.profitType === "positive" ? "bg-success" : "bg-destructive"
              )} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
