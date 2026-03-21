"use client"

import { useAdmin } from "@/components/admin/admin-provider"
import { AdminPageHeader, AdminPrimaryButton, AdminSecondaryButton, adminSurface } from "@/components/admin/admin-ui"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function AdminFundsPage() {
  const { state, setWithdrawalStatus, setDepositStatus } = useAdmin()

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Treasury & settlements"
        description="Deposit intake, withdrawal release, and immutable ledger — single operational pane."
        actions={
          <>
            <AdminSecondaryButton onClick={() => toast.message("Reconciliation export", { description: "GL export (UI)." })}>
              Reconcile
            </AdminSecondaryButton>
            <AdminPrimaryButton onClick={() => toast.message("Manual adjustment", { description: "Opens finance ticket." })}>
              Post adjustment
            </AdminPrimaryButton>
          </>
        }
      />

      <Tabs defaultValue="deposits" className="space-y-4">
        <TabsList className="border border-white/[0.08] bg-black/50 p-1">
          <TabsTrigger value="deposits" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Deposits
          </TabsTrigger>
          <TabsTrigger value="withdrawals" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Withdrawals
          </TabsTrigger>
          <TabsTrigger value="ledger" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            Ledger
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deposits">
          <div className={cn(adminSurface, "overflow-x-auto")}>
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.08] hover:bg-transparent">
                  <TableHead className="text-white/55">Reference</TableHead>
                  <TableHead className="text-white/55">Client</TableHead>
                  <TableHead className="text-right text-white/55">Amount</TableHead>
                  <TableHead className="text-white/55">Method</TableHead>
                  <TableHead className="text-white/55">Status</TableHead>
                  <TableHead className="text-white/55">Requested</TableHead>
                  <TableHead className="text-right text-white/55">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.deposits.map((d) => (
                  <TableRow key={d.id} className="border-white/[0.06]">
                    <TableCell className="font-mono text-xs text-white/90">{d.id}</TableCell>
                    <TableCell className="text-white">{d.userName}</TableCell>
                    <TableCell className="text-right tabular-nums text-white">${d.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-white/70">{d.method}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "border-0",
                          d.status === "Credited" && "bg-emerald-500/20 text-emerald-200",
                          d.status === "Pending" && "bg-amber-500/20 text-amber-100",
                          d.status === "Failed" && "bg-red-500/20 text-red-200"
                        )}
                      >
                        {d.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-white/45">{new Date(d.requestedAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {d.status === "Pending" && (
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            className="h-8 bg-emerald-600 hover:bg-emerald-500"
                            onClick={() => setDepositStatus(d.id, "Credited")}
                          >
                            Credit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-red-500/40 text-red-300 hover:bg-red-500/10"
                            onClick={() => setDepositStatus(d.id, "Failed")}
                          >
                            Fail
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="withdrawals">
          <div className={cn(adminSurface, "overflow-x-auto")}>
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.08] hover:bg-transparent">
                  <TableHead className="text-white/55">Reference</TableHead>
                  <TableHead className="text-white/55">Client</TableHead>
                  <TableHead className="text-right text-white/55">Amount</TableHead>
                  <TableHead className="text-white/55">Rail</TableHead>
                  <TableHead className="text-white/55">Status</TableHead>
                  <TableHead className="text-white/55">Requested</TableHead>
                  <TableHead className="text-right text-white/55">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.withdrawals.map((w) => (
                  <TableRow key={w.id} className="border-white/[0.06]">
                    <TableCell className="font-mono text-xs text-white/90">{w.id}</TableCell>
                    <TableCell className="text-white">{w.userName}</TableCell>
                    <TableCell className="text-right tabular-nums text-white">${w.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-white/70">{w.method}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "border-0",
                          w.status === "Paid" && "bg-emerald-500/20 text-emerald-200",
                          w.status === "Pending" && "bg-amber-500/20 text-amber-100",
                          w.status === "Approved" && "bg-sky-500/20 text-sky-100",
                          w.status === "Rejected" && "bg-red-500/20 text-red-200"
                        )}
                      >
                        {w.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-white/45">{new Date(w.requestedAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {w.status === "Pending" && (
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            className="h-8 bg-emerald-600 hover:bg-emerald-500"
                            onClick={() => setWithdrawalStatus(w.id, "Approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-red-500/40 text-red-300"
                            onClick={() => setWithdrawalStatus(w.id, "Rejected")}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {w.status === "Approved" && (
                        <Button size="sm" className="h-8 bg-red-600 hover:bg-red-500" onClick={() => setWithdrawalStatus(w.id, "Paid")}>
                          Mark paid
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="ledger">
          <div className={cn(adminSurface, "overflow-x-auto")}>
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.08] hover:bg-transparent">
                  <TableHead className="text-white/55">Entry</TableHead>
                  <TableHead className="text-white/55">Client</TableHead>
                  <TableHead className="text-white/55">Type</TableHead>
                  <TableHead className="text-right text-white/55">Amount</TableHead>
                  <TableHead className="text-white/55">Status</TableHead>
                  <TableHead className="text-white/55">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.ledger.map((r) => (
                  <TableRow key={r.id} className="border-white/[0.06]">
                    <TableCell className="font-mono text-xs text-white/90">{r.id}</TableCell>
                    <TableCell className="text-white">{r.userName}</TableCell>
                    <TableCell className="text-white/75">{r.type}</TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-mono tabular-nums",
                        r.amount >= 0 ? "text-emerald-400" : "text-red-400"
                      )}
                    >
                      {r.amount >= 0 ? "+" : ""}
                      {r.amount.toFixed(2)} {r.currency}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="border-0 bg-white/10 text-white/85">
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-white/45">{new Date(r.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
