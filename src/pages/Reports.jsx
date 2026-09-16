import React, { useState, useMemo } from 'react'
import {
  FileText,
  Printer,
  Download,
  Calendar,
  Layers,
  Building2,
  Users,
  Store,
  Clock,
  Utensils,
  Package,
  Truck,
  Droplets,
  CreditCard,
  IndianRupee,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  BarChart3,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useToast } from '../components/ui/ToastContext'
import { useEvents } from '../context/EventContext'
import { useExpenses } from '../hooks/useExpenses'
import { useVendors } from '../hooks/useVendors'
import { useStaff } from '../hooks/useStaff'
import { useArrangements } from '../hooks/useArrangements'
import { useTasks } from '../hooks/useTasks'
import { ReportHeader } from '../components/reports/ReportHeader'
import { ReportFooter } from '../components/reports/ReportFooter'
import { PrintPreviewBar } from '../components/reports/PrintPreviewBar'
import { REPORT_TYPES, ReportRenderer } from '../components/reports/ReportTemplates'

export function Reports() {
  const toast = useToast()
  const { events, activeEventId } = useEvents()
  const { expenses, getExpenseSummary } = useExpenses()
  const { vendors } = useVendors()
  const { staff } = useStaff()
  const { arrangements } = useArrangements()
  const { tasks } = useTasks()

  // State
  const [selectedEventId, setSelectedEventId] = useState(activeEventId || 'evt-college-3day')
  const [selectedReportId, setSelectedReportId] = useState(null) // null means show directory, string means preview mode
  const [selectedDay, setSelectedDay] = useState('All')

  // Selected event
  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0]
  }, [events, selectedEventId])

  // Expense summary
  const summary = useMemo(() => {
    return getExpenseSummary(selectedEventId)
  }, [getExpenseSummary, selectedEventId, expenses])

  // Handlers for printing
  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPdf = () => {
    toast.info(
      'Download PDF',
      "In the print dialog, select 'Save as PDF' from the Destination dropdown and click Save."
    )
    setTimeout(() => {
      window.print()
    }, 400)
  }

  const handleOpenReport = (reportId) => {
    setSelectedReportId(reportId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBackToCatalog = () => {
    setSelectedReportId(null)
  }

  // Get icon for report cards
  const getReportIcon = (id) => {
    switch (id) {
      case 'event-summary':
        return <Building2 className="w-5 h-5 text-[#163324]" />
      case 'daily-ops':
        return <Clock className="w-5 h-5 text-blue-700" />
      case '3day-report':
        return <Sparkles className="w-5 h-5 text-[#c29c5e]" />
      case 'catering':
        return <Utensils className="w-5 h-5 text-[#163324]" />
      case 'menu':
        return <FileText className="w-5 h-5 text-emerald-700" />
      case 'food-prep':
        return <Utensils className="w-5 h-5 text-orange-700" />
      case 'food-packing':
        return <Package className="w-5 h-5 text-purple-700" />
      case 'food-distribution':
        return <Truck className="w-5 h-5 text-emerald-800" />
      case 'water':
        return <Droplets className="w-5 h-5 text-blue-600" />
      case 'staff':
        return <Users className="w-5 h-5 text-indigo-700" />
      case 'arrangements':
        return <Layers className="w-5 h-5 text-teal-700" />
      case 'vendor':
        return <Store className="w-5 h-5 text-amber-700" />
      case 'pending':
        return <Clock className="w-5 h-5 text-red-600" />
      case 'expenses':
        return <IndianRupee className="w-5 h-5 text-emerald-800" />
      case 'payment':
        return <CreditCard className="w-5 h-5 text-blue-800" />
      case 'complete-event':
        return <FileText className="w-5 h-5 text-[#c29c5e]" />
      default:
        return <FileText className="w-5 h-5 text-[#163324]" />
    }
  }

  const activeReportMeta = REPORT_TYPES.find((r) => r.id === selectedReportId)

  // =========================================================================
  // VIEW MODE 1: PRINT PREVIEW MODE (RENDERED IN A4 FORMAT)
  // =========================================================================
  if (selectedReportId) {
    return (
      <div className="space-y-6">
        {/* Sticky Print Controls Bar (hidden during physical print) */}
        <PrintPreviewBar
          selectedReportId={selectedReportId}
          onSelectReport={setSelectedReportId}
          events={events}
          selectedEventId={selectedEventId}
          onSelectEvent={setSelectedEventId}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          onBack={handleBackToCatalog}
          onPrint={handlePrint}
          onDownloadPdf={handleDownloadPdf}
        />

        {/* Screen Notice for A4 layout */}
        <div className="no-print p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-blue-700 shrink-0" />
            <span>
              <strong>A4 Print Layout Preview:</strong> Standardized A4 portrait format. During print, sidebars, headers, buttons, and navigation are automatically hidden.
            </span>
          </div>
          <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-blue-200 text-blue-800">
            A4: 210 × 297 mm
          </span>
        </div>

        {/* The Professional A4 Sheet Container */}
        <div className="flex justify-center pb-12">
          <div className="a4-print-sheet w-full max-w-[210mm] min-h-[297mm] bg-white border border-[#cbd5e1] rounded-xl shadow-lg p-8 sm:p-12 text-[#0f172a] text-xs">
            {/* Header: SILVER CATERING branding + Event details */}
            <ReportHeader
              reportTitle={activeReportMeta?.name || 'Operations Report'}
              reportSubtitle={activeReportMeta?.description}
              event={currentEvent}
            />

            {/* Main Report Body */}
            <div className="py-2">
              <ReportRenderer
                reportId={selectedReportId}
                event={currentEvent}
                summary={summary}
                selectedDay={selectedDay}
                staffData={staff}
                vendorData={vendors}
                arrangementData={arrangements}
                taskData={tasks}
                expenseData={expenses}
              />
            </div>

            {/* Footer: Signatures and audit block */}
            <ReportFooter
              notes={
                selectedReportId === '3day-report'
                  ? 'All operations for the 3-day 30,000 guests event concluded with zero safety deviations. Single distribution counter flow maintained optimum serving throughput with zero queue congestion.'
                  : `This ${activeReportMeta?.name} has been generated directly from the Silver Catering internal operations database.`
              }
            />
          </div>
        </div>
      </div>
    )
  }

  // =========================================================================
  // VIEW MODE 2: REPORTS CATALOG DIRECTORY (ALL 16 REPORTS)
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Operations Reports & A4 Printouts"
        description="Official A4 operations reports, 3-day final event summaries, kitchen prep logs, staff musters, and vendor disbursals."
        badge="A4 Print Ready"
        badgeVariant="gold"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Sparkles className="w-4 h-4 text-[#dfbe82]" />}
              onClick={() => handleOpenReport('3day-report')}
            >
              Open 3-Day Final Report
            </Button>
          </div>
        }
      />

      {/* Operational Notice Banner */}
      <div className="p-3.5 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-xs text-[#92400e] flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 shrink-0 text-[#d97706]" />
          <span>
            <strong>Internal Operations Reporting:</strong> All 16 reports compile verified data across kitchen production, one-counter distribution, water logistics, crew deployment, and internal expense ledgers. No customer invoices are produced.
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#fef3c7] text-[#b45309] shrink-0">
          A4 Standardized
        </span>
      </div>

      {/* Event Selection Bar */}
      <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-[#163324]" />
          <div>
            <span className="text-[10px] uppercase font-bold text-[#64748b] tracking-wider block">
              Active Event Reporting Scope
            </span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="text-sm font-bold text-[#0f172a] bg-transparent border-none focus:outline-none cursor-pointer pr-4"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.eventName} — {ev.clientName} ({ev.numberOfDays} Days)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick event stats pill */}
        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-[10px] text-[#64748b] block">Total Guests:</span>
            <strong className="text-[#0f172a]">30,000 Pax</strong>
          </div>
          <div className="h-6 w-px bg-[#e2e8f0]" />
          <div>
            <span className="text-[10px] text-[#64748b] block">Counter Flow:</span>
            <strong className="text-[#163324]">ONE Central Counter</strong>
          </div>
          <div className="h-6 w-px bg-[#e2e8f0]" />
          <div>
            <span className="text-[10px] text-[#64748b] block">Available Reports:</span>
            <strong className="text-emerald-700">16 Full Templates</strong>
          </div>
        </div>
      </div>

      {/* Featured Highlight: 3-Day Event Final Report Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#163324] to-[#214734] text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#c29c5e]/20 text-[#dfbe82] text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Executive Debrief Document
          </div>
          <h3 className="text-lg font-black text-white tracking-wide">
            3-Day Event Operational Final Report
          </h3>
          <p className="text-xs text-[#cbd5e1] leading-relaxed">
            Consolidates Day 1, Day 2, and Day 3 metrics (Expected Guests, Food Prepared, Food Packed, Food Delivered, Food Remaining, Water Delivered, Water Remaining, Expenses, Pending) into an official executive summary.
          </p>
        </div>

        <div className="flex items-center gap-2.5 z-10 shrink-0">
          <Button
            variant="secondary"
            size="md"
            leftIcon={<Printer className="w-4 h-4 text-[#163324]" />}
            onClick={() => handleOpenReport('3day-report')}
          >
            Preview & Print 3-Day Report
          </Button>
        </div>
      </div>

      {/* 16 Reports Directory Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#0f172a] uppercase tracking-wider">
            All 16 Operations Reports
          </h3>
          <span className="text-xs text-[#64748b]">Click any report to preview A4 layout and print</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORT_TYPES.map((report) => (
            <div
              key={report.id}
              onClick={() => handleOpenReport(report.id)}
              className="group p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-xs hover:border-[#163324] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] group-hover:bg-[#163324]/5 transition-colors">
                    {getReportIcon(report.id)}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#475569] group-hover:bg-[#163324] group-hover:text-white transition-colors">
                    A4 Printable
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#0f172a] group-hover:text-[#163324] transition-colors">
                  {report.name}
                </h4>

                <p className="text-xs text-[#64748b] mt-1 line-clamp-2 leading-relaxed">
                  {report.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-xs font-semibold text-[#163324]">
                <span>Preview Document</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
