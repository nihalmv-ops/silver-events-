import React, { useState } from 'react'
import { Printer, FileText, Download, CheckCircle2, Truck, ChefHat, Package, Users, ShieldAlert } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'
import { useEvents } from '../context/EventContext'
import { ReportHeader } from '../components/reports/ReportHeader'
import { ReportFooter } from '../components/reports/ReportFooter'

const PRINTOUT_TEMPLATES = [
  {
    id: 'kitchen-sheet',
    title: 'Master Kitchen Cooking & Dum Batch Sheet',
    desc: 'Ingredient scaling, dum pot firing schedules, meat marination milestones, and chef shift logs.',
    icon: ChefHat,
    color: 'text-orange-700',
  },
  {
    id: 'packing-tags',
    title: 'Food Packaging & Insulated Hot-Box Slips',
    desc: 'Batch thermal tags, meal box container tallies, seal audit sign-offs, and dispatch times.',
    icon: Package,
    color: 'text-purple-700',
  },
  {
    id: 'gate-pass',
    title: 'Vehicle Convoy & Transport Gate Pass',
    desc: 'Refrigerated shuttle truck registration, driver dispatch sign-off, and security clearance pass.',
    icon: Truck,
    color: 'text-blue-700',
  },
  {
    id: 'counter-sheet',
    title: 'ONE Distribution Counter Hourly Tally Sheet',
    desc: 'Single counter serving logs, 100-container counter staging vouchers, and marshal queue reports.',
    icon: FileText,
    color: 'text-emerald-700',
  },
  {
    id: 'staff-muster',
    title: 'Daily Staff & Steward Attendance Muster Roll',
    desc: 'Official 12-role attendance sheet with morning roll call, signature blocks, and wage receipts.',
    icon: Users,
    color: 'text-indigo-700',
  },
]

export function Printouts() {
  const toast = useToast()
  const { events, activeEventId } = useEvents()
  const [selectedEventId, setSelectedEventId] = useState(activeEventId || 'evt-college-3day')
  const [activePrintout, setActivePrintout] = useState(null)

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0]

  const handlePrint = (template) => {
    setActivePrintout(template)
    setTimeout(() => {
      window.print()
    }, 250)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kitchen & Dispatch Operational Printouts"
        description="High-contrast, A4 print-ready sheets designed for central kitchen chefs, packing lines, shuttle drivers, and distribution counter captains."
        badge="A4 Print Sheets"
        badgeVariant="gold"
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Printer className="w-4 h-4" />}
            onClick={() => handlePrint(PRINTOUT_TEMPLATES[0])}
          >
            Quick Print Kitchen Sheet
          </Button>
        }
      />

      <div className="p-3.5 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-xs text-[#92400e] flex items-center gap-2.5">
        <ShieldAlert className="w-4 h-4 shrink-0 text-[#d97706]" />
        <span>
          <strong>Operational Print Engine:</strong> Standardized A4 documents for field operations. All prints automatically hide web navigation and sidebars.
        </span>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRINTOUT_TEMPLATES.map((tmpl) => {
          const Icon = tmpl.icon
          return (
            <div
              key={tmpl.id}
              className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-xs hover:border-[#163324] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                    <Icon className={`w-5 h-5 ${tmpl.color}`} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#475569]">
                    A4 Printable
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#0f172a]">{tmpl.title}</h4>
                <p className="text-xs text-[#64748b] mt-1.5 leading-relaxed">{tmpl.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                  onClick={() => handlePrint(tmpl)}
                >
                  Print Sheet
                </Button>
                <span className="text-[10px] text-[#94a3b8]">210 × 297 mm</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Hidden container that populates on print */}
      {activePrintout && (
        <div className="hidden print:block a4-print-sheet p-8 text-xs text-[#0f172a]">
          <ReportHeader
            reportTitle={activePrintout.title}
            reportSubtitle={activePrintout.desc}
            event={currentEvent}
          />
          <div className="py-4 space-y-4">
            <div className="p-3 bg-[#f8fafc] border rounded">
              <span className="text-[10px] uppercase font-bold text-[#64748b] block mb-1">
                Field Inspection & Logistics Checkpoints
              </span>
              <p className="text-xs">
                Generated specifically for execution of {currentEvent?.eventName} through ONE central serving point. All food containers and hydration items must be signed off by designated zone captains.
              </p>
            </div>
          </div>
          <ReportFooter notes="Verified operational printout generated from Silver Catering internal system." />
        </div>
      )}
    </div>
  )
}
