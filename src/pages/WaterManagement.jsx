import React from 'react'
import { Droplets, Plus, ShieldCheck } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'

export function WaterManagement() {
  const toast = useToast()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Water Management & Hydration Stations"
        description="Drinking water dispensaries, mineral water carton allocations, ice block stock, and VIP dining beverage logistics."
        badge="2,800 Units Allocated"
        badgeVariant="info"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Quality Assurance', 'Purified RO water test verified at site 11:30 AM.')}
            >
              Quality Certification
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Water Requisition', 'Water inventory dispatch requisition form opens in Phase 2.')}
            >
              Add Water Stock
            </Button>
          </div>
        }
      />

      <EmptyState
        icon={Droplets}
        title="Water & Ice Allocation Logs"
        description="Oversee consumption of 250ml guest bottles, 20-liter bubble top dispensers, welcome drink ice reserves, and dining hall water pitchers."
        phase="Phase 2 Feature"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Hydration Targets', 'Standard allocation: 2.2 bottles per expected guest + emergency reserve 20%.')}
          >
            Review Allocation Formula
          </Button>
        }
      />
    </div>
  )
}

