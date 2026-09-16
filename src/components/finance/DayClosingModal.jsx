import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Lock, Unlock, AlertTriangle, CheckCircle2, IndianRupee, Utensils, Droplets, CheckSquare } from 'lucide-react'

export function DayClosingModal({
  isOpen,
  onClose,
  dayNumber = 1,
  financials,
  foodSummary = { prepared: 10200, packed: 10100, delivered: 10000, remaining: 100 },
  waterSummary = { available: 10500, delivered: 10000, remaining: 500 },
  pendingTasksCount = 1,
  onConfirmClose,
  onReopenDay,
}) {
  const [managerNotes, setManagerNotes] = useState('')

  if (!financials) return null

  const isClosed = financials.isClosed

  const handleCloseDay = (e) => {
    e.preventDefault()
    onConfirmClose(dayNumber, managerNotes)
    onClose()
  }

  const handleReopen = () => {
    if (window.confirm(`Authorize reopening of Day ${dayNumber} records for editing?`)) {
      onReopenDay(dayNumber)
      onClose()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isClosed ? `Day ${dayNumber} Reconciliation & Closing Record` : `CLOSE DAY ${dayNumber}?`}
      description={
        isClosed
          ? `Day ${dayNumber} operations and financials are locked.`
          : `Review and finalize Day ${dayNumber} operational metrics, revenue, and expenses.`
      }
      size="lg"
    >
      <div className="space-y-4 pt-1 text-xs">
        {/* Status Alert Banner */}
        <div className={`p-3 rounded-xl border flex items-center justify-between ${
          isClosed
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
            : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}>
          <div className="flex items-center gap-2.5">
            {isClosed ? (
              <Lock className="w-5 h-5 text-emerald-700 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            )}
            <div>
              <span className="font-bold block">
                {isClosed ? `Day ${dayNumber} is Officially Closed & Locked` : `Ready to Close Day ${dayNumber}`}
              </span>
              <span className="text-[11px] opacity-90">
                {isClosed
                  ? 'Historical transactions are safeguarded from accidental price or quantity mutations.'
                  : 'Closing locks historical records and records the supervisor debrief signature.'}
              </span>
            </div>
          </div>
          {isClosed && (
            <Button variant="outline" size="sm" onClick={handleReopen} leftIcon={<Unlock className="w-3.5 h-3.5" />}>
              Reopen Day
            </Button>
          )}
        </div>

        {/* 1. Food Summary */}
        <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-[#163324] uppercase text-[10px] tracking-wider">
            <Utensils className="w-3.5 h-3.5 text-[#c29c5e]" />
            Food Operations Summary
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 bg-white rounded border">
              <span className="text-[10px] text-[#64748b] block">Prepared</span>
              <strong className="text-[#0f172a]">{foodSummary.prepared.toLocaleString('en-IN')}</strong>
            </div>
            <div className="p-2 bg-white rounded border">
              <span className="text-[10px] text-[#64748b] block">Packed</span>
              <strong>{foodSummary.packed.toLocaleString('en-IN')}</strong>
            </div>
            <div className="p-2 bg-white rounded border">
              <span className="text-[10px] text-emerald-700 font-bold block">Delivered</span>
              <strong className="text-emerald-700">{foodSummary.delivered.toLocaleString('en-IN')}</strong>
            </div>
            <div className="p-2 bg-white rounded border">
              <span className="text-[10px] text-amber-700 font-bold block">Remaining</span>
              <strong className="text-amber-700">{foodSummary.remaining.toLocaleString('en-IN')}</strong>
            </div>
          </div>
        </div>

        {/* 2. Water Summary */}
        <div className="p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-[#163324] uppercase text-[10px] tracking-wider">
            <Droplets className="w-3.5 h-3.5 text-blue-600" />
            Water Supply Summary
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-white rounded border">
              <span className="text-[10px] text-[#64748b] block">Water Available</span>
              <strong>{waterSummary.available.toLocaleString('en-IN')} btls</strong>
            </div>
            <div className="p-2 bg-white rounded border">
              <span className="text-[10px] text-blue-700 font-bold block">Delivered</span>
              <strong className="text-blue-700">{waterSummary.delivered.toLocaleString('en-IN')} btls</strong>
            </div>
            <div className="p-2 bg-white rounded border">
              <span className="text-[10px] text-[#64748b] block">Remaining</span>
              <strong>{waterSummary.remaining.toLocaleString('en-IN')} btls</strong>
            </div>
          </div>
        </div>

        {/* 3. Financial Summary (Sales, Expenses, Net Income) */}
        <div className="p-3.5 bg-gradient-to-br from-[#163324]/5 to-transparent border border-[#163324]/20 rounded-xl space-y-2">
          <div className="flex items-center justify-between font-bold text-[#163324] uppercase text-[10px] tracking-wider">
            <span className="flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-[#c29c5e]" />
              Day {dayNumber} Financial Summary
            </span>
            <span>Quantity × Price Reconciliation</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 bg-white rounded-lg border border-[#cbd5e1]">
              <span className="text-[10px] uppercase font-bold text-[#64748b] block">Total Sales / Income</span>
              <span className="text-base font-black text-[#0f172a]">
                ₹{financials.totalSales.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-[#cbd5e1]">
              <span className="text-[10px] uppercase font-bold text-[#64748b] block">Total Expenses</span>
              <span className="text-base font-black text-red-700">
                ₹{financials.totalExpenses.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-300">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Net Income</span>
              <span className="text-base font-black text-emerald-800">
                ₹{financials.netIncome.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Pending Tasks & Notes */}
        <div className="flex items-center justify-between p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
          <span className="flex items-center gap-1.5 font-bold">
            <CheckSquare className="w-4 h-4 text-blue-700" />
            Pending Operational Tasks for Day {dayNumber}:
          </span>
          <span className="font-bold">{pendingTasksCount} Action Items</span>
        </div>

        {/* Notes input (or read-only if closed) */}
        <div>
          <label className="block text-xs font-semibold text-[#334155] mb-1">
            Manager Debrief & Closing Remarks
          </label>
          {isClosed ? (
            <div className="p-3 bg-[#f8fafc] border rounded-lg text-xs italic text-[#475569]">
              "{financials.notes || 'Day closed by operations administrator.'}"
            </div>
          ) : (
            <textarea
              rows={2}
              value={managerNotes}
              onChange={(e) => setManagerNotes(e.target.value)}
              placeholder="e.g. Day 1 operations concluded with 100% single-counter throughput satisfaction and food safety clearance."
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e2e8f0]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Close Window
          </Button>
          {!isClosed && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              leftIcon={<Lock className="w-3.5 h-3.5" />}
              onClick={handleCloseDay}
            >
              Confirm & Close Day {dayNumber}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
