import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  UtensilsCrossed,
  Droplets,
  PackageCheck,
  Truck,
  PackageMinus,
  AlertCircle,
  Radio,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { formatNumber } from '../../utils/formatters'
import { useToast } from '../ui/ToastContext'

export function ActiveEventCard({ event }) {
  const toast = useToast()
  const navigate = useNavigate()

  if (!event) return null

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0e1f16] text-white border border-[#244b36] shadow-card">
      {/* Decorative ambient subtle backdrop warmth */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-[#c29c5e]/15 via-transparent to-transparent pointer-events-none blur-2xl" />

      {/* Top Banner / Event Identity */}
      <div className="p-6 sm:p-7 border-b border-[#1b3a29] bg-gradient-to-r from-[#0e1f16] to-[#142e20]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/30">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                Active Event
              </span>

              <Badge variant="gold" size="sm" className="bg-[#c29c5e]/25 text-[#dfbe82] border-[#c29c5e]/40 font-bold">
                {event.day}
              </Badge>

              <span className="text-white/40 text-xs">•</span>
              <span className="text-xs text-[#94a3b8] font-mono">{event.code}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              {event.title}
            </h2>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-[#cbd5e1]">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#c29c5e]" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#c29c5e]" />
                <span>{event.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Quick Status Chips (Counter OPEN & Pending Count) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Counter Status */}
            <div className="px-4 py-2.5 rounded-xl bg-[#142e20] border border-[#234d37] flex flex-col items-start sm:items-end">
              <span className="text-[10px] uppercase font-bold text-[#85a392] tracking-wider">
                Counter Status
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
                <span className="text-sm font-extrabold text-[#34d399] tracking-wide">
                  {event.counterStatus}
                </span>
              </div>
            </div>

            {/* Pending Badge */}
            <div className="px-4 py-2.5 rounded-xl bg-[#fffbeb]/10 border border-[#f59e0b]/30 flex flex-col items-start sm:items-end">
              <span className="text-[10px] uppercase font-bold text-[#fde68a] tracking-wider">
                Pending Actions
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span className="text-sm font-extrabold text-[#fde68a] tracking-wide">
                  {event.pendingTasksCount} Tasks
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Key Operational Metrics Banner (Guests, Food, Water) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#1b3a29] bg-[#0a1811] border-b border-[#1b3a29]">
        {/* Expected Guests */}
        <div className="p-4 sm:p-5 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#163324] border border-[#234d37] flex items-center justify-center shrink-0 text-[#c29c5e]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#85a392] uppercase tracking-wider block">
              Expected Guests (Day 1)
            </span>
            <span className="text-xl sm:text-2xl font-bold text-white font-sans">
              {formatNumber(event.expectedGuests)}
            </span>
          </div>
        </div>

        {/* Food */}
        <div className="p-4 sm:p-5 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#163324] border border-[#234d37] flex items-center justify-center shrink-0 text-[#c29c5e]">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#85a392] uppercase tracking-wider block">
              Food Item
            </span>
            <span className="text-base sm:text-lg font-bold text-white truncate max-w-[200px] block">
              {event.foodItem}
            </span>
          </div>
        </div>

        {/* Water */}
        <div className="p-4 sm:p-5 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#163324] border border-[#234d37] flex items-center justify-center shrink-0 text-[#0ea5e9]">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-[#85a392] uppercase tracking-wider block">
              Water Stock
            </span>
            <span className="text-xl sm:text-2xl font-bold text-white font-sans">
              {event.waterTotal}
            </span>
          </div>
        </div>
      </div>

      {/* Specific Progress Rows Requested: Packed, Delivered, Remaining for Food & Water */}
      <div className="p-6 sm:p-7 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Food Progress Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#142e20]/60 border border-[#234d37] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-[#c29c5e]" />
                <h4 className="text-sm font-semibold text-white">
                  Food Execution ({event.foodItem})
                </h4>
              </div>
              <span className="text-xs text-[#85a392] font-mono">
                Total: {formatNumber(event.foodPrepared)} Pax
              </span>
            </div>

            {/* 3 Metrics: Packed, Delivered, Remaining */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-[#0e1f16] border border-[#1b3a29]">
                <span className="text-[10px] uppercase tracking-wider text-[#94a3b8] block">
                  Food Packed
                </span>
                <span className="text-base sm:text-lg font-bold text-white">
                  {formatNumber(event.foodPacked)}
                </span>
                <span className="text-[10px] text-[#0ea5e9] block font-medium">98%</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0e1f16] border border-[#1b3a29]">
                <span className="text-[10px] uppercase tracking-wider text-[#94a3b8] block">
                  Food Delivered
                </span>
                <span className="text-base sm:text-lg font-bold text-[#34d399]">
                  {formatNumber(event.foodDelivered)}
                </span>
                <span className="text-[10px] text-[#10b981] block font-medium">Counters</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0e1f16] border border-[#1b3a29]">
                <span className="text-[10px] uppercase tracking-wider text-[#94a3b8] block">
                  Food Remaining
                </span>
                <span className="text-base sm:text-lg font-bold text-[#dfbe82]">
                  {formatNumber(event.foodRemaining)}
                </span>
                <span className="text-[10px] text-[#c29c5e] block font-medium">Buffer</span>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-[#0a1811] h-2.5 rounded-full overflow-hidden flex">
              <div
                className="bg-[#10b981] h-full"
                style={{ width: `${(event.foodDelivered / event.foodPrepared) * 100}%` }}
                title="Delivered"
              />
              <div
                className="bg-[#c29c5e] h-full"
                style={{ width: `${(event.foodRemaining / event.foodPrepared) * 100}%` }}
                title="Remaining / Buffer"
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#85a392]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" /> Delivered ({formatNumber(event.foodDelivered)})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#c29c5e]" /> Remaining ({formatNumber(event.foodRemaining)})
              </span>
            </div>
          </div>

          {/* Water Progress Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#142e20]/60 border border-[#234d37] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#0ea5e9]" />
                <h4 className="text-sm font-semibold text-white">
                  Water Dispatch & Hydration
                </h4>
              </div>
              <span className="text-xs text-[#85a392] font-mono">
                Total: {formatNumber(event.waterTotalNumber)} Bottles
              </span>
            </div>

            {/* 2 Metrics: Delivered & Remaining */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 rounded-lg bg-[#0e1f16] border border-[#1b3a29]">
                <span className="text-[10px] uppercase tracking-wider text-[#94a3b8] block">
                  Water Delivered
                </span>
                <span className="text-base sm:text-lg font-bold text-[#38bdf8]">
                  {formatNumber(event.waterDelivered)}
                </span>
                <span className="text-[10px] text-[#0ea5e9] block font-medium">Staged at tables</span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0e1f16] border border-[#1b3a29]">
                <span className="text-[10px] uppercase tracking-wider text-[#94a3b8] block">
                  Water Remaining
                </span>
                <span className="text-base sm:text-lg font-bold text-[#dfbe82]">
                  {formatNumber(event.waterRemaining)}
                </span>
                <span className="text-[10px] text-[#c29c5e] block font-medium">In cold carrier</span>
              </div>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-[#0a1811] h-2.5 rounded-full overflow-hidden flex">
              <div
                className="bg-[#0284c7] h-full"
                style={{ width: `${(event.waterDelivered / event.waterTotalNumber) * 100}%` }}
                title="Delivered"
              />
              <div
                className="bg-[#c29c5e] h-full"
                style={{ width: `${(event.waterRemaining / event.waterTotalNumber) * 100}%` }}
                title="Remaining"
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#85a392]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#0284c7]" /> Delivered ({formatNumber(event.waterDelivered)})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#c29c5e]" /> Remaining ({formatNumber(event.waterRemaining)})
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1b3a29]">
          <div className="text-xs text-[#85a392]">
            <span>Active Buffets: </span>
            <strong className="text-white">{event.buffetCountersActive} Live Lines</strong>
            <span className="mx-2">•</span>
            <span>Supervisor: </span>
            <span className="text-[#cbd5e1]">{event.leadManager}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="border-[#234d37] text-white hover:bg-[#163324] hover:text-white"
              onClick={() => toast.info('Buffet Status', 'All 16 buffet counters are active with food heaters running.')}
            >
              Verify Counters
            </Button>
            <Button
              variant="secondary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => navigate('/events/evt-college-3day')}
            >
              View 3-Day Event Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
