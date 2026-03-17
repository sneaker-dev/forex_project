"use client"

import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Copy,
  Check,
  RotateCw,
  Users,
  DollarSign,
  TrendingUp,
  Share2,
  Gift,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const generateReferralCode = () => `FOREX${Math.random().toString(36).slice(2, 8).toUpperCase()}`

const referrals = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    status: "active",
    joinDate: "Mar 10, 2026",
    deposits: "$5,250.00",
    commission: "$157.50",
    trades: 42,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    status: "active",
    joinDate: "Mar 05, 2026",
    deposits: "$12,000.00",
    commission: "$360.00",
    trades: 128,
  },
  {
    id: "3",
    name: "Carol Williams",
    email: "carol@example.com",
    status: "pending",
    joinDate: "Mar 14, 2026",
    deposits: "$0.00",
    commission: "$0.00",
    trades: 0,
  },
  {
    id: "4",
    name: "David Brown",
    email: "david@example.com",
    status: "active",
    joinDate: "Feb 28, 2026",
    deposits: "$8,500.00",
    commission: "$255.00",
    trades: 89,
  },
  {
    id: "5",
    name: "Emma Davis",
    email: "emma@example.com",
    status: "inactive",
    joinDate: "Feb 15, 2026",
    deposits: "$2,000.00",
    commission: "$60.00",
    trades: 12,
  },
]

const commissionHistory = [
  { month: "Oct", amount: 420 },
  { month: "Nov", amount: 580 },
  { month: "Dec", amount: 890 },
  { month: "Jan", amount: 720 },
  { month: "Feb", amount: 980 },
  { month: "Mar", amount: 832 },
]

const tierLevels = [
  { name: "Bronze", min: 0, max: 5, commission: "2%", benefits: "Basic commission" },
  { name: "Silver", min: 5, max: 15, commission: "2.5%", benefits: "+ Monthly bonus" },
  { name: "Gold", min: 15, max: 30, commission: "3%", benefits: "+ Priority support" },
  { name: "Platinum", min: 30, max: Infinity, commission: "3.5%", benefits: "+ Exclusive rewards" },
]

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false)
  const [referralCode, setReferralCode] = useState(generateReferralCode())
  const [teamSearch, setTeamSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "pending" | "inactive">("all")
  const referralLink = `https://forexpro.com/ref/${referralCode}`

  const filteredReferrals = useMemo(() => {
    return referrals.filter((referral) => {
      const matchesStatus = statusFilter === "all" ? true : referral.status === statusFilter
      const term = teamSearch.trim().toLowerCase()
      const matchesSearch =
        term.length === 0 ||
        referral.name.toLowerCase().includes(term) ||
        referral.email.toLowerCase().includes(term)
      return matchesStatus && matchesSearch
    })
  }, [statusFilter, teamSearch])

  const activeReferrals = referrals.filter((r) => r.status === "active").length
  const currentTier = tierLevels.find((t) => activeReferrals >= t.min && activeReferrals < t.max) ?? tierLevels[0]
  const nextTier = tierLevels[tierLevels.indexOf(currentTier) + 1]
  const progressToNext = nextTier
    ? ((activeReferrals - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success('Link Copied!', { description: 'Referral link copied to clipboard' })
    setTimeout(() => setCopied(false), 2000)
  }

  const regenerateLink = () => {
    const nextCode = generateReferralCode()
    setReferralCode(nextCode)
    setCopied(false)
    toast.success("New Referral Link Generated")
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Referral Program</h1>
          <p className="text-muted-foreground">Invite friends and earn commissions on their trading activity.</p>
        </div>

        {/* Stats overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
                  <p className="text-2xl font-bold text-foreground">{referrals.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Referrals</p>
                  <p className="text-2xl font-bold text-chart-1">{activeReferrals}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-chart-1/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Commission</p>
                  <p className="text-2xl font-bold text-foreground">$832.50</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary/50" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Payout</p>
                  <p className="text-2xl font-bold text-chart-4">$415.50</p>
                </div>
                <Gift className="h-8 w-8 text-chart-4/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link and Tier */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Referral Link */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Your Referral Link
              </CardTitle>
              <CardDescription>Share this link with friends to start earning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={referralLink} readOnly className="font-mono text-sm" />
                <Button onClick={copyLink} className="shrink-0 gap-2">
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={regenerateLink} className="shrink-0 gap-2">
                  <RotateCw className="h-4 w-4" />
                  New
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => { window.open(`https://twitter.com/intent/tweet?text=Join me on ForexPro!&url=${encodeURIComponent(referralLink)}`, '_blank', 'noopener,noreferrer'); toast.success('Opening Twitter') }}>Share on Twitter</Button>
                <Button variant="outline" className="flex-1" onClick={() => { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank', 'noopener,noreferrer'); toast.success('Opening Facebook') }}>Share on Facebook</Button>
              </div>
            </CardContent>
          </Card>

          {/* Tier Progress */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Your IB Tier</CardTitle>
              <CardDescription>Refer more clients to unlock higher commissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-chart-4/20 text-chart-4 text-lg px-3 py-1">
                    {currentTier?.name}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Current commission: {currentTier?.commission}
                  </p>
                </div>
                {nextTier && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">Next: {nextTier.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {nextTier.min - activeReferrals} more referrals
                    </p>
                  </div>
                )}
              </div>
              {nextTier && (
                <div className="space-y-2">
                  <Progress value={progressToNext} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{activeReferrals} referrals</span>
                    <span>{nextTier.min} referrals</span>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {tierLevels.map((tier) => (
                  <div
                    key={tier.name}
                    className={cn(
                      "text-center p-2 rounded-lg",
                      currentTier?.name === tier.name
                        ? "bg-primary/10 border border-primary"
                        : "bg-secondary"
                    )}
                  >
                    <p className="text-xs font-medium text-foreground">{tier.name}</p>
                    <p className="text-xs text-muted-foreground">{tier.commission}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commission Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Commission History</CardTitle>
            <CardDescription>Your monthly commission earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={commissionHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="month"
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
                            <p className="text-sm font-medium text-foreground">{payload[0].payload.month}</p>
                            <p className="text-lg font-bold text-primary">
                              ${payload[0].value?.toLocaleString()}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Referrals Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Your Team</CardTitle>
            <CardDescription>Overview of all your referred clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder="Search team by name or email..."
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
              />
              <div className="flex gap-2">
                {(["all", "active", "pending", "inactive"] as const).map((value) => (
                  <Button
                    key={value}
                    variant={statusFilter === value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(value)}
                    className="capitalize"
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Client</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Joined</TableHead>
                    <TableHead className="text-muted-foreground">Deposits</TableHead>
                    <TableHead className="text-muted-foreground">Trades</TableHead>
                    <TableHead className="text-right text-muted-foreground">Commission</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReferrals.map((referral) => (
                    <TableRow key={referral.id} className="border-border">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-secondary text-foreground text-xs">
                              {referral.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{referral.name}</p>
                            <p className="text-sm text-muted-foreground">{referral.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            referral.status === "active"
                              ? "bg-chart-1/20 text-chart-1"
                              : referral.status === "pending"
                              ? "bg-chart-4/20 text-chart-4"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {referral.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{referral.joinDate}</TableCell>
                      <TableCell className="text-muted-foreground">{referral.deposits}</TableCell>
                      <TableCell className="text-muted-foreground">{referral.trades}</TableCell>
                      <TableCell className="text-right font-medium text-chart-1">
                        {referral.commission}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
