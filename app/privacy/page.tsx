"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lock, Database, Eye, Mail } from "lucide-react"

const privacyBlocks = [
  {
    icon: Database,
    title: "Data We Collect",
    text: "We collect account information, trading activity, device/session metadata, and support communication needed to operate the platform securely.",
  },
  {
    icon: Eye,
    title: "How We Use Data",
    text: "Your data is used for account access, compliance checks, fraud prevention, service quality improvements, and critical notifications.",
  },
  {
    icon: Lock,
    title: "Data Protection",
    text: "We apply access controls, encryption in transit, and monitoring to protect your information from unauthorized access or misuse.",
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10 -ml-2">
            <Link href="/login" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </Button>
        </div>

        <Card className="border-white/10 bg-slate-900/70 backdrop-blur-md shadow-2xl">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center gap-2 text-emerald-400">
              <Lock className="h-5 w-5" />
              <span className="text-xs uppercase tracking-[0.18em]">Security & Privacy</span>
            </div>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <CardDescription className="text-slate-400">
              Effective date: March 2026. This explains how ForexPro handles your personal and platform data.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 p-6 sm:p-8">
            <div className="grid gap-4 md:grid-cols-3">
              {privacyBlocks.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <Icon className="mb-3 h-5 w-5 text-emerald-400" />
                  <h3 className="mb-2 text-sm font-semibold">{title}</h3>
                  <p className="text-sm leading-relaxed text-slate-300">{text}</p>
                </div>
              ))}
            </div>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold">Your Controls</h2>
              <ul className="space-y-2 text-sm leading-relaxed text-slate-300">
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/80 shrink-0" />
                  <span>You can update profile information and communication preferences from account settings.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/80 shrink-0" />
                  <span>You may request account review or closure through support channels, subject to regulatory retention obligations.</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/80 shrink-0" />
                  <span>Essential legal, security, and transaction notifications cannot be disabled while your account is active.</span>
                </li>
              </ul>
            </section>

            <div className="rounded-xl border border-sky-400/30 bg-sky-500/10 p-4">
              <p className="flex items-center gap-2 text-sm text-sky-100">
                <Mail className="h-4 w-4 text-sky-300" />
                Privacy questions? Contact support through your dashboard Help/Support section.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild>
                <Link href="/register">Create Account</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20 bg-transparent text-slate-200 hover:bg-white/10">
                <Link href="/terms">View Terms of Service</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
