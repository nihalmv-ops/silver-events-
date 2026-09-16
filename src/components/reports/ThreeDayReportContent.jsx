
import React from 'react'
import { IndianRupee, Users, Utensils, Package, Truck, Droplets, Clock, FileCheck, Sparkles } from 'lucide-react'
import { formatCurrency, formatNumber } from '../../utils/formatters'

export function ThreeDayReportContent({ event, summary, dayStats = [] }) {
  // Default values based on authentic 3-day 30,000 people event
  const defaultDayData = [
    {
      day: 1,
      date: '2026-03-20',
      expectedGuests: 10000,
      foodPrepared: 5000,
      foodPacked: 5000,
      foodDelivered: 4700,
      foodRemaining: 300,
      popcornSold: 1800,
      waterDelivered: 4500,
      waterRemaining: 500,
      sales: 826500,
      expenses: 415000,
      netIncome: 411500,
      pending: '1 item (CleanPro waste sanitation sign-off)',
      status: 'Completed',
    },
    {
      day: 2,
      date: '2026-03-21',
      expectedGuests: 10000,
      foodPrepared: 5200,
      foodPacked: 5200,
      foodDelivered: 5000,
      foodRemaining: 200,
      popcornSold: 2000,
      waterDelivered: 4800,
      waterRemaining: 400,
      sales: 882000,
      expenses: 425000,
      netIncome: 457000,
      pending: '1 item (Apex Sound queue PA clearance)',
      status: 'Completed',
    },
    {
      day: 3,
      date: '2026-03-22',
      expectedGuests: 10000,
      foodPrepared: 5000,
      foodPacked: 5000,
      foodDelivered: 4800,
      foodRemaining: 200,
      popcornSold: 1900,
      waterDelivered: 4700,
      waterRemaining: 300,
      sales: 847500,
      expenses: 395000,
      netIncome: 452500,
      pending: '2 items (Night breakdown transport & final supplier settlement)',
      status: 'Completed',
    },
  ]

  const days = dayStats.length === 3 ? dayStats : defaultDayData

  // Totals calculations
  const totalGuests = days.reduce((sum, d) => sum + d.expectedGuests, 0)
  const totalPrepared = days.reduce((sum, d) => sum + d.foodPrepared, 0)
  const totalDelivered = days.reduce((sum, d) => sum + d.foodDelivered, 0)
  const totalRemaining = days.reduce((sum, d) => sum + d.foodRemaining, 0)
  const totalPopcorn = days.reduce((sum, d) => sum + (d.popcornSold || 0), 0)
  const totalWater = days.reduce((sum, d) => sum + d.waterDelivered, 0)
  const totalSales = days.reduce((sum, d) => sum + (d.sales || 0), 0)
  const totalExpenses = days.reduce((sum, d) => sum + d.expenses, 0)
  const finalNetIncome = totalSales - totalExpenses

  const managerNotes =
    'All operations executed smoothly across all 3 days through Strictly ONE centralized distribution counter without crowd bottlenecks. Meal temperature was sustained above 74°C via insulated hot containers. Water supply and popcorn counter were fully synchronized. 100% hygiene clearance achieved.'

  return (
    <div className="space-y-6 text-xs text-[#0f172a]">
      {/* 3-Day Breakdown Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-[#163324] border-b border-[#cbd5e1] pb-1">
          Daily Operational & Financial Breakdown (Day 1 — Day 3)
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
                    DAY {d.day} OPERATIONS
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
                  <strong className="font-bold">{d.expectedGuests.toLocaleString('en-IN')} Pax</strong>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-[#64748b]">Chicken Biryani (₹150):</span>
                  <strong className="text-[#163324]">{d.foodDelivered.toLocaleString('en-IN')} Sold</strong>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-[#64748b]">Biryani Remaining Buffer:</span>
                  <span className="text-amber-700 font-semibold">{d.foodRemaining.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-[#64748b]">Popcorn Cones (₹30):</span>
                  <strong className="text-amber-800">{(d.popcornSold || 1800).toLocaleString('en-IN')} Sold</strong>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-[#64748b]">Water Bottles (₹15):</span>
                  <strong className="text-blue-700">{d.waterDelivered.toLocaleString('en-IN')} Sold</strong>
                </div>

                <div className="pt-1.5 border-t border-[#f1f5f9] flex justify-between items-center py-0.5">
                  <span className="text-[#64748b] font-bold">Total Day Sales:</span>
                  <strong className="text-base text-[#163324] font-black">{formatCurrency(d.sales || 826500)}</strong>
                </div>

                <div className="flex justify-between items-center py-0.5">
                  <span className="text-[#64748b]">Day Expenses:</span>
                  <strong className="text-red-600 font-bold">{formatCurrency(d.expenses)}</strong>
                </div>

                <div className="pt-1 border-t border-[#f1f5f9] flex justify-between items-center py-0.5">
                  <span className="font-bold text-[#0f172a]">Day Net Income:</span>
                  <strong className="text-emerald-700 font-black">{formatCurrency(d.netIncome || (d.sales - d.expenses))}</strong>
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
            Strictly ONE Counter Protocol
          </span>
        </div>

        {/* Operational Flow Metrics Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-2.5 bg-white rounded border border-[#cbd5e1]">
            <span className="text-[10px] uppercase font-bold text-[#64748b] block">Total Guests</span>
            <span className="text-lg font-black text-[#0f172a]">{totalGuests.toLocaleString('en-IN')}</span>
          </div>

          <div className="p-2.5 bg-white rounded border border-[#cbd5e1]">
            <span className="text-[10px] uppercase font-bold text-[#64748b] block">Biryani Sold</span>
            <span className="text-lg font-black text-[#163324]">{totalDelivered.toLocaleString('en-IN')}</span>
          </div>

          <div className="p-2.5 bg-white rounded border border-[#cbd5e1]">
            <span className="text-[10px] uppercase font-bold text-[#64748b] block">Popcorn Sold</span>
            <span className="text-lg font-black text-amber-800">{totalPopcorn.toLocaleString('en-IN')}</span>
          </div>

          <div className="p-2.5 bg-white rounded border border-[#cbd5e1]">
            <span className="text-[10px] uppercase font-bold text-[#64748b] block">Water Bottles Sold</span>
            <span className="text-lg font-black text-blue-700">{totalWater.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* 3-Day Financial Totals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">3-Day Gross Revenue</span>
            <span className="text-xl font-black text-[#163324]">{formatCurrency(totalSales)}</span>
          </div>

          <div className="p-3 bg-red-50 rounded border border-red-200">
            <span className="text-[10px] uppercase font-bold text-red-800 block">3-Day Total Expenses</span>
            <span className="text-xl font-black text-red-600">{formatCurrency(totalExpenses)}</span>
          </div>

          <div className="p-3 bg-emerald-100 rounded border border-emerald-300">
            <span className="text-[10px] uppercase font-bold text-emerald-900 block">3-Day Net Operating Yield</span>
            <span className="text-xl font-black text-emerald-800">{formatCurrency(finalNetIncome)}</span>
          </div>
        </div>

        {/* Manager Executive Verdict */}
        <div className="pt-2 border-t border-[#cbd5e1]">
          <span className="text-[10px] uppercase font-bold text-[#64748b] block mb-1">
            General Manager Operations Audit Statement
          </span>
          <p className="text-xs text-[#334155] leading-relaxed italic">
            "{managerNotes}"
          </p>
        </div>
      </div>
    </div>
  )
}
export default ThreeDayReportContent
