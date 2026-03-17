"use client"

import { useEffect, useMemo, useState } from "react"

export type OrderSide = "buy" | "sell"
export type OrderType = "market" | "limit" | "stop" | "stop_limit" | "trailing_stop"
export type AlertCondition = "above" | "below"

export interface MarketQuote {
  symbol: string
  open: number
  last: number
  bid: number
  ask: number
  spread: number
  changePercent: number
}

export interface Position {
  id: string
  symbol: string
  side: OrderSide
  volume: number
  entryPrice: number
  currentPrice: number
  stopLoss: number | null
  takeProfit: number | null
  trailingDistance: number | null
  bestPrice: number
  openedAt: string
  unrealizedPnl: number
}

export interface PendingOrder {
  id: string
  symbol: string
  side: OrderSide
  type: Exclude<OrderType, "market" | "trailing_stop">
  volume: number
  stopPrice: number | null
  limitPrice: number | null
  stopLoss: number | null
  takeProfit: number | null
  createdAt: string
}

export interface TradeHistoryItem {
  id: string
  symbol: string
  side: OrderSide
  volume: number
  openPrice: number
  closePrice: number
  openedAt: string
  closedAt: string
  realizedPnl: number
  reason: "manual" | "stop_loss" | "take_profit" | "triggered" | "guard"
}

export interface PriceAlert {
  id: string
  symbol: string
  condition: AlertCondition
  targetPrice: number
  status: "active" | "triggered" | "dismissed"
  createdAt: string
  triggeredAt: string | null
}

export interface TradingState {
  quotes: Record<string, MarketQuote>
  watchlist: string[]
  positions: Position[]
  pendingOrders: PendingOrder[]
  history: TradeHistoryItem[]
  alerts: PriceAlert[]
  riskGuardEnabled: boolean
  maxDailyLoss: number
  balance: number
}

const STORAGE_KEY = "forexpro-trading-sim-v2"
const TICK_MS = 1400
const DEFAULT_WATCHLIST = ["EURUSD", "GBPUSD", "USDJPY", "AUDUSD", "NZDUSD", "USDCAD", "XAUUSD"]

const DEFAULT_QUOTES: Record<string, MarketQuote> = {
  EURUSD: createQuote("EURUSD", 1.0946, 0.0002),
  GBPUSD: createQuote("GBPUSD", 1.2835, 0.0002),
  USDJPY: createQuote("USDJPY", 149.53, 0.03),
  AUDUSD: createQuote("AUDUSD", 0.6579, 0.0002),
  NZDUSD: createQuote("NZDUSD", 0.6013, 0.0002),
  USDCAD: createQuote("USDCAD", 1.3655, 0.0002),
  XAUUSD: createQuote("XAUUSD", 2152.2, 0.4),
}

const DEFAULT_STATE: TradingState = {
  quotes: DEFAULT_QUOTES,
  watchlist: DEFAULT_WATCHLIST,
  positions: [],
  pendingOrders: [],
  history: [],
  alerts: [],
  riskGuardEnabled: false,
  maxDailyLoss: 1200,
  balance: 15000,
}

function createQuote(symbol: string, last: number, spread: number): MarketQuote {
  const bid = Number((last - spread / 2).toFixed(getPriceDecimals(symbol)))
  const ask = Number((last + spread / 2).toFixed(getPriceDecimals(symbol)))
  return { symbol, open: last, last, bid, ask, spread, changePercent: 0 }
}

function getPriceDecimals(symbol: string) {
  if (symbol.includes("JPY")) return 3
  if (symbol === "XAUUSD") return 2
  return 5
}

function symbolMultiplier(symbol: string) {
  if (symbol === "XAUUSD") return 100
  if (symbol.includes("JPY")) return 1000
  return 10000
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function normalizeState(raw: TradingState): TradingState {
  return {
    ...DEFAULT_STATE,
    ...raw,
    quotes: { ...DEFAULT_QUOTES, ...raw.quotes },
    watchlist: raw.watchlist?.length ? raw.watchlist : DEFAULT_WATCHLIST,
    positions: Array.isArray(raw.positions) ? raw.positions : [],
    pendingOrders: Array.isArray(raw.pendingOrders) ? raw.pendingOrders : [],
    history: Array.isArray(raw.history) ? raw.history : [],
    alerts: Array.isArray(raw.alerts) ? raw.alerts : [],
  }
}

function computePositionPnl(symbol: string, side: OrderSide, entry: number, current: number, volume: number) {
  const direction = side === "buy" ? 1 : -1
  return (current - entry) * direction * volume * symbolMultiplier(symbol)
}

function simulateQuotes(prevQuotes: TradingState["quotes"]) {
  const nextQuotes: TradingState["quotes"] = {}
  for (const quote of Object.values(prevQuotes)) {
    const volatility = quote.symbol === "XAUUSD" ? 0.0009 : 0.0005
    const drift = (Math.random() - 0.5) * volatility
    const nextLast = Number((quote.last * (1 + drift)).toFixed(getPriceDecimals(quote.symbol)))
    const nextBid = Number((nextLast - quote.spread / 2).toFixed(getPriceDecimals(quote.symbol)))
    const nextAsk = Number((nextLast + quote.spread / 2).toFixed(getPriceDecimals(quote.symbol)))
    const changePercent = ((nextLast - quote.open) / quote.open) * 100
    nextQuotes[quote.symbol] = {
      ...quote,
      last: nextLast,
      bid: nextBid,
      ask: nextAsk,
      changePercent: Number(changePercent.toFixed(2)),
    }
  }
  return nextQuotes
}

function closePositionIntoHistory(state: TradingState, position: Position, closePrice: number, reason: TradeHistoryItem["reason"]) {
  const realizedPnl = computePositionPnl(position.symbol, position.side, position.entryPrice, closePrice, position.volume)
  const historyItem: TradeHistoryItem = {
    id: makeId("H"),
    symbol: position.symbol,
    side: position.side,
    volume: position.volume,
    openPrice: position.entryPrice,
    closePrice,
    openedAt: position.openedAt,
    closedAt: new Date().toISOString(),
    realizedPnl,
    reason,
  }
  return {
    ...state,
    positions: state.positions.filter((p) => p.id !== position.id),
    history: [historyItem, ...state.history],
    balance: state.balance + realizedPnl,
  }
}

function triggerPendingOrders(state: TradingState): TradingState {
  let next = { ...state }
  const toOpen: Position[] = []
  const pendingKeep: PendingOrder[] = []

  for (const order of next.pendingOrders) {
    const quote = next.quotes[order.symbol]
    if (!quote) {
      pendingKeep.push(order)
      continue
    }

    const buy = order.side === "buy"
    let triggered = false

    if (order.type === "limit" && order.limitPrice !== null) {
      triggered = buy ? quote.ask <= order.limitPrice : quote.bid >= order.limitPrice
    } else if (order.type === "stop" && order.stopPrice !== null) {
      triggered = buy ? quote.ask >= order.stopPrice : quote.bid <= order.stopPrice
    } else if (order.type === "stop_limit" && order.stopPrice !== null && order.limitPrice !== null) {
      const stopReached = buy ? quote.ask >= order.stopPrice : quote.bid <= order.stopPrice
      triggered = stopReached
    }

    if (!triggered) {
      pendingKeep.push(order)
      continue
    }

    const entryPrice =
      order.type === "limit" || order.type === "stop_limit"
        ? Number((order.limitPrice ?? quote.last).toFixed(getPriceDecimals(order.symbol)))
        : Number((buy ? quote.ask : quote.bid).toFixed(getPriceDecimals(order.symbol)))
    const currentPrice = buy ? quote.bid : quote.ask
    toOpen.push({
      id: makeId("P"),
      symbol: order.symbol,
      side: order.side,
      volume: order.volume,
      entryPrice,
      currentPrice,
      stopLoss: order.stopLoss,
      takeProfit: order.takeProfit,
      trailingDistance: null,
      bestPrice: currentPrice,
      openedAt: new Date().toISOString(),
      unrealizedPnl: computePositionPnl(order.symbol, order.side, entryPrice, currentPrice, order.volume),
    })
  }

  next.pendingOrders = pendingKeep
  if (toOpen.length) next.positions = [...toOpen, ...next.positions]
  return next
}

function repriceAndGuardPositions(state: TradingState): TradingState {
  let next = { ...state }
  const updated: Position[] = []

  for (const position of next.positions) {
    const quote = next.quotes[position.symbol]
    if (!quote) {
      updated.push(position)
      continue
    }

    const livePrice = position.side === "buy" ? quote.bid : quote.ask
    const bestPrice =
      position.side === "buy" ? Math.max(position.bestPrice, livePrice) : Math.min(position.bestPrice, livePrice)
    let stopLoss = position.stopLoss

    if (position.trailingDistance !== null) {
      if (position.side === "buy") {
        stopLoss = Number((bestPrice - position.trailingDistance).toFixed(getPriceDecimals(position.symbol)))
      } else {
        stopLoss = Number((bestPrice + position.trailingDistance).toFixed(getPriceDecimals(position.symbol)))
      }
    }

    const pnl = computePositionPnl(position.symbol, position.side, position.entryPrice, livePrice, position.volume)
    let slHit = false
    let tpHit = false
    if (position.side === "buy") {
      slHit = stopLoss !== null && quote.bid <= stopLoss
      tpHit = position.takeProfit !== null && quote.bid >= position.takeProfit
    } else {
      slHit = stopLoss !== null && quote.ask >= stopLoss
      tpHit = position.takeProfit !== null && quote.ask <= position.takeProfit
    }

    if (slHit || tpHit) {
      next = closePositionIntoHistory(next, position, livePrice, slHit ? "stop_loss" : "take_profit")
      continue
    }

    updated.push({
      ...position,
      currentPrice: livePrice,
      bestPrice,
      stopLoss,
      unrealizedPnl: pnl,
    })
  }

  next.positions = updated
  return next
}

function applyRiskGuard(state: TradingState): TradingState {
  if (!state.riskGuardEnabled) return state
  const today = new Date().toISOString().slice(0, 10)
  const realizedToday = state.history
    .filter((item) => item.closedAt.slice(0, 10) === today)
    .reduce((sum, item) => sum + item.realizedPnl, 0)
  if (realizedToday >= -Math.abs(state.maxDailyLoss)) return state

  let next = { ...state }
  for (const position of state.positions) {
    next = closePositionIntoHistory(next, position, position.currentPrice, "guard")
  }
  return { ...next, pendingOrders: [] }
}

function applyAlerts(state: TradingState): TradingState {
  const alerts = state.alerts.map((alert) => {
    if (alert.status !== "active") return alert
    const quote = state.quotes[alert.symbol]
    if (!quote) return alert
    const hit = alert.condition === "above" ? quote.last >= alert.targetPrice : quote.last <= alert.targetPrice
    if (!hit) return alert
    return { ...alert, status: "triggered" as const, triggeredAt: new Date().toISOString() }
  })
  return { ...state, alerts }
}

function tickState(state: TradingState) {
  let next: TradingState = { ...state, quotes: simulateQuotes(state.quotes) }
  next = triggerPendingOrders(next)
  next = repriceAndGuardPositions(next)
  next = applyAlerts(next)
  next = applyRiskGuard(next)
  return next
}

export function useTradingSim() {
  const [state, setState] = useState<TradingState>(DEFAULT_STATE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setState(normalizeState(JSON.parse(raw)))
    } catch {
      setState(DEFAULT_STATE)
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state, hydrated])

  useEffect(() => {
    if (!hydrated) return
    const id = setInterval(() => {
      setState((prev) => tickState(prev))
    }, TICK_MS)
    return () => clearInterval(id)
  }, [hydrated])

  const metrics = useMemo(() => {
    const openPnl = state.positions.reduce((sum, p) => sum + p.unrealizedPnl, 0)
    const realizedPnl = state.history.reduce((sum, t) => sum + t.realizedPnl, 0)
    const equity = state.balance + openPnl
    const openVolume = state.positions.reduce((sum, p) => sum + p.volume, 0)
    return { openPnl, realizedPnl, equity, openVolume }
  }, [state])

  const placeOrder = (input: {
    symbol: string
    side: OrderSide
    type: OrderType
    volume: number
    stopPrice?: number
    limitPrice?: number
    stopLoss?: number
    takeProfit?: number
    trailingDistance?: number
  }) => {
    const quote = state.quotes[input.symbol]
    if (!quote) return { ok: false, message: "Unknown symbol." }
    if (!Number.isFinite(input.volume) || input.volume <= 0) return { ok: false, message: "Volume must be greater than 0." }

    if (input.type === "market" || input.type === "trailing_stop") {
      const entryPrice = input.side === "buy" ? quote.ask : quote.bid
      const currentPrice = input.side === "buy" ? quote.bid : quote.ask
      const trailingDistance = input.type === "trailing_stop" ? (input.trailingDistance ?? null) : null
      const position: Position = {
        id: makeId("P"),
        symbol: input.symbol,
        side: input.side,
        volume: input.volume,
        entryPrice,
        currentPrice,
        stopLoss: input.stopLoss ?? null,
        takeProfit: input.takeProfit ?? null,
        trailingDistance,
        bestPrice: currentPrice,
        openedAt: new Date().toISOString(),
        unrealizedPnl: computePositionPnl(input.symbol, input.side, entryPrice, currentPrice, input.volume),
      }
      setState((prev) => ({ ...prev, positions: [position, ...prev.positions] }))
      return { ok: true, message: "Position opened successfully." }
    }

    const needsStop = input.type === "stop" || input.type === "stop_limit"
    const needsLimit = input.type === "limit" || input.type === "stop_limit"
    if (needsStop && !input.stopPrice) return { ok: false, message: "Stop price is required." }
    if (needsLimit && !input.limitPrice) return { ok: false, message: "Limit price is required." }

    const pending: PendingOrder = {
      id: makeId("O"),
      symbol: input.symbol,
      side: input.side,
      type: input.type,
      volume: input.volume,
      stopPrice: input.stopPrice ?? null,
      limitPrice: input.limitPrice ?? null,
      stopLoss: input.stopLoss ?? null,
      takeProfit: input.takeProfit ?? null,
      createdAt: new Date().toISOString(),
    }
    setState((prev) => ({ ...prev, pendingOrders: [pending, ...prev.pendingOrders] }))
    return { ok: true, message: "Pending order created." }
  }

  const modifyPendingOrder = (orderId: string, patch: Partial<Pick<PendingOrder, "stopPrice" | "limitPrice" | "stopLoss" | "takeProfit" | "volume">>) => {
    setState((prev) => ({
      ...prev,
      pendingOrders: prev.pendingOrders.map((order) => (order.id === orderId ? { ...order, ...patch } : order)),
    }))
  }

  const cancelPendingOrder = (orderId: string) => {
    setState((prev) => ({ ...prev, pendingOrders: prev.pendingOrders.filter((order) => order.id !== orderId) }))
  }

  const closePosition = (positionId: string, reason: TradeHistoryItem["reason"] = "manual") => {
    setState((prev) => {
      const target = prev.positions.find((p) => p.id === positionId)
      if (!target) return prev
      return closePositionIntoHistory(prev, target, target.currentPrice, reason)
    })
  }

  const closeAllPositions = () => {
    setState((prev) => {
      let next = { ...prev }
      for (const p of prev.positions) {
        next = closePositionIntoHistory(next, p, p.currentPrice, "manual")
      }
      return next
    })
  }

  const updatePositionRisk = (
    positionId: string,
    patch: Partial<Pick<Position, "stopLoss" | "takeProfit" | "trailingDistance">>
  ) => {
    setState((prev) => ({
      ...prev,
      positions: prev.positions.map((position) => (position.id === positionId ? { ...position, ...patch } : position)),
    }))
  }

  const toggleWatchlist = (symbol: string) => {
    setState((prev) => {
      if (prev.watchlist.includes(symbol)) {
        return { ...prev, watchlist: prev.watchlist.filter((item) => item !== symbol) }
      }
      return { ...prev, watchlist: [...prev.watchlist, symbol] }
    })
  }

  const addAlert = (symbol: string, condition: AlertCondition, targetPrice: number) => {
    const alert: PriceAlert = {
      id: makeId("A"),
      symbol,
      condition,
      targetPrice,
      status: "active",
      createdAt: new Date().toISOString(),
      triggeredAt: null,
    }
    setState((prev) => ({ ...prev, alerts: [alert, ...prev.alerts] }))
  }

  const dismissAlert = (alertId: string) => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((alert) => (alert.id === alertId ? { ...alert, status: "dismissed" } : alert)),
    }))
  }

  const setRiskGuard = (enabled: boolean, maxLoss?: number) => {
    setState((prev) => ({
      ...prev,
      riskGuardEnabled: enabled,
      maxDailyLoss: typeof maxLoss === "number" && Number.isFinite(maxLoss) ? Math.abs(maxLoss) : prev.maxDailyLoss,
    }))
  }

  return {
    state,
    metrics,
    hydrated,
    actions: {
      placeOrder,
      modifyPendingOrder,
      cancelPendingOrder,
      closePosition,
      closeAllPositions,
      updatePositionRisk,
      toggleWatchlist,
      addAlert,
      dismissAlert,
      setRiskGuard,
    },
  }
}
