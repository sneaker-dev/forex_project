"use client"

import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  CreditCard,
  Building2,
  Bitcoin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

const initialTransactions = [
  {
    id: "TXN001",
    type: "Deposit",
    method: "Bank Transfer",
    amount: "+$5,000.00",
    status: "completed",
    date: "Mar 15, 2026 14:30",
    account: "MT5-12345",
  },
  {
    id: "TXN002",
    type: "Withdrawal",
    method: "Credit Card",
    amount: "-$2,500.00",
    status: "pending",
    date: "Mar 14, 2026 09:15",
    account: "MT5-12345",
  },
  {
    id: "TXN003",
    type: "Transfer",
    method: "Internal",
    amount: "$1,000.00",
    status: "completed",
    date: "Mar 13, 2026 16:45",
    account: "MT5-12346",
  },
  {
    id: "TXN004",
    type: "Deposit",
    method: "Crypto",
    amount: "+$3,200.00",
    status: "completed",
    date: "Mar 12, 2026 11:20",
    account: "MT5-12345",
  },
  {
    id: "TXN005",
    type: "Withdrawal",
    method: "Bank Transfer",
    amount: "-$1,000.00",
    status: "failed",
    date: "Mar 11, 2026 08:00",
    account: "MT5-12346",
  },
]

const FUNDS_TRANSACTIONS_STORAGE_KEY = "forexpro-funds-transactions"

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    class: "text-chart-1",
    badge: "bg-chart-1/20 text-chart-1",
  },
  pending: {
    icon: Clock,
    class: "text-chart-4",
    badge: "bg-chart-4/20 text-chart-4",
  },
  failed: {
    icon: XCircle,
    class: "text-chart-2",
    badge: "bg-chart-2/20 text-chart-2",
  },
}

const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard, fee: "2.5%", time: "Instant" },
  { id: "bank", name: "Bank Transfer", icon: Building2, fee: "Free", time: "1-3 days" },
  { id: "crypto", name: "Cryptocurrency", icon: Bitcoin, fee: "1%", time: "10-30 min" },
]

export default function FundsPage() {
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("deposit")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("bank")
  const [transferFromAccount, setTransferFromAccount] = useState("mt5-12345")
  const [transferToAccount, setTransferToAccount] = useState("mt5-12346")
  const [transactions, setTransactions] = useState(initialTransactions)

  useEffect(() => {
    const stored = localStorage.getItem(FUNDS_TRANSACTIONS_STORAGE_KEY)
    if (!stored) return
    try {
      const parsed = JSON.parse(stored) as typeof initialTransactions
      if (Array.isArray(parsed) && parsed.length) {
        setTransactions(parsed)
      }
    } catch {
      // ignore invalid local data
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(FUNDS_TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tabFromQuery = params.get("tab")
    const fromQuery = params.get("from")

    if (tabFromQuery === "deposit" || tabFromQuery === "withdraw" || tabFromQuery === "transfer") {
      setActiveTab(tabFromQuery)
    }
    if (fromQuery) {
      setTransferFromAccount(fromQuery.toLowerCase())
      setActiveTab("transfer")
    }
  }, [])

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Invalid Amount', { description: 'Please enter a valid deposit amount' })
      return
    }
    setIsProcessing(true)
    setTimeout(() => {
      const paymentName = paymentMethods.find((method) => method.id === selectedPaymentMethod)?.name ?? "Bank Transfer"
      setTransactions((prev) => [
        {
          id: `TXN${String(prev.length + 1).padStart(3, "0")}`,
          type: "Deposit",
          method: paymentName,
          amount: `+$${Number(depositAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          status: "pending",
          date: new Date().toLocaleString(),
          account: "MT5-12345",
        },
        ...prev,
      ])
      setIsProcessing(false)
      toast.success('Deposit Initiated', { description: `$${depositAmount} deposit is being processed` })
      setDepositAmount('')
    }, 1500)
  }

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Invalid Amount', { description: 'Please enter a valid withdrawal amount' })
      return
    }
    setIsProcessing(true)
    setTimeout(() => {
      setTransactions((prev) => [
        {
          id: `TXN${String(prev.length + 1).padStart(3, "0")}`,
          type: "Withdrawal",
          method: "Bank Transfer",
          amount: `-$${Number(withdrawAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          status: "pending",
          date: new Date().toLocaleString(),
          account: "MT5-12345",
        },
        ...prev,
      ])
      setIsProcessing(false)
      toast.success('Withdrawal Requested', { description: `$${withdrawAmount} withdrawal is being processed` })
      setWithdrawAmount('')
    }, 1500)
  }

  const handleTransfer = () => {
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      toast.error('Invalid Amount', { description: 'Please enter a valid transfer amount' })
      return
    }
    setIsProcessing(true)
    setTimeout(() => {
      setTransactions((prev) => [
        {
          id: `TXN${String(prev.length + 1).padStart(3, "0")}`,
          type: "Transfer",
          method: "Internal",
          amount: `$${Number(transferAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          status: "completed",
          date: new Date().toLocaleString(),
          account: transferFromAccount.toUpperCase(),
        },
        ...prev,
      ])
      setIsProcessing(false)
      toast.success('Transfer Complete', {
        description: `$${transferAmount} transferred from ${transferFromAccount.toUpperCase()} to ${transferToAccount.toUpperCase()}`,
      })
      setTransferAmount('')
    }, 1000)
  }

  const handleQuickAmount = (amount: string, type: 'deposit' | 'withdraw' | 'transfer') => {
    if (type === 'deposit') setDepositAmount(amount)
    else if (type === 'withdraw') setWithdrawAmount(amount)
    else setTransferAmount(amount)
    toast.info('Amount Set', { description: `$${amount} selected` })
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Funds Management</h1>
          <p className="text-muted-foreground">Deposit, withdraw, and transfer funds between accounts.</p>
        </div>

        {/* Balance summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Available Balance</p>
              <p className="text-3xl font-bold text-foreground">$124,580.00</p>
              <p className="text-sm text-chart-1 mt-1">Ready to withdraw</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Pending Deposits</p>
              <p className="text-3xl font-bold text-chart-4">$2,500.00</p>
              <p className="text-sm text-muted-foreground mt-1">1 pending transaction</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">This Month</p>
              <p className="text-3xl font-bold text-chart-1">+$8,200.00</p>
              <p className="text-sm text-muted-foreground mt-1">Net deposits</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Deposit/Withdraw/Transfer */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="deposit" className="gap-2">
              <ArrowDownToLine className="h-4 w-4" />
              Deposit
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="gap-2">
              <ArrowUpFromLine className="h-4 w-4" />
              Withdraw
            </TabsTrigger>
            <TabsTrigger value="transfer" className="gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              Transfer
            </TabsTrigger>
          </TabsList>

          {/* Deposit Tab */}
          <TabsContent value="deposit" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Deposit Funds</CardTitle>
                  <CardDescription>Add money to your trading account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Select Account</FieldLabel>
                      <Select defaultValue="mt5-12345">
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mt5-12345">MT5-12345 - Main Trading ($45,250)</SelectItem>
                          <SelectItem value="mt5-12346">MT5-12346 - Scalping ($28,750)</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel>Amount (USD)</FieldLabel>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                      />
                    </Field>
                  </FieldGroup>
                  <div className="flex gap-2">
                    {["100", "500", "1000", "5000"].map((amount) => (
                      <Button key={amount} variant="outline" size="sm" className="flex-1" onClick={() => handleQuickAmount(amount, 'deposit')}>
                        ${amount}
                      </Button>
                    ))}
                  </div>
                  <Button className="w-full" onClick={handleDeposit} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Continue to Payment'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Choose how you want to deposit</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className="flex items-center justify-between rounded-lg border border-border p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                      aria-pressed={selectedPaymentMethod === method.id}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          <method.icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{method.name}</p>
                          <p className="text-sm text-muted-foreground">{method.time}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className={cn(selectedPaymentMethod === method.id && "bg-primary/20 text-primary")}>
                        {method.fee}
                      </Badge>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Withdraw Tab */}
          <TabsContent value="withdraw" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Withdraw Funds</CardTitle>
                  <CardDescription>Withdraw money from your trading account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Select Account</FieldLabel>
                      <Select defaultValue="mt5-12345">
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mt5-12345">MT5-12345 - Main Trading ($45,250)</SelectItem>
                          <SelectItem value="mt5-12346">MT5-12346 - Scalping ($28,750)</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel>Withdrawal Method</FieldLabel>
                      <Select defaultValue="bank">
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="card">Credit/Debit Card</SelectItem>
                          <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel>Amount (USD)</FieldLabel>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                    </Field>
                  </FieldGroup>
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Available Balance</span>
                      <span className="font-medium text-foreground">$45,250.00</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Withdrawal Fee</span>
                      <span className="font-medium text-foreground">$0.00</span>
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleWithdraw} disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : 'Request Withdrawal'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Withdrawal Information</CardTitle>
                  <CardDescription>Important notes about withdrawals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-chart-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Processing Time</p>
                      <p className="text-sm text-muted-foreground">
                        Bank transfers take 1-3 business days. Card refunds may take up to 5 days.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-chart-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Verification Required</p>
                      <p className="text-sm text-muted-foreground">
                        First withdrawal requires KYC verification to be completed.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-chart-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Open Positions</p>
                      <p className="text-sm text-muted-foreground">
                        Ensure sufficient margin for open positions before withdrawing.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transfer Tab */}
          <TabsContent value="transfer" className="space-y-6">
            <Card className="bg-card border-border max-w-xl">
              <CardHeader>
                <CardTitle>Internal Transfer</CardTitle>
                <CardDescription>Transfer funds between your trading accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>From Account</FieldLabel>
                    <Select value={transferFromAccount} onValueChange={setTransferFromAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mt5-12345">MT5-12345 - Main Trading ($45,250)</SelectItem>
                        <SelectItem value="mt5-12346">MT5-12346 - Scalping ($28,750)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>To Account</FieldLabel>
                    <Select value={transferToAccount} onValueChange={setTransferToAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mt5-12345">MT5-12345 - Main Trading ($45,250)</SelectItem>
                        <SelectItem value="mt5-12346">MT5-12346 - Scalping ($28,750)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Amount (USD)</FieldLabel>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                    />
                  </Field>
                </FieldGroup>
                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transfer Fee</span>
                    <span className="font-medium text-chart-1">Free</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Processing</span>
                    <span className="font-medium text-foreground">Instant</span>
                  </div>
                </div>
                <Button className="w-full" onClick={handleTransfer} disabled={isProcessing}>
                  {isProcessing ? 'Processing...' : 'Transfer Funds'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Transaction History */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent deposits, withdrawals, and transfers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Transaction ID</TableHead>
                    <TableHead className="text-muted-foreground">Type</TableHead>
                    <TableHead className="text-muted-foreground">Method</TableHead>
                    <TableHead className="text-muted-foreground">Account</TableHead>
                    <TableHead className="text-muted-foreground">Date</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-right text-muted-foreground">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => {
                    const status = statusConfig[tx.status as keyof typeof statusConfig]
                    const StatusIcon = status.icon
                    return (
                      <TableRow key={tx.id} className="border-border">
                        <TableCell className="font-mono text-sm text-foreground">{tx.id}</TableCell>
                        <TableCell className="text-muted-foreground">{tx.type}</TableCell>
                        <TableCell className="text-muted-foreground">{tx.method}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">{tx.account}</TableCell>
                        <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn("gap-1", status.badge)}>
                            <StatusIcon className="h-3 w-3" />
                            {tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-right font-medium",
                            tx.amount.startsWith("+")
                              ? "text-chart-1"
                              : tx.amount.startsWith("-")
                              ? "text-chart-2"
                              : "text-foreground"
                          )}
                        >
                          {tx.amount}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
