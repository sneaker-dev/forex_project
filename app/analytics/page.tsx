'use client'

import { DashboardShell } from "@/components/dashboard/shell"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar, TrendingUp, AlertCircle, Flag } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

const economicEvents = [
  {
    id: 1,
    date: 'Mar 18, 2026 - 10:30 GMT',
    event: 'US Initial Jobless Claims',
    country: 'US',
    impact: 'High',
    forecast: '215K',
    previous: '210K',
    actual: null
  },
  {
    id: 2,
    date: 'Mar 18, 2026 - 13:00 GMT',
    event: 'ECB Interest Rate Decision',
    country: 'EU',
    impact: 'High',
    forecast: '3.00%',
    previous: '3.00%',
    actual: null
  },
  {
    id: 3,
    date: 'Mar 17, 2026 - 18:00 GMT',
    event: 'Fed Chair Powell Speech',
    country: 'US',
    impact: 'Medium',
    forecast: '-',
    previous: '-',
    actual: null
  },
  {
    id: 4,
    date: 'Mar 17, 2026 - 09:00 GMT',
    event: 'UK Retail Sales MoM',
    country: 'UK',
    impact: 'Medium',
    forecast: '0.2%',
    previous: '-0.4%',
    actual: null
  },
  {
    id: 5,
    date: 'Mar 16, 2026 - 14:30 GMT',
    event: 'US PPI Month over Month',
    country: 'US',
    impact: 'High',
    forecast: '0.2%',
    previous: '0.4%',
    actual: '+0.2%'
  },
]

const newsItems = [
  {
    id: 1,
    title: 'Federal Reserve Signals Potential Rate Cuts',
    source: 'Reuters',
    time: '2 hours ago',
    impact: 'high',
    content: 'Fed officials suggest a more patient approach to monetary policy in upcoming meetings.',
    category: 'Monetary Policy'
  },
  {
    id: 2,
    title: 'European Inflation Falls Below Target',
    source: 'Bloomberg',
    time: '4 hours ago',
    impact: 'high',
    content: 'Eurozone inflation drops to 1.8%, below ECB\'s 2% target, supporting rate cut expectations.',
    category: 'Inflation'
  },
  {
    id: 3,
    title: 'Oil Prices Rally on Supply Concerns',
    source: 'MarketWatch',
    time: '6 hours ago',
    impact: 'medium',
    content: 'Crude oil surges 2.5% following OPEC+ production concerns and geopolitical tensions.',
    category: 'Commodities'
  },
  {
    id: 4,
    title: 'USD Weakens Against Major Peers',
    source: 'FX Street',
    time: '8 hours ago',
    impact: 'medium',
    content: 'Dollar index falls below 104.5 as market expectations shift on interest rate outlook.',
    category: 'FX'
  },
  {
    id: 5,
    title: 'Tech Stocks Rally on AI Momentum',
    source: 'CNBC',
    time: '10 hours ago',
    impact: 'low',
    content: 'Tech sector gains 1.8% on continued optimism around artificial intelligence developments.',
    category: 'Equities'
  },
]

const getImpactColor = (impact: string) => {
  switch(impact.toLowerCase()) {
    case 'high':
      return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20'
    case 'medium':
      return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20'
    case 'low':
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20'
    default:
      return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/20'
  }
}

export default function AnalyticsPage() {
  const [analyticsView, setAnalyticsView] = useState<"market" | "ib-transfer">("market")
  const [eventSearch, setEventSearch] = useState("")
  const [newsSearch, setNewsSearch] = useState("")
  const [impactFilter, setImpactFilter] = useState<"all" | "high" | "medium" | "low">("all")
  const [calendarRegion, setCalendarRegion] = useState("all")
  const [newsCategory, setNewsCategory] = useState("all")
  const [ibTransferTab, setIbTransferTab] = useState<"wallet" | "trading">("wallet")
  const [ibSource, setIbSource] = useState("weekly-referrals")
  const [transferAmount, setTransferAmount] = useState("")
  const [targetTradingAccount, setTargetTradingAccount] = useState("mt5-main-001")
  const [memo, setMemo] = useState("")
  const [ibTransferHistory, setIbTransferHistory] = useState<Array<{
    id: string
    date: string
    from: string
    to: string
    amount: number
    status: "Completed" | "Pending"
  }>>([
    { id: "ib-1", date: "Mar 16, 2026", from: "Weekly Referrals", to: "Wallet USD", amount: 350, status: "Completed" },
    { id: "ib-2", date: "Mar 15, 2026", from: "Monthly IB Bonus", to: "MT5 Main #001", amount: 500, status: "Completed" },
  ])
  const [availableIbFees, setAvailableIbFees] = useState(1840)

  const filteredEvents = useMemo(() => {
    return economicEvents.filter((event) => {
      const matchesSearch =
        event.event.toLowerCase().includes(eventSearch.toLowerCase()) ||
        event.country.toLowerCase().includes(eventSearch.toLowerCase())
      const matchesImpact = impactFilter === "all" || event.impact.toLowerCase() === impactFilter
      const matchesRegion = calendarRegion === "all" || event.country.toLowerCase() === calendarRegion
      return matchesSearch && matchesImpact && matchesRegion
    })
  }, [eventSearch, impactFilter, calendarRegion])

  const filteredNews = useMemo(() => {
    return newsItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(newsSearch.toLowerCase()) ||
        item.source.toLowerCase().includes(newsSearch.toLowerCase())
      const matchesCategory = newsCategory === "all" || item.category.toLowerCase() === newsCategory
      return matchesSearch && matchesCategory
    })
  }, [newsSearch, newsCategory])

  const submitIbTransfer = () => {
    const amount = Number(transferAmount)
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Please enter a valid transfer amount")
      return
    }
    if (amount > availableIbFees) {
      toast.error("Transfer exceeds available IB fees")
      return
    }
    const sourceLabel = ibSource === "weekly-referrals" ? "Weekly Referrals" : ibSource === "monthly-commission" ? "Monthly Commission" : "IB Bonus Pool"
    const targetLabel = ibTransferTab === "wallet" ? "Wallet USD" : `MT5 ${targetTradingAccount}`
    setAvailableIbFees((prev) => prev - amount)
    setIbTransferHistory((prev) => [
      {
        id: `ib-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        from: sourceLabel,
        to: targetLabel,
        amount,
        status: "Completed",
      },
      ...prev,
    ])
    setTransferAmount("")
    setMemo("")
    toast.success("IB fee transfer completed")
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics & News</h1>
          <p className="text-muted-foreground">Economic calendar and market news to inform your trading decisions.</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={analyticsView} onValueChange={(value) => setAnalyticsView(value as "market" | "ib-transfer")} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="market">Market Analysis</TabsTrigger>
              <TabsTrigger value="ib-transfer">IB Fee Transfer</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Available IB Fees: ${availableIbFees.toFixed(2)}
            </Badge>
          </div>
        </div>

        {analyticsView === "market" ? (
        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList className="grid w-full max-w-xs grid-cols-2 sm:max-w-sm">
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="h-4 w-4" />
              Economic Calendar
            </TabsTrigger>
            <TabsTrigger value="news" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Market News
            </TabsTrigger>
          </TabsList>

          {/* Economic Calendar Tab */}
          <TabsContent value="calendar" className="space-y-4">
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Input
                  placeholder="Search events..."
                  className="max-w-sm"
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                />
                <div className="flex gap-2">
                  <Select value={impactFilter} onValueChange={(value) => setImpactFilter(value as "all" | "high" | "medium" | "low")}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Impact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Impact</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={calendarRegion} onValueChange={setCalendarRegion}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="us">US</SelectItem>
                      <SelectItem value="eu">EU</SelectItem>
                      <SelectItem value="uk">UK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date/Time</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Event</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Country</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Impact</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Forecast</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Previous</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Actual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event) => (
                      <tr key={event.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 text-xs">{event.date}</td>
                        <td className="py-3 px-4 font-medium">{event.event}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Flag className="h-3 w-3" />
                            {event.country}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getImpactColor(event.impact)}`}>
                            {event.impact}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">{event.forecast}</td>
                        <td className="py-3 px-4 text-center">{event.previous}</td>
                        <td className="py-3 px-4 text-center font-semibold">
                          {event.actual ? (
                            <span className={event.actual.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                              {event.actual}
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Market News Tab */}
          <TabsContent value="news" className="space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input placeholder="Search news..." value={newsSearch} onChange={(e) => setNewsSearch(e.target.value)} />
                <Select value={newsCategory} onValueChange={setNewsCategory}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="monetary policy">Monetary Policy</SelectItem>
                    <SelectItem value="inflation">Inflation</SelectItem>
                    <SelectItem value="commodities">Commodities</SelectItem>
                    <SelectItem value="fx">FX</SelectItem>
                    <SelectItem value="equities">Equities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4">
                {filteredNews.map((item) => (
                <Card key={item.id} className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground leading-snug">{item.title}</h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ml-2 shrink-0 ${getImpactColor(item.impact)}`}>
                          {item.impact.charAt(0).toUpperCase() + item.impact.slice(1)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{item.content}</p>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-block px-2 py-1 bg-muted rounded">{item.category}</span>
                        <span>{item.source}</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>
                </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        ) : (
          <Card className="p-6 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Select value={ibSource} onValueChange={setIbSource}>
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="IB source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly-referrals">Weekly Referrals</SelectItem>
                  <SelectItem value="monthly-commission">Monthly Commission</SelectItem>
                  <SelectItem value="bonus-pool">IB Bonus Pool</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="Transfer amount"
                className="w-[180px]"
              />
              <Input
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="Reference memo (optional)"
                className="w-[260px]"
              />
            </div>

            <Tabs value={ibTransferTab} onValueChange={(value) => setIbTransferTab(value as "wallet" | "trading")} className="space-y-4">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="wallet">Transfer to Wallet</TabsTrigger>
                <TabsTrigger value="trading">Transfer to Trading Account</TabsTrigger>
              </TabsList>

              <TabsContent value="wallet" className="space-y-4">
                <Card className="p-4 bg-muted/30">
                  <p className="text-sm text-muted-foreground mb-3">Move IB fees to client wallet for internal transfers or withdrawal.</p>
                  <Button onClick={submitIbTransfer}>Transfer to Wallet</Button>
                </Card>
              </TabsContent>

              <TabsContent value="trading" className="space-y-4">
                <Card className="p-4 bg-muted/30 space-y-3">
                  <Select value={targetTradingAccount} onValueChange={setTargetTradingAccount}>
                    <SelectTrigger className="w-[260px]">
                      <SelectValue placeholder="Target account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mt5-main-001">Main #001 (MT5)</SelectItem>
                      <SelectItem value="mt5-pro-102">Pro #102 (MT5)</SelectItem>
                      <SelectItem value="demo-778">Demo #778</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={submitIbTransfer}>Transfer to Trading Account</Button>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 px-3 text-left text-muted-foreground">Date</th>
                    <th className="py-2 px-3 text-left text-muted-foreground">From</th>
                    <th className="py-2 px-3 text-left text-muted-foreground">To</th>
                    <th className="py-2 px-3 text-right text-muted-foreground">Amount</th>
                    <th className="py-2 px-3 text-right text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ibTransferHistory.map((item) => (
                    <tr key={item.id} className="border-b border-border/70">
                      <td className="py-2 px-3">{item.date}</td>
                      <td className="py-2 px-3">{item.from}</td>
                      <td className="py-2 px-3">{item.to}</td>
                      <td className="py-2 px-3 text-right font-semibold">${item.amount.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right">
                        <span className="inline-flex rounded px-2 py-0.5 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Trading Tips */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 p-6">
          <div className="flex gap-4">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Trading Tip</h3>
              <p className="text-sm text-muted-foreground">
                High-impact economic events can cause significant market volatility. Always ensure proper risk management with appropriate stop losses and position sizing before major data releases.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  )
}
