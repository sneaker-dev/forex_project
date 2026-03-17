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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
  QrCode,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Upload,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useMemo, useRef, useState } from "react"
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
const FUNDS_RECIPIENTS_STORAGE_KEY = "forexpro-funds-recipients"

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
  { id: "upi", name: "UPI", icon: Building2, fee: "Free", time: "Instant" },
  { id: "qr", name: "QR Payment", icon: QrCode, fee: "Free", time: "Instant" },
]

type SavedRecipient =
  | {
      id: string
      label: string
      method: "bank"
      isDefault: boolean
      accountHolderName: string
      bankName: string
      bankAccountNumber: string
      bankIfsc: string
      bankBranch: string
    }
  | {
      id: string
      label: string
      method: "upi"
      isDefault: boolean
      upiId: string
    }

const initialRecipients: SavedRecipient[] = [
  {
    id: "rcp-bank-1",
    label: "Primary Bank (Salary)",
    method: "bank",
    isDefault: true,
    accountHolderName: "Alex Carter",
    bankName: "HDFC Bank",
    bankAccountNumber: "241988001204",
    bankIfsc: "HDFC0001234",
    bankBranch: "Bengaluru Main",
  },
  {
    id: "rcp-bank-2",
    label: "Secondary Bank",
    method: "bank",
    isDefault: false,
    accountHolderName: "Alex Carter",
    bankName: "ICICI Bank",
    bankAccountNumber: "020591009341",
    bankIfsc: "ICIC0000777",
    bankBranch: "Mumbai BKC",
  },
  {
    id: "rcp-upi-1",
    label: "Personal UPI",
    method: "upi",
    isDefault: false,
    upiId: "alex@upi",
  },
]

function maskAccountNumber(account: string) {
  const compact = account.replace(/\s+/g, "")
  if (compact.length <= 4) return compact
  return `****${compact.slice(-4)}`
}

function formatAccountNumberInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 20)
  return digits.replace(/(.{4})/g, "$1 ").trim()
}

function normalizeIfscInput(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11)
}

function normalizeUpiInput(value: string) {
  return value.toLowerCase().replace(/\s+/g, "").slice(0, 60)
}

export default function FundsPage() {
  const accountOptions = [
    { value: "wallet-usd", label: "Wallet USD", balance: "$15,800" },
    { value: "mt5-12345", label: "MT5-12345 - Main Trading", balance: "$45,250" },
    { value: "mt5-12346", label: "MT5-12346 - Scalping", balance: "$28,750" },
  ]
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("deposit")
  const [depositAccount, setDepositAccount] = useState("mt5-12345")
  const [withdrawAccount, setWithdrawAccount] = useState("mt5-12345")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("bank")
  const [depositTransactionId, setDepositTransactionId] = useState("")
  const [depositProofFileName, setDepositProofFileName] = useState<string | null>(null)
  const [qrNonce, setQrNonce] = useState(1)
  const [withdrawMethod, setWithdrawMethod] = useState("bank")
  const [upiId, setUpiId] = useState("")
  const [withdrawUpiId, setWithdrawUpiId] = useState("")
  const [accountHolderName, setAccountHolderName] = useState("")
  const [bankName, setBankName] = useState("")
  const [bankAccountNumber, setBankAccountNumber] = useState("")
  const [bankIfsc, setBankIfsc] = useState("")
  const [bankBranch, setBankBranch] = useState("")
  const [transferFromAccount, setTransferFromAccount] = useState("mt5-12345")
  const [transferToAccount, setTransferToAccount] = useState("mt5-12346")
  const [transactions, setTransactions] = useState(initialTransactions)
  const [savedRecipients, setSavedRecipients] = useState<SavedRecipient[]>(initialRecipients)
  const [selectedRecipientId, setSelectedRecipientId] = useState("")
  const [editingRecipientId, setEditingRecipientId] = useState<string | null>(null)
  const [pendingDeleteRecipientId, setPendingDeleteRecipientId] = useState<string | null>(null)
  const depositProofInputRef = useRef<HTMLInputElement | null>(null)
  const depositSectionRef = useRef<HTMLDivElement | null>(null)
  const withdrawSectionRef = useRef<HTMLDivElement | null>(null)
  const transferSectionRef = useRef<HTMLDivElement | null>(null)

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
    const stored = localStorage.getItem(FUNDS_RECIPIENTS_STORAGE_KEY)
    if (!stored) return
    try {
      const parsed = JSON.parse(stored) as SavedRecipient[]
      if (Array.isArray(parsed) && parsed.length) {
        setSavedRecipients(parsed)
      }
    } catch {
      // ignore invalid local data
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(FUNDS_TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem(FUNDS_RECIPIENTS_STORAGE_KEY, JSON.stringify(savedRecipients))
  }, [savedRecipients])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tabFromQuery = params.get("tab")
    const fromQuery = params.get("from")
    const toQuery = params.get("to")

    if (tabFromQuery === "deposit" || tabFromQuery === "withdraw" || tabFromQuery === "transfer") {
      setActiveTab(tabFromQuery)
    }
    if (fromQuery && tabFromQuery === "transfer") {
      setTransferFromAccount(fromQuery.toLowerCase())
    }
    if (toQuery === "wallet-usd") {
      if (tabFromQuery === "transfer") setTransferToAccount("wallet-usd")
      if (tabFromQuery === "deposit") setDepositAccount("wallet-usd")
    }
    if (fromQuery === "wallet-usd" && tabFromQuery === "withdraw") {
      setWithdrawAccount("wallet-usd")
    }
  }, [])

  useEffect(() => {
    setEditingRecipientId(null)
    const defaultRecipient = savedRecipients.find((recipient) => recipient.method === withdrawMethod && recipient.isDefault)
    if (!defaultRecipient) {
      setSelectedRecipientId("")
      return
    }
    setSelectedRecipientId(defaultRecipient.id)
    if (defaultRecipient.method === "bank") {
      setAccountHolderName(defaultRecipient.accountHolderName)
      setBankName(defaultRecipient.bankName)
      setBankAccountNumber(formatAccountNumberInput(defaultRecipient.bankAccountNumber))
      setBankIfsc(defaultRecipient.bankIfsc)
      setBankBranch(defaultRecipient.bankBranch)
    } else {
      setWithdrawUpiId(normalizeUpiInput(defaultRecipient.upiId))
    }
  }, [withdrawMethod, savedRecipients])

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Invalid Amount', { description: 'Please enter a valid deposit amount' })
      return
    }
    if (selectedPaymentMethod === "upi" && !upiId) {
      toast.error('UPI ID Required', { description: 'Please enter a valid UPI ID for deposit.' })
      return
    }
    if (!depositTransactionId.trim()) {
      toast.error('Transaction ID Required', { description: 'Please add payment transaction/reference ID.' })
      return
    }
    if (!depositProofFileName) {
      toast.error('Payment Proof Required', { description: 'Please upload a payment screenshot/image.' })
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
          account: depositAccount.toUpperCase(),
          reference: depositTransactionId.trim(),
          proofImage: depositProofFileName,
        },
        ...prev,
      ])
      setIsProcessing(false)
      toast.success('Deposit Initiated', { description: `$${depositAmount} deposit is being processed` })
      setDepositAmount('')
      setDepositTransactionId("")
      setDepositProofFileName(null)
    }, 1500)
  }

  const handleDepositProofUpload = (file: File | null) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid File", { description: "Please upload an image file for payment proof." })
      return
    }
    setDepositProofFileName(file.name)
    toast.success("Payment proof attached")
  }

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Invalid Amount', { description: 'Please enter a valid withdrawal amount' })
      return
    }
    if (withdrawMethod === "bank" && (!bankName || !bankAccountNumber || !bankIfsc)) {
      toast.error('Bank Details Required', { description: 'Please provide bank name, account number, and IFSC.' })
      return
    }
    if (withdrawMethod === "bank" && (!accountHolderName || !bankBranch)) {
      toast.error('Bank Beneficiary Details Missing', { description: 'Please provide account holder name and branch.' })
      return
    }
    if (withdrawMethod === "upi" && !withdrawUpiId) {
      toast.error('UPI ID Required', { description: 'Please enter a valid UPI ID for withdrawal.' })
      return
    }
    setIsProcessing(true)
    setTimeout(() => {
      setTransactions((prev) => [
        {
          id: `TXN${String(prev.length + 1).padStart(3, "0")}`,
          type: "Withdrawal",
          method: withdrawMethod === "bank" ? "Bank Transfer" : withdrawMethod === "upi" ? "UPI" : "Crypto",
          amount: `-$${Number(withdrawAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          status: "pending",
          date: new Date().toLocaleString(),
          account: withdrawAccount.toUpperCase(),
        },
        ...prev,
      ])
      setIsProcessing(false)
      toast.success('Withdrawal Requested', { description: `$${withdrawAmount} withdrawal is being processed` })
      setWithdrawAmount('')
    }, 1500)
  }

  const handleTransfer = () => {
    if (transferFromAccount === transferToAccount) {
      toast.error('Invalid Transfer', { description: 'From and To accounts cannot be the same.' })
      return
    }
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

  const filteredRecipients = useMemo(
    () => savedRecipients.filter((recipient) => recipient.method === withdrawMethod),
    [savedRecipients, withdrawMethod]
  )

  const applyRecipient = (recipientId: string) => {
    setSelectedRecipientId(recipientId)
    const recipient = savedRecipients.find((item) => item.id === recipientId)
    if (!recipient) return
    if (recipient.method === "bank") {
      setAccountHolderName(recipient.accountHolderName)
      setBankName(recipient.bankName)
      setBankAccountNumber(formatAccountNumberInput(recipient.bankAccountNumber))
      setBankIfsc(recipient.bankIfsc)
      setBankBranch(recipient.bankBranch)
    } else {
      setWithdrawUpiId(recipient.upiId)
    }
    toast.success("Recipient profile applied")
  }

  const setRecipientAsDefault = (recipientId: string) => {
    setSavedRecipients((prev) => prev.map((item) => ({ ...item, isDefault: item.id === recipientId })))
    toast.success("Default recipient updated")
  }

  const editRecipient = (recipientId: string) => {
    const recipient = savedRecipients.find((item) => item.id === recipientId)
    if (!recipient) return
    setEditingRecipientId(recipient.id)
    setWithdrawMethod(recipient.method)
    applyRecipient(recipient.id)
    toast.info("Editing recipient details")
  }

  const deleteRecipient = (recipientId: string) => {
    setSavedRecipients((prev) => {
      const target = prev.find((item) => item.id === recipientId)
      const next = prev.filter((item) => item.id !== recipientId)
      if (!target) return prev
      if (target.isDefault) {
        const fallback = next.find((item) => item.method === target.method)
        if (fallback) {
          return next.map((item) => ({ ...item, isDefault: item.id === fallback.id }))
        }
      }
      return next
    })
    if (selectedRecipientId === recipientId) {
      setSelectedRecipientId("")
    }
    if (editingRecipientId === recipientId) {
      setEditingRecipientId(null)
    }
    toast.success("Recipient deleted")
  }

  const requestDeleteRecipient = (recipientId: string) => {
    setPendingDeleteRecipientId(recipientId)
  }

  const confirmDeleteRecipient = () => {
    if (!pendingDeleteRecipientId) return
    deleteRecipient(pendingDeleteRecipientId)
    setPendingDeleteRecipientId(null)
  }

  const saveCurrentRecipient = () => {
    if (withdrawMethod === "bank") {
      const rawAccountNumber = bankAccountNumber.replace(/\s+/g, "")
      if (!accountHolderName || !bankName || !rawAccountNumber || !bankIfsc || !bankBranch) {
        toast.error("Cannot Save Recipient", { description: "Complete all bank beneficiary fields first." })
        return
      }
      const recipient: SavedRecipient = {
        id: editingRecipientId ?? `rcp-bank-${Date.now()}`,
        label: `${bankName} - ${rawAccountNumber.slice(-4)}`,
        method: "bank",
        isDefault: savedRecipients.filter((item) => item.method === "bank").length === 0,
        accountHolderName,
        bankName,
        bankAccountNumber: rawAccountNumber,
        bankIfsc: normalizeIfscInput(bankIfsc),
        bankBranch,
      }
      setSavedRecipients((prev) => {
        if (!editingRecipientId) return [recipient, ...prev]
        return prev.map((item) => (item.id === editingRecipientId ? { ...recipient, isDefault: item.isDefault } : item))
      })
      setSelectedRecipientId(recipient.id)
      setEditingRecipientId(null)
      toast.success(editingRecipientId ? "Bank recipient updated" : "Bank recipient saved")
      return
    }
    if (!withdrawUpiId) {
      toast.error("Cannot Save Recipient", { description: "Enter a UPI ID first." })
      return
    }
    const recipient: SavedRecipient = {
      id: editingRecipientId ?? `rcp-upi-${Date.now()}`,
      label: `UPI - ${normalizeUpiInput(withdrawUpiId)}`,
      method: "upi",
      isDefault: savedRecipients.filter((item) => item.method === "upi").length === 0,
      upiId: normalizeUpiInput(withdrawUpiId),
    }
    setSavedRecipients((prev) => {
      if (!editingRecipientId) return [recipient, ...prev]
      return prev.map((item) => (item.id === editingRecipientId ? { ...recipient, isDefault: item.isDefault } : item))
    })
    setSelectedRecipientId(recipient.id)
    setEditingRecipientId(null)
    toast.success(editingRecipientId ? "UPI recipient updated" : "UPI recipient saved")
  }

  const restoreDefaultRecipients = () => {
    setSavedRecipients(initialRecipients)
    setSelectedRecipientId("")
    setEditingRecipientId(null)
    setPendingDeleteRecipientId(null)
    toast.success("Default recipients restored")
  }

  const pendingDeleteRecipient = savedRecipients.find((recipient) => recipient.id === pendingDeleteRecipientId)
  const qrPayload = useMemo(() => {
    const amount = Number(depositAmount || "0")
    return [
      "FOREXPRO_DEPOSIT",
      `account=${depositAccount}`,
      `method=${selectedPaymentMethod}`,
      `amount=${Number.isFinite(amount) ? amount.toFixed(2) : "0.00"}`,
      `ref=${depositTransactionId || "pending"}`,
      `nonce=${qrNonce}`,
    ].join("|")
  }, [depositAccount, selectedPaymentMethod, depositAmount, depositTransactionId, qrNonce])
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=${encodeURIComponent(qrPayload)}`
  const openFlow = (tab: "deposit" | "withdraw" | "transfer", description: string) => {
    setActiveTab(tab)
    toast.info(description)
    setTimeout(() => {
      const target = tab === "deposit" ? depositSectionRef.current : tab === "withdraw" ? withdrawSectionRef.current : transferSectionRef.current
      target?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 80)
  }
  const walletTransactions = useMemo(
    () => transactions.filter((tx) => tx.account === "WALLET-USD" || tx.method.toLowerCase().includes("wallet")),
    [transactions]
  )

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">FUNDS AND WALLET</h1>
          <p className="text-muted-foreground">Unified funds and wallet operations: deposit, withdraw, transfer, and wallet management.</p>
        </div>

        {/* Balance summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground">Wallet Balance</p>
              <p className="text-3xl font-bold text-foreground">$15,800.00</p>
              <p className="text-sm text-chart-1 mt-1">Wallet ready for transfer</p>
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
            <div ref={depositSectionRef} className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Deposit Funds</CardTitle>
                  <CardDescription>Add money to your trading account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Select Account</FieldLabel>
                      <Select value={depositAccount} onValueChange={setDepositAccount}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountOptions.map((account) => (
                            <SelectItem key={account.value} value={account.value}>{account.label} ({account.balance})</SelectItem>
                          ))}
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
                  {selectedPaymentMethod === "upi" && (
                    <div className="rounded-lg border border-border bg-card p-3">
                      <p className="text-sm font-medium text-foreground mb-2">UPI Payment</p>
                      <Input placeholder="Enter UPI ID (example@upi)" value={upiId} onChange={(e) => setUpiId(normalizeUpiInput(e.target.value))} />
                    </div>
                  )}
                  {selectedPaymentMethod === "qr" && (
                    <div className="rounded-lg border border-border bg-card p-3 text-center">
                      <p className="text-sm font-medium text-foreground mb-3">Scan QR to Deposit</p>
                      <div className="mx-auto w-fit rounded-lg bg-white p-2">
                        <img src={qrImageSrc} alt="Payment QR" className="h-28 w-28" />
                      </div>
                      <div className="mt-2 flex justify-center">
                        <Button type="button" size="sm" variant="outline" onClick={() => setQrNonce((prev) => prev + 1)}>
                          Refresh QR
                        </Button>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">After scan and payment, click Continue to Payment to create the pending transaction.</p>
                    </div>
                  )}
                  <div className="rounded-lg border border-border bg-card p-3 space-y-3">
                    <p className="text-sm font-medium text-foreground">Payment Details</p>
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Transaction ID / Reference Number</FieldLabel>
                        <Input
                          placeholder="Enter transaction ID (UTR / Ref No.)"
                          value={depositTransactionId}
                          onChange={(e) => setDepositTransactionId(e.target.value)}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>Upload Payment Screenshot</FieldLabel>
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" className="gap-2" onClick={() => depositProofInputRef.current?.click()}>
                            <Upload className="h-4 w-4" />
                            Upload Image
                          </Button>
                          <span className="text-xs text-muted-foreground self-center truncate">
                            {depositProofFileName ?? "No file selected"}
                          </span>
                        </div>
                        <input
                          ref={depositProofInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleDepositProofUpload(e.target.files?.[0] ?? null)}
                        />
                      </Field>
                    </FieldGroup>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-3">
                    <p className="text-sm font-medium text-foreground">Deposit Flow</p>
                    <ol className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>1. Select receiving account (wallet or trading account).</li>
                      <li>2. Pick payment method (Card/Bank/Crypto/UPI/QR).</li>
                      <li>3. Enter amount and submit to create a Pending transaction.</li>
                      <li>4. Once processed, status becomes Completed and balance updates.</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Withdraw Tab */}
          <TabsContent value="withdraw" className="space-y-6">
            <div ref={withdrawSectionRef} className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Withdraw Funds</CardTitle>
                  <CardDescription>Withdraw money from your trading account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Select Account</FieldLabel>
                      <Select value={withdrawAccount} onValueChange={setWithdrawAccount}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accountOptions.map((account) => (
                            <SelectItem key={account.value} value={account.value}>{account.label} ({account.balance})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel>Withdrawal Method</FieldLabel>
                      <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel>Saved Recipient</FieldLabel>
                      <Select value={selectedRecipientId} onValueChange={applyRecipient}>
                        <SelectTrigger>
                          <SelectValue placeholder={filteredRecipients.length ? "Choose saved recipient" : "No saved recipients for this method"} />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredRecipients.length === 0 ? (
                            <SelectItem value="__none" disabled>No saved recipients</SelectItem>
                          ) : (
                            filteredRecipients.map((recipient) => (
                              <SelectItem key={recipient.id} value={recipient.id}>
                                {recipient.label}{recipient.isDefault ? " (Default)" : ""}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </Field>
                    {filteredRecipients.length > 0 && (
                      <div className="rounded-lg border border-border bg-card p-3">
                        <p className="text-sm font-medium text-foreground mb-2">Saved Recipients</p>
                        <div className="space-y-2">
                          {filteredRecipients.map((recipient) => (
                            <div key={recipient.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border bg-card px-3 py-2">
                              <div>
                                <p className="text-sm font-medium text-foreground">{recipient.label}</p>
                                <p className="text-xs text-muted-foreground">
                                  {recipient.method === "bank" ? `${recipient.bankName} • ${maskAccountNumber(recipient.bankAccountNumber)}` : recipient.upiId}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button type="button" size="sm" variant="outline" onClick={() => applyRecipient(recipient.id)}>Use</Button>
                                <Button type="button" size="sm" variant="outline" onClick={() => editRecipient(recipient.id)}>Edit</Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant={recipient.isDefault ? "default" : "outline"}
                                  onClick={() => setRecipientAsDefault(recipient.id)}
                                >
                                  {recipient.isDefault ? "Default" : "Set Default"}
                                </Button>
                                <Button type="button" size="sm" variant="outline" onClick={() => requestDeleteRecipient(recipient.id)}>Delete</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button type="button" size="sm" variant="outline" onClick={restoreDefaultRecipients}>
                            Restore Default Recipients
                          </Button>
                        </div>
                      </div>
                    )}
                    {withdrawMethod === "bank" && (
                      <>
                        <Field>
                          <FieldLabel>Account Holder Name</FieldLabel>
                          <Input placeholder="As per bank records" value={accountHolderName} onChange={(e) => setAccountHolderName(e.target.value)} />
                        </Field>
                        <Field>
                          <FieldLabel>Bank Name</FieldLabel>
                          <Input placeholder="HDFC / ICICI / SBI..." value={bankName} onChange={(e) => setBankName(e.target.value)} />
                        </Field>
                        <Field>
                          <FieldLabel>Account Number</FieldLabel>
                          <Input placeholder="Enter account number" value={bankAccountNumber} onChange={(e) => setBankAccountNumber(formatAccountNumberInput(e.target.value))} />
                          <p className="mt-1 text-xs text-muted-foreground">Masked preview: {maskAccountNumber(bankAccountNumber)}</p>
                        </Field>
                        <Field>
                          <FieldLabel>IFSC Code</FieldLabel>
                          <Input placeholder="ABCD0123456" value={bankIfsc} onChange={(e) => setBankIfsc(normalizeIfscInput(e.target.value))} />
                        </Field>
                        <Field>
                          <FieldLabel>Branch</FieldLabel>
                          <Input placeholder="Branch name / city" value={bankBranch} onChange={(e) => setBankBranch(e.target.value)} />
                        </Field>
                      </>
                    )}
                    {withdrawMethod === "upi" && (
                      <Field>
                        <FieldLabel>UPI ID</FieldLabel>
                        <Input placeholder="example@upi" value={withdrawUpiId} onChange={(e) => setWithdrawUpiId(normalizeUpiInput(e.target.value))} />
                      </Field>
                    )}
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
                  <div className="flex gap-2">
                    {["100", "500", "1000", "5000"].map((amount) => (
                      <Button key={amount} type="button" variant="outline" size="sm" className="flex-1" onClick={() => handleQuickAmount(amount, 'withdraw')}>
                        ${amount}
                      </Button>
                    ))}
                  </div>
                  <Button type="button" variant="outline" className="w-full" onClick={saveCurrentRecipient}>
                    {editingRecipientId ? "Update Recipient Profile" : "Save Current Recipient Profile"}
                  </Button>
                  <div className="rounded-lg border border-border bg-card p-3">
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
                  <div className="rounded-lg border border-border bg-card p-3">
                    <p className="text-sm font-medium text-foreground">Withdrawal Flow</p>
                    <ol className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>1. Select source account (wallet or trading account).</li>
                      <li>2. Choose method (Bank/UPI/Crypto) and add beneficiary details.</li>
                      <li>3. Submit amount and request moves to Pending in history.</li>
                      <li>4. After review/approval, status updates to Completed or Failed.</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transfer Tab */}
          <TabsContent value="transfer" className="space-y-6">
            <Card ref={transferSectionRef} className="bg-card border-border max-w-xl">
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
                        {accountOptions.map((account) => (
                          <SelectItem key={account.value} value={account.value}>{account.label} ({account.balance})</SelectItem>
                        ))}
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
                        {accountOptions.map((account) => (
                          <SelectItem key={account.value} value={account.value}>{account.label} ({account.balance})</SelectItem>
                        ))}
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
                <div className="rounded-lg border border-border bg-card p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transfer Fee</span>
                    <span className="font-medium text-chart-1">Free</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Processing</span>
                    <span className="font-medium text-foreground">Instant</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {["100", "500", "1000", "5000"].map((amount) => (
                    <Button key={amount} type="button" variant="outline" size="sm" className="flex-1" onClick={() => handleQuickAmount(amount, 'transfer')}>
                      ${amount}
                    </Button>
                  ))}
                </div>
                <div className="rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground">
                  Wallet option is available on both sides. You can transfer Wallet -&gt; Trading account or Trading account -&gt; Wallet instantly.
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
        
        <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-card border-border lg:col-span-2">
                <CardContent className="pt-6">
                  <p className="text-sm font-medium text-muted-foreground">Wallet Balance</p>
                  <p className="text-4xl font-bold text-foreground">$15,800.00</p>
                  <p className="text-sm text-chart-1 mt-1">+$1,240.00 this week</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <p className="text-sm font-medium text-muted-foreground">Pending Wallet Settlements</p>
                  <p className="text-3xl font-bold text-chart-4">$100.00</p>
                  <p className="text-sm text-muted-foreground mt-1">1 pending transaction</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <p className="text-sm font-medium text-muted-foreground">Internal Transfer</p>
                  <p className="text-3xl font-bold text-chart-1">Instant</p>
                  <p className="text-sm text-muted-foreground mt-1">No fees</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Wallet Quick Actions</CardTitle>
                <CardDescription>Use wallet balance directly inside Funds</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                <Button onClick={() => { setDepositAccount("wallet-usd"); openFlow("deposit", "Ready to deposit directly into Wallet.") }} className="gap-2">
                  <ArrowDownToLine className="h-4 w-4" />
                  Deposit to Wallet
                </Button>
                <Button variant="outline" onClick={() => { setWithdrawAccount("wallet-usd"); openFlow("withdraw", "Wallet withdrawal form opened.") }} className="gap-2">
                  <ArrowUpFromLine className="h-4 w-4" />
                  Withdraw from Wallet
                </Button>
                <Button variant="outline" onClick={() => { setTransferFromAccount("wallet-usd"); openFlow("transfer", "Wallet transfer form opened.") }} className="gap-2">
                  <ArrowLeftRight className="h-4 w-4" />
                  Wallet Internal Transfer
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Wallet Transaction History</CardTitle>
                <CardDescription>Wallet-specific recent activity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {walletTransactions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No wallet transactions yet.</p>
                ) : (
                  walletTransactions.map((tx) => (
                    <div key={tx.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{tx.type} • {tx.method}</p>
                          <p className="text-xs text-muted-foreground">{tx.id} • {tx.date}</p>
                        </div>
                        <p className={cn("font-semibold", tx.amount.startsWith("+") ? "text-chart-1" : tx.amount.startsWith("-") ? "text-chart-2" : "text-foreground")}>
                          {tx.amount}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
        </div>

        <AlertDialog open={Boolean(pendingDeleteRecipientId)} onOpenChange={(open) => !open && setPendingDeleteRecipientId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete recipient profile?</AlertDialogTitle>
              <AlertDialogDescription>
                {pendingDeleteRecipient
                  ? `This will remove "${pendingDeleteRecipient.label}" from saved recipients. This action cannot be undone.`
                  : "This action cannot be undone."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteRecipient}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardShell>
  )
}
