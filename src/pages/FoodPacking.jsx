import React from 'react'
import { PackageCheck, QrCode, ClipboardCheck } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'

export function FoodPacking() {
  const toast = useToast()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Food Packing & Thermal Staging"
        description="Insulated container packaging, temperature logging, security seals, and carrier box labeling."
        badge="Staging Area"
        badgeVariant="info"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<QrCode className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Container Scanning', 'Thermal box barcode / QR scanner activates in Phase 2.')}
            >
              Scan Box
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<ClipboardCheck className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Dispatch Sign-off', 'Digital packaging sign-off flow will be linked in Phase 2.')}
            >
              Sign-off Packaging
            </Button>
          </div>
        }
      />

      <EmptyState
        icon={PackageCheck}
        title="Packaging & Insulated Carrier Staging"
        description="Track thermal hot-boxes, food safety seal numbers, temperature at packing, and dispatch staging zones. Barcode/tag verification will connect during Phase 2."
        phase="Phase 2 Feature"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Checklist', 'Standard packaging checklists ensure food remains >65°C upon venue delivery.')}
          >
            Review Temperature Standards
          </Button>
        }
      />
    </div>
  )
}

