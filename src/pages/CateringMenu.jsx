import React from 'react'
import { UtensilsCrossed, Plus, BookOpen } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'

export function CateringMenu() {
  const toast = useToast()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Catering & Menu Management"
        description="Master dish catalog, traditional Kerala sadhya compositions, multi-course banquet menus, and per-head dish configurations."
        badge="50+ Catalog Items"
        badgeVariant="gold"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<BookOpen className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Menu Catalog', 'Standard packages: Malabar Feast, Traditional Sadhya, Continental Gala.')}
            >
              Preset Packages
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Dish Creator', 'Dish configuration wizard will be connected in Phase 2.')}
            >
              Add New Dish
            </Button>
          </div>
        }
      />

      <EmptyState
        icon={UtensilsCrossed}
        title="Menu & Recipe Catalog"
        description="Configure appetizers, main courses, bread stations, desserts, and traditional accompaniments. Recipe scaling and ingredient calculations will link directly into kitchen preparation."
        phase="Phase 2 Feature"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Sample Dishes', 'Signature dishes include Thalassery Biriyani, Nadan Mutton Roast, and Chemmeen Fry.')}
          >
            Browse Signature Dishes
          </Button>
        }
      />
    </div>
  )
}

