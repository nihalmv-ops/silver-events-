import React from 'react'
import { ReceiptText, Plus, PieChart, ShieldAlert } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { useToast } from '../components/ui/ToastContext'

export function Expenses() {
  const toast = useToast()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Internal Operational Expenses"
        description="Track on-site operations spending: transport diesel, dry ice blocks, temporary service stewards, emergency market supplies, and LPG fuel."
        badge="Internal Costs Only"
        badgeVariant="gold"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<PieChart className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Cost Categories', 'Categories: Fuel, Ice & Perishables, Temp Crew, LPG Gas, Kitchen Disposables.')}
            >
              Expense Categories
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => toast.info('Log Expense', 'Internal petty cash & operations expense logging module connects in Phase 2.')}
            >
              Log Operations Expense
            </Button>
          </div>
        }
      />

      <div className="p-3.5 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-xs text-[#92400e] flex items-center gap-2.5">
        <ShieldAlert className="w-4 h-4 shrink-0 text-[#d97706]" />
        <span>
          <strong>Operational Notice:</strong> This module strictly logs internal event execution costs (fuel, ice, day labor). It does not handle customer invoicing, sales POS, or customer billing collections.
        </span>
      </div>

      <EmptyState
        icon={ReceiptText}
        title="Internal Operations Cost Register"
        description="Log and reconcile day-of-event cash vouchers, driver fuel slips, ice replenishment receipts, and emergency market purchases per event."
        phase="Phase 2 Feature"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info('Sample Log', 'Today logged: ₹48,500 across transport, dry ice, and temporary stewards.')}
          >
            View Sample Cost Breakdown
          </Button>
        }
      />
    </div>
  )
}

