"use client"

import { useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAdmin } from "@/components/admin/admin-provider"
import { ArrowLeft, Copy } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { AdminPageHeader, adminSurface } from "@/components/admin/admin-ui"
import { cn } from "@/lib/utils"

export default function AdminUserDetailPage() {
  const params = useParams()
  const id = String(params.id ?? "")
  const { state } = useAdmin()
  const user = useMemo(() => state.users.find((u) => u.id === id), [state.users, id])

  const [copyEnabled, setCopyEnabled] = useState(true)
  const [masterId, setMasterId] = useState("M-001")
  const [perfFee, setPerfFee] = useState("20")

  const userLinks = useMemo(() => state.copyLinks.filter((l) => l.followerId === id), [state.copyLinks, id])

  if (!user) {
    return (
      <div className={cn(adminSurface, "p-8 text-white")}>
        <h2 className="text-lg font-semibold">Client not found</h2>
        <p className="mt-1 text-sm text-white/50">The identifier does not match any profile in the registry.</p>
        <Button asChild className="mt-6 bg-red-600 hover:bg-red-500">
          <Link href="/admin/users">Back to registry</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={user.name}
        description={user.email}
        actions={
          <>
            <Button asChild variant="ghost" className="text-white hover:bg-white/10">
              <Link href="/admin/users" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Registry
              </Link>
            </Button>
            <Badge
              className={cn(
                "border px-3 py-1",
                user.status === "Active" && "border-emerald-500/40 bg-emerald-500/15 text-emerald-200",
                user.status === "Suspended" && "border-red-500/40 bg-red-500/15 text-red-200",
                user.status === "Pending" && "border-amber-500/40 bg-amber-500/15 text-amber-100",
                user.status === "Closed" && "border-white/20 bg-white/10 text-white/70"
              )}
            >
              {user.status}
            </Badge>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={cn(adminSurface, "p-4")}>
          <p className="text-xs font-medium uppercase tracking-wider text-white/45">Equity (USD)</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
            ${user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className={cn(adminSurface, "p-4")}>
          <p className="text-xs font-medium uppercase tracking-wider text-white/45">Tier</p>
          <p className="mt-1 text-2xl font-semibold text-white">{user.tier}</p>
        </div>
        <div className={cn(adminSurface, "p-4")}>
          <p className="text-xs font-medium uppercase tracking-wider text-white/45">Last activity</p>
          <p className="mt-1 text-lg font-medium text-white/90">{user.lastActive}</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 border border-white/[0.08] bg-black/50 p-1">
          {(
            [
              "profile",
              "banks",
              "documents",
              "trading",
              "wallets",
              "transactions",
              "logs",
              "security",
              "affiliate",
              "copy",
            ] as const
          ).map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              {t === "profile" && "Profile"}
              {t === "banks" && "Bank Accounts"}
              {t === "documents" && "Documents"}
              {t === "trading" && "Trading Accounts"}
              {t === "wallets" && "Wallets"}
              {t === "transactions" && "Transactions"}
              {t === "logs" && "Logs"}
              {t === "security" && "Security"}
              {t === "affiliate" && "Affiliate"}
              {t === "copy" && "Copy Trading"}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile">
          <Card className={cn(adminSurface, "border-0 text-white shadow-none")}>
            <CardHeader>
              <CardTitle className="text-white">Identity &amp; contact</CardTitle>
              <CardDescription className="text-white/50">Regulatory profile — align with KYC workspace</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-white/70">Title</Label>
                <Select defaultValue="mr">
                  <SelectTrigger className="border-white/10 bg-black/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mr">Mr</SelectItem>
                    <SelectItem value="mrs">Mrs</SelectItem>
                    <SelectItem value="ms">Ms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Gender</Label>
                <Select defaultValue="male">
                  <SelectTrigger className="border-white/10 bg-black/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">First name</Label>
                <Input defaultValue={user.name.split(" ")[0] ?? user.name} className="border-white/10 bg-black/50 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Last name</Label>
                <Input className="border-white/10 bg-black/50 text-white" placeholder="Last name" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Mobile</Label>
                <Input className="border-white/10 bg-black/50 text-white" placeholder="—" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Phone</Label>
                <Input defaultValue="—" className="border-white/10 bg-black/50 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Country</Label>
                <Input defaultValue={user.country} className="border-white/10 bg-black/50 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Email</Label>
                <Input defaultValue={user.email} className="border-white/10 bg-black/50 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Nationality</Label>
                <Input defaultValue={user.country} className="border-white/10 bg-black/50 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">US Citizen</Label>
                <Select defaultValue="no">
                  <SelectTrigger className="border-white/10 bg-black/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">NO</SelectItem>
                    <SelectItem value="yes">YES</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 lg:col-span-2">
                <Label className="text-white/70">Address</Label>
                <Input className="border-white/10 bg-black/50 text-white" placeholder="Street, area" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">City</Label>
                <Input className="border-white/10 bg-black/50 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Postal code</Label>
                <Input className="border-white/10 bg-black/50 text-white" />
              </div>
              <div className="lg:col-span-2 flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" className="border-white/10 bg-white/10 text-white">
                  Discard
                </Button>
                <Button type="button" className="bg-red-600 hover:bg-red-500" onClick={() => toast.success("Profile saved")}>
                  Save changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {(["banks", "documents", "trading", "wallets", "transactions", "logs", "security", "affiliate"] as const).map(
          (tab) => (
            <TabsContent key={tab} value={tab}>
              <Card className={cn(adminSurface, "border-0 text-white shadow-none")}>
                <CardHeader>
                  <CardTitle className="capitalize text-white">{tab.replace("-", " ")}</CardTitle>
                  <CardDescription className="text-white/50">Operational records for this client</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-white/65">
                  Connect your ledger and document store to render statements, statements of account, and audit exports here.
                </CardContent>
              </Card>
            </TabsContent>
          )
        )}

        <TabsContent value="copy">
          <Card className={cn(adminSurface, "border-0 text-white shadow-none")}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Copy className="h-5 w-5 text-red-400" />
                Copy trading
              </CardTitle>
              <CardDescription className="text-white/50">
                Master linkage, fee policy, and follower safeguards for this client.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 max-w-xl">
              <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-black/40 px-4 py-3">
                <div>
                  <p className="font-medium text-white">Copy trading enabled</p>
                  <p className="text-xs text-white/45">Mirror approved master accounts.</p>
                </div>
                <Switch checked={copyEnabled} onCheckedChange={setCopyEnabled} />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Linked master</Label>
                <Select value={masterId} onValueChange={setMasterId}>
                  <SelectTrigger className="border-white/10 bg-black/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {state.copyMasters.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name} — {m.strategy}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Performance fee (%)</Label>
                <Input
                  value={perfFee}
                  onChange={(e) => setPerfFee(e.target.value)}
                  className="border-white/10 bg-black/50 text-white"
                />
              </div>
              {userLinks.length > 0 && (
                <div className="rounded-xl border border-white/[0.08] bg-black/30 p-3 text-sm">
                  <p className="text-xs font-medium uppercase tracking-wider text-white/45">Active links</p>
                  <ul className="mt-2 space-y-2">
                    {userLinks.map((l) => (
                      <li key={l.id} className="flex justify-between gap-2 text-white/80">
                        <span>{l.masterName}</span>
                        <span className="font-mono text-xs text-white/50">{l.id}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <Button type="button" className="bg-red-600 hover:bg-red-500" onClick={() => toast.success("Copy policy saved")}>
                  Save policy
                </Button>
                <Button type="button" variant="secondary" className="border-white/10 bg-white/10 text-white">
                  Unlink master
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
