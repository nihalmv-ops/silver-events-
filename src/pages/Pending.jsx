import React from 'react'
import { ClockAlert, AlertTriangle, CheckCheck } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'

export function Pending() {
  const toast = useToast()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Actions & Critical Alerts"
        description="Urgent event day bottlenecks, missing ingredient requisitions, delayed carrier trucks, and supervisor approvals."
        badge="4 Urgent Alerts"
        badgeVariant="warning"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<CheckCheck className="w-3.5 h-3.5" />}
              onClick={() => toast.success('Acknowledge All', 'All critical alerts marked as acknowledged by Shift Lead.')}
            >
              Acknowledge All
            </Button>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<AlertTriangle className="w-3.5 h-3.5" />}
              onClick={() => toast.warning('Escalate Alert', 'Urgent issue escalated to General Manager.')}
            >
              Escalate Issue
            </Button>
          </div>
        }
      />

      <EmptyState
        icon={ClockAlert}
        title="Pending Actions & Escalations"
        description="Time-sensitive operational hold-ups are surfaced here to protect event delivery timelines. Automated escalation rules will link directly to SMS/WhatsApp in Phase 2."
        phase="Phase 2 Feature"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Escalation Matrix', 'Priority levels: High (15 min response), Medium (45 min response), Low (2 hr response).')}
          >
            Review Escalation Matrix
          </Button>
        }
      />
    </div>
  )
}

