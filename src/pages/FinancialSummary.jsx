import React, { useState, useMemo } from 'react'
import {
  TrendingUp,
  DollarSign,
  Receipt,
  Calendar,
  Layers,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  PieChart,
  BarChart2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { useToast } from '../components/ui/ToastContext'
import { useFinance } from '../hooks/useFinance'
import { useEvents } from '../context/EventContext'
import { formatCurrency, formatNumber } from '../utils/formatters'
import { DayClosingModal } from '../components/finance/DayClosingModal'
import { EventClosingModal } from '../components/finance/EventClosingModal'

export function FinancialSummary() {
  const toast = useToast()
  const { events, activeEventId } = useEvents()
  const {
    closings,
    getDailyFinancials,
    getThreeDayFinancials,
  } = useFinance()

  // State
  const [selectedEventId, setSelectedEventId] = useState(activeEventId || 'evt-college-3day')
  const [selectedDay, setSelectedDay] = useState('all') // 1, 2, 3, or 'all'

  // Modal State
  const [isDayClosingOpen, setIsDayClosingOpen] = useState(false)
  const [targetDayNumber, setTargetDayNumber] = useState(1)
  const [isEventClosingOpen, setIsEventClosingOpen] = useState(false)

  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0]
  }, [events, selectedEventId])

  // Daily Financials
  const day1 = useMemo(() => getDailyFinancials(selectedEventId, 1), [getDailyFinancials, selectedEventId])
  const day2 = useMemo(() => getDailyFinancials(selectedEventId, 2), [getDailyFinancials, selectedEventId])
  const day3 = useMemo(() => getDailyFinancials(selectedEventId, 3), [getDailyFinancials, selectedEventId])

  // Complete 3-Day Financials
  const threeDay = useMemo(() => getThreeDayFinancials(selectedEventId), [getThreeDayFinancials, selectedEventId])

  // Current active metrics based on day selection
  const activeMetrics = useMemo(() => {
    if (selectedDay === 1) return { sales: day1.totalSales, expenses: day1.totalExpenses, net: day1.netIncome, label: 'Day 1' }
    if (selectedDay === 2) return { sales: day2.totalSales, expenses: day2.totalExpenses, net: day2.netIncome, label: 'Day 2' }
    if (selectedDay === 3) return { sales: day3.totalSales, expenses: day3.totalExpenses, net: day3.netIncome, label: 'Day 3' }
    return { sales: threeDay.totalSales, expenses: threeDay.totalExpenses, net: threeDay.finalNetIncome, label: 'All 3 Days' }
  }, [selectedDay, day1, day2, day3, threeDay])

  const handleOpenDayClosing = (dayNum) => {
    setTargetDayNumber(dayNum)
    setIsDayClosingOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Event Financial Summary & Reconciliation"
        description="Daily sales revenues, event operations expenditure ledger, daily net margins, and official 3-day final closing reconciliation."
        badge="Executive P&L Ledger"
        badgeVariant="gold"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/print-reports">
              <Button variant="outline" size="sm" leftIcon={<Printer className="w-3.5 h-3.5" />}>
                Print Reports
              </Button>
            </Link>
            <Link to="/sales">
              <Button variant="outline" size="sm" leftIcon={<DollarSign className="w-3.5 h-3.5" />}>
                Sales Ledger
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Sparkles className="w-4 h-4 text-[#c29c5e]" />}
              onClick={() => setIsEventClosingOpen(true)}
            >
              Final Event Closing
            </Button>
          </div>
        }
      />

      {/* Internal Management Protocol Banner */}
      <div className="p-3.5 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-xs text-[#92400e] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 shrink-0 text-[#d97706]" />
          <span>
            <strong>Internal Event Operations Ledger:</strong> Strict catering administration records. Net Income is calculated precisely as Total Sales / Income minus Total Event Expenses.
          </span>
        </div>
        {threeDay.isEventClosed ? (
          <Badge variant="warning" size="sm" className="shrink-0 flex items-center gap-1 font-bold">
            <Lock className="w-3 h-3" /> Event Closed & Finalized
          </Badge>
        ) : (
          <Badge variant="success" size="sm" className="shrink-0 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Active Reconciliation
          </Badge>
        )}
      </div>

      {/* DAY SELECTOR FILTER */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] mr-2 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#163324]" />
            Ledger View:
          </span>
          <div className="inline-flex rounded-lg border border-[#cbd5e1] p-1 bg-[#f8fafc]">
            {[1, 2, 3].map((dayNum) => {
              const isClosed = closings.days[dayNum]?.isClosed
              const isSelected = selectedDay === dayNum
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
              ALL 3 DAYS
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#64748b]">Showing:</span>
          <span className="text-xs font-bold text-[#0f172a] bg-[#f1f5f9] px-2.5 py-1 rounded-md">
            {activeMetrics.label} Financials
          </span>
        </div>
      </div>

      {/* TOP LEVEL EXECUTIVE FINANCIAL CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Sales / Income */}
        <Card className="p-5 bg-white border border-[#e2e8f0] shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
                {activeMetrics.label} Sales / Income
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#163324] mt-1 font-mono">
                {formatCurrency(activeMetrics.sales)}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#163324]/10 text-[#163324] flex items-center justify-center font-bold text-lg">
              ₹
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#64748b]">
            <span>Gross Revenue Tally</span>
            <span className="font-semibold text-[#163324]">Portions × Prices</span>
          </div>
        </Card>

        {/* Total Expenses */}
        <Card className="p-5 bg-white border border-[#e2e8f0] shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
                {activeMetrics.label} Total Expenses
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-red-600 mt-1 font-mono">
                {formatCurrency(activeMetrics.expenses)}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Receipt className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#64748b]">
            <span>19 Expense Categories</span>
            <span className="font-semibold text-red-600">Disbursed & Incurred</span>
          </div>
        </Card>

        {/* Net Income */}
        <Card className="p-5 bg-white border border-[#e2e8f0] shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#64748b]">
                {activeMetrics.label} Net Income
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold text-emerald-700 mt-1 font-mono">
                {formatCurrency(activeMetrics.net)}
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#64748b]">
            <span>Net Margin:</span>
            <span className="font-bold text-emerald-700 font-mono">
              {activeMetrics.sales > 0
                ? `${((activeMetrics.net / activeMetrics.sales) * 100).toFixed(1)}% Yield`
                : '0.0%'}
            </span>
          </div>
        </Card>
      </div>

      {/* MASTER 3-DAY FINANCIAL RECONCILIATION TABLE */}
      <Card className="border border-[#e2e8f0] overflow-hidden shadow-xs">
        <CardHeader className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-[#0f172a]">
              <Layers className="w-4 h-4 text-[#163324]" />
              Master 3-Day Financial Summary & Ledger
            </CardTitle>
            <p className="text-xs text-[#64748b] mt-0.5">
              Side-by-side reconciliation of daily revenue yields, costs incurred, and final event closing status
            </p>
          </div>
          <Badge variant="gold" size="sm" className="w-fit font-mono font-bold">
            Total Net: {formatCurrency(threeDay.finalNetIncome)}
          </Badge>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f1f5f9] text-[#475569] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Event Day</th>
                <th className="p-3.5 text-right">Sales / Income</th>
                <th className="p-3.5 text-right">Expenses</th>
                <th className="p-3.5 text-right">Net Income (Sales - Exp)</th>
                <th className="p-3.5 text-center">Net Margin</th>
                <th className="p-3.5 text-center">Day Status</th>
                <th className="p-3.5 text-right">Day Closing Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {/* Day 1 */}
              <tr className="hover:bg-[#f8fafc] transition-colors">
                <td className="p-3.5 font-bold text-[#0f172a]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#163324]/10 text-[#163324] flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    <div>
                      <p className="font-bold text-sm">DAY 1</p>
                      <span className="text-[10px] text-[#64748b]">Friday (10,000 Guests)</span>
                    </div>
                  </div>
                </td>
                <td className="p-3.5 text-right font-mono font-bold text-[#163324] text-sm">
                  {formatCurrency(day1.totalSales)}
                </td>
                <td className="p-3.5 text-right font-mono font-semibold text-red-600">
                  {formatCurrency(day1.totalExpenses)}
                </td>
                <td className="p-3.5 text-right font-mono font-bold text-emerald-700 text-sm">
                  {formatCurrency(day1.netIncome)}
                </td>
                <td className="p-3.5 text-center font-mono font-semibold text-emerald-700">
                  {day1.totalSales > 0 ? `${((day1.netIncome / day1.totalSales) * 100).toFixed(1)}%` : '0%'}
                </td>
                <td className="p-3.5 text-center">
                  {day1.isClosed ? (
                    <Badge variant="warning" size="sm" className="inline-flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Closed & Locked
                    </Badge>
                  ) : (
                    <Badge variant="success" size="sm">
                      Open
                    </Badge>
                  )}
                </td>
                <td className="p-3.5 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={day1.isClosed ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    onClick={() => handleOpenDayClosing(1)}
                    className="text-xs h-7 px-2.5"
                  >
                    {day1.isClosed ? 'Reopen Day 1' : 'Close Day 1'}
                  </Button>
                </td>
              </tr>

              {/* Day 2 */}
              <tr className="hover:bg-[#f8fafc] transition-colors">
                <td className="p-3.5 font-bold text-[#0f172a]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#163324]/10 text-[#163324] flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    <div>
                      <p className="font-bold text-sm">DAY 2</p>
                      <span className="text-[10px] text-[#64748b]">Saturday (10,000 Guests)</span>
                    </div>
                  </div>
                </td>
                <td className="p-3.5 text-right font-mono font-bold text-[#163324] text-sm">
                  {formatCurrency(day2.totalSales)}
                </td>
                <td className="p-3.5 text-right font-mono font-semibold text-red-600">
                  {formatCurrency(day2.totalExpenses)}
                </td>
                <td className="p-3.5 text-right font-mono font-bold text-emerald-700 text-sm">
                  {formatCurrency(day2.netIncome)}
                </td>
                <td className="p-3.5 text-center font-mono font-semibold text-emerald-700">
                  {day2.totalSales > 0 ? `${((day2.netIncome / day2.totalSales) * 100).toFixed(1)}%` : '0%'}
                </td>
                <td className="p-3.5 text-center">
                  {day2.isClosed ? (
                    <Badge variant="warning" size="sm" className="inline-flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Closed & Locked
                    </Badge>
                  ) : (
                    <Badge variant="success" size="sm">
                      Open
                    </Badge>
                  )}
                </td>
                <td className="p-3.5 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={day2.isClosed ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    onClick={() => handleOpenDayClosing(2)}
                    className="text-xs h-7 px-2.5"
                  >
                    {day2.isClosed ? 'Reopen Day 2' : 'Close Day 2'}
                  </Button>
                </td>
              </tr>

              {/* Day 3 */}
              <tr className="hover:bg-[#f8fafc] transition-colors">
                <td className="p-3.5 font-bold text-[#0f172a]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#163324]/10 text-[#163324] flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    <div>
                      <p className="font-bold text-sm">DAY 3</p>
                      <span className="text-[10px] text-[#64748b]">Sunday (10,000 Guests)</span>
                    </div>
                  </div>
                </td>
                <td className="p-3.5 text-right font-mono font-bold text-[#163324] text-sm">
                  {formatCurrency(day3.totalSales)}
                </td>
                <td className="p-3.5 text-right font-mono font-semibold text-red-600">
                  {formatCurrency(day3.totalExpenses)}
                </td>
                <td className="p-3.5 text-right font-mono font-bold text-emerald-700 text-sm">
                  {formatCurrency(day3.netIncome)}
                </td>
                <td className="p-3.5 text-center font-mono font-semibold text-emerald-700">
                  {day3.totalSales > 0 ? `${((day3.netIncome / day3.totalSales) * 100).toFixed(1)}%` : '0%'}
                </td>
                <td className="p-3.5 text-center">
                  {day3.isClosed ? (
                    <Badge variant="warning" size="sm" className="inline-flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Closed & Locked
                    </Badge>
                  ) : (
                    <Badge variant="success" size="sm">
                      Open
                    </Badge>
                  )}
                </td>
                <td className="p-3.5 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={day3.isClosed ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    onClick={() => handleOpenDayClosing(3)}
                    className="text-xs h-7 px-2.5"
                  >
                    {day3.isClosed ? 'Reopen Day 3' : 'Close Day 3'}
                  </Button>
                </td>
              </tr>
            </tbody>

            {/* GRAND 3-DAY TOTAL FOOTER */}
            <tfoot className="bg-[#163324] text-white font-bold text-xs">
              <tr>
                <td className="p-4 text-white uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#c29c5e]" />
                    <span>ALL 3 DAYS GRAND TOTAL</span>
                  </div>
                </td>
                <td className="p-4 text-right font-mono text-base text-[#c29c5e]">
                  {formatCurrency(threeDay.totalSales)}
                </td>
                <td className="p-4 text-right font-mono text-base text-red-300">
                  {formatCurrency(threeDay.totalExpenses)}
                </td>
                <td className="p-4 text-right font-mono text-lg text-emerald-300">
                  {formatCurrency(threeDay.finalNetIncome)}
                </td>
                <td className="p-4 text-center font-mono text-emerald-300 text-sm">
                  {threeDay.totalSales > 0
                    ? `${((threeDay.finalNetIncome / threeDay.totalSales) * 100).toFixed(1)}%`
                    : '0%'}
                </td>
                <td className="p-4 text-center">
                  {threeDay.isEventClosed ? (
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400 text-[10px]">
                      EVENT CLOSED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-white/20 text-white text-[10px]">
                      IN PROGRESS
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-[#c29c5e] hover:bg-[#b08b4e] text-[#163324] font-bold border-none text-xs h-7"
                    onClick={() => setIsEventClosingOpen(true)}
                  >
                    {threeDay.isEventClosed ? 'Audit Event Closing' : 'Close 3-Day Event'}
                  </Button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* TWO COLUMN BREAKDOWN: PRODUCT-WISE & EXPENSE CATEGORY BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product-Wise Sales Breakdown */}
        <Card className="border border-[#e2e8f0] overflow-hidden shadow-xs">
          <CardHeader className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0]">
            <CardTitle className="text-base flex items-center gap-2 text-[#0f172a]">
              <PieChart className="w-4 h-4 text-[#163324]" />
              Product-Wise Sales & Portion Yields
            </CardTitle>
            <p className="text-xs text-[#64748b] mt-0.5">
              Contribution of each menu product to total 3-day gross income
            </p>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f1f5f9] text-[#475569] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3 text-right">Total Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total Income</th>
                  <th className="p-3 text-right">Share %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {threeDay.productSummary.map((item) => {
                  const share =
                    threeDay.totalSales > 0
                      ? ((item.totalIncome / threeDay.totalSales) * 100).toFixed(1)
                      : 0
                  return (
                    <tr key={item.productName} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="p-3 font-semibold text-[#0f172a]">
                        {item.productName}
                        <span className="text-[10px] text-[#64748b] block">{item.category}</span>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[#0f172a]">
                        {formatNumber(item.totalQty)}
                      </td>
                      <td className="p-3 text-right font-mono text-[#64748b]">
                        {formatCurrency(item.appliedPrice)}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[#163324]">
                        {formatCurrency(item.totalIncome)}
                      </td>
                      <td className="p-3 text-right font-mono font-semibold text-[#64748b]">
                        {share}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Expense Category Breakdown */}
        <Card className="border border-[#e2e8f0] overflow-hidden shadow-xs">
          <CardHeader className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0]">
            <CardTitle className="text-base flex items-center gap-2 text-[#0f172a]">
              <BarChart2 className="w-4 h-4 text-red-600" />
              19 Expense Categories Breakdown
            </CardTitle>
            <p className="text-xs text-[#64748b] mt-0.5">
              Major operational cost centers for raw materials, logistics, and labor
            </p>
          </CardHeader>
          <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f1f5f9] text-[#475569] font-bold uppercase tracking-wider text-[10px] sticky top-0">
                <tr>
                  <th className="p-3">Category</th>
                  <th className="p-3 text-right">Amount Incurred</th>
                  <th className="p-3 text-right">Share %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {threeDay.expenseCategorySummary.map((item) => {
                  const share =
                    threeDay.totalExpenses > 0
                      ? ((item.total / threeDay.totalExpenses) * 100).toFixed(1)
                      : 0
                  return (
                    <tr key={item.category} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="p-2.5 font-semibold text-[#0f172a]">
                        {item.category}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-red-600">
                        {formatCurrency(item.total)}
                      </td>
                      <td className="p-2.5 text-right font-mono text-[#64748b]">
                        {share}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot className="bg-[#f8fafc] border-t border-[#cbd5e1] font-bold text-xs sticky bottom-0">
                <tr>
                  <td className="p-3 text-[#0f172a] uppercase">Total Event Expenses</td>
                  <td className="p-3 text-right font-mono text-red-600 font-bold">
                    {formatCurrency(threeDay.totalExpenses)}
                  </td>
                  <td className="p-3 text-right font-mono">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      </div>

      {/* FINAL EVENT CLOSING STATUS / BANNER */}
      {threeDay.isEventClosed && (
        <div className="p-4 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-950">
                Event Officially Closed & Final Financials Archived
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Closed at: {new Date(threeDay.eventClosedAt).toLocaleString()} | Notes: {threeDay.finalNotes}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEventClosingOpen(true)}
            className="shrink-0 text-emerald-900 border-emerald-300 hover:bg-emerald-100"
          >
            Review Closing Audit
          </Button>
        </div>
      )}

      {/* Modals */}
      <DayClosingModal
        isOpen={isDayClosingOpen}
        onClose={() => setIsDayClosingOpen(false)}
        dayNumber={targetDayNumber}
        eventId={selectedEventId}
      />

      <EventClosingModal
        isOpen={isEventClosingOpen}
        onClose={() => setIsEventClosingOpen(false)}
        eventId={selectedEventId}
      />
    </div>
  )
}

