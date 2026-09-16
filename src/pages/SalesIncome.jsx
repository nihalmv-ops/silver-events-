import React, { useState, useMemo } from 'react'
import {
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Tag,
  TrendingUp,
  Package,
  Layers,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Receipt,
  FileSpreadsheet,
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
import { SaleModal } from '../components/finance/SaleModal'
import { ProductPriceModal } from '../components/finance/ProductPriceModal'
import { DayClosingModal } from '../components/finance/DayClosingModal'

export function SalesIncome() {
  const toast = useToast()
  const { events, activeEventId } = useEvents()
  const {
    products,
    sales,
    closings,
    deleteSale,
    deleteProduct,
    getDailyFinancials,
    getThreeDayFinancials,
  } = useFinance()

  // Selected event & day state
  const [selectedEventId, setSelectedEventId] = useState(activeEventId || 'evt-college-3day')
  const [selectedDay, setSelectedDay] = useState(1) // 1, 2, 3, or 'all'

  // Modals state
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false)
  const [editingSale, setEditingSale] = useState(null)

  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const [isClosingModalOpen, setIsClosingModalOpen] = useState(false)
  const [closingDayNumber, setClosingDayNumber] = useState(1)

  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0]
  }, [events, selectedEventId])

  // Current day closing status
  const currentDayClosing = useMemo(() => {
    if (selectedDay === 'all') return null
    return closings.days[selectedDay] || { isClosed: false }
  }, [closings, selectedDay])

  // Filtered sales
  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      if (selectedEventId && s.eventId !== selectedEventId) return false
      if (selectedDay !== 'all' && Number(s.dayNumber) !== Number(selectedDay)) return false
      return true
    })
  }, [sales, selectedEventId, selectedDay])

  // Sales totals for selected view
  const salesMetrics = useMemo(() => {
    const totalRevenue = filteredSales.reduce((sum, s) => sum + (Number(s.total) || 0), 0)
    const totalQuantity = filteredSales.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0)
    const uniqueProducts = new Set(filteredSales.map((s) => s.productId)).size

    return { totalRevenue, totalQuantity, uniqueProducts }
  }, [filteredSales])

  // 3-Day Financials & Product Summary
  const threeDayData = useMemo(() => {
    return getThreeDayFinancials(selectedEventId)
  }, [getThreeDayFinancials, selectedEventId, sales])

  // Daily Financials for Day 1, 2, 3
  const day1Fin = useMemo(() => getDailyFinancials(selectedEventId, 1), [getDailyFinancials, selectedEventId])
  const day2Fin = useMemo(() => getDailyFinancials(selectedEventId, 2), [getDailyFinancials, selectedEventId])
  const day3Fin = useMemo(() => getDailyFinancials(selectedEventId, 3), [getDailyFinancials, selectedEventId])

  // Handlers
  const handleOpenAddSale = () => {
    if (selectedDay !== 'all' && currentDayClosing?.isClosed) {
      toast.warning('Day Locked', `Day ${selectedDay} is closed. Reopen the day to add new sales records.`)
      return
    }
    setEditingSale(null)
    setIsSaleModalOpen(true)
  }

  const handleOpenEditSale = (sale) => {
    if (closings.days[sale.dayNumber]?.isClosed) {
      toast.warning('Day Locked', `Day ${sale.dayNumber} is closed. Historical records cannot be modified without reopening.`)
      return
    }
    setEditingSale(sale)
    setIsSaleModalOpen(true)
  }

  const handleDeleteSale = (sale) => {
    if (closings.days[sale.dayNumber]?.isClosed) {
      toast.warning('Day Locked', `Day ${sale.dayNumber} is closed. Cannot delete locked records.`)
      return
    }
    if (window.confirm(`Are you sure you want to delete the sale for "${sale.productName}" (₹${formatNumber(sale.total)})?`)) {
      deleteSale(sale.id)
      toast.success('Sale Deleted', 'Sales record has been removed successfully.')
    }
  }

  const handleOpenPriceEdit = (prod) => {
    setEditingProduct(prod)
    setIsPriceModalOpen(true)
  }

  const handleOpenCloseDay = (dayNum) => {
    setClosingDayNumber(dayNum)
    setIsClosingModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Event Sales & Income Management"
        description="Comprehensive daily sales tally, product price management, portion-wise revenue calculations, and strict day closing protocol."
        badge="Internal Sales Accounting"
        badgeVariant="gold"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/financials">
              <Button variant="outline" size="sm" leftIcon={<TrendingUp className="w-3.5 h-3.5" />}>
                Financial Summary
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleOpenAddSale}
            >
              Record Daily Sale
            </Button>
          </div>
        }
      />

      {/* Strict internal operations banner */}
      <div className="p-3.5 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-xs text-[#92400e] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 shrink-0 text-[#d97706]" />
          <span>
            <strong>Internal Operations Protocol:</strong> Tracking event meal portion yields and gross catering revenue. Strictly no individual retail billing or customer POS terminals.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] font-semibold text-[#b45309] bg-white px-2.5 py-1 rounded-md border border-[#fde68a]">
          3-Day Event Sales Target: {formatCurrency(threeDayData.totalSales)}
        </div>
      </div>

      {/* DAY SELECTOR & CLOSING BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748b] mr-2 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#163324]" />
            Select Day:
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

        {/* Day Closing Action */}
        {selectedDay !== 'all' && (
          <div className="flex items-center gap-2.5">
            {currentDayClosing?.isClosed ? (
              <div className="flex items-center gap-2">
                <Badge variant="warning" size="sm" className="flex items-center gap-1 py-1 px-2.5">
                  <Lock className="w-3 h-3 text-amber-700" />
                  Day {selectedDay} Closed & Locked
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Unlock className="w-3.5 h-3.5" />}
                  onClick={() => handleOpenCloseDay(selectedDay)}
                >
                  Reopen Day {selectedDay}
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white border-amber-600"
                leftIcon={<Lock className="w-3.5 h-3.5" />}
                onClick={() => handleOpenCloseDay(selectedDay)}
              >
                Close Day {selectedDay}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* KPI METRIC CARDS FOR CURRENT VIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border border-[#e2e8f0]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                {selectedDay === 'all' ? 'All 3 Days Sales / Income' : `Day ${selectedDay} Sales / Income`}
              </p>
              <h3 className="text-2xl font-bold text-[#163324] mt-1 font-mono">
                {formatCurrency(salesMetrics.totalRevenue)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#163324]/10 text-[#163324] flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#64748b]">
            <span>Total Units Sold:</span>
            <span className="font-bold text-[#0f172a]">{formatNumber(salesMetrics.totalQuantity)} portions</span>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-[#e2e8f0]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                {selectedDay === 'all' ? 'All 3 Days Expenses' : `Day ${selectedDay} Expenses`}
              </p>
              <h3 className="text-2xl font-bold text-red-600 mt-1 font-mono">
                {formatCurrency(
                  selectedDay === 'all'
                    ? threeDayData.totalExpenses
                    : selectedDay === 1
                    ? day1Fin.totalExpenses
                    : selectedDay === 2
                    ? day2Fin.totalExpenses
                    : day3Fin.totalExpenses
                )}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#64748b]">
            <span>Accounting Verification:</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Fully Reconciled
            </span>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-[#e2e8f0]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748b]">
                {selectedDay === 'all' ? 'All 3 Days Net Income' : `Day ${selectedDay} Net Income`}
              </p>
              <h3 className="text-2xl font-bold text-emerald-700 mt-1 font-mono">
                {formatCurrency(
                  selectedDay === 'all'
                    ? threeDayData.finalNetIncome
                    : selectedDay === 1
                    ? day1Fin.netIncome
                    : selectedDay === 2
                    ? day2Fin.netIncome
                    : day3Fin.netIncome
                )}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#64748b]">
            <span>Net Operating Margin:</span>
            <span className="font-bold text-emerald-700">
              {salesMetrics.totalRevenue > 0
                ? `${(
                    ((selectedDay === 'all'
                      ? threeDayData.finalNetIncome
                      : selectedDay === 1
                      ? day1Fin.netIncome
                      : selectedDay === 2
                      ? day2Fin.netIncome
                      : day3Fin.netIncome) /
                      salesMetrics.totalRevenue) *
                    100
                  ).toFixed(1)}%`
                : '0%'}
            </span>
          </div>
        </Card>
      </div>

      {/* PRODUCT PRICE MANAGEMENT */}
      <Card className="border border-[#e2e8f0] overflow-hidden">
        <CardHeader className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-[#0f172a]">
              <Tag className="w-4 h-4 text-[#c29c5e]" />
              Product & Menu Price Management
            </CardTitle>
            <p className="text-xs text-[#64748b] mt-0.5">
              Standardized dish selling and cost price control with scope-based change protection
            </p>
          </div>
          <Badge variant="gold" size="sm" className="w-fit">
            Historical Days Protected
          </Badge>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f1f5f9] text-[#475569] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Selling Price</th>
                <th className="p-3 text-right">Cost Price</th>
                <th className="p-3 text-right">Unit Margin</th>
                <th className="p-3">Portion Unit</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {products.map((prod) => {
                const margin = (prod.sellingPrice || 0) - (prod.costPrice || 0)
                const marginPercent =
                  prod.sellingPrice > 0 ? ((margin / prod.sellingPrice) * 100).toFixed(0) : 0
                return (
                  <tr key={prod.id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="p-3 font-semibold text-[#0f172a]">
                      <div className="flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-[#163324]" />
                        {prod.productName}
                      </div>
                      {prod.notes && <span className="text-[10px] text-[#94a3b8] block mt-0.5">{prod.notes}</span>}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#f1f5f9] font-medium text-[#475569] text-[10px]">
                        {prod.category}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-[#163324]">
                      {formatCurrency(prod.sellingPrice)}
                    </td>
                    <td className="p-3 text-right font-mono text-[#64748b]">
                      {formatCurrency(prod.costPrice)}
                    </td>
                    <td className="p-3 text-right font-mono">
                      <span className="text-emerald-700 font-semibold">{formatCurrency(margin)}</span>{' '}
                      <span className="text-[10px] text-[#94a3b8]">({marginPercent}%)</span>
                    </td>
                    <td className="p-3 text-[#64748b]">{prod.unit}</td>
                    <td className="p-3">
                      <Badge variant="success" size="sm">
                        {prod.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Edit2 className="w-3 h-3" />}
                        onClick={() => handleOpenPriceEdit(prod)}
                        className="text-xs h-7 px-2.5"
                      >
                        Edit Price
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* DAILY SALES RECORDS TABLE */}
      <Card className="border border-[#e2e8f0] overflow-hidden">
        <CardHeader className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-[#0f172a]">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              {selectedDay === 'all'
                ? 'All 3 Days Sales Records'
                : `Day ${selectedDay} Sales Records`}
            </CardTitle>
            <p className="text-xs text-[#64748b] mt-0.5">
              Verified meal & beverage volumes distributed through single counter
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={handleOpenAddSale}
            >
              + Add Sale Record
            </Button>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          {filteredSales.length === 0 ? (
            <div className="p-8 text-center">
              <Package className="w-8 h-8 text-[#94a3b8] mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#475569]">No sales records found</p>
              <p className="text-xs text-[#94a3b8] mt-1">
                Click "+ Add Sale Record" to enter sales data for Day {selectedDay}.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f1f5f9] text-[#475569] font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Day</th>
                  <th className="p-3">Product</th>
                  <th className="p-3 text-right">Quantity</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Total (Qty × Price)</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Notes</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {filteredSales.map((sale) => {
                  const dayClosed = closings.days[sale.dayNumber]?.isClosed
                  return (
                    <tr key={sale.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="p-3 font-semibold text-[#163324]">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#163324]/10 text-[10px] font-bold">
                          Day {sale.dayNumber}
                          {dayClosed && <Lock className="w-2.5 h-2.5 text-amber-700" />}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-[#0f172a]">{sale.productName}</td>
                      <td className="p-3 text-right font-mono font-bold text-[#0f172a]">
                        {formatNumber(sale.quantity)}
                      </td>
                      <td className="p-3 text-right font-mono text-[#64748b]">
                        {formatCurrency(sale.price)}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[#163324] text-sm">
                        {formatCurrency(sale.total)}
                      </td>
                      <td className="p-3 text-[#64748b] font-mono text-[11px]">{sale.date}</td>
                      <td className="p-3 text-[#64748b] max-w-[200px] truncate">{sale.notes || '—'}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditSale(sale)}
                            className="h-7 w-7 p-0 text-[#64748b] hover:text-[#0f172a]"
                            title={dayClosed ? 'Locked - Day Closed' : 'Edit Sale'}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSale(sale)}
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            title={dayClosed ? 'Locked - Day Closed' : 'Delete Sale'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot className="bg-[#f8fafc] border-t-2 border-[#cbd5e1] font-bold text-xs">
                <tr>
                  <td colSpan={2} className="p-3 text-[#0f172a] uppercase">
                    Total {selectedDay === 'all' ? 'All Days' : `Day ${selectedDay}`}
                  </td>
                  <td className="p-3 text-right font-mono text-[#0f172a]">
                    {formatNumber(salesMetrics.totalQuantity)}
                  </td>
                  <td className="p-3 text-right text-[#64748b]">—</td>
                  <td className="p-3 text-right font-mono text-[#163324] text-sm">
                    {formatCurrency(salesMetrics.totalRevenue)}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      </Card>

      {/* 3-DAY PRODUCT-WISE TOTALS SUMMARY */}
      <Card className="border border-[#e2e8f0] overflow-hidden">
        <CardHeader className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-[#0f172a]">
              <Sparkles className="w-4 h-4 text-[#c29c5e]" />
              3-Day Complete Product-Wise Sales Summary
            </CardTitle>
            <p className="text-xs text-[#64748b] mt-0.5">
              Comprehensive distribution yield across all 3 days showing authentic portion totals
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#163324] bg-[#163324]/10 px-3 py-1 rounded-md">
            Grand Total Sales: {formatCurrency(threeDayData.totalSales)}
          </span>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f1f5f9] text-[#475569] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Day 1 Qty</th>
                <th className="p-3 text-right">Day 2 Qty</th>
                <th className="p-3 text-right">Day 3 Qty</th>
                <th className="p-3 text-right">Total 3-Day Qty</th>
                <th className="p-3 text-right">Selling Price</th>
                <th className="p-3 text-right">Total Income</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {threeDayData.productSummary.map((item) => (
                <tr key={item.productName} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="p-3 font-bold text-[#0f172a]">{item.productName}</td>
                  <td className="p-3 text-[#64748b]">{item.category}</td>
                  <td className="p-3 text-right font-mono text-[#475569]">{formatNumber(item.day1Qty)}</td>
                  <td className="p-3 text-right font-mono text-[#475569]">{formatNumber(item.day2Qty)}</td>
                  <td className="p-3 text-right font-mono text-[#475569]">{formatNumber(item.day3Qty)}</td>
                  <td className="p-3 text-right font-mono font-bold text-[#0f172a]">
                    {formatNumber(item.totalQty)}
                  </td>
                  <td className="p-3 text-right font-mono text-[#64748b]">
                    {formatCurrency(item.appliedPrice)}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-[#163324] text-sm">
                    {formatCurrency(item.totalIncome)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#f8fafc] border-t-2 border-[#cbd5e1] font-bold text-xs">
              <tr>
                <td colSpan={2} className="p-3 text-[#0f172a] uppercase">
                  All Products Total
                </td>
                <td className="p-3 text-right font-mono text-[#475569]">
                  {formatNumber(day1Fin.sales.reduce((s, x) => s + (x.quantity || 0), 0))}
                </td>
                <td className="p-3 text-right font-mono text-[#475569]">
                  {formatNumber(day2Fin.sales.reduce((s, x) => s + (x.quantity || 0), 0))}
                </td>
                <td className="p-3 text-right font-mono text-[#475569]">
                  {formatNumber(day3Fin.sales.reduce((s, x) => s + (x.quantity || 0), 0))}
                </td>
                <td className="p-3 text-right font-mono font-bold text-[#0f172a]">
                  {formatNumber(threeDayData.productSummary.reduce((s, x) => s + (x.totalQty || 0), 0))}
                </td>
                <td className="p-3 text-right text-[#64748b]">—</td>
                <td className="p-3 text-right font-mono font-bold text-[#163324] text-sm">
                  {formatCurrency(threeDayData.totalSales)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* Modals */}
      <SaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        sale={editingSale}
        defaultDayNumber={selectedDay === 'all' ? 1 : selectedDay}
        eventId={selectedEventId}
        eventName={currentEvent?.eventName}
      />

      <ProductPriceModal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        product={editingProduct}
        currentDayNumber={selectedDay === 'all' ? 1 : selectedDay}
      />

      <DayClosingModal
        isOpen={isClosingModalOpen}
        onClose={() => setIsClosingModalOpen(false)}
        dayNumber={closingDayNumber}
        eventId={selectedEventId}
      />
    </div>
  )
}

