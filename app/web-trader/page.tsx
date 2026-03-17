'use client'

import { DashboardShell } from "@/components/dashboard/shell"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Search,
  Plus,
  Activity,
  BarChart3,
  Clock3,
  SlidersHorizontal,
  ArrowLeftRight,
  CandlestickChart,
  Star,
  StarOff,
  Pencil,
  Trash2,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Move,
  Circle,
  Type,
  Smile,
  Ruler,
  ZoomIn,
  Magnet,
  Lock,
  Eye,
  RefreshCw,
  Settings2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useTradingSim, type OrderType, type OrderSide, type PendingOrder } from "@/lib/trading/use-trading-sim"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

const toolIcons = [Plus, Move, BarChart3, Circle, Type, Smile, Ruler, ZoomIn, Magnet, Lock, Eye]
const toolNames = ["Add", "Move", "Bars", "Circle", "Text", "Emoji", "Ruler", "Zoom", "Magnet", "Lock", "Eye"]
const defaultLeverage = 2000
const maxLeverage = 12000
const STRESS_COLOR = "#EC3606"
const chartMargins = { top: 14, right: 62, bottom: 28, left: 12 }
const chartWidth = 860
const chartHeight = 430
type ChartAnnotation =
  | { id: string; type: "circle"; index: number; price: number }
  | { id: string; type: "text"; index: number; price: number; text: string }
  | { id: string; type: "emoji"; index: number; price: number; text: string }
  | { id: string; type: "ruler"; index: number; price: number; endIndex: number; endPrice: number }

function makeSeries(base: number, points: number, decimals: number) {
  const out: Array<{ open: number; high: number; low: number; close: number }> = []
  let last = base
  for (let i = 0; i < points; i += 1) {
    // Build a deterministic pattern with alternating impulse and consolidation
    // so candles appear evenly distributed with mixed small/large bodies.
    const cycle = i % 16
    const regimeBoost = cycle < 4 ? 1.7 : cycle < 8 ? 0.9 : cycle < 12 ? 1.35 : 0.75
    const drift =
      (Math.sin(i * 0.24) * base * 0.00024 + Math.cos(i * 0.52) * base * 0.00019) * regimeBoost
    const open = Number(last.toFixed(decimals))
    const close = Number((open + drift).toFixed(decimals))
    const wickScale = cycle % 3 === 0 ? 1.15 : 0.82
    const high = Number((Math.max(open, close) + Math.abs(drift) * wickScale + base * 0.0001).toFixed(decimals))
    const low = Number((Math.min(open, close) - Math.abs(drift) * wickScale - base * 0.0001).toFixed(decimals))
    out.push({ open, high, low, close })
    last = close
  }
  return out
}

function priceDecimals(symbol?: string) {
  if (!symbol) return 5
  if (symbol === "XAUUSD") return 2
  if (symbol.includes("JPY")) return 3
  return 5
}

export default function WebTraderPage() {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const { state, metrics, actions } = useTradingSim()
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedSymbol, setSelectedSymbol] = useState("EURUSD")
  const [orderExecutionMode, setOrderExecutionMode] = useState<"market" | "pending">("market")
  const [orderSide, setOrderSide] = useState<OrderSide>("buy")
  const [selectedLeverage, setSelectedLeverage] = useState(defaultLeverage)
  const [orderType, setOrderType] = useState<OrderType>("market")
  const [volume, setVolume] = useState("0.10")
  const [stopPrice, setStopPrice] = useState("")
  const [limitPrice, setLimitPrice] = useState("")
  const [stopLoss, setStopLoss] = useState("")
  const [takeProfit, setTakeProfit] = useState("")
  const [trailingDistance, setTrailingDistance] = useState("0.0015")
  const [timeframe, setTimeframe] = useState("1m")
  const [editOrderId, setEditOrderId] = useState<string | null>(null)
  const [editVolume, setEditVolume] = useState("")
  const [editStop, setEditStop] = useState("")
  const [editLimit, setEditLimit] = useState("")
  const [alertCondition, setAlertCondition] = useState<"above" | "below">("above")
  const [alertPrice, setAlertPrice] = useState("")
  const [riskCapital, setRiskCapital] = useState("15000")
  const [riskPercent, setRiskPercent] = useState("1.5")
  const [riskStopPips, setRiskStopPips] = useState("20")
  const [selectedTool, setSelectedTool] = useState(0)
  const [indicatorsEnabled, setIndicatorsEnabled] = useState(true)
  const [oneClickEnabled, setOneClickEnabled] = useState(false)
  const [showChartSettings, setShowChartSettings] = useState(false)
  const [showCrosshair, setShowCrosshair] = useState(true)
  const [showPriceLine, setShowPriceLine] = useState(true)
  const [chartSeed, setChartSeed] = useState(0)
  const [zoomRange, setZoomRange] = useState({ start: 0, end: 84 })
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [magnetEnabled, setMagnetEnabled] = useState(false)
  const [chartLocked, setChartLocked] = useState(false)
  const [showOverlays, setShowOverlays] = useState(true)
  const [annotations, setAnnotations] = useState<ChartAnnotation[]>([])
  const [rulerStart, setRulerStart] = useState<{ index: number; price: number } | null>(null)
  const [doubleClickZoomStep, setDoubleClickZoomStep] = useState(0)
  const [doubleClickZoomDirection, setDoubleClickZoomDirection] = useState<"in" | "out">("in")
  const chartContainerRef = useRef<HTMLDivElement | null>(null)
  const panRef = useRef<{ x: number; start: number; end: number; moved: boolean } | null>(null)
  const dragMovedRef = useRef(false)
  const [chartSize, setChartSize] = useState({ width: chartWidth, height: chartHeight })
  useEffect(() => setMounted(true), [])
  const isDark = mounted ? resolvedTheme !== "light" : true

  const symbols = useMemo(() => Object.keys(state.quotes), [state.quotes])
  const selectedQuote = state.quotes[selectedSymbol] ?? Object.values(state.quotes)[0]
  const decimals = priceDecimals(selectedQuote?.symbol)
  const visibleWatchlist = useMemo(() => {
    return state.watchlist
      .filter((symbol) => symbol.toLowerCase().includes(search.toLowerCase()))
      .map((symbol) => state.quotes[symbol])
      .filter(Boolean)
  }, [state.watchlist, state.quotes, search])

  const riskAmount = (Number(riskCapital) * Number(riskPercent || "0")) / 100
  const suggestedLot = riskStopPips ? (riskAmount / (Number(riskStopPips) * 10)).toFixed(2) : "0.00"
  const marginRequired = ((Number(volume || "0") * 100000) / Math.max(selectedLeverage, 1)).toFixed(2)
  const estimatedCommission = (Number(volume || "0") * 1).toFixed(2)
  const buyingPower = ((state.balance - Number(marginRequired)) * maxLeverage).toFixed(2)
  const baseSeries = useMemo(() => {
    return makeSeries(selectedQuote?.open ?? selectedQuote?.last ?? 1.1, 84, decimals)
  }, [selectedSymbol, timeframe, decimals, selectedQuote?.open, selectedQuote?.last, chartSeed])
  const chartSeries = useMemo(() => {
    if (!baseSeries.length) return baseSeries
    const last = baseSeries[baseSeries.length - 1]
    const live = selectedQuote?.last ?? last.close
    const updatedLast = {
      ...last,
      close: Number(live.toFixed(decimals)),
      high: Number(Math.max(last.high, live).toFixed(decimals)),
      low: Number(Math.min(last.low, live).toFixed(decimals)),
    }
    return [...baseSeries.slice(0, -1), updatedLast]
  }, [baseSeries, selectedQuote?.last, decimals])
  const visibleSeries = useMemo(() => {
    const start = Math.max(0, Math.min(zoomRange.start, chartSeries.length - 1))
    const end = Math.max(start + 1, Math.min(zoomRange.end, chartSeries.length))
    return chartSeries.slice(start, end)
  }, [chartSeries, zoomRange])
  const yMin = useMemo(() => Math.min(...visibleSeries.map((c) => c.low)), [visibleSeries])
  const yMax = useMemo(() => Math.max(...visibleSeries.map((c) => c.high)), [visibleSeries])
  const yPad = (yMax - yMin) * 0.12 || 0.0001
  const plottedMin = yMin - yPad
  const plottedMax = yMax + yPad
  const innerWidth = Math.max(420, Math.floor(chartSize.width))
  const innerHeight = Math.max(260, Math.floor(chartSize.height))
  const plotAreaHeight = innerHeight - chartMargins.top - chartMargins.bottom
  const plotAreaWidth = innerWidth - chartMargins.left - chartMargins.right
  const toX = (index: number) => chartMargins.left + (index / Math.max(visibleSeries.length - 1, 1)) * plotAreaWidth
  const toY = (value: number) => chartMargins.top + ((plottedMax - value) / (plottedMax - plottedMin)) * plotAreaHeight
  const yTicks = useMemo(
    () => Array.from({ length: 8 }).map((_, i) => plottedMin + ((plottedMax - plottedMin) / 7) * i),
    [plottedMin, plottedMax]
  )
  const xTicks = useMemo(() => {
    const step = Math.max(1, Math.floor(visibleSeries.length / 8))
    return Array.from({ length: 9 }).map((_, i) => {
      const localIdx = Math.min(Math.max(visibleSeries.length - 1, 0), i * step)
      const idx = zoomRange.start + localIdx
      return {
      idx: localIdx,
      label: `${String(3 + Math.floor(idx / 8)).padStart(2, "0")}:${idx % 2 === 0 ? "00" : "30"}`,
      }
    })
  }, [visibleSeries.length, zoomRange.start])
  const lastCandle = visibleSeries[visibleSeries.length - 1]
  const currentLineY = toY(lastCandle?.close ?? selectedQuote?.last ?? 1.1)
  const chartTheme = isDark
    ? {
        bgA: "#081427",
        bgB: "#050a16",
        gridA: "#183055",
        gridB: "#132845",
        yText: "#9fb2d4",
        xText: "#8da3c8",
        axisLine: "#2b4f90",
        cross: "#4a6088",
      }
    : {
        bgA: "#f6f9ff",
        bgB: "#edf3ff",
        gridA: "#d6e0f2",
        gridB: "#e2e9f7",
        yText: "#44536d",
        xText: "#5d6f8b",
        axisLine: "#4a6fab",
        cross: "#8aa0c3",
      }

  useEffect(() => {
    const node = chartContainerRef.current
    if (!node) return
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const width = entry.contentRect.width
      const height = entry.contentRect.height
      setChartSize({ width, height })
    })
    ro.observe(node)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    setZoomRange({ start: 0, end: chartSeries.length })
  }, [chartSeries.length, selectedSymbol, timeframe, chartSeed])

  useEffect(() => {
    if (orderExecutionMode === "market") {
      setOrderType("market")
      return
    }
    if (orderType === "market") {
      setOrderType("limit")
    }
  }, [orderExecutionMode, orderType])

  useEffect(() => {
    setDoubleClickZoomStep(0)
    setDoubleClickZoomDirection("in")
  }, [selectedSymbol, timeframe, chartSeed])

  const clampZoomRange = (start: number, end: number) => {
    const total = chartSeries.length
    const minWindow = 16
    const window = Math.max(minWindow, Math.min(total, end - start))
    const clampedStart = Math.max(0, Math.min(start, total - window))
    return { start: clampedStart, end: clampedStart + window }
  }

  const getLocalIndexFromClientX = (clientX: number) => {
    const node = chartContainerRef.current
    if (!node) return 0
    const rect = node.getBoundingClientRect()
    const localX = clientX - rect.left
    const ratio = (localX - chartMargins.left) / Math.max(plotAreaWidth, 1)
    const idx = Math.round(Math.max(0, Math.min(1, ratio)) * Math.max(visibleSeries.length - 1, 0))
    return idx
  }

  const getPriceFromClientY = (clientY: number) => {
    const node = chartContainerRef.current
    if (!node) return selectedQuote?.last ?? 1
    const rect = node.getBoundingClientRect()
    const localY = clientY - rect.top
    const ratio = (localY - chartMargins.top) / Math.max(plotAreaHeight, 1)
    const clamped = Math.max(0, Math.min(1, ratio))
    return plottedMax - clamped * (plottedMax - plottedMin)
  }

  const handleChartWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    if (chartLocked) return
    e.preventDefault()
    const total = chartSeries.length
    const window = zoomRange.end - zoomRange.start
    const nextWindow = e.deltaY > 0 ? Math.min(total, Math.round(window * 1.15)) : Math.max(16, Math.round(window * 0.85))
    if (nextWindow === window) return
    const anchorLocal = hoverIndex !== null ? Math.max(0, Math.min(visibleSeries.length - 1, hoverIndex - zoomRange.start)) : getLocalIndexFromClientX(e.clientX)
    const anchorGlobal = zoomRange.start + anchorLocal
    const ratioWithinWindow = (anchorGlobal - zoomRange.start) / Math.max(window, 1)
    const nextStart = Math.round(anchorGlobal - ratioWithinWindow * nextWindow)
    setZoomRange(clampZoomRange(nextStart, nextStart + nextWindow))
  }

  const handleChartMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (chartLocked || e.button !== 0) return
    dragMovedRef.current = false
    panRef.current = { x: e.clientX, start: zoomRange.start, end: zoomRange.end, moved: false }
  }

  const handleChartMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const localIdx = getLocalIndexFromClientX(e.clientX)
    setHoverIndex(zoomRange.start + localIdx)
    if (!panRef.current || chartLocked) return
    const dx = e.clientX - panRef.current.x
    panRef.current.moved = panRef.current.moved || Math.abs(dx) > 2
    dragMovedRef.current = dragMovedRef.current || Math.abs(dx) > 2
    const candlePixel = Math.max(plotAreaWidth / Math.max(visibleSeries.length, 1), 1)
    const shift = Math.round(-dx / candlePixel)
    if (shift === 0) return
    setZoomRange(clampZoomRange(panRef.current.start + shift, panRef.current.end + shift))
  }

  const handleChartMouseUpOrLeave = () => {
    panRef.current = null
  }

  const handleChartDoubleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (chartLocked) return
    const total = chartSeries.length
    const localIdx = getLocalIndexFromClientX(e.clientX)
    const anchorGlobal = zoomRange.start + localIdx
    const nextStepRaw = doubleClickZoomDirection === "in" ? doubleClickZoomStep + 1 : doubleClickZoomStep - 1
    const boundedStep = Math.max(0, Math.min(5, nextStepRaw))
    const zoomFactorPerStep = 0.82
    const targetWindow = Math.max(16, Math.min(total, Math.round(total * Math.pow(zoomFactorPerStep, boundedStep))))
    const ratioWithinWindow = (anchorGlobal - zoomRange.start) / Math.max(zoomRange.end - zoomRange.start, 1)
    const targetStart = Math.round(anchorGlobal - ratioWithinWindow * targetWindow)
    setZoomRange(clampZoomRange(targetStart, targetStart + targetWindow))
    setDoubleClickZoomStep(boundedStep)
    if (boundedStep === 5) setDoubleClickZoomDirection("out")
    if (boundedStep === 0) setDoubleClickZoomDirection("in")
  }

  const handleChartClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (chartLocked) return
    if (dragMovedRef.current) {
      dragMovedRef.current = false
      return
    }
    const localIdx = getLocalIndexFromClientX(e.clientX)
    const index = zoomRange.start + localIdx
    const price = Number(getPriceFromClientY(e.clientY).toFixed(decimals))
    if (selectedTool === 3) {
      setAnnotations((prev) => [...prev, { id: `ann-${Date.now()}`, type: "circle", index, price }])
      toast.success("Circle marker added")
      return
    }
    if (selectedTool === 4) {
      setAnnotations((prev) => [...prev, { id: `ann-${Date.now()}`, type: "text", index, price, text: "Note" }])
      toast.success("Text marker added")
      return
    }
    if (selectedTool === 5) {
      setAnnotations((prev) => [...prev, { id: `ann-${Date.now()}`, type: "emoji", index, price, text: "🙂" }])
      toast.success("Emoji marker added")
      return
    }
    if (selectedTool === 6) {
      if (!rulerStart) {
        setRulerStart({ index, price })
        toast.info("Ruler start point placed")
        return
      }
      setAnnotations((prev) => [
        ...prev,
        { id: `ann-${Date.now()}`, type: "ruler", index: rulerStart.index, price: rulerStart.price, endIndex: index, endPrice: price },
      ])
      setRulerStart(null)
      toast.success("Ruler measurement added")
    }
  }

  const submitOrder = () => {
    const result = actions.placeOrder({
      symbol: selectedSymbol,
      side: orderSide,
      type: orderType,
      volume: Number(volume),
      stopPrice: stopPrice ? Number(stopPrice) : undefined,
      limitPrice: limitPrice ? Number(limitPrice) : undefined,
      stopLoss: stopLoss ? Number(stopLoss) : undefined,
      takeProfit: takeProfit ? Number(takeProfit) : undefined,
      trailingDistance: trailingDistance ? Number(trailingDistance) : undefined,
    })
    if (!result.ok) {
      toast.error("Order rejected", { description: result.message })
      return
    }
    toast.success("Order accepted", { description: result.message })
  }

  const startEdit = (order: PendingOrder) => {
    setEditOrderId(order.id)
    setEditVolume(String(order.volume))
    setEditStop(order.stopPrice?.toString() ?? "")
    setEditLimit(order.limitPrice?.toString() ?? "")
  }

  const saveEdit = () => {
    if (!editOrderId) return
    actions.modifyPendingOrder(editOrderId, {
      volume: Number(editVolume || "0"),
      stopPrice: editStop ? Number(editStop) : null,
      limitPrice: editLimit ? Number(editLimit) : null,
    })
    toast.success("Order updated")
    setEditOrderId(null)
  }

  const createAlert = () => {
    const value = Number(alertPrice)
    if (!Number.isFinite(value) || value <= 0) {
      toast.error("Enter a valid alert price")
      return
    }
    actions.addAlert(selectedSymbol, alertCondition, value)
    setAlertPrice("")
    toast.success("Price alert created")
  }

  return (
    <DashboardShell>
      <div className="space-y-4 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Web Trader</h1>
            <p className="text-muted-foreground">Professional trading terminal with chart tools, advanced orders, and real-time simulation.</p>
          </div>
          <Badge className="bg-success/15 text-success border-success/30 gap-1.5">
            <Activity className="h-3 w-3" />
            Market Live
          </Badge>
        </div>

        <div
          className={cn(
            "rounded-xl border overflow-hidden min-w-0 relative",
            isDark ? "border-border bg-[#060d1f]" : "border-slate-300 bg-white"
          )}
        >

          <div className={cn("relative border-b px-3 py-2 sm:px-4 sm:py-3", isDark ? "border-[#1b2a46]" : "border-slate-200")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = symbols.indexOf(selectedSymbol)
                    const nextSymbol = symbols[(currentIndex + 1) % symbols.length]
                    setSelectedSymbol(nextSymbol)
                    toast.info(`Symbol switched to ${nextSymbol}`)
                  }}
                >
                  <Badge variant="secondary" className={cn("gap-1.5 border cursor-pointer", isDark ? "bg-[#0c1b38] border-[#243a63] text-slate-100 hover:bg-[#11284f]" : "bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200")}>
                    <CandlestickChart className="h-3.5 w-3.5" />
                    {selectedQuote?.symbol}
                  </Badge>
                </button>
                <button type="button" onClick={() => router.push("/wallet")}>
                  <Badge variant="outline" className={cn("bg-transparent cursor-pointer", isDark ? "border-[#2b3d62] text-slate-200 hover:bg-[#11284f]" : "border-slate-300 text-slate-700 hover:bg-slate-100")}>Balance ${state.balance.toFixed(2)}</Badge>
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("h-8 gap-1 bg-transparent", isDark ? "border-[#2b3d62] text-slate-200 hover:bg-[#0b1831]" : "border-slate-300 text-slate-700 hover:bg-slate-100")}
                  onClick={() => {
                    const next = !indicatorsEnabled
                    setIndicatorsEnabled(next)
                    toast.info(next ? "Indicators enabled" : "Indicators hidden")
                  }}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  {indicatorsEnabled ? "Indicators On" : "Indicators Off"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("h-8 gap-1 bg-transparent", isDark ? "border-[#2b3d62] text-slate-200 hover:bg-[#0b1831]" : "border-slate-300 text-slate-700 hover:bg-slate-100")}
                  onClick={() => {
                    const next = !oneClickEnabled
                    setOneClickEnabled(next)
                    toast.info(next ? "One-click trading enabled" : "One-click trading disabled")
                  }}
                >
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                  {oneClickEnabled ? "One Click On" : "One Click Off"}
                </Button>
              </div>
            </div>
          </div>

          <div className="relative grid min-w-0 xl:grid-cols-[56px_240px_minmax(0,1fr)_320px] lg:grid-cols-[240px_minmax(0,1fr)]">
            <div className={cn("hidden xl:flex flex-col gap-2 border-r p-2", isDark ? "border-[#1b2a46] bg-[#050b19]" : "border-slate-200 bg-slate-50")}>
              {toolIcons.map((Icon, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (idx === 0) {
                      setZoomRange({ start: 0, end: chartSeries.length })
                      setSelectedTool(idx)
                      toast.info("Chart reset to full range")
                      return
                    }
                    if (idx === 2) {
                      setIndicatorsEnabled((prev) => !prev)
                      setSelectedTool(idx)
                      toast.info("Bars/indicators toggled")
                      return
                    }
                    if (idx === 8) {
                      setMagnetEnabled((prev) => !prev)
                      setSelectedTool(idx)
                      toast.info(!magnetEnabled ? "Magnet enabled" : "Magnet disabled")
                      return
                    }
                    if (idx === 9) {
                      setChartLocked((prev) => !prev)
                      setSelectedTool(idx)
                      toast.info(!chartLocked ? "Chart locked" : "Chart unlocked")
                      return
                    }
                    if (idx === 10) {
                      setShowOverlays((prev) => !prev)
                      setSelectedTool(idx)
                      toast.info(showOverlays ? "Overlays hidden" : "Overlays shown")
                      return
                    }
                    setSelectedTool(idx)
                    toast.info(`Tool selected: ${toolNames[idx]}`)
                  }}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg border transition-colors",
                    isDark
                      ? idx === selectedTool
                        ? "border-emerald-500/70 bg-[#102248] text-white"
                        : "border-[#243a63] bg-[#0b1730] text-slate-300 hover:text-white hover:bg-[#102248]"
                      : idx === selectedTool
                        ? "border-emerald-500 bg-emerald-50 text-slate-900"
                        : "border-slate-300 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>

            <div className={cn("border-r p-3 space-y-3 min-w-0", isDark ? "border-[#1b2a46] bg-[#061127]" : "border-slate-200 bg-slate-50/60")}>
              <div className="relative">
                <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4", isDark ? "text-slate-500" : "text-slate-400")} />
                <Input
                  placeholder="Search instruments"
                  className={cn(
                    "pl-9 focus-visible:ring-1 focus-visible:ring-emerald-500/50",
                    isDark
                      ? "bg-[#0b1730] border-[#243a63] text-slate-100 placeholder:text-slate-500"
                      : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400"
                  )}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Tabs defaultValue="forex" className="space-y-2">
                <TabsList className={cn("grid w-full grid-cols-3 border", isDark ? "bg-[#0a1730] border-[#213657]" : "bg-slate-100 border-slate-300")}>
                  <TabsTrigger value="forex">Forex</TabsTrigger>
                  <TabsTrigger value="metals">Metals</TabsTrigger>
                  <TabsTrigger value="crypto">Crypto</TabsTrigger>
                </TabsList>
                <TabsContent value="forex" className="space-y-2">
                  {visibleWatchlist.map((pair) => (
                    <button
                      key={pair.symbol}
                      onClick={() => setSelectedSymbol(pair.symbol)}
                      className={cn(
                        "w-full rounded-lg border p-3 text-left transition-colors",
                        selectedSymbol === pair.symbol
                          ? isDark
                            ? "border-emerald-500/80 bg-[#0c1c3d]"
                            : "border-emerald-500 bg-emerald-50"
                          : isDark
                            ? "border-[#22395f] bg-[#091731] hover:bg-[#0d203f]"
                            : "border-slate-300 bg-white hover:bg-slate-100"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <p className={cn("font-semibold", isDark ? "text-slate-100" : "text-slate-800")}>{pair.symbol}</p>
                        <p className={cn("text-xs", pair.changePercent >= 0 ? "text-green-600 dark:text-green-400" : "")} style={pair.changePercent >= 0 ? undefined : { color: STRESS_COLOR }}>
                          {pair.changePercent >= 0 ? "+" : ""}
                          {pair.changePercent.toFixed(2)}%
                        </p>
                      </div>
                      <p className={cn("text-xs mt-1", isDark ? "text-slate-400" : "text-slate-500")}>Bid {pair.bid} / Ask {pair.ask}</p>
                    </button>
                  ))}
                </TabsContent>
                <TabsContent value="metals" className={cn("text-sm py-4", isDark ? "text-slate-400" : "text-slate-600")}>XAUUSD, XAGUSD live metals feed ready.</TabsContent>
                <TabsContent value="crypto" className={cn("text-sm py-4", isDark ? "text-slate-400" : "text-slate-600")}>BTCUSD, ETHUSD live crypto feed ready.</TabsContent>
              </Tabs>
            </div>

            <div className={cn("border-r min-w-0", isDark ? "border-[#1b2a46] bg-[#040b19]" : "border-slate-200 bg-white")}>
              <div className={cn("flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 border-b", isDark ? "border-[#1b2a46]" : "border-slate-200")}>
                <div className="flex items-center gap-3">
                  <p className={cn("font-semibold", isDark ? "text-slate-100" : "text-slate-800")}>{selectedQuote?.symbol}</p>
                  <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>1 · MetaApi</p>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-emerald-400">O {lastCandle?.open.toFixed(decimals)}</span>
                    <span className="text-slate-300">H {lastCandle?.high.toFixed(decimals)}</span>
                    <span className="text-slate-300">L {lastCandle?.low.toFixed(decimals)}</span>
                    <span
                      className={cn(lastCandle?.close && lastCandle?.open && lastCandle.close >= lastCandle.open ? "text-emerald-400" : "")}
                      style={lastCandle?.close && lastCandle?.open && lastCandle.close >= lastCandle.open ? undefined : { color: STRESS_COLOR }}
                    >
                      C {lastCandle?.close.toFixed(decimals)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setChartSeed((prev) => prev + 1)
                      toast.success("Chart refreshed")
                    }}
                    className={cn("h-7 w-7", isDark ? "text-slate-400 hover:text-white hover:bg-[#0a1a36]" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100")}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowChartSettings((prev) => !prev)}
                    className={cn("h-7 w-7", isDark ? "text-slate-400 hover:text-white hover:bg-[#0a1a36]" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100")}
                  >
                    <Settings2 className="h-3.5 w-3.5" />
                  </Button>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger className={cn("h-8 w-[86px]", isDark ? "border-[#253a62] bg-[#091731] text-slate-100" : "border-slate-300 bg-white text-slate-800")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">1m</SelectItem>
                      <SelectItem value="5m">5m</SelectItem>
                      <SelectItem value="15m">15m</SelectItem>
                      <SelectItem value="1h">1h</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-right">
                    <p className={cn("text-sm font-semibold", isDark ? "text-slate-100" : "text-slate-800")}>{selectedQuote?.bid.toFixed(decimals)}</p>
                    <p className={cn("text-xs", (selectedQuote?.changePercent ?? 0) >= 0 ? "text-emerald-400" : "")} style={(selectedQuote?.changePercent ?? 0) >= 0 ? undefined : { color: STRESS_COLOR }}>
                      {(selectedQuote?.changePercent ?? 0) >= 0 ? "+" : ""}
                      {(selectedQuote?.changePercent ?? 0).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
              {showChartSettings && (
                <div className={cn("mx-4 mt-2 rounded-lg border p-3", isDark ? "border-[#2b436d] bg-[#0b1730]" : "border-slate-300 bg-slate-50")}>
                  <p className={cn("text-xs font-medium mb-2", isDark ? "text-slate-200" : "text-slate-700")}>Chart Settings</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between">
                      <span className={cn("text-xs", isDark ? "text-slate-300" : "text-slate-600")}>Crosshair</span>
                      <Switch checked={showCrosshair} onCheckedChange={setShowCrosshair} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={cn("text-xs", isDark ? "text-slate-300" : "text-slate-600")}>Price line</span>
                      <Switch checked={showPriceLine} onCheckedChange={setShowPriceLine} />
                    </div>
                  </div>
                </div>
              )}

              <div className="h-[420px] sm:h-[520px] px-3 pt-2 pb-3">
                <div
                  ref={chartContainerRef}
                  onWheel={handleChartWheel}
                  onMouseDown={handleChartMouseDown}
                  onMouseMove={handleChartMouseMove}
                  onMouseUp={handleChartMouseUpOrLeave}
                  onMouseLeave={handleChartMouseUpOrLeave}
                  onDoubleClick={handleChartDoubleClick}
                  onClick={handleChartClick}
                  className={cn(
                    "h-full w-full rounded-md border relative overflow-hidden",
                    !chartLocked ? "cursor-grab" : "cursor-not-allowed",
                    isDark ? "border-[#1d2f50] bg-[#060c1a]" : "border-slate-300 bg-slate-100"
                  )}
                >
                  <svg viewBox={`0 0 ${innerWidth} ${innerHeight}`} className="w-full h-full">
                    <defs>
                      <linearGradient id="chartBg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={chartTheme.bgA} />
                        <stop offset="100%" stopColor={chartTheme.bgB} />
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width={innerWidth} height={innerHeight} fill="url(#chartBg)" />

                    {yTicks.map((tick, idx) => {
                      const y = toY(tick)
                      return (
                        <g key={`y-${idx}`}>
                          <line x1={chartMargins.left} y1={y} x2={innerWidth - chartMargins.right} y2={y} stroke={chartTheme.gridA} strokeWidth="1" opacity="0.55" />
                          <text x={innerWidth - chartMargins.right + 8} y={y + 4} fill={chartTheme.yText} fontSize="11">
                            {tick.toFixed(decimals)}
                          </text>
                        </g>
                      )
                    })}

                    {xTicks.map(({ idx, label }) => {
                      const x = toX(idx)
                      return (
                        <g key={`x-${idx}`}>
                          <line x1={x} y1={chartMargins.top} x2={x} y2={innerHeight - chartMargins.bottom} stroke={chartTheme.gridB} strokeWidth="1" opacity="0.45" />
                          <text x={x - 12} y={innerHeight - 8} fill={chartTheme.xText} fontSize="10">
                            {label}
                          </text>
                        </g>
                      )
                    })}

                    {showPriceLine && showOverlays && (
                      <line
                        x1={chartMargins.left}
                        y1={currentLineY}
                        x2={innerWidth - chartMargins.right}
                        y2={currentLineY}
                        stroke={chartTheme.axisLine}
                        strokeDasharray="4 4"
                        opacity="0.75"
                      />
                    )}

                    {visibleSeries.map((candle, index) => {
                      const x = toX(index)
                      const candleWidth = Math.max(plotAreaWidth / visibleSeries.length - 7.2, 0.9)
                      const openY = toY(candle.open)
                      const closeY = toY(candle.close)
                      const highY = toY(candle.high)
                      const lowY = toY(candle.low)
                      const up = candle.close >= candle.open
                      return (
                        <g key={`c-${index}`}>
                          <line x1={x} y1={highY} x2={x} y2={lowY} stroke={up ? "#13c9a6" : "#EC3606"} strokeWidth="0.9" />
                          <rect
                            x={x - candleWidth / 2}
                            y={Math.min(openY, closeY)}
                            width={candleWidth}
                            height={Math.max(Math.abs(openY - closeY), 1.3)}
                            fill={up ? "#18d1ae" : "#EC3606"}
                            opacity="0.95"
                          />
                        </g>
                      )
                    })}

                    {showCrosshair && showOverlays && (
                      <>
                        <line
                          x1={toX(Math.max(0, Math.min(visibleSeries.length - 1, (hoverIndex ?? Math.floor(visibleSeries.length / 2)) - zoomRange.start)))}
                          y1={chartMargins.top}
                          x2={toX(Math.max(0, Math.min(visibleSeries.length - 1, (hoverIndex ?? Math.floor(visibleSeries.length / 2)) - zoomRange.start)))}
                          y2={innerHeight - chartMargins.bottom}
                          stroke={chartTheme.cross}
                          strokeDasharray="5 5"
                          opacity="0.7"
                        />
                        <line
                          x1={chartMargins.left}
                          y1={toY(
                            visibleSeries[
                              Math.max(
                                0,
                                Math.min(
                                  visibleSeries.length - 1,
                                  (magnetEnabled ? hoverIndex ?? Math.floor(visibleSeries.length / 2) : hoverIndex ?? Math.floor(visibleSeries.length / 2)) - zoomRange.start
                                )
                              )
                            ]?.close ?? selectedQuote?.last ?? 1
                          )}
                          x2={innerWidth - chartMargins.right}
                          y2={toY(
                            visibleSeries[
                              Math.max(
                                0,
                                Math.min(
                                  visibleSeries.length - 1,
                                  (magnetEnabled ? hoverIndex ?? Math.floor(visibleSeries.length / 2) : hoverIndex ?? Math.floor(visibleSeries.length / 2)) - zoomRange.start
                                )
                              )
                            ]?.close ?? selectedQuote?.last ?? 1
                          )}
                          stroke={chartTheme.cross}
                          strokeDasharray="5 5"
                          opacity="0.7"
                        />
                      </>
                    )}

                    {showOverlays &&
                      annotations.map((annotation) => {
                        if (annotation.type === "ruler") {
                          const startVisible = annotation.index >= zoomRange.start && annotation.index < zoomRange.end
                          const endVisible = annotation.endIndex >= zoomRange.start && annotation.endIndex < zoomRange.end
                          if (!startVisible && !endVisible) return null
                          const x1 = toX(Math.max(0, Math.min(visibleSeries.length - 1, annotation.index - zoomRange.start)))
                          const y1 = toY(annotation.price)
                          const x2 = toX(Math.max(0, Math.min(visibleSeries.length - 1, annotation.endIndex - zoomRange.start)))
                          const y2 = toY(annotation.endPrice)
                          return (
                            <g key={annotation.id}>
                              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#eab308" strokeWidth="1.2" strokeDasharray="4 3" />
                              <circle cx={x1} cy={y1} r="3" fill="#eab308" />
                              <circle cx={x2} cy={y2} r="3" fill="#eab308" />
                            </g>
                          )
                        }
                        if (annotation.index < zoomRange.start || annotation.index >= zoomRange.end) return null
                        const x = toX(annotation.index - zoomRange.start)
                        const y = toY(annotation.price)
                        if (annotation.type === "circle") {
                          return <circle key={annotation.id} cx={x} cy={y} r="8" fill="none" stroke="#38bdf8" strokeWidth="1.4" />
                        }
                        if (annotation.type === "text") {
                          return (
                            <text key={annotation.id} x={x + 6} y={y - 6} fontSize="12" fill={isDark ? "#e2e8f0" : "#1e293b"}>
                              {annotation.text}
                            </text>
                          )
                        }
                        return (
                          <text key={annotation.id} x={x + 5} y={y - 4} fontSize="14">
                            {annotation.text}
                          </text>
                        )
                      })}
                  </svg>

                  <div className={cn("absolute left-2 bottom-2 flex items-center gap-2 text-[11px]", isDark ? "text-slate-400" : "text-slate-600")}>
                    <button className={cn("rounded px-2 py-0.5", isDark ? "bg-[#0d1e40] hover:bg-[#142a56]" : "bg-slate-200 hover:bg-slate-300")}>3m</button>
                    <button className={cn("rounded px-2 py-0.5", isDark ? "bg-[#0d1e40] hover:bg-[#142a56]" : "bg-slate-200 hover:bg-slate-300")}>5d</button>
                    <button className={cn("rounded px-2 py-0.5", isDark ? "bg-[#0d1e40] hover:bg-[#142a56]" : "bg-slate-200 hover:bg-slate-300")}>1d</button>
                    <button className={cn("rounded px-2 py-0.5", isDark ? "bg-[#0d1e40] hover:bg-[#142a56]" : "bg-slate-200 hover:bg-slate-300")}>↩</button>
                  </div>
                  <div className={cn("absolute right-2 bottom-2 text-[11px]", isDark ? "text-slate-400" : "text-slate-600")}>06:38:57 UTC</div>
                  <div className={cn("absolute right-2 top-2 rounded px-2 py-1 text-[11px]", isDark ? "bg-[#102248] text-slate-200" : "bg-slate-200 text-slate-700")}>
                    {selectedQuote?.last.toFixed(decimals)}
                  </div>
                </div>
              </div>
              <div className={cn("px-4 py-2.5 border-t flex items-center justify-between text-xs", isDark ? "border-[#1b2a46] text-slate-400 bg-[#050b18]" : "border-slate-200 text-slate-600 bg-slate-50")}>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span>Indicators and drawing tools active</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1 text-emerald-400"><TrendingUp className="h-3.5 w-3.5" /> Bullish</span>
                  <span className="inline-flex items-center gap-1" style={{ color: STRESS_COLOR }}><TrendingDown className="h-3.5 w-3.5" /> Volatility</span>
                  <span className={cn("inline-flex items-center gap-1", isDark ? "text-slate-500" : "text-slate-600")}>Active Tool: {toolNames[selectedTool]}</span>
                </div>
              </div>
            </div>

            <div className={cn("p-4 space-y-4 border-t lg:border-t-0 xl:border-t-0", isDark ? "border-[#1b2a46] bg-[#070f21]" : "border-slate-200 bg-white")}>
              <Tabs defaultValue="order" className="space-y-3">
                <TabsList className={cn("grid w-full grid-cols-3 border", isDark ? "bg-[#0b1730] border-[#223a61]" : "bg-slate-100 border-slate-300")}>
                  <TabsTrigger value="order">Order</TabsTrigger>
                  <TabsTrigger value="risk">Risk</TabsTrigger>
                  <TabsTrigger value="alerts">Alerts</TabsTrigger>
                </TabsList>

                <TabsContent value="order" className="space-y-3">
                  <div className={cn("rounded-xl border p-3 space-y-3", isDark ? "border-[#1f3358] bg-[#050b18]" : "border-slate-300 bg-slate-50")}>
                    <div className="flex items-center justify-between">
                      <h3 className={cn("font-semibold", isDark ? "text-slate-100" : "text-slate-800")}>{selectedSymbol} order</h3>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditOrderId(null)}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className={cn("grid grid-cols-2 rounded-md border p-1", isDark ? "border-[#253a62] bg-[#0a152b]" : "border-slate-300 bg-white")}>
                      <Button
                        size="sm"
                        variant={orderExecutionMode === "market" ? "default" : "ghost"}
                        className="h-7"
                        onClick={() => setOrderExecutionMode("market")}
                      >
                        Market
                      </Button>
                      <Button
                        size="sm"
                        variant={orderExecutionMode === "pending" ? "default" : "ghost"}
                        className="h-7"
                        onClick={() => setOrderExecutionMode("pending")}
                      >
                        Pending
                      </Button>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Leverage</Label>
                      <Select value={String(selectedLeverage)} onValueChange={(value) => setSelectedLeverage(Number(value))}>
                        <SelectTrigger className={cn("h-8", isDark ? "bg-[#0b1730] border-[#2b436d] text-slate-100" : "bg-white border-slate-300 text-slate-800")}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[200, 500, 1000, 2000, 5000, 8000, 12000].map((value) => (
                            <SelectItem key={value} value={String(value)}>1:{value}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {orderExecutionMode === "pending" && (
                      <div className="space-y-1.5">
                        <Label>Pending Type</Label>
                        <Select value={orderType} onValueChange={(value) => setOrderType(value as OrderType)}>
                          <SelectTrigger className={cn("h-8", isDark ? "bg-[#0b1730] border-[#2b436d] text-slate-100" : "bg-white border-slate-300 text-slate-800")}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="limit">Limit</SelectItem>
                            <SelectItem value="stop">Stop</SelectItem>
                            <SelectItem value="stop_limit">Stop Limit</SelectItem>
                            <SelectItem value="trailing_stop">Trailing Stop</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderSide("sell")}
                        className={cn(
                          "rounded-md border p-2 text-left",
                          orderSide === "sell"
                            ? "border-red-400 bg-red-500/15"
                            : isDark ? "border-[#2a4068] bg-[#0b1730]" : "border-slate-300 bg-white"
                        )}
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-red-400">Sell</p>
                        <p className={cn("text-lg font-bold", isDark ? "text-slate-100" : "text-slate-900")}>{selectedQuote?.bid.toFixed(decimals)}</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderSide("buy")}
                        className={cn(
                          "rounded-md border p-2 text-left",
                          orderSide === "buy"
                            ? "border-blue-400 bg-blue-500/15"
                            : isDark ? "border-[#2a4068] bg-[#0b1730]" : "border-slate-300 bg-white"
                        )}
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-400">Buy</p>
                        <p className={cn("text-lg font-bold", isDark ? "text-slate-100" : "text-slate-900")}>{selectedQuote?.ask.toFixed(decimals)}</p>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant={orderSide === "sell" ? "destructive" : "outline"} onClick={() => setOrderSide("sell")}>Sell Side</Button>
                      <Button size="sm" variant={orderSide === "buy" ? "default" : "outline"} onClick={() => setOrderSide("buy")}>Buy Side</Button>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Volume</Label>
                      <div className={cn("flex items-center rounded-md border", isDark ? "border-[#2b436d] bg-[#0b1730]" : "border-slate-300 bg-white")}>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-none" onClick={() => setVolume((v) => Math.max(Number(v || "0") - 0.01, 0.01).toFixed(2))}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input type="number" value={volume} onChange={(e) => setVolume(e.target.value)} className={cn("h-8 border-0 text-center focus-visible:ring-0", isDark ? "bg-[#0b1730] text-slate-100" : "bg-white text-slate-800")} />
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-none" onClick={() => setVolume((v) => (Number(v || "0") + 0.01).toFixed(2))}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className={cn("text-[11px] text-right", isDark ? "text-slate-500" : "text-slate-500")}>{Number(volume || "0").toFixed(2)} lot</p>
                    </div>

                    {(orderType === "stop" || orderType === "stop_limit") && (
                      <div className="space-y-1.5">
                        <Label>Stop Price</Label>
                        <Input type="number" value={stopPrice} onChange={(e) => setStopPrice(e.target.value)} className={cn(isDark ? "bg-[#0b1730] border-[#2b436d] text-slate-100" : "bg-white border-slate-300 text-slate-800")} />
                      </div>
                    )}
                    {(orderType === "limit" || orderType === "stop_limit") && (
                      <div className="space-y-1.5">
                        <Label>Limit Price</Label>
                        <Input type="number" value={limitPrice} onChange={(e) => setLimitPrice(e.target.value)} className={cn(isDark ? "bg-[#0b1730] border-[#2b436d] text-slate-100" : "bg-white border-slate-300 text-slate-800")} />
                      </div>
                    )}
                    {orderType === "trailing_stop" && (
                      <div className="space-y-1.5">
                        <Label>Trailing Distance</Label>
                        <Input type="number" value={trailingDistance} onChange={(e) => setTrailingDistance(e.target.value)} className={cn(isDark ? "bg-[#0b1730] border-[#2b436d] text-slate-100" : "bg-white border-slate-300 text-slate-800")} />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className={cn("justify-between", isDark ? "border-[#2b436d] bg-[#0b1730]" : "")} onClick={() => setTakeProfit((selectedQuote?.last ? (selectedQuote.last + (selectedQuote.spread ?? 0) * 2).toFixed(decimals) : ""))}>
                        <span>Take profit</span>
                        <Plus className="h-3.5 w-3.5 text-emerald-400" />
                      </Button>
                      <Button variant="outline" className={cn("justify-between", isDark ? "border-[#2b436d] bg-[#0b1730]" : "")} onClick={() => setStopLoss((selectedQuote?.last ? (selectedQuote.last - (selectedQuote.spread ?? 0) * 2).toFixed(decimals) : ""))}>
                        <span>Stop loss</span>
                        <Plus className="h-3.5 w-3.5" style={{ color: STRESS_COLOR }} />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="SL" type="number" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} className={cn(isDark ? "bg-[#0b1730] border-[#2b436d] text-slate-100" : "bg-white border-slate-300 text-slate-800")} />
                      <Input placeholder="TP" type="number" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} className={cn(isDark ? "bg-[#0b1730] border-[#2b436d] text-slate-100" : "bg-white border-slate-300 text-slate-800")} />
                    </div>

                    <div className={cn("rounded-lg border p-3 text-sm space-y-1.5", isDark ? "border-[#2a4068] bg-[#0b1730]" : "border-slate-300 bg-white")}>
                      <p className={cn("font-medium", isDark ? "text-slate-100" : "text-slate-800")}>Trading Charges</p>
                      <div className={cn("flex justify-between", isDark ? "text-slate-300" : "text-slate-600")}><span>Spread</span><span>{selectedQuote?.spread.toFixed(decimals)} pips</span></div>
                      <div className={cn("flex justify-between", isDark ? "text-slate-300" : "text-slate-600")}><span>Commission</span><span>${estimatedCommission}</span></div>
                    </div>

                    <div className={cn("rounded-lg border p-3", isDark ? "border-[#2a4068] bg-[#0b1730]" : "border-slate-300 bg-white")}>
                      <div className="flex items-center justify-between">
                        <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>Leverage (Max {maxLeverage})</span>
                        <span className={cn("font-medium", isDark ? "text-slate-100" : "text-slate-800")}>1:{selectedLeverage}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-500")}>Margin Required</span>
                        <span className={cn("text-sm font-semibold", isDark ? "text-slate-100" : "text-slate-800")}>${marginRequired}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-500")}>Buying Power</span>
                        <span className="text-emerald-400 text-sm font-semibold">${buyingPower}</span>
                      </div>
                    </div>

                    <Button className="w-full h-10" onClick={submitOrder}>
                      Open {orderSide.toUpperCase()} Order
                    </Button>
                    <p className={cn("text-center text-xs", isDark ? "text-slate-500" : "text-slate-500")}>
                      {Number(volume || "0").toFixed(2)} lot @ {orderSide === "buy" ? selectedQuote?.ask.toFixed(decimals) : selectedQuote?.bid.toFixed(decimals)}
                    </p>

                    <Button variant="outline" className="w-full gap-1" onClick={() => actions.toggleWatchlist(selectedSymbol)}>
                      {state.watchlist.includes(selectedSymbol) ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                      {state.watchlist.includes(selectedSymbol) ? "Remove from Watchlist" : "Add to Watchlist"}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="risk" className="space-y-3">
                  <h3 className={cn("font-semibold", isDark ? "text-slate-100" : "text-slate-800")}>Risk Tools</h3>
                  <div className="space-y-2">
                    <Label>Account Capital</Label>
                    <Input type="number" value={riskCapital} onChange={(e) => setRiskCapital(e.target.value)} className={cn(isDark ? "bg-[#0b1730] border-[#2b436d] text-slate-100" : "bg-white border-slate-300 text-slate-800")} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label>Risk %</Label>
                      <Input type="number" value={riskPercent} onChange={(e) => setRiskPercent(e.target.value)} className={cn(isDark ? "bg-[#0b1730] border-[#2b436d] text-slate-100" : "bg-white border-slate-300 text-slate-800")} />
                    </div>
                    <div className="space-y-2">
                      <Label>Stop (pips)</Label>
                      <Input type="number" value={riskStopPips} onChange={(e) => setRiskStopPips(e.target.value)} className={cn(isDark ? "bg-[#0b1730] border-[#2b436d] text-slate-100" : "bg-white border-slate-300 text-slate-800")} />
                    </div>
                  </div>
                  <div className={cn("rounded-lg border p-3 space-y-1 text-sm", isDark ? "border-[#2a4068] bg-[#0b1730]" : "border-slate-300 bg-slate-50")}>
                    <div className="flex justify-between"><span className={cn(isDark ? "text-slate-300" : "text-slate-600")}>Risk Amount</span><span className={cn("font-medium", isDark ? "text-slate-100" : "text-slate-800")}>${riskAmount.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className={cn(isDark ? "text-slate-300" : "text-slate-600")}>Suggested Lot</span><span className={cn("font-medium", isDark ? "text-slate-100" : "text-slate-800")}>{suggestedLot}</span></div>
                    <div className="flex justify-between"><span className={cn(isDark ? "text-slate-300" : "text-slate-600")}>Leverage</span><span className={cn("font-medium", isDark ? "text-slate-100" : "text-slate-800")}>1:{selectedLeverage}</span></div>
                  </div>
                  <div className={cn("rounded-lg border p-3", isDark ? "border-[#2a4068] bg-[#0b1730]" : "border-slate-300 bg-slate-50")}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={cn("text-sm font-medium", isDark ? "text-slate-100" : "text-slate-800")}>Daily Loss Guard</p>
                        <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-600")}>Auto-close and block new risk when max daily loss is breached.</p>
                      </div>
                      <Switch
                        checked={state.riskGuardEnabled}
                        onCheckedChange={(checked) => actions.setRiskGuard(checked, state.maxDailyLoss)}
                      />
                    </div>
                    <div className="mt-2 space-y-1.5">
                      <Label>Max Daily Loss</Label>
                      <Input
                        type="number"
                        value={state.maxDailyLoss}
                        className={cn(isDark ? "bg-[#0b1730] border-[#2b436d] text-slate-100" : "bg-white border-slate-300 text-slate-800")}
                        onChange={(e) => actions.setRiskGuard(state.riskGuardEnabled, Number(e.target.value))}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="alerts" className="space-y-3">
                  <h3 className={cn("font-semibold", isDark ? "text-slate-100" : "text-slate-800")}>Price Alerts</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={alertCondition} onValueChange={(value) => setAlertCondition(value as "above" | "below")}>
                      <SelectTrigger className={cn(isDark ? "bg-[#0b1730] border-[#2b436d] text-slate-100" : "bg-white border-slate-300 text-slate-800")}><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="above">Above</SelectItem>
                        <SelectItem value="below">Below</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Target price" type="number" value={alertPrice} className={cn(isDark ? "bg-[#0b1730] border-[#2b436d] text-slate-100" : "bg-white border-slate-300 text-slate-800")} onChange={(e) => setAlertPrice(e.target.value)} />
                  </div>
                  <Button className="w-full" variant="outline" onClick={createAlert}>Create Alert</Button>
                  <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                    {state.alerts.length === 0 ? (
                      <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-600")}>No alerts created yet.</p>
                    ) : (
                      state.alerts.map((alert) => (
                        <div key={alert.id} className={cn("rounded-lg border p-2 text-sm", isDark ? "border-[#2a4068] bg-[#0b1730]" : "border-slate-300 bg-slate-50")}>
                          <div className="flex items-center justify-between">
                            <p className={cn("font-medium", isDark ? "text-slate-100" : "text-slate-800")}>{alert.symbol} {alert.condition} {alert.targetPrice}</p>
                            <Badge variant={alert.status === "triggered" ? "default" : "secondary"}>{alert.status}</Badge>
                          </div>
                          <div className="mt-1 flex justify-end">
                            {alert.status !== "dismissed" && (
                              <Button size="sm" variant="ghost" onClick={() => actions.dismissAlert(alert.id)}>Dismiss</Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className={cn("border-t p-4", isDark ? "border-[#1b2a46] bg-[#050d1d]" : "border-slate-200 bg-slate-50")}>
            <Tabs defaultValue="positions" className="space-y-3">
              <TabsList className={cn("grid w-full max-w-md grid-cols-3 border", isDark ? "bg-[#0a1832] border-[#21395f]" : "bg-white border-slate-300")}>
                <TabsTrigger value="positions">Positions</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="positions" className="space-y-2 overflow-x-auto">
                <div className="flex items-center gap-2 mb-1">
                  <Clock3 className={cn("h-4 w-4", isDark ? "text-slate-400" : "text-slate-500")} />
                  <h4 className={cn("font-semibold", isDark ? "text-slate-100" : "text-slate-800")}>Open Positions ({state.positions.length})</h4>
                </div>
                {state.positions.length === 0 ? (
                  <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-600")}>No open positions yet.</p>
                ) : (
                  <div className={cn("min-w-[640px] overflow-hidden rounded-lg border", isDark ? "border-[#21395f] bg-[#08132b]" : "border-slate-300 bg-white")}>
                    <table className="w-full text-sm">
                      <thead className={cn(isDark ? "bg-[#102247] text-slate-300" : "bg-slate-100 text-slate-600")}>
                        <tr>
                          <th className="px-3 py-2 text-left">Symbol</th>
                          <th className="px-3 py-2 text-left">Side</th>
                          <th className="px-3 py-2 text-left">Volume</th>
                          <th className="px-3 py-2 text-left">Entry</th>
                          <th className="px-3 py-2 text-left">Current</th>
                          <th className="px-3 py-2 text-left">P/L</th>
                          <th className="px-3 py-2 text-left">SL</th>
                          <th className="px-3 py-2 text-left">TP</th>
                          <th className="px-3 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {state.positions.map((position) => (
                          <tr key={position.id} className="border-t border-border">
                            <td className="px-3 py-2">{position.symbol}</td>
                            <td className="px-3 py-2">{position.side.toUpperCase()}</td>
                            <td className="px-3 py-2">{position.volume.toFixed(2)}</td>
                            <td className="px-3 py-2">{position.entryPrice}</td>
                            <td className="px-3 py-2">{position.currentPrice}</td>
                            <td className={cn("px-3 py-2 font-medium", position.unrealizedPnl >= 0 ? "text-green-500" : "text-red-500")}>
                              {position.unrealizedPnl >= 0 ? "+" : ""}${position.unrealizedPnl.toFixed(2)}
                            </td>
                            <td className="px-3 py-2">{position.stopLoss ?? "-"}</td>
                            <td className="px-3 py-2">{position.takeProfit ?? "-"}</td>
                            <td className="px-3 py-2">
                              <Button size="sm" variant="destructive" onClick={() => actions.closePosition(position.id)}>
                                Close
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pending" className="space-y-2 overflow-x-auto">
                <div className={cn("min-w-[640px] overflow-hidden rounded-lg border", isDark ? "border-[#21395f] bg-[#08132b]" : "border-slate-300 bg-white")}>
                  <table className="w-full text-sm">
                    <thead className={cn(isDark ? "bg-[#102247] text-slate-300" : "bg-slate-100 text-slate-600")}>
                      <tr>
                        <th className="px-3 py-2 text-left">Symbol</th>
                        <th className="px-3 py-2 text-left">Type</th>
                        <th className="px-3 py-2 text-left">Volume</th>
                        <th className="px-3 py-2 text-left">Stop</th>
                        <th className="px-3 py-2 text-left">Limit</th>
                        <th className="px-3 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.pendingOrders.map((order) => (
                        <tr key={order.id} className="border-t border-border">
                          <td className="px-3 py-2">{order.symbol}</td>
                          <td className="px-3 py-2">{order.side.toUpperCase()} {order.type.toUpperCase()}</td>
                          <td className="px-3 py-2">{order.volume.toFixed(2)}</td>
                          <td className="px-3 py-2">{order.stopPrice ?? "-"}</td>
                          <td className="px-3 py-2">{order.limitPrice ?? "-"}</td>
                          <td className="px-3 py-2">
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" onClick={() => startEdit(order)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => actions.cancelPendingOrder(order.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {editOrderId && (
                  <Card className={cn("p-3 space-y-2", isDark ? "border-[#203a63] bg-[#091630]" : "border-slate-300 bg-white")}>
                    <div className="flex items-center justify-between">
                      <p className={cn("text-sm font-medium", isDark ? "text-slate-100" : "text-slate-800")}>Edit Pending Order</p>
                      <Button variant="ghost" size="icon" onClick={() => setEditOrderId(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Input value={editVolume} onChange={(e) => setEditVolume(e.target.value)} placeholder="Volume" className={cn(isDark ? "bg-[#0b1730] border-[#2b436d] text-slate-100" : "bg-white border-slate-300 text-slate-800")} />
                      <Input value={editStop} onChange={(e) => setEditStop(e.target.value)} placeholder="Stop" className={cn(isDark ? "bg-[#0b1730] border-[#2b436d] text-slate-100" : "bg-white border-slate-300 text-slate-800")} />
                      <Input value={editLimit} onChange={(e) => setEditLimit(e.target.value)} placeholder="Limit" className={cn(isDark ? "bg-[#0b1730] border-[#2b436d] text-slate-100" : "bg-white border-slate-300 text-slate-800")} />
                    </div>
                    <Button size="sm" onClick={saveEdit}>Save Changes</Button>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-2 overflow-x-auto">
                <div className={cn("min-w-[640px] overflow-hidden rounded-lg border", isDark ? "border-[#21395f] bg-[#08132b]" : "border-slate-300 bg-white")}>
                  <table className="w-full text-sm">
                    <thead className={cn(isDark ? "bg-[#102247] text-slate-300" : "bg-slate-100 text-slate-600")}>
                      <tr>
                        <th className="px-3 py-2 text-left">Symbol</th>
                        <th className="px-3 py-2 text-left">Side</th>
                        <th className="px-3 py-2 text-left">Close</th>
                        <th className="px-3 py-2 text-left">Reason</th>
                        <th className="px-3 py-2 text-left">P/L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.history.map((trade) => (
                        <tr key={trade.id} className="border-t border-border">
                          <td className="px-3 py-2">{trade.symbol}</td>
                          <td className="px-3 py-2">{trade.side.toUpperCase()}</td>
                          <td className="px-3 py-2">{trade.closePrice}</td>
                          <td className="px-3 py-2">{trade.reason.replace("_", " ")}</td>
                          <td className={trade.realizedPnl >= 0 ? "px-3 py-2 font-semibold text-green-600 dark:text-green-400" : "px-3 py-2 font-semibold text-red-600 dark:text-red-400"}>
                            {trade.realizedPnl >= 0 ? "+" : ""}${trade.realizedPnl.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className={cn("border-t px-4 py-3 text-xs flex flex-wrap gap-4", isDark ? "border-[#1b2a46] text-slate-300 bg-[#050a16]" : "border-slate-200 text-slate-600 bg-slate-100")}>
            <span>Balance: ${state.balance.toFixed(2)}</span>
            <span>Equity: ${metrics.equity.toFixed(2)}</span>
            <span>Open P/L: {metrics.openPnl >= 0 ? "+" : ""}${metrics.openPnl.toFixed(2)}</span>
            <span>Open Volume: {metrics.openVolume.toFixed(2)} lots</span>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
