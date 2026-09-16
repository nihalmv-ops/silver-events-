import React from 'react'
import {
  CalendarDays,
  Clock,
  Activity,
  CheckCircle2,
  Users,
  ChefHat,
  PackageCheck,
  Truck,
  Droplets,
  CheckSquare,
  ReceiptText,
  MapPin,
  Flame,
  ArrowUpRight,
  Sparkles,
  Info,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { mockDashboardData } from '../data/mockDashboardData'
import { formatNumber, formatCurrency } from '../utils/formatters'
import { useToast } from '../components/ui/ToastContext'

const statIcons = {
  CalendarDays,
  Clock,
  Activity,
  CheckCircle2,
}

export function Dashboard() {
  const { eventStats, todayEvent, todayOperations, secondaryEvent } = mockDashboardData
  const toast = useToast()

  const handleRefresh = () => {
    toast.success('Live Sync Complete', 'Real-time catering metrics refreshed from central kitchen and site.')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Operations Dashboard"
        description="Live operational command center for Silver Catering events, kitchen preparations, packaging, and on-ground logistics."
        badge="Live Shift"
        badgeVariant="success"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              Sync Metrics
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Flame className="w-3.5 h-3.5 text-[#c29c5e]" />}
              onClick={() => toast.info('Event Service Status', 'Main course buffet opened at 12:45 PM. Guest inflow active.')}
            >
              Buffet Status
            </Button>
          </div>
        }
      />

      {/* Top 4 Event Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {eventStats.map((stat) => {
          const Icon = statIcons[stat.icon] || CalendarDays
          return (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={formatNumber(stat.value)}
              subtext={stat.subtext}
              trend={stat.trend}
              trendType={stat.trendType}
              accentColor={stat.accentColor}
              icon={Icon}
            />
          )
        })}
      </div>

      {/* Primary Highlight: Today's Active Event Showcase */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0e1f16] via-[#142e20] to-[#1c3e2c] text-white p-6 sm:p-8 shadow-card border border-[#244b36]">
        {/* Subtle decorative gold glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c29c5e]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#c29c5e] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                Today's Featured Event
              </span>
              <span className="text-white/30">•</span>
              <span className="text-xs text-[#cbd5e1] font-mono">{todayEvent.code}</span>
              <Badge variant="gold" size="sm" className="bg-[#c29c5e]/20 text-[#e9d6b7] border-[#c29c5e]/30">
                {todayEvent.status}
              </Badge>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white font-sans">
              {todayEvent.name}
            </h2>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-[#cbd5e1]">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#c29c5e] shrink-0" />
                <span>{todayEvent.venue}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#c29c5e] shrink-0" />
                <span className="font-semibold text-white">{formatNumber(todayEvent.pax)} Expected Guests</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#c29c5e] shrink-0" />
                <span>{todayEvent.startTime} – {todayEvent.endTime}</span>
              </div>
            </div>

            {/* Menu Highlights Pills */}
            <div className="pt-2">
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#9d8050] mb-1.5">
                Catering Menu Highlights:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {todayEvent.menuHighlights.map((dish, i) => (
                  <span
                    key={i}
                    className="inline-block px-2.5 py-1 text-[11px] rounded-lg bg-white/10 text-white/90 border border-white/10 backdrop-blur-sm"
                  >
                    {dish}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6">
            <div className="text-left lg:text-right">
              <span className="text-[11px] text-[#94a3b8] block">Operations Lead</span>
              <span className="text-xs font-semibold text-white">{todayEvent.eventManager}</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toast.info('Event Dispatches', 'Insulated food carriers 1 through 4 have arrived on site.')}
            >
              View Dispatch Plan
            </Button>
          </div>
        </div>
      </div>

      {/* Grid: 8 Specific Operational Cards requested for Today */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0f172a] tracking-tight">
            Today's Operational Execution
          </h3>
          <span className="text-xs text-[#64748b]">
            Live updates across Central Kitchen & Venue
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* 1. Expected Guests */}
          <Card className="p-5 space-y-3 hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  Expected Guests
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-[#0f172a]">
                    {formatNumber(todayOperations.expectedGuests.total)}
                  </span>
                  <span className="text-xs text-[#059669] font-medium">
                    ({todayOperations.expectedGuests.arrived} seated)
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="w-full bg-[#f1f5f9] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#10b981] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${todayOperations.expectedGuests.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#64748b]">
                <span>Peak: {todayOperations.expectedGuests.peakTime}</span>
                <span className="font-semibold">{todayOperations.expectedGuests.percentage}%</span>
              </div>
            </div>
            <p className="text-[11px] text-[#64748b] pt-1 border-t border-[#f1f5f9]">
              {todayOperations.expectedGuests.sessions}
            </p>
          </Card>

          {/* 2. Food Prepared */}
          <Card className="p-5 space-y-3 hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  Food Prepared
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-[#0f172a]">
                    {todayOperations.foodPrepared.value}%
                  </span>
                  <Badge variant={todayOperations.foodPrepared.badgeVariant} size="sm">
                    {todayOperations.foodPrepared.badge}
                  </Badge>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#163324]/10 text-[#163324] flex items-center justify-center">
                <ChefHat className="w-5 h-5" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="w-full bg-[#f1f5f9] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#163324] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${todayOperations.foodPrepared.value}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#64748b]">
                <span>Kitchen Milestones</span>
                <span className="font-semibold">{todayOperations.foodPrepared.value}%</span>
              </div>
            </div>
            <p className="text-[11px] text-[#64748b] pt-1 border-t border-[#f1f5f9] line-clamp-1">
              {todayOperations.foodPrepared.note}
            </p>
          </Card>

          {/* 3. Food Packed */}
          <Card className="p-5 space-y-3 hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  Food Packed
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-[#0f172a]">
                    {todayOperations.foodPacked.value}%
                  </span>
                  <Badge variant={todayOperations.foodPacked.badgeVariant} size="sm">
                    {todayOperations.foodPacked.badge}
                  </Badge>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#f0f9ff] text-[#0284c7] flex items-center justify-center">
                <PackageCheck className="w-5 h-5" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="w-full bg-[#f1f5f9] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#0284c7] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${todayOperations.foodPacked.value}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#64748b]">
                <span>Hot Box Dispatches</span>
                <span className="font-semibold">{todayOperations.foodPacked.value}%</span>
              </div>
            </div>
            <p className="text-[11px] text-[#64748b] pt-1 border-t border-[#f1f5f9] line-clamp-1">
              {todayOperations.foodPacked.note}
            </p>
          </Card>

          {/* 4. Food Delivered */}
          <Card className="p-5 space-y-3 hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  Food Delivered
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-[#0f172a]">
                    {todayOperations.foodDelivered.value}%
                  </span>
                  <Badge variant={todayOperations.foodDelivered.badgeVariant} size="sm">
                    {todayOperations.foodDelivered.badge}
                  </Badge>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="w-full bg-[#f1f5f9] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#059669] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${todayOperations.foodDelivered.value}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#64748b]">
                <span>Buffet Readiness</span>
                <span className="font-semibold">8 of 8 Counters</span>
              </div>
            </div>
            <p className="text-[11px] text-[#64748b] pt-1 border-t border-[#f1f5f9] line-clamp-1">
              {todayOperations.foodDelivered.note}
            </p>
          </Card>

          {/* 5. Water Delivered */}
          <Card className="p-5 space-y-3 hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  Water Delivered
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-[#0f172a]">
                    {todayOperations.waterDelivered.value}%
                  </span>
                  <Badge variant={todayOperations.waterDelivered.badgeVariant} size="sm">
                    {todayOperations.waterDelivered.badge}
                  </Badge>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#f0f9ff] text-[#0284c7] flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="w-full bg-[#f1f5f9] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#0284c7] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${todayOperations.waterDelivered.value}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#64748b]">
                <span>2,800 Bottles</span>
                <span className="font-semibold">{todayOperations.waterDelivered.value}%</span>
              </div>
            </div>
            <p className="text-[11px] text-[#64748b] pt-1 border-t border-[#f1f5f9] line-clamp-1">
              {todayOperations.waterDelivered.note}
            </p>
          </Card>

          {/* 6. Pending Tasks */}
          <Card className="p-5 space-y-3 hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  Pending Tasks
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-[#d97706]">
                    {todayOperations.pendingTasks.count}
                  </span>
                  <Badge variant="warning" size="sm">
                    {todayOperations.pendingTasks.urgentCount} Urgent
                  </Badge>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#fffbeb] text-[#d97706] flex items-center justify-center">
                <CheckSquare className="w-5 h-5" />
              </div>
            </div>

            <p className="text-xs text-[#64748b]">
              Immediate action needed on site counters.
            </p>

            <div className="pt-1 border-t border-[#f1f5f9] flex items-center justify-between text-[11px]">
              <span className="text-[#92400e] font-medium">Ice Replenishment</span>
              <span className="text-[#64748b]">Due in 15m</span>
            </div>
          </Card>

          {/* 7. Today's Expenses (Operations Spend) */}
          <Card className="p-5 space-y-3 hover:shadow-card-hover transition-all md:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  Today's Operational Expenses
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-[#0f172a]">
                    {formatCurrency(todayOperations.todayExpenses.total)}
                  </span>
                  <span className="text-xs text-[#64748b]">
                    (Fuel, ice, temporary labor & floral staging)
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#fbf6ed] text-[#9d8050] flex items-center justify-center">
                <ReceiptText className="w-5 h-5" />
              </div>
            </div>

            {/* Breakdown Tags */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#f1f5f9]">
              {todayOperations.todayExpenses.breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[11px] text-[#475569] bg-[#f8fafc] p-1.5 rounded-md">
                  <span className="truncate pr-1">{item.category}</span>
                  <span className="font-semibold text-[#0f172a] shrink-0">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Secondary Information Row: Real-time Task Board Snippet & Evening Event Prep */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* On-site Urgent Tasks List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Urgent Operational Checklist</CardTitle>
                <CardDescription>Live action items requiring immediate steward / chef coordination</CardDescription>
              </div>
              <Badge variant="warning">On-Site Priority</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayOperations.pendingTasks.items.map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between p-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#cbd5e1] transition-colors gap-3"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 rounded border-gray-300 text-[#163324] focus:ring-[#163324]/20 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.checked) {
                        toast.success('Task Completed', `"${task.title}" marked as resolved.`)
                      }
                    }}
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#0f172a] leading-tight">
                      {task.title}
                    </p>
                    <p className="text-[11px] text-[#64748b] mt-0.5">
                      Assigned: <span className="text-[#334155] font-medium">{task.assignedTo}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <Badge
                    variant={task.urgency === 'high' ? 'danger' : task.urgency === 'medium' ? 'warning' : 'default'}
                    size="sm"
                  >
                    {task.due}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Secondary Scheduled Event Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Evening Banquet</CardTitle>
              <Badge variant="warning">{secondaryEvent.status}</Badge>
            </div>
            <CardDescription>Next upcoming event today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] space-y-2">
              <h4 className="text-sm font-semibold text-[#0f172a] leading-tight">
                {secondaryEvent.name}
              </h4>
              <p className="text-xs text-[#64748b]">
                {secondaryEvent.venue}
              </p>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#e2e8f0]">
                <span className="text-[#475569]">{secondaryEvent.serviceType}</span>
                <span className="font-semibold text-[#0f172a]">{secondaryEvent.pax} Pax</span>
              </div>
            </div>

            <div className="text-xs text-[#64748b] space-y-1">
              <p className="flex justify-between">
                <span>Start Time:</span>
                <span className="font-medium text-[#0f172a]">{secondaryEvent.startTime}</span>
              </p>
              <p className="flex justify-between">
                <span>Event Code:</span>
                <span className="font-mono text-[#0f172a]">{secondaryEvent.code}</span>
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => toast.info('Evening Banquet', 'Kitchen prep for Evening Banquet starts at 04:00 PM.')}
            >
              View Prep Schedule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

