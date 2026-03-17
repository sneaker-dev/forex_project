"use client"

import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LifeBuoy, Send, MessageSquare, Clock3, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useState } from "react"

type Ticket = {
  id: string
  subject: string
  category: string
  priority: string
  status: "open" | "in_progress" | "resolved"
  createdAt: string
}

export default function SupportPage() {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [category, setCategory] = useState("account")
  const [priority, setPriority] = useState("medium")
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: "SUP-1042", subject: "Withdrawal confirmation delay", category: "funds", priority: "high", status: "in_progress", createdAt: "Mar 16, 2026 10:35" },
    { id: "SUP-1038", subject: "Need statement export", category: "account", priority: "low", status: "resolved", createdAt: "Mar 14, 2026 09:20" },
  ])

  const handleSubmit = () => {
    if (!subject || !message) {
      toast.error("Missing Fields", { description: "Please fill in both subject and message." })
      return
    }
    const newTicket: Ticket = {
      id: `SUP-${String(Date.now()).slice(-4)}`,
      subject,
      category,
      priority,
      status: "open",
      createdAt: new Date().toLocaleString(),
    }
    setTickets((prev) => [newTicket, ...prev])
    toast.success("Support Request Sent", { description: "Our team will get back to you shortly." })
    setSubject("")
    setMessage("")
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Support</h1>
          <p className="text-muted-foreground">Create a support ticket for account or platform issues.</p>
        </div>

        <Card className="border-primary/30 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Support Center</p>
                <p className="text-lg font-semibold text-foreground inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Enterprise Client Assistance
                </p>
              </div>
              <Badge className="bg-chart-1/20 text-chart-1 border-chart-1/30 gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                Avg reply: 2-6 hours
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card className="bg-card border-border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/10">
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">
                <LifeBuoy className="h-5 w-5" />
                New Ticket
              </CardTitle>
              <CardDescription>We usually reply within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="funds">Funds</SelectItem>
                    <SelectItem value="trading">Trading</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue..."
                className="w-full min-h-32 rounded-md border border-input bg-transparent p-3 text-sm"
              />
              <div className="flex justify-end">
                <Button className="gap-2" onClick={handleSubmit}>
                  <Send className="h-4 w-4" />
                  Submit Ticket
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/10">
            <CardHeader>
              <CardTitle className="inline-flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Quick Help
              </CardTitle>
              <CardDescription>Top support topics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "How to complete KYC verification",
                "Deposit/Withdrawal pending statuses",
                "How to secure account with 2FA",
                "How to export account statements",
              ].map((faq) => (
                <div key={faq} className="rounded-lg border border-border p-3 text-sm text-muted-foreground">
                  {faq}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Recent Tickets</CardTitle>
            <CardDescription>Track the status of your previous support requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="rounded-lg border border-border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-foreground">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground">{ticket.id} • {ticket.category} • {ticket.createdAt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className={cn(ticket.priority === "urgent" || ticket.priority === "high" ? "bg-chart-2/20 text-chart-2" : "bg-secondary text-foreground")}>
                      {ticket.priority}
                    </Badge>
                    <Badge variant="secondary" className={cn(
                      ticket.status === "resolved" ? "bg-chart-1/20 text-chart-1" : ticket.status === "in_progress" ? "bg-chart-4/20 text-chart-4" : "bg-secondary text-foreground"
                    )}>
                      {ticket.status === "resolved" ? <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> : ticket.status === "in_progress" ? <Clock3 className="h-3.5 w-3.5 mr-1" /> : <AlertTriangle className="h-3.5 w-3.5 mr-1" />}
                      {ticket.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
