import React from 'react'
import { Settings as SettingsIcon, Save, Sliders, Shield } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'

export function Settings() {
  const toast = useToast()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & System Configuration"
        description="Central kitchen profiles, default pax calculation formulas, thermal packaging guidelines, and notification preferences."
        badge="System Admin"
        badgeVariant="primary"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Sliders className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Default Values', 'Default buffer percentage: +5% on main courses, +10% on rice/biriyani.')}
            >
              Catering Parameters
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Save className="w-3.5 h-3.5" />}
              onClick={() => toast.success('Settings Saved', 'System operational configurations updated successfully.')}
            >
              Save Configuration
            </Button>
          </div>
        }
      />

      <EmptyState
        icon={SettingsIcon}
        title="Organization & Kitchen Settings"
        description="Configure multi-kitchen operations, storage temperatures, vehicle fleet specifications, and staff access roles. Enterprise settings sync in Phase 2."
        phase="Phase 2 Feature"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Organization Profile', 'Silver Catering — Kerala Central Kitchen Hub & Fleet.')}
          >
            Inspect Organization Profile
          </Button>
        }
      />
    </div>
  )
}

