import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarDays,
  Users,
  ChefHat,
  PackageCheck,
  Truck,
  Droplets,
  DollarSign,
  TrendingUp,
  ReceiptText,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Utensils,
  Package,
  Clock,
  Printer,
  FileSpreadsheet,
  Store,
  Tag,
  Layers,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'
import { useEvents } from '../context/EventContext'
import { useFinance } from '../hooks/useFinance'
import { useTasks } from '../hooks/useTasks'
import { formatNumber, formatCurrency } from '../utils/formatters'

export function Dashboard() {
  const toast = useToast()
  const { events, activeEventId } = useEvents()
  const {
    products,
    getDailyStock,
    recordSaleIncrement,
    getDailyFinancials,
    getThreeDayFinancials,
    closings,
    counterStatus,
  } = useFinance()
  const { tasks, toggleTaskStatus } = useTasks()

  // Selected Day state: 1, 2, 3, or 'all'
  const [selectedDay, setSelectedDay] = useState(1)

  // Find 3-day college event
  const event = useMemo(() => {
    return (
      events.find((e) => e.id === 'evt-college-3day') ||
      events.find((e) => e.id === activeEventId) ||
      events[0]
    )
  }, [events, activeEventId])

  // Financials
  const day1Fin = useMemo(() => getDailyFinancials(event?.id, 1), [getDailyFinancials, event?.id])
  const day2Fin = useMemo(() => getDailyFinancials(event?.id, 2), [getDailyFinancials, event?.id])
  const day3Fin = useMemo(() => getDailyFinancials(event?.id, 3), [getDailyFinancials, event?.id])
  const threeDayFin = useMemo(() => getThreeDayFinancials(event?.id), [getThreeDayFinancials, event?.id])

  // Daily Stocks
  const day1Stock = useMemo(() => getDailyStock(event?.id, 1), [getDailyStock, event?.id])
  const day2Stock = useMemo(() => getDailyStock(event?.id, 2), [getDailyStock, event?.id])
  const day3Stock = useMemo(() => getDailyStock(event?.id, 3), [getDailyStock, event?.id])

  // Current Stock depending on selectedDay
  const activeStock = useMemo(() => {
    if (selectedDay === 1) return day1Stock
    if (selectedDay === 2) return day2Stock
    if (selectedDay === 3) return day3Stock

    // Combined 3-Day stock
    const map = {}
    ;[...day1Stock, ...day2Stock, ...day3Stock].forEach((stk) => {
      if (!map[stk.productName]) {
        map[stk.productName] = {
          ...stk,
          openingStock: 0,
          preparedReceived: 0,
          availableStock: 0,
          soldDistributed: 0,
          remainingStock: 0,
          income: 0,
        }
      }
      map[stk.productName].openingStock += Number(stk.openingStock) || 0
      map[stk.productName].preparedReceived += Number(stk.preparedReceived) || 0
      map[stk.productName].availableStock += Number(stk.availableStock) || 0
      map[stk.productName].soldDistributed += Number(stk.soldDistributed) || 0
      map[stk.productName].remainingStock += Number(stk.remainingStock) || 0
      map[stk.productName].income += Number(stk.income) || 0
    })
    return Object.values(map)
  }, [selectedDay, day1Stock, day2Stock, day3Stock])

  // Current financials for the active selector
  const activeFin = useMemo(() => {
    if (selectedDay === 1) return day1Fin
    if (selectedDay === 2) return day2Fin
    if (selectedDay === 3) return day3Fin
    return {
      totalSales: threeDayFin.totalSales,
      totalExpenses: threeDayFin.totalExpenses,
      netIncome: threeDayFin.finalNetIncome,
      isClosed: threeDayFin.isEventClosed,
    }
  }, [selectedDay, day1Fin, day2Fin, day3Fin, threeDayFin])

  // Quick dispense handler from dashboard
  const handleQuickDispense = (productName, qty) => {
    const targetDay = selectedDay === 'all' ? 1 : selectedDay
    if (closings.days[targetDay]?.isClosed) {
      toast.warning('Day Locked', `Day ${targetDay} is locked. Cannot dispense.`)
      return
    }
    recordSaleIncrement(event?.id, targetDay, productName, qty)
    toast.success('Sale Dispensed', `+${qty} ${productName} (Day ${targetDay})`)
  }

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <PageHeader
        title="3-DAY EVENT OPERATIONS TRACKER"
        description="Event operations command center for 3-Day Catering: 30,000 Guests, Chicken Biryani, Popcorn, Water, and Strictly ONE Distribution Counter."
        badge="Live Operations"
        badgeVariant="gold"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/one-counter">
              <Button variant="primary" size="sm" leftIcon={<Store className="w-3.5 h-3.5" />}>
                One Counter Station
              </Button>
            </Link>
            <Link to="/stock">
              <Button variant="outline" size="sm" leftIcon={<Package className="w-3.5 h-3.5" />}>
                Stock Register
              </Button>
            </Link>
            <Link to="/print-reports">
              <Button variant="outline" size="sm" leftIcon={<Printer className="w-3.5 h-3.5" />}>
                A4 Reports
              </Button>
            </Link>
          </div>
        }
      />

      {/* 2. Active Event Scope Banner */}
      <div className="p-4 rounded-xl bg-[#163324] text-white flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm border border-[#c29c5e]/30">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#c29c5e]/20 border border-[#c29c5e]/40 text-[#c29c5e] flex items-center justify-center font-bold">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#c29c5e] bg-white/10 px-2 py-0.5 rounded">
                3-Day Mega Event
              </span>
              <span className="text-xs text-emerald-300 font-bold">● Operational Live</span>
            </div>
            <h2 className="text-lg font-black text-white mt-0.5 tracking-tight">
              {event?.name || 'COLLEGE FUNCTION (TECH & CULTURAL FEST)'}
            </h2>
            <p className="text-xs text-white/70">
              {event?.venue || 'MES Engineering College Grounds, Valanchery'} • 2026-09-16 to 2026-09-18
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2.5 rounded-lg bg-white/10 border border-white/10 text-right">
            <span className="text-[10px] uppercase font-bold text-white/70 block">Active Status</span>
            <span className="text-xs font-black text-[#c29c5e]">DAY 1 OF 3</span>
          </div>

          <div className="p-2.5 rounded-lg bg-white/10 border border-white/10 text-right">
            <span className="text-[10px] uppercase font-bold text-white/70 block">Expected Guests</span>
            <span className="text-xs font-black text-white font-mono">10,000 / 30,000</span>
          </div>

          <Link to="/one-counter">
            <div className="p-2.5 rounded-lg bg-emerald-950 border border-emerald-400/40 text-right hover:border-emerald-300 transition cursor-pointer">
              <span className="text-[10px] uppercase font-bold text-emerald-300 block">Distribution Station</span>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black text-white">ONE COUNTER: {counterStatus}</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 3. DAY SELECTOR FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-[#e2e8f0] shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] mr-2 flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-[#163324]" />
            Select Operational Day:
          </span>
          <div className="inline-flex rounded-lg border border-[#cbd5e1] p-1 bg-[#f8fafc]">
            {[1, 2, 3].map((dayNum) => {
              const isSelected = selectedDay === dayNum
              const isClosed = closings.days[dayNum]?.isClosed
              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => setSelectedDay(dayNum)}
                  className={`px-4 py-1.5 text-xs font-black rounded-md transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#163324] text-white shadow-xs'
                      : 'text-[#475569] hover:text-[#0f172a] hover:bg-white'
                  }`}
                >
                  DAY {dayNum}
                  {isClosed && <Lock className={`w-3 h-3 ${isSelected ? 'text-[#c29c5e]' : 'text-amber-600'}`} />}
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => setSelectedDay('all')}
              className={`px-4 py-1.5 text-xs font-black rounded-md transition-all ${
                selectedDay === 'all'
                  ? 'bg-[#163324] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0f172a] hover:bg-white'
              }`}
            >
              ALL 3 DAYS
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm">
            {selectedDay === 'all' ? 'All 3 Days Combined' : `Day ${selectedDay} Active Scope`}
          </Badge>
          {selectedDay !== 'all' && (
            <Link to={`/day-${selectedDay}`}>
              <Button variant="ghost" size="xs" rightIcon={<ArrowRight className="w-3 h-3" />}>
                Open Day {selectedDay} Ledger
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* 4. FINANCIAL STATS FOR SELECTED SCOPE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-[#e2e8f0]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                {selectedDay === 'all' ? 'All 3 Days Total Sales' : `Day ${selectedDay} Total Sales`}
              </p>
              <h3 className="text-2xl font-black text-[#163324] mt-1 font-mono">
                {formatCurrency(activeFin.totalSales)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#f1f5f9] flex justify-between text-xs text-[#64748b]">
            <span>Baseline Target:</span>
            <span className="font-bold text-[#0f172a]">
              {selectedDay === 1
                ? '₹826,500'
                : selectedDay === 2
                ? '₹882,000'
                : selectedDay === 3
                ? '₹847,500'
                : '₹2,556,000'}
            </span>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-[#e2e8f0]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                {selectedDay === 'all' ? 'All 3 Days Expenses' : `Day ${selectedDay} Expenses`}
              </p>
              <h3 className="text-2xl font-black text-red-600 mt-1 font-mono">
                {formatCurrency(activeFin.totalExpenses)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <ReceiptText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#f1f5f9] flex justify-between text-xs text-[#64748b]">
            <span>Procurement Costs:</span>
            <span className="font-bold text-red-700">Food, Staff, Logistics</span>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-[#e2e8f0]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                {selectedDay === 'all' ? '3-Day Net Income' : `Day ${selectedDay} Net Income`}
              </p>
              <h3 className="text-2xl font-black text-emerald-700 mt-1 font-mono">
                {formatCurrency(activeFin.netIncome)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#f1f5f9] flex justify-between text-xs text-[#64748b]">
            <span>Net Operating Margin:</span>
            <span className="font-bold text-emerald-800">
              {activeFin.totalSales > 0
                ? `${Math.round((activeFin.netIncome / activeFin.totalSales) * 100)}% Yield`
                : '0%'}
            </span>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-[#e2e8f0]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                Distribution Protocol
              </p>
              <h3 className="text-xl font-black text-[#163324] mt-1">
                STRICTLY 1 COUNTER
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#f1f5f9] flex justify-between text-xs text-[#64748b]">
            <span>Serving Station:</span>
            <span className="font-bold text-emerald-700">Centralized Line</span>
          </div>
        </Card>
      </div>

      {/* 5. THREE CORE PRODUCTS DETAILED STATUS (CHICKEN BIRYANI, POPCORN, WATER BOTTLE) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#475569] flex items-center gap-2">
            <Utensils className="w-4 h-4 text-[#163324]" />
            Core Products — Stock & Sales Status ({selectedDay === 'all' ? 'All 3 Days' : `Day ${selectedDay}`})
          </h3>
          <Link to="/stock">
            <span className="text-xs text-[#163324] hover:underline font-bold flex items-center gap-1">
              Full Stock Ledger <ArrowRight className="w-3 h-3" />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {activeStock.slice(0, 3).map((item) => (
            <Card
              key={item.id || item.productName}
              className={`border-2 transition-all ${
                item.productName.includes('Biryani')
                  ? 'border-[#163324]/30 hover:border-[#163324]'
                  : item.productName.includes('Popcorn')
                  ? 'border-amber-500/30 hover:border-amber-600'
                  : 'border-sky-500/30 hover:border-sky-600'
              }`}
            >
              <div
                className={`p-3.5 text-white flex items-center justify-between ${
                  item.productName.includes('Biryani')
                    ? 'bg-[#163324]'
                    : item.productName.includes('Popcorn')
                    ? 'bg-amber-800'
                    : 'bg-sky-800'
                }`}
              >
                <div>
                  <h4 className="font-black text-sm text-white">{item.productName}</h4>
                  <span className="text-[11px] text-white/80 font-mono">{item.unit}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-white/70 block">Selling Price</span>
                  <span className="text-base font-black text-[#c29c5e] font-mono">
                    ₹{item.price}
                  </span>
                </div>
              </div>

              <CardContent className="p-4 space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                    <span className="text-[10px] uppercase font-bold text-[#64748b] block">Available</span>
                    <span className="text-sm font-black text-[#0f172a] font-mono">
                      {formatNumber(item.availableStock)}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">Sold</span>
                    <span className="text-sm font-black text-[#163324] font-mono">
                      {formatNumber(item.soldDistributed)}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">Buffer</span>
                    <span className="text-sm font-black text-amber-700 font-mono">
                      {formatNumber(item.remainingStock)}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex justify-between items-center">
                  <span className="font-bold text-[#64748b]">Total Portion Revenue:</span>
                  <span className="text-base font-black text-[#163324] font-mono">
                    ₹{item.income.toLocaleString('en-IN')}
                  </span>
                </div>

                {selectedDay !== 'all' && (
                  <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#64748b]">Quick Dispense:</span>
                    <div className="inline-flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleQuickDispense(item.productName, 10)}
                        className="px-2 py-1 text-[10px] font-bold rounded bg-[#163324]/10 hover:bg-[#163324] hover:text-white transition"
                      >
                        +10
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickDispense(item.productName, 50)}
                        className="px-2 py-1 text-[10px] font-bold rounded bg-[#163324]/10 hover:bg-[#163324] hover:text-white transition"
                      >
                        +50
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickDispense(item.productName, 100)}
                        className="px-2 py-1 text-[10px] font-bold rounded bg-[#163324]/10 hover:bg-[#163324] hover:text-white transition"
                      >
                        +100
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 6. 3-DAY PLANNING & OPERATIONS COMPARISON */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#475569] flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#163324]" />
            3-Day Operations Overview & Daily Comparison
          </h3>
          <span className="text-xs text-[#64748b]">Day 1 vs Day 2 vs Day 3</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Day 1 Plan Card */}
          <Card className="p-4 bg-white border border-[#e2e8f0] hover:border-[#163324] transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#163324] text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span className="font-bold text-sm text-[#0f172a]">DAY 1 OPERATIONS</span>
              </div>
              <Badge variant={closings.days[1]?.isClosed ? 'warning' : 'success'} size="sm">
                {closings.days[1]?.isClosed ? 'Locked / Closed' : 'Active'}
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs text-[#475569] border-t border-[#f1f5f9] pt-2 mt-2">
              <div className="flex justify-between">
                <span>Planned Guests:</span>
                <strong className="text-[#0f172a]">10,000 Pax</strong>
              </div>
              <div className="flex justify-between">
                <span>Chicken Biryani (₹150):</span>
                <strong className="text-[#163324]">4,700 Sold (₹7.05L)</strong>
              </div>
              <div className="flex justify-between">
                <span>Popcorn (₹30):</span>
                <strong className="text-amber-700">1,800 Sold (₹54k)</strong>
              </div>
              <div className="flex justify-between">
                <span>Water Bottles (₹15):</span>
                <strong className="text-[#0284c7]">4,500 Sold (₹67.5k)</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#f1f5f9]">
                <span className="font-bold">Day 1 Sales Total:</span>
                <strong className="font-mono text-[#163324] text-sm">
                  {formatCurrency(day1Fin.totalSales)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Day 1 Expenses:</span>
                <strong className="font-mono text-red-600">{formatCurrency(day1Fin.totalExpenses)}</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#f1f5f9]">
                <span className="font-bold">Net Yield:</span>
                <strong className="font-mono text-emerald-700 font-bold">{formatCurrency(day1Fin.netIncome)}</strong>
              </div>
              <div className="pt-2 text-right">
                <Link to="/day-1" className="text-xs text-[#163324] font-bold hover:underline">
                  Open Day 1 Ledger →
                </Link>
              </div>
            </div>
          </Card>

          {/* Day 2 Plan Card */}
          <Card className="p-4 bg-white border border-[#e2e8f0] hover:border-[#163324] transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#163324] text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span className="font-bold text-sm text-[#0f172a]">DAY 2 OPERATIONS</span>
              </div>
              <Badge variant={closings.days[2]?.isClosed ? 'warning' : 'success'} size="sm">
                {closings.days[2]?.isClosed ? 'Locked / Closed' : 'Active'}
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs text-[#475569] border-t border-[#f1f5f9] pt-2 mt-2">
              <div className="flex justify-between">
                <span>Planned Guests:</span>
                <strong className="text-[#0f172a]">10,000 Pax</strong>
              </div>
              <div className="flex justify-between">
                <span>Chicken Biryani (₹150):</span>
                <strong className="text-[#163324]">5,000 Sold (₹7.50L)</strong>
              </div>
              <div className="flex justify-between">
                <span>Popcorn (₹30):</span>
                <strong className="text-amber-700">2,000 Sold (₹60k)</strong>
              </div>
              <div className="flex justify-between">
                <span>Water Bottles (₹15):</span>
                <strong className="text-[#0284c7]">4,800 Sold (₹72k)</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#f1f5f9]">
                <span className="font-bold">Day 2 Sales Total:</span>
                <strong className="font-mono text-[#163324] text-sm">
                  {formatCurrency(day2Fin.totalSales)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Day 2 Expenses:</span>
                <strong className="font-mono text-red-600">{formatCurrency(day2Fin.totalExpenses)}</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#f1f5f9]">
                <span className="font-bold">Net Yield:</span>
                <strong className="font-mono text-emerald-700 font-bold">{formatCurrency(day2Fin.netIncome)}</strong>
              </div>
              <div className="pt-2 text-right">
                <Link to="/day-2" className="text-xs text-[#163324] font-bold hover:underline">
                  Open Day 2 Ledger →
                </Link>
              </div>
            </div>
          </Card>

          {/* Day 3 Plan Card */}
          <Card className="p-4 bg-white border border-[#e2e8f0] hover:border-[#163324] transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#163324] text-white flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <span className="font-bold text-sm text-[#0f172a]">DAY 3 OPERATIONS</span>
              </div>
              <Badge variant={closings.days[3]?.isClosed ? 'warning' : 'success'} size="sm">
                {closings.days[3]?.isClosed ? 'Locked / Closed' : 'Active'}
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs text-[#475569] border-t border-[#f1f5f9] pt-2 mt-2">
              <div className="flex justify-between">
                <span>Planned Guests:</span>
                <strong className="text-[#0f172a]">10,000 Pax</strong>
              </div>
              <div className="flex justify-between">
                <span>Chicken Biryani (₹150):</span>
                <strong className="text-[#163324]">4,800 Sold (₹7.20L)</strong>
              </div>
              <div className="flex justify-between">
                <span>Popcorn (₹30):</span>
                <strong className="text-amber-700">1,900 Sold (₹57k)</strong>
              </div>
              <div className="flex justify-between">
                <span>Water Bottles (₹15):</span>
                <strong className="text-[#0284c7]">4,700 Sold (₹70.5k)</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#f1f5f9]">
                <span className="font-bold">Day 3 Sales Total:</span>
                <strong className="font-mono text-[#163324] text-sm">
                  {formatCurrency(day3Fin.totalSales)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Day 3 Expenses:</span>
                <strong className="font-mono text-red-600">{formatCurrency(day3Fin.totalExpenses)}</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#f1f5f9]">
                <span className="font-bold">Net Yield:</span>
                <strong className="font-mono text-emerald-700 font-bold">{formatCurrency(day3Fin.netIncome)}</strong>
              </div>
              <div className="pt-2 text-right">
                <Link to="/day-3" className="text-xs text-[#163324] font-bold hover:underline">
                  Open Day 3 Ledger →
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
export default Dashboard
