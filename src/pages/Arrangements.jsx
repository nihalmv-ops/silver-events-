import React from 'react'
import { Layers, LayoutTemplate, Plus } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'

export function Arrangements() {
  const toast = useToast()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Arrangements & On-Site Setup"
        description="Buffet counter layout planning, chaffing warmers, chinaware, cutlery, table linen, and handwash staging."
        badge="Venue Staging"
        badgeVariant="gold"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<LayoutTemplate className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Layout Blueprints', 'Venue layout blueprints are configured during event onboarding.')}
            >
              Floor Plan Blueprint
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Equipment Requisition', 'Equipment checklist wizard connects in Phase 2.')}
            >
              Add Equipment Staging
            </Button>
          </div>
        }
      />

      <EmptyState
        icon={Layers}
        title="On-Site Staging & Equipment Checklist"
        description="Verify counts for silver roll-top chafing dishes, soup urns, dessert bowls, brass lamps, and banana leaf dining setups before guest arrival."
        phase="Phase 2 Feature"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Inventory Standard', 'Standard 1,000 pax layout includes 12 chafers, 1,200 plates, and 4 beverage urns.')}
          >
            Check Equipment Ratio Table
          </Button>
        }
      />
    </div>
  )
}

