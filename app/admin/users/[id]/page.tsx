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
import { adminUsers } from "@/lib/admin-mock-data"
import { ArrowLeft, Copy } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export default function AdminUserDetailPage() {
  const params = useParams()
  const id = String(params.id ?? "")
  const user = useMemo(() => adminUsers.find((u) => u.id === id), [id])

  const [copyEnabled, setCopyEnabled] = useState(true)
  const [masterId, setMasterId] = useState("hawk-fx")
  const [perfFee, setPerfFee] = useState("20")

  if (!user) {
    return (
      <Card className="border-white/10 bg-[#111]/90 text-white">
        <CardHeader>
          <CardTitle>User not found</CardTitle>
          <CardDescription className="text-white/55">Invalid client id.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="secondary" className="border-white/10 bg-white/10 text-white">
            <Link href="/admin/users">Back to users</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
          <Link href="/admin/users" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Users
          </Link>
        </Button>
        <div className="h-4 w-px bg-white/15" />
        <div>
          <h2 className="text-lg font-semibold text-white">{user.name}</h2>
          <p className="text-sm text-white/50">{user.email}</p>
        </div>
        <Badge className="ml-auto border-emerald-500/30 bg-emerald-500/15 text-emerald-200">{user.status}</Badge>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 border border-white/10 bg-black/40 p-1">
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
          <Card className="border-white/10 bg-neutral-950 text-white">
            <CardHeader>
              <CardTitle className="text-white">Profile</CardTitle>
              <CardDescription className="text-white/50">KYC and contact details</CardDescription>
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
                <Label className="text-white/70">First Name</Label>
                <Input defaultValue={user.name.split(" ")[0] ?? user.name} className="border-white/10 bg-black/50 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Last Name</Label>
                <Input className="border-white/10 bg-black/50 text-white" placeholder="Last name" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Mobile</Label>
                <Input className="border-white/10 bg-black/50 text-white" placeholder="—" />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Phone</Label>
                <Input defaultValue="83137539250" className="border-white/10 bg-black/50 text-white" />
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
                <Label className="text-white/70">Date of Birth</Label>
                <Input type="text" className="border-white/10 bg-black/50 text-white" placeholder="dd - mm - yyyy" />
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
                <Label className="text-white/70">Postal Code</Label>
                <Input className="border-white/10 bg-black/50 text-white" />
              </div>
              <div className="lg:col-span-2 flex justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" className="border-white/10 bg-white/10 text-white">
                  Discard
                </Button>
                <Button type="button" className="bg-red-600 hover:bg-red-500" onClick={() => toast.success("Profile saved (demo)")}>
                  Save changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {(["banks", "documents", "trading", "wallets", "transactions", "logs", "security", "affiliate"] as const).map(
          (tab) => (
            <TabsContent key={tab} value={tab}>
              <Card className="border-white/10 bg-[#111]/90 text-white">
                <CardHeader>
                  <CardTitle className="capitalize text-white">{tab.replace("-", " ")}</CardTitle>
                  <CardDescription className="text-white/50">Admin tools for this section (demo)</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-white/65">
                  Connect your API to list records, approve actions, and audit changes.
                </CardContent>
              </Card>
            </TabsContent>
          )
        )}

        <TabsContent value="copy">
          <Card className="border-white/10 bg-[#111]/90 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Copy className="h-5 w-5 text-red-400" />
                Copy Trading (client)
              </CardTitle>
              <CardDescription className="text-white/50">
                Control whether this client may follow master strategies, performance fees, and risk caps.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 max-w-xl">
              <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-4 py-3">
                <div>
                  <p className="font-medium text-white">Copy trading enabled</p>
                  <p className="text-xs text-white/45">Mirror approved master accounts to this client.</p>
                </div>
                <Switch checked={copyEnabled} onCheckedChange={setCopyEnabled} />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Linked master provider</Label>
                <Select value={masterId} onValueChange={setMasterId}>
                  <SelectTrigger className="border-white/10 bg-black/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hawk-fx">Hawk FX — XAU Scalping</SelectItem>
                    <SelectItem value="bytex">ByteX Quant — Intraday</SelectItem>
                    <SelectItem value="voyager">Voyager Macro — Swing</SelectItem>
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
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  className="bg-red-600 hover:bg-red-500"
                  onClick={() => toast.success("Copy settings saved", { description: user.email })}
                >
                  Save copy settings
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="border-white/10 bg-white/10 text-white"
                  onClick={() => toast.message("Unlinked master (demo)")}
                >
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
