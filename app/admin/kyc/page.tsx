"use client"

import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, AdminSecondaryButton, adminSurface } from "@/components/admin/admin-ui"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { KycItem } from "@/lib/admin/types"

export default function AdminKycPage() {
  const { state, setKycStatus } = useAdmin()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="KYC verification"
        description="Document intake, risk scoring, and approval decisions with immutable audit trail."
        actions={
          <AdminSecondaryButton onClick={() => toast.message("Bulk assign", { description: "Select rows in the next iteration." })}>
            Bulk assign
          </AdminSecondaryButton>
        }
      />

      <div className={cn(adminSurface, "overflow-x-auto")}>
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.08] hover:bg-transparent">
              <TableHead className="text-white/55">Applicant</TableHead>
              <TableHead className="text-white/55">Document</TableHead>
              <TableHead className="text-white/55">Risk</TableHead>
              <TableHead className="text-white/55">Status</TableHead>
              <TableHead className="text-white/55">Submitted</TableHead>
              <TableHead className="text-right text-white/55">Decision</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.kycItems.map((k) => (
              <TableRow key={k.id} className="border-white/[0.06]">
                <TableCell>
                  <div>
                    <p className="font-medium text-white">{k.userName}</p>
                    <p className="text-xs text-white/45">{k.email}</p>
                    <Link href={`/admin/users/${k.userId}`} className="text-[11px] text-red-400/90 hover:underline">
                      Open client
                    </Link>
                  </div>
                </TableCell>
                <TableCell className="text-white/80">{k.docType}</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "border-0",
                      k.riskScore === "Low" && "bg-emerald-500/20 text-emerald-200",
                      k.riskScore === "Medium" && "bg-amber-500/20 text-amber-100",
                      k.riskScore === "High" && "bg-red-500/20 text-red-200"
                    )}
                  >
                    {k.riskScore}
                  </Badge>
                </TableCell>
                <TableCell className="text-white/75">{k.status}</TableCell>
                <TableCell className="text-xs text-white/45">{new Date(k.submittedAt).toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <DecisionButtons k={k} onSet={setKycStatus} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function DecisionButtons({
  k,
  onSet,
}: {
  k: KycItem
  onSet: (id: string, s: KycItem["status"]) => void
}) {
  if (k.status === "Approved" || k.status === "Rejected") {
    return <span className="text-xs text-white/35">Closed</span>
  }
  return (
    <div className="flex flex-wrap justify-end gap-1">
      <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-500" onClick={() => onSet(k.id, "Approved")}>
        Approve
      </Button>
      <Button size="sm" variant="outline" className="h-8 border-white/15 text-white" onClick={() => onSet(k.id, "In Review")}>
        Review
      </Button>
      <Button size="sm" variant="outline" className="h-8 border-red-500/40 text-red-300" onClick={() => onSet(k.id, "Rejected")}>
        Reject
      </Button>
    </div>
  )
}
