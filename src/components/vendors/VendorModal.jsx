import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { VENDOR_CATEGORIES, VENDOR_STATUSES } from '../../hooks/useVendors'
import { formatCurrency } from '../../utils/formatters'

export function VendorModal({
  isOpen,
  onClose,
  onSave,
  vendorToEdit,
  events = [],
  currentEventId,
  currentDayNumber,
}) {
  const [vendorName, setVendorName] = useState('')
  const [category, setCategory] = useState(VENDOR_CATEGORIES[0])
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [service, setService] = useState('')
  const [eventId, setEventId] = useState(currentEventId || '')
  const [dayNumber, setDayNumber] = useState(currentDayNumber || 1)
  const [contractAmount, setContractAmount] = useState(50000)
  const [advance, setAdvance] = useState(20000)
  const [paid, setPaid] = useState(20000)
  const [status, setStatus] = useState('Confirmed')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (vendorToEdit) {
      setVendorName(vendorToEdit.vendorName || '')
      setCategory(vendorToEdit.category || VENDOR_CATEGORIES[0])
      setPhone(vendorToEdit.phone || '')
      setEmail(vendorToEdit.email || '')
      setService(vendorToEdit.service || '')
      setEventId(vendorToEdit.eventId || currentEventId || '')
      setDayNumber(vendorToEdit.dayNumber || currentDayNumber || 1)
      setContractAmount(vendorToEdit.contractAmount || 0)
      setAdvance(vendorToEdit.advance || 0)
      setPaid(vendorToEdit.paid !== undefined ? vendorToEdit.paid : 0)
      setStatus(vendorToEdit.status || 'Confirmed')
      setNotes(vendorToEdit.notes || '')
    } else {
      setVendorName('')
      setCategory(VENDOR_CATEGORIES[0])
      setPhone('+91 ')
      setEmail('')
      setService('')
      setEventId(currentEventId || (events[0]?.id ?? ''))
      setDayNumber(currentDayNumber || 1)
      setContractAmount(50000)
      setAdvance(20000)
      setPaid(20000)
      setStatus('Confirmed')
      setNotes('')
    }
  }, [vendorToEdit, currentEventId, currentDayNumber, events, isOpen])

  const balance = Math.max(0, (Number(contractAmount) || 0) - (Number(paid) || 0))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      vendorName: vendorName.trim(),
      category,
      phone: phone.trim(),
      email: email.trim(),
      service: service.trim(),
      eventId,
      dayNumber: Number(dayNumber) || 1,
      contractAmount: Number(contractAmount) || 0,
      advance: Number(advance) || 0,
      paid: Number(paid) || 0,
      status: balance === 0 ? 'Settled' : status,
      notes: notes.trim(),
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vendorToEdit ? `Edit Vendor — ${vendorToEdit.vendorName}` : 'Add Supplier / Vendor Contract'}
      description="Record external supplier service commitments, advances, and auto-calculated balances."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Vendor / Supplier Name"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            placeholder="e.g. Malabar Broilers & Farm Fresh Poultry"
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0f172a] block">
              Vendor Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              {VENDOR_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 94470 12890"
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="orders@supplier.com"
          />
        </div>

        <Input
          label="Specific Service / Delivery Scope"
          value={service}
          onChange={(e) => setService(e.target.value)}
          placeholder="e.g. 250ml sealed mineral water bottles (10,000 bottles daily)"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0f172a] block">
              Linked Event
            </label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0f172a] block">
              Day Number
            </label>
            <select
              value={dayNumber}
              onChange={(e) => setDayNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              <option value={1}>Day 1</option>
              <option value={2}>Day 2</option>
              <option value={3}>Day 3</option>
            </select>
          </div>
        </div>

        {/* FINANCIALS (INTERNAL COST LOGISTICS ONLY) */}
        <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Contract Amount (₹)"
              type="number"
              min="0"
              value={contractAmount}
              onChange={(e) => setContractAmount(e.target.value)}
              required
            />

            <Input
              label="Advance Paid (₹)"
              type="number"
              min="0"
              value={advance}
              onChange={(e) => setAdvance(e.target.value)}
              required
            />

            <Input
              label="Total Paid To Date (₹)"
              type="number"
              min="0"
              value={paid}
              onChange={(e) => setPaid(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#e2e8f0] text-xs">
            <span className="font-semibold text-[#64748b]">
              Automatically Calculated Outstanding Balance:
            </span>
            <span className="text-base font-black text-[#dc2626] font-sans">
              {formatCurrency(balance)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0f172a] block">
              Contract Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              {VENDOR_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Notes / Delivery Audit"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Morning 04:00 AM delivery verified at kitchen"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e8f0]">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {vendorToEdit ? 'Save Vendor Changes' : 'Register Vendor'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

