import React from 'react'
import { ChefHat, Flame, CalendarClock } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'

export function FoodPreparation() {
  const toast = useToast()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Food Preparation & Kitchen Operations"
        description="Central kitchen cooking schedules, batch timers, chef line assignments, and quality check verification."
        badge="Active Kitchen"
        badgeVariant="success"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<CalendarClock className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Kitchen Milestones', 'Morning prep round initiated at 06:00 AM.')}
            >
              Batch Timetable
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Flame className="w-3.5 h-3.5 text-[#c29c5e]" />}
              onClick={() => toast.info('New Batch', 'Batch initialization modal will link to kitchen displays in Phase 2.')}
            >
              Start Cooking Batch
            </Button>
          </div>
        }
      />

      <EmptyState
        icon={ChefHat}
        title="Kitchen Cooking Schedules"
        description="Monitor large cauldrons, biriyani dum timelines, gravies, and fry stations in real time. Kitchen line display and chef assignment flows will be initialized in Phase 2."
        phase="Phase 2 Feature"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Kitchen Stations', 'Stations: Rice/Biriyani, Tawa/Fry, Curries/Gravy, Breads, Sweets/Desserts.')}
          >
            View Kitchen Station Map
          </Button>
        }
      />
    </div>
  )
}

