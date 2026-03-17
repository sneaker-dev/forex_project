"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, ShieldCheck, AlertTriangle } from "lucide-react"

const sections = [
  {
    title: "1. Platform Access",
    points: [
      "You must provide accurate registration details and maintain account security.",
      "You are responsible for all actions taken under your account credentials.",
      "Access may be restricted in regions where trading services are not permitted.",
    ],
  },
  {
    title: "2. Trading Risk Disclosure",
    points: [
      "Forex and CFD trading involves significant risk and may result in loss of capital.",
      "Past performance does not guarantee future results.",
      "Leverage amplifies both gains and losses; manage your risk carefully.",
    ],
  },
  {
    title: "3. Fair Use & Conduct",
    points: [
      "You agree not to abuse platform services, automation limits, or security controls.",
      "Any fraudulent behavior, chargeback abuse, or market manipulation may result in suspension.",
      "We reserve the right to investigate suspicious activity for compliance purposes.",
    ],
  },
  {
    title: "4. Demo & Informational Content",
    points: [
      "Some dashboard areas may display sample, simulated, or delayed data in demo mode.",
      "Educational and analytics content is provided for information only and not financial advice.",
      "You should seek independent advice before making real investment decisions.",
    ],
  },
]

export default function TermsPage() {
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
            <div className="flex items-center gap-3 text-emerald-400">
              <FileText className="h-5 w-5" />
              <span className="text-xs uppercase tracking-[0.18em]">Legal</span>
            </div>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <CardDescription className="text-slate-400">
              Effective date: March 2026. Please review these terms before using ForexPro services.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 p-6 sm:p-8">
            <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-300" />
                <p className="text-sm text-amber-100">
                  Trading products are high-risk instruments. Ensure you understand the risks and trade only with funds you can afford to lose.
                </p>
              </div>
            </div>

            {sections.map((section) => (
              <section key={section.title} className="space-y-3">
                <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                <ul className="space-y-2 text-sm leading-relaxed text-slate-300">
                  {section.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400/80 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-2 text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                <p className="text-sm">
                  By continuing to use the platform, you acknowledge and accept these terms.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild>
                <Link href="/register">Create Account</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/20 bg-transparent text-slate-200 hover:bg-white/10">
                <Link href="/privacy">View Privacy Policy</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
