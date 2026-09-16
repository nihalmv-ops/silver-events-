import React from 'react'
import { Utensils } from 'lucide-react'

export function ReportHeader({
  reportTitle,
  reportSubtitle,
  event,
  generatedDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }),
}) {
  return (
    <div className="border-b-2 border-[#163324] pb-4 mb-5">
      {/* Brand Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#163324] text-[#c29c5e] flex items-center justify-center font-bold text-xl border border-[#c29c5e]/40 shrink-0">
            <Utensils className="w-6 h-6 text-[#c29c5e]" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wider text-[#163324] font-serif uppercase">
              SILVER CATERING
            </h1>
            <p className="text-[11px] font-semibold tracking-widest text-[#64748b] uppercase">
              Event Administration & Operations
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#163324] text-[#dfbe82]">
            Official Operations Document
          </span>
          <div className="text-[10px] text-[#64748b] mt-1">
            Generated: <strong className="text-[#0f172a]">{generatedDate}</strong>
          </div>
        </div>
      </div>

      {/* Report Title */}
      <div className="mt-4 pt-3 border-t border-[#e2e8f0] flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-[#0f172a] tracking-tight uppercase">
            {reportTitle}
          </h2>
          {reportSubtitle && (
            <p className="text-xs text-[#64748b] mt-0.5">{reportSubtitle}</p>
          )}
        </div>
        <div className="text-right text-[11px] font-mono text-[#475569]">
          DOC-REF: SC-{event?.id?.replace('evt-', '').toUpperCase() || 'GEN'}-{new Date().getFullYear()}
        </div>
      </div>

      {/* Event Details Grid */}
      <div className="mt-3 p-3 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-[10px] text-[#64748b] uppercase font-bold block">Event Name</span>
          <strong className="text-[#0f172a] block truncate">
            {event?.eventName || event?.name || 'National Tech Fest 2026'}
          </strong>
        </div>
        <div>
          <span className="text-[10px] text-[#64748b] uppercase font-bold block">Client</span>
          <span className="text-[#0f172a] block truncate">
            {event?.clientName || 'MES Engineering College'}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[#64748b] uppercase font-bold block">Venue</span>
          <span className="text-[#0f172a] block truncate">
            {event?.venue || 'Campus Main Ground, Perinthalmanna'}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[#64748b] uppercase font-bold block">Event Dates</span>
          <span className="text-[#0f172a] block truncate">
            {event?.startDate || '2026-03-20'} to {event?.endDate || '2026-03-22'} ({event?.numberOfDays || 3} Days)
          </span>
        </div>
      </div>
    </div>
  )
}
