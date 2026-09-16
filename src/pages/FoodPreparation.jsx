import React, { useState, useMemo } from 'react'
import {
  ChefHat,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Layers,
  Calendar,
  Filter,
  Check,
  X,
  Package,
  Truck,
  ArrowRight,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { BatchModal } from '../components/kitchen/BatchModal'
import { FoodPrepModal } from '../components/kitchen/FoodPrepModal'
import { useEvents, BATCH_STATUSES } from '../hooks/useEvents'
import { formatNumber } from '../utils/formatters'
import { useToast } from '../components/ui/ToastContext'

export function FoodPreparation() {
  const toast = useToast()
  const {
    events,
    updateFoodPrep,
    addBatch,
    updateBatch,
    deleteBatch,
  } = useEvents()

  // Selected event & day
  const [selectedEventId, setSelectedEventId] = useState(
    events[0]?.id || 'evt-college-3day'
  )
  const [selectedDayNumber, setSelectedDayNumber] = useState(1)

  // Modals state
  const [isPrepModalOpen, setIsPrepModalOpen] = useState(false)
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false)
  const [batchToEdit, setBatchToEdit] = useState(null)

  // Batch filter
  const [statusFilter, setStatusFilter] = useState('All')

  // Find active event & day
  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0] || {}
  }, [events, selectedEventId])

  const eventDays = currentEvent?.days || []
  const currentDay = useMemo(() => {
    return eventDays.find((d) => d.dayNumber === selectedDayNumber) || eventDays[0] || {}
  }, [eventDays, selectedDayNumber])

  // Extract foodPrep and batches with robust fallbacks
  const foodPrep = currentDay.foodPrep || {
    requiredMeals: currentDay.expectedGuests || 10000,
    preparedMeals: currentDay.foodPrepared || 0,
    qualityChecked: 0,
    rejectedMeals: 0,
  }

  const requiredMeals = Number(foodPrep.requiredMeals) || Number(currentDay.expectedGuests) || 10000
  const preparedMeals = Number(foodPrep.preparedMeals) || 0
  const qualityChecked = Number(foodPrep.qualityChecked) || 0
  const rejectedMeals = Number(foodPrep.rejectedMeals) || 0

  // Automatic calculation of Remaining Meals
  const remainingMeals = Math.max(0, requiredMeals - preparedMeals)

  // Progress percentage
  const progressPct = requiredMeals > 0 ? Math.min(100, Math.round((preparedMeals / requiredMeals) * 100)) : 0

  // Batches
  const batches = currentDay.batches || []

  // Filtered Batches
  const filteredBatches = useMemo(() => {
    if (statusFilter === 'All') return batches
    return batches.filter((b) => b.preparationStatus === statusFilter)
  }, [batches, statusFilter])

  // Handlers for Prep Modal
  const handleSavePrep = (data) => {
    updateFoodPrep(currentEvent.id, currentDay.dayNumber, data)
    toast.success('Food Preparation Updated', 'Daily meal tallies and remaining counts recalculated.')
  }

  // Handlers for Batch Modal
  const handleSaveBatch = (data) => {
    if (batchToEdit) {
      updateBatch(currentEvent.id, currentDay.dayNumber, batchToEdit.id, data)
      toast.success('Batch Updated', `${data.batchNumber} has been updated.`)
    } else {
      addBatch(currentEvent.id, currentDay.dayNumber, data)
      toast.success('Batch Created', `${data.batchNumber} added to cooking schedule.`)
    }
    setBatchToEdit(null)
  }

  const handleDeleteBatch = (batchId, batchNumber) => {
    if (window.confirm(`Are you sure you want to delete ${batchNumber}?`)) {
      deleteBatch(currentEvent.id, currentDay.dayNumber, batchId)
      toast.info('Batch Removed', `${batchNumber} removed from day schedule.`)
    }
  }

  // Quick preparation status changer
  const handleQuickStatusChange = (batchId, newStatus) => {
    updateBatch(currentEvent.id, currentDay.dayNumber, batchId, { preparationStatus: newStatus })
    toast.info('Status Updated', `Batch marked as ${newStatus}`)
  }

  // Quick QC toggle
  const handleQuickQcToggle = (batchId, currentQc) => {
    const nextQc = currentQc === 'Pass' ? 'Failed' : currentQc === 'Failed' ? 'Pending' : 'Pass'
    updateBatch(currentEvent.id, currentDay.dayNumber, batchId, { qualityCheck: nextQc })
    toast.info('Quality Check Updated', `QC result: ${nextQc}`)
  }

  // Status color helper
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Completed':
      case 'Ready for Distribution':
        return 'success'
      case 'Preparing':
        return 'gold'
      case 'Ready':
      case 'Quality Checked':
      case 'Packed':
        return 'info'
      case 'Dispatched':
        return 'secondary'
      case 'Pending':
      default:
        return 'neutral'
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Food Preparation & Kitchen Operations"
        description="Central kitchen cauldrons, batch timelines, chef line assignments, and quality check verification."
        badge={progressPct === 100 ? 'Cooking Complete' : `${progressPct}% In Progress`}
        badgeVariant={progressPct === 100 ? 'success' : 'gold'}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit2 className="w-3.5 h-3.5" />}
              onClick={() => setIsPrepModalOpen(true)}
            >
              Update Prep Tallies
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                setBatchToEdit(null)
                setIsBatchModalOpen(true)
              }}
            >
              Create Cooking Batch
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
                  {evt.name} ({formatNumber(evt.totalExpectedGuests)} Pax — {evt.numberOfDays || (evt.days ? evt.days.length : 1)} Days)
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

      {/* 5 Core Food Preparation Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Required Meals */}
        <Card className="p-4 space-y-2 border-l-4 border-l-[#163324]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              Required Meals
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#163324]/10 text-[#163324] flex items-center justify-center">
              <ChefHat className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#0f172a] font-sans">
            {formatNumber(requiredMeals)}
          </p>
          <p className="text-[11px] text-[#64748b] truncate">
            Target quota for {currentDay.dayLabel || `Day ${currentDay.dayNumber}`}
          </p>
        </Card>

        {/* 2. Prepared Meals */}
        <Card className="p-4 space-y-2 border-l-4 border-l-[#9d8050]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              Prepared Meals
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#fbf6ed] text-[#9d8050] flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#9d8050] font-sans">
            {formatNumber(preparedMeals)}
          </p>
          <p className="text-[11px] text-[#059669] font-medium">
            {progressPct}% of required cooked
          </p>
        </Card>

        {/* 3. Quality Checked */}
        <Card className="p-4 space-y-2 border-l-4 border-l-[#059669]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              Quality Checked
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#059669] font-sans">
            {formatNumber(qualityChecked)}
          </p>
          <p className="text-[11px] text-[#64748b]">
            Passed hygiene & taste checks
          </p>
        </Card>

        {/* 4. Rejected / Damaged */}
        <Card className="p-4 space-y-2 border-l-4 border-l-[#dc2626]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              Rejected / Damaged
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#fef2f2] text-[#dc2626] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#dc2626] font-sans">
            {formatNumber(rejectedMeals)}
          </p>
          <p className="text-[11px] text-[#64748b]">
            {rejectedMeals === 0 ? 'Zero kitchen waste' : 'Discarded or burned portions'}
          </p>
        </Card>

        {/* 5. Remaining Meals (Auto Calculated) */}
        <Card className="p-4 space-y-2 border-l-4 border-l-[#0284c7]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              Remaining Meals
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#f0f9ff] text-[#0284c7] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#0284c7] font-sans">
            {formatNumber(remainingMeals)}
          </p>
          <p className="text-[11px] text-[#64748b]">
            Auto-calculated (`Required - Prepared`)
          </p>
        </Card>
      </div>

      {/* Progress Bar & Live Kitchen Status Card */}
      <Card className="p-5 bg-white border border-[#e2e8f0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#163324] text-[#d4af37] flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0f172a]">
                Cooking Progress for {currentDay.dayLabel || `Day ${currentDay.dayNumber}`}
              </h3>
              <p className="text-xs text-[#64748b]">
                {formatNumber(preparedMeals)} of {formatNumber(requiredMeals)} meals prepared across all cauldrons
              </p>
            </div>
          </div>
          <span className="text-xl font-extrabold text-[#163324] font-sans">
            {progressPct}%
          </span>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-[#f1f5f9] rounded-full h-3.5 overflow-hidden border border-[#e2e8f0]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              progressPct === 100
                ? 'bg-[#059669]'
                : progressPct > 50
                ? 'bg-[#163324]'
                : 'bg-[#9d8050]'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </Card>

      {/* BATCH MANAGEMENT SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#163324]" />
              <h2 className="text-lg font-bold text-[#0f172a]">
                Batch Management — {currentDay.dayLabel || `Day ${currentDay.dayNumber}`}
              </h2>
            </div>
            <p className="text-xs text-[#64748b]">
              Track each cooking run (Batch 01, Batch 02, Batch 03...) from boiling cauldrons to quality check, thermal packing, and dispatch.
            </p>
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Preparing', 'Ready', 'Quality Checked', 'Packed', 'Dispatched', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-[#163324] text-white shadow-sm'
                    : 'bg-white text-[#64748b] hover:bg-[#f8fafc] border border-[#e2e8f0]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Batches Grid */}
        {filteredBatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBatches.map((batch) => (
              <Card key={batch.id} className="p-4 border border-[#e2e8f0] hover:shadow-md transition-shadow space-y-3.5">
                {/* Batch Card Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[#163324] text-[#d4af37] font-bold text-xs flex items-center justify-center font-sans shadow-sm">
                      {batch.batchNumber.replace('Batch ', 'B')}
                    </span>
                    <div>
                      <h4 className="font-bold text-[#0f172a] text-sm">
                        {batch.batchNumber}
                      </h4>
                      <p className="text-xs text-[#64748b] font-sans font-semibold">
                        {formatNumber(batch.quantity)} Meals
                      </p>
                    </div>
                  </div>

                  <Badge variant={getStatusBadgeVariant(batch.preparationStatus)}>
                    {batch.preparationStatus}
                  </Badge>
                </div>

                {/* Status Pipeline Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-[#f8fafc] p-2.5 rounded-lg border border-[#f1f5f9]">
                  {/* Preparation Status Selector */}
                  <div>
                    <span className="text-[10px] text-[#64748b] uppercase font-bold block mb-0.5">
                      Prep Status
                    </span>
                    <select
                      value={batch.preparationStatus}
                      onChange={(e) => handleQuickStatusChange(batch.id, e.target.value)}
                      className="w-full text-xs font-semibold p-1 rounded bg-white border border-[#cbd5e1] text-[#0f172a]"
                    >
                      {BATCH_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quality Check Toggle */}
                  <div>
                    <span className="text-[10px] text-[#64748b] uppercase font-bold block mb-0.5">
                      Quality Check
                    </span>
                    <button
                      onClick={() => handleQuickQcToggle(batch.id, batch.qualityCheck)}
                      className={`w-full text-xs font-bold py-1 px-1.5 rounded flex items-center justify-center gap-1 border ${
                        batch.qualityCheck === 'Pass'
                          ? 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]'
                          : batch.qualityCheck === 'Failed'
                          ? 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]'
                          : 'bg-[#fffbeb] text-[#b45309] border-[#fde68a]'
                      }`}
                    >
                      {batch.qualityCheck === 'Pass' ? (
                        <Check className="w-3 h-3 text-[#059669]" />
                      ) : batch.qualityCheck === 'Failed' ? (
                        <X className="w-3 h-3 text-[#dc2626]" />
                      ) : (
                        <Clock className="w-3 h-3 text-[#b45309]" />
                      )}
                      <span>{batch.qualityCheck}</span>
                    </button>
                  </div>

                  {/* Packing Status */}
                  <div>
                    <span className="text-[10px] text-[#64748b] uppercase font-bold block mb-0.5">
                      Packing
                    </span>
                    <span className="font-semibold text-[#0f172a] block">
                      {batch.packingStatus || 'Pending'}
                    </span>
                  </div>

                  {/* Dispatch Status */}
                  <div>
                    <span className="text-[10px] text-[#64748b] uppercase font-bold block mb-0.5">
                      Dispatch
                    </span>
                    <span className="font-semibold text-[#0f172a] block">
                      {batch.dispatchStatus || 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {batch.notes && (
                  <p className="text-xs text-[#475569] italic bg-[#fbf6ed]/50 p-2 rounded border border-[#fbf6ed]">
                    "{batch.notes}"
                  </p>
                )}

                {/* Batch Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<Edit2 className="w-3 h-3" />}
                    onClick={() => {
                      setBatchToEdit(batch)
                      setIsBatchModalOpen(true)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="text-[#dc2626] hover:bg-[#fef2f2]"
                    leftIcon={<Trash2 className="w-3 h-3" />}
                    onClick={() => handleDeleteBatch(batch.id, batch.batchNumber)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Layers}
            title="No Batches Found"
            description={
              statusFilter === 'All'
                ? 'No cooking batches configured for this day. Click "Create Cooking Batch" to initialize Batch 01.'
                : `No cooking batches with status "${statusFilter}".`
            }
            action={
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => {
                  setBatchToEdit(null)
                  setIsBatchModalOpen(true)
                }}
              >
                Create Cooking Batch
              </Button>
            }
          />
        )}
      </div>

      {/* Modals */}
      <FoodPrepModal
        isOpen={isPrepModalOpen}
        onClose={() => setIsPrepModalOpen(false)}
        onSave={handleSavePrep}
        currentPrep={foodPrep}
        dayLabel={currentDay.dayLabel}
      />

      <BatchModal
        isOpen={isBatchModalOpen}
        onClose={() => {
          setIsBatchModalOpen(false)
          setBatchToEdit(null)
        }}
        onSave={handleSaveBatch}
        batchToEdit={batchToEdit}
        defaultBatchNumber={`Batch ${String(batches.length + 1).padStart(2, '0')}`}
      />
    </div>
  )
}
