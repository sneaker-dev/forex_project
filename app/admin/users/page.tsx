"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { adminUsers } from "@/lib/admin-mock-data"
import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminUsersPage() {
  const [q, setQ] = useState("")
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return adminUsers
    return adminUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        u.country.toLowerCase().includes(s)
    )
  }, [q])

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-[#111]/90 text-white shadow-none">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-white">Clients</CardTitle>
            <CardDescription className="text-white/50">Search and open client details</CardDescription>
          </div>
          <div className="flex w-full max-w-md items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search users..."
                className="border-white/10 bg-black/40 pl-9 text-white placeholder:text-white/35"
              />
            </div>
            <Button type="button" variant="secondary" className="border-white/10 bg-red-600 text-white hover:bg-red-500">
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/55">Name</TableHead>
                <TableHead className="text-white/55">Email</TableHead>
                <TableHead className="text-white/55">Country</TableHead>
                <TableHead className="text-white/55">Status</TableHead>
                <TableHead className="text-white/55">Joined</TableHead>
                <TableHead className="text-right text-white/55">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id} className="border-white/10">
                  <TableCell className="font-medium text-white">{u.name}</TableCell>
                  <TableCell className="text-white/70">{u.email}</TableCell>
                  <TableCell className="text-white/70">{u.country}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "border-0",
                        u.status === "Active" && "bg-emerald-500/20 text-emerald-300",
                        u.status === "Pending" && "bg-amber-500/20 text-amber-200",
                        u.status === "Suspended" && "bg-red-500/20 text-red-300"
                      )}
                    >
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/55">{u.joined}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline" className="border-white/15 bg-transparent text-white hover:bg-white/10">
                      <Link href={`/admin/users/${u.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
