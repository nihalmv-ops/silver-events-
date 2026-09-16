import React from 'react'
import { CalendarDays, Plus, Filter } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'

export function Events() {
  const toast = useToast()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events Administration"
        description="Comprehensive master schedule of weddings, sadhyas, corporate dinners, and intimate catering functions."
        badge="148 Total"
        badgeVariant="primary"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Filter className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Filters', 'Filtering options will be active in Phase 2.')}
            >
              Filter Events
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => toast.info('New Event', 'Event creation workflow will be connected in Phase 2.')}
            >
              Schedule New Event
            </Button>
          </div>
        }
      />

      <EmptyState
        icon={CalendarDays}
        title="Event Master Schedule"
        description="Here you will be able to manage client bookings, venue logistics, guest headcount, and service schedules. Event management data models will be activated in the upcoming phase."
        phase="Phase 2 Feature"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Preview', 'Master event calendar preview mode is staged.')}
          >
            Explore Event Schema
          </Button>
        }
      />
    </div>
  )
}

