import React from 'react'

export function ReportFooter({ notes }) {
  return (
    <div className="mt-8 pt-4 border-t-2 border-[#cbd5e1] text-xs space-y-6 avoid-page-break">
      {notes && (
        <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
          <span className="text-[10px] uppercase font-bold text-[#64748b] block mb-1">
            Operational Audit & Notes
          </span>
          <p className="text-xs text-[#334155] leading-relaxed italic">{notes}</p>
        </div>
      )}

      {/* Signature Authorization Block */}
      <div className="grid grid-cols-3 gap-6 pt-4 text-center">
        <div className="border-t border-[#94a3b8] pt-2">
          <span className="text-[10px] uppercase font-bold text-[#64748b] block">
            Operations Manager
          </span>
          <span className="text-xs font-semibold text-[#0f172a] block mt-0.5">
            Silver Catering Admin
          </span>
          <span className="text-[9px] text-[#94a3b8]">Verified & Approved</span>
        </div>

        <div className="border-t border-[#94a3b8] pt-2">
          <span className="text-[10px] uppercase font-bold text-[#64748b] block">
            Kitchen & Dispatch Head
          </span>
          <span className="text-xs font-semibold text-[#0f172a] block mt-0.5">
            Production Supervisor
          </span>
          <span className="text-[9px] text-[#94a3b8]">Food Quality & Yield Cleared</span>
        </div>

        <div className="border-t border-[#94a3b8] pt-2">
          <span className="text-[10px] uppercase font-bold text-[#64748b] block">
            Counter & Distribution Marshal
          </span>
          <span className="text-xs font-semibold text-[#0f172a] block mt-0.5">
            Single Counter Lead
          </span>
          <span className="text-[9px] text-[#94a3b8]">Distribution Complete</span>
        </div>
      </div>

      {/* Bottom Confidentiality Disclaimer */}
      <div className="flex items-center justify-between text-[9px] text-[#94a3b8] pt-2 border-t border-[#f1f5f9]">
        <span>
          SILVER CATERING — Internal Administration & Operations Management System
        </span>
        <span>
          Strictly Confidential — No Customer Invoicing / No Billing Document
        </span>
      </div>
    </div>
  )
}
