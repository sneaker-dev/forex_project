'use client'

import { DashboardShell } from "@/components/dashboard/shell"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { BalanceChart } from "@/components/dashboard/balance-chart"
import { ActivePositions } from "@/components/dashboard/active-positions"
import { Announcements } from "@/components/dashboard/announcements"
import { BannerCarousel } from "@/components/dashboard/banner-carousel"
import { MobileAppCard } from "@/components/dashboard/mobile-app-card"
import { Sparkles } from "lucide-react"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col gap-1 animate-slide-up">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-3 w-3" />
              Pro Trader
            </div>
          </div>
          <p className="text-muted-foreground">
            Welcome back, John. {"Here's"} your trading overview for today.
          </p>
        </div>

        {/* Promotional Banner Carousel */}
        <BannerCarousel />

        {/* Stats overview */}
        <StatsCards />

        {/* Quick actions and Mobile App Download */}
        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <QuickActions />
          </div>
          <div className="lg:col-span-1">
            <MobileAppCard />
          </div>
        </div>

        {/* Charts and positions */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <BalanceChart />
          </div>
          <div className="lg:col-span-2">
            <ActivePositions />
          </div>
        </div>

        {/* Announcements */}
        <Announcements />
      </div>
    </DashboardShell>
  )
}
