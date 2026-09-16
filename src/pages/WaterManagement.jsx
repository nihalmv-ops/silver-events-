import React, { useState, useMemo } from 'react'
import {
  Droplets,
  Plus,
  Minus,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Package,
  Truck,
  RefreshCw,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useEvents } from '../hooks/useEvents'
import { formatNumber } from '../utils/formatters'
import { useToast } from '../components/ui/ToastContext'

export function WaterManagement() {
  const toast = useToast()
  const {
    events,
    adjustWaterDelivered,
    adjustWaterAvailable,
    adjustWaterDamaged,
  } = useEvents()

  const [selectedEventId, setSelectedEventId] = useState(
    events[0]?.id || 'evt-college-3day'
  )
  const [selectedDayNumber, setSelectedDayNumber] = useState(1)
  const [step, setStep] = useState(100)

  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0] || {}
  }, [events, selectedEventId])

  const eventDays = currentEvent?.days || []
  const currentDay = useMemo(() => {
    return eventDays.find((d) => d.dayNumber === selectedDayNumber) || eventDays[0] || {}
  }, [eventDays, selectedDayNumber])

  const waterData = currentDay.waterData || {
    required: currentDay.waterTotalNumber || 10000,
    available: currentDay.waterTotalNumber || 10000,
    delivered: currentDay.waterDelivered || 7800,
    remaining: Math.max(0, (currentDay.waterTotalNumber || 10000) - (currentDay.waterDelivered || 7800)),
    damaged: 45,
  }

  const required = Number(waterData.required) || 10000
  const available = Number(waterData.available) || 10000
  const delivered = Number(waterData.delivered) || 0
  const remaining = Math.max(0, available - delivered)
  const damaged = Number(waterData.damaged) || 0

  const progressPct = required > 0 ? Math.min(100, Math.round((delivered / required) * 100)) : 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Water Management & Hydration Stations"
        description="Oversee 250ml sealed mineral water bottles, chilled crate staging, and counter dispensing."
        badge={`${formatNumber(delivered)} Bottles Distributed`}
        badgeVariant="info"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />}
              onClick={() => toast.success('Quality Seal Verified', 'All crates checked: 100% sealed mineral water batch.')}
            >
              Quality Certification
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                adjustWaterAvailable(currentEvent.id, currentDay.dayNumber, 1000)
                toast.success('Stock Replenished', '+1,000 chilled bottles added from reserve truck.')
              }}
            >
              Add +1,000 Reserve
            </Button>
          </div>
        }
      />

      {/* EVENT & DAY SELECTOR */}
      <Card className="p-4 bg-gradient-to-r from-[#0284c7]/5 to-transparent border border-[#0284c7]/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-xs font-semibold text-[#0284c7] uppercase tracking-wider whitespace-nowrap">
              Select Event:
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value)
                setSelectedDayNumber(1)
              }}
              className="px-3.5 py-2 rounded-lg border border-[#cbd5e1] bg-white text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#0284c7] shadow-sm max-w-md"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name} ({formatNumber(evt.totalExpectedGuests)} Pax)
                </option>
              ))}
            </select>
          </div>

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
                      ? 'bg-[#0284c7] text-white shadow-sm'
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

      {/* 5 WATER METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 space-y-1.5 border-l-4 border-l-[#163324]">
          <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
            Required
          </span>
          <p className="text-2xl font-black text-[#0f172a] font-sans">
            {formatNumber(required)}
          </p>
          <p className="text-[11px] text-[#64748b]">Daily hydration quota</p>
        </Card>

        <Card className="p-4 space-y-1.5 border-l-4 border-l-[#0284c7]">
          <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
            Available
          </span>
          <p className="text-2xl font-black text-[#0284c7] font-sans">
            {formatNumber(available)}
          </p>
          <p className="text-[11px] text-[#0284c7] font-medium">Delivered to venue site</p>
        </Card>

        <Card className="p-4 space-y-1.5 border-l-4 border-l-[#059669]">
          <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
            Delivered
          </span>
          <p className="text-2xl font-black text-[#059669] font-sans">
            {formatNumber(delivered)}
          </p>
          <p className="text-[11px] text-[#059669] font-medium">{progressPct}% served to guests</p>
        </Card>

        <Card className="p-4 space-y-1.5 border-l-4 border-l-[#475569]">
          <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
            Remaining
          </span>
          <p className="text-2xl font-black text-[#0f172a] font-sans">
            {formatNumber(remaining)}
          </p>
          <p className="text-[11px] text-[#64748b]">Chilled crate reserve</p>
        </Card>

        <Card className="p-4 space-y-1.5 border-l-4 border-l-[#dc2626]">
          <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
            Damaged / Unused
          </span>
          <p className="text-2xl font-black text-[#dc2626] font-sans">
            {formatNumber(damaged)}
          </p>
          <p className="text-[11px] text-[#64748b]">Leaked or broken caps</p>
        </Card>
      </div>

      {/* FAST MOBILE ACTIONS */}
      <Card className="p-5 bg-white border border-[#e2e8f0]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f1f5f9]">
          <div>
            <h3 className="text-sm font-bold text-[#0f172a]">
              Hydration Distribution Controls
            </h3>
            <p className="text-xs text-[#64748b]">Rapid tally adjustments during peak meal rush.</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[#64748b]">Step:</span>
            {[50, 100, 500].map((s) => (
              <button
                key={s}
                onClick={() => setStep(s)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                  step === s ? 'bg-[#0284c7] text-white' : 'bg-[#f1f5f9] text-[#475569]'
                }`}
              >
                +{s}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => {
              adjustWaterDelivered(currentEvent.id, currentDay.dayNumber, step)
              toast.success('Water Delivered', `+${step} bottles logged.`)
            }}
            className="py-3 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" /> +{step} Delivered
          </button>

          <button
            onClick={() => {
              adjustWaterDelivered(currentEvent.id, currentDay.dayNumber, -step)
              toast.info('Correction', `-${step} bottles corrected.`)
            }}
            className="py-3 px-4 rounded-xl bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#475569] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#cbd5e1] active:scale-95 transition-transform"
          >
            <Minus className="w-4 h-4" /> -{step} Correction
          </button>

          <button
            onClick={() => {
              adjustWaterDamaged(currentEvent.id, currentDay.dayNumber, 5)
              toast.warning('Damaged Logged', '+5 broken bottles recorded.')
            }}
            className="py-3 px-4 rounded-xl bg-[#fef2f2] hover:bg-[#fee2e2] text-[#dc2626] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#fecaca] active:scale-95 transition-transform"
          >
            <AlertTriangle className="w-4 h-4" /> +5 Damaged
          </button>

          <button
            onClick={() => {
              adjustWaterAvailable(currentEvent.id, currentDay.dayNumber, 500)
              toast.success('Reserve Added', '+500 bottles from transport.')
            }}
            className="py-3 px-4 rounded-xl bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#065f46] font-bold text-xs flex items-center justify-center gap-1.5 border border-[#a7f3d0] active:scale-95 transition-transform"
          >
            <RefreshCw className="w-4 h-4" /> +500 Reserve
          </button>
        </div>
      </Card>
    </div>
  )
}
