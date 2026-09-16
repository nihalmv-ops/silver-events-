import React from 'react'
import { BarChart3, Download, Calendar } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'

export function Reports() {
  const toast = useToast()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations & Post-Event Reports"
        description="Comprehensive post-service analyses, food consumption accuracy, wastage audits, kitchen timing logs, and staff performance metrics."
        badge="Analytics"
        badgeVariant="primary"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Calendar className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Date Range', 'Select monthly, seasonal, or per-venue reporting period in Phase 2.')}
            >
              Select Season
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Report Export', 'Post-event debrief report generator connects in Phase 2.')}
            >
              Generate Debrief
            </Button>
          </div>
        }
      />

      <EmptyState
        icon={BarChart3}
        title="Operations Analytics & Debrief Reports"
        description="Evaluate per-pax food consumption patterns, chef batch turnaround timings, buffer stock variance, and service satisfaction scores."
        phase="Phase 2 Feature"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('KPI Metrics', 'Key indicators: Buffer food wastage < 3.5%, On-time buffet start 99.4%.')}
          >
            Explore Catering KPIs
          </Button>
        }
      />
    </div>
  )
}

