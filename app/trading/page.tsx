"use client"

import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TrendingUp, TrendingDown, X, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"

const initialOpenPositions = [
  {
    id: "P001",
    symbol: "EUR/USD",
    type: "Buy",
    volume: "1.00",
    openPrice: "1.0845",
    currentPrice: "1.0892",
    sl: "1.0800",
    tp: "1.0950",
    swap: "-$2.50",
    profit: "+$470.00",
    profitType: "positive",
    openTime: "Mar 14, 2026 10:30",
    account: "mt5-12345",
  },
  {
    id: "P002",
    symbol: "GBP/USD",
    type: "Sell",
    volume: "0.50",
    openPrice: "1.2715",
    currentPrice: "1.2680",
    sl: "1.2800",
    tp: "1.2600",
    swap: "-$1.25",
    profit: "+$175.00",
    profitType: "positive",
    openTime: "Mar 14, 2026 14:15",
    account: "mt5-12345",
  },
  {
    id: "P003",
    symbol: "USD/JPY",
    type: "Buy",
    volume: "2.00",
    openPrice: "149.25",
    currentPrice: "148.90",
    sl: "148.50",
    tp: "150.00",
    swap: "+$3.20",
    profit: "-$235.00",
    profitType: "negative",
    openTime: "Mar 15, 2026 08:00",
    account: "mt5-12346",
  },
  {
    id: "P004",
    symbol: "XAU/USD",
    type: "Buy",
    volume: "0.10",
    openPrice: "2025.50",
    currentPrice: "2048.30",
    sl: "2000.00",
    tp: "2100.00",
    swap: "-$5.00",
    profit: "+$228.00",
    profitType: "positive",
    openTime: "Mar 13, 2026 16:45",
    account: "mt5-12346",
  },
]

const initialPendingOrders = [
  {
    id: "O001",
    symbol: "EUR/USD",
    type: "Buy Limit",
    volume: "0.50",
    price: "1.0750",
    sl: "1.0700",
    tp: "1.0900",
    expiry: "Mar 20, 2026",
    created: "Mar 15, 2026 09:00",
    account: "mt5-12345",
  },
  {
    id: "O002",
    symbol: "GBP/USD",
    type: "Sell Stop",
    volume: "1.00",
    price: "1.2650",
    sl: "1.2750",
    tp: "1.2500",
    expiry: "GTC",
    created: "Mar 14, 2026 11:30",
    account: "mt5-12346",
  },
]

const tradeHistory = [
  {
    id: "H001",
    symbol: "EUR/USD",
    type: "Buy",
    volume: "0.50",
    openPrice: "1.0810",
    closePrice: "1.0865",
    profit: "+$275.00",
    profitType: "positive",
    openTime: "Mar 12, 2026 10:00",
    closeTime: "Mar 13, 2026 14:30",
    account: "mt5-12345",
  },
  {
    id: "H002",
    symbol: "USD/JPY",
    type: "Sell",
    volume: "1.00",
    openPrice: "150.20",
    closePrice: "149.80",
    profit: "+$268.00",
    profitType: "positive",
    openTime: "Mar 11, 2026 09:15",
    closeTime: "Mar 12, 2026 16:45",
    account: "mt5-12346",
  },
  {
    id: "H003",
    symbol: "GBP/USD",
    type: "Buy",
    volume: "0.25",
    openPrice: "1.2780",
    closePrice: "1.2720",
    profit: "-$150.00",
    profitType: "negative",
    openTime: "Mar 10, 2026 14:00",
    closeTime: "Mar 11, 2026 08:30",
    account: "mt5-12345",
  },
  {
    id: "H004",
    symbol: "XAU/USD",
    type: "Sell",
    volume: "0.05",
    openPrice: "2050.00",
    closePrice: "2030.00",
    profit: "+$100.00",
    profitType: "positive",
    openTime: "Mar 09, 2026 11:00",
    closeTime: "Mar 10, 2026 09:15",
    account: "mt5-12346",
  },
  {
    id: "H005",
    symbol: "EUR/USD",
    type: "Sell",
    volume: "1.00",
    openPrice: "1.0900",
    closePrice: "1.0850",
    profit: "+$500.00",
    profitType: "positive",
    openTime: "Mar 08, 2026 13:30",
    closeTime: "Mar 09, 2026 10:00",
    account: "mt5-12345",
  },
]

const pnlData = [
  { date: "Mar 1", pnl: 1200 },
  { date: "Mar 3", pnl: 1450 },
  { date: "Mar 5", pnl: 1100 },
  { date: "Mar 7", pnl: 1680 },
  { date: "Mar 9", pnl: 1780 },
  { date: "Mar 11", pnl: 2046 },
  { date: "Mar 13", pnl: 1890 },
  { date: "Mar 15", pnl: 2638 },
]

const TRADING_STATE_STORAGE_KEY = "forexpro-trading-state"

export default function TradingPage() {
  const searchParams = useSearchParams()
  const symbolFilter = searchParams.get("symbol")
  const [openPositions, setOpenPositions] = useState(initialOpenPositions)
  const [pendingOrders, setPendingOrders] = useState(initialPendingOrders)
  const [accountFilter, setAccountFilter] = useState("all")
  const [showWinnersOnly, setShowWinnersOnly] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(TRADING_STATE_STORAGE_KEY)
    if (!stored) return
    try {
      const parsed = JSON.parse(stored) as { openPositions: typeof initialOpenPositions; pendingOrders: typeof initialPendingOrders }
      if (Array.isArray(parsed.openPositions)) setOpenPositions(parsed.openPositions)
      if (Array.isArray(parsed.pendingOrders)) setPendingOrders(parsed.pendingOrders)
    } catch {
      // ignore invalid local data
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(TRADING_STATE_STORAGE_KEY, JSON.stringify({ openPositions, pendingOrders }))
  }, [openPositions, pendingOrders])

  const visibleOpenPositions = useMemo(() => {
    return openPositions.filter((position) => {
      const symbolMatch = symbolFilter ? position.symbol === symbolFilter : true
      const profitMatch = showWinnersOnly ? position.profitType === "positive" : true
      const accountMatch = accountFilter === "all" ? true : position.account === accountFilter
      return symbolMatch && profitMatch && accountMatch
    })
  }, [openPositions, symbolFilter, showWinnersOnly, accountFilter])

  const visiblePendingOrders = useMemo(() => {
    return pendingOrders.filter((order) => (accountFilter === "all" ? true : order.account === accountFilter))
  }, [pendingOrders, accountFilter])

  const visibleTradeHistory = useMemo(() => {
    return tradeHistory.filter((trade) => {
      const profitMatch = showWinnersOnly ? trade.profitType === "positive" : true
      const accountMatch = accountFilter === "all" ? true : trade.account === accountFilter
      return profitMatch && accountMatch
    })
  }, [accountFilter, showWinnersOnly])

  const openPnL = useMemo(() => {
    return openPositions.reduce((acc, position) => acc + Number(position.profit.replace(/[^0-9.-]/g, "")), 0)
  }, [openPositions])

  const closePosition = (positionId: string) => {
    const target = openPositions.find((position) => position.id === positionId)
    if (!target) return
    setOpenPositions((prev) => prev.filter((position) => position.id !== positionId))
    toast.success(`Position ${positionId} closed`, { description: `${target.symbol} ${target.type} position closed at market` })
  }

  const cancelOrder = (orderId: string) => {
    const target = pendingOrders.find((order) => order.id === orderId)
    if (!target) return
    setPendingOrders((prev) => prev.filter((order) => order.id !== orderId))
    toast.success(`Order ${orderId} cancelled`, { description: `${target.symbol} ${target.type} order has been removed` })
  }

  const closeAllPositions = () => {
    if (!openPositions.length) {
      toast.info("No Open Positions")
      return
    }
    setOpenPositions([])
    toast.success("All positions closed")
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Trading Activity</h1>
            <p className="text-muted-foreground">Monitor your positions, orders, and trade history.</p>
          </div>
          <Select value={accountFilter} onValueChange={setAccountFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              <SelectItem value="mt5-12345">MT5-12345</SelectItem>
              <SelectItem value="mt5-12346">MT5-12346</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Open P/L</p>
                  <p className={cn("text-2xl font-bold", openPnL >= 0 ? "text-chart-1" : "text-chart-2")}>
                    {openPnL >= 0 ? "+" : ""}${openPnL.toFixed(2)}
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
                  <p className="text-2xl font-bold text-chart-1">+$993.00</p>
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
                  <p className="text-2xl font-bold text-foreground">{openPositions.length}</p>
                </div>
                <div className="text-sm text-muted-foreground">3.60 lots</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold text-foreground">78%</p>
                </div>
                <div className="text-sm text-muted-foreground">7/9 trades</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* P/L Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Profit/Loss Overview</CardTitle>
            <CardDescription>Your cumulative P/L over the last 15 days</CardDescription>
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
                        <TableHead className="text-muted-foreground">Open Price</TableHead>
                        <TableHead className="text-muted-foreground">Current</TableHead>
                        <TableHead className="text-muted-foreground">S/L</TableHead>
                        <TableHead className="text-muted-foreground">T/P</TableHead>
                        <TableHead className="text-muted-foreground">Swap</TableHead>
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
                                position.type === "Buy"
                                  ? "bg-chart-1/20 text-chart-1"
                                  : "bg-chart-2/20 text-chart-2"
                              )}
                            >
                              {position.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{position.volume}</TableCell>
                          <TableCell className="text-muted-foreground">{position.openPrice}</TableCell>
                          <TableCell className="text-muted-foreground">{position.currentPrice}</TableCell>
                          <TableCell className="text-chart-2">{position.sl}</TableCell>
                          <TableCell className="text-chart-1">{position.tp}</TableCell>
                          <TableCell className="text-muted-foreground">{position.swap}</TableCell>
                          <TableCell
                            className={cn(
                              "text-right font-medium",
                              position.profitType === "positive" ? "text-chart-1" : "text-chart-2"
                            )}
                          >
                            {position.profit}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => closePosition(position.id)}>
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
                        <TableHead className="text-muted-foreground">Price</TableHead>
                        <TableHead className="text-muted-foreground">S/L</TableHead>
                        <TableHead className="text-muted-foreground">T/P</TableHead>
                        <TableHead className="text-muted-foreground">Expiry</TableHead>
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
                                order.type.includes("Buy")
                                  ? "bg-chart-1/20 text-chart-1"
                                  : "bg-chart-2/20 text-chart-2"
                              )}
                            >
                              {order.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{order.volume}</TableCell>
                          <TableCell className="text-muted-foreground">{order.price}</TableCell>
                          <TableCell className="text-chart-2">{order.sl}</TableCell>
                          <TableCell className="text-chart-1">{order.tp}</TableCell>
                          <TableCell className="text-muted-foreground">{order.expiry}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => cancelOrder(order.id)}>
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
                        <TableHead className="text-muted-foreground">Open Price</TableHead>
                        <TableHead className="text-muted-foreground">Close Price</TableHead>
                        <TableHead className="text-muted-foreground">Open Time</TableHead>
                        <TableHead className="text-muted-foreground">Close Time</TableHead>
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
                                trade.type === "Buy"
                                  ? "bg-chart-1/20 text-chart-1"
                                  : "bg-chart-2/20 text-chart-2"
                              )}
                            >
                              {trade.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{trade.volume}</TableCell>
                          <TableCell className="text-muted-foreground">{trade.openPrice}</TableCell>
                          <TableCell className="text-muted-foreground">{trade.closePrice}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{trade.openTime}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{trade.closeTime}</TableCell>
                          <TableCell
                            className={cn(
                              "text-right font-medium",
                              trade.profitType === "positive" ? "text-chart-1" : "text-chart-2"
                            )}
                          >
                            {trade.profit}
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
