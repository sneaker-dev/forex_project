"use client"

import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TrendingUp, X, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useMemo, useState } from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { useTradingSim } from "@/lib/trading/use-trading-sim"

export default function TradingPage() {
  const { state, metrics, actions } = useTradingSim()
  const [symbolFilter, setSymbolFilter] = useState("all")
  const [showWinnersOnly, setShowWinnersOnly] = useState(false)

  const allSymbols = useMemo(() => Object.keys(state.quotes), [state.quotes])
  const visibleOpenPositions = useMemo(() => {
    return state.positions.filter((position) => {
      const symbolMatch = symbolFilter === "all" ? true : position.symbol === symbolFilter
      const profitMatch = showWinnersOnly ? position.unrealizedPnl > 0 : true
      return symbolMatch && profitMatch
    })
  }, [state.positions, symbolFilter, showWinnersOnly])

  const visiblePendingOrders = useMemo(() => {
    return state.pendingOrders.filter((order) => (symbolFilter === "all" ? true : order.symbol === symbolFilter))
  }, [state.pendingOrders, symbolFilter])

  const visibleTradeHistory = useMemo(() => {
    return state.history.filter((trade) => {
      const profitMatch = showWinnersOnly ? trade.realizedPnl > 0 : true
      const symbolMatch = symbolFilter === "all" ? true : trade.symbol === symbolFilter
      return profitMatch && symbolMatch
    })
  }, [showWinnersOnly, state.history, symbolFilter])

  const closeAllPositions = () => {
    if (!state.positions.length) {
      toast.info("No Open Positions")
      return
    }
    actions.closeAllPositions()
    toast.success("All positions closed")
  }

  const pnlData = useMemo(() => {
    const sorted = [...state.history].slice(0, 8).reverse()
    let running = 0
    return sorted.map((item, idx) => {
      running += item.realizedPnl
      return { date: `T${idx + 1}`, pnl: Number(running.toFixed(2)) }
    })
  }, [state.history])

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Trading Activity</h1>
            <p className="text-muted-foreground">Synced with Web Trader: positions, pending orders, and history update live.</p>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <Button size="sm" variant={symbolFilter === "all" ? "default" : "outline"} onClick={() => setSymbolFilter("all")}>All</Button>
            {allSymbols.map((symbol) => (
              <Button key={symbol} size="sm" variant={symbolFilter === symbol ? "default" : "outline"} onClick={() => setSymbolFilter(symbol)}>
                {symbol}
              </Button>
            ))}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Open P/L</p>
                  <p className={cn("text-2xl font-bold", metrics.openPnl >= 0 ? "text-chart-1" : "text-chart-2")}>
                    {metrics.openPnl >= 0 ? "+" : ""}${metrics.openPnl.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-chart-1/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Closed P/L (MTD)</p>
                  <p className={cn("text-2xl font-bold", metrics.realizedPnl >= 0 ? "text-chart-1" : "text-chart-2")}>
                    {metrics.realizedPnl >= 0 ? "+" : ""}${metrics.realizedPnl.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-chart-1/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Open Positions</p>
                  <p className="text-2xl font-bold text-foreground">{state.positions.length}</p>
                </div>
                <div className="text-sm text-muted-foreground">{metrics.openVolume.toFixed(2)} lots</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Equity</p>
                  <p className="text-2xl font-bold text-foreground">${metrics.equity.toFixed(2)}</p>
                </div>
                <div className="text-sm text-muted-foreground">Balance ${state.balance.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* P/L Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Profit/Loss Overview</CardTitle>
            <CardDescription>Realized P/L curve from your latest closed trades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pnlData}>
                  <defs>
                    <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                            <p className="text-sm font-medium text-foreground">{payload[0].payload.date}</p>
                            <p className="text-lg font-bold text-chart-1">
                              ${payload[0].value?.toLocaleString()}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pnl"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    fill="url(#pnlGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for positions, orders, history */}
        <Tabs defaultValue="positions" className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="positions">
              Open Positions ({visibleOpenPositions.length})
            </TabsTrigger>
            <TabsTrigger value="orders">
              Pending Orders ({visiblePendingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="history">Trade History</TabsTrigger>
          </TabsList>

          {/* Open Positions */}
          <TabsContent value="positions">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Open Positions</CardTitle>
                  <CardDescription>Your currently active trades</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2" onClick={closeAllPositions}>
                  <X className="h-4 w-4" />
                  Close All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Symbol</TableHead>
                        <TableHead className="text-muted-foreground">Type</TableHead>
                        <TableHead className="text-muted-foreground">Volume</TableHead>
                        <TableHead className="text-muted-foreground">Entry</TableHead>
                        <TableHead className="text-muted-foreground">Current</TableHead>
                        <TableHead className="text-muted-foreground">S/L</TableHead>
                        <TableHead className="text-muted-foreground">T/P</TableHead>
                        <TableHead className="text-right text-muted-foreground">Profit</TableHead>
                        <TableHead className="text-muted-foreground"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleOpenPositions.map((position) => (
                        <TableRow key={position.id} className="border-border">
                          <TableCell className="font-medium text-foreground">{position.symbol}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={cn(
                                position.side === "buy"
                                  ? "bg-chart-1/20 text-chart-1"
                                  : "bg-chart-2/20 text-chart-2"
                              )}
                            >
                              {position.side.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{position.volume.toFixed(2)}</TableCell>
                          <TableCell className="text-muted-foreground">{position.entryPrice}</TableCell>
                          <TableCell className="text-muted-foreground">{position.currentPrice}</TableCell>
                          <TableCell className="text-chart-2">{position.stopLoss ?? "-"}</TableCell>
                          <TableCell className="text-chart-1">{position.takeProfit ?? "-"}</TableCell>
                          <TableCell
                            className={cn(
                              "text-right font-medium",
                              position.unrealizedPnl >= 0 ? "text-chart-1" : "text-chart-2"
                            )}
                          >
                            {position.unrealizedPnl >= 0 ? "+" : ""}${position.unrealizedPnl.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => actions.closePosition(position.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Orders */}
          <TabsContent value="orders">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Pending Orders</CardTitle>
                <CardDescription>Orders waiting to be executed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Symbol</TableHead>
                        <TableHead className="text-muted-foreground">Type</TableHead>
                        <TableHead className="text-muted-foreground">Volume</TableHead>
                        <TableHead className="text-muted-foreground">Stop Price</TableHead>
                        <TableHead className="text-muted-foreground">Limit Price</TableHead>
                        <TableHead className="text-muted-foreground">S/L</TableHead>
                        <TableHead className="text-muted-foreground">T/P</TableHead>
                        <TableHead className="text-muted-foreground"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visiblePendingOrders.map((order) => (
                        <TableRow key={order.id} className="border-border">
                          <TableCell className="font-medium text-foreground">{order.symbol}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={cn(
                                order.side === "buy"
                                  ? "bg-chart-1/20 text-chart-1"
                                  : "bg-chart-2/20 text-chart-2"
                              )}
                            >
                              {order.side.toUpperCase()} {order.type.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{order.volume.toFixed(2)}</TableCell>
                          <TableCell className="text-muted-foreground">{order.stopPrice ?? "-"}</TableCell>
                          <TableCell className="text-muted-foreground">{order.limitPrice ?? "-"}</TableCell>
                          <TableCell className="text-chart-2">{order.stopLoss ?? "-"}</TableCell>
                          <TableCell className="text-chart-1">{order.takeProfit ?? "-"}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => actions.cancelPendingOrder(order.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trade History */}
          <TabsContent value="history">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Trade History</CardTitle>
                  <CardDescription>Your closed trades</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setShowWinnersOnly((prev) => !prev)}
                >
                  <Filter className="h-4 w-4" />
                  {showWinnersOnly ? "Show All" : "Profitable Only"}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Symbol</TableHead>
                        <TableHead className="text-muted-foreground">Type</TableHead>
                        <TableHead className="text-muted-foreground">Volume</TableHead>
                        <TableHead className="text-muted-foreground">Entry</TableHead>
                        <TableHead className="text-muted-foreground">Close Price</TableHead>
                        <TableHead className="text-muted-foreground">Closed</TableHead>
                        <TableHead className="text-muted-foreground">Reason</TableHead>
                        <TableHead className="text-right text-muted-foreground">Profit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {visibleTradeHistory.map((trade) => (
                        <TableRow key={trade.id} className="border-border">
                          <TableCell className="font-medium text-foreground">{trade.symbol}</TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={cn(
                                trade.side === "buy"
                                  ? "bg-chart-1/20 text-chart-1"
                                  : "bg-chart-2/20 text-chart-2"
                              )}
                            >
                              {trade.side.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{trade.volume.toFixed(2)}</TableCell>
                          <TableCell className="text-muted-foreground">{trade.openPrice}</TableCell>
                          <TableCell className="text-muted-foreground">{trade.closePrice}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{new Date(trade.closedAt).toLocaleString()}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{trade.reason.replace("_", " ")}</TableCell>
                          <TableCell
                            className={cn(
                              "text-right font-medium",
                              trade.realizedPnl >= 0 ? "text-chart-1" : "text-chart-2"
                            )}
                          >
                            {trade.realizedPnl >= 0 ? "+" : ""}${trade.realizedPnl.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
