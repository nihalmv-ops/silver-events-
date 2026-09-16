import React, { useState, useMemo } from 'react'
import {
  Layers,
  LayoutTemplate,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  CheckSquare,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { ArrangementModal } from '../components/arrangements/ArrangementModal'
import {
  useArrangements,
  ARRANGEMENT_CATEGORIES,
  ARRANGEMENT_STATUSES,
} from '../hooks/useArrangements'
import { useEvents } from '../hooks/useEvents'
import { formatNumber } from '../utils/formatters'
import { useToast } from '../components/ui/ToastContext'

export function Arrangements() {
  const toast = useToast()
  const { events } = useEvents()
  const {
    arrangements,
    categories,
    addArrangement,
    updateArrangement,
    deleteArrangement,
    cycleStatus,
  } = useArrangements()

  // Selected event & day
  const [selectedEventId, setSelectedEventId] = useState(
    events[0]?.id || 'evt-college-3day'
  )
  const [selectedDayNumber, setSelectedDayNumber] = useState(1)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState(null)

  // Active event
  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0] || {}
  }, [events, selectedEventId])

  const eventDays = currentEvent?.days || []

  // Filtered checklist items
  const filteredItems = useMemo(() => {
    return arrangements.filter((item) => {
      const matchesEvent = !selectedEventId || item.eventId === selectedEventId
      const matchesDay = !selectedDayNumber || item.dayNumber === selectedDayNumber
      const matchesStatus =
        statusFilter === 'All' || item.status === statusFilter
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.specification.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.vendor && item.vendor.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesEvent && matchesDay && matchesStatus && matchesSearch
    })
  }, [arrangements, selectedEventId, selectedDayNumber, statusFilter, searchQuery])

  // Completion stats
  const totalCount = filteredItems.length
  const completedCount = filteredItems.filter((i) => i.status === 'Completed').length
  const readyCount = filteredItems.filter((i) => i.status === 'Ready').length
  const orderedCount = filteredItems.filter((i) => i.status === 'Ordered').length
  const pendingCount = filteredItems.filter((i) => i.status === 'Pending').length

  const readinessPct =
    totalCount > 0
      ? Math.round(((completedCount + readyCount) / totalCount) * 100)
      : 0

  const handleSaveArrangement = (data) => {
    if (itemToEdit) {
      updateArrangement(itemToEdit.id, data)
      toast.success('Arrangement Updated', `${data.category} setup details saved.`)
    } else {
      addArrangement(data)
      toast.success('Arrangement Added', `${data.category} added to event checklist.`)
    }
    setItemToEdit(null)
  }

  const handleDeleteArrangement = (id, category) => {
    if (window.confirm(`Are you sure you want to remove "${category}" from this event checklist?`)) {
      deleteArrangement(id)
      toast.info('Arrangement Removed', `${category} removed from list.`)
    }
  }

  const handleCycleStatus = (item) => {
    cycleStatus(item.id)
    toast.info('Status Stepped', `${item.category} transitioned to next stage.`)
  }

  const getStatusBadgeVariant = (st) => {
    switch (st) {
      case 'Completed':
        return 'success'
      case 'Ready':
        return 'primary'
      case 'Ordered':
        return 'gold'
      case 'Pending':
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Event Arrangements & Facilities Setup"
        description="Comprehensive 18-point checklist: Venue, Stage, Sound, Lighting, Tables, Security, and Single Counter Staging."
        badge={`${completedCount + readyCount} / ${totalCount} Operational (${readinessPct}%)`}
        badgeVariant={readinessPct >= 80 ? 'success' : 'gold'}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => {
              setItemToEdit(null)
              setIsModalOpen(true)
            }}
          >
            Add Checklist Item
          </Button>
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

      {/* OVERALL READINESS PROGRESS CARD */}
      <Card className="p-5 bg-white border border-[#e2e8f0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#163324] text-[#d4af37] flex items-center justify-center">
              <LayoutTemplate className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0f172a]">
                On-Site Facilities Readiness — {currentDay.dayLabel || `Day ${currentDay.dayNumber}`}
              </h3>
              <p className="text-xs text-[#64748b]">
                {completedCount} Completed • {readyCount} Ready on Floor • {orderedCount} Ordered • {pendingCount} Pending
              </p>
            </div>
          </div>
          <span className="text-xl font-extrabold text-[#163324] font-sans">
            {readinessPct}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#f1f5f9] rounded-full h-3 overflow-hidden border border-[#e2e8f0]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              readinessPct === 100
                ? 'bg-[#059669]'
                : readinessPct >= 75
                ? 'bg-[#163324]'
                : 'bg-[#9d8050]'
            }`}
            style={{ width: `${readinessPct}%` }}
          />
        </div>
      </Card>

      {/* SEARCH & STATUS FILTER PILLS */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by category, title, specs, or vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Pending', 'Ordered', 'Ready', 'Completed'].map((st) => (
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
      </Card>

      {/* 18 ARRANGEMENT CATEGORIES CHECKLIST GRID */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className={`p-4 border transition-all hover:shadow-md space-y-3 ${
                item.status === 'Completed'
                  ? 'border-[#a7f3d0] bg-[#f0fdf4]/30'
                  : item.status === 'Ready'
                  ? 'border-[#bae6fd] bg-[#f0f9ff]/30'
                  : 'border-[#e2e8f0] bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="font-bold text-xs">
                  {item.category}
                </Badge>

                {/* 1-Click Status Stepper */}
                <button
                  onClick={() => handleCycleStatus(item)}
                  className="hover:scale-105 transition-transform"
                  title="Click to advance status: Pending -> Ordered -> Ready -> Completed"
                >
                  <Badge variant={getStatusBadgeVariant(item.status)}>
                    {item.status}
                  </Badge>
                </button>
              </div>

              <div>
                <h4 className="font-bold text-[#0f172a] text-sm leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                  {item.specification}
                </p>
              </div>

              <div className="pt-2 border-t border-[#f1f5f9] flex items-center justify-between text-xs text-[#64748b]">
                <div className="truncate mr-2">
                  <span className="font-semibold text-[#0f172a]">Vendor:</span>{' '}
                  <span>{item.vendor || 'In-House'}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<Edit2 className="w-3 h-3" />}
                    onClick={() => {
                      setItemToEdit(item)
                      setIsModalOpen(true)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="text-[#dc2626] hover:bg-[#fef2f2]"
                    leftIcon={<Trash2 className="w-3 h-3" />}
                    onClick={() => handleDeleteArrangement(item.id, item.category)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title="No Arrangement Items"
          description={`No arrangements found matching "${searchQuery || statusFilter}" for Day ${selectedDayNumber}.`}
          action={
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                setItemToEdit(null)
                setIsModalOpen(true)
              }}
            >
              Add Checklist Item
            </Button>
          }
        />
      )}

      {/* MODAL */}
      <ArrangementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setItemToEdit(null)
        }}
        onSave={handleSaveArrangement}
        itemToEdit={itemToEdit}
        events={events}
        currentEventId={selectedEventId}
        currentDayNumber={selectedDayNumber}
      />
    </div>
  )
}
