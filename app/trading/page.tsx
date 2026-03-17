"use client"

import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TrendingUp, X, Filter, Search, ArrowLeftRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useEffect, useMemo, useState } from "react"
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
  const [search, setSearch] = useState("")
  const [selectedSymbol, setSelectedSymbol] = useState("XAUUSD")
  const [oneClickEnabled, setOneClickEnabled] = useState(false)
  const [volume, setVolume] = useState("0.10")

  const allSymbols = useMemo(() => Object.keys(state.quotes), [state.quotes])
  const watchlistQuotes = useMemo(
    () =>
      Object.values(state.quotes).filter((quote) => quote.symbol.toLowerCase().includes(search.toLowerCase())),
    [state.quotes, search]
  )
  const selectedQuote = state.quotes[selectedSymbol] ?? watchlistQuotes[0]
  const decimals = selectedQuote?.symbol === "XAUUSD" ? 2 : selectedQuote?.symbol?.includes("JPY") ? 3 : 5
  const quoteLast = selectedQuote?.last ?? 0
  const quoteOpen = selectedQuote?.open ?? quoteLast
  const quoteHigh = selectedQuote?.high ?? quoteLast
  const quoteLow = selectedQuote?.low ?? quoteLast
  const quoteSpread = selectedQuote?.spread ?? 0
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

  useEffect(() => {
    if (!state.quotes[selectedSymbol]) {
      const fallback = Object.keys(state.quotes)[0]
      if (fallback) setSelectedSymbol(fallback)
    }
  }, [selectedSymbol, state.quotes])

  const placeOneClickOrder = (side: "buy" | "sell") => {
    const result = actions.placeOrder({
      symbol: selectedQuote?.symbol ?? selectedSymbol,
      side,
      type: "market",
      volume: Number(volume || "0"),
    })
    if (!result.ok) {
      toast.error("One-click order rejected", { description: result.message })
      return
    }
    toast.success(`${side.toUpperCase()} executed`, { description: result.message })
  }

  return (
    <DashboardShell>
      <div className="space-y-4 min-w-0">
        <div className="rounded-xl border border-[#1e3557] bg-[linear-gradient(180deg,#081733,#050d20)] overflow-hidden">
          <div className="border-b border-[#1b2f4a] px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge className="border-[#2f4f7d] bg-[#0d2242] text-cyan-100">{selectedQuote?.symbol ?? selectedSymbol}</Badge>
                <Badge variant="outline" className="border-[#2f4f7d] text-slate-200">Balance ${state.balance.toFixed(2)}</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                {["30s", "1m", "2m", "3m", "5m", "10m", "15m", "30m", "1h", "4h"].map((tf) => (
                  <span key={tf} className="rounded px-1.5 py-0.5 hover:bg-[#11284c]">{tf}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid min-w-0 xl:grid-cols-[240px_minmax(0,1fr)_320px] lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="border-r border-[#1b2f4a] bg-[#081325]">
              <div className="border-b border-[#1b2f4a] px-2 py-1 text-[11px] text-slate-400">Watchlist</div>
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search symbol"
                    className="h-7 border-[#27466f] bg-[#0b1730] pl-7 text-xs text-slate-100"
                  />
                </div>
              </div>
              <div className="max-h-[560px] overflow-y-auto px-1 pb-2">
                {watchlistQuotes.map((quote) => (
                  <button
                    key={quote.symbol}
                    type="button"
                    onClick={() => setSelectedSymbol(quote.symbol)}
                    className={cn(
                      "mb-1 w-full rounded border px-2 py-1.5 text-left",
                      selectedSymbol === quote.symbol ? "border-cyan-500/70 bg-[#122a4f]" : "border-[#1f385c] bg-[#0b1730]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-100">{quote.symbol}</span>
                      <span className={cn("text-[10px]", quote.changePercent >= 0 ? "text-emerald-400" : "text-red-400")}>
                        {quote.changePercent >= 0 ? "+" : ""}
                        {quote.changePercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{quote.bid}</span>
                      <span>{quote.ask}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-r border-[#1b2f4a] bg-[#070f1f]">
              <div className="border-b border-[#1b2f4a] px-3 py-1.5 text-xs text-slate-300">
                {selectedQuote?.symbol} · Open {quoteOpen.toFixed(decimals)} · High {quoteHigh.toFixed(decimals)} · Low {quoteLow.toFixed(decimals)}
              </div>
              <div className="h-[360px] p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={pnlData.length ? pnlData : [{ date: "T1", pnl: 0 }]}>
                    <defs>
                      <linearGradient id="mt5PnlGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1b3557" />
                    <XAxis dataKey="date" stroke="#9db1cf" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9db1cf" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="pnl" stroke="#3b82f6" strokeWidth={2} fill="url(#mt5PnlGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="border-t border-[#1b2f4a]">
                <div className="grid grid-cols-[1fr_auto] border-b border-[#1b2f4a] px-3 py-1 text-[11px] text-slate-300">
                  <span>News</span>
                  <span>Weekly Report</span>
                </div>
                <div className="max-h-[170px] overflow-y-auto">
                  {visibleTradeHistory.slice(0, 6).map((trade, idx) => (
                    <div key={trade.id} className="grid grid-cols-[1fr_auto] gap-2 border-b border-[#132744] px-3 py-1.5 text-[11px] text-slate-300">
                      <span className="truncate">{`${trade.symbol} ${trade.reason.replace("_", " ")}`}</span>
                      <span className="text-slate-500">{`03/${String(idx + 2).padStart(2, "0")} 15:44`}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-[#071022] p-3">
              <div className="rounded-lg border border-[#223e65] bg-[#0a1428] p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] uppercase text-slate-400">Quote</p>
                    <p className="text-[11px] text-slate-400">{selectedQuote?.symbol} FX</p>
                  </div>
                  <ArrowLeftRight className="h-4 w-4 text-slate-400" />
                </div>
                <p className="mt-2 text-[38px] font-semibold leading-none text-[#EC3606]">{quoteLast.toFixed(decimals)}</p>
                <p className={cn("text-xs", (selectedQuote?.changePercent ?? 0) >= 0 ? "text-emerald-400" : "text-red-400")}>
                  {(selectedQuote?.changePercent ?? 0) >= 0 ? "+" : ""}
                  {(selectedQuote?.changePercent ?? 0).toFixed(2)}%
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div className="rounded border border-[#27466f] px-2 py-1">Open {quoteOpen.toFixed(decimals)}</div>
                  <div className="rounded border border-[#27466f] px-2 py-1">Spread {quoteSpread.toFixed(decimals)}</div>
                </div>
                <div className="mt-3 rounded border border-[#2b4368] p-2">
                  <div className="mb-2 flex items-center justify-between">
                    <Label className="text-xs text-slate-200">One-Click Trading</Label>
                    <Switch checked={oneClickEnabled} onCheckedChange={setOneClickEnabled} />
                  </div>
                  <Input value={volume} onChange={(e) => setVolume(e.target.value)} type="number" className="mb-2 h-7 border-[#2b436d] bg-[#0b1730] text-xs text-slate-100" />
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="h-8 bg-blue-600 hover:bg-blue-700" disabled={!oneClickEnabled} onClick={() => placeOneClickOrder("buy")}>BUY</Button>
                    <Button className="h-8 bg-red-600 hover:bg-red-700" disabled={!oneClickEnabled} onClick={() => placeOneClickOrder("sell")}>SELL</Button>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="positions" className="space-y-2">
                <TabsList className="grid w-full grid-cols-3 border border-[#223a61] bg-[#0b1730]">
                  <TabsTrigger value="positions">Positions</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="positions" className="rounded border border-[#223e65] bg-[#08132a] p-2 text-xs">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-slate-300">Open ({visibleOpenPositions.length})</span>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-[11px]" onClick={closeAllPositions}>
                      <X className="mr-1 h-3 w-3" />Close All
                    </Button>
                  </div>
                  {visibleOpenPositions.slice(0, 5).map((position) => (
                    <div key={position.id} className="mb-1 flex items-center justify-between rounded px-1 py-1">
                      <span className="text-slate-200">{position.symbol} {position.side.toUpperCase()}</span>
                      <span className={position.unrealizedPnl >= 0 ? "text-emerald-400" : "text-red-400"}>
                        {position.unrealizedPnl >= 0 ? "+" : ""}${position.unrealizedPnl.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="orders" className="rounded border border-[#223e65] bg-[#08132a] p-2 text-xs">
                  {visiblePendingOrders.slice(0, 5).map((order) => (
                    <div key={order.id} className="mb-1 flex items-center justify-between rounded px-1 py-1">
                      <span className="text-slate-200">{order.symbol} {order.type.toUpperCase()}</span>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-[11px]" onClick={() => actions.cancelPendingOrder(order.id)}>Cancel</Button>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="history" className="rounded border border-[#223e65] bg-[#08132a] p-2 text-xs">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-slate-300">Closed Trades</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[11px]" onClick={() => setShowWinnersOnly((prev) => !prev)}>
                      <Filter className="mr-1 h-3 w-3" />
                      {showWinnersOnly ? "Show All" : "Winners"}
                    </Button>
                  </div>
                  {visibleTradeHistory.slice(0, 5).map((trade) => (
                    <div key={trade.id} className="mb-1 flex items-center justify-between rounded px-1 py-1">
                      <span className="text-slate-200">{trade.symbol} {trade.side.toUpperCase()}</span>
                      <span className={trade.realizedPnl >= 0 ? "text-emerald-400" : "text-red-400"}>
                        {trade.realizedPnl >= 0 ? "+" : ""}${trade.realizedPnl.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="border-t border-[#1b2f4a] bg-[#050a16] px-3 py-2 text-xs text-slate-300">
            <div className="flex flex-wrap gap-4">
              <span>Balance: ${state.balance.toFixed(2)}</span>
              <span>Equity: ${metrics.equity.toFixed(2)}</span>
              <span>Open P/L: {metrics.openPnl >= 0 ? "+" : ""}${metrics.openPnl.toFixed(2)}</span>
              <span>Open Volume: {metrics.openVolume.toFixed(2)} lots</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
