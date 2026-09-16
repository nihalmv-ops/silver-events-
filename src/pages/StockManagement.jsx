import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Package,
  Layers,
  Utensils,
  Droplets,
  Sparkles,
  Calendar,
  Edit2,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Printer,
  ShieldCheck,
  DollarSign,
  ArrowRight,
  Plus,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'
import { useEvents } from '../context/EventContext'
import { useFinance } from '../hooks/useFinance'
import { formatCurrency, formatNumber } from '../utils/formatters'
import { ProductPriceModal } from '../components/finance/ProductPriceModal'

export function StockManagement() {
  const toast = useToast()
  const { events, activeEventId } = useEvents()
  const {
    products,
    getDailyStock,
    updateDailyStock,
    closings,
  } = useFinance()

  const [selectedDay, setSelectedDay] = useState(1) // 1, 2, 3, or 'all'
  const [selectedStockItem, setSelectedStockItem] = useState(null)
  const [editValues, setEditValues] = useState({ opening: 0, prepared: 0, sold: 0, notes: '' })
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const event = useMemo(() => {
    return (
      events.find((e) => e.id === 'evt-college-3day') ||
      events.find((e) => e.id === activeEventId) ||
      events[0]
    )
  }, [events, activeEventId])

  // Get stock for Day 1, 2, 3
  const day1Stock = useMemo(() => getDailyStock(event?.id, 1), [getDailyStock, event?.id])
  const day2Stock = useMemo(() => getDailyStock(event?.id, 2), [getDailyStock, event?.id])
  const day3Stock = useMemo(() => getDailyStock(event?.id, 3), [getDailyStock, event?.id])

  // Active view stock
  const currentViewStock = useMemo(() => {
    if (selectedDay === 'all') {
      // Aggregate across all 3 days
      const map = {}
      ;[...day1Stock, ...day2Stock, ...day3Stock].forEach((item) => {
        if (!map[item.productName]) {
          map[item.productName] = {
            id: `agg-${item.productId}`,
            productId: item.productId,
            productName: item.productName,
            unit: item.unit,
            price: item.price,
            openingStock: 0,
            preparedReceived: 0,
            availableStock: 0,
            soldDistributed: 0,
            remainingStock: 0,
            income: 0,
            notes: '3-Day Consolidated Total',
          }
        }
        map[item.productName].openingStock += Number(item.openingStock) || 0
        map[item.productName].preparedReceived += Number(item.preparedReceived) || 0
        map[item.productName].availableStock += Number(item.availableStock) || 0
        map[item.productName].soldDistributed += Number(item.soldDistributed) || 0
        map[item.productName].remainingStock += Number(item.remainingStock) || 0
        map[item.productName].income += Number(item.income) || 0
      })
      return Object.values(map)
    }

    if (selectedDay === 1) return day1Stock
    if (selectedDay === 2) return day2Stock
    return day3Stock
  }, [selectedDay, day1Stock, day2Stock, day3Stock])

  // Totals for current view
  const totals = useMemo(() => {
    return currentViewStock.reduce(
      (acc, item) => {
        acc.opening += Number(item.openingStock) || 0
        acc.prepared += Number(item.preparedReceived) || 0
        acc.available += Number(item.availableStock) || 0
        acc.sold += Number(item.soldDistributed) || 0
        acc.remaining += Number(item.remainingStock) || 0
        acc.income += Number(item.income) || 0
        return acc
      },
      { opening: 0, prepared: 0, available: 0, sold: 0, remaining: 0, income: 0 }
    )
  }, [currentViewStock])

  const openEdit = (item) => {
    if (selectedDay === 'all') {
      toast.info('Select a Specific Day', 'Please select Day 1, 2, or 3 to adjust day stock numbers.')
      return
    }
    const dayIsClosed = closings.days[selectedDay]?.isClosed
    if (dayIsClosed) {
      toast.warning('Day Locked', `Day ${selectedDay} is closed. Cannot modify stock.`)
      return
    }

    setSelectedStockItem(item)
    setEditValues({
      opening: item.openingStock || 0,
      prepared: item.preparedReceived || 0,
      sold: item.soldDistributed || 0,
      notes: item.notes || '',
    })
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (!selectedStockItem || selectedDay === 'all') return

    updateDailyStock(event?.id, selectedDay, selectedStockItem.productId, {
      openingStock: Number(editValues.opening),
      preparedReceived: Number(editValues.prepared),
      soldDistributed: Number(editValues.sold),
      notes: editValues.notes,
    })

    toast.success('Stock Register Updated', `Updated ${selectedStockItem.productName} for Day ${selectedDay}`)
    setSelectedStockItem(null)
  }

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title="STOCK & INVENTORY REGISTER"
        description="Comprehensive 3-day operational stock register: Opening Stock, Prepared / Received, Available, Sold, Remaining, and Calculated Revenue."
        badge="Stock Control"
        badgeVariant="gold"
        actions={
          <div className="flex items-center gap-2">
            <Link to="/one-counter">
              <Button variant="outline" size="sm">
                One Counter Station
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" size="sm">
                Product Prices
              </Button>
            </Link>
          </div>
        }
      />

      {/* 2. Top Summary / Day Selector Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-[#64748b] mr-2 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#163324]" />
            Stock Ledger Day:
          </span>
          <div className="inline-flex rounded-lg border border-[#cbd5e1] p-1 bg-[#f8fafc]">
            {[1, 2, 3].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDay(d)}
                className={`px-4 py-1.5 text-xs font-black rounded-md transition-all ${
                  selectedDay === d
                    ? 'bg-[#163324] text-white shadow-xs'
                    : 'text-[#475569] hover:text-[#0f172a] hover:bg-white'
                }`}
              >
                DAY {d}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSelectedDay('all')}
              className={`px-4 py-1.5 text-xs font-black rounded-md transition-all ${
                selectedDay === 'all'
                  ? 'bg-[#163324] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#0f172a] hover:bg-white'
              }`}
            >
              ALL 3 DAYS TOTAL
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm">
            Strictly 1 Counter
          </Badge>
          <span className="text-xs font-mono font-bold text-[#163324] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            Total Revenue: {formatCurrency(totals.income)}
          </span>
        </div>
      </div>

      {/* 3. Four Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-[#e2e8f0]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] block">
            Total Available Stock
          </span>
          <h3 className="text-2xl font-black text-[#0f172a] font-mono mt-1">
            {formatNumber(totals.available)}
          </h3>
          <p className="text-xs text-[#64748b] mt-1">
            Opening ({formatNumber(totals.opening)}) + Prepared ({formatNumber(totals.prepared)})
          </p>
        </Card>

        <Card className="p-4 bg-white border border-[#e2e8f0]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
            Sold / Distributed
          </span>
          <h3 className="text-2xl font-black text-[#163324] font-mono mt-1">
            {formatNumber(totals.sold)}
          </h3>
          <p className="text-xs text-emerald-700 mt-1 font-semibold">
            Dispensed through One Counter
          </p>
        </Card>

        <Card className="p-4 bg-white border border-[#e2e8f0]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
            Remaining In Buffer
          </span>
          <h3 className="text-2xl font-black text-amber-700 font-mono mt-1">
            {formatNumber(totals.remaining)}
          </h3>
          <p className="text-xs text-amber-800 mt-1">
            Available - Sold (Safe Staging)
          </p>
        </Card>

        <Card className="p-4 bg-white border border-[#e2e8f0]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748b] block">
            Total Portion Income
          </span>
          <h3 className="text-2xl font-black text-[#163324] font-mono mt-1">
            {formatCurrency(totals.income)}
          </h3>
          <p className="text-xs text-[#64748b] mt-1 font-mono">
            Sold × Selling Price
          </p>
        </Card>
      </div>

      {/* 4. Complete Stock Register Table */}
      <Card className="border border-[#e2e8f0] overflow-hidden">
        <CardHeader className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2 text-[#0f172a]">
              <Layers className="w-4 h-4 text-[#163324]" />
              {selectedDay === 'all'
                ? 'All 3 Days Consolidated Stock Register'
                : `Day ${selectedDay} Stock Register & Inventory Balance`}
            </CardTitle>
            <p className="text-xs text-[#64748b] mt-0.5">
              Strictly synchronized with Counter 1 distribution and kitchen dispatch logs
            </p>
          </div>
          {selectedDay !== 'all' && (
            <Link to={`/day-${selectedDay}`}>
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Day {selectedDay} Operations View
              </Button>
            </Link>
          )}
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f1f5f9] text-[#475569] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Product Name</th>
                <th className="p-3.5">Unit</th>
                <th className="p-3.5 text-right">Price (₹)</th>
                <th className="p-3.5 text-right">Opening Stock</th>
                <th className="p-3.5 text-right">Prepared / Recv</th>
                <th className="p-3.5 text-right bg-emerald-50/70 text-emerald-950 font-bold">
                  Available Stock
                </th>
                <th className="p-3.5 text-right font-black text-[#163324]">Sold / Distributed</th>
                <th className="p-3.5 text-right text-amber-800 font-bold">Remaining</th>
                <th className="p-3.5 text-right font-black text-[#163324]">Calculated Income (₹)</th>
                {selectedDay !== 'all' && <th className="p-3.5 text-center">Manage</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {currentViewStock.map((stk) => {
                const prod = products.find((p) => p.productName === stk.productName)
                return (
                  <tr key={stk.id || stk.productId} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="p-3.5">
                      <div className="font-black text-[#0f172a] text-sm">{stk.productName}</div>
                      <div className="text-[11px] text-[#64748b]">{stk.notes}</div>
                    </td>
                    <td className="p-3.5 text-[#475569] font-medium">{stk.unit}</td>
                    <td className="p-3.5 text-right font-mono font-black text-[#163324] text-sm">
                      ₹{stk.price}
                    </td>
                    <td className="p-3.5 text-right font-mono text-[#475569]">
                      {formatNumber(stk.openingStock)}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-[#0f172a]">
                      {formatNumber(stk.preparedReceived)}
                    </td>
                    <td className="p-3.5 text-right font-mono font-black text-emerald-900 bg-emerald-50/40">
                      {formatNumber(stk.availableStock)}
                    </td>
                    <td className="p-3.5 text-right font-mono font-black text-base text-[#163324]">
                      {formatNumber(stk.soldDistributed)}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-amber-700">
                      {formatNumber(stk.remainingStock)}
                    </td>
                    <td className="p-3.5 text-right font-mono font-black text-base text-[#163324]">
                      ₹{stk.income.toLocaleString('en-IN')}
                    </td>
                    {selectedDay !== 'all' && (
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => openEdit(stk)}
                            leftIcon={<Edit2 className="w-3 h-3" />}
                          >
                            Edit Stock
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
                    )}
                  </tr>
                )
              })}
            </tbody>
            <tfoot className="bg-[#f8fafc] border-t-2 border-[#cbd5e1] font-black text-xs">
              <tr>
                <td colSpan={3} className="p-3.5 text-right uppercase tracking-wider text-[#475569]">
                  {selectedDay === 'all' ? 'All 3 Days Grand Total:' : `Day ${selectedDay} Total:`}
                </td>
                <td className="p-3.5 text-right font-mono text-[#475569]">
                  {formatNumber(totals.opening)}
                </td>
                <td className="p-3.5 text-right font-mono text-[#0f172a]">
                  {formatNumber(totals.prepared)}
                </td>
                <td className="p-3.5 text-right font-mono text-emerald-950 bg-emerald-50/70">
                  {formatNumber(totals.available)}
                </td>
                <td className="p-3.5 text-right font-mono text-base text-[#163324]">
                  {formatNumber(totals.sold)}
                </td>
                <td className="p-3.5 text-right font-mono text-amber-800">
                  {formatNumber(totals.remaining)}
                </td>
                <td className="p-3.5 text-right font-mono text-lg text-[#163324]">
                  {formatCurrency(totals.income)}
                </td>
                {selectedDay !== 'all' && <td />}
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      {/* 5. MODALS */}
      {/* Edit Stock Item Modal */}
      {selectedStockItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#e2e8f0]">
            <h3 className="text-base font-black text-[#0f172a] mb-1">
              Edit Stock Balance — {selectedStockItem.productName} (Day {selectedDay})
            </h3>
            <p className="text-xs text-[#64748b] mb-4">
              Enter verified physical inventory counts. Available = Opening + Prepared. Remaining = Available - Sold.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Opening Stock ({selectedStockItem.unit})
                </label>
                <input
                  type="number"
                  min="0"
                  value={editValues.opening}
                  onChange={(e) => setEditValues({ ...editValues, opening: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#cbd5e1] rounded-lg font-mono focus:ring-2 focus:ring-[#163324] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Prepared / Received Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={editValues.prepared}
                  onChange={(e) => setEditValues({ ...editValues, prepared: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#cbd5e1] rounded-lg font-mono font-bold text-[#163324] focus:ring-2 focus:ring-[#163324] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Sold / Distributed Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={editValues.sold}
                  onChange={(e) => setEditValues({ ...editValues, sold: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-[#cbd5e1] rounded-lg font-mono font-bold text-[#163324] focus:ring-2 focus:ring-[#163324] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1">
                  Inventory Notes / Batch Ref
                </label>
                <input
                  type="text"
                  value={editValues.notes}
                  onChange={(e) => setEditValues({ ...editValues, notes: e.target.value })}
                  placeholder="e.g. Cauldron 1 to 14 verified"
                  className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:ring-2 focus:ring-[#163324] focus:outline-none"
                />
              </div>

              <div className="p-3 bg-[#f8fafc] rounded-xl text-xs space-y-1 border border-[#e2e8f0]">
                <div className="flex justify-between">
                  <span>Available Balance:</span>
                  <strong className="font-mono">
                    {Number(editValues.opening || 0) + Number(editValues.prepared || 0)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Remaining Buffer:</span>
                  <strong className="font-mono text-amber-700">
                    {Math.max(
                      0,
                      Number(editValues.opening || 0) +
                        Number(editValues.prepared || 0) -
                        Number(editValues.sold || 0)
                    )}
                  </strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#e2e8f0]">
                  <span>Calculated Sales Income (₹{selectedStockItem.price}/unit):</span>
                  <strong className="font-mono text-[#163324]">
                    ₹
                    {(
                      Number(editValues.sold || 0) * selectedStockItem.price
                    ).toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedStockItem(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Stock Numbers
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Price Modal */}
      <ProductPriceModal
        isOpen={isPriceModalOpen}
        onClose={() => {
          setIsPriceModalOpen(false)
          setEditingProduct(null)
        }}
        product={editingProduct}
        currentDayNumber={selectedDay === 'all' ? 1 : selectedDay}
      />
    </div>
  )
}
export default StockManagement
