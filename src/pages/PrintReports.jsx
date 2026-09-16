import React, { useState, useMemo } from 'react'
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
    description: 'Complete Day 1 single-counter food distribution, 250ml water logs, daily sales portions, and operating expense ledger.',
    badge: 'Day 1 Specific',
    badgeVariant: 'gold',
    icon: Calendar,
  },
  {
    id: 'day2',
    title: 'Day 2 Operations & Financial Report',
    description: 'Complete Day 2 central kitchen yield, thermal carrier dispatch, beverage count, and daily net revenue statement.',
    badge: 'Day 2 Specific',
    badgeVariant: 'gold',
    icon: Calendar,
  },
  {
    id: 'day3',
    title: 'Day 3 Operations & Financial Report',
    description: 'Final event day food portions, single counter peak serving pass-through, daily costs, and day 3 closing ledger.',
    badge: 'Day 3 Specific',
    badgeVariant: 'gold',
    icon: Calendar,
  },
  {
    id: 'complete-3day',
    title: 'Complete 3-Day Event Report',
    description: 'Master 30,000-guest event operations audit, 3-day biryani & water consumption, total sales, expenses, and final net profit.',
    badge: 'Master Audit',
    badgeVariant: 'success',
    icon: Sparkles,
  },
  {
    id: 'financial-summary',
    title: 'Executive Financial Summary Report',
    description: 'High-level P&L statement comparing Day 1, Day 2, Day 3 and grand totals with 19 expense category distributions.',
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

export function PrintReports() {
  const toast = useToast()
  const { events, activeEventId } = useEvents()
  const { getDailyFinancials, getThreeDayFinancials } = useFinance()
  const { expenses } = useExpenses()
  const { tasks } = useTasks()

  // State
  const [selectedEventId, setSelectedEventId] = useState(activeEventId || 'evt-college-3day')
  const [activeReportId, setActiveReportId] = useState(null) // null shows directory; id shows preview

  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0]
  }, [events, selectedEventId])

  const day1Fin = useMemo(() => getDailyFinancials(selectedEventId, 1), [getDailyFinancials, selectedEventId])
  const day2Fin = useMemo(() => getDailyFinancials(selectedEventId, 2), [getDailyFinancials, selectedEventId])
  const day3Fin = useMemo(() => getDailyFinancials(selectedEventId, 3), [getDailyFinancials, selectedEventId])
  const threeDayFin = useMemo(() => getThreeDayFinancials(selectedEventId), [getThreeDayFinancials, selectedEventId])

  // Handlers
  const handleView = (reportId) => {
    setActiveReportId(reportId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrint = (reportId) => {
    setActiveReportId(reportId)
    setTimeout(() => {
      window.print()
    }, 300)
  }

  const handleDownloadPdf = (reportId) => {
    setActiveReportId(reportId)
    toast.info(
      'Download PDF Instructions',
      'In your browser print preview window, change "Destination" to "Save as PDF" and click "Save".'
    )
    setTimeout(() => {
      window.print()
    }, 400)
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
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Sparkles className="w-4 h-4 text-[#c29c5e]" />}
                onClick={() => handlePrint('complete-3day')}
              >
                Quick Print 3-Day Report
              </Button>
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
                  {PHASE12_REPORTS.find((r) => r.id === activeReportId)?.title}
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
                leftIcon={<Download className="w-3.5 h-3.5 text-[#c29c5e]" />}
                onClick={() => handleDownloadPdf(activeReportId)}
                className="text-white border-white/30 hover:bg-white/10"
              >
                Download PDF
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
            reportType={activeReportId}
            event={currentEvent}
            day1Fin={day1Fin}
            day2Fin={day2Fin}
            day3Fin={day3Fin}
            threeDayFin={threeDayFin}
            expenses={expenses}
            tasks={tasks}
          />
        </div>
      ) : (
        /* REPORTS DIRECTORY / GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PHASE12_REPORTS.map((report) => {
            const Icon = report.icon
            return (
              <Card
                key={report.id}
                className="p-5 border border-[#e2e8f0] hover:border-[#163324] hover:shadow-md transition-all flex flex-col justify-between"
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
    </div>
  )
}
