import React from 'react'
import { ThreeDayReportContent } from './ThreeDayReportContent'
import { EXPENSE_CATEGORIES } from '../../hooks/useExpenses'

export const REPORT_TYPES = [
  { id: 'event-summary', name: 'Event Summary', description: 'Executive event brief, venue coordinates, guest numbers, client liaison.' },
  { id: 'daily-ops', name: 'Daily Operations Report', description: 'Single-day kitchen yield, distribution logs, water tallies, and steward counts.' },
  { id: '3day-report', name: '3-Day Event Report', description: 'Comprehensive Day 1 to Day 3 comparison and final operational summary.' },
  { id: 'catering', name: 'Catering Report', description: 'Meal plan execution, service windows, dietary requirements, and buffer management.' },
  { id: 'menu', name: 'Menu Report', description: 'Full course breakdown per day with ingredients, units, quantities, and preparation notes.' },
  { id: 'food-prep', name: 'Food Preparation Report', description: 'Kitchen batch metrics, cooking milestones, recipe batch sizes, and temperature audits.' },
  { id: 'food-packing', name: 'Food Packing Report', description: 'Container inventory, thermal hot-box packaging tallies, and seal inspections.' },
  { id: 'food-distribution', name: 'Food Distribution Report', description: 'Central single-counter serving flow, speed-of-service, queue marshaling, and final deliveries.' },
  { id: 'water', name: 'Water Report', description: 'Pallet arrivals, hydration station stock, mineral water consumption, and remaining bottles.' },
  { id: 'staff', name: 'Staff Report', description: 'Crew deployment across 12 roles, shift attendance, supervisor sign-offs, and muster sheets.' },
  { id: 'arrangements', name: 'Arrangement Report', description: '18-point event readiness audit: stage, tables, single counter setup, audio PA, and power.' },
  { id: 'vendor', name: 'Vendor Report', description: 'Supplier contracts, poultry & spice deliveries, quality verification, and supplier contacts.' },
  { id: 'pending', name: 'Pending Report', description: 'Unresolved operational bottlenecks, material shortages, and urgent supervisor action items.' },
  { id: 'expenses', name: 'Expense Report', description: 'Internal operations purchases across 18 cost categories, vouchers, and cash slips.' },
  { id: 'payment', name: 'Payment Report', description: 'Vendor contract disbursals, advances, settlements, due dates, and outstanding balances.' },
  { id: 'complete-event', name: 'Complete Event Report', description: 'Master end-to-end event binder combining all 8 operational domains into one document.' },
]

export function ReportRenderer({
  reportId,
  event,
  summary,
  selectedDay = 'All',
  menuData = {},
  staffData = [],
  vendorData = [],
  arrangementData = [],
  taskData = [],
  expenseData = [],
}) {
  switch (reportId) {
    case '3day-report':
      return <ThreeDayReportContent event={event} summary={summary} />

    case 'event-summary':
      return (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-[#f8fafc] rounded border border-[#e2e8f0]">
              <span className="text-[10px] uppercase font-bold text-[#64748b] block mb-1">Event Master Profile</span>
              <table className="w-full text-left">
                <tbody>
                  <tr className="border-b border-[#e2e8f0]/60"><td className="py-1 text-[#64748b]">Event Name:</td><td className="py-1 font-bold">{event?.eventName || 'National Tech Fest 2026'}</td></tr>
                  <tr className="border-b border-[#e2e8f0]/60"><td className="py-1 text-[#64748b]">Client / Org:</td><td className="py-1">{event?.clientName || 'MES Engineering College'}</td></tr>
                  <tr className="border-b border-[#e2e8f0]/60"><td className="py-1 text-[#64748b]">Venue:</td><td className="py-1">{event?.venue || 'Campus Main Ground'}</td></tr>
                  <tr className="border-b border-[#e2e8f0]/60"><td className="py-1 text-[#64748b]">Duration:</td><td className="py-1">{event?.numberOfDays || 3} Days ({event?.startDate} to {event?.endDate})</td></tr>
                  <tr><td className="py-1 text-[#64748b]">Primary Service:</td><td className="py-1 font-semibold text-[#163324]">Halal Malabar Biryani + Mineral Water</td></tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-[#f8fafc] rounded border border-[#e2e8f0]">
              <span className="text-[10px] uppercase font-bold text-[#64748b] block mb-1">Attendance & Logistics Summary</span>
              <table className="w-full text-left">
                <tbody>
                  <tr className="border-b border-[#e2e8f0]/60"><td className="py-1 text-[#64748b]">Total Expected Guests:</td><td className="py-1 font-bold text-sm">30,000 Pax</td></tr>
                  <tr className="border-b border-[#e2e8f0]/60"><td className="py-1 text-[#64748b]">Daily Guest Allocation:</td><td className="py-1">Day 1: 10k | Day 2: 10k | Day 3: 10k</td></tr>
                  <tr className="border-b border-[#e2e8f0]/60"><td className="py-1 text-[#64748b]">Serving Infrastructure:</td><td className="py-1 font-bold text-[#163324]">STRICTLY ONE Centralized Distribution Counter</td></tr>
                  <tr className="border-b border-[#e2e8f0]/60"><td className="py-1 text-[#64748b]">Deployed Staff Roster:</td><td className="py-1">34 Personnel on Ground</td></tr>
                  <tr><td className="py-1 text-[#64748b]">Active Suppliers:</td><td className="py-1">{vendorData.length || 8} Commercial Vendors</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 bg-white rounded border border-[#cbd5e1]">
            <span className="text-[10px] uppercase font-bold text-[#64748b] block mb-2">Operations Highlights</span>
            <p className="text-xs text-[#334155] leading-relaxed">
              The event was administered under the single-counter distribution protocol, achieving a steady pass-through rate of 180 to 220 meals per minute during the 12:30 PM to 02:00 PM peak service window. Clean queue barricading and pre-labeled hot meal containers completely eliminated crowd congestion.
            </p>
          </div>
        </div>
      )

    case 'daily-ops':
      return (
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-[#f8fafc] rounded border border-[#cbd5e1] flex items-center justify-between">
            <span className="font-bold uppercase text-[#163324]">Selected Shift: {selectedDay === 'All' ? 'Day 1 Operations & Sales Log' : `Day ${selectedDay} Operations & Sales Log`}</span>
            <span className="text-[10px] bg-white px-2 py-0.5 rounded border font-mono">Service Window: 12:30 PM — 02:30 PM | ONE Counter</span>
          </div>

          {/* Financial KPIs Banner */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200">
              <span className="text-[10px] text-emerald-800 uppercase font-bold block">Day 1 Total Sales</span>
              <span className="text-base font-black text-emerald-900">₹8,26,500</span>
            </div>
            <div className="p-2.5 bg-rose-50 rounded border border-rose-200">
              <span className="text-[10px] text-rose-800 uppercase font-bold block">Day 1 Total Expenses</span>
              <span className="text-base font-black text-rose-900">₹4,15,000</span>
            </div>
            <div className="p-2.5 bg-blue-50 rounded border border-blue-200">
              <span className="text-[10px] text-blue-800 uppercase font-bold block">Day 1 Net Income</span>
              <span className="text-base font-black text-blue-900">₹4,11,500</span>
            </div>
          </div>

          {/* Core Products Stock & Sales */}
          <div>
            <div className="text-[11px] font-bold text-[#163324] uppercase mb-1.5 flex items-center justify-between">
              <span>Day 1 Distribution & Sales (3 Core Items)</span>
              <span className="text-[10px] text-[#64748b] font-normal">ONE Central Distribution Counter</span>
            </div>
            <table className="w-full text-left border border-[#cbd5e1] text-xs">
              <thead className="bg-[#f1f5f9] text-[#475569] font-bold text-[10px] uppercase">
                <tr>
                  <th className="p-2 border-b">Product Item</th>
                  <th className="p-2 border-b text-right">Prepared / Stock</th>
                  <th className="p-2 border-b text-right">Sold / Dispatched</th>
                  <th className="p-2 border-b text-right">Buffer Left</th>
                  <th className="p-2 border-b text-right">Price</th>
                  <th className="p-2 border-b text-right">Total Income (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                <tr>
                  <td className="p-2 font-bold text-[#0f172a]">Chicken Biryani</td>
                  <td className="p-2 text-right">5,000</td>
                  <td className="p-2 text-right font-black text-emerald-700">4,700</td>
                  <td className="p-2 text-right text-amber-700">300</td>
                  <td className="p-2 text-right font-mono">₹150</td>
                  <td className="p-2 text-right font-black text-[#163324]">₹7,05,000</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-[#0f172a]">Popcorn</td>
                  <td className="p-2 text-right">2,000</td>
                  <td className="p-2 text-right font-black text-emerald-700">1,800</td>
                  <td className="p-2 text-right text-amber-700">200</td>
                  <td className="p-2 text-right font-mono">₹30</td>
                  <td className="p-2 text-right font-black text-[#163324]">₹54,000</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-[#0f172a]">Water Bottle (250ml)</td>
                  <td className="p-2 text-right">5,000</td>
                  <td className="p-2 text-right font-black text-emerald-700">4,500</td>
                  <td className="p-2 text-right text-amber-700">500</td>
                  <td className="p-2 text-right font-mono">₹15</td>
                  <td className="p-2 text-right font-black text-[#163324]">₹67,500</td>
                </tr>
              </tbody>
              <tfoot className="bg-[#f8fafc] font-black text-xs border-t-2 border-[#cbd5e1]">
                <tr>
                  <td className="p-2 text-[#163324] uppercase">Day 1 Total</td>
                  <td className="p-2 text-right">12,000</td>
                  <td className="p-2 text-right text-emerald-700">11,000</td>
                  <td className="p-2 text-right text-amber-700">1,000</td>
                  <td className="p-2 text-right text-[#64748b]">-</td>
                  <td className="p-2 text-right text-emerald-800 text-sm">₹8,26,500</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="p-2.5 bg-amber-50 border border-amber-300 rounded text-[#78350f]">
            <span className="font-bold block uppercase text-[10px]">Strict Single-Counter Logistics:</span>
            <span>All distribution is served through <strong>ONE CENTRAL DISTRIBUTION COUNTER</strong> equipped with 6 rapid pass-through queuing lanes and clear signage.</span>
          </div>

          {/* Timeline */}
          <div>
            <div className="text-[11px] font-bold text-[#163324] uppercase mb-1.5">Production & Service Milestones</div>
            <table className="w-full text-left border border-[#cbd5e1] text-xs">
              <thead className="bg-[#f1f5f9] text-[#475569] font-bold text-[10px] uppercase">
                <tr>
                  <th className="p-2 border-b">Time</th>
                  <th className="p-2 border-b">Operational Checkpoint</th>
                  <th className="p-2 border-b">Metric / Portions</th>
                  <th className="p-2 border-b">Sign-Off</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                <tr><td className="p-2 font-mono">03:30 AM</td><td className="p-2">Fresh Raw Ingredients Intake</td><td className="p-2">Poultry, Rice, Spices Verified</td><td className="p-2 text-emerald-700 font-semibold">Chef K. Moideen</td></tr>
                <tr><td className="p-2 font-mono">05:00 AM</td><td className="p-2">Biryani Dum Pot Fires Lit & Popcorn Staging</td><td className="p-2">12 Cooking Degs + 2 Popcorn Stations</td><td className="p-2 text-emerald-700 font-semibold">Kitchen Lead</td></tr>
                <tr><td className="p-2 font-mono">09:30 AM</td><td className="p-2">First Dum Deg Opened & Temp Verified</td><td className="p-2">78°C Core Temp (Passed)</td><td className="p-2 text-emerald-700 font-semibold">Quality Inspector</td></tr>
                <tr><td className="p-2 font-mono">10:30 AM</td><td className="p-2">Packaging into Meal Boxes & Pouches</td><td className="p-2">5,000 Biryani Boxes + 2,000 Popcorn Tubs</td><td className="p-2 text-emerald-700 font-semibold">Packing Captain</td></tr>
                <tr><td className="p-2 font-mono">11:45 AM</td><td className="p-2">ONE Central Distribution Counter Staged</td><td className="p-2">Initial Stock + Buffer Staged</td><td className="p-2 text-emerald-700 font-semibold">Counter Marshal</td></tr>
                <tr><td className="p-2 font-mono">12:30 PM</td><td className="p-2">Counter Opens to Guests</td><td className="p-2">11,000 Total Units Sold</td><td className="p-2 text-emerald-700 font-semibold">Floor Captain</td></tr>
                <tr><td className="p-2 font-mono">03:00 PM</td><td className="p-2">Counter Closed, Cash Reconciled & Sanitation</td><td className="p-2">₹8,26,500 Cash Dispatched</td><td className="p-2 text-emerald-700 font-semibold">Rashid Ali</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )

    case 'menu':
      return (
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-[#f8fafc] rounded border border-[#cbd5e1]">
            <h4 className="font-bold text-[#163324] uppercase text-xs mb-1">Standardized 3-Product Event Menu</h4>
            <p className="text-[11px] text-[#64748b]">Fixed retail catering menu served exclusively across all 3 days through ONE Central Counter.</p>
          </div>

          <table className="w-full text-left border border-[#cbd5e1] text-xs">
            <thead className="bg-[#f1f5f9] text-[#475569] font-bold text-[10px] uppercase">
              <tr>
                <th className="p-2 border-b">Menu Item</th>
                <th className="p-2 border-b">Category</th>
                <th className="p-2 border-b text-right">Daily Req</th>
                <th className="p-2 border-b">Unit</th>
                <th className="p-2 border-b text-right">Price</th>
                <th className="p-2 border-b">Prep Specs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              <tr>
                <td className="p-2 font-bold text-[#0f172a]">Chicken Biryani</td>
                <td className="p-2 text-[#64748b]">Main Course</td>
                <td className="p-2 text-right font-black text-[#163324]">5,000</td>
                <td className="p-2">Portions</td>
                <td className="p-2 text-right font-black text-emerald-700">₹150</td>
                <td className="p-2 text-[#64748b]">Jeerakasala rice, tender halal chicken, pure cow ghee dum</td>
              </tr>
              <tr>
                <td className="p-2 font-bold text-[#0f172a]">Popcorn</td>
                <td className="p-2 text-[#64748b]">Snack</td>
                <td className="p-2 text-right font-black text-[#163324]">2,000</td>
                <td className="p-2">Tubs / Cones</td>
                <td className="p-2 text-right font-black text-emerald-700">₹30</td>
                <td className="p-2 text-[#64748b]">Freshly popped salted butter gourmet corn kernels</td>
              </tr>
              <tr>
                <td className="p-2 font-bold text-[#0f172a]">Water Bottle (250ml)</td>
                <td className="p-2 text-[#64748b]">Hydration</td>
                <td className="p-2 text-right font-black text-[#163324]">5,000</td>
                <td className="p-2">Bottles</td>
                <td className="p-2 text-right font-black text-emerald-700">₹15</td>
                <td className="p-2 text-[#64748b]">Tamper-evident sealed mineral spring water</td>
              </tr>
            </tbody>
          </table>
        </div>
      )

    case 'food-distribution':
      return (
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-300 rounded text-[#78350f]">
            <span className="font-bold block uppercase text-[10px]">Strict Operational Architecture Notice:</span>
            <span>All distribution is governed strictly through <strong>ONE CENTRAL DISTRIBUTION COUNTER</strong> equipped with 6 rapid pass-through queuing lanes and high-contrast digital directional signage.</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-[#f8fafc] rounded border border-[#cbd5e1]">
              <span className="text-[10px] text-[#64748b] uppercase font-bold block">Counter Status</span>
              <span className="text-sm font-black text-emerald-700">OPEN / COMPLETED</span>
            </div>
            <div className="p-3 bg-[#f8fafc] rounded border border-[#cbd5e1]">
              <span className="text-[10px] text-[#64748b] uppercase font-bold block">Distribution Lane Count</span>
              <span className="text-sm font-black text-[#163324]">ONE Central Counter</span>
            </div>
            <div className="p-3 bg-[#f8fafc] rounded border border-[#cbd5e1]">
              <span className="text-[10px] text-[#64748b] uppercase font-bold block">Total Handed Out</span>
              <span className="text-sm font-black text-[#0f172a]">30,000 Containers</span>
            </div>
          </div>

          <table className="w-full text-left border border-[#cbd5e1] text-xs">
            <thead className="bg-[#f1f5f9] text-[#475569] font-bold text-[10px] uppercase">
              <tr>
                <th className="p-2 border-b">Day</th>
                <th className="p-2 border-b">Staged Stock</th>
                <th className="p-2 border-b">Dispatched to Guests</th>
                <th className="p-2 border-b">Buffer Retained</th>
                <th className="p-2 border-b">Counter Supervisor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              <tr><td className="p-2 font-bold">Day 1</td><td className="p-2">10,100</td><td className="p-2 text-emerald-700 font-black">10,000</td><td className="p-2 text-amber-700">100</td><td className="p-2">Rashid Ali (Counter Lead)</td></tr>
              <tr><td className="p-2 font-bold">Day 2</td><td className="p-2">10,050</td><td className="p-2 text-emerald-700 font-black">10,000</td><td className="p-2 text-amber-700">50</td><td className="p-2">Rashid Ali (Counter Lead)</td></tr>
              <tr><td className="p-2 font-bold">Day 3</td><td className="p-2">10,000</td><td className="p-2 text-emerald-700 font-black">10,000</td><td className="p-2 text-amber-700">0</td><td className="p-2">Rashid Ali (Counter Lead)</td></tr>
            </tbody>
          </table>
        </div>
      )

    case 'staff':
      return (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-[#f8fafc] border border-[#cbd5e1] rounded">
            <span className="font-bold text-[#163324] uppercase">Operations Crew Muster Roster (12 Key Catering Roles)</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">100% Attendance Verified</span>
          </div>

          <table className="w-full text-left border border-[#cbd5e1] text-xs">
            <thead className="bg-[#f1f5f9] text-[#475569] font-bold text-[10px] uppercase">
              <tr>
                <th className="p-2 border-b">Staff Name</th>
                <th className="p-2 border-b">Role</th>
                <th className="p-2 border-b">Department</th>
                <th className="p-2 border-b">Phone</th>
                <th className="p-2 border-b">Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {(staffData.length > 0 ? staffData.slice(0, 10) : [
                { name: 'Faizal Rahman', role: 'Event Operations Manager', department: 'Management', phone: '+91 98460 11223', attendance: 'Present' },
                { name: 'Chef K. Moideen', role: 'Kitchen Supervisor', department: 'Kitchen', phone: '+91 94470 33445', attendance: 'Present' },
                { name: 'Rashid Ali', role: 'Distribution Team', department: 'Distribution', phone: '+91 97450 55667', attendance: 'Present' },
                { name: 'Anas K.', role: 'Packing Team', department: 'Packaging', phone: '+91 99460 77889', attendance: 'Present' },
                { name: 'Vipin Das', role: 'Water Team', department: 'Hydration', phone: '+91 95670 99001', attendance: 'Present' },
                { name: 'Sajid K.T.', role: 'Queue Management', department: 'Security', phone: '+91 98471 22334', attendance: 'Present' },
              ]).map((st, i) => (
                <tr key={i}>
                  <td className="p-2 font-bold text-[#0f172a]">{st.name}</td>
                  <td className="p-2 text-[#163324] font-medium">{st.role}</td>
                  <td className="p-2 text-[#64748b]">{st.department}</td>
                  <td className="p-2 font-mono text-[11px]">{st.phone}</td>
                  <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold">Present</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'vendor':
    case 'payment':
      return (
        <div className="space-y-4 text-xs">
          <div className="p-2.5 bg-[#f8fafc] border border-[#cbd5e1] rounded flex items-center justify-between">
            <span className="font-bold text-[#163324] uppercase">Vendor Contracts & Disbursal Status</span>
            <span className="text-[10px] text-[#64748b]">Total Contracted: ₹{vendorData.reduce((s, v) => s + (Number(v.contractAmount) || 0), 0).toLocaleString('en-IN')}</span>
          </div>

          <table className="w-full text-left border border-[#cbd5e1] text-xs">
            <thead className="bg-[#f1f5f9] text-[#475569] font-bold text-[10px] uppercase">
              <tr>
                <th className="p-2 border-b">Vendor / Supplier</th>
                <th className="p-2 border-b">Scope / Category</th>
                <th className="p-2 border-b text-right">Contract (₹)</th>
                <th className="p-2 border-b text-right">Paid (₹)</th>
                <th className="p-2 border-b text-right">Balance (₹)</th>
                <th className="p-2 border-b">Due Date</th>
                <th className="p-2 border-b text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {(vendorData.length > 0 ? vendorData : []).map((v) => {
                const bal = Math.max(0, (Number(v.contractAmount) || 0) - (Number(v.paid) || 0))
                return (
                  <tr key={v.id}>
                    <td className="p-2 font-bold text-[#0f172a]">{v.vendorName}</td>
                    <td className="p-2 text-[#64748b]">{v.category}</td>
                    <td className="p-2 text-right font-black">₹{Number(v.contractAmount).toLocaleString('en-IN')}</td>
                    <td className="p-2 text-right text-emerald-700 font-bold">₹{Number(v.paid).toLocaleString('en-IN')}</td>
                    <td className="p-2 text-right text-amber-700 font-black">₹{bal.toLocaleString('en-IN')}</td>
                    <td className="p-2 font-mono text-[11px]">{v.dueDate || '2026-03-22'}</td>
                    <td className="p-2 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${bal === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {bal === 0 ? 'Settled' : 'Partial'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )

    case 'expenses':
      return (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 bg-[#f8fafc] rounded border">
              <span className="text-[9px] text-[#64748b] uppercase block">Budget</span>
              <span className="text-xs font-black">₹{summary?.estimatedExpense?.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-2 bg-[#f8fafc] rounded border">
              <span className="text-[9px] text-[#64748b] uppercase block">Actual</span>
              <span className="text-xs font-black text-[#163324]">₹{summary?.actualExpense?.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-2 bg-emerald-50 rounded border border-emerald-200">
              <span className="text-[9px] text-emerald-800 uppercase block">Paid</span>
              <span className="text-xs font-black text-emerald-800">₹{summary?.paidExpense?.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-2 bg-amber-50 rounded border border-amber-200">
              <span className="text-[9px] text-amber-800 uppercase block">Pending</span>
              <span className="text-xs font-black text-amber-800">₹{summary?.pendingExpense?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <table className="w-full text-left border border-[#cbd5e1] text-xs">
            <thead className="bg-[#f1f5f9] text-[#475569] font-bold text-[10px] uppercase">
              <tr>
                <th className="p-2 border-b">Day</th>
                <th className="p-2 border-b">Category</th>
                <th className="p-2 border-b">Description & Payee</th>
                <th className="p-2 border-b text-right">Amount (₹)</th>
                <th className="p-2 border-b">Method</th>
                <th className="p-2 border-b text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {(expenseData.length > 0 ? expenseData.slice(0, 12) : []).map((e) => (
                <tr key={e.id}>
                  <td className="p-2 font-bold">Day {e.dayNumber}</td>
                  <td className="p-2 text-[#163324] font-medium">{e.category}</td>
                  <td className="p-2 max-w-xs truncate">{e.description}</td>
                  <td className="p-2 text-right font-black">₹{Number(e.amount).toLocaleString('en-IN')}</td>
                  <td className="p-2 text-[#64748b]">{e.paymentMethod}</td>
                  <td className="p-2 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${e.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    default:
      // Standard comprehensive operational report for other categories (Catering, Preparation, Packing, Water, Arrangements, Pending, Complete Event)
      return (
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-[#f8fafc] rounded border border-[#cbd5e1]">
            <h4 className="font-bold text-[#163324] uppercase text-xs mb-1">
              Operations Verification Matrix
            </h4>
            <p className="text-[11px] text-[#64748b]">
              Official field data snapshot for {event?.eventName || 'National Tech Fest 2026'}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border rounded bg-white">
              <span className="text-[10px] uppercase font-bold text-[#64748b] block mb-2">Key Metrics</span>
              <ul className="space-y-1 text-xs">
                <li className="flex justify-between py-1 border-b"><span>Total Meals Dispatched:</span><strong>30,000 Portions</strong></li>
                <li className="flex justify-between py-1 border-b"><span>Bottled Water Distributed:</span><strong>30,000 Units</strong></li>
                <li className="flex justify-between py-1 border-b"><span>Distribution Counter:</span><strong>ONE Central Counter</strong></li>
                <li className="flex justify-between py-1"><span>Hygiene Compliance:</span><strong className="text-emerald-700">100% Cleared</strong></li>
              </ul>
            </div>

            <div className="p-3 border rounded bg-white">
              <span className="text-[10px] uppercase font-bold text-[#64748b] block mb-2">Cost & Logistics Audit</span>
              <ul className="space-y-1 text-xs">
                <li className="flex justify-between py-1 border-b"><span>Estimated Budget:</span><strong>₹26,50,000</strong></li>
                <li className="flex justify-between py-1 border-b"><span>Total Actual Expense:</span><strong>₹19,81,000</strong></li>
                <li className="flex justify-between py-1 border-b"><span>Paid Disbursals:</span><strong className="text-emerald-700">₹13,73,500</strong></li>
                <li className="flex justify-between py-1"><span>Customer Billing:</span><strong className="text-[#64748b]">None (Internal Ops)</strong></li>
              </ul>
            </div>
          </div>
        </div>
      )
  }
}

