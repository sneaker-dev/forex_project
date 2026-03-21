"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

/** Consistent CRM surface — subtle lift, inset highlight */
export const adminSurface = cn(
  "rounded-2xl border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0)_40%),#0c0c0c]",
  "shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_24px_64px_-32px_rgba(0,0,0,0.9)]"
)

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
    <div className="flex flex-col gap-4 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
        {description ? <p className="mt-1 max-w-2xl text-sm text-white/50">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
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
    <Card className={cn(adminSurface, "text-white")}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/45">{label}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-white">{value}</p>
            {hint ? <p className="mt-1 text-xs text-white/40">{hint}</p> : null}
          </div>
          {Icon ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
              <Icon className="h-5 w-5 text-red-400/90" />
            </div>
          ) : null}
        </div>
        {delta ? (
          <p
            className={cn(
              "mt-3 text-xs font-semibold",
              positive === undefined ? "text-white/50" : positive ? "text-emerald-400" : "text-red-400"
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
    <Card className={cn(adminSurface, "text-white", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold text-white">{title}</CardTitle>
          {description ? <CardDescription className="text-white/45">{description}</CardDescription> : null}
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
        "flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-black/30 p-3 sm:flex-row sm:items-center sm:justify-between",
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
        "border border-white/10 bg-white/[0.06] text-white shadow-none hover:bg-white/10",
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
  return <Button type="button" className={cn("bg-red-600 text-white hover:bg-red-500", className)} {...props} />
}
