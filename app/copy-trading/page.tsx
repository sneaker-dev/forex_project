"use client"

import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, TrendingUp, Shield, Copy } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

type Provider = {
  id: string
  name: string
  avatar?: string
  strategy: string
  winRate: number
  monthlyReturn: number
  drawdown: number
  followers: number
}

const providers: Provider[] = [
  { id: "p1", name: "Hawk FX", avatar: "/stock-broker-3d-icon-png-download-5625740.webp", strategy: "XAU Scalping", winRate: 74, monthlyReturn: 18.2, drawdown: 6.1, followers: 1820 },
  { id: "p2", name: "ByteX Quant", avatar: "/trader-3d-icon-png-download-4403852.webp", strategy: "Intraday Momentum", winRate: 71, monthlyReturn: 15.6, drawdown: 5.4, followers: 1540 },
  { id: "p3", name: "Voyager Macro", avatar: "/crypto-trader-3d-icon-png-download-12328244.webp", strategy: "Swing Macro", winRate: 68, monthlyReturn: 12.9, drawdown: 4.8, followers: 1288 },
]

type ActiveCopy = {
  providerId: string
  allocation: number
  riskMode: string
  multiplier: number
  active: boolean
}

export default function CopyTradingPage() {
  const [selectedProviderId, setSelectedProviderId] = useState(providers[0].id)
  const [allocation, setAllocation] = useState("1000")
  const [riskMode, setRiskMode] = useState("balanced")
  const [multiplier, setMultiplier] = useState("1")
  const [copyOpenTrades, setCopyOpenTrades] = useState(true)
  const [activeCopies, setActiveCopies] = useState<ActiveCopy[]>([])

  const selectedProvider = useMemo(
    () => providers.find((p) => p.id === selectedProviderId) ?? providers[0],
    [selectedProviderId]
  )

  const startCopy = () => {
    const amount = Number(allocation)
    const multi = Number(multiplier)
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a valid allocation amount")
      return
    }
    if (!Number.isFinite(multi) || multi <= 0) {
      toast.error("Enter a valid lot multiplier")
      return
    }
    setActiveCopies((prev) => {
      const existing = prev.find((c) => c.providerId === selectedProviderId)
      if (existing) {
        return prev.map((c) =>
          c.providerId === selectedProviderId
            ? { ...c, allocation: amount, riskMode, multiplier: multi, active: true }
            : c
        )
      }
      return [...prev, { providerId: selectedProviderId, allocation: amount, riskMode, multiplier: multi, active: true }]
    })
    toast.success(`Copy started for ${selectedProvider.name}`)
  }

  const stopCopy = (providerId: string) => {
    setActiveCopies((prev) => prev.map((c) => (c.providerId === providerId ? { ...c, active: false } : c)))
    const p = providers.find((x) => x.id === providerId)
    toast.success(`Copy stopped for ${p?.name ?? "provider"}`)
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Copy Trading</h1>
          <p className="text-muted-foreground">Follow top-performing traders and mirror their strategies with your own risk settings.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Strategy Providers</p>
              <p className="text-2xl font-bold">{providers.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Active Copies</p>
              <p className="text-2xl font-bold">{activeCopies.filter((c) => c.active).length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Average Win Rate</p>
              <p className="text-2xl font-bold text-emerald-500">
                {(providers.reduce((acc, p) => acc + p.winRate, 0) / providers.length).toFixed(1)}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Risk Protection</p>
              <div className="mt-1 flex items-center gap-2 text-sm font-medium">
                <Shield className="h-4 w-4 text-primary" />
                Enabled
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Top Providers</CardTitle>
              <CardDescription>Select a provider to start copy trading.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProviderId(provider.id)}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    selectedProviderId === provider.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={provider.avatar} alt={provider.name} />
                        <AvatarFallback>{provider.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{provider.name}</p>
                        <p className="text-xs text-muted-foreground">{provider.strategy}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{provider.followers.toLocaleString()} followers</Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div><span className="text-muted-foreground">Win:</span> <span className="font-medium">{provider.winRate}%</span></div>
                    <div><span className="text-muted-foreground">Return:</span> <span className="font-medium text-emerald-500">+{provider.monthlyReturn}%</span></div>
                    <div><span className="text-muted-foreground">DD:</span> <span className="font-medium">{provider.drawdown}%</span></div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Copy className="h-5 w-5" />Copy Settings</CardTitle>
              <CardDescription>Configure how trades are mirrored to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Selected Provider</Label>
                <Select value={selectedProviderId} onValueChange={setSelectedProviderId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>{provider.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Allocation (USD)</Label>
                <Input type="number" value={allocation} onChange={(e) => setAllocation(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Risk Mode</Label>
                <Select value={riskMode} onValueChange={setRiskMode}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Lot Multiplier</Label>
                <Input type="number" step="0.1" value={multiplier} onChange={(e) => setMultiplier(e.target.value)} />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="text-sm font-medium">Copy existing open trades</p>
                  <p className="text-xs text-muted-foreground">Enable to mirror currently open provider positions.</p>
                </div>
                <Switch checked={copyOpenTrades} onCheckedChange={setCopyOpenTrades} />
              </div>
              <Button className="w-full" onClick={startCopy}>Start Copy Trading</Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Copy Relations</CardTitle>
            <CardDescription>Manage running copy-trading links.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeCopies.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active copy relations yet.</p>
            ) : (
              activeCopies.map((copy) => {
                const provider = providers.find((p) => p.id === copy.providerId)
                return (
                  <div key={copy.providerId} className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-3">
                    <div>
                      <p className="font-medium">{provider?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Allocation: ${copy.allocation.toFixed(2)} · Risk: {copy.riskMode} · Multiplier: {copy.multiplier}x
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={copy.active ? "default" : "secondary"}>{copy.active ? "Active" : "Stopped"}</Badge>
                      {copy.active && (
                        <Button variant="destructive" size="sm" onClick={() => stopCopy(copy.providerId)}>
                          Stop
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
