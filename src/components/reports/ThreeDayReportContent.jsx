import React from 'react'
import { IndianRupee, Users, Utensils, Package, Truck, Droplets, Clock, FileCheck } from 'lucide-react'

export function ThreeDayReportContent({ event, summary, dayStats = [] }) {
  // Default values based on authentic 3-day 30,000 people event
  const defaultDayData = [
    {
      day: 1,
      date: '2026-03-20',
      expectedGuests: 10000,
      foodPrepared: 10200,
      foodPacked: 10100,
      foodDelivered: 10000,
      foodRemaining: 100,
      waterDelivered: 10000,
      waterRemaining: 500,
      expenses: 670500,
      pending: '1 item (CleanPro waste sanitation sign-off)',
      status: 'Completed',
    },
    {
      day: 2,
      date: '2026-03-21',
      expectedGuests: 10000,
      foodPrepared: 10150,
      foodPacked: 10050,
      foodDelivered: 10000,
      foodRemaining: 50,
      waterDelivered: 10000,
      waterRemaining: 450,
      expenses: 657000,
      pending: '1 item (Apex Sound queue PA clearance)',
      status: 'Completed',
    },
    {
      day: 3,
      date: '2026-03-22',
      expectedGuests: 10000,
      foodPrepared: 10000,
      foodPacked: 10000,
      foodDelivered: 10000,
      foodRemaining: 0,
      waterDelivered: 10000,
      waterRemaining: 350,
      expenses: 653500,
      pending: '2 items (Night breakdown transport & final supplier settlement)',
      status: 'Completed',
    },
  ]

  const days = dayStats.length === 3 ? dayStats : defaultDayData

  // Totals calculations
  const totalGuests = days.reduce((sum, d) => sum + d.expectedGuests, 0)
  const totalPrepared = days.reduce((sum, d) => sum + d.foodPrepared, 0)
  const totalPacked = days.reduce((sum, d) => sum + d.foodPacked, 0)
  const totalDelivered = days.reduce((sum, d) => sum + d.foodDelivered, 0)
  const totalRemaining = days.reduce((sum, d) => sum + d.foodRemaining, 0)
  const totalWater = days.reduce((sum, d) => sum + d.waterDelivered, 0)
  const totalExpenses = days.reduce((sum, d) => sum + d.expenses, 0)
  const totalVendorPayments = summary?.paidExpense || 1373500
  const pendingExpenses = summary?.pendingExpense || 607500
  const pendingTasks = 4
  const managerNotes =
    'All operations executed smoothly across all 3 days through ONE centralized distribution counter without crowd bottlenecks. Meal temperature was sustained above 65°C via insulated hot containers. Water supply at hydration point was fully adequate. 100% hygiene clearance achieved.'

  return (
    <div className="space-y-6 text-xs text-[#0f172a]">
      {/* 3-Day Breakdown Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-[#163324] border-b border-[#cbd5e1] pb-1">
          Daily Operational Breakdown (Day 1 — Day 3)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {days.map((d) => (
            <div
              key={d.day}
              className="p-3.5 rounded-lg border border-[#cbd5e1] bg-white shadow-2xs space-y-2.5 avoid-page-break"
            >
              {/* Day Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
                <div>
                  <span className="text-sm font-black text-[#163324] uppercase">
                    DAY {d.day}
                  </span>
                  <span className="text-[10px] text-[#64748b] block">{d.date}</span>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                  {d.status}
                </span>
              </div>

              {/* Day Key Metrics Grid */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-[#64748b]">Expected Guests:</span>
                  <strong className="font-bold">{d.expectedGuests.toLocaleString('en-IN')}</strong>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-[#64748b]">Food Prepared:</span>
                  <strong className="text-[#163324]">{d.foodPrepared.toLocaleString('en-IN')}</strong>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-[#64748b]">Food Packed:</span>
                  <span>{d.foodPacked.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-[#64748b]">Food Delivered:</span>
                  <strong className="text-emerald-700">{d.foodDelivered.toLocaleString('en-IN')}</strong>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-[#64748b]">Food Remaining:</span>
                  <span className="text-amber-700 font-semibold">{d.foodRemaining.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-1.5 border-t border-[#f1f5f9] flex justify-between items-center py-0.5">
                  <span className="text-[#64748b]">Water Delivered:</span>
                  <strong className="text-blue-700">{d.waterDelivered.toLocaleString('en-IN')} btls</strong>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-[#64748b]">Water Remaining:</span>
                  <span>{d.waterRemaining.toLocaleString('en-IN')} btls</span>
                </div>

                <div className="pt-1.5 border-t border-[#f1f5f9] flex justify-between items-center py-0.5">
                  <span className="text-[#64748b]">Expenses:</span>
                  <strong className="font-bold">₹{d.expenses.toLocaleString('en-IN')}</strong>
                </div>

                <div className="py-0.5 text-[10px] text-[#475569] bg-[#f8fafc] p-1.5 rounded border border-[#e2e8f0]">
                  <span className="font-bold text-[#64748b] block text-[9px] uppercase">Pending Actions:</span>
                  {d.pending}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================== */}
      {/* FINAL SUMMARY                                      */}
      {/* ================================================== */}
      <div className="border border-[#163324] rounded-lg p-4 bg-[#f8fafc] space-y-4 avoid-page-break">
        <div className="flex items-center justify-between border-b border-[#cbd5e1] pb-2">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#163324]">
            FINAL SUMMARY (30,000 GUESTS CATERING OPERATIONS)
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#163324] text-[#dfbe82] uppercase">
            3-Day Consolidated Yield
          </span>
        </div>

        {/* Operational Flow Metrics Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-2.5 rounded bg-white border border-[#e2e8f0]">
            <span className="text-[10px] uppercase font-bold text-[#64748b] block">Total Guests</span>
            <span className="text-base font-black text-[#0f172a]">
              {totalGuests.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-2.5 rounded bg-white border border-[#e2e8f0]">
            <span className="text-[10px] uppercase font-bold text-[#64748b] block">Total Food Prepared</span>
            <span className="text-base font-black text-[#163324]">
              {totalPrepared.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-2.5 rounded bg-white border border-[#e2e8f0]">
            <span className="text-[10px] uppercase font-bold text-[#64748b] block">Total Food Packed</span>
            <span className="text-base font-black text-[#0f172a]">
              {totalPacked.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-2.5 rounded bg-white border border-emerald-200 bg-emerald-50/20">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Total Food Delivered</span>
            <span className="text-base font-black text-emerald-800">
              {totalDelivered.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-2.5 rounded bg-white border border-[#e2e8f0]">
            <span className="text-[10px] uppercase font-bold text-[#64748b] block">Total Food Remaining</span>
            <span className="text-base font-black text-amber-700">
              {totalRemaining.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-2.5 rounded bg-white border border-blue-200 bg-blue-50/20">
            <span className="text-[10px] uppercase font-bold text-blue-800 block">Total Water Distributed</span>
            <span className="text-base font-black text-blue-800">
              {totalWater.toLocaleString('en-IN')} bottles
            </span>
          </div>

          <div className="p-2.5 rounded bg-white border border-[#e2e8f0]">
            <span className="text-[10px] uppercase font-bold text-[#64748b] block">Total Expenses</span>
            <span className="text-base font-black text-[#0f172a]">
              ₹{totalExpenses.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-2.5 rounded bg-white border border-emerald-200 bg-emerald-50/20">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Total Vendor Payments</span>
            <span className="text-base font-black text-emerald-800">
              ₹{totalVendorPayments.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Secondary Consolidated Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-2.5 rounded bg-amber-50 border border-amber-200 flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-900">Pending Operational Expenses:</span>
            <span className="text-sm font-black text-amber-900">
              ₹{pendingExpenses.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-2.5 rounded bg-blue-50 border border-blue-200 flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-900">Pending Post-Event Tasks:</span>
            <span className="text-sm font-black text-blue-900">
              {pendingTasks} Final Checklists
            </span>
          </div>
        </div>

        {/* Manager Notes */}
        <div className="p-3 bg-white rounded border border-[#cbd5e1] space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#64748b] block">
            Manager Operational Notes:
          </span>
          <p className="text-xs text-[#1e293b] leading-relaxed italic">
            "{managerNotes}"
          </p>
        </div>
      </div>
    </div>
  )
}

