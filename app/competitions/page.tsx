"use client"

import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Trophy,
  Clock,
  Users,
  DollarSign,
  Medal,
  TrendingUp,
  Calendar,
  ChevronRight,
  Crown,
  Flame,
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
  { rank: 1, name: "Hawk", username: "@hawkfx", points: 10000, roi: "+124.5%", country: "JP", rating: "68,950" },
  { rank: 2, name: "ByteX", username: "@bytex", points: 5000, roi: "+102.8%", country: "US", rating: "51,420" },
  { rank: 3, name: "Voyager", username: "@voyager", points: 2500, roi: "+89.2%", country: "SG", rating: "42,360" },
  { rank: 4, name: "FXMaster", username: "@fxmaster", points: 2180, roi: "+76.5%", country: "DE", rating: "33,185" },
  { rank: 5, name: "GoldHunter", username: "@goldhunter", points: 1980, roi: "+68.9%", country: "IN", rating: "29,560" },
  { rank: 6, name: "ScalpMaster", username: "@scalpm", points: 1730, roi: "+54.2%", country: "KR", rating: "24,105" },
  { rank: 7, name: "TrendRider", username: "@trendrider", points: 1620, roi: "+48.5%", country: "CN", rating: "21,940" },
  { rank: 8, name: "PipHunter", username: "@piphunter", points: 1490, roi: "+41.2%", country: "BR", rating: "19,350" },
  { rank: 9, name: "You", username: "@you", points: 1305, roi: "+36.8%", country: "UA", rating: "17,920", isYou: true },
  { rank: 10, name: "MarketWolf", username: "@marketwolf", points: 1210, roi: "+32.5%", country: "UK", rating: "15,730" },
]

const podium = [leaderboard[1], leaderboard[0], leaderboard[2]]
const podiumAvatars: Record<number, string> = {
  1: "/stock-broker-3d-icon-png-download-5625740.webp",
  2: "/trader-3d-icon-png-download-4403852.webp",
  3: "/crypto-trader-3d-icon-png-download-12328244.webp",
}

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

        {/* Leaderboard */}
        <Card className="border-[#1f3659] bg-[#060d1f] text-slate-100 overflow-hidden">
          <CardHeader className="border-b border-[#1b2e4c] bg-[radial-gradient(ellipse_at_top,rgba(22,163,255,0.18),rgba(6,13,31,0.95)_64%)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-slate-100">Leaderboard - Rise to the Top</CardTitle>
                <CardDescription className="text-slate-300/75">Live points ranking with podium highlights</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#0f203e] text-cyan-200 border border-[#274872] gap-1.5"><Flame className="h-3 w-3" />Live Points</Badge>
                <Badge className="bg-[#0f203e] text-cyan-200 border border-[#274872]">$10,000 Pool</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-4 sm:p-6">
            <div className="grid gap-4 md:grid-cols-3 md:items-end">
              {podium.map((item, idx) => {
                const center = idx === 1
                return (
                  <div
                    key={item.rank}
                    className={cn(
                      "rounded-2xl border p-4 text-center bg-[linear-gradient(180deg,rgba(42,120,236,0.24),rgba(7,17,38,0.92))]",
                      center ? "border-cyan-300/70 md:scale-105" : "border-[#29466c]"
                    )}
                  >
                    <Avatar className={cn("mx-auto mb-2", center ? "h-16 w-16" : "h-14 w-14")}>
                      <AvatarImage src={podiumAvatars[item.rank]} alt={item.name} />
                      <AvatarFallback className={cn("font-semibold", center ? "bg-cyan-300/25 text-cyan-100" : "bg-[#1a3358] text-cyan-100")}>
                        {item.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-slate-100">{item.name}</p>
                    <div className="mx-auto mt-2 w-fit rounded-md border border-[#355b8f] bg-[#11274b] px-2 py-1 text-xs text-cyan-100">
                      #{item.rank} Rank
                    </div>
                    <p className="mt-2 text-lg font-semibold text-slate-100">{item.points.toLocaleString()}</p>
                    <p className="text-xs text-slate-300/75">AP points</p>
                    {center && (
                      <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-cyan-300/15 px-2 py-1 text-[11px] text-cyan-200">
                        <Crown className="h-3 w-3" /> Leader
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="rounded-xl border border-[#1e3555] bg-[#050b19] p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-100">Top Users</p>
                <Button size="sm" variant="outline" className="h-7 border-[#2a4f7b] bg-transparent text-slate-100 hover:bg-[#11284a]">
                  Show all
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-[#1b2f4b] hover:bg-transparent">
                      <TableHead className="text-slate-300/70 w-14">Rank</TableHead>
                      <TableHead className="text-slate-300/70">User Name</TableHead>
                      <TableHead className="text-slate-300/70">24h Return</TableHead>
                      <TableHead className="text-right text-slate-300/70">User Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard.map((entry) => (
                      <TableRow key={entry.rank} className={cn("border-[#1b2f4b] hover:bg-[#0d1d38]", entry.isYou && "bg-[#12294a]")}>
                        <TableCell className="text-slate-100 font-semibold">#{entry.rank}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={entry.rank <= 3 ? podiumAvatars[entry.rank] : undefined} alt={entry.name} />
                              <AvatarFallback className="bg-[#132948] text-[10px] text-cyan-100">{entry.country}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className={cn("text-sm font-medium", entry.isYou ? "text-cyan-300" : "text-slate-100")}>{entry.name}</p>
                              <p className="text-xs text-slate-300/60">{entry.username}</p>
                            </div>
                            {entry.isYou && <Badge className="bg-cyan-400/15 text-cyan-200 border border-cyan-300/30">You</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="text-emerald-400 font-medium">{entry.roi}</TableCell>
                        <TableCell className="text-right text-slate-100 font-semibold">{entry.rating}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

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
