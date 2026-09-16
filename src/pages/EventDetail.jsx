import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
  Edit2,
  UtensilsCrossed,
  Droplets,
  PackageCheck,
  Truck,
  PackageMinus,
  ChefHat,
  Receipt,
  CheckSquare,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Layers,
  Building2,
  ExternalLink,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { EventModal } from '../components/events/EventModal'
import { useEvents } from '../hooks/useEvents'
import { formatNumber, formatCurrency, formatDate } from '../utils/formatters'
import { useToast } from '../components/ui/ToastContext'

export function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { getEventById, updateEvent } = useEvents()

  const event = getEventById(id)

  const [activeTab, setActiveTab] = useState('overview')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  if (!event) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/events')}
        >
          Back to Events Register
        </Button>
        <EmptyState
          icon={Calendar}
          title="Event Not Found"
          description="The catering event you requested does not exist or has been removed from the schedule."
          action={
            <Button variant="primary" size="sm" onClick={() => navigate('/events')}>
              Return to Events List
            </Button>
          }
        />
      </div>
    )
  }

  const handleUpdateEvent = (payload) => {
    updateEvent(event.id, payload)
  }

  const daysList = event.days || []
  const currentDayData = daysList.find((d) => `day-${d.dayNumber}` === activeTab)

  return (
    <div className="space-y-6">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/events')}
          className="text-[#475569] hover:text-[#0f172a] self-start"
        >
          Back to Events Register
        </Button>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit2 className="w-3.5 h-3.5" />}
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit Event Schedule
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              toast.success('Live Sheet Generated', `Operations summary ready for ${event.name}.`)
            }
          >
            Print Operations Sheet
          </Button>
        </div>
      </div>

      {/* Main Event Hero Banner */}
      <div className="rounded-2xl bg-[#0e1f16] text-white p-6 sm:p-8 border border-[#244b36] shadow-card relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#c29c5e]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-mono text-[#c29c5e] font-semibold">{event.code}</span>
            <span className="text-white/30">•</span>
            <Badge variant="gold" size="sm" className="bg-[#c29c5e]/25 text-[#dfbe82] border-[#c29c5e]/40">
              {event.type}
            </Badge>
            <span className="text-white/30">•</span>
            <Badge
              variant={
                event.status === 'Ongoing'
                  ? 'success'
                  : event.status === 'Completed'
                  ? 'default'
                  : 'gold'
              }
              size="sm"
              withDot={event.status === 'Ongoing'}
            >
              {event.status}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white font-sans">
            {event.name}
          </h1>

          {/* Key Facts Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-white/10 text-xs text-[#cbd5e1]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#c29c5e] shrink-0" />
              <div>
                <span className="text-[10px] text-[#94a3b8] block">Venue</span>
                <span className="font-medium text-white">{event.venue}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#c29c5e] shrink-0" />
              <div>
                <span className="text-[10px] text-[#94a3b8] block">Schedule</span>
                <span className="font-medium text-white">
                  {formatDate(event.startDate)} {event.startDate !== event.endDate && `— ${formatDate(event.endDate)}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#c29c5e] shrink-0" />
              <div>
                <span className="text-[10px] text-[#94a3b8] block">Total Expected</span>
                <span className="font-bold text-white text-sm font-sans">
                  {formatNumber(event.totalExpectedGuests)} Pax ({event.numberOfDays} Days)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#c29c5e] shrink-0" />
              <div>
                <span className="text-[10px] text-[#94a3b8] block">Client Contact</span>
                <span className="font-medium text-white truncate block">
                  {event.clientName} ({event.clientPhone})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs System: Overview + Day 1 + Day 2 + Day 3... */}
      <div className="border-b border-[#e2e8f0]">
        <nav className="flex space-x-2 overflow-x-auto pb-px no-scrollbar">
          {/* Overview Tab Button */}
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#163324] text-[#163324] bg-white rounded-t-lg'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a] hover:border-gray-300'
            }`}
          >
            Multi-Day Overview
          </button>

          {/* Dynamic Day Tabs */}
          {daysList.map((day) => {
            const tabId = `day-${day.dayNumber}`
            const isSelected = activeTab === tabId

            return (
              <button
                key={day.dayNumber}
                type="button"
                onClick={() => setActiveTab(tabId)}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? 'border-[#163324] text-[#163324] bg-white rounded-t-lg'
                    : 'border-transparent text-[#64748b] hover:text-[#0f172a] hover:border-gray-300'
                }`}
              >
                <span>Day {day.dayNumber}</span>
                <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-gray-100 text-gray-700">
                  {formatNumber(day.expectedGuests)} Pax
                </span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Daily Guest Planning Summary Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Daily Guest & Execution Schedule</CardTitle>
                  <CardDescription>
                    Multi-day attendance planning and operational staging for {event.numberOfDays} days
                  </CardDescription>
                </div>
                <Badge variant="gold">
                  {formatNumber(event.totalExpectedGuests)} Total Guests
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border border-[#e2e8f0]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#f8fafc] text-[#475569] font-bold uppercase tracking-wider border-b border-[#e2e8f0]">
                    <tr>
                      <th className="p-3">Day</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Expected Guests</th>
                      <th className="p-3">Primary Menu Item</th>
                      <th className="p-3">Food Packed</th>
                      <th className="p-3">Food Delivered</th>
                      <th className="p-3">Water Delivered</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Day Tab</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9] text-[#334155]">
                    {daysList.map((d) => (
                      <tr key={d.dayNumber} className="hover:bg-[#f8fafc] transition-colors">
                        <td className="p-3 font-bold text-[#0f172a]">Day {d.dayNumber}</td>
                        <td className="p-3 text-[#64748b]">{d.date || '—'}</td>
                        <td className="p-3 font-semibold text-[#0f172a] font-sans">
                          {formatNumber(d.expectedGuests)} Pax
                        </td>
                        <td className="p-3 max-w-xs truncate">{d.foodItem || d.foodRequired}</td>
                        <td className="p-3 text-[#0284c7] font-medium">
                          {formatNumber(d.foodPacked)}
                        </td>
                        <td className="p-3 text-[#059669] font-bold">
                          {formatNumber(d.foodDelivered)}
                        </td>
                        <td className="p-3 text-[#0284c7]">
                          {formatNumber(d.waterDelivered)}
                        </td>
                        <td className="p-3">
                          <Badge
                            variant={
                              d.counterStatus === 'OPEN'
                                ? 'success'
                                : d.counterStatus === 'CLOSED'
                                ? 'default'
                                : 'gold'
                            }
                            size="sm"
                          >
                            {d.counterStatus || 'PLANNED'}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-[11px] py-1 px-2.5"
                            onClick={() => setActiveTab(`day-${d.dayNumber}`)}
                          >
                            Inspect Day {d.dayNumber}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Venue and Catering Coordination Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 space-y-3">
              <h4 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#c29c5e]" />
                Venue & Site Logistics
              </h4>
              <p className="text-xs text-[#64748b] leading-relaxed">
                Venue Location: <strong className="text-[#0f172a]">{event.venue}</strong>.
                Central kitchen delivery staging zone at Service Gate #2 with direct loading dock access.
              </p>
              <div className="pt-2 border-t border-[#f1f5f9] text-xs text-[#334155] space-y-1">
                <p>• Clean water connection & 3-phase commercial power verified on site.</p>
                <p>• Banana leaf dining tables and waste management bins staged.</p>
              </div>
            </Card>

            <Card className="p-5 space-y-3">
              <h4 className="text-sm font-bold text-[#0f172a] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#163324]" />
                Client & Administrative Team
              </h4>
              <div className="text-xs space-y-1 text-[#475569]">
                <p>
                  Organizer: <strong className="text-[#0f172a]">{event.clientName}</strong>
                </p>
                <p>
                  Contact: <span className="text-[#0f172a]">{event.clientPhone}</span> • {event.clientEmail}
                </p>
                <p>
                  Assigned Operations Lead: <strong className="text-[#163324]">{event.cateringManager || 'Capt. Pradeep Menon'}</strong>
                </p>
              </div>
              <div className="pt-2 border-t border-[#f1f5f9] text-[11px] text-[#64748b]">
                Emergency field operations hotline: +91 98464 15767
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab Content 2: Individual Day (Day 1, Day 2, Day 3...) */}
      {currentDayData && (
        <div className="space-y-6">
          {/* Day Identity Banner */}
          <div className="p-5 rounded-xl bg-white border border-[#e2e8f0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#0f172a]">
                  {currentDayData.dayLabel || `Day ${currentDayData.dayNumber}`}
                </h3>
                <Badge
                  variant={currentDayData.counterStatus === 'OPEN' ? 'success' : 'gold'}
                  size="sm"
                  withDot={currentDayData.counterStatus === 'OPEN'}
                >
                  Counter: {currentDayData.counterStatus || 'PLANNED'}
                </Badge>
              </div>
              <p className="text-xs text-[#64748b] mt-0.5">
                Expected Day Headcount: <strong className="text-[#0f172a]">{formatNumber(currentDayData.expectedGuests)} Guests</strong>
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                toast.info(
                  `Day ${currentDayData.dayNumber} Sync`,
                  `Refreshed field logs for ${currentDayData.dayLabel}.`
                )
              }
            >
              Refresh Day Logs
            </Button>
          </div>

          {/* The Specific Day Operational Cards Required:
              Expected Guests, Food Required, Food Prepared, Food Packed, Food Delivered,
              Food Remaining, Water Required, Water Delivered, Water Remaining */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Expected Guests */}
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Expected Guests
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#0f172a] font-sans">
                {formatNumber(currentDayData.expectedGuests)}
              </p>
              <p className="text-[11px] text-[#64748b]">Scheduled for today's dining session</p>
            </Card>

            {/* 2. Food Required */}
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Food Required
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#fbf6ed] text-[#9d8050] flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
              </div>
              <p className="text-lg font-bold text-[#0f172a] truncate">
                {currentDayData.foodRequired}
              </p>
              <p className="text-[11px] text-[#64748b] truncate">{currentDayData.foodItem}</p>
            </Card>

            {/* 3. Food Prepared */}
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Food Prepared
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#163324]/10 text-[#163324] flex items-center justify-center">
                  <ChefHat className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#0f172a] font-sans">
                {formatNumber(currentDayData.foodPrepared)} Pax
              </p>
              <p className="text-[11px] text-[#059669] font-medium">Central Kitchen batches</p>
            </Card>

            {/* 4. Food Packed */}
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Food Packed
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#f0f9ff] text-[#0284c7] flex items-center justify-center">
                  <PackageCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#0284c7] font-sans">
                {formatNumber(currentDayData.foodPacked)}
              </p>
              <p className="text-[11px] text-[#64748b]">Insulated thermal carrier boxes</p>
            </Card>

            {/* 5. Food Delivered */}
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Food Delivered
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#059669] font-sans">
                {formatNumber(currentDayData.foodDelivered)}
              </p>
              <p className="text-[11px] text-[#64748b]">Staged at live dining buffet lines</p>
            </Card>

            {/* 6. Food Remaining */}
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Food Remaining
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#fffbeb] text-[#d97706] flex items-center justify-center">
                  <PackageMinus className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#d97706] font-sans">
                {formatNumber(currentDayData.foodRemaining)}
              </p>
              <p className="text-[11px] text-[#9d8050] font-medium">Staged buffer for secondary inflow</p>
            </Card>

            {/* 7. Water Required */}
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Water Required
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#f0f9ff] text-[#0284c7] flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xl font-bold text-[#0f172a]">
                {currentDayData.waterRequired}
              </p>
              <p className="text-[11px] text-[#64748b]">Hydration stations & dining tables</p>
            </Card>

            {/* 8. Water Delivered */}
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Water Delivered
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] text-[#059669] flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#059669] font-sans">
                {formatNumber(currentDayData.waterDelivered)}
              </p>
              <p className="text-[11px] text-[#64748b]">Chilled bottles delivered on site</p>
            </Card>

            {/* 9. Water Remaining */}
            <Card className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  Water Remaining
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#f8fafc] text-[#475569] flex items-center justify-center">
                  <Droplets className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-[#0f172a] font-sans">
                {formatNumber(currentDayData.waterRemaining)}
              </p>
              <p className="text-[11px] text-[#64748b]">In refrigerated transport truck</p>
            </Card>
          </div>

          {/* Assigned Daily Catering Menu */}
          <Card className="overflow-hidden border border-[#e2e8f0]">
            <CardHeader className="bg-[#f8fafc]/50 border-b border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#163324] text-[#d4af37] flex items-center justify-center">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-base">
                    Day {currentDayData.dayNumber} Assigned Catering Menu
                  </CardTitle>
                </div>
                <CardDescription className="mt-1">
                  Dishes and beverages configured for {formatNumber(currentDayData.expectedGuests)} expected guests on {currentDayData.dayLabel}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ExternalLink className="w-3.5 h-3.5 text-[#9d8050]" />}
                onClick={() =>
                  navigate('/catering-menu', {
                    state: {
                      selectedEventId: event.id,
                      selectedDay: currentDayData.dayNumber,
                    },
                  })
                }
              >
                Manage in Catering Planning
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {currentDayData.menu && currentDayData.menu.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3">Dish / Beverage Name</th>
                        <th className="px-5 py-3">Category</th>
                        <th className="px-5 py-3 text-right">Planned Quantity</th>
                        <th className="px-5 py-3">Operational Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                      {currentDayData.menu.map((dish) => (
                        <tr key={dish.id} className="hover:bg-[#fbf6ed]/30 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-[#0f172a]">
                            {dish.name}
                          </td>
                          <td className="px-5 py-3.5">
                            <Badge
                              variant={
                                dish.category === 'Non-Vegetarian'
                                  ? 'danger'
                                  : dish.category === 'Vegetarian'
                                  ? 'success'
                                  : 'secondary'
                              }
                              className="text-[11px]"
                            >
                              {dish.category}
                            </Badge>
                          </td>
                          <td className="px-5 py-3.5 text-right font-sans font-bold text-[#163324]">
                            {formatNumber(dish.quantity)} <span className="text-xs font-normal text-[#64748b]">{dish.unit}</span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-[#64748b]">
                            {dish.notes || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-[#64748b] space-y-2">
                  <UtensilsCrossed className="w-8 h-8 text-[#94a3b8] mx-auto opacity-60" />
                  <p className="text-sm font-medium text-[#0f172a]">No Menu Items Assigned for Day {currentDayData.dayNumber}</p>
                  <p className="text-xs">Configure dishes and water quotas in the Catering & Menu Management hub.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() =>
                      navigate('/catering-menu', {
                        state: {
                          selectedEventId: event.id,
                          selectedDay: currentDayData.dayNumber,
                        },
                      })
                    }
                  >
                    Assign Day {currentDayData.dayNumber} Menu
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Row: Expenses, Tasks, Pending & Notes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 10. Operational Expenses */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Day {currentDayData.dayNumber} Operational Expenses</CardTitle>
                    <CardDescription>
                      Internal execution logistics spend (fuel, ice, temporary labor, LPG)
                    </CardDescription>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-[#fbf6ed] text-[#9d8050] flex items-center justify-center">
                    <Receipt className="w-4 h-4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-xs text-[#64748b] block font-medium">Day Execution Total</span>
                  <span className="text-2xl font-bold text-[#0f172a] font-sans">
                    {formatCurrency(currentDayData.expenses)}
                  </span>
                </div>

                {currentDayData.expensesBreakdown && currentDayData.expensesBreakdown.length > 0 && (
                  <div className="space-y-1.5">
                    {currentDayData.expensesBreakdown.map((exp, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-xs p-2 rounded-md bg-[#f8fafc] border border-[#f1f5f9]"
                      >
                        <span className="text-[#475569]">{exp.item}</span>
                        <span className="font-semibold text-[#0f172a]">
                          {formatCurrency(exp.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-[10px] text-[#94a3b8] italic">
                  *Internal operations register only. No customer invoicing or sales.
                </p>
              </CardContent>
            </Card>

            {/* 11. Tasks Checklist */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Day {currentDayData.dayNumber} Operations Tasks</CardTitle>
                    <CardDescription>Ground checklist for stewards and chefs</CardDescription>
                  </div>
                  <Badge variant="primary">
                    {currentDayData.tasks?.length || 0} Tasks
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {(!currentDayData.tasks || currentDayData.tasks.length === 0) ? (
                  <p className="text-xs text-[#64748b] italic">No active tasks logged for this day.</p>
                ) : (
                  currentDayData.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]"
                    >
                      <input
                        type="checkbox"
                        defaultChecked={task.done}
                        className="mt-0.5 rounded border-gray-300 text-[#163324] focus:ring-[#163324]/20 cursor-pointer accent-[#163324]"
                        onChange={(e) => {
                          if (e.target.checked) {
                            toast.success('Task Completed', `"${task.title}" marked as resolved.`)
                          }
                        }}
                      />
                      <span
                        className={`text-xs ${
                          task.done ? 'line-through text-[#94a3b8]' : 'text-[#0f172a] font-medium'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* 12. Pending Actions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Day {currentDayData.dayNumber} Pending Actions</CardTitle>
                    <CardDescription>Time-sensitive alerts on site</CardDescription>
                  </div>
                  <Badge variant="warning">
                    {currentDayData.pending?.length || 0} Alerts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {(!currentDayData.pending || currentDayData.pending.length === 0) ? (
                  <p className="text-xs text-[#64748b] italic">All pending actions resolved for today.</p>
                ) : (
                  currentDayData.pending.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#fffbeb] border border-[#fde68a] text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-[#d97706] shrink-0" />
                        <span className="text-[#92400e] font-medium">{p.text}</span>
                      </div>
                      <Badge
                        variant={p.urgency === 'high' ? 'danger' : 'warning'}
                        size="sm"
                      >
                        {p.urgency}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* 13. Operations Notes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Kitchen & Field Notes</CardTitle>
                  <FileText className="w-4 h-4 text-[#64748b]" />
                </div>
                <CardDescription>Instructions for shift managers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] text-xs text-[#334155] leading-relaxed">
                  {currentDayData.notes || 'Standard catering service protocols apply.'}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      <EventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateEvent}
        eventToEdit={event}
      />
    </div>
  )
}

