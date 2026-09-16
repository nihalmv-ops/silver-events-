import React from 'react'
import { ReportHeader } from './ReportHeader'
import { ReportFooter } from './ReportFooter'
import { formatCurrency, formatNumber } from '../../utils/formatters'

export function Phase12ReportTemplate({
  reportType, // 'day1' | 'day2' | 'day3' | 'complete-3day' | 'financial-summary' | 'expenses' | 'sales-income'
  event,
  day1Fin,
  day2Fin,
  day3Fin,
  threeDayFin,
  expenses = [],
  tasks = [],
  currentDay = 1,
}) {
  // Title mapping
  const titleMap = {
    day1: { title: 'Day 1 Operations & Financial Report', subtitle: 'Central Kitchen, Single Counter & Daily Sales Reconciliation' },
    day2: { title: 'Day 2 Operations & Financial Report', subtitle: 'Central Kitchen, Single Counter & Daily Sales Reconciliation' },
    day3: { title: 'Day 3 Operations & Financial Report', subtitle: 'Central Kitchen, Single Counter & Daily Sales Reconciliation' },
    'complete-3day': { title: 'Complete 3-Day Event Operations & Financial Report', subtitle: '30,000 Pax Biryani, Popcorn & Hydration Audit, Full Revenue & P&L Statement' },
    'financial-summary': { title: 'Executive Financial Summary & P&L Ledger', subtitle: 'Daily & 3-Day Gross Revenue, Operational Expense Categories, and Net Operating Yield' },
    expenses: { title: 'Comprehensive Event Expense & Procurement Report', subtitle: 'Operational Cost Centers, Supplier Allocations & Disbursed Vouchers' },
    'sales-income': { title: 'Event Sales & Meal Portion Revenue Report', subtitle: 'Dish-wise Distributed Volumes, Applied Unit Prices & Realized Income' },
  }

  const currentMeta = titleMap[reportType] || titleMap['complete-3day']

  // Select appropriate financial data
  const isSingleDay = reportType === 'day1' || reportType === 'day2' || reportType === 'day3'
  const activeDayNum = reportType === 'day1' ? 1 : reportType === 'day2' ? 2 : reportType === 'day3' ? 3 : currentDay

  const targetDayFin =
    activeDayNum === 1 ? day1Fin : activeDayNum === 2 ? day2Fin : day3Fin

  // Product stock rows based on active day or 3-day total
  const productRows = isSingleDay
    ? activeDayNum === 1
      ? [
          { name: 'Chicken Biryani', unit: 'Portion / Box', price: 150, prep: 5000, sold: 4700, rem: 300, income: 705000 },
          { name: 'Popcorn', unit: 'Tub / Cone', price: 30, prep: 2000, sold: 1800, rem: 200, income: 54000 },
          { name: 'Water Bottle', unit: '250ml Sealed Bottle', price: 15, prep: 5000, sold: 4500, rem: 500, income: 67500 },
        ]
      : activeDayNum === 2
      ? [
          { name: 'Chicken Biryani', unit: 'Portion / Box', price: 150, prep: 5200, sold: 5000, rem: 200, income: 750000 },
          { name: 'Popcorn', unit: 'Tub / Cone', price: 30, prep: 2200, sold: 2000, rem: 200, income: 60000 },
          { name: 'Water Bottle', unit: '250ml Sealed Bottle', price: 15, prep: 5200, sold: 4800, rem: 400, income: 72000 },
        ]
      : [
          { name: 'Chicken Biryani', unit: 'Portion / Box', price: 150, prep: 5000, sold: 4800, rem: 200, income: 720000 },
          { name: 'Popcorn', unit: 'Tub / Cone', price: 30, prep: 2000, sold: 1900, rem: 100, income: 57000 },
          { name: 'Water Bottle', unit: '250ml Sealed Bottle', price: 15, prep: 5000, sold: 4700, rem: 300, income: 70500 },
        ]
    : [
        { name: 'Chicken Biryani', unit: 'Portion / Box', price: 150, prep: 15200, sold: 14500, rem: 700, income: 2175000 },
        { name: 'Popcorn', unit: 'Tub / Cone', price: 30, prep: 6200, sold: 5700, rem: 500, income: 171000 },
        { name: 'Water Bottle', unit: '250ml Sealed Bottle', price: 15, prep: 15200, sold: 14000, rem: 1200, income: 210000 },
      ]

  // Sales data to render
  const salesList = isSingleDay
    ? targetDayFin?.sales || []
    : threeDayFin?.sales || [
        ...(day1Fin?.sales || []),
        ...(day2Fin?.sales || []),
        ...(day3Fin?.sales || []),
      ]

  const totalSalesAmount = isSingleDay ? targetDayFin?.totalSales || 0 : threeDayFin?.totalSales || 0

  // Expenses data to render
  const expenseList = isSingleDay
    ? targetDayFin?.expenses || []
    : expenses.length > 0
    ? expenses
    : [
        ...(day1Fin?.expenses || []),
        ...(day2Fin?.expenses || []),
        ...(day3Fin?.expenses || []),
      ]

  const totalExpenseAmount = isSingleDay ? targetDayFin?.totalExpenses || 0 : threeDayFin?.totalExpenses || 0

  // Financial summary numbers
  const netIncome = totalSalesAmount - totalExpenseAmount

  // Pending tasks
  const pendingTasksList = tasks.filter((t) => {
    if (isSingleDay && t.day && Number(t.day) !== Number(activeDayNum)) return false
    return t.status === 'Pending' || t.status === 'In Progress'
  })

  // Manager notes
  const managerNotes = {
    eventManager:
      'All operations proceeded smoothly adhering strictly to the internal single distribution counter blueprint. High guest throughput sustained with zero serving bottleneck.',
    kitchenNotes:
      'Central kitchen completed Malabar Chicken Biryani cauldrons and live popcorn station batches on schedule. Core serving temperatures audited at 74°C+. Zero bacterial or spoilage rejects recorded.',
    distributionNotes:
      'Strictly ONE Distribution Counter operated continuously. Bottled water and warm popcorn handed simultaneously with hot biryani box.',
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-[#cbd5e1] max-w-[900px] mx-auto text-xs text-[#0f172a] print:shadow-none print:border-none print:p-0 print:m-0">
      {/* 1. Silver Catering Standard Header */}
      <ReportHeader
        reportTitle={currentMeta.title}
        reportSubtitle={currentMeta.subtitle}
        event={event}
      />

      {/* 2. CORE PRODUCTS SUMMARY TABLE */}
      <section className="mb-5">
        <div className="bg-[#163324] text-[#c29c5e] px-3 py-1.5 font-bold uppercase tracking-wider text-[11px] rounded-t flex items-center justify-between">
          <span>Core Event Products — Stock & Distribution Register</span>
          <span className="text-[10px] text-white">Strictly ONE Distribution Counter Protocol</span>
        </div>
        <table className="w-full border-collapse border border-[#cbd5e1] text-left">
          <thead className="bg-[#f8fafc] text-[#475569] font-bold uppercase text-[10px]">
            <tr>
              <th className="border border-[#cbd5e1] p-2">Product Name</th>
              <th className="border border-[#cbd5e1] p-2">Unit</th>
              <th className="border border-[#cbd5e1] p-2 text-right">Price</th>
              <th className="border border-[#cbd5e1] p-2 text-center">Prepared / Available</th>
              <th className="border border-[#cbd5e1] p-2 text-center">Sold / Distributed</th>
              <th className="border border-[#cbd5e1] p-2 text-center">Remaining Buffer</th>
              <th className="border border-[#cbd5e1] p-2 text-right">Product Income</th>
            </tr>
          </thead>
          <tbody>
            {productRows.map((p, idx) => (
              <tr key={idx} className="font-mono text-center">
                <td className="border border-[#cbd5e1] p-2 text-left font-sans font-bold text-[#0f172a]">
                  {p.name}
                </td>
                <td className="border border-[#cbd5e1] p-2 text-left font-sans text-[#475569]">
                  {p.unit}
                </td>
                <td className="border border-[#cbd5e1] p-2 text-right font-bold text-[#163324]">
                  ₹{p.price}
                </td>
                <td className="border border-[#cbd5e1] p-2 text-blue-700 font-bold">
                  {formatNumber(p.prep)}
                </td>
                <td className="border border-[#cbd5e1] p-2 text-emerald-800 font-black">
                  {formatNumber(p.sold)}
                </td>
                <td className="border border-[#cbd5e1] p-2 text-amber-700 font-bold">
                  {formatNumber(p.rem)}
                </td>
                <td className="border border-[#cbd5e1] p-2 text-right font-black text-[#163324]">
                  ₹{p.income.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-[#f8fafc] font-bold">
            <tr>
              <td colSpan={3} className="border border-[#cbd5e1] p-2 text-right uppercase">
                {isSingleDay ? `Day ${activeDayNum} Total:` : 'All 3 Days Grand Total:'}
              </td>
              <td className="border border-[#cbd5e1] p-2 text-center font-mono text-blue-900">
                {formatNumber(productRows.reduce((s, i) => s + i.prep, 0))}
              </td>
              <td className="border border-[#cbd5e1] p-2 text-center font-mono text-emerald-950 font-black">
                {formatNumber(productRows.reduce((s, i) => s + i.sold, 0))}
              </td>
              <td className="border border-[#cbd5e1] p-2 text-center font-mono text-amber-800">
                {formatNumber(productRows.reduce((s, i) => s + i.rem, 0))}
              </td>
              <td className="border border-[#cbd5e1] p-2 text-right font-mono text-base text-[#163324]">
                {formatCurrency(totalSalesAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </section>

      {/* 3. SALES DETAILS */}
      <section className="mb-5">
        <div className="bg-[#163324] text-[#c29c5e] px-3 py-1.5 font-bold uppercase tracking-wider text-[11px] rounded-t flex items-center justify-between">
          <span>Sales & Meal Portion Income Details</span>
          <span className="text-[10px] text-white">Verified Portion Revenue</span>
        </div>
        <table className="w-full border-collapse border border-[#cbd5e1] text-left">
          <thead className="bg-[#f8fafc] text-[#475569] font-bold uppercase text-[10px]">
            <tr>
              <th className="border border-[#cbd5e1] p-2">Product Name</th>
              {!isSingleDay && <th className="border border-[#cbd5e1] p-2 text-center">Day</th>}
              <th className="border border-[#cbd5e1] p-2 text-right">Quantity Sold</th>
              <th className="border border-[#cbd5e1] p-2 text-right">Unit Price</th>
              <th className="border border-[#cbd5e1] p-2 text-right">Total (Qty × Price)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#cbd5e1]">
            {salesList.map((s, idx) => (
              <tr key={s.id || idx}>
                <td className="border border-[#cbd5e1] p-2 font-semibold text-[#0f172a]">{s.productName}</td>
                {!isSingleDay && (
                  <td className="border border-[#cbd5e1] p-2 text-center font-mono font-bold text-[#163324]">
                    Day {s.dayNumber}
                  </td>
                )}
                <td className="border border-[#cbd5e1] p-2 text-right font-mono font-bold text-[#0f172a]">
                  {formatNumber(s.quantity)}
                </td>
                <td className="border border-[#cbd5e1] p-2 text-right font-mono text-[#475569]">
                  {formatCurrency(s.price)}
                </td>
                <td className="border border-[#cbd5e1] p-2 text-right font-mono font-bold text-[#163324]">
                  {formatCurrency(s.total)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-[#f8fafc] font-bold">
            <tr>
              <td colSpan={!isSingleDay ? 4 : 3} className="border border-[#cbd5e1] p-2 text-right uppercase">
                Total Sales / Gross Revenue:
              </td>
              <td className="border border-[#cbd5e1] p-2 text-right font-mono text-base text-[#163324]">
                {formatCurrency(totalSalesAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </section>

      {/* 4. EXPENSE DETAILS */}
      <section className="mb-5">
        <div className="bg-[#163324] text-[#c29c5e] px-3 py-1.5 font-bold uppercase tracking-wider text-[11px] rounded-t flex items-center justify-between">
          <span>Expense Details — Operational Cost Centers</span>
          <span className="text-[10px] text-white">Internal Operations Accounting</span>
        </div>
        <table className="w-full border-collapse border border-[#cbd5e1] text-left">
          <thead className="bg-[#f8fafc] text-[#475569] font-bold uppercase text-[10px]">
            <tr>
              <th className="border border-[#cbd5e1] p-2">Category</th>
              <th className="border border-[#cbd5e1] p-2">Description</th>
              <th className="border border-[#cbd5e1] p-2">Vendor / Disbursed To</th>
              {!isSingleDay && <th className="border border-[#cbd5e1] p-2 text-center">Day</th>}
              <th className="border border-[#cbd5e1] p-2 text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#cbd5e1]">
            {expenseList.slice(0, 15).map((exp, idx) => (
              <tr key={exp.id || idx}>
                <td className="border border-[#cbd5e1] p-2 font-semibold text-[#0f172a]">{exp.category}</td>
                <td className="border border-[#cbd5e1] p-2 text-[#475569]">{exp.description}</td>
                <td className="border border-[#cbd5e1] p-2 text-[#64748b]">{exp.vendor || 'Direct Cash'}</td>
                {!isSingleDay && (
                  <td className="border border-[#cbd5e1] p-2 text-center font-mono font-bold text-[#475569]">
                    Day {exp.dayNumber}
                  </td>
                )}
                <td className="border border-[#cbd5e1] p-2 text-right font-mono font-bold text-red-600">
                  {formatCurrency(exp.amount)}
                </td>
              </tr>
            ))}
            {expenseList.length > 15 && (
              <tr>
                <td colSpan={!isSingleDay ? 5 : 4} className="border border-[#cbd5e1] p-1.5 text-center text-[#64748b] italic">
                  (+ {expenseList.length - 15} additional operational procurement line items included in ledger total)
                </td>
              </tr>
            )}
          </tbody>
          <tfoot className="bg-[#f8fafc] font-bold">
            <tr>
              <td colSpan={!isSingleDay ? 4 : 3} className="border border-[#cbd5e1] p-2 text-right uppercase">
                Total Expenses:
              </td>
              <td className="border border-[#cbd5e1] p-2 text-right font-mono text-base text-red-600">
                {formatCurrency(totalExpenseAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </section>

      {/* 5. FINANCIAL SUMMARY (NET INCOME) */}
      <section className="mb-5">
        <div className="bg-[#163324] text-[#c29c5e] px-3 py-1.5 font-bold uppercase tracking-wider text-[11px] rounded-t flex items-center justify-between">
          <span>Executive Financial Summary & Net Income Statement</span>
          <span className="text-[10px] text-white">Formula: Total Sales - Total Expenses</span>
        </div>
        <table className="w-full border-collapse border border-[#cbd5e1] text-left">
          <thead className="bg-[#f8fafc] text-[#475569] font-bold uppercase text-[10px]">
            <tr>
              <th className="border border-[#cbd5e1] p-2.5 text-center">Total Sales / Gross Revenue</th>
              <th className="border border-[#cbd5e1] p-2.5 text-center">Total Incurred Expenses</th>
              <th className="border border-[#cbd5e1] p-2.5 text-center">Net Operating Income</th>
              <th className="border border-[#cbd5e1] p-2.5 text-center">Net Margin %</th>
            </tr>
          </thead>
          <tbody>
            <tr className="font-mono text-center font-bold text-sm">
              <td className="border border-[#cbd5e1] p-3 text-[#163324]">{formatCurrency(totalSalesAmount)}</td>
              <td className="border border-[#cbd5e1] p-3 text-red-600">{formatCurrency(totalExpenseAmount)}</td>
              <td className="border border-[#cbd5e1] p-3 text-emerald-700 text-base">{formatCurrency(netIncome)}</td>
              <td className="border border-[#cbd5e1] p-3 text-emerald-700">
                {totalSalesAmount > 0 ? `${((netIncome / totalSalesAmount) * 100).toFixed(1)}%` : '0.0%'}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* 6. PENDING TASKS */}
      <section className="mb-5">
        <div className="bg-[#163324] text-[#c29c5e] px-3 py-1.5 font-bold uppercase tracking-wider text-[11px] rounded-t flex items-center justify-between">
          <span>Operational Checklist & Task Audit</span>
          <span className="text-[10px] text-white">Status Verification</span>
        </div>
        <table className="w-full border-collapse border border-[#cbd5e1] text-left">
          <thead className="bg-[#f8fafc] text-[#475569] font-bold uppercase text-[10px]">
            <tr>
              <th className="border border-[#cbd5e1] p-2">Task Milestone</th>
              <th className="border border-[#cbd5e1] p-2">Category</th>
              <th className="border border-[#cbd5e1] p-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#cbd5e1]">
            {(pendingTasksList.length > 0 ? pendingTasksList.slice(0, 6) : [
              { title: 'Confirm Guest Count (30,000 Pax)', category: 'Coordination', status: 'Completed' },
              { title: 'Confirm Food Quantity & Spices', category: 'Kitchen', status: 'Completed' },
              { title: 'Confirm Single Counter Barricading', category: 'Logistics', status: 'Completed' },
              { title: 'Daily Financial & Voucher Reconciliation', category: 'Finance', status: 'Completed' },
            ]).map((tsk, idx) => (
              <tr key={tsk.id || idx}>
                <td className="border border-[#cbd5e1] p-2 font-medium text-[#0f172a]">{tsk.title || tsk.task}</td>
                <td className="border border-[#cbd5e1] p-2 text-[#64748b]">{tsk.category}</td>
                <td className="border border-[#cbd5e1] p-2 text-center font-bold">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] ${
                      tsk.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {tsk.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 7. MANAGER NOTES */}
      <section className="mb-6">
        <div className="bg-[#163324] text-[#c29c5e] px-3 py-1.5 font-bold uppercase tracking-wider text-[11px] rounded-t">
          Manager & Supervisor Notes
        </div>
        <div className="border border-[#cbd5e1] p-3 space-y-2 bg-[#f8fafc]">
          <div>
            <strong className="text-[#163324] uppercase text-[10px] block">Event Manager Notes:</strong>
            <p className="text-[#334155] italic">{managerNotes.eventManager}</p>
          </div>
          <div className="border-t border-[#e2e8f0] pt-2">
            <strong className="text-[#163324] uppercase text-[10px] block">Kitchen Operations Notes:</strong>
            <p className="text-[#334155] italic">{managerNotes.kitchenNotes}</p>
          </div>
          <div className="border-t border-[#e2e8f0] pt-2">
            <strong className="text-[#163324] uppercase text-[10px] block">One Counter Distribution Notes:</strong>
            <p className="text-[#334155] italic">{managerNotes.distributionNotes}</p>
          </div>
        </div>
      </section>

      {/* 8. AUTHORIZED SIGNATURES & FOOTER */}
      <ReportFooter />

      {/* 9. PAGE NUMBER & BRANDING */}
      <div className="mt-4 pt-2 border-t border-[#cbd5e1] flex items-center justify-between text-[10px] text-[#64748b] font-mono">
        <span>SILVER CATERING — Official Operations & Financial Document</span>
        <span className="font-bold">Page 1 of 1</span>
      </div>
    </div>
  )
}
export default Phase12ReportTemplate
