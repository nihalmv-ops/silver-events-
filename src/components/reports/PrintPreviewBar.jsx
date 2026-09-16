import React from 'react'
import { ArrowLeft, Printer, Download, FileText, Calendar, Building2 } from 'lucide-react'
import { Button } from '../ui/Button'
import { REPORT_TYPES } from './ReportTemplates'

export function PrintPreviewBar({
  selectedReportId,
  onSelectReport,
  events,
  selectedEventId,
  onSelectEvent,
  selectedDay,
  onSelectDay,
  onBack,
  onPrint,
  onDownloadPdf,
}) {
  const currentReport = REPORT_TYPES.find((r) => r.id === selectedReportId) || REPORT_TYPES[0]

  return (
    <div className="no-print p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left controls: Back & Dropdown selectors */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={onBack}
        >
          Back to Reports
        </Button>

        {/* Report Selector Dropdown */}
        <div className="relative">
          <select
            value={selectedReportId}
            onChange={(e) => onSelectReport(e.target.value)}
            className="pl-3 pr-8 py-1.5 text-xs font-bold text-[#163324] bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324] cursor-pointer"
          >
            {REPORT_TYPES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Event Selector */}
        <div className="relative hidden sm:block">
          <select
            value={selectedEventId}
            onChange={(e) => onSelectEvent(e.target.value)}
            className="pl-3 pr-8 py-1.5 text-xs font-semibold text-[#0f172a] bg-[#f8fafc] border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324] cursor-pointer"
          >
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.eventName}
              </option>
            ))}
          </select>
        </div>

        {/* Day Selector */}
        <div className="flex items-center gap-1 p-1 bg-[#f1f5f9] rounded-lg text-xs">
          {['All', 1, 2, 3].map((d) => (
            <button
              key={d}
              onClick={() => onSelectDay(d)}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                selectedDay === d
                  ? 'bg-[#163324] text-white shadow-2xs'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              {d === 'All' ? 'All Days' : `Day ${d}`}
            </button>
          ))}
        </div>
      </div>

      {/* Right controls: Print & Download PDF */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Download className="w-4 h-4 text-[#163324]" />}
          onClick={onDownloadPdf}
        >
          Download PDF
        </Button>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Printer className="w-4 h-4 text-[#c29c5e]" />}
          onClick={onPrint}
        >
          Print A4 Report
        </Button>
      </div>
    </div>
  )
}
