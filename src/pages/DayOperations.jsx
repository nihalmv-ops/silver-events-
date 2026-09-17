import React, { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  CalendarDays,
  Utensils,
  PackageCheck,
  TrendingUp,
  DollarSign,
  ReceiptText,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  Plus,
  Edit2,
  AlertCircle,
  Truck,
  Droplets,
  ChefHat,
  ArrowRight,
  Download,
  X,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'
import { useEvents } from '../context/EventContext'
import { useFinance } from '../hooks/useFinance'
import { useExpenses } from '../hooks/useExpenses'
import { useTasks } from '../hooks/useTasks'
import { formatCurrency, formatNumber } from '../utils/formatters'
import { DayClosingModal } from '../components/finance/DayClosingModal'
import { ProductPriceModal } from '../components/finance/ProductPriceModal'
import { Phase12ReportTemplate } from '../components/reports/Phase12ReportTemplate'
import { downloadReportAsPdf } from '../utils/pdfExport'

export function DayOperations({ defaultDay = 1 }) {
  const toast = useToast()
  const params = useParams()

  // Support both param or default prop (e.g. /day-1, /day-2, /day-3 or /day/:dayNumber)
  const routeDay = params.dayNumber
    ? parseInt(params.dayNumber, 10)
    : defaultDay

  const [activeDay, setActiveDay] = useState(routeDay || 1)
  const { events, activeEventId } = useEvents()
  const {
    products,
    getDailyStock,
    recordSaleIncrement,
    updateDailyStock,
    getDailyFinancials,
    getThreeDayFinancials,
    closings,
    reopenDay,
    counterStatus,
    setCounterStatus,
  } = useFinance()

  const { expenses } = useExpenses()
  const { tasks, toggleTaskStatus } = useTasks()

  const [isClosingModalOpen, setIsClosingModalOpen] = useState(false)
  const [selectedStockForEdit, setSelectedStockForEdit] = useState(null)
  const [stockEditValues, setStockEditValues] = useState({
    productId: '',
    productName: '',
    opening: 0,
    prepared: 0,
    sold: 0,
    price: 0,
    unit: 'Portion',
  })
  const [editingProduct, setEditingProduct] = useState(null)
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

  // Current Event
  const event = useMemo(() => {
    return (
      events.find((e) => e.id === 'evt-college-3day') ||
      events.find((e) => e.id === activeEventId) ||
      events[0]
    )
  }, [events, activeEventId])

  // Current day stock records
  const dayStock = useMemo(() => {
    return getDailyStock(event?.id, activeDay)
  }, [getDailyStock, event?.id, activeDay])

  const day1Stock = useMemo(() => getDailyStock(event?.id, 1), [getDailyStock, event?.id])
  const day2Stock = useMemo(() => getDailyStock(event?.id, 2), [getDailyStock, event?.id])
  const day3Stock = useMemo(() => getDailyStock(event?.id, 3), [getDailyStock, event?.id])

  // Current day financials
  const dayFin = useMemo(() => {
    return getDailyFinancials(event?.id, activeDay)
  }, [getDailyFinancials, event?.id, activeDay])

  const day1Fin = useMemo(() => getDailyFinancials(event?.id, 1), [getDailyFinancials, event?.id])
  const day2Fin = useMemo(() => getDailyFinancials(event?.id, 2), [getDailyFinancials, event?.id])
  const day3Fin = useMemo(() => getDailyFinancials(event?.id, 3), [getDailyFinancials, event?.id])
  const threeDayFin = useMemo(() => getThreeDayFinancials(event?.id), [getThreeDayFinancials, event?.id])

  // Current Day Closing State
  const dayClosing = useMemo(() => {
    return closings.days[activeDay] || { isClosed: false }
  }, [closings, activeDay])

  // Tasks for this day
  const dayTasks = useMemo(() => {
    return tasks.filter((t) => !t.day || Number(t.day) === activeDay)
  }, [tasks, activeDay])

  // Handle rapid sale increment
  const handleQuickIncrement = (productName, qty) => {
    if (dayClosing.isClosed) {
      toast.warning('Day Locked', `Day ${activeDay} is closed. Reopen the day to modify records.`)
      return
    }
    recordSaleIncrement(event?.id, activeDay, productName, qty)
    toast.success('Sale Recorded', `Added +${qty} to ${productName} (Day ${activeDay})`)
  }

  // Handle Edit Stock / Add Details Modal
  const openStockModal = (stockItem) => {
    if (dayClosing.isClosed) {
      toast.warning('Day Locked', `Day ${activeDay} is closed. Reopen the day to modify records.`)
      return
    }
    const item = stockItem || (dayStock && dayStock[0])
    if (!item) return
    setSelectedStockForEdit(item)
    setStockEditValues({
      productId: item.productId,
      productName: item.productName,
      opening: item.openingStock || 0,
      prepared: item.preparedReceived || item.availableStock || 0,
      sold: item.soldDistributed || 0,
      price: item.price || (item.productName === 'Chicken Biryani' ? 150 : item.productName === 'Popcorn' ? 30 : 15),
      unit: item.unit || 'Portion',
    })
  }

  const handleProductSwitchInModal = (prodId) => {
    const matching = dayStock.find((s) => s.productId === prodId)
    if (matching) {
      setSelectedStockForEdit(matching)
      setStockEditValues({
        productId: matching.productId,
        productName: matching.productName,
        opening: matching.openingStock || 0,
        prepared: matching.preparedReceived || matching.availableStock || 0,
        sold: matching.soldDistributed || 0,
        price: matching.price || (matching.productName === 'Chicken Biryani' ? 150 : matching.productName === 'Popcorn' ? 30 : 15),
        unit: matching.unit || 'Portion',
      })
    }
  }

  const handleSaveStock = (e) => {
    e.preventDefault()
    if (!selectedStockForEdit) return

    const targetProdId = stockEditValues.productId || selectedStockForEdit.productId
    updateDailyStock(event?.id, activeDay, targetProdId, {
      openingStock: Number(stockEditValues.opening),
      preparedReceived: Number(stockEditValues.prepared),
      soldDistributed: Number(stockEditValues.sold),
      price: Number(stockEditValues.price),
    })

    toast.success(
      'Details Saved',
      `Day ${activeDay} numbers saved: ${stockEditValues.productName} updated and synchronized with PDF.`
    )
    setSelectedStockForEdit(null)
  }

  const handleReopen = () => {
    reopenDay(activeDay)
    toast.info('Day Reopened', `Day ${activeDay} operations reopened for editing.`)
  }

  const triggerDirectPrint = () => {
    window.print()
  }

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true)
    toast.info('Generating PDF', `Preparing official Day ${activeDay} A4 document...`)
    try {
      const targetId = isPrintModalOpen ? 'day-modal-report-pdf-root' : 'day-operations-pdf-root'
      const success = await downloadReportAsPdf(
        targetId,
        `Silver-Catering-Day-${activeDay}-Operations-Report.pdf`
      )
      if (success) {
        toast.success('PDF Downloaded', `Day ${activeDay} Report downloaded directly!`)
      }
    } catch (e) {
      console.error(e)
      toast.error('Print Fallback', 'Opening print preview.')
      window.print()
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  return (
    <div>
      {/* ========================================================================= */}
      {/* 1. ON-SCREEN INTERACTIVE DASHBOARD (HIDDEN DURING PHYSICAL PRINT)         */}
      {/* ========================================================================= */}
      <div className="space-y-6 print:hidden">
        {/* Header & Day Navigation */}
        <PageHeader
          title={`DAY ${activeDay} OF 3 — OPERATIONS & SALES`}
          description={`Catering management, single-counter distribution, and financial tracking for Day ${activeDay} of 3.`}
          badge={`Day ${activeDay} Active`}
          badgeVariant={dayClosing.isClosed ? 'warning' : 'gold'}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Link to="/one-counter">
                <Button variant="outline" size="sm" leftIcon={<Truck className="w-3.5 h-3.5" />}>
                  One Counter Station
                </Button>
              </Link>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsPrintModalOpen(true)}
                leftIcon={<Printer className="w-3.5 h-3.5" />}
              >
                Print Day {activeDay} Report (A4)
              </Button>
              {dayClosing.isClosed ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReopen}
                  leftIcon={<Unlock className="w-3.5 h-3.5 text-amber-600" />}
                >
                  Reopen Day {activeDay}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsClosingModalOpen(true)}
                  leftIcon={<Lock className="w-3.5 h-3.5 text-[#c29c5e]" />}
                >
                  Close Day {activeDay}
                </Button>
              )}
            </div>
          }
        />

        {/* Top Day Selector & Status Bar */}
        <div className="p-4 rounded-xl bg-[#163324] text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg bg-black/25 p-1 border border-white/10">
              {[1, 2, 3].map((d) => {
                const isSelected = activeDay === d
                const isClosed = closings.days[d]?.isClosed
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setActiveDay(d)}
                    className={`px-4 py-2 text-xs font-black rounded-md transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-[#c29c5e] text-[#163324] shadow'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    DAY {d}
                    {isClosed && <Lock className="w-3 h-3 text-red-300" />}
                  </button>
                )
              })}
            </div>

            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                {event?.name || 'COLLEGE FUNCTION (3-DAY EVENT)'}
              </h2>
              <p className="text-xs text-white/70">
                10,000 Expected Guests • Day {activeDay} Catering Execution
              </p>
            </div>
          </div>

          {/* Counter Status Controls */}
          <div className="flex items-center gap-2">
            <div className="bg-white/10 border border-white/10 px-3 py-2 rounded-lg text-right">
              <span className="text-[10px] uppercase font-bold text-white/70 block">
                One Counter Mode
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    counterStatus === 'OPEN'
                      ? 'bg-emerald-400 animate-pulse'
                      : counterStatus === 'PAUSED'
                      ? 'bg-amber-400'
                      : 'bg-red-400'
                  }`}
                />
                <span className="text-xs font-black tracking-wider text-white">
                  {counterStatus}
                </span>
              </div>
            </div>

            <div className="flex bg-black/30 rounded-lg p-0.5 border border-white/10">
              {['OPEN', 'PAUSED', 'CLOSED'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setCounterStatus(st)
                    toast.info('Counter Status', `Counter status switched to ${st}`)
                  }}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded transition-all ${
                    counterStatus === st
                      ? 'bg-white text-[#163324]'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Day Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Day Sales */}
          <Card className="p-4 bg-white border border-[#e2e8f0]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                  Day {activeDay} Total Sales / Income
                </p>
                <h3 className="text-2xl font-black text-[#163324] mt-1 font-mono">
                  {formatCurrency(dayFin.totalSales || (activeDay === 1 ? 826500 : activeDay === 2 ? 882000 : 847500))}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#f1f5f9] flex justify-between text-xs text-[#64748b]">
              <span>Baseline Target:</span>
              <span className="font-bold text-[#0f172a]">
                {activeDay === 1 ? '₹826,500' : activeDay === 2 ? '₹882,000' : '₹847,500'}
              </span>
            </div>
          </Card>

          {/* Total Day Expenses */}
          <Card className="p-4 bg-white border border-[#e2e8f0]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                  Day {activeDay} Expenses
                </p>
                <h3 className="text-2xl font-black text-red-600 mt-1 font-mono">
                  {formatCurrency(dayFin.totalExpenses || (activeDay === 1 ? 415000 : activeDay === 2 ? 425000 : 395000))}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <ReceiptText className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#f1f5f9] flex justify-between text-xs text-[#64748b]">
              <span>Procurement & Logistics</span>
              <span className="font-bold text-red-600 font-mono">
                {dayFin.expenses?.length || 5} Records
              </span>
            </div>
          </Card>

          {/* Day Net Income */}
          <Card className="p-4 bg-white border border-[#e2e8f0]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                  Day {activeDay} Net Income
                </p>
                <h3 className="text-2xl font-black text-emerald-600 mt-1 font-mono">
                  {formatCurrency(dayFin.netIncome || (activeDay === 1 ? 411500 : activeDay === 2 ? 457000 : 452500))}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#f1f5f9] flex justify-between text-xs text-[#64748b]">
              <span>Profit Margin:</span>
              <span className="font-bold text-emerald-700">
                {dayFin.totalSales > 0
                  ? `${Math.round((dayFin.netIncome / dayFin.totalSales) * 100)}% Margin`
                  : '50% Margin'}
              </span>
            </div>
          </Card>

          {/* Closing Status */}
          <Card className="p-4 bg-white border border-[#e2e8f0]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                  Audit & Closing Status
                </p>
                <h3
                  className={`text-xl font-black mt-1 ${
                    dayClosing.isClosed ? 'text-amber-700' : 'text-emerald-700'
                  }`}
                >
                  {dayClosing.isClosed ? 'CLOSED & LOCKED' : 'OPEN / ACTIVE'}
                </h3>
              </div>
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  dayClosing.isClosed ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {dayClosing.isClosed ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#f1f5f9] flex justify-between text-xs text-[#64748b]">
              <span>Audit:</span>
              <span className="font-medium text-[#0f172a]">
                {dayClosing.isClosed ? 'Locked for Print' : 'Live Editing Enabled'}
              </span>
            </div>
          </Card>
        </div>

        {/* PRODUCT STOCK & QUANTITY SPECIFICATION TABLE */}
        <Card className="border border-[#e2e8f0] overflow-hidden">
          <CardHeader className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2 text-[#0f172a]">
                <Utensils className="w-4 h-4 text-[#163324]" />
                Day {activeDay} Products — Stock, Distribution & Portion Income
              </CardTitle>
              <p className="text-xs text-[#64748b] mt-0.5">
                Available = Opening + Prepared • Remaining = Available - Sold • Income = Sold × Price
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => openStockModal(dayStock[0])}
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                className="bg-[#163324] text-white hover:bg-[#1f4531]"
              >
                Add / Edit Day {activeDay} Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPrintModalOpen(true)}
                leftIcon={<Printer className="w-3.5 h-3.5" />}
              >
                Print Preview
              </Button>
              <Link to="/products">
                <Button variant="outline" size="sm" leftIcon={<DollarSign className="w-3.5 h-3.5" />}>
                  Prices
                </Button>
              </Link>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f1f5f9] text-[#475569] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3 text-right">Selling Price</th>
                  <th className="p-3 text-right">Opening Stock</th>
                  <th className="p-3 text-right">Prepared / Recv</th>
                  <th className="p-3 text-right bg-emerald-50/50 text-emerald-950">
                    Available Stock
                  </th>
                  <th className="p-3 text-right font-black text-[#163324]">Sold / Distributed</th>
                  <th className="p-3 text-right text-amber-800">Remaining</th>
                  <th className="p-3 text-right font-black text-[#163324]">Total Income (₹)</th>
                  <th className="p-3 text-center">Quick Distribution</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {dayStock.map((stk) => {
                  const prod = products.find((p) => p.productName === stk.productName)
                  return (
                    <tr key={stk.id || stk.productId} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="p-3">
                        <div className="font-black text-[#0f172a] text-sm">{stk.productName}</div>
                        <div className="text-[11px] text-[#64748b]">{stk.notes || 'Daily stock register item'}</div>
                      </td>
                      <td className="p-3 text-[#475569] font-medium">{stk.unit}</td>
                      <td className="p-3 text-right">
                        <span className="font-black text-sm text-[#163324] font-mono">
                          ₹{stk.price}
                        </span>
                      </td>
                      <td className="p-3 text-right font-mono text-[#475569]">
                        {formatNumber(stk.openingStock || 0)}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[#0f172a]">
                        {formatNumber(stk.preparedReceived)}
                      </td>
                      <td className="p-3 text-right font-mono font-black text-emerald-800 bg-emerald-50/40">
                        {formatNumber(stk.availableStock)}
                      </td>
                      <td className="p-3 text-right font-mono font-black text-base text-[#163324]">
                        {formatNumber(stk.soldDistributed)}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-amber-700">
                        {formatNumber(stk.remainingStock)}
                      </td>
                      <td className="p-3 text-right font-mono font-black text-base text-[#163324]">
                        ₹{stk.income.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            disabled={dayClosing.isClosed}
                            onClick={() => handleQuickIncrement(stk.productName, 10)}
                            className="px-2 py-1 text-[10px] font-bold rounded bg-[#163324]/10 hover:bg-[#163324] hover:text-white transition-all disabled:opacity-40"
                          >
                            +10
                          </button>
                          <button
                            type="button"
                            disabled={dayClosing.isClosed}
                            onClick={() => handleQuickIncrement(stk.productName, 50)}
                            className="px-2 py-1 text-[10px] font-bold rounded bg-[#163324]/10 hover:bg-[#163324] hover:text-white transition-all disabled:opacity-40"
                          >
                            +50
                          </button>
                          <button
                            type="button"
                            disabled={dayClosing.isClosed}
                            onClick={() => handleQuickIncrement(stk.productName, 100)}
                            className="px-2 py-1 text-[10px] font-bold rounded bg-[#163324]/10 hover:bg-[#163324] hover:text-white transition-all disabled:opacity-40"
                          >
                            +100
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="xs"
                            disabled={dayClosing.isClosed}
                            onClick={() => openStockModal(stk)}
                            leftIcon={<Edit2 className="w-3 h-3" />}
                          >
                            Stock
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            onClick={() => {
                              if (prod) {
                                setEditingProduct(prod)
                                setIsPriceModalOpen(true)
                              }
                            }}
                            leftIcon={<DollarSign className="w-3 h-3" />}
                          >
                            Price
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot className="bg-[#f8fafc] border-t-2 border-[#e2e8f0] font-black text-xs">
                <tr>
                  <td colSpan={5} className="p-3 text-right uppercase tracking-wider text-[#475569]">
                    Day {activeDay} Grand Totals:
                  </td>
                  <td className="p-3 text-right font-mono text-emerald-900 bg-emerald-50/60">
                    {formatNumber(dayStock.reduce((s, i) => s + i.availableStock, 0))} Total
                  </td>
                  <td className="p-3 text-right font-mono text-base text-[#163324]">
                    {formatNumber(dayStock.reduce((s, i) => s + i.soldDistributed, 0))} Distributed
                  </td>
                  <td className="p-3 text-right font-mono text-amber-800">
                    {formatNumber(dayStock.reduce((s, i) => s + i.remainingStock, 0))} Buffer
                  </td>
                  <td className="p-3 text-right font-mono text-lg text-[#163324]">
                    {formatCurrency(dayFin.totalSales || (activeDay === 1 ? 826500 : activeDay === 2 ? 882000 : 847500))}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        {/* One Counter & Kitchen Execution Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-[#e2e8f0]">
            <CardHeader className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0]">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#163324]" />
                  Strictly ONE Counter Protocol (Day {activeDay})
                </span>
                <Badge variant={counterStatus === 'OPEN' ? 'success' : 'warning'} size="sm">
                  Counter: {counterStatus}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs text-[#475569]">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-900 block font-bold">
                    Single Central Serving Line Active
                  </strong>
                  <p className="text-emerald-800 mt-0.5">
                    All guest meals, popcorn, and water bottles are issued exclusively from Counter 1.
                    No auxiliary counters are active to prevent inventory leakage.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-2">
                <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-[10px] uppercase font-bold text-[#64748b] block">Biryani Staged</span>
                  <span className="text-base font-black text-[#163324]">
                    {formatNumber(dayStock.find((s) => s.productName.includes('Biryani'))?.remainingStock || 300)}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-[10px] uppercase font-bold text-[#64748b] block">Popcorn Cones</span>
                  <span className="text-base font-black text-amber-700">
                    {formatNumber(dayStock.find((s) => s.productName.includes('Popcorn'))?.remainingStock || 200)}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-[10px] uppercase font-bold text-[#64748b] block">Water Bottles</span>
                  <span className="text-base font-black text-[#0284c7]">
                    {formatNumber(dayStock.find((s) => s.productName.includes('Water'))?.remainingStock || 500)}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPrintModalOpen(true)}
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                >
                  Print Report
                </Button>
                <Link to="/one-counter">
                  <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Counter Controller
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Right: Day Tasks & Checkpoints */}
          <Card className="border border-[#e2e8f0]">
            <CardHeader className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#163324]" />
                Day {activeDay} Operational Tasks & Milestones
              </CardTitle>
              <Link to="/tasks">
                <span className="text-xs text-[#163324] hover:underline font-bold">View All Tasks</span>
              </Link>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 max-h-[260px] overflow-y-auto">
              {dayTasks.length === 0 ? (
                <p className="text-xs text-[#64748b] text-center py-4">No tasks pending for this day.</p>
              ) : (
                dayTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => toggleTaskStatus(t.id)}
                    className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                      t.status === 'Completed'
                        ? 'bg-[#f8fafc] border-[#e2e8f0] opacity-60 line-through'
                        : 'bg-white border-[#cbd5e1] hover:border-[#163324]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={t.status === 'Completed'}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-[#163324] focus:ring-[#163324]"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#0f172a] block">{t.title}</span>
                        <span className="text-[10px] text-[#64748b]">{t.assignedTo || 'Operations Crew'}</span>
                      </div>
                    </div>
                    <Badge variant={t.priority === 'High' ? 'danger' : 'neutral'} size="xs">
                      {t.priority}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. INVISIBLE-ON-SCREEN, VISIBLE-ON-PRINT OFFICIAL A4 DOCUMENT             */}
      {/* ========================================================================= */}
      <div className="hidden print:block a4-print-sheet">
        <Phase12ReportTemplate
          id="day-operations-pdf-root"
          reportType={`day${activeDay}`}
          event={event}
          day1Fin={activeDay === 1 ? dayFin : day1Fin}
          day2Fin={activeDay === 2 ? dayFin : day2Fin}
          day3Fin={activeDay === 3 ? dayFin : day3Fin}
          threeDayFin={threeDayFin}
          day1Stock={day1Stock}
          day2Stock={day2Stock}
          day3Stock={day3Stock}
          stock={dayStock}
          currentDay={activeDay}
          expenses={expenses}
          tasks={tasks}
        />
      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE FULL-PAGE A4 PRINT MODAL                                   */}
      {/* ========================================================================= */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex flex-col p-4 sm:p-6 overflow-y-auto backdrop-blur-xs print:hidden">
          {/* Top Bar inside Modal */}
          <div className="max-w-[900px] w-full mx-auto mb-3 flex items-center justify-between p-3 rounded-xl bg-[#163324] text-white shadow-lg">
            <div className="flex items-center gap-2.5">
              <Printer className="w-5 h-5 text-[#c29c5e]" />
              <div>
                <h3 className="text-sm font-bold text-white leading-none">
                  Print Day {activeDay} Operations & Financial Report
                </h3>
                <span className="text-[10px] text-white/70">
                  Ready for instant PDF download or physical A4 printing
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isGeneratingPdf}
                onClick={handleDownloadPdf}
                leftIcon={<Download className="w-3.5 h-3.5 text-[#c29c5e]" />}
                className="text-white border-white/30 hover:bg-white/10"
              >
                {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={triggerDirectPrint}
                leftIcon={<Printer className="w-3.5 h-3.5" />}
                className="bg-[#c29c5e] text-[#163324] font-black border-none hover:bg-[#b08b4e]"
              >
                Print A4 Sheet
              </Button>
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content: The Exact Phase12ReportTemplate */}
          <div className="max-w-[900px] w-full mx-auto bg-white rounded-xl shadow-2xl p-2 sm:p-4">
            <Phase12ReportTemplate
              id="day-modal-report-pdf-root"
              reportType={`day${activeDay}`}
              event={event}
              day1Fin={activeDay === 1 ? dayFin : day1Fin}
              day2Fin={activeDay === 2 ? dayFin : day2Fin}
              day3Fin={activeDay === 3 ? dayFin : day3Fin}
              threeDayFin={threeDayFin}
              day1Stock={day1Stock}
              day2Stock={day2Stock}
              day3Stock={day3Stock}
              stock={dayStock}
              currentDay={activeDay}
              expenses={expenses}
              tasks={tasks}
            />
          </div>
        </div>
      )}

      {/* Day Closing Modal */}
      <DayClosingModal
        isOpen={isClosingModalOpen}
        onClose={() => setIsClosingModalOpen(false)}
        dayNumber={activeDay}
      />

      {/* Edit Product Price Modal */}
      <ProductPriceModal
        isOpen={isPriceModalOpen}
        onClose={() => {
          setIsPriceModalOpen(false)
          setEditingProduct(null)
        }}
        product={editingProduct}
        currentDayNumber={activeDay}
      />

      {/* Edit Stock / Add Details Modal */}
      {selectedStockForEdit && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs print:hidden">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-black text-[#0f172a]">
                Day {activeDay} Details & Stock Editor
              </h3>
              <button
                type="button"
                onClick={() => setSelectedStockForEdit(null)}
                className="p-1 rounded text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#64748b] mb-4">
              Enter your exact Day {activeDay} product numbers below. All figures synchronize automatically with the live dashboard and A4 PDF reports.
            </p>

            {/* Product Switch Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#f1f5f9] rounded-lg mb-4 text-xs">
              {dayStock.map((item) => {
                const isSelected =
                  stockEditValues.productId === item.productId ||
                  (!stockEditValues.productId && selectedStockForEdit.productId === item.productId)
                return (
                  <button
                    key={item.productId}
                    type="button"
                    onClick={() => handleProductSwitchInModal(item.productId)}
                    className={`flex-1 py-1.5 px-2 rounded-md font-bold text-center transition-all ${
                      isSelected
                        ? 'bg-white text-[#163324] shadow-xs'
                        : 'text-[#64748b] hover:text-[#0f172a]'
                    }`}
                  >
                    {item.productName}
                  </button>
                )
              })}
            </div>

            <form onSubmit={handleSaveStock} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Selling Price (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-[#64748b] font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min="1"
                      value={stockEditValues.price}
                      onChange={(e) =>
                        setStockEditValues({ ...stockEditValues, price: e.target.value })
                      }
                      className="w-full pl-7 pr-3 py-2 text-sm border border-[#cbd5e1] rounded-lg font-mono font-bold text-[#163324] focus:ring-2 focus:ring-[#163324] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Opening Stock ({stockEditValues.unit})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stockEditValues.opening}
                    onChange={(e) =>
                      setStockEditValues({ ...stockEditValues, opening: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-[#cbd5e1] rounded-lg font-mono focus:ring-2 focus:ring-[#163324] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Prepared / Available Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={stockEditValues.prepared}
                  onChange={(e) =>
                    setStockEditValues({ ...stockEditValues, prepared: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-[#cbd5e1] rounded-lg font-mono focus:ring-2 focus:ring-[#163324] focus:outline-none font-bold text-[#0f172a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#334155] mb-1">
                  Sold / Distributed Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={stockEditValues.sold}
                  onChange={(e) =>
                    setStockEditValues({ ...stockEditValues, sold: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-[#cbd5e1] rounded-lg font-mono focus:ring-2 focus:ring-[#163324] focus:outline-none font-bold text-emerald-800"
                />
              </div>

              <div className="p-3 bg-[#f8fafc] rounded-lg text-xs space-y-1.5 border border-[#e2e8f0]">
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Total Available Stock:</span>
                  <strong className="font-mono text-[#0f172a]">
                    {Number(stockEditValues.opening || 0) + Number(stockEditValues.prepared || 0)} {stockEditValues.unit}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748b]">Remaining Buffer:</span>
                  <strong className="font-mono text-amber-700">
                    {Math.max(
                      0,
                      Number(stockEditValues.opening || 0) +
                        Number(stockEditValues.prepared || 0) -
                        Number(stockEditValues.sold || 0)
                    )} {stockEditValues.unit}
                  </strong>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-[#e2e8f0]">
                  <span className="font-semibold text-[#163324]">Portion Income:</span>
                  <strong className="font-mono text-base text-[#163324]">
                    ₹
                    {(
                      Number(stockEditValues.sold || 0) * Number(stockEditValues.price || 0)
                    ).toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedStockForEdit(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" className="bg-[#163324] text-white">
                  Save Day {activeDay} Details
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
export default DayOperations
