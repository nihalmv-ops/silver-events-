import React, { useState, useMemo } from 'react'
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  Sparkles,
  Calendar,
  AlertCircle,
  Play,
  RotateCcw,
  Layers,
  ArrowRight,
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
  TASK_STATUSES,
} from '../hooks/useTasks'
import { useEvents } from '../hooks/useEvents'
import { formatNumber, formatDate } from '../utils/formatters'
import { useToast } from '../components/ui/ToastContext'

export function Tasks() {
  const toast = useToast()
  const { events } = useEvents()
  const {
    tasks,
    categories,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    toggleTaskStatus,
    generateEventTasks,
  } = useTasks()

  // Selected event & day
  const [selectedEventId, setSelectedEventId] = useState(
    events[0]?.id || 'evt-college-3day'
  )
  const [selectedDayNumber, setSelectedDayNumber] = useState(1)

  // Filters
  const [activeTab, setActiveTab] = useState('All') // 'All', 'Pending', 'In Progress', 'Completed'
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState(null)

  // Active event
  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0] || {}
  }, [events, selectedEventId])

  const eventDays = currentEvent?.days || []

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesEvent = !selectedEventId || t.eventId === selectedEventId
      const matchesDay = !selectedDayNumber || t.dayNumber === selectedDayNumber
      const matchesTab = activeTab === 'All' || t.status === activeTab
      const matchesCategory =
        categoryFilter === 'All' || t.category === categoryFilter
      const matchesPriority =
        priorityFilter === 'All' || t.priority === priorityFilter
      const matchesSearch =
        searchQuery.trim() === '' ||
        t.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.responsiblePerson &&
          t.responsiblePerson.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase()))

      return (
        matchesEvent &&
        matchesDay &&
        matchesTab &&
        matchesCategory &&
        matchesPriority &&
        matchesSearch
      )
    })
  }, [
    tasks,
    selectedEventId,
    selectedDayNumber,
    activeTab,
    categoryFilter,
    priorityFilter,
    searchQuery,
  ])

  // Counts
  const totalTasks = tasks.filter(
    (t) => (!selectedEventId || t.eventId === selectedEventId) && (!selectedDayNumber || t.dayNumber === selectedDayNumber)
  ).length
  const pendingCount = tasks.filter(
    (t) =>
      (!selectedEventId || t.eventId === selectedEventId) &&
      (!selectedDayNumber || t.dayNumber === selectedDayNumber) &&
      t.status === 'Pending'
  ).length
  const inProgressCount = tasks.filter(
    (t) =>
      (!selectedEventId || t.eventId === selectedEventId) &&
      (!selectedDayNumber || t.dayNumber === selectedDayNumber) &&
      t.status === 'In Progress'
  ).length
  const completedCount = tasks.filter(
    (t) =>
      (!selectedEventId || t.eventId === selectedEventId) &&
      (!selectedDayNumber || t.dayNumber === selectedDayNumber) &&
      t.status === 'Completed'
  ).length

  const handleSaveTask = (data) => {
    if (taskToEdit) {
      updateTask(taskToEdit.id, data)
      toast.success('Task Updated', `"${data.task}" updated.`)
    } else {
      createTask(data)
      toast.success('Task Created', `"${data.task}" added to operations board.`)
    }
    setTaskToEdit(null)
  }

  const handleDeleteTask = (id, title) => {
    if (window.confirm(`Are you sure you want to delete task "${title}"?`)) {
      deleteTask(id)
      toast.info('Task Deleted', `"${title}" removed from board.`)
    }
  }

  const handleToggleStatus = (id, currentStatus) => {
    toggleTaskStatus(id)
    toast.info('Status Updated', 'Task transitioned to next stage.')
  }

  const handleGenerateTemplate = () => {
    generateEventTasks(currentEvent.id, currentEvent.name, currentEvent.startDate)
    toast.success(
      '14 Automatic Tasks Generated',
      'Standard event execution checklists initialized successfully.'
    )
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

  const getStatusBadgeVariant = (s) => {
    switch (s) {
      case 'Completed':
        return 'success'
      case 'In Progress':
        return 'gold'
      case 'Pending':
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations Tasks & Checklists"
        description="Comprehensive operational action items, chef checklists, counter setup, and vendor coordination."
        badge={`${completedCount} / ${totalTasks} Completed`}
        badgeVariant={completedCount === totalTasks && totalTasks > 0 ? 'success' : 'gold'}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#9d8050]" />}
              onClick={handleGenerateTemplate}
              title="Generate 14 automatic event tasks"
            >
              Generate 14 Event Tasks
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                setTaskToEdit(null)
                setIsModalOpen(true)
              }}
            >
              Add Task
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

      {/* STATUS TABS & METRICS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#e2e8f0]">
        {[
          { label: 'All Tasks', value: 'All', count: totalTasks },
          { label: 'Pending', value: 'Pending', count: pendingCount },
          { label: 'In Progress', value: 'In Progress', count: inProgressCount },
          { label: 'Completed', value: 'Completed', count: completedCount },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-t-lg text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === tab.value
                ? 'border-[#163324] text-[#163324] bg-white'
                : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#f1f5f9] text-[#475569]">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* SEARCH & FILTERS BAR */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks, responsible person, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#64748b]">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-[#cbd5e1] bg-white text-xs font-semibold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
              >
                <option value="All">All Categories</option>
                {TASK_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#64748b]">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
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
          </div>
        </div>
      </Card>

      {/* TASKS LIST / GRID */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-3">
          {filteredTasks.map((t) => (
            <Card
              key={t.id}
              className={`p-4 border transition-all hover:shadow-sm ${
                t.status === 'Completed'
                  ? 'bg-[#f8fafc] border-[#e2e8f0] opacity-80'
                  : t.priority === 'High'
                  ? 'border-l-4 border-l-[#dc2626] bg-white'
                  : 'bg-white border-[#e2e8f0]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-[11px]">
                      {t.category}
                    </Badge>
                    <Badge variant={getPriorityBadgeVariant(t.priority)} className="text-[11px]">
                      {t.priority} Priority
                    </Badge>
                    <button
                      onClick={() => handleToggleStatus(t.id, t.status)}
                      className="hover:scale-105 transition-transform"
                      title="Click to cycle status: Pending -> In Progress -> Completed"
                    >
                      <Badge variant={getStatusBadgeVariant(t.status)} className="text-[11px]">
                        {t.status}
                      </Badge>
                    </button>
                  </div>

                  <h4
                    className={`font-bold text-sm sm:text-base ${
                      t.status === 'Completed'
                        ? 'line-through text-[#64748b]'
                        : 'text-[#0f172a]'
                    }`}
                  >
                    {t.task}
                  </h4>

                  {t.notes && (
                    <p className="text-xs text-[#64748b] leading-relaxed">
                      {t.notes}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#475569] pt-1">
                    <div>
                      <span className="font-semibold text-[#0f172a]">Assignee:</span>{' '}
                      <span>{t.responsiblePerson}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#0f172a]">Due:</span>{' '}
                      <span>{formatDate(t.dueDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  {t.status !== 'Completed' ? (
                    <Button
                      variant="outline"
                      size="xs"
                      className="text-[#059669] border-[#a7f3d0] hover:bg-[#ecfdf5]"
                      leftIcon={<CheckCircle2 className="w-3 h-3" />}
                      onClick={() => {
                        completeTask(t.id)
                        toast.success('Task Completed', `"${t.task}" marked completed.`)
                      }}
                    >
                      Complete
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="xs"
                      leftIcon={<RotateCcw className="w-3 h-3" />}
                      onClick={() => handleToggleStatus(t.id, t.status)}
                    >
                      Reopen
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<Edit2 className="w-3 h-3" />}
                    onClick={() => {
                      setTaskToEdit(t)
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
                    onClick={() => handleDeleteTask(t.id, t.task)}
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
          icon={CheckSquare}
          title="No Tasks Found"
          description={`No tasks found matching "${searchQuery || activeTab}" for Day ${selectedDayNumber}. Click "Generate 14 Event Tasks" to load the master template.`}
          action={
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                setTaskToEdit(null)
                setIsModalOpen(true)
              }}
            >
              Add Operations Task
            </Button>
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
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        events={events}
        currentEventId={selectedEventId}
        currentDayNumber={selectedDayNumber}
      />
    </div>
  )
}
