"use client"

import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Trophy,
  Clock,
  Users,
  DollarSign,
  Medal,
  TrendingUp,
  Calendar,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const initialCompetitions = [
  {
    id: "1",
    name: "Weekly Trading Championship",
    status: "active",
    prizePool: "$10,000",
    participants: 256,
    startDate: "Mar 11, 2026",
    endDate: "Mar 17, 2026",
    yourRank: 12,
    yourProfit: "+$1,845.00",
    rules: "Highest % profit wins",
    joined: true,
  },
  {
    id: "2",
    name: "March Madness",
    status: "active",
    prizePool: "$25,000",
    participants: 512,
    startDate: "Mar 01, 2026",
    endDate: "Mar 31, 2026",
    yourRank: 45,
    yourProfit: "+$3,250.00",
    rules: "Highest absolute profit wins",
    joined: true,
  },
  {
    id: "3",
    name: "Scalping Masters",
    status: "upcoming",
    prizePool: "$5,000",
    participants: 0,
    startDate: "Mar 20, 2026",
    endDate: "Mar 22, 2026",
    yourRank: null,
    yourProfit: null,
    rules: "Most profitable scalping trades",
    joined: false,
  },
  {
    id: "4",
    name: "Gold Rush Challenge",
    status: "upcoming",
    prizePool: "$15,000",
    participants: 128,
    startDate: "Apr 01, 2026",
    endDate: "Apr 15, 2026",
    yourRank: null,
    yourProfit: null,
    rules: "XAU/USD trading only",
    joined: false,
  },
]

const leaderboard = [
  { rank: 1, name: "TraderPro", profit: "+$12,450.00", profitPercent: "+124.5%", trades: 89 },
  { rank: 2, name: "FXMaster", profit: "+$10,280.00", profitPercent: "+102.8%", trades: 156 },
  { rank: 3, name: "GoldHunter", profit: "+$8,920.00", profitPercent: "+89.2%", trades: 42 },
  { rank: 4, name: "SwingKing", profit: "+$7,650.00", profitPercent: "+76.5%", trades: 28 },
  { rank: 5, name: "ScalpMaster", profit: "+$6,890.00", profitPercent: "+68.9%", trades: 312 },
  { rank: 6, name: "TrendRider", profit: "+$5,420.00", profitPercent: "+54.2%", trades: 67 },
  { rank: 7, name: "PipHunter", profit: "+$4,850.00", profitPercent: "+48.5%", trades: 145 },
  { rank: 8, name: "ForexNinja", profit: "+$4,120.00", profitPercent: "+41.2%", trades: 98 },
  { rank: 9, name: "MarketWolf", profit: "+$3,680.00", profitPercent: "+36.8%", trades: 76 },
  { rank: 10, name: "ChartPro", profit: "+$3,250.00", profitPercent: "+32.5%", trades: 54 },
  { rank: 11, name: "TradeStar", profit: "+$2,890.00", profitPercent: "+28.9%", trades: 112 },
  { rank: 12, name: "You", profit: "+$1,845.00", profitPercent: "+18.45%", trades: 34, isYou: true },
]

const prizeDistribution = [
  { place: "1st", prize: "$5,000", percent: 50 },
  { place: "2nd", prize: "$2,500", percent: 25 },
  { place: "3rd", prize: "$1,500", percent: 15 },
  { place: "4th-10th", prize: "$150 each", percent: 10 },
]

const pastResults = [
  { season: "February Sprint 2026", rank: 18, profit: "+$1,180.00", prize: "$0.00", participants: 460 },
  { season: "New Year Challenge 2026", rank: 7, profit: "+$2,960.00", prize: "$250.00", participants: 780 },
  { season: "December Finale 2025", rank: 11, profit: "+$1,990.00", prize: "$0.00", participants: 640 },
]

const COMPETITIONS_STORAGE_KEY = "forexpro-competitions-state"

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState(initialCompetitions)
  const activeCompetition = competitions.find((c) => c.status === "active" && c.joined)
  const daysRemaining = 2 // Simplified for demo
  const joinedCount = competitions.filter((c) => c.joined).length

  useEffect(() => {
    const stored = localStorage.getItem(COMPETITIONS_STORAGE_KEY)
    if (!stored) return
    try {
      const parsed = JSON.parse(stored) as typeof initialCompetitions
      if (Array.isArray(parsed) && parsed.length) {
        setCompetitions(parsed)
      }
    } catch {
      // ignore invalid local data
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(COMPETITIONS_STORAGE_KEY, JSON.stringify(competitions))
  }, [competitions])

  const handleJoinCompetition = (competitionId: string, name: string) => {
    setCompetitions((prev) =>
      prev.map((competition) =>
        competition.id === competitionId ? { ...competition, joined: true, participants: competition.participants + 1 } : competition
      )
    )
    toast.success("Joined Competition", { description: `You are now registered for ${name}.` })
  }

  const handleViewCompetition = (name: string, rank: number | null) => {
    toast.info(name, { description: rank ? `Current rank: #${rank}` : "Competition details opened." })
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trading Competitions</h1>
          <p className="text-muted-foreground">Compete with other traders and win amazing prizes.</p>
        </div>

        {/* Active competition highlight */}
        {activeCompetition && (
          <Card className="bg-gradient-to-br from-primary/10 via-background to-chart-4/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <Badge className="bg-chart-1/20 text-chart-1">Live Now</Badge>
                  <h2 className="text-2xl font-bold text-foreground">{activeCompetition.name}</h2>
                  <p className="text-muted-foreground">{activeCompetition.rules}</p>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-chart-4" />
                      <span className="font-semibold text-foreground">{activeCompetition.prizePool}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="text-muted-foreground">{activeCompetition.participants} participants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-chart-2" />
                      <span className="text-chart-2">{daysRemaining} days left</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-4 lg:items-end">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Your Current Rank</p>
                    <p className="text-4xl font-bold text-foreground">#{activeCompetition.yourRank}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Your Profit</p>
                    <p className="text-2xl font-bold text-chart-1">{activeCompetition.yourProfit}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Competitions Joined</p>
                  <p className="text-2xl font-bold text-foreground">{joinedCount}</p>
                </div>
                <Trophy className="h-8 w-8 text-chart-4/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Best Rank</p>
                  <p className="text-2xl font-bold text-chart-1">#12</p>
                </div>
                <Medal className="h-8 w-8 text-chart-1/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Winnings</p>
                  <p className="text-2xl font-bold text-foreground">$850.00</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Competition Profit</p>
                  <p className="text-2xl font-bold text-chart-1">+$5,095.00</p>
                </div>
                <TrendingUp className="h-8 w-8 text-chart-1/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard and Prize Pool */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Leaderboard */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle>Leaderboard - Weekly Championship</CardTitle>
              <CardDescription>Top performers in the current competition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground w-16">Rank</TableHead>
                      <TableHead className="text-muted-foreground">Trader</TableHead>
                      <TableHead className="text-muted-foreground">Trades</TableHead>
                      <TableHead className="text-muted-foreground">Profit %</TableHead>
                      <TableHead className="text-right text-muted-foreground">Profit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard.map((entry) => (
                      <TableRow
                        key={entry.rank}
                        className={cn(
                          "border-border",
                          entry.isYou && "bg-primary/5"
                        )}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {entry.rank <= 3 ? (
                              <div
                                className={cn(
                                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                                  entry.rank === 1 && "bg-chart-4 text-chart-4-foreground",
                                  entry.rank === 2 && "bg-gray-400 text-white",
                                  entry.rank === 3 && "bg-amber-700 text-white"
                                )}
                              >
                                {entry.rank}
                              </div>
                            ) : (
                              <span className="text-muted-foreground font-medium pl-1.5">{entry.rank}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="bg-secondary text-xs">
                                {entry.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className={cn("font-medium", entry.isYou ? "text-primary" : "text-foreground")}>
                              {entry.name}
                            </span>
                            {entry.isYou && (
                              <Badge variant="secondary" className="text-xs">You</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{entry.trades}</TableCell>
                        <TableCell className="text-chart-1 font-medium">{entry.profitPercent}</TableCell>
                        <TableCell className="text-right font-semibold text-chart-1">{entry.profit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Prize Pool */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Prize Distribution</CardTitle>
              <CardDescription>Weekly Championship prizes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4">
                <Trophy className="h-12 w-12 mx-auto text-chart-4 mb-2" />
                <p className="text-3xl font-bold text-foreground">$10,000</p>
                <p className="text-sm text-muted-foreground">Total Prize Pool</p>
              </div>
              <div className="space-y-3">
                {prizeDistribution.map((prize) => (
                  <div key={prize.place} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold",
                          prize.place === "1st" && "bg-chart-4/20 text-chart-4",
                          prize.place === "2nd" && "bg-gray-400/20 text-gray-400",
                          prize.place === "3rd" && "bg-amber-700/20 text-amber-700",
                          prize.place === "4th-10th" && "bg-secondary text-muted-foreground"
                        )}
                      >
                        {prize.place.replace(/[^0-9-]/g, '') || '4+'}
                      </div>
                      <span className="font-medium text-foreground">{prize.place}</span>
                    </div>
                    <span className="font-semibold text-foreground">{prize.prize}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Competition List */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="active">Active ({competitions.filter((c) => c.status === "active").length})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({competitions.filter((c) => c.status === "upcoming").length})</TabsTrigger>
            <TabsTrigger value="past">Past Results</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {competitions
              .filter((c) => c.status === "active")
              .map((comp) => (
                <Card key={comp.id} className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{comp.name}</h3>
                          {comp.joined && (
                            <Badge variant="secondary" className="bg-chart-1/20 text-chart-1">Joined</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{comp.rules}</p>
                        <div className="flex items-center gap-4 pt-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Trophy className="h-4 w-4 text-chart-4" />
                            <span className="text-foreground">{comp.prizePool}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{comp.participants}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{comp.endDate}</span>
                          </div>
                        </div>
                      </div>
                      {comp.joined ? (
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Your Rank</p>
                            <p className="text-xl font-bold text-foreground">#{comp.yourRank}</p>
                          </div>
                          <Button variant="outline" className="gap-1" onClick={() => handleViewCompetition(comp.name, comp.yourRank)}>
                            View <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button className="gap-2" onClick={() => handleJoinCompetition(comp.id, comp.name)}>Join Competition</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {competitions
              .filter((c) => c.status === "upcoming")
              .map((comp) => (
                <Card key={comp.id} className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground">{comp.name}</h3>
                        <p className="text-sm text-muted-foreground">{comp.rules}</p>
                        <div className="flex items-center gap-4 pt-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Trophy className="h-4 w-4 text-chart-4" />
                            <span className="text-foreground">{comp.prizePool}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Starts {comp.startDate}</span>
                          </div>
                        </div>
                      </div>
                      <Button className="gap-2" onClick={() => handleJoinCompetition(comp.id, comp.name)}>Register Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="past">
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Season</TableHead>
                        <TableHead className="text-muted-foreground">Participants</TableHead>
                        <TableHead className="text-muted-foreground">Final Rank</TableHead>
                        <TableHead className="text-muted-foreground">Profit</TableHead>
                        <TableHead className="text-right text-muted-foreground">Prize Won</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastResults.map((result) => (
                        <TableRow key={result.season} className="border-border">
                          <TableCell className="font-medium text-foreground">{result.season}</TableCell>
                          <TableCell className="text-muted-foreground">{result.participants}</TableCell>
                          <TableCell className="text-foreground">#{result.rank}</TableCell>
                          <TableCell className="text-chart-1 font-medium">{result.profit}</TableCell>
                          <TableCell className="text-right font-semibold text-foreground">{result.prize}</TableCell>
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
