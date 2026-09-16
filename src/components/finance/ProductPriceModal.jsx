import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { IndianRupee, Tag, ShieldCheck, TrendingUp } from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { useToast } from '../ui/ToastContext'

export function ProductPriceModal({
  isOpen,
  onClose,
  product,
  currentDayNumber = 1,
  onSavePrice,
}) {
  const toast = useToast()
  const { updateProductPrice } = useFinance()

  const [newPrice, setNewPrice] = useState('')
  const [newCostPrice, setNewCostPrice] = useState('')
  const [scope, setScope] = useState('current_day') // 'current_day' | 'future_days' | 'all_days'

  useEffect(() => {
    if (product) {
      setNewPrice(product.sellingPrice || '')
      setNewCostPrice(product.costPrice || '')
      setScope('current_day')
    }
  }, [product, isOpen])

  if (!product) return null

  const oldPrice = Number(product.sellingPrice) || 0
  const oldCostPrice = Number(product.costPrice) || 0

  const handleSubmit = (e) => {
    e.preventDefault()
    const parsedPrice = Number(newPrice)
    const parsedCost = Number(newCostPrice) || 0
    if (parsedPrice <= 0) {
      toast.warning('Invalid Price', 'Please enter a valid selling price greater than ₹0.')
      return
    }

    if (onSavePrice) {
      onSavePrice(product.id, parsedPrice, scope, currentDayNumber)
    } else {
      updateProductPrice(product.id, parsedPrice, scope, currentDayNumber, parsedCost)
    }

    toast.success(
      'Price Updated Successfully',
      `"${product.productName}" updated: Selling Price ₹${parsedPrice.toLocaleString('en-IN')}, Cost Price ₹${parsedCost.toLocaleString('en-IN')}.`
    )
    onClose()
  }

  const calculatedMargin = (Number(newPrice) || 0) - (Number(newCostPrice) || 0)
  const calculatedMarginPercent =
    Number(newPrice) > 0 ? ((calculatedMargin / Number(newPrice)) * 100).toFixed(0) : 0

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Dish Price — ${product.productName}`}
      description="Update selling price and cost price for event-level sales tracking with scope control."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Product Overview */}
        <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-[#0f172a] text-sm block">{product.productName}</span>
            <span className="text-[#64748b]">{product.category} • {product.unit}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-[#64748b] block">Current Selling Price</span>
            <span className="text-base font-black text-[#163324]">
              ₹{oldPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* New Selling Price & Cost Price Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              New Selling Price (₹) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
              <input
                type="number"
                min="1"
                step="1"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="e.g. 40"
                className="w-full pl-9 pr-3 py-2 text-sm font-black text-[#163324] border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
                required
                autoFocus
              />
            </div>
            <span className="text-[10px] text-[#64748b] mt-0.5 block">Old: ₹{oldPrice}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Cost Price (₹)
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
              <input
                type="number"
                min="0"
                step="1"
                value={newCostPrice}
                onChange={(e) => setNewCostPrice(e.target.value)}
                placeholder="e.g. 15"
                className="w-full pl-9 pr-3 py-2 text-sm font-semibold text-[#475569] border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
              />
            </div>
            <span className="text-[10px] text-[#64748b] mt-0.5 block">Old: ₹{oldCostPrice}</span>
          </div>
        </div>

        {/* Live Margin Preview */}
        <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-1.5 font-medium">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Estimated Unit Margin:</span>
          </div>
          <span className="font-mono font-bold">
            ₹{calculatedMargin} / unit ({calculatedMarginPercent}%)
          </span>
        </div>

        {/* Apply This Price To Selection */}
        <div className="space-y-2 pt-1">
          <label className="block text-xs font-semibold text-[#334155]">
            Apply this price to? <span className="text-red-500">*</span>
          </label>

          <div className="space-y-2">
            <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              scope === 'current_day'
                ? 'bg-emerald-50/60 border-emerald-300'
                : 'bg-white border-[#e2e8f0] hover:bg-[#f8fafc]'
            }`}>
              <input
                type="radio"
                name="priceScope"
                value="current_day"
                checked={scope === 'current_day'}
                onChange={() => setScope('current_day')}
                className="mt-0.5 text-[#163324] focus:ring-[#163324]"
              />
              <div className="text-xs">
                <span className="font-bold text-[#0f172a] block">Current Day Only (Day {currentDayNumber})</span>
                <span className="text-[#64748b] text-[11px]">
                  Updates sales records strictly for Day {currentDayNumber}. Other event days remain unaffected.
                </span>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              scope === 'future_days'
                ? 'bg-emerald-50/60 border-emerald-300'
                : 'bg-white border-[#e2e8f0] hover:bg-[#f8fafc]'
            }`}>
              <input
                type="radio"
                name="priceScope"
                value="future_days"
                checked={scope === 'future_days'}
                onChange={() => setScope('future_days')}
                className="mt-0.5 text-[#163324] focus:ring-[#163324]"
              />
              <div className="text-xs">
                <span className="font-bold text-[#0f172a] block">Future Days (Day {currentDayNumber} and onwards)</span>
                <span className="text-[#64748b] text-[11px]">
                  Applies new price to active and subsequent days. Already closed historical days are protected.
                </span>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              scope === 'all_days'
                ? 'bg-emerald-50/60 border-emerald-300'
                : 'bg-white border-[#e2e8f0] hover:bg-[#f8fafc]'
            }`}>
              <input
                type="radio"
                name="priceScope"
                value="all_days"
                checked={scope === 'all_days'}
                onChange={() => setScope('all_days')}
                className="mt-0.5 text-[#163324] focus:ring-[#163324]"
              />
              <div className="text-xs">
                <span className="font-bold text-[#0f172a] block">All Days</span>
                <span className="text-[#64748b] text-[11px]">
                  Applies globally across all unclosed open event days.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Protection Audit Notice */}
        <div className="p-2.5 rounded-lg bg-[#f1f5f9] border border-[#e2e8f0] flex items-center gap-2 text-[11px] text-[#475569]">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Historical Protection:</strong> Completed and closed day records are locked and will not be altered automatically.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e2e8f0]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Update Price
          </Button>
        </div>
      </form>
    </Modal>
  )
}
