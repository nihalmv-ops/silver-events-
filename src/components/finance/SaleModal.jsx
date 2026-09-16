import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { IndianRupee, Layers, Calendar, Calculator, Tag } from 'lucide-react'

export function SaleModal({
  isOpen,
  onClose,
  sale = null,
  products = [],
  defaultDay = 1,
  defaultEventId = 'evt-college-3day',
  onSave,
}) {
  const [productId, setProductId] = useState(products[0]?.id || '')
  const [dayNumber, setDayNumber] = useState(defaultDay)
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (sale) {
      setProductId(sale.productId || products[0]?.id || '')
      setDayNumber(sale.dayNumber || defaultDay)
      setQuantity(sale.quantity || '')
      setPrice(sale.price || '')
      setDate(sale.date || new Date().toISOString().split('T')[0])
      setNotes(sale.notes || '')
    } else {
      const initialProd = products[0]
      setProductId(initialProd?.id || '')
      setDayNumber(defaultDay)
      setQuantity(1000)
      setPrice(initialProd?.sellingPrice || 150)
      setDate(new Date().toISOString().split('T')[0])
      setNotes('')
    }
  }, [sale, isOpen, products, defaultDay])

  const selectedProduct = products.find((p) => p.id === productId) || products[0]

  const handleProductChange = (e) => {
    const id = e.target.value
    setProductId(id)
    const prod = products.find((p) => p.id === id)
    if (prod) {
      setPrice(prod.sellingPrice)
    }
  }

  // Automatic calculation: Quantity * Price = Total
  const calculatedTotal = (Number(quantity) || 0) * (Number(price) || 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedProduct) return
    const numQty = Number(quantity)
    const numPrice = Number(price)
    if (numQty <= 0 || numPrice < 0) return

    onSave({
      eventId: defaultEventId,
      dayNumber: Number(dayNumber),
      productId: selectedProduct.id,
      productName: selectedProduct.productName,
      quantity: numQty,
      price: numPrice,
      total: numQty * numPrice,
      date,
      notes: notes.trim(),
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={sale ? 'Edit Event Sale Record' : 'Record Event Sales / Income'}
      description="Record product quantities, unit selling price, and automatic totals for this event day."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Day & Product */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Event Day <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Layers className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
              <select
                value={dayNumber}
                onChange={(e) => setDayNumber(Number(e.target.value))}
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
                required
              >
                <option value={1}>Day 1</option>
                <option value={2}>Day 2</option>
                <option value={3}>Day 3</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Product / Menu Item <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
              <select
                value={productId}
                onChange={handleProductChange}
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
                required
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.productName} (₹{p.sellingPrice})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quantity & Unit Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full px-3 py-2 text-xs font-semibold border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
              required
            />
            <span className="text-[10px] text-[#64748b] mt-0.5 block">
              Unit: {selectedProduct?.unit || 'Portion'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Price per Unit (₹) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
              <input
                type="number"
                min="0"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 150"
                className="w-full pl-9 pr-3 py-2 text-xs font-semibold border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
                required
              />
            </div>
            <span className="text-[10px] text-[#64748b] mt-0.5 block">
              Standard price: ₹{selectedProduct?.sellingPrice}
            </span>
          </div>
        </div>

        {/* Prominent Automatic Total Card */}
        <div className="p-3.5 rounded-xl bg-[#163324] text-white border border-[#1e3a2b] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#c29c5e]" />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#cbd5e1] block tracking-wider">
                Automatic Calculation: Quantity × Price
              </span>
              <span className="text-xs text-[#94a3b8]">
                {Number(quantity || 0).toLocaleString('en-IN')} units × ₹{Number(price || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-[#dfbe82]">
              ₹{calculatedTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Date & Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#334155] mb-1">Date</label>
          <div className="relative">
            <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#334155] mb-1">Operational Notes</label>
          <input
            type="text"
            placeholder="e.g. Morning VIP dining + general student counters"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e2e8f0]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {sale ? 'Save Changes' : 'Record Sale'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
