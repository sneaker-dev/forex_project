"use client"

import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, adminSurface } from "@/components/admin/admin-ui"
import { cn } from "@/lib/utils"
import { Network } from "lucide-react"
import type { IbNode } from "@/lib/admin/types"

export default function AdminIbPage() {
  const { state } = useAdmin()
  const roots = state.ibNodes.filter((n) => n.parentId === null)

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Introducing broker network"
        description="Multi-tier hierarchy with attributable volume and commission accrual."
      />
      <div className="grid gap-4">
        {roots.map((root) => (
          <IbCard key={root.id} node={root} all={state.ibNodes} depth={0} />
        ))}
      </div>
    </div>
  )
}

function IbCard({ node, all, depth }: { node: IbNode; all: IbNode[]; depth: number }) {
  const children = all.filter((n) => n.parentId === node.id)
  return (
    <div className={cn(adminSurface, "p-5", depth > 0 && "ml-4 border-l-2 border-teal-500/30 pl-5 sm:ml-8")}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
            <Network className="h-5 w-5 text-teal-400/90" />
          </div>
          <div>
            <p className="font-semibold text-white">{node.name}</p>
            <p className="text-xs text-white/45">{node.email}</p>
            <p className="mt-1 text-[11px] text-white/35">Level L{node.level}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 text-right text-sm">
          <div>
            <p className="text-white/45">Clients</p>
            <p className="font-semibold tabular-nums text-white">{node.clients}</p>
          </div>
          <div>
            <p className="text-white/45">Volume</p>
            <p className="font-semibold tabular-nums text-white">${(node.volumeUsd / 1e6).toFixed(2)}M</p>
          </div>
          <div>
            <p className="text-white/45">Commission</p>
            <p className="font-semibold tabular-nums text-emerald-400/90">${node.commissionUsd.toLocaleString()}</p>
          </div>
        </div>
      </div>
      {children.length > 0 && (
        <div className="mt-4 space-y-4 border-t border-white/[0.06] pt-4">
          {children.map((c) => (
            <IbCard key={c.id} node={c} all={all} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
