import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Users,
  MapPin,
  Calendar,
  Layers,
  Phone,
  Mail,
  AlertTriangle,
  Building2,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { EventModal } from '../components/events/EventModal'
import { useEvents } from '../hooks/useEvents'
import { formatNumber, formatDate } from '../utils/formatters'
import { useToast } from '../components/ui/ToastContext'

export function Events() {
  const navigate = useNavigate()
  const toast = useToast()
  const { events, createEvent, updateEvent, deleteEvent } = useEvents()

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [eventToEdit, setEventToEdit] = useState(null)
  const [eventToDelete, setEventToDelete] = useState(null)

  // Derived filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesSearch =
        evt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evt.code.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === 'All' ? true : evt.status.toLowerCase() === statusFilter.toLowerCase()

      const matchesType =
        typeFilter === 'All' ? true : evt.type.toLowerCase() === typeFilter.toLowerCase()

      return matchesSearch && matchesStatus && matchesType
    })
  }, [events, searchTerm, statusFilter, typeFilter])

  // Overview Counts
  const totalCount = events.length
  const ongoingCount = events.filter((e) => e.status === 'Ongoing').length
  const upcomingCount = events.filter((e) => e.status === 'Upcoming').length
  const completedCount = events.filter((e) => e.status === 'Completed').length

  const handleSaveEvent = (payload) => {
    if (eventToEdit) {
      updateEvent(eventToEdit.id, payload)
      setEventToEdit(null)
    } else {
      createEvent(payload)
    }
  }

  const confirmDelete = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete.id)
      toast.info('Event Removed', `"${eventToDelete.name}" has been deleted from event records.`)
      setEventToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Event Management"
        description="Comprehensive master schedule of multi-day college festivals, royal wedding banquets, and celebration catering functions."
        badge={`${totalCount} Total Registered`}
        badgeVariant="primary"
        actions={
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEventToEdit(null)
              setIsCreateModalOpen(true)
            }}
          >
            Create Event
          </Button>
        }
      />

      {/* Top 4 Quick Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Events"
          value={formatNumber(totalCount)}
          subtext="Master catering register"
          icon={CalendarDays}
          accentColor="primary"
        />
        <StatCard
          title="Ongoing Events"
          value={formatNumber(ongoingCount)}
          subtext="Live on ground today"
          trend="Live Operations"
          trendType="active"
          icon={CalendarDays}
          accentColor="success"
        />
        <StatCard
          title="Upcoming Events"
          value={formatNumber(upcomingCount)}
          subtext="Next scheduled dates"
          icon={CalendarDays}
          accentColor="gold"
        />
        <StatCard
          title="Completed Events"
          value={formatNumber(completedCount)}
          subtext="Delivered successfully"
          icon={CalendarDays}
          accentColor="silver"
        />
      </div>

      {/* Controls Bar: Search & Status Filters */}
      <Card className="p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94a3b8]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by event, client, venue, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[#0f172a] placeholder:text-[#94a3b8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163324]/20 focus:border-[#163324] transition-all"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Ongoing', 'Upcoming', 'Completed'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-[#163324] text-white shadow-sm'
                  : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:text-[#0f172a]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </Card>

      {/* Events Table (Desktop) & Card List (Mobile) */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No Events Found"
          description="No catering events match your current search query or filter selection. Try adjusting your filters or schedule a new event."
          phase="Event Directory"
          action={
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('All')
                setIsCreateModalOpen(true)
              }}
            >
              Schedule New Event
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-[#e2e8f0] bg-white shadow-card">
            <table className="w-full caption-bottom text-sm text-left">
              <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-xs font-semibold text-[#475569] uppercase tracking-wider">
                <tr>
                  <th className="p-4">Event Name & Code</th>
                  <th className="p-4">Client / Organizer</th>
                  <th className="p-4">Venue</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Days</th>
                  <th className="p-4">Total Guests</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9] bg-white text-[#334155]">
                {filteredEvents.map((evt) => (
                  <tr
                    key={evt.id}
                    className="hover:bg-[#f8fafc] transition-colors group cursor-pointer"
                    onClick={() => navigate(`/events/${evt.id}`)}
                  >
                    {/* Event Name */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-[#0f172a] block text-sm group-hover:text-[#163324]">
                          {evt.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-[#64748b]">{evt.code}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-[11px] text-[#9d8050] font-medium">{evt.type}</span>
                        </div>
                      </div>
                    </td>

                    {/* Client */}
                    <td className="p-4">
                      <div className="text-xs space-y-0.5">
                        <p className="font-semibold text-[#0f172a]">{evt.clientName}</p>
                        <p className="text-[#64748b]">{evt.clientPhone}</p>
                      </div>
                    </td>

                    {/* Venue */}
                    <td className="p-4 max-w-xs">
                      <div className="flex items-center gap-1.5 text-xs text-[#475569]">
                        <MapPin className="w-3.5 h-3.5 text-[#9d8050] shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="text-xs space-y-0.5">
                        <span className="font-medium text-[#0f172a]">
                          {formatDate(evt.startDate)}
                        </span>
                        {evt.startDate !== evt.endDate && (
                          <span className="text-[#64748b] block text-[11px]">
                            to {formatDate(evt.endDate)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Days */}
                    <td className="p-4 whitespace-nowrap">
                      <Badge variant="gold" size="sm">
                        {evt.numberOfDays} {evt.numberOfDays === 1 ? 'Day' : 'Days'}
                      </Badge>
                    </td>

                    {/* Guests */}
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#163324]" />
                        <span className="font-bold text-[#0f172a] font-sans">
                          {formatNumber(evt.totalExpectedGuests)} Pax
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4 whitespace-nowrap">
                      <Badge
                        variant={
                          evt.status === 'Ongoing'
                            ? 'success'
                            : evt.status === 'Completed'
                            ? 'default'
                            : 'gold'
                        }
                        size="sm"
                        withDot={evt.status === 'Ongoing'}
                      >
                        {evt.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => navigate(`/events/${evt.id}`)}
                          className="p-1.5 rounded-lg text-[#64748b] hover:text-[#163324] hover:bg-[#f1f5f9] transition-colors"
                          title="View Event Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEventToEdit(evt)}
                          className="p-1.5 rounded-lg text-[#64748b] hover:text-[#c29c5e] hover:bg-[#fbf6ed] transition-colors"
                          title="Edit Event"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEventToDelete(evt)}
                          className="p-1.5 rounded-lg text-[#64748b] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden space-y-3">
            {filteredEvents.map((evt) => (
              <Card
                key={evt.id}
                className="p-4 space-y-3 hover:border-[#cbd5e1] transition-colors"
                onClick={() => navigate(`/events/${evt.id}`)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-[#0f172a] leading-tight">
                      {evt.name}
                    </h4>
                    <span className="text-[11px] font-mono text-[#64748b]">{evt.code}</span>
                  </div>
                  <Badge
                    variant={
                      evt.status === 'Ongoing'
                        ? 'success'
                        : evt.status === 'Completed'
                        ? 'default'
                        : 'gold'
                    }
                    size="sm"
                    withDot={evt.status === 'Ongoing'}
                  >
                    {evt.status}
                  </Badge>
                </div>

                <div className="text-xs space-y-1 text-[#475569] pt-1 border-t border-[#f1f5f9]">
                  <p className="flex items-center gap-1.5 truncate">
                    <Building2 className="w-3.5 h-3.5 text-[#9d8050] shrink-0" />
                    <span>{evt.venue}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#163324] shrink-0" />
                    <span className="font-semibold text-[#0f172a]">
                      {formatNumber(evt.totalExpectedGuests)} Guests • {evt.numberOfDays} Days
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {formatDate(evt.startDate)} {evt.startDate !== evt.endDate && `— ${formatDate(evt.endDate)}`}
                    </span>
                  </p>
                </div>

                {/* Mobile Actions */}
                <div
                  className="flex items-center justify-between pt-2 border-t border-[#f1f5f9]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs py-1"
                    onClick={() => navigate(`/events/${evt.id}`)}
                  >
                    View Details
                  </Button>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEventToEdit(evt)}
                      className="p-2 rounded text-[#64748b] hover:bg-[#f1f5f9]"
                      aria-label="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEventToDelete(evt)}
                      className="p-2 rounded text-[#ef4444] hover:bg-[#fef2f2]"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create / Edit Event Modal */}
      <EventModal
        isOpen={isCreateModalOpen || Boolean(eventToEdit)}
        onClose={() => {
          setIsCreateModalOpen(false)
          setEventToEdit(null)
        }}
        onSave={handleSaveEvent}
        eventToEdit={eventToEdit}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(eventToDelete)}
        onClose={() => setEventToDelete(null)}
        title="Delete Catering Event?"
        description="This action will permanently delete this event schedule and its day-by-day logs from the system."
        size="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setEventToDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={confirmDelete}>
              Confirm Delete
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3 p-3 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-[#991b1b]">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold">Confirm removal of:</p>
            <p className="font-medium text-[#0f172a]">{eventToDelete?.name}</p>
            <p className="text-[#64748b]">Code: {eventToDelete?.code}</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
