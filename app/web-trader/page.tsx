'use client'

import { DashboardShell } from "@/components/dashboard/shell"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp, TrendingDown, Search, Plus, Activity } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useMemo, useState } from "react"
import { toast } from "sonner"

const pairs = [
  { symbol: 'EURUSD', bid: 1.0945, ask: 1.0947, change: '+0.45%', changeClass: 'text-green-600 dark:text-green-400' },
  { symbol: 'GBPUSD', bid: 1.2834, ask: 1.2836, change: '+0.23%', changeClass: 'text-green-600 dark:text-green-400' },
  { symbol: 'USDJPY', bid: 149.52, ask: 149.55, change: '-0.12%', changeClass: 'text-red-600 dark:text-red-400' },
  { symbol: 'AUDUSD', bid: 0.6578, ask: 0.6580, change: '+0.67%', changeClass: 'text-green-600 dark:text-green-400' },
  { symbol: 'NZDUSD', bid: 0.6012, ask: 0.6014, change: '-0.34%', changeClass: 'text-red-600 dark:text-red-400' },
  { symbol: 'USDCAD', bid: 1.3654, ask: 1.3656, change: '+0.89%', changeClass: 'text-green-600 dark:text-green-400' },
]

const initialWatchlist = [
  { symbol: 'EURUSD', bid: 1.0945, ask: 1.0947, high: 1.1050, low: 1.0890 },
  { symbol: 'GBPUSD', bid: 1.2834, ask: 1.2836, high: 1.2900, low: 1.2750 },
  { symbol: 'USDJPY', bid: 149.52, ask: 149.55, high: 150.25, low: 148.90 },
]

export default function WebTraderPage() {
  const [watchlist, setWatchlist] = useState(initialWatchlist)
  const [search, setSearch] = useState("")
  const [selectedSymbol, setSelectedSymbol] = useState("EURUSD")
  const [orderSide, setOrderSide] = useState<"buy" | "sell">("buy")
  const [volume, setVolume] = useState("0.10")
  const [stopLoss, setStopLoss] = useState("")
  const [takeProfit, setTakeProfit] = useState("")
  const [openOrders, setOpenOrders] = useState<
    Array<{ id: number; symbol: string; side: "buy" | "sell"; volume: string; price: number; sl: string; tp: string }>
  >([])

  const selectedPair = useMemo(
    () => pairs.find((pair) => pair.symbol === selectedSymbol) ?? pairs[0],
    [selectedSymbol]
  )
  const filteredPairs = useMemo(
    () => pairs.filter((pair) => pair.symbol.toLowerCase().includes(search.toLowerCase())),
    [search]
  )

  const handleAddToWatchlist = () => {
    if (watchlist.some((item) => item.symbol === selectedPair.symbol)) {
      toast.info("Already in Watchlist")
      return
    }
    setWatchlist((prev) => [
      ...prev,
      {
        symbol: selectedPair.symbol,
        bid: selectedPair.bid,
        ask: selectedPair.ask,
        high: Number((selectedPair.ask * 1.01).toFixed(4)),
        low: Number((selectedPair.bid * 0.99).toFixed(4)),
      },
    ])
    toast.success(`${selectedPair.symbol} added to watchlist`)
  }

  const handleOpenOrder = () => {
    if (!volume || Number(volume) <= 0) {
      toast.error("Invalid Volume", { description: "Please enter a valid lot size." })
      return
    }
    const fillPrice = orderSide === "buy" ? selectedPair.ask : selectedPair.bid
    setOpenOrders((prev) => [
      {
        id: Date.now(),
        symbol: selectedPair.symbol,
        side: orderSide,
        volume,
        price: fillPrice,
        sl: stopLoss || "-",
        tp: takeProfit || "-",
      },
      ...prev,
    ])
    toast.success("Order Opened", { description: `${orderSide.toUpperCase()} ${selectedPair.symbol} ${volume} lot` })
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1 animate-slide-up">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Web Trader</h1>
            <Badge className="bg-success/10 text-success border-success/20 gap-1.5">
              <Activity className="h-3 w-3" />
              Live Trading
            </Badge>
          </div>
          <p className="text-muted-foreground">Trade Forex directly from your browser with real-time quotes.</p>
        </div>

        <div className="grid gap-6">
          {/* Trading Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Order Panel */}
            <Card className="lg:col-span-1 p-6 sticky top-20 h-fit">
              <h3 className="font-semibold text-foreground mb-4">New Order</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Instrument</label>
                  <Input placeholder="EURUSD" className="mt-1" value={selectedSymbol} readOnly />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setOrderSide("buy")}
                    className={`text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 ${orderSide === "buy" ? "bg-emerald-50 dark:bg-emerald-950/20" : ""}`}
                  >
                    Buy
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setOrderSide("sell")}
                    className={`text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/20 ${orderSide === "sell" ? "bg-red-50 dark:bg-red-950/20" : ""}`}
                  >
                    Sell
                  </Button>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Volume (Lot)</label>
                  <Input placeholder="0.10" type="number" className="mt-1" value={volume} onChange={(e) => setVolume(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Stop Loss</label>
                    <Input placeholder="0.00" type="number" className="mt-1" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Take Profit</label>
                    <Input placeholder="0.00" type="number" className="mt-1" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} />
                  </div>
                </div>

                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleOpenOrder}>
                  Open Order
                </Button>
              </div>

              <div className="border-t border-border mt-4 pt-4">
                <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase">Quick Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bid:</span>
                    <span className="font-semibold">{selectedPair.bid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ask:</span>
                    <span className="font-semibold">{selectedPair.ask}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Spread:</span>
                    <span className="font-semibold">2 pips</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Main Trading View */}
            <div className="lg:col-span-3 space-y-6">
              {/* Watchlist */}
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Watchlist</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Symbol</th>
                        <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Bid</th>
                        <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Ask</th>
                        <th className="text-right py-3 px-4 font-semibold text-muted-foreground">High</th>
                        <th className="text-right py-3 px-4 font-semibold text-muted-foreground">Low</th>
                        <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {watchlist.map((item) => (
                        <tr
                          key={item.symbol}
                          onClick={() => setSelectedSymbol(item.symbol)}
                          className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <td className="py-3 px-4 font-semibold">{item.symbol}</td>
                          <td className="py-3 px-4 text-right">{item.bid}</td>
                          <td className="py-3 px-4 text-right">{item.ask}</td>
                          <td className="py-3 px-4 text-right text-green-600 dark:text-green-400">{item.high}</td>
                          <td className="py-3 px-4 text-right text-red-600 dark:text-red-400">{item.low}</td>
                          <td className="py-3 px-4 text-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedSymbol(item.symbol)}
                              className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                            >
                              Trade
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* All Pairs */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Major Pairs</h3>
                  <Button size="sm" variant="outline" className="gap-1" onClick={handleAddToWatchlist}>
                    <Plus className="h-4 w-4" />
                    Add to Watchlist
                  </Button>
                </div>

                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search pairs..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                </div>

                <div className="grid gap-3">
                  {filteredPairs.map((pair) => (
                    <div
                      key={pair.symbol}
                      onClick={() => setSelectedSymbol(pair.symbol)}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{pair.symbol}</h4>
                        <p className="text-sm text-muted-foreground">Bid: {pair.bid} | Ask: {pair.ask}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${pair.changeClass} flex items-center gap-1`}>
                          {pair.change.startsWith('+') ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          {pair.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Open Orders */}
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Open Orders ({openOrders.length})</h3>
                {openOrders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No active orders yet.</p>
                ) : (
                  <div className="space-y-2">
                    {openOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div>
                          <p className="font-medium text-foreground">{order.symbol}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.side.toUpperCase()} • {order.volume} lot • SL {order.sl} • TP {order.tp}
                          </p>
                        </div>
                        <div className="text-sm font-semibold">{order.price}</div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
