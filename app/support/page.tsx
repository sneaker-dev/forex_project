"use client"

import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useState } from "react"

export default function SupportPage() {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = () => {
    if (!subject || !message) {
      toast.error("Missing Fields", { description: "Please fill in both subject and message." })
      return
    }
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
        <Card className="bg-card border-border max-w-2xl">
          <CardHeader>
            <CardTitle>New Ticket</CardTitle>
            <CardDescription>We usually reply within 24 hours.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue..."
              className="w-full min-h-32 rounded-md border border-input bg-transparent p-3 text-sm"
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmit}>Submit Ticket</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
