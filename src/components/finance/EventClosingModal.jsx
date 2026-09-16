import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { CheckCircle2, Lock, Printer, FileText, IndianRupee, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function EventClosingModal({
  isOpen,
  onClose,
  threeDayFinancials,
  eventName = 'National Tech Fest 2026',
  onConfirmCloseEvent,
}) {
  const navigate = useNavigate()
  const [closingNotes, setClosingNotes] = useState('')

  if (!threeDayFinancials) return null

  const isClosed = threeDayFinancials.isEventClosed

  const handleCloseEvent = (e) => {
    e.preventDefault()
    onConfirmCloseEvent(closingNotes)
  }

  const handleOpenReport = () => {
    onClose()
    navigate('/reports')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isClosed ? 'Event Closed — Final Reconciliations' : 'FINAL EVENT CLOSING'}
      description="Perform master audit of all 3 event days, net event profitability, and generate final documents."
      size="lg"
    >
      <div className="space-y-4 pt-1 text-xs">
        {/* Banner */}
        <div className="p-3.5 rounded-xl bg-[#163324] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-[#c29c5e] shrink-0" />
            <div>
              <span className="text-sm font-black tracking-wide block">
                {eventName} — Final Event Closing
              </span>
              <span className="text-[11px] text-[#cbd5e1]">
                30,000 Guests • 3 Days Execution • Strictly One Central Counter
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#c29c5e] text-[#163324] uppercase">
            {isClosed ? 'EVENT CLOSED' : 'AUDIT READY'}
          </span>
        </div>

        {/* 3-Day Financial Performance Table */}
        <div className="border border-[#cbd5e1] rounded-xl overflow-hidden bg-white">
          <div className="p-2.5 bg-[#f8fafc] border-b border-[#cbd5e1] font-bold text-[#163324] uppercase text-[10px]">
            Day-by-Day Financial Ledger
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f1f5f9] text-[#64748b] text-[10px] uppercase font-semibold">
              <tr>
                <th className="p-2.5">Day</th>
                <th className="p-2.5 text-right">Sales / Income (₹)</th>
                <th className="p-2.5 text-right">Expenses (₹)</th>
                <th className="p-2.5 text-right">Net Income (₹)</th>
                <th className="p-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              <tr>
                <td className="p-2.5 font-bold text-[#0f172a]">Day 1</td>
                <td className="p-2.5 text-right font-semibold">₹{threeDayFinancials.day1.totalSales.toLocaleString('en-IN')}</td>
                <td className="p-2.5 text-right font-semibold text-red-700">₹{threeDayFinancials.day1.totalExpenses.toLocaleString('en-IN')}</td>
                <td className="p-2.5 text-right font-black text-emerald-800">₹{threeDayFinancials.day1.netIncome.toLocaleString('en-IN')}</td>
                <td className="p-2.5 text-center"><span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Verified</span></td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-[#0f172a]">Day 2</td>
                <td className="p-2.5 text-right font-semibold">₹{threeDayFinancials.day2.totalSales.toLocaleString('en-IN')}</td>
                <td className="p-2.5 text-right font-semibold text-red-700">₹{threeDayFinancials.day2.totalExpenses.toLocaleString('en-IN')}</td>
                <td className="p-2.5 text-right font-black text-emerald-800">₹{threeDayFinancials.day2.netIncome.toLocaleString('en-IN')}</td>
                <td className="p-2.5 text-center"><span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Verified</span></td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-[#0f172a]">Day 3</td>
                <td className="p-2.5 text-right font-semibold">₹{threeDayFinancials.day3.totalSales.toLocaleString('en-IN')}</td>
                <td className="p-2.5 text-right font-semibold text-red-700">₹{threeDayFinancials.day3.totalExpenses.toLocaleString('en-IN')}</td>
                <td className="p-2.5 text-right font-black text-emerald-800">₹{threeDayFinancials.day3.netIncome.toLocaleString('en-IN')}</td>
                <td className="p-2.5 text-center"><span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">Verified</span></td>
              </tr>
              <tr className="bg-[#f8fafc] font-black border-t-2 border-[#cbd5e1]">
                <td className="p-2.5 text-[#163324] uppercase">Total Event</td>
                <td className="p-2.5 text-right text-base text-[#0f172a]">₹{threeDayFinancials.totalSales.toLocaleString('en-IN')}</td>
                <td className="p-2.5 text-right text-base text-red-700">₹{threeDayFinancials.totalExpenses.toLocaleString('en-IN')}</td>
                <td className="p-2.5 text-right text-base text-emerald-800">₹{threeDayFinancials.finalNetIncome.toLocaleString('en-IN')}</td>
                <td className="p-2.5 text-center"><span className="text-[9px] px-2 py-0.5 rounded bg-[#163324] text-white font-bold">FINAL</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Manager Closing Notes */}
        <div>
          <label className="block text-xs font-semibold text-[#334155] mb-1">
            Executive Post-Event Debrief Notes
          </label>
          {isClosed ? (
            <div className="p-3 bg-[#f8fafc] border rounded-lg text-xs italic text-[#475569]">
              "{threeDayFinancials.finalNotes || 'Event concluded and closed successfully by Operations Director.'}"
            </div>
          ) : (
            <textarea
              rows={2}
              value={closingNotes}
              onChange={(e) => setClosingNotes(e.target.value)}
              placeholder="e.g. Catering service executed with 100% meal fulfillment and positive client sign-off. Net margin reconciled."
              className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#e2e8f0]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Printer className="w-4 h-4 text-[#163324]" />}
            onClick={handleOpenReport}
          >
            Generate Complete 3-Day A4 Report
          </Button>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Close Window
            </Button>
            {!isClosed && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                leftIcon={<Lock className="w-3.5 h-3.5" />}
                onClick={handleCloseEvent}
              >
                CLOSE EVENT
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

