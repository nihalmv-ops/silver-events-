import React, { useState, useMemo } from 'react'
import {
  ClockAlert,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Search,
  Filter,
  Check,
  Edit2,
  Trash2,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCheck,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { TaskModal } from '../components/tasks/TaskModal'
import {
  useTasks,
  TASK_CATEGORIES,
  TASK_PRIORITIES,
} from '../hooks/useTasks'
import { useEvents } from '../hooks/useEvents'
import { formatNumber, formatDate } from '../utils/formatters'
import { useToast } from '../components/ui/ToastContext'

export function Pending() {
  const toast = useToast()
  const { events } = useEvents()
  const {
    tasks,
    completeTask,
    updateTask,
    deleteTask,
    createTask,
  } = useTasks()

  // Selected event & day
  const [selectedEventId, setSelectedEventId] = useState(
    events[0]?.id || 'evt-college-3day'
  )
  const [selectedDayNumber, setSelectedDayNumber] = useState(1)

  // Filters
  const [viewTab, setViewTab] = useState('Pending') // 'Pending' or 'Completed'
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPriority, setSelectedPriority] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)

  // Today string for Due Today comparison
  const todayStr = new Date().toISOString().split('T')[0]

  // Active event
  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0] || {}
  }, [events, selectedEventId])

  const eventDays = currentEvent?.days || []

  // All pending tasks across selected event/day
  const eventPendingTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesEvent = !selectedEventId || t.eventId === selectedEventId
      const matchesDay = !selectedDayNumber || t.dayNumber === selectedDayNumber
      return matchesEvent && matchesDay && t.status !== 'Completed'
    })
  }, [tasks, selectedEventId, selectedDayNumber])

  // 4 Core Dashboard KPIs
  const totalPending = eventPendingTasks.length
  const urgentCount = eventPendingTasks.filter((t) => t.priority === 'High').length
  const dueTodayCount = eventPendingTasks.filter(
    (t) => t.dueDate === todayStr || t.dueDate === currentEvent.startDate
  ).length
  const upcomingCount = eventPendingTasks.filter(
    (t) => t.dueDate > todayStr && t.dueDate !== currentEvent.startDate
  ).length

  // Filtered list based on viewTab, category, priority, and search
  const displayedItems = useMemo(() => {
    return tasks.filter((t) => {
      const matchesEvent = !selectedEventId || t.eventId === selectedEventId
      const matchesDay = !selectedDayNumber || t.dayNumber === selectedDayNumber
      const matchesStatus =
        viewTab === 'Pending' ? t.status !== 'Completed' : t.status === 'Completed'
      const matchesCategory =
        selectedCategory === 'All' || t.category === selectedCategory
      const matchesPriority =
        selectedPriority === 'All' || t.priority === selectedPriority
      const matchesSearch =
        searchQuery.trim() === '' ||
        t.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.responsiblePerson &&
          t.responsiblePerson.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase()))

      return (
        matchesEvent &&
        matchesDay &&
        matchesStatus &&
        matchesCategory &&
        matchesPriority &&
        matchesSearch
      )
    })
  }, [
    tasks,
    selectedEventId,
    selectedDayNumber,
    viewTab,
    selectedCategory,
    selectedPriority,
    searchQuery,
  ])

  // Complete action: Moves to Completed immediately!
  const handleComplete = (id, taskName) => {
    completeTask(id)
    toast.success('Pending Item Resolved', `"${taskName}" marked as completed and archived.`)
  }

  const handleDelete = (id, taskName) => {
    if (window.confirm(`Are you sure you want to dismiss and delete "${taskName}"?`)) {
      deleteTask(id)
      toast.info('Item Removed', `"${taskName}" removed.`)
    }
  }

  const handleSaveModal = (data) => {
    if (taskToEdit) {
      updateTask(taskToEdit.id, data)
      toast.success('Updated', `"${data.task}" updated.`)
    } else {
      createTask(data)
      toast.success('Pending Action Added', `"${data.task}" logged.`)
    }
    setTaskToEdit(null)
  }

  const getPriorityBadgeVariant = (p) => {
    switch (p) {
      case 'High':
        return 'danger'
      case 'Medium':
        return 'warning'
      case 'Low':
      default:
        return 'info'
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Actions Command Center"
        description="Immediate event bottlenecks, pending quality sign-offs, and department coordination for the Event Manager."
        badge={`${urgentCount} Urgent • ${totalPending} Pending`}
        badgeVariant={urgentCount > 0 ? 'danger' : totalPending > 0 ? 'gold' : 'success'}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => {
              setTaskToEdit(null)
              setIsModalOpen(true)
            }}
          >
            Add Action Item
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

      {/* 4 REQUIRED PENDING DASHBOARD METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* 1. Total Pending */}
        <Card className="p-4 space-y-1.5 border-l-4 border-l-[#163324]">
          <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
            Total Pending
          </span>
          <p className="text-3xl font-black text-[#0f172a] font-sans">
            {totalPending}
          </p>
          <p className="text-[11px] text-[#64748b]">Unresolved items for Day {selectedDayNumber}</p>
        </Card>

        {/* 2. Urgent */}
        <Card className="p-4 space-y-1.5 border-l-4 border-l-[#dc2626]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#dc2626] uppercase tracking-wider">
              Urgent
            </span>
            {urgentCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626] animate-ping" />
            )}
          </div>
          <p className="text-3xl font-black text-[#dc2626] font-sans">
            {urgentCount}
          </p>
          <p className="text-[11px] text-[#dc2626] font-medium">Requires immediate action</p>
        </Card>

        {/* 3. Due Today */}
        <Card className="p-4 space-y-1.5 border-l-4 border-l-[#d97706]">
          <span className="text-xs font-semibold text-[#d97706] uppercase tracking-wider">
            Due Today
          </span>
          <p className="text-3xl font-black text-[#d97706] font-sans">
            {dueTodayCount}
          </p>
          <p className="text-[11px] text-[#64748b]">Targeted for today's service</p>
        </Card>

        {/* 4. Upcoming */}
        <Card className="p-4 space-y-1.5 border-l-4 border-l-[#0284c7]">
          <span className="text-xs font-semibold text-[#0284c7] uppercase tracking-wider">
            Upcoming
          </span>
          <p className="text-3xl font-black text-[#0284c7] font-sans">
            {upcomingCount}
          </p>
          <p className="text-[11px] text-[#64748b]">Scheduled for next days</p>
        </Card>
      </div>

      {/* 10 CATEGORY PILLS BAR */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#64748b]">
          <span className="font-semibold uppercase tracking-wider">
            Filter by Department / Operational Category:
          </span>
          <span>{TASK_CATEGORIES.length} Categories</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-[#163324] text-[#d4af37] shadow-sm'
                : 'bg-white text-[#475569] hover:bg-[#f1f5f9] border border-[#e2e8f0]'
            }`}
          >
            All Categories
          </button>

          {TASK_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#163324] text-[#d4af37] shadow-sm'
                  : 'bg-white text-[#475569] hover:bg-[#f1f5f9] border border-[#e2e8f0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH, PRIORITY & VIEW TABS */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pending actions, person responsible, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#64748b]">Priority:</span>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-[#cbd5e1] bg-white text-xs font-semibold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
              >
                <option value="All">All Priorities</option>
                {TASK_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* View Tab Toggle: Active Pending vs Completed Archive */}
            <div className="flex items-center bg-[#f1f5f9] p-0.5 rounded-lg border border-[#e2e8f0]">
              <button
                onClick={() => setViewTab('Pending')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  viewTab === 'Pending'
                    ? 'bg-white text-[#163324] shadow-sm'
                    : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                Active Pending ({eventPendingTasks.length})
              </button>
              <button
                onClick={() => setViewTab('Completed')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  viewTab === 'Completed'
                    ? 'bg-white text-[#163324] shadow-sm'
                    : 'text-[#64748b] hover:text-[#0f172a]'
                }`}
              >
                Resolved / Completed
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* PENDING ITEMS INTERACTIVE LIST */}
      {displayedItems.length > 0 ? (
        <div className="space-y-3">
          {displayedItems.map((item) => (
            <Card
              key={item.id}
              className={`p-4 border transition-all hover:shadow-sm ${
                item.status === 'Completed'
                  ? 'bg-[#f8fafc] border-[#e2e8f0] opacity-80'
                  : item.priority === 'High'
                  ? 'border-l-4 border-l-[#dc2626] bg-white shadow-xs'
                  : 'bg-white border-[#e2e8f0]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-[11px] font-bold">
                      {item.category}
                    </Badge>
                    <Badge variant={getPriorityBadgeVariant(item.priority)} className="text-[11px]">
                      {item.priority} Priority
                    </Badge>
                    <span className="text-xs text-[#64748b]">
                      Due: <strong className="text-[#0f172a]">{formatDate(item.dueDate)}</strong>
                    </span>
                  </div>

                  <h4
                    className={`font-bold text-sm sm:text-base ${
                      item.status === 'Completed' ? 'line-through text-[#64748b]' : 'text-[#0f172a]'
                    }`}
                  >
                    {item.task}
                  </h4>

                  {item.notes && (
                    <p className="text-xs text-[#475569] leading-relaxed italic bg-[#fbf6ed]/40 p-2 rounded border border-[#fbf6ed]">
                      "{item.notes}"
                    </p>
                  )}

                  <div className="text-xs text-[#64748b]">
                    <span>Assigned to: </span>
                    <strong className="text-[#0f172a]">{item.responsiblePerson}</strong>
                  </div>
                </div>

                {/* FAST ACTION BUTTONS */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {item.status !== 'Completed' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-[#059669] hover:bg-[#047857] text-white shadow-sm"
                      leftIcon={<Check className="w-3.5 h-3.5 stroke-[3]" />}
                      onClick={() => handleComplete(item.id, item.task)}
                    >
                      Complete
                    </Button>
                  ) : (
                    <span className="text-xs font-bold text-[#059669] flex items-center gap-1 bg-[#ecfdf5] px-2.5 py-1 rounded-lg border border-[#a7f3d0]">
                      <CheckCheck className="w-3.5 h-3.5" /> Completed
                    </span>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setTaskToEdit(item)
                      setIsModalOpen(true)
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#dc2626] hover:bg-[#fef2f2]"
                    leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                    onClick={() => handleDelete(item.id, item.task)}
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
          icon={ClockAlert}
          title={viewTab === 'Pending' ? 'No Pending Actions' : 'No Completed Items'}
          description={
            viewTab === 'Pending'
              ? `All tasks in "${selectedCategory}" are complete or up to date for Day ${selectedDayNumber}. Great job!`
              : 'No resolved items in this category yet.'
          }
          action={
            viewTab === 'Pending' ? (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => {
                  setTaskToEdit(null)
                  setIsModalOpen(true)
                }}
              >
                Add Action Item
              </Button>
            ) : null
          }
        />
      )}

      {/* MODAL */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setTaskToEdit(null)
        }}
        onSave={handleSaveModal}
        taskToEdit={taskToEdit}
        events={events}
        currentEventId={selectedEventId}
        currentDayNumber={selectedDayNumber}
      />
    </div>
  )
}
