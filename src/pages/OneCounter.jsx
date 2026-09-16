import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Truck,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Plus,
  Minus,
  CheckCircle2,
  Calendar,
  Lock,
  Pause,
  Play,
  XCircle,
  TrendingUp,
  ShieldCheck,
  Utensils,
  Droplets,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'
import { useEvents } from '../context/EventContext'
import { useFinance } from '../hooks/useFinance'
import { formatCurrency, formatNumber } from '../utils/formatters'

export function OneCounter() {
  const toast = useToast()
  const { events, activeEventId } = useEvents()
  const {
    products,
    getDailyStock,
    recordSaleIncrement,
    updateDailyStock,
    getDailyFinancials,
    closings,
    counterStatus,
    setCounterStatus,
  } = useFinance()

  const [activeDay, setActiveDay] = useState(1) // 1, 2, or 3
  const [customModalProduct, setCustomModalProduct] = useState(null)
  const [customQuantity, setCustomQuantity] = useState('')
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false)
  const [correctionTarget, setCorrectionTarget] = useState(null)
  const [correctionQty, setCorrectionQty] = useState('')
  const [correctionReason, setCorrectionReason] = useState('')

  // Current event
  const event = useMemo(() => {
    return (
      events.find((e) => e.id === 'evt-college-3day') ||
      events.find((e) => e.id === activeEventId) ||
      events[0]
    )
  }, [events, activeEventId])

  // Current day stock
  const currentStock = useMemo(() => {
    return getDailyStock(event?.id, activeDay)
  }, [getDailyStock, event?.id, activeDay])

  // Current day financials
  const dayFin = useMemo(() => {
    return getDailyFinancials(event?.id, activeDay)
  }, [getDailyFinancials, event?.id, activeDay])

  const dayClosing = useMemo(() => {
    return closings.days[activeDay] || { isClosed: false }
  }, [closings, activeDay])

  // Products
  const biryaniStock = currentStock.find((s) => s.productName.toLowerCase().includes('biryani'))
  const popcornStock = currentStock.find((s) => s.productName.toLowerCase().includes('popcorn'))
  const waterStock = currentStock.find((s) => s.productName.toLowerCase().includes('water'))

  // Rapid increment handler
  const handleAdd = (productName, qty) => {
    if (dayClosing.isClosed) {
      toast.warning('Day Locked', `Day ${activeDay} is closed. Cannot record sales.`)
      return
    }
    if (counterStatus !== 'OPEN') {
      toast.warning('Counter Not Open', `Counter is currently ${counterStatus}. Set to OPEN to record sales.`)
      return
    }

    recordSaleIncrement(event?.id, activeDay, productName, qty)
    toast.success('Sale Added', `+${qty} ${productName} registered!`)
  }

  // Handle custom quantity addition
  const handleCustomSubmit = (e) => {
    e.preventDefault()
    const qty = parseInt(customQuantity, 10)
    if (!qty || qty <= 0) {
      toast.warning('Invalid Quantity', 'Please enter a quantity greater than 0.')
      return
    }
    if (customModalProduct) {
      handleAdd(customModalProduct.productName, qty)
      setCustomModalProduct(null)
      setCustomQuantity('')
    }
  }

  // Handle correction / deduction
  const handleCorrectionSubmit = (e) => {
    e.preventDefault()
    const qty = parseInt(correctionQty, 10)
    if (!qty || isNaN(qty)) {
      toast.warning('Invalid Value', 'Please enter a valid correction quantity.')
      return
    }
    if (!correctionTarget) return

    // Negative increment or direct replacement
    recordSaleIncrement(event?.id, activeDay, correctionTarget.productName, -qty)
    toast.info(
      'Stock Corrected',
      `Subtracted ${qty} ${correctionTarget.productName} for Reason: "${correctionReason || 'Operational adjustment'}"`
    )
    setIsCorrectionModalOpen(false)
    setCorrectionTarget(null)
    setCorrectionQty('')
    setCorrectionReason('')
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header with Counter Status Control */}
      <PageHeader
        title="ONE DISTRIBUTION / SALES COUNTER"
        description="Single central serving station for 30,000 Pax 3-Day Event. Bulk portion distribution, stock tracking, and real-time revenue collection."
        badge="Strictly 1 Counter"
        badgeVariant="gold"
        actions={
          <div className="flex items-center gap-2">
            <Link to={`/day-${activeDay}`}>
              <Button variant="outline" size="sm">
                Day {activeDay} Full Operations
              </Button>
            </Link>
            <Link to="/stock">
              <Button variant="outline" size="sm">
                Master Stock Register
              </Button>
            </Link>
          </div>
        }
      />

      {/* 2. OPERATIONAL STATUS & DAY SWITCHER BANNER */}
      <div className="p-5 rounded-2xl bg-[#163324] text-white shadow-md border border-[#c29c5e]/30 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase font-black tracking-widest text-[#c29c5e]">
              Central Event Station
            </span>
            <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-white/80 font-mono">
              NO AUXILIARY COUNTERS
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            COUNTER 1 — LIVE DISPATCH & SALES TERMINAL
          </h2>
          <p className="text-xs text-white/70">
            {event?.name} • Venue: {event?.venue}
          </p>
        </div>

        {/* Big Day Switcher + Status Selector */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Day Buttons */}
          <div className="inline-flex rounded-xl bg-black/40 p-1.5 border border-white/10">
            {[1, 2, 3].map((d) => {
              const isSelected = activeDay === d
              const isClosed = closings.days[d]?.isClosed
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setActiveDay(d)}
                  className={`px-4 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#c29c5e] text-[#163324] shadow-md scale-105'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  DAY {d}
                  {isClosed && <Lock className="w-3.5 h-3.5 text-red-300" />}
                </button>
              )
            })}
          </div>

          {/* Status Buttons */}
          <div className="inline-flex rounded-xl bg-black/40 p-1.5 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setCounterStatus('OPEN')
                toast.success('Counter Open', 'One Counter is now actively dispensing.')
              }}
              className={`px-3 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 ${
                counterStatus === 'OPEN'
                  ? 'bg-emerald-500 text-white shadow'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              OPEN
            </button>
            <button
              type="button"
              onClick={() => {
                setCounterStatus('PAUSED')
                toast.info('Counter Paused', 'One Counter temporarily paused (buffer reload).')
              }}
              className={`px-3 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 ${
                counterStatus === 'PAUSED'
                  ? 'bg-amber-500 text-white shadow'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              PAUSE
            </button>
            <button
              type="button"
              onClick={() => {
                setCounterStatus('CLOSED')
                toast.warning('Counter Closed', 'One Counter locked for service.')
              }}
              className={`px-3 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 ${
                counterStatus === 'CLOSED'
                  ? 'bg-red-500 text-white shadow'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              CLOSED
            </button>
          </div>
        </div>
      </div>

      {/* 3. MEGA TOTAL INCOME DISPLAY BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
              Day {activeDay} Total Counter Revenue
            </span>
            <h3 className="text-3xl font-black text-[#163324] font-mono mt-0.5">
              {formatCurrency(dayFin.totalSales)}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
              Total Portions / Units Sold
            </span>
            <h3 className="text-3xl font-black text-[#0f172a] font-mono mt-0.5">
              {formatNumber(currentStock.reduce((s, i) => s + (Number(i.soldDistributed) || 0), 0))}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
              Remaining Staged Buffer
            </span>
            <h3 className="text-3xl font-black text-amber-700 font-mono mt-0.5">
              {formatNumber(currentStock.reduce((s, i) => s + (Number(i.remainingStock) || 0), 0))}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 4. THREE CORE REAL-WORLD PRODUCT CARDS (LARGE TOUCH-ENABLED) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PRODUCT 1: CHICKEN BIRYANI */}
        <Card className="border-2 border-[#163324]/30 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-[#163324] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#c29c5e]/20 text-[#c29c5e] flex items-center justify-center font-bold">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black leading-tight text-white">Chicken Biryani</h3>
                <span className="text-xs text-emerald-300 font-mono">Box / Portion</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase text-white/70 block font-bold">Price</span>
              <span className="text-xl font-black text-[#c29c5e] font-mono">
                ₹{biryaniStock?.price || 150}
              </span>
            </div>
          </div>

          <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
            {/* Live Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="text-[10px] uppercase font-bold text-[#64748b] block">Available</span>
                <span className="text-lg font-black text-[#0f172a] font-mono">
                  {formatNumber(biryaniStock?.availableStock || 5000)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Sold</span>
                <span className="text-xl font-black text-[#163324] font-mono">
                  {formatNumber(biryaniStock?.soldDistributed || 4700)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">Remaining</span>
                <span className="text-lg font-black text-amber-700 font-mono">
                  {formatNumber(biryaniStock?.remainingStock || 300)}
                </span>
              </div>
            </div>

            {/* Total Income */}
            <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] flex items-center justify-between">
              <span className="text-xs text-[#64748b] font-bold uppercase">Biryani Income:</span>
              <span className="text-lg font-black text-[#163324] font-mono">
                ₹{(biryaniStock?.income || 705000).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Quick Increment Touch Pad */}
            <div className="space-y-2 pt-2 border-t border-[#f1f5f9]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] block">
                Quick Portion Dispense (+ Add Sale):
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={counterStatus !== 'OPEN' || dayClosing.isClosed}
                  onClick={() => handleAdd('Chicken Biryani', 10)}
                  className="py-3 px-2 bg-[#163324] hover:bg-[#0f2319] active:scale-95 text-white font-black text-sm rounded-xl transition shadow disabled:opacity-40"
                >
                  +10
                </button>
                <button
                  type="button"
                  disabled={counterStatus !== 'OPEN' || dayClosing.isClosed}
                  onClick={() => handleAdd('Chicken Biryani', 25)}
                  className="py-3 px-2 bg-[#163324] hover:bg-[#0f2319] active:scale-95 text-white font-black text-sm rounded-xl transition shadow disabled:opacity-40"
                >
                  +25
                </button>
                <button
                  type="button"
                  disabled={counterStatus !== 'OPEN' || dayClosing.isClosed}
                  onClick={() => handleAdd('Chicken Biryani', 50)}
                  className="py-3 px-2 bg-[#163324] hover:bg-[#0f2319] active:scale-95 text-white font-black text-sm rounded-xl transition shadow disabled:opacity-40"
                >
                  +50
                </button>
                <button
                  type="button"
                  disabled={counterStatus !== 'OPEN' || dayClosing.isClosed}
                  onClick={() => handleAdd('Chicken Biryani', 100)}
                  className="py-3 px-2 bg-[#163324] hover:bg-[#0f2319] active:scale-95 text-white font-black text-sm rounded-xl transition shadow disabled:opacity-40"
                >
                  +100
                </button>
                <button
                  type="button"
                  disabled={counterStatus !== 'OPEN' || dayClosing.isClosed}
                  onClick={() => handleAdd('Chicken Biryani', 250)}
                  className="py-3 px-2 bg-[#163324] hover:bg-[#0f2319] active:scale-95 text-white font-black text-sm rounded-xl transition shadow disabled:opacity-40"
                >
                  +250
                </button>
                <button
                  type="button"
                  disabled={counterStatus !== 'OPEN' || dayClosing.isClosed}
                  onClick={() => {
                    setCustomModalProduct(biryaniStock)
                    setCustomQuantity('')
                  }}
                  className="py-3 px-2 bg-[#c29c5e] hover:bg-[#ab864a] active:scale-95 text-[#163324] font-black text-sm rounded-xl transition shadow disabled:opacity-40"
                >
                  +Custom
                </button>
              </div>
            </div>

            {/* Stock Correction Button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setCorrectionTarget(biryaniStock)
                  setCorrectionQty('')
                  setCorrectionReason('')
                  setIsCorrectionModalOpen(true)
                }}
                className="text-xs text-[#64748b] hover:text-red-700 underline font-semibold inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Adjust / Correct Biryani Count
              </button>
            </div>
          </CardContent>
        </Card>

        {/* PRODUCT 2: POPCORN */}
        <Card className="border-2 border-amber-500/30 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-gradient-to-r from-amber-700 to-amber-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black leading-tight text-white">Popcorn</h3>
                <span className="text-xs text-amber-200 font-mono">Tub / Cone</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase text-white/70 block font-bold">Price</span>
              <span className="text-xl font-black text-amber-200 font-mono">
                ₹{popcornStock?.price || 30}
              </span>
            </div>
          </div>

          <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
            {/* Live Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="text-[10px] uppercase font-bold text-[#64748b] block">Available</span>
                <span className="text-lg font-black text-[#0f172a] font-mono">
                  {formatNumber(popcornStock?.availableStock || 2000)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Sold</span>
                <span className="text-xl font-black text-[#163324] font-mono">
                  {formatNumber(popcornStock?.soldDistributed || 1800)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">Remaining</span>
                <span className="text-lg font-black text-amber-700 font-mono">
                  {formatNumber(popcornStock?.remainingStock || 200)}
                </span>
              </div>
            </div>

            {/* Total Income */}
            <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] flex items-center justify-between">
              <span className="text-xs text-[#64748b] font-bold uppercase">Popcorn Income:</span>
              <span className="text-lg font-black text-amber-800 font-mono">
                ₹{(popcornStock?.income || 54000).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Quick Increment Touch Pad */}
            <div className="space-y-2 pt-2 border-t border-[#f1f5f9]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] block">
                Quick Popcorn Dispense (+ Add Sale):
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={counterStatus !== 'OPEN' || dayClosing.isClosed}
                  onClick={() => handleAdd('Popcorn', 10)}
                  className="py-3 px-2 bg-amber-700 hover:bg-amber-800 active:scale-95 text-white font-black text-sm rounded-xl transition shadow disabled:opacity-40"
                >
                  +10
                </button>
                <button
                  type="button"
                  disabled={counterStatus !== 'OPEN' || dayClosing.isClosed}
                  onClick={() => handleAdd('Popcorn', 25)}
                  className="py-3 px-2 bg-amber-700 hover:bg-amber-800 active:scale-95 text-white font-black text-sm rounded-xl transition shadow disabled:opacity-40"
                >
                  +25
                </button>
                <button
                  type="button"
                  disabled={counterStatus !== 'OPEN' || dayClosing.isClosed}
                  onClick={() => handleAdd('Popcorn', 50)}
                  className="py-3 px-2 bg-amber-700 hover:bg-amber-800 active:scale-95 text-white font-black text-sm rounded-xl transition shadow disabled:opacity-40"
                >
                  +50
                </button>
                <button
                  type="button"
                  disabled={counterStatus !== 'OPEN' || dayClosing.isClosed}
                  onClick={() => handleAdd('Popcorn', 100)}
                  className="py-3 px-2 bg-amber-700 hover:bg-amber-800 active:scale-95 text-white font-black text-sm rounded-xl transition shadow disabled:opacity-40"
                >
                  +100
                </button>
                <button
                  type="button"
                  disabled={counterStatus !== 'OPEN' || dayClosing.isClosed}
                  onClick={() => handleAdd('Popcorn', 200)}
                  className="py-3 px-2 bg-amber-700 hover:bg-amber-800 active:scale-95 text-white font-black text-sm rounded-xl transition shadow disabled:opacity-40"
                >
                  +200
                </button>
                <button
                  type="button"
                  disabled={counterStatus !== 'OPEN' || dayClosing.isClosed}
                  onClick={() => {
                    setCustomModalProduct(popcornStock)
                    setCustomQuantity('')
                  }}
                  className="py-3 px-2 bg-[#c29c5e] hover:bg-[#ab864a] active:scale-95 text-[#163324] font-black text-sm rounded-xl transition shadow disabled:opacity-40"
                >
                  +Custom
                </button>
              </div>
            </div>

            {/* Stock Correction Button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setCorrectionTarget(popcornStock)
                  setCorrectionQty('')
                  setCorrectionReason('')
                  setIsCorrectionModalOpen(true)
                }}
                className="text-xs text-[#64748b] hover:text-red-700 underline font-semibold inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Adjust / Correct Popcorn Count
              </button>
            </div>
          </CardContent>
        </Card>

        {/* PRODUCT 3: WATER BOTTLE */}
        <Card className="border-2 border-sky-500/30 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 bg-gradient-to-r from-sky-700 to-sky-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black leading-tight text-white">Water Bottle</h3>
                <span className="text-xs text-sky-200 font-mono">250ml Sealed</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase text-white/70 block font-bold">Price</span>
              <span className="text-xl font-black text-sky-200 font-mono">
                ₹{waterStock?.price || 15}
              </span>
            </div>
          </div>

          <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
            {/* Live Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="text-[10px] uppercase font-bold text-[#64748b] block">Available</span>
                <span className="text-lg font-black text-[#0f172a] font-mono">
                  {formatNumber(waterStock?.availableStock || 5000)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Sold</span>
                <span className="text-xl font-black text-[#163324] font-mono">
                  {formatNumber(waterStock?.soldDistributed || 4500)}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">Remaining</span>
                <span className="text-lg font-black text-amber-700 font-mono">
                  {formatNumber(waterStock?.remainingStock || 500)}
                </span>
              </div>
            </div>

            {/* Total Income */}
            <div className="p-3 bg-[#f8fafc] rounded-xl border border-[#e2e8f0] flex items-center justify-between">
              <span className="text-xs text-[#64748b] font-bold uppercase">Water Income:</span>
              <span className="text-lg font-black text-sky-800 font-mono">
                ₹{(waterStock?.income || 67500).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Quick Increment Touch Pad */}
            <div className="space-y-2 pt-2 border-t border-[#f1f5f9]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] block">
                Quick Water Dispense (+ Add Sale):
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  disabled={counterStatus !== 'OPEN' || dayClosing.isClosed}
                  onClick={() => handleAdd('Water Bottle', 24)}
                  className="py-3 px-2 bg-sky-700 hover:bg-sky-800 active:scale-95 text-white font-black text-sm rounded-xl transition shadow disabled:opacity-40"
                >
                  +24 (Case)
                </button>
                <button
                  type="button"
                  disabled={counterStatus !== 'OPEN' || dayClosing.isClosed}
                  onClick={() => handleAdd('Water Bottle', 48)}
                  className="py-3 px-2 bg-sky-700 hover:bg-sky-800 active:scale-95 text-white font-black text-sm rounded-xl transition shadow disabled:opacity-40"
                >
                  +48
                </button>
                <button
                  type="button"
                  disabled={counterStatus !== 'OPEN' || dayClosing.isClosed}
                  onClick={() => handleAdd('Water Bottle', 100)}
                  className="py-3 px-2 bg-sky-700 hover:bg-sky-800 active:scale-95 text-white font-black text-sm rounded-xl transition shadow disabled:opacity-40"
                >
                  +100
                </button>
                <button
                  type="button"
                  disabled={counterStatus !== 'OPEN' || dayClosing.isClosed}
                  onClick={() => handleAdd('Water Bottle', 250)}
                  className="py-3 px-2 bg-sky-700 hover:bg-sky-800 active:scale-95 text-white font-black text-sm rounded-xl transition shadow disabled:opacity-40"
                >
                  +250
                </button>
                <button
                  type="button"
                  disabled={counterStatus !== 'OPEN' || dayClosing.isClosed}
                  onClick={() => handleAdd('Water Bottle', 500)}
                  className="py-3 px-2 bg-sky-700 hover:bg-sky-800 active:scale-95 text-white font-black text-sm rounded-xl transition shadow disabled:opacity-40"
                >
                  +500
                </button>
                <button
                  type="button"
                  disabled={counterStatus !== 'OPEN' || dayClosing.isClosed}
                  onClick={() => {
                    setCustomModalProduct(waterStock)
                    setCustomQuantity('')
                  }}
                  className="py-3 px-2 bg-[#c29c5e] hover:bg-[#ab864a] active:scale-95 text-[#163324] font-black text-sm rounded-xl transition shadow disabled:opacity-40"
                >
                  +Custom
                </button>
              </div>
            </div>

            {/* Stock Correction Button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setCorrectionTarget(waterStock)
                  setCorrectionQty('')
                  setCorrectionReason('')
                  setIsCorrectionModalOpen(true)
                }}
                className="text-xs text-[#64748b] hover:text-red-700 underline font-semibold inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Adjust / Correct Water Count
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 5. SINGLE COUNTER LOGISTICS REMINDER */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <strong className="block font-bold text-amber-950">
            One Counter Operations Protocol Notice
          </strong>
          <p>
            In accordance with 3-Day Event Operations directives, strictly ONE counter is maintained.
            All queue marshals and stewards must funnel guests through Counter 1. Replenishment batches
            from the kitchen hot-boxes are brought directly to this single staging table.
          </p>
        </div>
      </div>

      {/* 6. MODALS */}
      {/* Custom Quantity Entry Modal */}
      {customModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-[#e2e8f0]">
            <h3 className="text-base font-black text-[#0f172a] mb-1">
              Add Custom Dispense Quantity
            </h3>
            <p className="text-xs text-[#64748b] mb-4">
              Item: <strong>{customModalProduct.productName}</strong> (Day {activeDay})
            </p>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Quantity to Add ({customModalProduct.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  autoFocus
                  value={customQuantity}
                  onChange={(e) => setCustomQuantity(e.target.value)}
                  placeholder="e.g. 150"
                  className="w-full px-4 py-3 text-xl font-mono font-black text-[#163324] border border-[#cbd5e1] rounded-xl focus:ring-2 focus:ring-[#163324] focus:outline-none"
                  required
                />
              </div>

              <div className="p-3 rounded-lg bg-[#f8fafc] text-xs flex justify-between">
                <span>Total Additional Income:</span>
                <strong className="font-mono text-[#163324]">
                  ₹{((parseInt(customQuantity, 10) || 0) * (customModalProduct.price || 0)).toLocaleString('en-IN')}
                </strong>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomModalProduct(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Add Dispense Sale
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Correction Modal */}
      {isCorrectionModalOpen && correctionTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#e2e8f0]">
            <h3 className="text-base font-black text-red-700 mb-1 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-red-600" />
              Counter Stock Correction / Void
            </h3>
            <p className="text-xs text-[#64748b] mb-4">
              Adjust accidental entries for <strong>{correctionTarget.productName}</strong>. This will deduct from sold count and restore buffer.
            </p>

            <form onSubmit={handleCorrectionSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Quantity to Deduct / Void
                </label>
                <input
                  type="number"
                  min="1"
                  value={correctionQty}
                  onChange={(e) => setCorrectionQty(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full px-3 py-2 text-base font-mono font-bold text-red-600 border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-red-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Correction Reason / Audit Note
                </label>
                <input
                  type="text"
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="e.g. Operator duplicate tap correction"
                  className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#163324] focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCorrectionModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="danger" size="sm">
                  Confirm Deduction
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
export default OneCounter
