"use client"

import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  ArrowLeftRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  Sparkles,
  ShieldCheck,
  Clock3,
  Landmark,
  QrCode,
  CreditCard,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const walletActivity = [
  { id: "WAL-901", type: "Deposit", method: "UPI", amount: "+$500.00", status: "Completed", date: "Mar 17, 2026 08:12" },
  { id: "WAL-900", type: "Transfer", method: "Wallet -> MT5-12345", amount: "-$250.00", status: "Completed", date: "Mar 16, 2026 18:45" },
  { id: "WAL-899", type: "Withdrawal", method: "Bank Transfer", amount: "-$100.00", status: "Pending", date: "Mar 16, 2026 11:07" },
]

export default function WalletPage() {
  const router = useRouter()

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wallet Center</h1>
          <p className="text-muted-foreground">A modern hub for wallet funding, withdrawals, and account transfers.</p>
        </div>

        <Card className="relative border-border bg-card overflow-hidden p-2 gap-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent pointer-events-none" />
          <CardHeader className="relative">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Main Wallet (USD)
                </CardTitle>
                <CardDescription>Primary balance used for deposits, withdrawals, and internal transfers</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-chart-1/20 text-chart-1">Active</Badge>
                <Badge variant="secondary" className="gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Protected
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground mb-2">Available Balance</p>
              <p className="text-4xl font-bold text-foreground">$15,800.00</p>
              <p className="text-sm text-chart-1 mt-1">+$1,240.00 this week</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Button className="gap-2" onClick={() => router.push("/funds?tab=deposit&to=wallet-usd")}>
                <ArrowDownToLine className="h-4 w-4" />
                Deposit to Wallet
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => router.push("/funds?tab=withdraw&from=wallet-usd")}>
                <ArrowUpFromLine className="h-4 w-4" />
                Withdraw from Wallet
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => router.push("/funds?tab=transfer&from=wallet-usd")}>
                <ArrowLeftRight className="h-4 w-4" />
                Transfer to Account
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-secondary/30 p-3">
                <p className="text-xs text-muted-foreground">Funding Methods</p>
                <div className="mt-2 flex gap-2 text-muted-foreground">
                  <Landmark className="h-4 w-4" />
                  <QrCode className="h-4 w-4" />
                  <CreditCard className="h-4 w-4" />
                </div>
              </div>
              <div className="rounded-lg border border-border bg-secondary/30 p-3">
                <p className="text-xs text-muted-foreground">Pending Settlements</p>
                <p className="mt-1 font-semibold text-foreground">$100.00</p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/30 p-3">
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="mt-1 flex items-center gap-1 font-medium text-foreground">
                  <Clock3 className="h-3.5 w-3.5 text-muted-foreground" />
                  Just now
                </p>
                </div>
              </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Wallet Activity
              </CardTitle>
              <CardDescription>Recent wallet transactions and transfer actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {walletActivity.map((item) => (
                <div key={item.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{item.type}</p>
                      <p className="text-xs text-muted-foreground">{item.method} • {item.id}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn("font-semibold", item.amount.startsWith("+") ? "text-chart-1" : "text-foreground")}>{item.amount}</p>
                      <p className="text-xs text-muted-foreground">{item.status}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{item.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Quick Wallet Actions</CardTitle>
              <CardDescription>Jump directly to your most-used flows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => router.push("/funds?tab=deposit&to=wallet-usd")}>
                <ArrowDownToLine className="h-4 w-4" />
                Add Funds (Bank / UPI / QR)
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => router.push("/funds?tab=withdraw&from=wallet-usd")}>
                <ArrowUpFromLine className="h-4 w-4" />
                Request Withdrawal
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => router.push("/funds?tab=transfer&from=wallet-usd")}>
                <ArrowLeftRight className="h-4 w-4" />
                Move to Trading Account
              </Button>
              <div className="rounded-lg border border-border bg-secondary/30 p-3 text-sm text-muted-foreground">
                Transfers from wallet to trading accounts are instant and fee-free.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}
