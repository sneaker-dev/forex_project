"use client"

import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Plus, Settings, ArrowUpDown, Eye, EyeOff, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const initialAccounts = [
  {
    id: "MT5-12345",
    name: "Main Trading Account",
    type: "Standard",
    balance: "$45,250.00",
    equity: "$48,120.50",
    leverage: "1:100",
    server: "ForexPro-Live",
    status: "active" as const,
    currency: "USD",
  },
  {
    id: "MT5-12346",
    name: "Scalping Account",
    type: "ECN",
    balance: "$28,750.00",
    equity: "$27,890.00",
    leverage: "1:200",
    server: "ForexPro-Live",
    status: "active" as const,
    currency: "USD",
  },
  {
    id: "MT5-12347",
    name: "Demo Practice",
    type: "Demo",
    balance: "$100,000.00",
    equity: "$102,450.00",
    leverage: "1:500",
    server: "ForexPro-Demo",
    status: "active" as const,
    currency: "USD",
  },
  {
    id: "MT5-12348",
    name: "Inactive Account",
    type: "Standard",
    balance: "$0.00",
    equity: "$0.00",
    leverage: "1:100",
    server: "ForexPro-Live",
    status: "inactive" as const,
    currency: "USD",
  },
]

const ACCOUNTS_STORAGE_KEY = "forexpro-accounts-state"

export default function AccountsPage() {
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [manageAccountId, setManageAccountId] = useState<string | null>(null)
  const [accountName, setAccountName] = useState("")
  const [accountType, setAccountType] = useState("standard")
  const [leverage, setLeverage] = useState("100")
  const [currency, setCurrency] = useState("usd")
  const [accounts, setAccounts] = useState(initialAccounts)
  const [newAccountRequested, setNewAccountRequested] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY)
    if (!stored) return
    try {
      const parsed = JSON.parse(stored) as typeof initialAccounts
      if (Array.isArray(parsed) && parsed.length) {
        setAccounts(parsed)
      }
    } catch {
      // ignore invalid local data
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts))
  }, [accounts])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const isNew = params.get("new") === "true"
    setNewAccountRequested(isNew)
    if (isNew) {
      setDialogOpen(true)
    }
  }, [])

  const totalBalance = useMemo(() => {
    const sum = accounts.reduce((acc, account) => {
      const numeric = Number(account.balance.replace(/[$,]/g, ""))
      return acc + (Number.isFinite(numeric) ? numeric : 0)
    }, 0)
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(sum)
  }, [accounts])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Copied!', { description: `Account ID ${text} copied to clipboard` })
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCreateAccount = () => {
    if (!accountName.trim()) {
      toast.error("Account Name Required", { description: "Please enter an account name." })
      return
    }

    setIsCreating(true)
    setTimeout(() => {
      const nextId = `MT5-${12345 + accounts.length + 1}`
      const server = accountType === "demo" ? "ForexPro-Demo" : "ForexPro-Live"
      const nextType = accountType === "ecn" ? "ECN" : accountType === "demo" ? "Demo" : "Standard"
      const nextCurrency = currency.toUpperCase()

      setAccounts((prev) => [
        {
          id: nextId,
          name: accountName.trim(),
          type: nextType,
          balance: "$0.00",
          equity: "$0.00",
          leverage: `1:${leverage}`,
          server,
          status: "active" as const,
          currency: nextCurrency,
        },
        ...prev,
      ])

      setIsCreating(false)
      setDialogOpen(false)
      setAccountName("")
      setAccountType("standard")
      setLeverage("100")
      setCurrency("usd")
      if (newAccountRequested) {
        router.replace("/accounts")
      }
      toast.success('Account Created!', { description: 'Your new trading account is ready' })
    }, 1500)
  }

  const handleTransfer = (accountId: string) => {
    router.push(`/funds?tab=transfer&from=${accountId}`)
    toast.info('Transfer', { description: 'Opening transfer page...' })
  }

  const handleManage = (accountId: string) => {
    setManageAccountId(accountId)
  }

  const managedAccount = accounts.find((account) => account.id === manageAccountId)

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Trading Accounts</h1>
            <p className="text-muted-foreground">Manage your trading accounts and create new ones.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Account</DialogTitle>
                <DialogDescription>
                  Set up a new trading account. Choose your account type and preferences.
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-xl border border-border bg-secondary/40 p-4 space-y-3">
                <div>
                  <p className="font-semibold text-foreground">Starter</p>
                  <p className="text-sm text-muted-foreground">Perfect for beginners - start trading with just $50 and zero commission.</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Min Deposit</p>
                    <p className="font-semibold text-foreground">$50</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Leverage</p>
                    <p className="font-semibold text-foreground">1:2000</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Spread</p>
                    <p className="font-semibold text-foreground">0.18 pips</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Commission</p>
                    <p className="font-semibold text-foreground">None</p>
                  </div>
                </div>
              </div>
              <FieldGroup className="py-4">
                <Field>
                  <FieldLabel>Account Name</FieldLabel>
                  <Input placeholder="My Trading Account" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
                </Field>
                <Field>
                  <FieldLabel>Account Type</FieldLabel>
                  <Select value={accountType} onValueChange={setAccountType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="ecn">ECN</SelectItem>
                      <SelectItem value="demo">Demo</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Leverage</FieldLabel>
                  <Select value={leverage} onValueChange={setLeverage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leverage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">1:50</SelectItem>
                      <SelectItem value="100">1:100</SelectItem>
                      <SelectItem value="200">1:200</SelectItem>
                      <SelectItem value="500">1:500</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Currency</FieldLabel>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="eur">EUR</SelectItem>
                      <SelectItem value="gbp">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
              <DialogFooter>
                <Button type="button" onClick={handleCreateAccount} disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Account'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Account summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Total Accounts</p>
              <p className="text-3xl font-bold text-foreground">{accounts.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Active Accounts</p>
              <p className="text-3xl font-bold text-chart-1">
                {accounts.filter((a) => a.status === "active").length}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
              <p className="text-3xl font-bold text-foreground">{totalBalance}</p>
            </CardContent>
          </Card>
        </div>

        {/* Account cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {accounts.map((account) => (
            <Card key={account.id} className="bg-card border-border">
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {account.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-sm">{account.id}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(account.id, account.id)}
                    >
                      {copiedId === account.id ? (
                        <Check className="h-3 w-3 text-chart-1" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      account.type === "ECN"
                        ? "bg-chart-3/20 text-chart-3"
                        : account.type === "Demo"
                        ? "bg-chart-4/20 text-chart-4"
                        : "bg-primary/20 text-primary"
                    )}
                  >
                    {account.type}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn(
                      account.status === "active"
                        ? "bg-chart-1/20 text-chart-1"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {account.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Balance</p>
                    <p className="text-xl font-semibold text-foreground">{account.balance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Equity</p>
                    <p className="text-xl font-semibold text-foreground">{account.equity}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Leverage</p>
                    <p className="font-medium text-foreground">{account.leverage}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Server</p>
                    <p className="font-medium text-foreground">{account.server}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Currency</p>
                    <p className="font-medium text-foreground">{account.currency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        [account.id]: !prev[account.id],
                      }))
                    }
                  >
                    {showPassword[account.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    {showPassword[account.id] ? "Hide" : "Show"} Password
                  </Button>
                  {showPassword[account.id] && (
                    <span className="font-mono text-sm text-muted-foreground">********</span>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleTransfer(account.id)}>
                    <ArrowUpDown className="h-4 w-4" />
                    Transfer
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleManage(account.id)}>
                    <Settings className="h-4 w-4" />
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Dialog open={!!managedAccount} onOpenChange={(isOpen) => !isOpen && setManageAccountId(null)}>
          <DialogContent className="sm:max-w-[420px]">
            <DialogHeader>
              <DialogTitle>Manage Account</DialogTitle>
              <DialogDescription>{managedAccount?.name}</DialogDescription>
            </DialogHeader>
            {managedAccount && (
              <div className="space-y-3 py-2 text-sm">
                <p className="text-muted-foreground">ID: <span className="font-mono text-foreground">{managedAccount.id}</span></p>
                <p className="text-muted-foreground">Server: <span className="text-foreground">{managedAccount.server}</span></p>
                <p className="text-muted-foreground">Leverage: <span className="text-foreground">{managedAccount.leverage}</span></p>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  if (!managedAccount) return
                  setAccounts((prev) =>
                    prev.map((item) =>
                      item.id === managedAccount.id
                        ? { ...item, status: item.status === "active" ? "inactive" as const : "active" as const }
                        : item
                    )
                  )
                  toast.success("Account Status Updated")
                }}
              >
                Toggle Status
              </Button>
              <Button onClick={() => setManageAccountId(null)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardShell>
  )
}
