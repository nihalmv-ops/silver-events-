import React from 'react'
import { Users, UserPlus, BadgeCheck } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'

export function Staff() {
  const toast = useToast()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff & Service Captains Roster"
        description="Event operations leads, head chefs, station cooks, buffet captains, table stewards, and logistics drivers."
        badge="42 Crew Active Today"
        badgeVariant="success"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<BadgeCheck className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Attendance Briefing', 'Morning roll call at venue completed with 100% presence.')}
            >
              Verify Attendance
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<UserPlus className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Staff Onboarding', 'Staff allocation and role assignment modules activate in Phase 2.')}
            >
              Assign Crew Member
            </Button>
          </div>
        }
      />

      <EmptyState
        icon={Users}
        title="Staff Rosters & Role Assignments"
        description="Manage service shifts, captain allocations per buffet wing, uniform checks, hygiene certifications, and steward headcounts."
        phase="Phase 2 Feature"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Hierarchy', 'Roster hierarchy: Event Manager -> Operations Captains -> Line Cooks & Stewards.')}
          >
            Review Operations Roles
          </Button>
        }
      />
    </div>
  )
}

