import React, { useState, useMemo } from 'react'
import {
  Truck,
  PackageCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Minus,
  AlertCircle,
  Play,
  Pause,
  StopCircle,
  Radio,
  Layers,
  ArrowRight,
  Droplets,
  ShieldAlert,
  ChefHat,
  Users,
  Box,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { ReportIssueModal } from '../components/distribution/ReportIssueModal'
import { useEvents } from '../hooks/useEvents'
import { formatNumber } from '../utils/formatters'
import { useToast } from '../components/ui/ToastContext'

export function FoodDistribution() {
  const toast = useToast()
  const {
    events,
    setCounterStatus,
    triggerNextBatchReady,
    triggerBringNextBatch,
    adjustDistributionDelivered,
    adjustDistributionPacked,
    reportDistributionIssue,
    adjustWaterDelivered,
    adjustWaterDamaged,
  } = useEvents()

  // Selected event & day
  const [selectedEventId, setSelectedEventId] = useState(
    events[0]?.id || 'evt-college-3day'
  )
  const [selectedDayNumber, setSelectedDayNumber] = useState(1)

  // Step increment selection for fast live event mobile operation
  const [foodStep, setFoodStep] = useState(100)
  const [waterStep, setWaterStep] = useState(100)

  // Incident Modal
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false)

  // Pause Reason prompt state
  const [isPausePromptOpen, setIsPausePromptOpen] = useState(false)
  const [pauseReasonInput, setPauseReasonInput] = useState('')

  // Active event & day
  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0] || {}
  }, [events, selectedEventId])

  const eventDays = currentEvent?.days || []
  const currentDay = useMemo(() => {
    return eventDays.find((d) => d.dayNumber === selectedDayNumber) || eventDays[0] || {}
  }, [eventDays, selectedDayNumber])

  // ONE DISTRIBUTION COUNTER Data
  const counter = currentDay.counter || {
    name: 'Main Event Distribution Counter',
    status: currentDay.counterStatus || 'OPEN',
    currentStock: currentDay.foodPacked ? Math.max(0, currentDay.foodPacked - (currentDay.foodDelivered || 0)) : 2350,
    currentBatch: 'Batch 02',
    nextBatch: 'Batch 03 (3,000 Pax)',
    nextBatchReady: false,
    callRunnerPending: false,
    pauseReason: '',
  }

  // Distribution tallies
  const distribution = currentDay.distribution || {
    expected: currentDay.expectedGuests || 10000,
    packed: currentDay.foodPacked || 9800,
    delivered: currentDay.foodDelivered || 7450,
    remaining: Math.max(0, (currentDay.expectedGuests || 10000) - (currentDay.foodDelivered || 7450)),
    issues: [],
  }

  const expectedMeals = Number(distribution.expected) || Number(currentDay.expectedGuests) || 10000
  const packedMeals = Number(distribution.packed) || Number(currentDay.foodPacked) || 0
  const deliveredMeals = Number(distribution.delivered) || Number(currentDay.foodDelivered) || 0
  const remainingMeals = Math.max(0, expectedMeals - deliveredMeals)

  // Water tallies
  const waterData = currentDay.waterData || {
    required: currentDay.waterTotalNumber || 10000,
    available: currentDay.waterTotalNumber || 10000,
    delivered: currentDay.waterDelivered || 7800,
    remaining: Math.max(0, (currentDay.waterTotalNumber || 10000) - (currentDay.waterDelivered || 7800)),
    damaged: 45,
  }

  const waterRequired = Number(waterData.required) || 10000
  const waterAvailable = Number(waterData.available) || 10000
  const waterDelivered = Number(waterData.delivered) || 0
  const waterRemaining = Math.max(0, waterAvailable - waterDelivered)
  const waterDamaged = Number(waterData.damaged) || 0

  // Progress percentage
  const foodProgressPct = expectedMeals > 0
    ? Math.min(100, Math.round((deliveredMeals / expectedMeals) * 100))
    : 0

  const waterProgressPct = waterRequired > 0
    ? Math.min(100, Math.round((waterDelivered / waterRequired) * 100))
    : 0

  // ==========================================
  // COUNTER CONTROLS
  // ==========================================
  const handlePauseCounter = () => {
    const reason = prompt('Enter reason for pausing counter (e.g., Auditorium speech break, queue realignment):', 'Temporary event pause')
    if (reason !== null) {
      setCounterStatus(currentEvent.id, currentDay.dayNumber, 'PAUSED', reason || 'Service paused')
      toast.warning('Counter Paused', `Service paused: ${reason || 'Awaiting resumption'}`)
    }
  }

  const handleResumeCounter = () => {
    setCounterStatus(currentEvent.id, currentDay.dayNumber, 'OPEN')
    toast.success('Counter Resumed', 'Main Distribution Counter is now OPEN for guests.')
  }

  const handleCloseCounter = () => {
    if (window.confirm('Are you sure you want to CLOSE the counter for this meal session?')) {
      setCounterStatus(currentEvent.id, currentDay.dayNumber, 'CLOSED')
      toast.info('Counter Closed', 'Main Distribution Counter marked CLOSED.')
    }
  }

  const handleReopenCounter = () => {
    setCounterStatus(currentEvent.id, currentDay.dayNumber, 'OPEN')
    toast.success('Counter Reopened', 'Main Distribution Counter reopened for service.')
  }

  const handleNextBatchReady = () => {
    triggerNextBatchReady(currentEvent.id, currentDay.dayNumber)
    toast.success('Batch Staged', `${counter.nextBatch} is ready at Kitchen Staging Depot.`)
  }

  const handleBringNextBatch = () => {
    triggerBringNextBatch(currentEvent.id, currentDay.dayNumber)
    toast.success('Next Batch Dispatched', 'Runners are loading thermal hot-boxes onto the distribution line.')
  }

  // ==========================================
  // MOBILE FOOD FAST ACTIONS
  // ==========================================
  const handleAddDelivered = (delta) => {
    adjustDistributionDelivered(currentEvent.id, currentDay.dayNumber, delta)
    toast.success('Food Delivered Logged', `+${delta} meals served (${deliveredMeals + delta}/${expectedMeals})`)
  }

  const handleAddPacked = (delta) => {
    adjustDistributionPacked(currentEvent.id, currentDay.dayNumber, delta)
    toast.info('Packed Stock Added', `+${delta} packed meals received at Ready Stock.`)
  }

  const handleFoodCorrection = (delta) => {
    if (deliveredMeals <= 0) {
      toast.warning('Zero Count', 'Delivered meals count is already zero.')
      return
    }
    const safeDelta = -Math.min(deliveredMeals, delta)
    adjustDistributionDelivered(currentEvent.id, currentDay.dayNumber, safeDelta)
    toast.info('Correction Applied', `${safeDelta} meals tally correction recorded.`)
  }

  // ==========================================
  // MOBILE WATER FAST ACTIONS
  // ==========================================
  const handleAddWaterDelivered = (delta) => {
    adjustWaterDelivered(currentEvent.id, currentDay.dayNumber, delta)
    toast.success('Water Delivered', `+${delta} bottles distributed.`)
  }

  const handleWaterCorrection = (delta) => {
    if (waterDelivered <= 0) {
      toast.warning('Zero Count', 'Water delivered count is already zero.')
      return
    }
    const safeDelta = -Math.min(waterDelivered, delta)
    adjustWaterDelivered(currentEvent.id, currentDay.dayNumber, safeDelta)
    toast.info('Water Correction', `${safeDelta} bottles tally corrected.`)
  }

  const handleAddWaterDamaged = (delta) => {
    adjustWaterDamaged(currentEvent.id, currentDay.dayNumber, delta)
    toast.warning('Damaged Water Logged', `+${delta} damaged / leaked bottles logged.`)
  }

  // Submit Issue
  const handleReportIssue = (issue) => {
    reportDistributionIssue(currentEvent.id, currentDay.dayNumber, issue)
    toast.error('Incident Logged', `[${issue.urgency}] ${issue.type} dispatched to operations captain.`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Food Distribution & One Counter Operations"
        description="Live distribution console for 30,000 guests, strictly ONE central counter, Chicken Biryani & Water Bottles."
        badge={
          counter.status === 'OPEN'
            ? 'COUNTER OPEN'
            : counter.status === 'PAUSED'
            ? 'COUNTER PAUSED'
            : 'COUNTER CLOSED'
        }
        badgeVariant={
          counter.status === 'OPEN'
            ? 'success'
            : counter.status === 'PAUSED'
            ? 'gold'
            : 'neutral'
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-[#dc2626] border-[#fecaca] hover:bg-[#fef2f2]"
              leftIcon={<AlertCircle className="w-3.5 h-3.5 text-[#dc2626]" />}
              onClick={() => setIsIssueModalOpen(true)}
            >
              Report Issue
            </Button>
          </div>
        }
      />

      {/* EVENT & DAY SELECTOR BAR */}
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

      {/* DISTRIBUTION WORKFLOW PIPELINE BANNER */}
      <Card className="p-4 bg-[#0e1f16] text-white border border-[#244b36] shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between min-w-[650px] text-xs">
          <div className="flex items-center gap-2 text-[#94a3b8]">
            <ChefHat className="w-4 h-4 text-[#c29c5e]" />
            <span className="font-semibold text-white">Kitchen</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#244b36]" />

          <div className="flex items-center gap-2 text-[#94a3b8]">
            <Layers className="w-4 h-4 text-[#c29c5e]" />
            <span className="font-semibold text-white">Preparation</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#244b36]" />

          <div className="flex items-center gap-2 text-[#94a3b8]">
            <Box className="w-4 h-4 text-[#c29c5e]" />
            <span className="font-semibold text-white">Packing</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#244b36]" />

          <div className="flex items-center gap-2 text-[#94a3b8]">
            <PackageCheck className="w-4 h-4 text-[#34d399]" />
            <span className="font-semibold text-white">Ready Stock</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#34d399]" />

          {/* ONE COUNTER (CENTERPIECE) */}
          <div className="px-3.5 py-1.5 rounded-xl bg-[#10b981]/20 border border-[#10b981] text-[#34d399] font-bold flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
            <span>ONE COUNTER</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#34d399]" />

          <div className="flex items-center gap-2 text-[#94a3b8]">
            <Users className="w-4 h-4 text-[#38bdf8]" />
            <span className="font-semibold text-white">Guests (30k)</span>
          </div>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* SECTION 1: ONE DISTRIBUTION COUNTER HERO CONTROL                           */}
      {/* ========================================================================= */}
      <Card className="border-2 border-[#163324]/30 shadow-lg overflow-hidden">
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#163324] to-[#1e4230] text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="text-xs uppercase font-bold tracking-widest text-[#d4af37]">
                  Single Centralized Distribution Line
                </span>
                <span className="text-white/40">•</span>
                <span className="text-xs text-white/80 font-mono">
                  {currentDay.dayLabel || `Day ${currentDay.dayNumber}`}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
                {counter.name || 'Main Event Distribution Counter'}
              </h2>
              <p className="text-xs text-white/70">
                Direct conduit between ready stock thermal hot-boxes and the dining hall. strictly one counter.
              </p>
            </div>

            {/* LIVE STATUS BADGE & COUNTER ACTIONS */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div
                className={`px-4 py-2 rounded-xl flex items-center gap-2 font-black text-sm uppercase tracking-wider border shadow-sm ${
                  counter.status === 'OPEN'
                    ? 'bg-[#10b981]/20 text-[#34d399] border-[#10b981]'
                    : counter.status === 'PAUSED'
                    ? 'bg-[#f59e0b]/20 text-[#fbbf24] border-[#f59e0b]'
                    : 'bg-white/10 text-[#94a3b8] border-white/20'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    counter.status === 'OPEN'
                      ? 'bg-[#10b981] animate-pulse'
                      : counter.status === 'PAUSED'
                      ? 'bg-[#f59e0b]'
                      : 'bg-[#94a3b8]'
                  }`}
                />
                <span>{counter.status}</span>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-1.5">
                {counter.status === 'OPEN' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    leftIcon={<Pause className="w-3.5 h-3.5 text-[#fbbf24]" />}
                    onClick={handlePauseCounter}
                  >
                    Pause
                  </Button>
                )}

                {counter.status === 'PAUSED' && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-[#10b981] hover:bg-[#059669] text-white"
                    leftIcon={<Play className="w-3.5 h-3.5" />}
                    onClick={handleResumeCounter}
                  >
                    Resume
                  </Button>
                )}

                {counter.status !== 'CLOSED' ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white hover:bg-white/10"
                    leftIcon={<StopCircle className="w-3.5 h-3.5 text-[#f87171]" />}
                    onClick={handleCloseCounter}
                  >
                    Close Counter
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    leftIcon={<Play className="w-3.5 h-3.5 text-[#34d399]" />}
                    onClick={handleReopenCounter}
                  >
                    Reopen Counter
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 5 REQUIRED COUNTER METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#e2e8f0] bg-[#f8fafc]">
          {/* 1. Current Stock */}
          <div className="p-4 space-y-1">
            <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider block">
              Current Stock
            </span>
            <p className="text-2xl font-black text-[#0f172a] font-sans">
              {formatNumber(counter.currentStock)}
            </p>
            <p className="text-[11px] text-[#059669] font-medium">Meals ready at counter</p>
          </div>

          {/* 2. Current Batch */}
          <div className="p-4 space-y-1">
            <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider block">
              Current Batch
            </span>
            <p className="text-xl font-bold text-[#163324] font-sans">
              {counter.currentBatch || 'Batch 01'}
            </p>
            <p className="text-[11px] text-[#64748b]">Active cauldron run</p>
          </div>

          {/* 3. Delivered */}
          <div className="p-4 space-y-1">
            <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider block">
              Delivered
            </span>
            <p className="text-2xl font-black text-[#059669] font-sans">
              {formatNumber(deliveredMeals)}
            </p>
            <p className="text-[11px] text-[#059669] font-medium">{foodProgressPct}% served</p>
          </div>

          {/* 4. Remaining */}
          <div className="p-4 space-y-1">
            <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider block">
              Remaining
            </span>
            <p className="text-2xl font-black text-[#0284c7] font-sans">
              {formatNumber(remainingMeals)}
            </p>
            <p className="text-[11px] text-[#64748b]">To reach {formatNumber(expectedMeals)}</p>
          </div>

          {/* 5. Next Batch */}
          <div className="p-4 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider block">
              Next Batch
            </span>
            <p className="text-sm font-bold text-[#9d8050] truncate font-sans">
              {counter.nextBatch || 'Batch 03'}
            </p>
            <p className="text-[11px] text-[#64748b]">Staged at central kitchen</p>
          </div>
        </div>

        {/* BATCH RUNNER DISPATCH CONTROLS */}
        <div className="p-4 bg-white border-t border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0f172a]">
              Kitchen Batch Staging Pipeline:
            </span>
            {counter.nextBatchReady ? (
              <span className="text-xs font-semibold text-[#059669] flex items-center gap-1 bg-[#ecfdf5] px-2 py-0.5 rounded border border-[#a7f3d0]">
                <CheckCircle2 className="w-3 h-3" /> {counter.nextBatch} is Ready at Kitchen
              </span>
            ) : (
              <span className="text-xs text-[#64748b]">
                {counter.nextBatch} being prepared in cauldrons
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />}
              onClick={handleNextBatchReady}
              disabled={counter.nextBatchReady}
            >
              {counter.nextBatchReady ? 'Batch Staged' : 'Next Batch Ready'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="bg-[#163324] hover:bg-[#1f4531]"
              leftIcon={<Truck className="w-3.5 h-3.5 text-[#d4af37]" />}
              onClick={handleBringNextBatch}
            >
              Bring Next Batch
            </Button>
          </div>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* SECTION 2: DISTRIBUTION LIVE TRACKING & MOBILE EVENT CONSOLE              */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-[#163324]" />
              <h3 className="text-lg font-bold text-[#0f172a]">
                Live Food Distribution — Mobile Event Mode
              </h3>
            </div>
            <p className="text-xs text-[#64748b]">
              Track Chicken Biryani servings. Large tap buttons with zero latency for counter marshals.
            </p>
          </div>

          {/* Quick Increment Step Selector */}
          <div className="flex items-center gap-1.5 bg-[#f8fafc] p-1.5 rounded-xl border border-[#e2e8f0]">
            <span className="text-[11px] font-semibold text-[#64748b] px-2">
              Step:
            </span>
            {[50, 100, 250, 500].map((step) => (
              <button
                key={step}
                onClick={() => setFoodStep(step)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  foodStep === step
                    ? 'bg-[#163324] text-[#d4af37] shadow-sm'
                    : 'text-[#475569] hover:bg-[#e2e8f0]'
                }`}
              >
                +{step}
              </button>
            ))}
          </div>
        </div>

        {/* 4 DISTRIBUTION TRACKING CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Expected */}
          <Card className="p-4 space-y-1.5 border-l-4 border-l-[#163324]">
            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              Expected
            </span>
            <p className="text-2xl font-black text-[#0f172a] font-sans">
              {formatNumber(expectedMeals)}
            </p>
            <p className="text-[11px] text-[#64748b]">Guest quota for today</p>
          </Card>

          {/* Packed */}
          <Card className="p-4 space-y-1.5 border-l-4 border-l-[#9d8050]">
            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              Packed
            </span>
            <p className="text-2xl font-black text-[#9d8050] font-sans">
              {formatNumber(packedMeals)}
            </p>
            <p className="text-[11px] text-[#64748b]">Ready stock in thermal hot-boxes</p>
          </Card>

          {/* Delivered */}
          <Card className="p-4 space-y-1.5 border-l-4 border-l-[#059669]">
            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              Delivered
            </span>
            <p className="text-2xl font-black text-[#059669] font-sans">
              {formatNumber(deliveredMeals)}
            </p>
            <p className="text-[11px] text-[#059669] font-medium">{foodProgressPct}% handed to guests</p>
          </Card>

          {/* Remaining */}
          <Card className="p-4 space-y-1.5 border-l-4 border-l-[#0284c7]">
            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
              Remaining
            </span>
            <p className="text-2xl font-black text-[#0284c7] font-sans">
              {formatNumber(remainingMeals)}
            </p>
            <p className="text-[11px] text-[#64748b]">Auto-calculated (`Expected - Delivered`)</p>
          </Card>
        </div>

        {/* LARGE MOBILE TOUCH CONSOLE FOR FOOD */}
        <Card className="p-5 bg-white border-2 border-[#163324]/20 shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* BIG PRIMARY BUTTON: + ADD DELIVERED */}
            <button
              onClick={() => handleAddDelivered(foodStep)}
              className="group col-span-1 sm:col-span-2 flex items-center justify-between p-5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white shadow-lg active:scale-[0.98] transition-all touch-manipulation min-h-[110px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Plus className="w-7 h-7 stroke-[3]" />
                </div>
                <div className="text-left">
                  <span className="text-2xl font-black tracking-wide block font-sans">
                    + ADD DELIVERED
                  </span>
                  <span className="text-xs text-[#a7f3d0] font-semibold">
                    Tap to log +{foodStep} meals served
                  </span>
                </div>
              </div>
              <span className="text-xl font-bold bg-white/10 px-3 py-1.5 rounded-xl">
                +{foodStep}
              </span>
            </button>

            {/* BUTTON: + ADD PACKED */}
            <button
              onClick={() => handleAddPacked(foodStep)}
              className="flex items-center justify-between p-5 rounded-2xl bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#0f172a] border-2 border-[#e2e8f0] shadow-sm active:scale-[0.98] transition-all touch-manipulation min-h-[110px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#e2e8f0] flex items-center justify-center text-[#163324]">
                  <Box className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-base font-black tracking-wide block">
                    + ADD PACKED
                  </span>
                  <span className="text-[11px] text-[#64748b]">
                    +{foodStep} to stock
                  </span>
                </div>
              </div>
            </button>

            {/* BUTTON: - CORRECTION */}
            <button
              onClick={() => handleFoodCorrection(foodStep)}
              className="flex items-center justify-between p-5 rounded-2xl bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#0f172a] border-2 border-[#e2e8f0] shadow-sm active:scale-[0.98] transition-all touch-manipulation min-h-[110px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#fee2e2] flex items-center justify-center text-[#dc2626]">
                  <Minus className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-base font-black tracking-wide block text-[#dc2626]">
                    - CORRECTION
                  </span>
                  <span className="text-[11px] text-[#64748b]">
                    -{foodStep} error fix
                  </span>
                </div>
              </div>
            </button>
          </div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: WATER DISTRIBUTION TRACKING                                    */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-[#0284c7]" />
              <h3 className="text-lg font-bold text-[#0f172a]">
                Water Bottle Management & Hydration
              </h3>
            </div>
            <p className="text-xs text-[#64748b]">
              Track 250ml hygienic chilled drinking water bottles across the counter hydration station.
            </p>
          </div>

          {/* Quick Water Increment Step Selector */}
          <div className="flex items-center gap-1.5 bg-[#f8fafc] p-1.5 rounded-xl border border-[#e2e8f0]">
            <span className="text-[11px] font-semibold text-[#64748b] px-2">
              Water Step:
            </span>
            {[50, 100, 500].map((step) => (
              <button
                key={step}
                onClick={() => setWaterStep(step)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  waterStep === step
                    ? 'bg-[#0284c7] text-white shadow-sm'
                    : 'text-[#475569] hover:bg-[#e2e8f0]'
                }`}
              >
                +{step}
              </button>
            ))}
          </div>
        </div>

        {/* 5 WATER METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Required */}
          <Card className="p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider block">
              Required
            </span>
            <p className="text-xl font-bold text-[#0f172a] font-sans">
              {formatNumber(waterRequired)}
            </p>
            <p className="text-[11px] text-[#64748b]">Event target bottles</p>
          </Card>

          {/* Available */}
          <Card className="p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider block">
              Available
            </span>
            <p className="text-xl font-bold text-[#0f172a] font-sans">
              {formatNumber(waterAvailable)}
            </p>
            <p className="text-[11px] text-[#64748b]">On-site water reserves</p>
          </Card>

          {/* Delivered */}
          <Card className="p-3.5 space-y-1 border-l-4 border-l-[#059669]">
            <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider block">
              Delivered
            </span>
            <p className="text-xl font-bold text-[#059669] font-sans">
              {formatNumber(waterDelivered)}
            </p>
            <p className="text-[11px] text-[#059669] font-medium">{waterProgressPct}% handed out</p>
          </Card>

          {/* Remaining */}
          <Card className="p-3.5 space-y-1 border-l-4 border-l-[#0284c7]">
            <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider block">
              Remaining
            </span>
            <p className="text-xl font-bold text-[#0284c7] font-sans">
              {formatNumber(waterRemaining)}
            </p>
            <p className="text-[11px] text-[#64748b]">Chilled bottles in crates</p>
          </Card>

          {/* Damaged / Unused */}
          <Card className="p-3.5 space-y-1 border-l-4 border-l-[#dc2626] col-span-2 sm:col-span-1">
            <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider block">
              Damaged / Unused
            </span>
            <p className="text-xl font-bold text-[#dc2626] font-sans">
              {formatNumber(waterDamaged)}
            </p>
            <p className="text-[11px] text-[#64748b]">Punctured or broken seals</p>
          </Card>
        </div>

        {/* FAST MOBILE TOUCH CONSOLE FOR WATER */}
        <Card className="p-4 bg-white border border-[#e2e8f0]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => handleAddWaterDelivered(waterStep)}
              className="py-3 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
            >
              <Plus className="w-4 h-4" /> +{waterStep} Water Delivered
            </button>

            <button
              onClick={() => handleAddWaterDelivered(50)}
              className="py-3 px-4 rounded-xl bg-[#f0f9ff] hover:bg-[#e0f2fe] text-[#0369a1] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#bae6fd] active:scale-95 transition-transform"
            >
              <Plus className="w-3.5 h-3.5" /> +50 Quick Box
            </button>

            <button
              onClick={() => handleWaterCorrection(waterStep)}
              className="py-3 px-4 rounded-xl bg-[#f8fafc] hover:bg-[#e2e8f0] text-[#475569] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#cbd5e1] active:scale-95 transition-transform"
            >
              <Minus className="w-3.5 h-3.5" /> -{waterStep} Correction
            </button>

            <button
              onClick={() => handleAddWaterDamaged(5)}
              className="py-3 px-4 rounded-xl bg-[#fef2f2] hover:bg-[#fee2e2] text-[#dc2626] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#fecaca] active:scale-95 transition-transform"
            >
              <AlertTriangle className="w-3.5 h-3.5" /> +5 Damaged
            </button>
          </div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: RECENT COUNTER ISSUES LOG                                      */}
      {/* ========================================================================= */}
      {distribution.issues && distribution.issues.length > 0 && (
        <Card className="border border-[#e2e8f0]">
          <CardHeader className="bg-[#f8fafc]/60 border-b border-[#f1f5f9] py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#dc2626]" />
                <CardTitle className="text-sm">
                  Active Distribution Incidents & Floor Alerts
                </CardTitle>
              </div>
              <Badge variant="danger" size="sm">
                {distribution.issues.length} Reported
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[#f1f5f9]">
              {distribution.issues.map((iss) => (
                <div key={iss.id} className="p-3 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0f172a]">{iss.type}</span>
                      <span className="text-[10px] text-[#64748b]">{iss.time}</span>
                    </div>
                    {iss.notes && (
                      <p className="text-xs text-[#475569] mt-0.5">{iss.notes}</p>
                    )}
                  </div>
                  <Badge
                    variant={iss.urgency === 'High' ? 'danger' : iss.urgency === 'Medium' ? 'warning' : 'info'}
                    size="sm"
                  >
                    {iss.urgency}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* REPORT ISSUE MODAL */}
      <ReportIssueModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onReport={handleReportIssue}
        counterName={counter.name}
      />
    </div>
  )
}
