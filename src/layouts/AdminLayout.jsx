import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileNav } from './MobileNav'
import { ToastProvider, useToast } from '../components/ui/ToastContext'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { useDisclosure } from '../hooks/useDisclosure'

function AdminLayoutInner() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const quickActionModal = useDisclosure(false)
  const toast = useToast()

  // Form state for quick modal demo
  const [quickTitle, setQuickTitle] = useState('')
  const [quickCategory, setQuickCategory] = useState('Kitchen Prep')
  const [quickPriority, setQuickPriority] = useState('Normal')

  useEffect(() => {
    const handleToggleNav = () => {
      setIsMobileNavOpen((prev) => !prev)
    }
    window.addEventListener('toggle-mobile-nav', handleToggleNav)
    return () => window.removeEventListener('toggle-mobile-nav', handleToggleNav)
  }, [])

  const handleSaveQuickAction = (e) => {
    e.preventDefault()
    if (!quickTitle.trim()) {
      toast.warning('Input Required', 'Please enter a description for this operational task.')
      return
    }

    toast.success(
      'Operational Task Recorded',
      `"${quickTitle}" has been logged under ${quickCategory} with ${quickPriority} priority.`
    )
    setQuickTitle('')
    quickActionModal.close()
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Mobile Drawer Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onOpenQuickAction={quickActionModal.open}
        />

        {/* Scrollable Page Container (with bottom padding for mobile bar) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Reusable Quick Action / Operational Task Modal */}
      <Modal
        isOpen={quickActionModal.isOpen}
        onClose={quickActionModal.close}
        title="Log Event Operational Task"
        description="Quickly record an on-ground requirement, kitchen instruction, or logistics notice."
        size="md"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={quickActionModal.close}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveQuickAction}
            >
              Save Operational Task
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveQuickAction} className="space-y-4">
          <Input
            label="Task / Instruction Description"
            placeholder="e.g., Replenish hot water dispenser at VIP dining counter 1"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            autoFocus
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Operations Category"
              value={quickCategory}
              onChange={(e) => setQuickCategory(e.target.value)}
              options={[
                { label: 'Kitchen Preparation', value: 'Kitchen Prep' },
                { label: 'Food Packing & Staging', value: 'Food Packing' },
                { label: 'Buffet Distribution', value: 'Buffet Distribution' },
                { label: 'Water & Beverages', value: 'Water Management' },
                { label: 'Chafing / Crockery Arrangements', value: 'Arrangements' },
                { label: 'Staff & Stewards', value: 'Staff Roster' },
              ]}
            />

            <Select
              label="Priority Level"
              value={quickPriority}
              onChange={(e) => setQuickPriority(e.target.value)}
              options={[
                { label: 'High (Immediate Action)', value: 'High' },
                { label: 'Normal (Standard Schedule)', value: 'Normal' },
                { label: 'Low (Wrap-up / Post-Service)', value: 'Low' },
              ]}
            />
          </div>

          <p className="text-[11px] text-[#64748b]">
            This task will be synced to the on-site operations board for the active event.
          </p>
        </form>
      </Modal>
    </div>
  )
}

export function AdminLayout() {
  return (
    <ToastProvider>
      <AdminLayoutInner />
    </ToastProvider>
  )
}

