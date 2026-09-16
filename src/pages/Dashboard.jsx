import React from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarDays,
  Clock,
  Activity,
  CheckCircle2,
  Users,
  ChefHat,
  PackageCheck,
  Truck,
  PackageMinus,
  Droplets,
  CheckSquare,
  ReceiptText,
  DollarSign,
  TrendingUp,
  Flame,
  Sparkles,
  RefreshCw,
  ArrowRight,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { QuickActions } from '../components/dashboard/QuickActions'
import { ActiveEventCard } from '../components/dashboard/ActiveEventCard'
import { mockDashboardData } from '../data/mockDashboardData'
import { formatNumber, formatCurrency } from '../utils/formatters'
import { useToast } from '../components/ui/ToastContext'
import { useFinance } from '../hooks/useFinance'

const statIcons = {
  CalendarDays,
  Clock,
  Activity,
  CheckCircle2,
}

export function Dashboard() {
  const { eventStats, activeEvent, todayOperations } = mockDashboardData
  const toast = useToast()
  const { getDailyFinancials, getThreeDayFinancials } = useFinance()

  const todayFinancials = getDailyFinancials('evt-college-3day', 1)
  const threeDayFinancials = getThreeDayFinancials('evt-college-3day')

  const handleSync = () => {
    toast.success(
      'Operations Synced',
      'Counters, kitchen batches, and transport telemetry are updated.'
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Operations Command Dashboard"
        description="Real-time administration for active catering events, batch preparation, thermal carrier dispatches, and on-site distribution."
        badge="Manager Shift Active"
        badgeVariant="success"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={handleSync}
            >
              Live Sync
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Flame className="w-3.5 h-3.5 text-[#c29c5e]" />}
              onClick={() =>
                toast.info(
                  'Counter Telemetry',
                  'Main dining buffet counters 1-16: Food warmers at 72°C. Inflow steady.'
                )
              }
            >
              Counters Live
            </Button>
          </div>
        }
      />

      {/* Quick Actions Panel */}
      <QuickActions />

      {/* 4 Top Level Event Overview Cards */}
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

      {/* Featured Active Event Card */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#475569]">
            Active Catering Event
          </h3>
          <span className="text-xs text-[#10b981] font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
            Live Operation
          </span>
        </div>
        <ActiveEventCard event={activeEvent} />
      </div>

      {/* Executive Event Financial Command Section (Phase 12) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#475569] flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#163324]" />
              Event Financial Command & Daily Yield
            </h3>
            <p className="text-xs text-[#64748b] mt-0.5">
              Live meal portion sales, operations expenditure ledger, and net profit margins
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/sales">
              <Button variant="outline" size="sm" className="text-xs">
                Sales Ledger
              </Button>
            </Link>
            <Link to="/financials">
              <Button variant="primary" size="sm" className="text-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Financial Summary
              </Button>
            </Link>
          </div>
        </div>

        {/* 6 Executive Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {/* 1. Today's Sales / Income */}
          <Card className="p-4 bg-white border border-[#e2e8f0] hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                  Today's Sales
                </p>
                <p className="text-lg font-bold text-[#163324] mt-1 font-mono">
                  {formatCurrency(todayFinancials.totalSales)}
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#163324]/10 text-[#163324] flex items-center justify-center font-bold text-xs">
                ₹
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[10px] text-[#64748b]">
              <span>Day 1 Portions</span>
              <span className="font-semibold text-[#163324]">5,000 Pax</span>
            </div>
          </Card>

          {/* 2. Today's Expenses */}
          <Card className="p-4 bg-white border border-[#e2e8f0] hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                  Today's Expenses
                </p>
                <p className="text-lg font-bold text-red-600 mt-1 font-mono">
                  {formatCurrency(todayFinancials.totalExpenses)}
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <ReceiptText className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[10px] text-[#64748b]">
              <span>Raw Materials</span>
              <span className="font-semibold text-red-600">Disbursed</span>
            </div>
          </Card>

          {/* 3. Today's Net Income */}
          <Card className="p-4 bg-white border border-[#e2e8f0] hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                  Today's Net Income
                </p>
                <p className="text-lg font-bold text-emerald-700 mt-1 font-mono">
                  {formatCurrency(todayFinancials.netIncome)}
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[10px] text-[#64748b]">
              <span>Margin</span>
              <span className="font-bold text-emerald-700">
                {todayFinancials.totalSales > 0
                  ? `${((todayFinancials.netIncome / todayFinancials.totalSales) * 100).toFixed(1)}%`
                  : '0%'}
              </span>
            </div>
          </Card>

          {/* 4. 3-Day Total Sales / Income */}
          <Card className="p-4 bg-white border border-[#e2e8f0] hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                  3-Day Total Sales
                </p>
                <p className="text-lg font-bold text-[#163324] mt-1 font-mono">
                  {formatCurrency(threeDayFinancials.totalSales)}
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#c29c5e]/20 text-[#b08b4e] flex items-center justify-center font-bold text-xs">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[10px] text-[#64748b]">
              <span>30,000 Pax</span>
              <span className="font-semibold text-[#163324]">Biryani + Water</span>
            </div>
          </Card>

          {/* 5. 3-Day Total Expenses */}
          <Card className="p-4 bg-white border border-[#e2e8f0] hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                  3-Day Expenses
                </p>
                <p className="text-lg font-bold text-red-600 mt-1 font-mono">
                  {formatCurrency(threeDayFinancials.totalExpenses)}
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold">
                <ReceiptText className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[10px] text-[#64748b]">
              <span>19 Categories</span>
              <span className="font-semibold text-red-600">Reconciled</span>
            </div>
          </Card>

          {/* 6. 3-Day Net Income */}
          <Card className="p-4 bg-white border border-[#e2e8f0] hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                  3-Day Net Income
                </p>
                <p className="text-lg font-bold text-emerald-700 mt-1 font-mono">
                  {formatCurrency(threeDayFinancials.finalNetIncome)}
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-[10px] text-[#64748b]">
              <span>Final Event Yield</span>
              <span className="font-bold text-emerald-700">
                {threeDayFinancials.totalSales > 0
                  ? `${((threeDayFinancials.finalNetIncome / threeDayFinancials.totalSales) * 100).toFixed(1)}%`
                  : '0%'}
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Manager Operational Execution Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#475569]">
            Today's Operational Execution Metrics
          </h3>
          <span className="text-xs text-[#64748b]">Real-time field logs</span>
        </div>

        {/* 8 Execution Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
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
                    ({formatNumber(todayOperations.expectedGuests.arrived)} arrived)
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>

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
              {todayOperations.expectedGuests.note}
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
                    {formatNumber(todayOperations.foodPrepared.total)}
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

            <div className="space-y-1">
              <div className="w-full bg-[#f1f5f9] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#163324] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${todayOperations.foodPrepared.value}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#64748b]">
                <span>Central Kitchen Batch</span>
                <span className="font-semibold">100% Cooked</span>
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
                    {formatNumber(todayOperations.foodPacked.total)}
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

            <div className="space-y-1">
              <div className="w-full bg-[#f1f5f9] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#0284c7] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${todayOperations.foodPacked.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#64748b]">
                <span>Insulated Carriers</span>
                <span className="font-semibold">{todayOperations.foodPacked.percentage}%</span>
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
                  <span className="text-2xl font-bold text-[#059669]">
                    {formatNumber(todayOperations.foodDelivered.total)}
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

            <div className="space-y-1">
              <div className="w-full bg-[#f1f5f9] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#059669] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${todayOperations.foodDelivered.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#64748b]">
                <span>Buffet Staging</span>
                <span className="font-semibold">{todayOperations.foodDelivered.percentage}%</span>
              </div>
            </div>
            <p className="text-[11px] text-[#64748b] pt-1 border-t border-[#f1f5f9] line-clamp-1">
              {todayOperations.foodDelivered.note}
            </p>
          </Card>

          {/* 5. Food Remaining */}
          <Card className="p-5 space-y-3 hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  Food Remaining
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-[#d97706]">
                    {formatNumber(todayOperations.foodRemaining.total)}
                  </span>
                  <Badge variant={todayOperations.foodRemaining.badgeVariant} size="sm">
                    {todayOperations.foodRemaining.badge}
                  </Badge>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#fffbeb] text-[#d97706] flex items-center justify-center">
                <PackageMinus className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="w-full bg-[#f1f5f9] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#f59e0b] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${todayOperations.foodRemaining.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#64748b]">
                <span>Staged Buffer Reserve</span>
                <span className="font-semibold">{todayOperations.foodRemaining.percentage}%</span>
              </div>
            </div>
            <p className="text-[11px] text-[#64748b] pt-1 border-t border-[#f1f5f9] line-clamp-1">
              {todayOperations.foodRemaining.note}
            </p>
          </Card>

          {/* 6. Water Delivered */}
          <Card className="p-5 space-y-3 hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  Water Delivered
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-[#0284c7]">
                    {formatNumber(todayOperations.waterDelivered.total)}
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

            <div className="space-y-1">
              <div className="w-full bg-[#f1f5f9] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#0284c7] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${todayOperations.waterDelivered.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#64748b]">
                <span>Distributed Bottles</span>
                <span className="font-semibold">{todayOperations.waterDelivered.percentage}%</span>
              </div>
            </div>
            <p className="text-[11px] text-[#64748b] pt-1 border-t border-[#f1f5f9] line-clamp-1">
              {todayOperations.waterDelivered.note}
            </p>
          </Card>

          {/* 7. Water Remaining */}
          <Card className="p-5 space-y-3 hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                  Water Remaining
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold text-[#0f172a]">
                    {formatNumber(todayOperations.waterRemaining.total)}
                  </span>
                  <Badge variant={todayOperations.waterRemaining.badgeVariant} size="sm">
                    {todayOperations.waterRemaining.badge}
                  </Badge>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#f8fafc] text-[#475569] flex items-center justify-center">
                <Droplets className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="w-full bg-[#f1f5f9] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#94a3b8] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${todayOperations.waterRemaining.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#64748b]">
                <span>Crated Cold Storage</span>
                <span className="font-semibold">{todayOperations.waterRemaining.percentage}%</span>
              </div>
            </div>
            <p className="text-[11px] text-[#64748b] pt-1 border-t border-[#f1f5f9] line-clamp-1">
              {todayOperations.waterRemaining.note}
            </p>
          </Card>

          {/* 8. Pending Tasks */}
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
                    {todayOperations.pendingTasks.urgentCount} High Priority
                  </Badge>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#fffbeb] text-[#d97706] flex items-center justify-center">
                <CheckSquare className="w-5 h-5" />
              </div>
            </div>

            <p className="text-xs text-[#64748b]">
              Immediate action items on live buffet line.
            </p>

            <div className="pt-1 border-t border-[#f1f5f9] flex items-center justify-between text-[11px]">
              <span className="text-[#92400e] font-medium">Raitha & Pickle refill</span>
              <span className="text-[#ef4444] font-semibold">Immediate</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Row: Interactive Pending Tasks & Internal Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Tasks Checklist */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>On-Site Pending Actions ({todayOperations.pendingTasks.count})</CardTitle>
                <CardDescription>
                  Click to mark operational items resolved on the ground
                </CardDescription>
              </div>
              <Badge variant="warning">Live Field Checklist</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayOperations.pendingTasks.items.map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between p-3.5 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] hover:bg-white hover:border-[#cbd5e1] transition-colors gap-3"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-[#163324] focus:ring-[#163324]/20 cursor-pointer accent-[#163324]"
                    onChange={(e) => {
                      if (e.target.checked) {
                        toast.success('Checklist Updated', `"${task.title}" verified as resolved.`)
                      }
                    }}
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#0f172a] leading-tight">
                      {task.title}
                    </p>
                    <p className="text-[11px] text-[#64748b] mt-0.5">
                      Responsible: <span className="text-[#334155] font-medium">{task.assignedTo}</span>
                    </p>
                  </div>
                </div>

                <Badge
                  variant={task.urgency === 'high' ? 'danger' : task.urgency === 'medium' ? 'warning' : 'default'}
                  size="sm"
                  className="shrink-0"
                >
                  {task.due}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Today's Operational Expenses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today's Operational Expenses</CardTitle>
              <div className="w-8 h-8 rounded-lg bg-[#fbf6ed] text-[#9d8050] flex items-center justify-center">
                <ReceiptText className="w-4 h-4" />
              </div>
            </div>
            <CardDescription>
              Internal fuel, ice, temporary crew & LPG (no customer billing)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
              <span className="text-xs text-[#64748b] block font-medium">Total Execution Cost</span>
              <span className="text-2xl font-bold text-[#0f172a] font-sans">
                {formatCurrency(todayOperations.todayExpenses.total)}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-[#475569] uppercase tracking-wider block">
                Itemized Logistics:
              </span>
              {todayOperations.todayExpenses.breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-2 rounded-md bg-[#f8fafc] border border-[#f1f5f9]"
                >
                  <span className="text-[#475569] truncate pr-2">{item.category}</span>
                  <span className="font-semibold text-[#0f172a] shrink-0">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-[#94a3b8] italic">
              *All expenses reconcile with venue operations petty voucher slips.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
