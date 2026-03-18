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
  ChevronLeft,
  ChevronRight,
  Crown,
  Flame,
  Award,
  Coins,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useMemo, useState } from "react"
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

const ibLeaderboard = [
  { rank: 1, name: "Hawk IB Team", ibFees: "$12,840", referrals: 92, lotVolume: "1,820 lots", month: "Mar 2026" },
  { rank: 2, name: "ByteX Partners", ibFees: "$10,110", referrals: 85, lotVolume: "1,540 lots", month: "Mar 2026" },
  { rank: 3, name: "Voyager Group", ibFees: "$9,265", referrals: 74, lotVolume: "1,422 lots", month: "Mar 2026" },
  { rank: 4, name: "GoldHunter IB", ibFees: "$7,990", referrals: 63, lotVolume: "1,160 lots", month: "Mar 2026" },
  { rank: 5, name: "FXMaster Desk", ibFees: "$6,780", referrals: 57, lotVolume: "1,005 lots", month: "Mar 2026" },
]
const ibPodium = [ibLeaderboard[1], ibLeaderboard[0], ibLeaderboard[2]]

const COMPETITIONS_STORAGE_KEY = "forexpro-competitions-state"

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState(initialCompetitions)
  const [podiumOffset, setPodiumOffset] = useState(0)
  const [leaderboardView, setLeaderboardView] = useState<"trading" | "ib">("trading")
  const activeCompetition = competitions.find((c) => c.status === "active" && c.joined)
  const daysRemaining = 2 // Simplified for demo
  const joinedCount = competitions.filter((c) => c.joined).length
  const rotatedPodium = useMemo(
    () => podium.map((_, idx) => podium[(idx + podiumOffset) % podium.length]),
    [podiumOffset]
  )

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
      <div className="flex flex-col gap-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trading Competitions</h1>
          <p className="text-muted-foreground">Compete with other traders and win amazing prizes.</p>
        </div>

        {/* Active competition highlight */}
        {activeCompetition && (
          <Card className="order-1 bg-gradient-to-br from-primary/10 via-background to-chart-4/10 border-primary/20">
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
        <div className="order-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        <Tabs defaultValue="active" className="order-3 flex flex-col space-y-6">
          <TabsList className="grid h-11 w-full grid-cols-3 items-center rounded-xl border border-[#233f63] bg-[#0b1c37]/95 p-1">
            <TabsTrigger className="h-9 items-center justify-center" value="active">Active ({competitions.filter((c) => c.status === "active").length})</TabsTrigger>
            <TabsTrigger className="h-9 items-center justify-center" value="upcoming">Upcoming ({competitions.filter((c) => c.status === "upcoming").length})</TabsTrigger>
            <TabsTrigger className="h-9 items-center justify-center" value="past">Past Results</TabsTrigger>
          </TabsList>

          {/* Leaderboard */}
          <Card className="order-2 border-[#1f3659] bg-[#060d1f] text-slate-100 overflow-hidden">
          <CardHeader className="border-b border-[#1b2e4c] bg-[radial-gradient(ellipse_at_top,rgba(22,163,255,0.18),rgba(6,13,31,0.95)_64%)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-slate-100">
                  {leaderboardView === "trading"
                    ? "Leaderboard - Rise to the Top"
                    : "Trader of the Month - IB Leaderboard"}
                </CardTitle>
                <CardDescription className="text-slate-300/75">
                  {leaderboardView === "trading"
                    ? "Live points ranking with podium highlights"
                    : "Ranking by IB referral fees generated in the current competition cycle."}
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="grid grid-cols-2 rounded-lg border border-[#2b4a75] bg-[#0e2242] p-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setLeaderboardView("trading")}
                    className={cn(
                      "h-7 px-3 text-xs",
                      leaderboardView === "trading" ? "bg-[#16325b] text-cyan-100" : "text-slate-300"
                    )}
                  >
                    Current Leaderboard
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setLeaderboardView("ib")}
                    className={cn(
                      "h-7 px-3 text-xs",
                      leaderboardView === "ib" ? "bg-[#16325b] text-cyan-100" : "text-slate-300"
                    )}
                  >
                    IB Leaderboard
                  </Button>
                </div>
                {leaderboardView === "trading" && (
                  <>
                    <Badge className="bg-[#0f203e] text-cyan-200 border border-[#274872] gap-1.5"><Flame className="h-3 w-3" />Live Points</Badge>
                    <Badge className="bg-[#0f203e] text-cyan-200 border border-[#274872]">$10,000 Pool</Badge>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-4 sm:p-6">
            {leaderboardView === "trading" && (
              <>
            <div className="relative overflow-hidden rounded-2xl border border-[#244066] bg-[linear-gradient(180deg,rgba(12,28,54,0.95),rgba(7,16,34,1))] p-4 sm:p-5">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-12 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
                <div className="absolute -right-12 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-blue-500/15 blur-3xl" />
                <div className="absolute left-1/2 top-0 h-28 w-72 -translate-x-1/2 rounded-full bg-amber-300/10 blur-3xl" />
              </div>
              <div className="relative mb-3 flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-200/70">Elite Podium</p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full border border-[#2b4a75] bg-[#0e2242] text-cyan-100 hover:bg-[#16325b]"
                    onClick={() => setPodiumOffset((prev) => (prev - 1 + podium.length) % podium.length)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full border border-[#2b4a75] bg-[#0e2242] text-cyan-100 hover:bg-[#16325b]"
                    onClick={() => setPodiumOffset((prev) => (prev + 1) % podium.length)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3 md:items-end">
                {rotatedPodium.map((item, idx) => {
                  const center = idx === 1
                  const badgeTone =
                    item.rank === 1
                      ? {
                          wingOuter: "from-[#ffd73f] to-[#e99a10] border-[#ffdd63]",
                          wingInner: "from-[#ffe05b] to-[#f6ae12] border-[#ffd66a]",
                          coreOuter: "from-[#ffcf38] via-[#f3a018] to-[#da790f] border-[#ffd86e]",
                          coreInner: "from-[#ffd84a] to-[#ea9916] border-[#ffcd55]",
                          label: "text-[#f2a120]",
                          icon: "text-[#8f4e00]",
                          title: "GOLD",
                        }
                      : item.rank === 2
                      ? {
                          wingOuter: "from-[#cfd5e8] to-[#8893b8] border-[#d9def0]",
                          wingInner: "from-[#e5e9f7] to-[#9aa5ca] border-[#e9edfb]",
                          coreOuter: "from-[#d7dced] via-[#a6b0cf] to-[#7e87a8] border-[#dde3f6]",
                          coreInner: "from-[#eaedf8] to-[#a6afcf] border-[#f0f3ff]",
                          label: "text-[#98a2b9]",
                          icon: "text-[#616b88]",
                          title: "SILVER",
                        }
                      : {
                          wingOuter: "from-[#be5f2e] to-[#6b2f13] border-[#d0885e]",
                          wingInner: "from-[#d57b4b] to-[#8a3c1a] border-[#df9066]",
                          coreOuter: "from-[#c76637] via-[#9a4824] to-[#6e3218] border-[#d88f68]",
                          coreInner: "from-[#d98357] to-[#9e4f2a] border-[#e5a07b]",
                          label: "text-[#d07f5e]",
                          icon: "text-[#5c240f]",
                          title: "BRONZE",
                        }
                  return (
                    <div
                      key={`${item.rank}-${idx}`}
                      className={cn(
                        "group relative min-h-[300px] overflow-hidden rounded-2xl border px-4 pb-6 pt-5 text-center transition-all duration-500",
                        "bg-[linear-gradient(180deg,rgba(33,77,138,0.24),rgba(11,25,47,0.96))]",
                        center ? "border-cyan-300/70 md:scale-105 shadow-[0_0_36px_rgba(34,211,238,0.18)]" : "border-[#29466c]"
                      )}
                    >
                      <div className="absolute bottom-8 left-1/2 h-[106px] w-[88%] -translate-x-1/2 rounded-t-xl border border-[#2f4c70] bg-[linear-gradient(180deg,rgba(24,52,92,0.7),rgba(10,23,44,0.95))]">
                        <div className="flex h-full flex-col items-center justify-start px-3 pt-5">
                          <p className="text-sm font-semibold text-slate-100">{item.name}</p>
                          <div className="mt-3 rounded-md border border-[#345a87] bg-[linear-gradient(180deg,rgba(19,42,75,0.98),rgba(9,24,46,0.98))] px-2 py-1 text-[12px] font-semibold text-amber-200 shadow-[0_8px_22px_rgba(4,10,24,0.55)]">
                            <span className="inline-flex items-center gap-1">
                              <Coins className="h-3.5 w-3.5 text-amber-300" />
                              {item.rank === 1 ? "10k season reward" : item.rank === 2 ? "5k season reward" : "2.5k season reward"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="relative z-10">
                        <div className="mt-0 flex items-center justify-center">
                          <div className={cn("relative h-[168px] w-[276px]", center && "scale-105")}>
                            <span className={cn("absolute left-[28px] top-[45px] h-[44px] w-[100px] -skew-x-[34deg] border bg-gradient-to-b", badgeTone.wingOuter)} />
                            <span className={cn("absolute left-[50px] top-[66px] h-[28px] w-[68px] -skew-x-[20deg] border bg-gradient-to-b", badgeTone.wingInner)} />
                            <span className={cn("absolute left-[22px] top-[87px] h-[24px] w-[86px] -skew-x-[14deg] border bg-gradient-to-b", badgeTone.wingOuter)} />
                            <span className={cn("absolute right-[28px] top-[45px] h-[44px] w-[100px] skew-x-[34deg] border bg-gradient-to-b", badgeTone.wingOuter)} />
                            <span className={cn("absolute right-[50px] top-[66px] h-[28px] w-[68px] skew-x-[20deg] border bg-gradient-to-b", badgeTone.wingInner)} />
                            <span className={cn("absolute right-[22px] top-[87px] h-[24px] w-[86px] skew-x-[14deg] border bg-gradient-to-b", badgeTone.wingOuter)} />
                            <span className={cn("absolute left-1/2 top-[31px] h-[94px] w-[112px] -translate-x-1/2 border bg-gradient-to-b shadow-[0_9px_22px_rgba(4,10,24,0.5)]", badgeTone.coreOuter)} style={{ clipPath: "polygon(50% 0,87% 16%,92% 45%,73% 84%,50% 100%,27% 84%,8% 45%,13% 16%)" }} />
                            <span className={cn("absolute left-1/2 top-[44px] h-[62px] w-[78px] -translate-x-1/2 border bg-gradient-to-b", badgeTone.coreInner)} style={{ clipPath: "polygon(50% 0,87% 16%,92% 45%,73% 84%,50% 100%,27% 84%,8% 45%,13% 16%)" }} />
                            <span className={cn("absolute left-1/2 top-[114px] h-[28px] w-[68px] -translate-x-1/2 border bg-gradient-to-b", badgeTone.coreOuter)} style={{ clipPath: "polygon(50% 100%,100% 36%,76% 0,24% 0,0 36%)" }} />
                            <Avatar className="absolute left-1/2 top-[78px] h-16 w-16 -translate-x-1/2 -translate-y-1/2">
                              <AvatarImage src={podiumAvatars[item.rank]} alt={item.name} />
                              <AvatarFallback className="bg-[#1a3358] font-semibold text-cyan-100">
                                {item.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="absolute left-1/2 top-[106px] inline-flex h-6 min-w-6 -translate-x-1/2 items-center justify-center rounded-full border border-[#3d6799] bg-[#10294e] px-1 text-[10px] font-semibold text-cyan-100">
                              {item.rank}
                            </span>
                          </div>
                        </div>
                        <div className="mt-0 h-0" />
                      </div>
                    </div>
                  )
                })}
              </div>
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
              </>
            )}
            {leaderboardView === "ib" && (
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-2xl border border-[#244066] bg-[linear-gradient(180deg,rgba(12,28,54,0.95),rgba(7,16,34,1))] p-4 sm:p-5">
                  <div className="grid gap-4 md:grid-cols-3 md:items-end">
                    {ibPodium.map((entry, idx) => {
                      const center = idx === 1
                      const avatarByRank: Record<number, string> = {
                        1: podiumAvatars[1],
                        2: podiumAvatars[2],
                        3: podiumAvatars[3],
                      }
                      return (
                        <div
                          key={`ib-${entry.rank}`}
                          className={cn(
                            "group relative overflow-hidden rounded-2xl border p-4 text-center transition-all duration-500",
                            center ? "border-cyan-300/70 bg-[#10274a] md:scale-105 shadow-[0_0_36px_rgba(34,211,238,0.18)]" : "border-[#29466c] bg-[#0d203c]"
                          )}
                        >
                          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.2),transparent_58%)]" />
                          <div className="relative z-10 mx-auto mb-2 flex w-fit flex-col items-center">
                            <div className={cn(
                              "relative flex items-center justify-center rounded-full border border-cyan-300/45 bg-[#0d2140] shadow-[0_0_0_6px_rgba(34,211,238,0.08)]",
                              center ? "h-[76px] w-[76px]" : "h-[68px] w-[68px]"
                            )}>
                              <Avatar className={cn(center ? "h-16 w-16" : "h-14 w-14")}>
                                <AvatarImage src={avatarByRank[entry.rank]} alt={entry.name} />
                                <AvatarFallback className="bg-[#1a3358] font-semibold text-cyan-100">
                                  {entry.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="absolute -bottom-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-[#3d6799] bg-[#10294e] px-1 text-[10px] font-semibold text-cyan-100">
                                {entry.rank}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-slate-100">{entry.name}</p>
                          <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-cyan-300/55 bg-[linear-gradient(180deg,rgba(22,58,104,0.95),rgba(13,37,72,0.95))] px-2.5 py-1 text-[10px] font-semibold text-cyan-100 shadow-[0_6px_16px_rgba(3,12,30,0.45)]">
                            <Coins className="h-3.5 w-3.5 text-amber-300" />
                            Top IB Winner
                          </div>
                          <p className="mt-2 text-lg font-bold text-emerald-400">{entry.ibFees}</p>
                          <p className="text-xs text-slate-300/80">{entry.referrals} referrals</p>
                          <p className="text-xs text-slate-400">{entry.lotVolume}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="rounded-xl border border-[#1e3555] bg-[#050b19] p-3">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-100">IB Top Teams</p>
                    <Badge className="bg-[#0f203e] text-cyan-200 border border-[#274872]">Trader of the Month</Badge>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[#1b2f4b] hover:bg-transparent">
                          <TableHead className="text-slate-300/70">Rank</TableHead>
                          <TableHead className="text-slate-300/70">IB Team</TableHead>
                        <TableHead className="text-slate-300/70">ROI / Referrals</TableHead>
                          <TableHead className="text-slate-300/70">Lot Volume</TableHead>
                          <TableHead className="text-right text-slate-300/70">IB Fees</TableHead>
                          <TableHead className="text-right text-slate-300/70">Month</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ibLeaderboard.map((entry) => (
                          <TableRow key={entry.rank} className="border-[#1b2f4b] hover:bg-[#0d1d38]">
                            <TableCell className="font-semibold text-slate-100">#{entry.rank}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarImage src={entry.rank <= 3 ? podiumAvatars[entry.rank === 1 ? 1 : entry.rank === 2 ? 2 : 3] : undefined} alt={entry.name} />
                                  <AvatarFallback className="bg-[#132948] text-[10px] text-cyan-100">IB</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-slate-100">{entry.name}</p>
                                  <p className="text-xs text-slate-300/60">@ib-team-{entry.rank}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-emerald-400 font-medium">+{entry.referrals}%</TableCell>
                            <TableCell className="text-slate-300">{entry.lotVolume}</TableCell>
                            <TableCell className="text-right font-semibold text-emerald-400">{entry.ibFees}</TableCell>
                            <TableCell className="text-right text-slate-300">{entry.month}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          </Card>

          <TabsContent value="active" className="order-1 space-y-4">
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

          <TabsContent value="upcoming" className="order-1 space-y-4">
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

          <TabsContent value="past" className="order-1">
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
