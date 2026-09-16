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
  const { getDailyFinancials, getThreeDayFinancials, closings } = useFinance()
  const { tasks, toggleTaskStatus } = useTasks()

  // Selected Day state: 1, 2, 3, or 'all'
  const [selectedDay, setSelectedDay] = useState('all')

  // Find 3-day college event
  const event = useMemo(() => {
    return (
      events.find((e) => e.id === 'evt-college-3day') ||
      events.find((e) => e.id === activeEventId) ||
      events[0]
    )
  }, [events, activeEventId])

  // Event Days array
  const eventDays = useMemo(() => event?.days || [], [event])

  // Current selected day data
  const currentDayData = useMemo(() => {
    if (selectedDay === 'all') return null
    return eventDays.find((d) => d.dayNumber === selectedDay) || eventDays[0]
  }, [eventDays, selectedDay])

  // Financials
  const day1Fin = useMemo(() => getDailyFinancials(event?.id, 1), [getDailyFinancials, event?.id])
  const day2Fin = useMemo(() => getDailyFinancials(event?.id, 2), [getDailyFinancials, event?.id])
  const day3Fin = useMemo(() => getDailyFinancials(event?.id, 3), [getDailyFinancials, event?.id])
  const threeDayFin = useMemo(() => getThreeDayFinancials(event?.id), [getThreeDayFinancials, event?.id])

  // Aggregated Planning Metrics based on selected day
  const planningMetrics = useMemo(() => {
    if (selectedDay === 'all') {
      const totalGuests = event?.totalExpectedGuests || 30000
      const totalFoodReq = 30000
      const totalFoodPrep = 30000
      const totalFoodPacked = 29570
      const totalFoodRemaining = 430
      const totalWaterReq = 30000
      const totalWaterDeliv = 29700
      const totalWaterRemaining = 300

      return {
        label: 'All 3 Days Master Plan',
        guests: totalGuests,
        foodRequired: totalFoodReq,
        foodPrepared: totalFoodPrep,
        foodPacked: totalFoodPacked,
        foodRemaining: totalFoodRemaining,
        waterRequired: totalWaterReq,
        waterDelivered: totalWaterDeliv,
        waterRemaining: totalWaterRemaining,
        counterStatus: 'OPEN',
        sales: threeDayFin.totalSales,
        expenses: threeDayFin.totalExpenses,
        netIncome: threeDayFin.finalNetIncome,
      }
    }

    const day = currentDayData || {}
    const dayFin = selectedDay === 1 ? day1Fin : selectedDay === 2 ? day2Fin : day3Fin

    return {
      label: `Day ${selectedDay} Plan`,
      guests: day.expectedGuests || 10000,
      foodRequired: day.foodPrep?.requiredMeals || 10000,
      foodPrepared: day.foodPrep?.preparedMeals || 10000,
      foodPacked: day.foodDelivered || (selectedDay === 1 ? 9850 : selectedDay === 2 ? 9920 : 9800),
      foodRemaining: day.foodRemaining || (selectedDay === 1 ? 150 : selectedDay === 2 ? 80 : 200),
      waterRequired: day.waterTotalNumber || 10000,
      waterDelivered: day.waterDelivered || (selectedDay === 1 ? 9900 : selectedDay === 2 ? 9950 : 9850),
      waterRemaining: day.waterRemaining || (selectedDay === 1 ? 100 : selectedDay === 2 ? 50 : 150),
      counterStatus: day.counterStatus || 'OPEN',
      sales: dayFin.totalSales,
      expenses: dayFin.totalExpenses,
      netIncome: dayFin.netIncome,
    }
  }, [selectedDay, currentDayData, event, day1Fin, day2Fin, day3Fin, threeDayFin])

  // Filter tasks for the 3-day event
  const planningTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (selectedDay !== 'all' && t.day && Number(t.day) !== Number(selectedDay)) {
        return false
      }
      return true
    })
  }, [tasks, selectedDay])

  return (
    <div className="space-y-6">
      {/* 1. Header: 3-Day Operations & Planning Command */}
      <PageHeader
        title="3-Day Event Operations & Planning Command"
        description="Exclusive 3-Day Catering Planning & Execution tracking: 30,000 Guests, Chicken Biryani, Mineral Water, Popcorn, and strictly ONE Central Distribution Counter."
        badge="3-Day Master Plan"
        badgeVariant="gold"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/print-reports">
              <Button variant="outline" size="sm" leftIcon={<Printer className="w-3.5 h-3.5" />}>
                Print A4 Reports
              </Button>
            </Link>
            <Link to="/sales">
              <Button variant="outline" size="sm" leftIcon={<DollarSign className="w-3.5 h-3.5" />}>
                Sales Ledger
              </Button>
            </Link>
            <Link to="/financials">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#c29c5e]" />}
              >
                Financial Summary
              </Button>
            </Link>
          </div>
        }
      />

      {/* 2. Active Event Scope Banner */}
      <div className="p-4 rounded-xl bg-[#163324] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#c29c5e]/20 border border-[#c29c5e]/40 text-[#c29c5e] flex items-center justify-center font-bold">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#c29c5e] bg-white/10 px-2 py-0.5 rounded">
                3-Day Mega Event
              </span>
              <span className="text-xs text-emerald-400 font-medium">● Operational</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              {event?.name || 'COLLEGE FUNCTION (TECH & CULTURAL FEST)'}
            </h2>
            <p className="text-xs text-white/70">
              {event?.venue || 'MES Engineering College Grounds, Valanchery'} • 30,000 Total Guests (10,000 / Day)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="p-2.5 rounded-lg bg-white/10 border border-white/10 text-right">
            <span className="text-[10px] uppercase font-bold text-white/70 block">Serving Rule</span>
            <span className="text-xs font-black text-[#c29c5e]">STRICTLY ONE COUNTER</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/10 border border-white/10 text-right">
            <span className="text-[10px] uppercase font-bold text-white/70 block">Net Yield</span>
            <span className="text-xs font-black text-emerald-300">
              {formatCurrency(threeDayFin.finalNetIncome)}
            </span>
          </div>
        </div>
      </div>

      {/* 3. DAY SELECTOR FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-[#e2e8f0] shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] mr-2 flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-[#163324]" />
            Planning Scope:
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
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
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
              className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
                selectedDay === 'all'
                  ? 'bg-[#163324] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0f172a] hover:bg-white'
              }`}
            >
              ALL 3 DAYS PLAN
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm">
            {planningMetrics.label}
          </Badge>
          <span className="text-xs font-mono font-bold text-[#163324] bg-[#163324]/10 px-2.5 py-1 rounded">
            Target: {formatNumber(planningMetrics.guests)} Guests
          </span>
        </div>
      </div>

      {/* 4. FOUR TOP PLANNING KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Expected Guests */}
        <Card className="p-4 bg-white border border-[#e2e8f0] shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                Planned Guests
              </p>
              <h3 className="text-2xl font-black text-[#0f172a] mt-1 font-mono">
                {formatNumber(planningMetrics.guests)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#64748b]">
            <span>Day Capacity:</span>
            <span className="font-bold text-[#0f172a]">
              {selectedDay === 'all' ? '10,000 / Day (3 Days)' : '10,000 Pax Today'}
            </span>
          </div>
        </Card>

        {/* 2. Food Portion Planning */}
        <Card className="p-4 bg-white border border-[#e2e8f0] shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                Planned Chicken Biryani
              </p>
              <h3 className="text-2xl font-black text-[#163324] mt-1 font-mono">
                {formatNumber(planningMetrics.foodPrepared)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#163324]/10 text-[#163324] flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#64748b]">
            <span>Buffer Staged:</span>
            <span className="font-bold text-amber-700 font-mono">
              {formatNumber(planningMetrics.foodRemaining)} portions
            </span>
          </div>
        </Card>

        {/* 3. Water Planning */}
        <Card className="p-4 bg-white border border-[#e2e8f0] shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                Planned Water (250ml)
              </p>
              <h3 className="text-2xl font-black text-[#0284c7] mt-1 font-mono">
                {formatNumber(planningMetrics.waterRequired)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#f0f9ff] text-[#0284c7] flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#64748b]">
            <span>Cold Stock Buffer:</span>
            <span className="font-bold text-[#0284c7] font-mono">
              {formatNumber(planningMetrics.waterRemaining)} bottles
            </span>
          </div>
        </Card>

        {/* 4. One Counter Planning */}
        <Card className="p-4 bg-white border border-[#e2e8f0] shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                ONE Distribution Counter
              </p>
              <h3 className="text-2xl font-black text-[#163324] mt-1 font-mono">
                {planningMetrics.counterStatus}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#64748b]">
            <span>Central Serving:</span>
            <span className="font-bold text-[#163324]">Single Line Protocol</span>
          </div>
        </Card>
      </div>

      {/* 5. 3-DAY PLANNING BREAKDOWN & COMPARISON (DAY 1 vs DAY 2 vs DAY 3) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#475569] flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[#163324]" />
            3-Day Operational Plan Breakdown
          </h3>
          <span className="text-xs text-[#64748b]">Complete daily comparison</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Day 1 Plan Card */}
          <Card className="p-4 bg-white border border-[#e2e8f0] hover:border-[#163324] transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#163324] text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span className="font-bold text-sm text-[#0f172a]">DAY 1 PLAN</span>
              </div>
              <Badge variant={closings.days[1]?.isClosed ? 'warning' : 'success'} size="sm">
                {closings.days[1]?.isClosed ? 'Locked / Closed' : 'Active'}
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs text-[#475569] border-t border-[#f1f5f9] pt-2 mt-2">
              <div className="flex justify-between">
                <span>Guest Count:</span>
                <strong className="text-[#0f172a]">10,000 Pax</strong>
              </div>
              <div className="flex justify-between">
                <span>Chicken Biryani:</span>
                <strong className="text-[#163324]">5,000 Portions (₹7.5L)</strong>
              </div>
              <div className="flex justify-between">
                <span>Water Bottles:</span>
                <strong className="text-[#0284c7]">5,000 Bottles (₹75k)</strong>
              </div>
              <div className="flex justify-between">
                <span>Popcorn Counter:</span>
                <strong className="text-amber-700">Butter Salted Stall</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#f1f5f9]">
                <span>Day 1 Sales:</span>
                <strong className="font-mono text-[#163324]">{formatCurrency(day1Fin.totalSales)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Day 1 Expenses:</span>
                <strong className="font-mono text-red-600">{formatCurrency(day1Fin.totalExpenses)}</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#f1f5f9]">
                <span className="font-bold">Net Yield:</span>
                <strong className="font-mono text-emerald-700 font-bold">{formatCurrency(day1Fin.netIncome)}</strong>
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
                <span className="font-bold text-sm text-[#0f172a]">DAY 2 PLAN</span>
              </div>
              <Badge variant={closings.days[2]?.isClosed ? 'warning' : 'success'} size="sm">
                {closings.days[2]?.isClosed ? 'Locked / Closed' : 'Active'}
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs text-[#475569] border-t border-[#f1f5f9] pt-2 mt-2">
              <div className="flex justify-between">
                <span>Guest Count:</span>
                <strong className="text-[#0f172a]">10,000 Pax</strong>
              </div>
              <div className="flex justify-between">
                <span>Chicken Biryani:</span>
                <strong className="text-[#163324]">5,200 Portions (₹7.8L)</strong>
              </div>
              <div className="flex justify-between">
                <span>Water Bottles:</span>
                <strong className="text-[#0284c7]">5,200 Bottles (₹78k)</strong>
              </div>
              <div className="flex justify-between">
                <span>Popcorn Counter:</span>
                <strong className="text-amber-700">Butter Salted Stall</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#f1f5f9]">
                <span>Day 2 Sales:</span>
                <strong className="font-mono text-[#163324]">{formatCurrency(day2Fin.totalSales)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Day 2 Expenses:</span>
                <strong className="font-mono text-red-600">{formatCurrency(day2Fin.totalExpenses)}</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#f1f5f9]">
                <span className="font-bold">Net Yield:</span>
                <strong className="font-mono text-emerald-700 font-bold">{formatCurrency(day2Fin.netIncome)}</strong>
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
                <span className="font-bold text-sm text-[#0f172a]">DAY 3 PLAN</span>
              </div>
              <Badge variant={closings.days[3]?.isClosed ? 'warning' : 'success'} size="sm">
                {closings.days[3]?.isClosed ? 'Locked / Closed' : 'Active'}
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs text-[#475569] border-t border-[#f1f5f9] pt-2 mt-2">
              <div className="flex justify-between">
                <span>Guest Count:</span>
                <strong className="text-[#0f172a]">10,000 Pax</strong>
              </div>
              <div className="flex justify-between">
                <span>Chicken Biryani:</span>
                <strong className="text-[#163324]">4,900 Portions (₹7.35L)</strong>
              </div>
              <div className="flex justify-between">
                <span>Water Bottles:</span>
                <strong className="text-[#0284c7]">4,900 Bottles (₹73.5k)</strong>
              </div>
              <div className="flex justify-between">
                <span>Popcorn Counter:</span>
                <strong className="text-amber-700">Butter Salted Stall</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#f1f5f9]">
                <span>Day 3 Sales:</span>
                <strong className="font-mono text-[#163324]">{formatCurrency(day3Fin.totalSales)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Day 3 Expenses:</span>
                <strong className="font-mono text-red-600">{formatCurrency(day3Fin.totalExpenses)}</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#f1f5f9]">
                <span className="font-bold">Net Yield:</span>
                <strong className="font-mono text-emerald-700 font-bold">{formatCurrency(day3Fin.netIncome)}</strong>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 6. 3-DAY PLANNED DISHES & MENU ITEMS */}
      <Card className="border border-[#e2e8f0] overflow-hidden">
        <CardHeader className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-[#0f172a]">
              <Utensils className="w-4 h-4 text-[#163324]" />
              3-Day Planned Dishes & Portion Allocation
            </CardTitle>
            <p className="text-xs text-[#64748b] mt-0.5">
              Approved menu items scheduled across Day 1, Day 2, and Day 3
            </p>
          </div>
          <Link to="/catering-menu">
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Open Catering Menu
            </Button>
          </Link>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f1f5f9] text-[#475569] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Dish / Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Serving Unit</th>
                <th className="p-3 text-right">Selling Price</th>
                <th className="p-3 text-center">Day 1 Plan</th>
                <th className="p-3 text-center">Day 2 Plan</th>
                <th className="p-3 text-center">Day 3 Plan</th>
                <th className="p-3 text-right">3-Day Total Portions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3 font-bold text-[#0f172a]">Chicken Biryani (Halal Dum)</td>
                <td className="p-3 text-[#64748b]">Main Course</td>
                <td className="p-3">Portion / Box</td>
                <td className="p-3 text-right font-mono font-bold text-[#163324]">₹150</td>
                <td className="p-3 text-center font-mono">5,000</td>
                <td className="p-3 text-center font-mono">5,200</td>
                <td className="p-3 text-center font-mono">4,900</td>
                <td className="p-3 text-right font-mono font-bold text-[#163324]">15,100 Pax</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3 font-bold text-[#0f172a]">Water Bottle (250ml Sealed)</td>
                <td className="p-3 text-[#64748b]">Beverages</td>
                <td className="p-3">250ml Bottle</td>
                <td className="p-3 text-right font-mono font-bold text-[#163324]">₹15</td>
                <td className="p-3 text-center font-mono">5,000</td>
                <td className="p-3 text-center font-mono">5,200</td>
                <td className="p-3 text-center font-mono">4,900</td>
                <td className="p-3 text-right font-mono font-bold text-[#163324]">15,100 Bottles</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3 font-bold text-[#0f172a]">Butter Salted Popcorn</td>
                <td className="p-3 text-[#64748b]">Snacks</td>
                <td className="p-3">Cone / Tub (100g)</td>
                <td className="p-3 text-right font-mono font-bold text-[#163324]">₹40</td>
                <td className="p-3 text-center font-mono">Live Stall</td>
                <td className="p-3 text-center font-mono">Live Stall</td>
                <td className="p-3 text-center font-mono">Live Stall</td>
                <td className="p-3 text-right font-mono font-bold text-amber-700">Continuous</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3 font-bold text-[#0f172a]">Gulab Jamun Sweet</td>
                <td className="p-3 text-[#64748b]">Desserts</td>
                <td className="p-3">Cup (2 pcs)</td>
                <td className="p-3 text-right font-mono font-bold text-[#163324]">₹30</td>
                <td className="p-3 text-center font-mono">Dessert Shift</td>
                <td className="p-3 text-center font-mono">Dessert Shift</td>
                <td className="p-3 text-center font-mono">Dessert Shift</td>
                <td className="p-3 text-right font-mono font-bold text-[#475569]">Service Batch</td>
              </tr>
              <tr className="hover:bg-[#f8fafc]">
                <td className="p-3 font-bold text-[#0f172a]">Lime Mint Welcome Drink</td>
                <td className="p-3 text-[#64748b]">Welcome Drinks</td>
                <td className="p-3">Cup (200ml)</td>
                <td className="p-3 text-right font-mono font-bold text-[#163324]">₹25</td>
                <td className="p-3 text-center font-mono">Reception</td>
                <td className="p-3 text-center font-mono">Reception</td>
                <td className="p-3 text-center font-mono">Reception</td>
                <td className="p-3 text-right font-mono font-bold text-[#475569]">Arrival Line</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* 7. 3-DAY FINANCIAL PLANNING LEDGER SUMMARY */}
      <Card className="border border-[#e2e8f0] overflow-hidden">
        <CardHeader className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-[#0f172a]">
              <DollarSign className="w-4 h-4 text-emerald-700" />
              3-Day Financial Planning & Operations Ledger
            </CardTitle>
            <p className="text-xs text-[#64748b] mt-0.5">
              Net income planning formula: Total Sales / Income minus Total Event Expenses
            </p>
          </div>
          <Link to="/financials">
            <Button variant="primary" size="sm" className="text-xs">
              View Complete P&L Ledger
            </Button>
          </Link>
        </CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#e2e8f0] bg-white text-xs">
          <div className="p-4">
            <span className="text-[10px] uppercase font-bold text-[#64748b] block">Total 3-Day Sales / Income</span>
            <p className="text-2xl font-black text-[#163324] mt-1 font-mono">
              {formatCurrency(threeDayFin.totalSales)}
            </p>
            <span className="text-[11px] text-[#64748b] mt-1 block">15,100 Biryani + 15,100 Water Bottles</span>
          </div>

          <div className="p-4">
            <span className="text-[10px] uppercase font-bold text-[#64748b] block">Total 3-Day Expenses</span>
            <p className="text-2xl font-black text-red-600 mt-1 font-mono">
              {formatCurrency(threeDayFin.totalExpenses)}
            </p>
            <span className="text-[11px] text-[#64748b] mt-1 block">19 Operational Cost Centers</span>
          </div>

          <div className="p-4 bg-emerald-50/50">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Final 3-Day Net Income</span>
            <p className="text-2xl font-black text-emerald-700 mt-1 font-mono">
              {formatCurrency(threeDayFin.finalNetIncome)}
            </p>
            <span className="text-[11px] text-emerald-700 font-bold mt-1 block">20.5% Net Margin Yield</span>
          </div>
        </div>
      </Card>

      {/* 8. 3-DAY OPERATIONAL PLANNING CHECKLIST */}
      <Card className="border border-[#e2e8f0]">
        <CardHeader className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-[#0f172a]">
              <CheckCircle2 className="w-4 h-4 text-[#163324]" />
              3-Day Operational Planning Tasks ({planningTasks.length})
            </CardTitle>
            <p className="text-xs text-[#64748b] mt-0.5">
              Verified operational milestones for central kitchen, single counter, and logistics
            </p>
          </div>
          <Link to="/tasks">
            <Button variant="outline" size="sm">
              Manage All Tasks
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-4 space-y-2.5">
          {planningTasks.slice(0, 6).map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] hover:bg-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.status === 'Completed'}
                  onChange={() => {
                    toggleTaskStatus(task.id)
                    toast.success('Task Updated', `"${task.title || task.task}" status toggled.`)
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-[#163324] focus:ring-[#163324] cursor-pointer"
                />
                <div>
                  <p className={`text-xs font-bold ${task.status === 'Completed' ? 'line-through text-[#94a3b8]' : 'text-[#0f172a]'}`}>
                    {task.title || task.task}
                  </p>
                  <span className="text-[10px] text-[#64748b]">
                    Category: {task.category} • Day {task.day || 'All'} • Due: {task.dueDate || 'Today'}
                  </span>
                </div>
              </div>
              <Badge
                variant={task.status === 'Completed' ? 'success' : task.priority === 'High' ? 'danger' : 'warning'}
                size="sm"
              >
                {task.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
