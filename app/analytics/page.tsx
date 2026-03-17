'use client'

import { DashboardShell } from "@/components/dashboard/shell"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Calendar, TrendingUp, AlertCircle, Flag } from "lucide-react"
import { useMemo, useState } from "react"

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
  const [eventSearch, setEventSearch] = useState("")
  const [newsSearch, setNewsSearch] = useState("")
  const [impactFilter, setImpactFilter] = useState<"all" | "high" | "medium" | "low">("all")

  const filteredEvents = useMemo(() => {
    return economicEvents.filter((event) => {
      const matchesSearch =
        event.event.toLowerCase().includes(eventSearch.toLowerCase()) ||
        event.country.toLowerCase().includes(eventSearch.toLowerCase())
      const matchesImpact = impactFilter === "all" || event.impact.toLowerCase() === impactFilter
      return matchesSearch && matchesImpact
    })
  }, [eventSearch, impactFilter])

  const filteredNews = useMemo(() => {
    return newsItems.filter((item) => {
      return (
        item.title.toLowerCase().includes(newsSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(newsSearch.toLowerCase()) ||
        item.source.toLowerCase().includes(newsSearch.toLowerCase())
      )
    })
  }, [newsSearch])

  const rotateImpactFilter = () => {
    setImpactFilter((prev) => {
      if (prev === "all") return "high"
      if (prev === "high") return "medium"
      if (prev === "medium") return "low"
      return "all"
    })
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics & News</h1>
          <p className="text-muted-foreground">Economic calendar and market news to inform your trading decisions.</p>
        </div>

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
              <div className="flex gap-4 mb-6">
                <Input
                  placeholder="Search events..."
                  className="max-w-sm"
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                />
                <Button variant="outline" onClick={rotateImpactFilter}>
                  Filter: {impactFilter === "all" ? "All" : impactFilter}
                </Button>
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
              <Input placeholder="Search news..." value={newsSearch} onChange={(e) => setNewsSearch(e.target.value)} />
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
