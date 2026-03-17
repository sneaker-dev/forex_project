"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, ShieldCheck, Clock3 } from "lucide-react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sentTo, setSentTo] = useState<string | null>(null)

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Email Required", { description: "Please enter your account email." })
      return
    }
    if (!isValidEmail(email)) {
      toast.error("Invalid Email", { description: "Please enter a valid email address." })
      return
    }

    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      setSentTo(email)
      toast.success("Reset Email Sent", {
        description: "Please check your inbox for reset instructions.",
      })
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="mb-6">
          <Button asChild variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10 -ml-2">
            <Link href="/login" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </div>

        <Card className="w-full border-white/10 bg-slate-900/70 p-8 backdrop-blur-md shadow-2xl">
          {!sentTo ? (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Forgot your password?</h1>
              <p className="text-slate-400 mb-6">
                Enter your account email. We will send a secure reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300">Email Address</label>
                  <div className="relative mt-1.5">
                    <Mail className="h-4 w-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-9 bg-slate-900/60 border-slate-700/60 text-white"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isSending} className="w-full h-11">
                  {isSending ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>

              <div className="mt-6 space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start gap-2 text-sm text-slate-300">
                  <ShieldCheck className="h-4 w-4 mt-0.5 text-emerald-400 shrink-0" />
                  <span>Reset links are signed and can only be used once.</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-slate-300">
                  <Clock3 className="h-4 w-4 mt-0.5 text-sky-400 shrink-0" />
                  <span>For security, the link will expire after a short period.</span>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Check your inbox</h2>
                <p className="text-sm text-slate-400 mt-2">
                  We sent password reset instructions to <span className="text-slate-200 font-medium">{sentTo}</span>.
                </p>
              </div>
              <div className="space-y-2">
                <Button className="w-full" onClick={() => router.push("/login")}>
                  Back to Login
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white/20 bg-transparent text-slate-200 hover:bg-white/10"
                  onClick={() => {
                    setSentTo(null)
                    setEmail("")
                  }}
                >
                  Use another email
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
