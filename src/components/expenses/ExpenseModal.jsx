import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { EXPENSE_CATEGORIES, PAYMENT_METHODS, EXPENSE_STATUSES } from '../../hooks/useExpenses'
import { useEvents } from '../../context/EventContext'
import { useVendors } from '../../hooks/useVendors'
import { ReceiptText, IndianRupee, Calendar, Layers, Building2, CreditCard, Tag } from 'lucide-react'

export function ExpenseModal({ isOpen, onClose, onSave, expense = null, defaultEventId = 'evt-college-3day', defaultDay = 1 }) {
  const { events } = useEvents()
  const { vendors } = useVendors()

  const [formData, setFormData] = useState({
    eventId: defaultEventId,
    eventName: 'National Tech Fest 2026',
    dayNumber: defaultDay,
    category: 'Food',
    description: '',
    vendor: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    receipt: '',
    notes: '',
  })

  useEffect(() => {
    if (expense) {
      setFormData({
        eventId: expense.eventId || defaultEventId,
        eventName: expense.eventName || 'National Tech Fest 2026',
        dayNumber: expense.dayNumber !== undefined ? expense.dayNumber : defaultDay,
        category: expense.category || 'Food',
        description: expense.description || '',
        vendor: expense.vendor || '',
        amount: expense.amount || '',
        date: expense.date || new Date().toISOString().split('T')[0],
        paymentMethod: expense.paymentMethod || 'Bank Transfer',
        status: expense.status || 'Paid',
        receipt: expense.receipt || '',
        notes: expense.notes || '',
      })
    } else {
      const activeEvent = events.find((e) => e.id === defaultEventId)
      setFormData({
        eventId: defaultEventId,
        eventName: activeEvent ? activeEvent.eventName : 'National Tech Fest 2026',
        dayNumber: defaultDay,
        category: 'Food',
        description: '',
        vendor: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Bank Transfer',
        status: 'Paid',
        receipt: `RCP-${Math.floor(1000 + Math.random() * 9000)}`,
        notes: '',
      })
    }
  }, [expense, isOpen, defaultEventId, defaultDay, events])

  const handleEventChange = (e) => {
    const selectedId = e.target.value
    const ev = events.find((item) => item.id === selectedId)
    setFormData((prev) => ({
      ...prev,
      eventId: selectedId,
      eventName: ev ? ev.eventName : prev.eventName,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.description.trim()) return
    if (!formData.amount || Number(formData.amount) <= 0) return

    onSave({
      ...formData,
      amount: Number(formData.amount),
      dayNumber: formData.dayNumber === 'All' ? 'All' : Number(formData.dayNumber),
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expense ? 'Edit Operational Expense' : 'Log Operations Expense'}
      description="Record internal catering expense voucher, vendor payment, kitchen fuel or transport costs."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Event & Day Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Event <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
              <select
                value={formData.eventId}
                onChange={handleEventChange}
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
                required
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.eventName} ({ev.clientName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Day <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Layers className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
              <select
                value={formData.dayNumber}
                onChange={(e) => setFormData({ ...formData, dayNumber: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
                required
              >
                <option value={1}>Day 1</option>
                <option value={2}>Day 2</option>
                <option value={3}>Day 3</option>
                <option value="All">All Days (General)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category & Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
                required
              >
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Amount (₹) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
              <input
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 45000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs font-medium border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
                required
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-[#334155] mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. 4,500 kg fresh dressed chicken for Day 1 dum biryani"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
            required
          />
        </div>

        {/* Vendor & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Vendor / Payee
            </label>
            <input
              type="text"
              list="vendors-list"
              placeholder="e.g. Malabar Broilers or Internal Crew"
              value={formData.vendor}
              onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
            />
            <datalist id="vendors-list">
              {vendors.map((v) => (
                <option key={v.id} value={v.vendorName} />
              ))}
              <option value="Internal Operations Crew Disbursal" />
              <option value="Direct Market Purchase" />
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
                required
              />
            </div>
          </div>
        </div>

        {/* Payment Method, Status, & Receipt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
                required
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Payment Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className={`w-full px-3 py-2 text-xs font-semibold border rounded-lg focus:outline-none focus:ring-2 ${
                formData.status === 'Paid'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 focus:ring-emerald-600'
                  : 'bg-amber-50 text-amber-800 border-amber-300 focus:ring-amber-600'
              }`}
              required
            >
              {EXPENSE_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Receipt / Voucher Ref
            </label>
            <div className="relative">
              <ReceiptText className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
              <input
                type="text"
                placeholder="e.g. RCP-MB-01"
                value={formData.receipt}
                onChange={(e) => setFormData({ ...formData, receipt: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#334155] mb-1">Notes & Details</label>
          <textarea
            rows={2}
            placeholder="Additional delivery receipt notes, approval sign-off, or bank transfer UTR number..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e2e8f0]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            {expense ? 'Save Changes' : 'Record Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
