import React, { useState, useMemo } from 'react'
import {
  PackageCheck,
  PackageMinus,
  AlertTriangle,
  Clock,
  Plus,
  Minus,
  Edit2,
  Box,
  Layers,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  QrCode,
  Truck,
  ArrowRight,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { FoodPackingModal } from '../components/kitchen/FoodPackingModal'
import { useEvents } from '../hooks/useEvents'
import { formatNumber } from '../utils/formatters'
import { useToast } from '../components/ui/ToastContext'

export function FoodPacking() {
  const toast = useToast()
  const {
    events,
    updateFoodPacking,
    adjustPackedContainers,
    adjustDamagedContainers,
    updateBatch,
  } = useEvents()

  // Selected event & day
  const [selectedEventId, setSelectedEventId] = useState(
    events[0]?.id || 'evt-college-3day'
  )
  const [selectedDayNumber, setSelectedDayNumber] = useState(1)

  // Packing modal
  const [isPackingModalOpen, setIsPackingModalOpen] = useState(false)

  // Step increment selection for fast mobile operations
  const [activeStep, setActiveStep] = useState(1)

  // Current event & day
  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0] || {}
  }, [events, selectedEventId])

  const eventDays = currentEvent?.days || []
  const currentDay = useMemo(() => {
    return eventDays.find((d) => d.dayNumber === selectedDayNumber) || eventDays[0] || {}
  }, [eventDays, selectedDayNumber])

  // Extract foodPacking data with fallbacks
  const foodPacking = currentDay.foodPacking || {
    requiredContainers: Math.ceil((currentDay.expectedGuests || 10000) / 50),
    packedContainers: currentDay.foodPacked ? Math.ceil(currentDay.foodPacked / 50) : 0,
    damagedContainers: 0,
    containerType: 'Insulated Thermal Hot-Box (50 Pax)',
  }

  const requiredContainers = Number(foodPacking.requiredContainers) || 200
  const packedContainers = Number(foodPacking.packedContainers) || 0
  const damagedContainers = Number(foodPacking.damagedContainers) || 0
  const containerType = foodPacking.containerType || 'Insulated Thermal Hot-Box (50 Pax)'

  // Automatic calculation of Remaining Containers
  const remainingContainers = Math.max(0, requiredContainers - packedContainers)

  // Packaging progress
  const packingPct = requiredContainers > 0
    ? Math.min(100, Math.round((packedContainers / requiredContainers) * 100))
    : 0

  // Batches for this day
  const batches = currentDay.batches || []

  // Quick Action Handlers for Fast Mobile Floor Operations
  const handleAddPacked = (amount) => {
    adjustPackedContainers(currentEvent.id, currentDay.dayNumber, amount)
    toast.success('Containers Packed', `+${amount} packed (${packedContainers + amount}/${requiredContainers})`)
  }

  const handleCorrection = (amount) => {
    if (packedContainers <= 0) {
      toast.warning('Zero Containers', 'Packed container tally is already zero.')
      return
    }
    const safeDecrement = -Math.min(packedContainers, amount)
    adjustPackedContainers(currentEvent.id, currentDay.dayNumber, safeDecrement)
    toast.info('Correction Applied', `${safeDecrement} container tally adjustment recorded.`)
  }

  const handleAddDamaged = (amount) => {
    adjustDamagedContainers(currentEvent.id, currentDay.dayNumber, amount)
    toast.warning('Damaged Container', `+${amount} damaged container logged.`)
  }

  const handleSavePackingModal = (data) => {
    updateFoodPacking(currentEvent.id, currentDay.dayNumber, data)
    toast.success('Packing Quotas Saved', 'Container specifications and tallies updated.')
  }

  const handleMarkBatchPacked = (batch) => {
    updateBatch(currentEvent.id, currentDay.dayNumber, batch.id, {
      packingStatus: 'Packed',
      readyStatus: 'Ready',
    })
    toast.success(`${batch.batchNumber} Packed`, 'Batch marked as packed in thermal hot-boxes.')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Food Packing & Container Operations"
        description="Insulated thermal container packaging, damage logging, and fast floor tap counting."
        badge={packingPct === 100 ? 'Packaging Complete' : `${packingPct}% Packed`}
        badgeVariant={packingPct === 100 ? 'success' : 'info'}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit2 className="w-3.5 h-3.5" />}
              onClick={() => setIsPackingModalOpen(true)}
            >
              Configure Containers
            </Button>
          </div>
        }
      />

      {/* Event & Day Selection Bar */}
      <Card className="p-4 bg-gradient-to-r from-[#163324]/5 to-transparent border border-[#163324]/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-xs font-semibold text-[#163324] uppercase tracking-wider whitespace-nowrap">
              Select Event:
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value)
                setSelectedDayNumber(1)
              }}
              className="px-3.5 py-2 rounded-lg border border-[#cbd5e1] bg-white text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324] shadow-sm max-w-md"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name} ({formatNumber(evt.totalExpectedGuests)} Pax)
                </option>
              ))}
            </select>
          </div>

          {/* Day Switcher Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mr-1">
              Day:
            </span>
            {eventDays.map((d) => {
              const isSelected = d.dayNumber === selectedDayNumber
              return (
                <button
                  key={d.dayNumber}
                  onClick={() => setSelectedDayNumber(d.dayNumber)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#163324] text-[#d4af37] shadow-sm'
                      : 'bg-white text-[#475569] hover:bg-[#f1f5f9] border border-[#e2e8f0]'
                  }`}
                >
                  <span>Day {d.dayNumber}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#f1f5f9] text-[#64748b]'}`}>
                    {formatNumber(d.expectedGuests)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </Card>

      {/* 4 Core Food Packing Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Required Containers */}
        <Card className="p-4 space-y-2 border-l-4 border-l-[#163324]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              Required Containers
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#163324]/10 text-[#163324] flex items-center justify-center">
              <Box className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#0f172a] font-sans">
            {formatNumber(requiredContainers)}
          </p>
          <p className="text-[11px] text-[#64748b] truncate">
            {containerType}
          </p>
        </Card>

        {/* 2. Packed Containers */}
        <Card className="p-4 space-y-2 border-l-4 border-l-[#059669]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              Packed Containers
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#059669] font-sans">
            {formatNumber(packedContainers)}
          </p>
          <p className="text-[11px] text-[#059669] font-medium">
            {packingPct}% packaging completed
          </p>
        </Card>

        {/* 3. Damaged Containers */}
        <Card className="p-4 space-y-2 border-l-4 border-l-[#dc2626]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              Damaged Containers
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#fef2f2] text-[#dc2626] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#dc2626] font-sans">
            {formatNumber(damagedContainers)}
          </p>
          <p className="text-[11px] text-[#64748b]">
            {damagedContainers === 0 ? 'No container leakage/damage' : 'Broken latches or seals'}
          </p>
        </Card>

        {/* 4. Remaining Containers (Auto Calculated) */}
        <Card className="p-4 space-y-2 border-l-4 border-l-[#0284c7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              Remaining Containers
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#f0f9ff] text-[#0284c7] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-[#0284c7] font-sans">
            {formatNumber(remainingContainers)}
          </p>
          <p className="text-[11px] text-[#64748b]">
            Auto calculated (`Required - Packed`)
          </p>
        </Card>
      </div>

      {/* FAST MOBILE PACKING CONSOLE */}
      <Card className="p-6 bg-white border-2 border-[#163324]/20 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#f1f5f9]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#059669] animate-pulse" />
              <h3 className="text-base font-bold text-[#0f172a]">
                Fast Floor Packing Console — Mobile Optimized
              </h3>
            </div>
            <p className="text-xs text-[#64748b]">
              Large touch targets engineered for packing floor stewards, gloves, and zero latency.
            </p>
          </div>

          {/* Quick Increment Presets */}
          <div className="flex items-center gap-1.5 bg-[#f8fafc] p-1.5 rounded-xl border border-[#e2e8f0]">
            <span className="text-[11px] font-semibold text-[#64748b] px-2">
              Step:
            </span>
            {[1, 5, 10, 25].map((step) => (
              <button
                key={step}
                onClick={() => setActiveStep(step)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeStep === step
                    ? 'bg-[#163324] text-[#d4af37] shadow-sm'
                    : 'text-[#475569] hover:bg-[#e2e8f0]'
                }`}
              >
                +{step}
              </button>
            ))}
          </div>
        </div>

        {/* PRIMARY TOUCH BUTTONS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* BIG + PACKED BUTTON */}
          <button
            onClick={() => handleAddPacked(activeStep)}
            className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-[#163324] hover:bg-[#1f4531] text-white shadow-lg active:scale-[0.98] transition-all touch-manipulation min-h-[140px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition-transform">
                <Plus className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <span className="text-2xl font-black tracking-wide block">
                  + PACKED
                </span>
                <span className="text-xs text-[#d4af37] font-semibold">
                  Tap to add +{activeStep} container{activeStep > 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="mt-3 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#d4af37] h-1.5 rounded-full transition-all"
                style={{ width: `${packingPct}%` }}
              />
            </div>
          </button>

          {/* BIG - CORRECTION BUTTON */}
          <button
            onClick={() => handleCorrection(activeStep)}
            className="group relative flex flex-col items-center justify-center p-6 rounded-2xl bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#0f172a] border-2 border-[#e2e8f0] shadow-sm active:scale-[0.98] transition-all touch-manipulation min-h-[140px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#e2e8f0] flex items-center justify-center text-[#64748b] group-hover:scale-110 transition-transform">
                <Minus className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <span className="text-2xl font-black tracking-wide text-[#334155] block">
                  - CORRECTION
                </span>
                <span className="text-xs text-[#64748b] font-semibold">
                  Tap to subtract -{activeStep} container{activeStep > 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <span className="mt-3 text-[11px] text-[#94a3b8]">
              Current packed: {formatNumber(packedContainers)} / {formatNumber(requiredContainers)}
            </span>
          </button>
        </div>

        {/* Secondary Fast Action Buttons: Multi-Increment & Damage Logging */}
        <div className="mt-5 pt-4 border-t border-[#f1f5f9] grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => handleAddPacked(1)}
            className="py-2.5 px-3 rounded-xl bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#065f46] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#a7f3d0] active:scale-95 transition-transform"
          >
            <Plus className="w-3.5 h-3.5" /> +1 Box
          </button>

          <button
            onClick={() => handleAddPacked(5)}
            className="py-2.5 px-3 rounded-xl bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#065f46] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#a7f3d0] active:scale-95 transition-transform"
          >
            <Plus className="w-3.5 h-3.5" /> +5 Boxes
          </button>

          <button
            onClick={() => handleAddDamaged(1)}
            className="py-2.5 px-3 rounded-xl bg-[#fef2f2] hover:bg-[#fee2e2] text-[#991b1b] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#fecaca] active:scale-95 transition-transform"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#dc2626]" /> +1 Damaged
          </button>

          <button
            onClick={() => handleCorrection(1)}
            className="py-2.5 px-3 rounded-xl bg-[#f8fafc] hover:bg-[#e2e8f0] text-[#475569] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#cbd5e1] active:scale-95 transition-transform"
          >
            <Minus className="w-3.5 h-3.5" /> -1 Correction
          </button>
        </div>
      </Card>

      {/* BATCHES PACKING STAGING SECTION */}
      <Card className="border border-[#e2e8f0]">
        <CardHeader className="bg-[#f8fafc]/60 border-b border-[#f1f5f9]">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-[#163324]" />
                <CardTitle className="text-base">
                  Batch Thermal Packing Association
                </CardTitle>
              </div>
              <CardDescription>
                Assign and sign off thermal container packages per cooking batch.
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {batches.length} Batches Planned
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-[#f1f5f9]">
            {batches.map((b) => (
              <div
                key={b.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#fbf6ed]/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-[#163324] text-[#d4af37] font-bold text-xs flex items-center justify-center font-sans shadow-sm">
                    {b.batchNumber.replace('Batch ', 'B')}
                  </span>
                  <div>
                    <h4 className="font-bold text-[#0f172a] text-sm">
                      {b.batchNumber} — {formatNumber(b.quantity)} Pax
                    </h4>
                    <p className="text-xs text-[#64748b]">
                      Est. {Math.ceil(b.quantity / 50)} containers (50 Pax/box) • Status: <span className="font-semibold text-[#0f172a]">{b.preparationStatus}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      b.packingStatus === 'Packed'
                        ? 'success'
                        : b.packingStatus === 'Preparing'
                        ? 'gold'
                        : 'neutral'
                    }
                  >
                    {b.packingStatus || 'Pending'}
                  </Badge>

                  {b.packingStatus !== 'Packed' ? (
                    <Button
                      variant="outline"
                      size="xs"
                      leftIcon={<PackageCheck className="w-3 h-3 text-[#059669]" />}
                      onClick={() => handleMarkBatchPacked(b)}
                    >
                      Mark Packed
                    </Button>
                  ) : (
                    <span className="text-xs text-[#059669] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Staged
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <FoodPackingModal
        isOpen={isPackingModalOpen}
        onClose={() => setIsPackingModalOpen(false)}
        onSave={handleSavePackingModal}
        currentPacking={foodPacking}
        dayLabel={currentDay.dayLabel}
      />
    </div>
  )
}
