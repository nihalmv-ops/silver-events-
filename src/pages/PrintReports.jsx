import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Printer,
  FileText,
  Download,
  Eye,
  Calendar,
  Layers,
  Sparkles,
  Receipt,
  DollarSign,
  TrendingUp,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { useToast } from '../components/ui/ToastContext'
import { useEvents } from '../context/EventContext'
import { useFinance } from '../hooks/useFinance'
import { useExpenses } from '../hooks/useExpenses'
import { useTasks } from '../hooks/useTasks'
import { Phase12ReportTemplate } from '../components/reports/Phase12ReportTemplate'

export const PHASE12_REPORTS = [
  {
    id: 'day1',
    title: 'Day 1 Operations & Financial Report',
    description: 'Complete Day 1 single-counter food distribution (Biryani 4,700 sold, Popcorn 1,800 sold, Water 4,500 sold), daily sales ₹826,500, and operating expenses.',
    badge: 'Day 1 Specific',
    badgeVariant: 'gold',
    icon: Calendar,
  },
  {
    id: 'day2',
    title: 'Day 2 Operations & Financial Report',
    description: 'Complete Day 2 central kitchen yield, single-counter serving (Biryani 5,000 sold, Popcorn 2,000 sold, Water 4,800 sold), and daily net revenue statement.',
    badge: 'Day 2 Specific',
    badgeVariant: 'gold',
    icon: Calendar,
  },
  {
    id: 'day3',
    title: 'Day 3 Operations & Financial Report',
    description: 'Final event day food portions (Biryani 4,800 sold, Popcorn 1,900 sold, Water 4,700 sold), daily costs, and day 3 closing ledger.',
    badge: 'Day 3 Specific',
    badgeVariant: 'gold',
    icon: Calendar,
  },
  {
    id: 'complete-3day',
    title: 'Complete 3-Day Event Report',
    description: 'Master 30,000-guest event operations audit, 3-day biryani, popcorn & water consumption, total sales ₹2,556,000, and final net profit.',
    badge: 'Master Audit',
    badgeVariant: 'success',
    icon: Sparkles,
  },
  {
    id: 'financial-summary',
    title: 'Executive Financial Summary Report',
    description: 'High-level P&L statement comparing Day 1, Day 2, Day 3 and grand totals with operational expense category distributions.',
    badge: 'P&L Statement',
    badgeVariant: 'warning',
    icon: TrendingUp,
  },
  {
    id: 'expenses',
    title: 'Expense & Procurement Ledger Report',
    description: 'Detailed voucher-by-voucher accounting of raw poultry, spices, water pallets, staff wages, and fuel logistics.',
    badge: 'Cost Accounting',
    badgeVariant: 'neutral',
    icon: Receipt,
  },
  {
    id: 'sales-income',
    title: 'Sales & Meal Portion Income Report',
    description: 'Itemized dish-by-dish revenue ledger showing portion quantities distributed, unit prices applied, and sales yields.',
    badge: 'Revenue Ledger',
    badgeVariant: 'primary',
    icon: DollarSign,
  },
]

import { downloadReportAsPdf } from '../utils/pdfExport'

export function PrintReports() {
  const toast = useToast()
  const [searchParams] = useSearchParams()
  const { events, activeEventId } = useEvents()
  const { getDailyFinancials, getThreeDayFinancials, getDailyStock } = useFinance()
  const { expenses } = useExpenses()
  const { tasks } = useTasks()
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

  // Parse search params: support ?report=day1 or ?day=1
  const reportQuery =
    searchParams.get('report') ||
    (searchParams.get('day') ? `day${searchParams.get('day')}` : null)

  const [selectedEventId, setSelectedEventId] = useState(activeEventId || 'evt-college-3day')
  const [activeReportId, setActiveReportId] = useState(reportQuery || null)

  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0]
  }, [events, selectedEventId])

  const day1Fin = useMemo(() => getDailyFinancials(selectedEventId, 1), [getDailyFinancials, selectedEventId])
  const day2Fin = useMemo(() => getDailyFinancials(selectedEventId, 2), [getDailyFinancials, selectedEventId])
  const day3Fin = useMemo(() => getDailyFinancials(selectedEventId, 3), [getDailyFinancials, selectedEventId])
  const threeDayFin = useMemo(() => getThreeDayFinancials(selectedEventId), [getThreeDayFinancials, selectedEventId])

  const day1Stock = useMemo(() => getDailyStock(selectedEventId, 1), [getDailyStock, selectedEventId])
  const day2Stock = useMemo(() => getDailyStock(selectedEventId, 2), [getDailyStock, selectedEventId])
  const day3Stock = useMemo(() => getDailyStock(selectedEventId, 3), [getDailyStock, selectedEventId])

  // Auto-print if query param autoprint=true
  useEffect(() => {
    if (searchParams.get('autoprint') === 'true' && activeReportId) {
      const timer = setTimeout(() => {
        window.print()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [searchParams, activeReportId])

  // Update activeReportId if URL searchParams changes
  useEffect(() => {
    if (reportQuery) {
      setActiveReportId(reportQuery)
    }
  }, [reportQuery])

  // Handlers
  const handleView = (reportId) => {
    setActiveReportId(reportId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrint = (reportId) => {
    setActiveReportId(reportId)
    setTimeout(() => {
      window.print()
    }, 350)
  }

  const handleDownloadPdf = async (reportId) => {
    const targetReport = reportId || activeReportId || 'day1'
    if (reportId && activeReportId !== reportId) {
      setActiveReportId(reportId)
    }
    setIsGeneratingPdf(true)
    toast.info('Generating PDF', `Preparing official A4 document for ${targetReport}...`)
    try {
      const success = await downloadReportAsPdf(
        'print-reports-pdf-root',
        `Silver-Catering-${targetReport.toUpperCase()}-Report.pdf`
      )
      if (success) {
        toast.success('PDF Downloaded', 'Report downloaded directly to your computer!')
      }
    } catch (e) {
      console.error(e)
      toast.error('Print Fallback', 'Opening print preview.')
      window.print()
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Controls Bar - Hidden during printing */}
      <div className="print:hidden">
        <PageHeader
          title="Official Print Reports & Financial Audits"
          description="Standardized A4 printer-ready operational documents with strict Silver Catering branding, food tallies, P&L ledgers, and authorized supervisor signatures."
          badge="A4 Print Engine"
          badgeVariant="gold"
          actions={
            activeReportId ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  onClick={() => setActiveReportId(null)}
                >
                  Back to All Reports
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Printer className="w-4 h-4" />}
                  onClick={() => window.print()}
                >
                  Print Current Report
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Printer className="w-4 h-4" />}
                  onClick={() => handlePrint('day1')}
                >
                  Print Day 1 Report
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Sparkles className="w-4 h-4 text-[#c29c5e]" />}
                  onClick={() => handlePrint('complete-3day')}
                >
                  Print 3-Day Master Audit
                </Button>
              </div>
            )
          }
        />

        {/* Operational Notice */}
        <div className="mt-4 p-3.5 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-xs text-[#92400e] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 shrink-0 text-[#d97706]" />
            <span>
              <strong>A4 Production Standard:</strong> When printing or downloading as PDF, all application navigation, sidebars, and control buttons are automatically hidden.
            </span>
          </div>
          <span className="hidden sm:inline-block font-mono text-[11px] font-bold text-[#b45309] bg-white px-2.5 py-1 rounded border border-[#fde68a]">
            Target: 30,000 Guests / 3 Days
          </span>
        </div>
      </div>

      {/* VIEW / PREVIEW MODE */}
      {activeReportId ? (
        <div className="space-y-4">
          {/* Action floating bar on screen */}
          <div className="print:hidden p-4 rounded-xl bg-[#163324] text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#c29c5e] text-[#163324] flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#c29c5e] uppercase tracking-wider">
                  Report Preview Active
                </p>
                <h4 className="text-sm font-bold text-white">
                  {PHASE12_REPORTS.find((r) => r.id === activeReportId)?.title || 'Operational Report'}
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveReportId(null)}
                className="text-white border-white/30 hover:bg-white/10"
              >
                Close Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isGeneratingPdf}
                leftIcon={<Download className="w-3.5 h-3.5 text-[#c29c5e]" />}
                onClick={() => handleDownloadPdf(activeReportId)}
                className="text-white border-white/30 hover:bg-white/10"
              >
                {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-[#c29c5e] hover:bg-[#b08b4e] text-[#163324] font-bold border-none"
                leftIcon={<Printer className="w-3.5 h-3.5" />}
                onClick={() => window.print()}
              >
                Print A4 Sheet
              </Button>
            </div>
          </div>

          {/* Render Actual A4 Document */}
          <Phase12ReportTemplate
            id="print-reports-pdf-root"
            reportType={activeReportId}
            event={currentEvent}
            day1Fin={day1Fin}
            day2Fin={day2Fin}
            day3Fin={day3Fin}
            threeDayFin={threeDayFin}
            day1Stock={day1Stock}
            day2Stock={day2Stock}
            day3Stock={day3Stock}
            stock={activeReportId === 'day1' ? day1Stock : activeReportId === 'day2' ? day2Stock : day3Stock}
            expenses={expenses}
            tasks={tasks}
          />
        </div>
      ) : (
        /* REPORTS DIRECTORY / GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 print:hidden">
          {PHASE12_REPORTS.map((report) => {
            const Icon = report.icon
            return (
              <Card
                key={report.id}
                className={`p-5 border transition-all flex flex-col justify-between ${
                  report.id === 'day1'
                    ? 'border-[#163324] bg-emerald-50/20 shadow-xs'
                    : 'border-[#e2e8f0] hover:border-[#163324] hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#163324]/10 text-[#163324] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant={report.badgeVariant} size="sm">
                      {report.badge}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-[#0f172a] tracking-tight">
                    {report.title}
                  </h3>
                  <p className="text-xs text-[#64748b] mt-2 leading-relaxed">
                    {report.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#f1f5f9] flex flex-wrap items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => handleView(report.id)}
                    className="text-xs px-2.5 h-8"
                  >
                    View
                  </Button>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Download className="w-3.5 h-3.5" />}
                      onClick={() => handleDownloadPdf(report.id)}
                      className="text-xs px-2 h-8 text-[#64748b] hover:text-[#0f172a]"
                      title="Download PDF"
                    >
                      PDF
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Printer className="w-3.5 h-3.5" />}
                      onClick={() => handlePrint(report.id)}
                      className="text-xs px-3 h-8"
                    >
                      Print
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Fallback printable document for physical printing if on directory view */}
      {!activeReportId && (
        <div className="hidden print:block">
          <Phase12ReportTemplate
            id="print-reports-fallback-pdf-root"
            reportType="day1"
            event={currentEvent}
            day1Fin={day1Fin}
            day2Fin={day2Fin}
            day3Fin={day3Fin}
            threeDayFin={threeDayFin}
            day1Stock={day1Stock}
            day2Stock={day2Stock}
            day3Stock={day3Stock}
            stock={day1Stock}
            expenses={expenses}
            tasks={tasks}
          />
        </div>
      )}
    </div>
  )
}
export default PrintReports
