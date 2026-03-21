"use client"

import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, adminSurface } from "@/components/admin/admin-ui"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function AdminAdminsPage() {
  const { state } = useAdmin()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Administrator access"
        description="Staff identities, privileged roles, and MFA posture."
      />
      <div className={cn(adminSurface, "overflow-x-auto")}>
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.08] hover:bg-transparent">
              <TableHead className="text-white/55">Name</TableHead>
              <TableHead className="text-white/55">Email</TableHead>
              <TableHead className="text-white/55">Role</TableHead>
              <TableHead className="text-white/55">MFA</TableHead>
              <TableHead className="text-white/55">Last login</TableHead>
              <TableHead className="text-white/55">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.staff.map((s) => (
              <TableRow key={s.id} className="border-white/[0.06]">
                <TableCell className="font-medium text-white">{s.name}</TableCell>
                <TableCell className="text-white/70">{s.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="border-0 bg-white/10 text-white/85">
                    {s.role}
                  </Badge>
                </TableCell>
                <TableCell className={s.mfa ? "text-emerald-400" : "text-amber-400"}>{s.mfa ? "On" : "Off"}</TableCell>
                <TableCell className="text-xs text-white/45">{new Date(s.lastLogin).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge
                    className={cn(
                      "border-0",
                      s.status === "Active" && "bg-emerald-500/20 text-emerald-200",
                      s.status === "Locked" && "bg-red-500/20 text-red-200"
                    )}
                  >
                    {s.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
