"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp } from "lucide-react"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"

const data = [
  { name: "EUR/USD", value: 35000, color: "#10b981", percentage: "28%" },
  { name: "GBP/USD", value: 28000, color: "#3b82f6", percentage: "22%" },
  { name: "USD/JPY", value: 22000, color: "#f59e0b", percentage: "18%" },
  { name: "Available", value: 39580, color: "#8b5cf6", percentage: "32%" },
]

export function BalanceChart() {
  const [activeSlice, setActiveSlice] = useState<string | null>(null)

  const chartData = useMemo(
    () => (activeSlice ? data.filter((item) => item.name === activeSlice) : data),
    [activeSlice]
  )
  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Balance Distribution</CardTitle>
          <div className="flex items-center gap-1 text-xs text-success">
            <TrendingUp className="h-3 w-3" />
            +12.5%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="transition-all duration-300 hover:opacity-80"
                    onClick={() => setActiveSlice((prev) => (prev === entry.name ? null : entry.name))}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload
                    return (
                      <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-sm p-3 shadow-xl">
                        <div className="flex items-center gap-2 mb-1">
                          <div 
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <p className="text-sm font-semibold text-foreground">
                            {item.name}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-foreground">
                          ${item.value?.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.percentage} of total
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold text-foreground number-ticker">
                ${total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {data.map((item, index) => (
            <button
              type="button"
              key={index}
              onClick={() => setActiveSlice((prev) => (prev === item.name ? null : item.name))}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer text-left",
                activeSlice === item.name && "ring-1 ring-primary/40 bg-primary/10"
              )}
            >
              <div 
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                <p className="text-[10px] text-muted-foreground">{item.percentage}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
