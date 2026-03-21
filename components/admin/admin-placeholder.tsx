"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function AdminPlaceholder({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <Card className="border-white/10 bg-[#111]/80 text-white">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
        {description ? <CardDescription className="text-white/55">{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-white/70">
        <p>
          This module matches the Admin CRM navigation. Wire your API here (list, filters, actions). UI shell is ready
          for production styling.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="border-white/10 bg-white/10 text-white hover:bg-white/15"
          onClick={() => toast.message("Admin action", { description: `${title} — demo only.` })}
        >
          Run demo action
        </Button>
      </CardContent>
    </Card>
  )
}
