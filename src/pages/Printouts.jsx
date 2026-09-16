import React from 'react'
import { Printer, FileText, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'

export function Printouts() {
  const toast = useToast()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kitchen & Dispatch Printouts"
        description="Print-ready operational documents: kitchen batch prep sheets, insulated box packing tags, vehicle transport gate passes, and captain checklists."
        badge="Operations Sheets"
        badgeVariant="gold"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FileText className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Sheet Templates', 'Templates: Master Kitchen Sheet, Gate Pass, Buffet Counter Checklist.')}
            >
              Document Templates
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Printer className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Print Queue', 'Print engine will be linked in Phase 2 for one-click hardcopy output.')}
            >
              Print Today's Sheets
            </Button>
          </div>
        }
      />

      <EmptyState
        icon={Printer}
        title="Operational Printout Center"
        description="Generate high-contrast, waterproof-friendly print templates designed specifically for kitchen staff, logistics drivers, and floor captains during live service."
        phase="Phase 2 Feature"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Layout Info', 'Print sheets are formatted for standard A4 and thermal carrier tags.')}
          >
            Review Print Layout Formats
          </Button>
        }
      />
    </div>
  )
}

