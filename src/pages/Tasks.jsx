import React from 'react'
import { CheckSquare, Plus, ListFilter } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'

export function Tasks() {
  const toast = useToast()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations Task Board"
        description="Event day operational checklists, kitchen prep tasks, setup handoffs, and breakdown responsibilities."
        badge="Live Checklists"
        badgeVariant="primary"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ListFilter className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Task Filter', 'Filter by Venue, Kitchen, or Transport stages.')}
            >
              Filter Tasks
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Create Task', 'Use Quick Action in topbar or full task creator in Phase 2.')}
            >
              Add Operations Task
            </Button>
          </div>
        }
      />

      <EmptyState
        icon={CheckSquare}
        title="Event Operations Task Board"
        description="Synchronize tasks between event managers, head chefs, transport drivers, and hall captains. Real-time board statuses and completion stamps activate in Phase 2."
        phase="Phase 2 Feature"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Checklist Templates', 'Templates available: Wedding Day Master, Sadhya Service, High Tea Corporate.')}
          >
            Load Checklist Template
          </Button>
        }
      />
    </div>
  )
}

