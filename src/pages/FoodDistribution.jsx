import React from 'react'
import { Truck, Navigation, RefreshCw } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'

export function FoodDistribution() {
  const toast = useToast()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Food Distribution & Buffet Logistics"
        description="Transport fleet tracking, venue delivery staging, buffet counter replenishment, and live counter distribution."
        badge="Active Dispatch"
        badgeVariant="success"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Navigation className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Fleet Dispatch', 'Vehicles 1 & 2 arrived at Grand Hyatt Kochi.')}
            >
              Track Fleet
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Replenish Trigger', 'Counter replenishment alert sent to catering captain.')}
            >
              Request Replenishment
            </Button>
          </div>
        }
      />

      <EmptyState
        icon={Truck}
        title="Distribution & Buffet Counter Logs"
        description="Ensure seamless replenishment between central kitchen transport vehicles and venue dining halls. Monitor buffet counter fuel, food levels, and serving rounds."
        phase="Phase 2 Feature"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Distribution Rules', 'Each counter is assigned 1 senior captain and 3 servers for continuous refill.')}
          >
            Counter Allocation Guidelines
          </Button>
        }
      />
    </div>
  )
}

