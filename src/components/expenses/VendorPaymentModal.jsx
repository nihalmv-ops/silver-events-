import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { PAYMENT_METHODS } from '../../hooks/useExpenses'
import { IndianRupee, Calendar, CreditCard, ReceiptText, AlertCircle, CheckCircle2 } from 'lucide-react'

export function VendorPaymentModal({
  isOpen,
  onClose,
  vendor,
  onRecordPayment,
}) {
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer')
  const [receiptRef, setReceiptRef] = useState('')
  const [notes, setNotes] = useState('')
  const [autoLogExpense, setAutoLogExpense] = useState(true)

  const totalAmount = Number(vendor?.contractAmount) || 0
  const currentPaid = Number(vendor?.paid) || 0
  const balance = Math.max(0, totalAmount - currentPaid)

  useEffect(() => {
    if (vendor) {
      setPaymentAmount(balance > 0 ? balance : '')
      setPaymentDate(new Date().toISOString().split('T')[0])
      setPaymentMethod('Bank Transfer')
      setReceiptRef(`VOUCH-${Math.floor(1000 + Math.random() * 9000)}`)
      setNotes(`Payment for ${vendor.service || vendor.category}`)
      setAutoLogExpense(true)
    }
  }, [vendor, balance, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    const amount = Number(paymentAmount)
    if (!amount || amount <= 0) return

    onRecordPayment(vendor.id, {
      amount,
      date: paymentDate,
      paymentMethod,
      receipt: receiptRef,
      notes,
      autoLogExpense,
      vendorName: vendor.vendorName,
      category: vendor.category,
      eventId: vendor.eventId,
      eventName: vendor.eventName,
      dayNumber: vendor.dayNumber,
    })

    onClose()
  }

  if (!vendor) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Vendor Payment / Disbursal"
      description={`Disburse payment to ${vendor.vendorName} for internal operations.`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* Vendor Summary Card */}
        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1e293b]">{vendor.vendorName}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e2e8f0] text-[#475569] font-medium">
              {vendor.category}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#e2e8f0]/80 text-center">
            <div>
              <span className="text-[10px] text-[#64748b] block">Total Contract</span>
              <span className="text-xs font-bold text-[#0f172a]">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748b] block">Already Paid</span>
              <span className="text-xs font-bold text-emerald-700">
                ₹{currentPaid.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#64748b] block">Current Balance</span>
              <span className="text-xs font-bold text-amber-700">
                ₹{balance.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Amount */}
        <div>
          <label className="block text-xs font-semibold text-[#334155] mb-1">
            Payment Amount (₹) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <IndianRupee className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
            <input
              type="number"
              min="1"
              max={balance > 0 ? balance * 2 : 10000000}
              placeholder="e.g. 50000"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-semibold border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
              required
            />
          </div>
          {balance > 0 && Number(paymentAmount) !== balance && (
            <span className="text-[10px] text-blue-600 mt-1 inline-block cursor-pointer hover:underline" onClick={() => setPaymentAmount(balance)}>
              Click to pay full remaining balance (₹{balance.toLocaleString('en-IN')})
            </span>
          )}
        </div>

        {/* Date & Payment Method */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Payment Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
                required
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Receipt / Voucher Reference */}
        <div>
          <label className="block text-xs font-semibold text-[#334155] mb-1">
            Receipt / Voucher Ref
          </label>
          <div className="relative">
            <ReceiptText className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="e.g. VOUCH-4812"
              value={receiptRef}
              onChange={(e) => setReceiptRef(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#334155] mb-1">Notes</label>
          <input
            type="text"
            placeholder="e.g. NEFT transfer ref, cash voucher signed by supervisor"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
          />
        </div>

        {/* Auto Log as Expense Checkbox */}
        <div className="flex items-center gap-2 p-2.5 bg-[#f1f5f9] rounded-lg">
          <input
            type="checkbox"
            id="autoLogExpense"
            checked={autoLogExpense}
            onChange={(e) => setAutoLogExpense(e.target.checked)}
            className="w-4 h-4 text-[#163324] rounded focus:ring-[#163324]"
          />
          <label htmlFor="autoLogExpense" className="text-xs text-[#334155] cursor-pointer">
            Automatically log this payment into the <strong>Operations Expenses ledger</strong>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e2e8f0]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Confirm Payment
          </Button>
        </div>
      </form>
    </Modal>
  )
}
