"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

/** Elevated glass panel — depth without clutter */
export const adminSurface = cn(
  "rounded-2xl border border-white/[0.07] bg-gradient-to-br from-slate-900/45 via-slate-950/40 to-slate-950/55 backdrop-blur-xl",
  "shadow-[0_4px_48px_-12px_rgba(0,0,0,0.7)] ring-1 ring-white/[0.035]",
  "transition-[box-shadow,transform] duration-300 ease-out",
  "hover:shadow-[0_12px_56px_-18px_rgba(45,212,191,0.07)] hover:ring-teal-500/10"
)

/** Wrap `<Table />` for CRM data grids */
export const adminTableWrap = "admin-table-wrap"

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-white/[0.06] pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-50">{title}</h2>
        {description ? <p className="text-sm leading-relaxed text-slate-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function AdminStatCard({
  label,
  value,
  hint,
  delta,
  positive,
  icon: Icon,
}: {
  label: string
  value: string
  hint?: string
  delta?: string
  positive?: boolean
  icon?: LucideIcon
}) {
  return (
    <Card className={cn(adminSurface, "overflow-hidden text-slate-100")}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight text-slate-50 [font-feature-settings:'tnum'_1,'lnum'_1]">
              {value}
            </p>
            {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
          </div>
          {Icon ? (
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/20 to-cyan-500/10 ring-1 ring-teal-400/20">
              <Icon className="h-5 w-5 text-teal-300/95" strokeWidth={1.75} />
            </div>
          ) : null}
        </div>
        {delta ? (
          <p
            className={cn(
              "mt-4 text-xs font-medium",
              positive === undefined ? "text-slate-500" : positive ? "text-emerald-400/95" : "text-rose-400/90"
            )}
          >
            {delta}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function AdminPanel({
  title,
  description,
  children,
  className,
  action,
}: {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}) {
  return (
    <Card className={cn(adminSurface, "text-slate-100", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-slate-100">{title}</CardTitle>
          {description ? <CardDescription className="text-slate-500">{description}</CardDescription> : null}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function AdminToolbar({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-gradient-to-br from-slate-900/50 to-slate-950/35 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]",
        className
      )}
    >
      {children}
    </div>
  )
}

export function AdminSecondaryButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant="secondary"
      className={cn(
        "rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 shadow-none hover:bg-white/[0.08]",
        className
      )}
      {...props}
    />
  )
}

export function AdminPrimaryButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      className={cn(
        "rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 font-semibold text-slate-950 shadow-lg shadow-teal-500/15 transition hover:from-teal-400 hover:to-cyan-400",
        className
      )}
      {...props}
    />
  )
}

/** Shared tab styling — teal accent, not reference-red */
export const adminTabsListClass =
  "inline-flex min-h-11 flex-wrap items-center gap-1 rounded-xl border border-white/[0.07] bg-slate-900/55 p-1.5 text-slate-500 backdrop-blur-sm"

export const adminTabsTriggerClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-all hover:bg-white/[0.04] hover:text-slate-200 data-[state=active]:bg-teal-500/12 data-[state=active]:text-teal-50 data-[state=active]:shadow-[inset_0_0_0_1px_rgba(45,212,191,0.28)]"
