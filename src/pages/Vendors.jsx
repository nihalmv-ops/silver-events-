import React from 'react'
import { Store, Plus, PhoneCall } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'

export function Vendors() {
  const toast = useToast()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendors & Supplier Directory"
        description="Wholesale spice merchants, fresh vegetable markets, poultry & seafood dealers, dairy farms, and disposable leaf suppliers."
        badge="Approved Suppliers"
        badgeVariant="primary"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<PhoneCall className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Emergency Contacts', 'Key suppliers: Calicut Spices Ltd, Malabar Poultry, Ernakulam Dairy Coop.')}
            >
              Supplier Contacts
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Vendor Onboarding', 'Vendor registration module connects in Phase 2.')}
            >
              Register Supplier
            </Button>
          </div>
        }
      />

      <EmptyState
        icon={Store}
        title="Supplier Directory & Quality Audits"
        description="Maintain procurement rate cards, contact numbers, order lead times, and quality ratings for bulk raw ingredients across Kerala."
        phase="Phase 2 Feature"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Supplier Categories', 'Categories: Spices/Oils, Fresh Meat, Seafood, Vegetables, Dairy, Bakery, Disposables.')}
          >
            Explore Supplier Categories
          </Button>
        }
      />
    </div>
  )
}

