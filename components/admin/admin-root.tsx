"use client"

import type { ReactNode } from "react"
import { AdminProvider } from "@/components/admin/admin-provider"
import { AdminShell } from "@/components/admin/admin-shell"

export function AdminRoot({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  )
}
