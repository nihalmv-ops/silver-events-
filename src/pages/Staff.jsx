import React, { useState, useMemo } from 'react'
import {
  Users,
  UserPlus,
  BadgeCheck,
  Search,
  Filter,
  Phone,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  ShieldCheck,
  UserCheck,
  Clock,
  Sparkles,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { StaffModal } from '../components/staff/StaffModal'
import { useStaff, STAFF_ROLES } from '../hooks/useStaff'
import { useEvents } from '../hooks/useEvents'
import { formatNumber } from '../utils/formatters'
import { useToast } from '../components/ui/ToastContext'

export function Staff() {
  const toast = useToast()
  const { events } = useEvents()
  const {
    staffList,
    roles,
    addStaff,
    updateStaff,
    deleteStaff,
    toggleAttendance,
  } = useStaff()

  // Selected event & day for staff filtering
  const [selectedEventId, setSelectedEventId] = useState(
    events[0]?.id || 'evt-college-3day'
  )
  const [selectedDayNumber, setSelectedDayNumber] = useState(1)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('All')

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [staffToEdit, setStaffToEdit] = useState(null)

  // Active event
  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0] || {}
  }, [events, selectedEventId])

  const eventDays = currentEvent?.days || []

  // Filtered staff
  const filteredStaff = useMemo(() => {
    return staffList.filter((m) => {
      // Event & Day Match
      const matchesEvent = !selectedEventId || m.eventId === selectedEventId
      const matchesDay = !selectedDayNumber || m.dayNumber === selectedDayNumber

      // Role filter
      const matchesRole = selectedRole === 'All' || m.role === selectedRole

      // Search query
      const matchesSearch =
        searchQuery.trim() === '' ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.responsibility.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesEvent && matchesDay && matchesRole && matchesSearch
    })
  }, [staffList, selectedEventId, selectedDayNumber, selectedRole, searchQuery])

  // Summary Metrics for current day
  const totalCrew = filteredStaff.length
  const presentCount = filteredStaff.filter(
    (s) => s.attendance === 'Present' || s.attendance === 'On Duty'
  ).length
  const onDutyCount = filteredStaff.filter((s) => s.attendance === 'On Duty').length
  const queueMarshalsCount = filteredStaff.filter(
    (s) => s.role === 'Queue Management' || s.role === 'Distribution Team'
  ).length

  const handleSaveStaff = (data) => {
    if (staffToEdit) {
      updateStaff(staffToEdit.id, data)
      toast.success('Staff Updated', `${data.name}'s profile and duty role updated.`)
    } else {
      addStaff(data)
      toast.success('Staff Assigned', `${data.name} assigned to ${data.role}.`)
    }
    setStaffToEdit(null)
  }

  const handleDeleteStaff = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from this event roster?`)) {
      deleteStaff(id)
      toast.info('Staff Removed', `${name} unassigned from roster.`)
    }
  }

  const getAttendanceBadgeVariant = (att) => {
    switch (att) {
      case 'Present':
        return 'success'
      case 'On Duty':
        return 'gold'
      case 'Late':
        return 'warning'
      case 'Absent':
      default:
        return 'danger'
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff & Service Crew Management"
        description="Event operations managers, kitchen supervisors, single counter distribution crew, and queue marshals."
        badge={`${presentCount} / ${totalCrew} Present`}
        badgeVariant={presentCount === totalCrew && totalCrew > 0 ? 'success' : 'gold'}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<UserPlus className="w-3.5 h-3.5" />}
            onClick={() => {
              setStaffToEdit(null)
              setIsModalOpen(true)
            }}
          >
            Assign Crew Member
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

      {/* 4 CREW OVERVIEW METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1.5 border-l-4 border-l-[#163324]">
          <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
            Total Assigned Crew
          </span>
          <p className="text-2xl font-black text-[#0f172a] font-sans">
            {totalCrew}
          </p>
          <p className="text-[11px] text-[#64748b]">Scheduled for Day {selectedDayNumber}</p>
        </Card>

        <Card className="p-4 space-y-1.5 border-l-4 border-l-[#059669]">
          <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
            Present on Site
          </span>
          <p className="text-2xl font-black text-[#059669] font-sans">
            {presentCount}
          </p>
          <p className="text-[11px] text-[#059669] font-medium">
            {totalCrew > 0 ? Math.round((presentCount / totalCrew) * 100) : 0}% attendance verified
          </p>
        </Card>

        <Card className="p-4 space-y-1.5 border-l-4 border-l-[#9d8050]">
          <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
            Active On Duty
          </span>
          <p className="text-2xl font-black text-[#9d8050] font-sans">
            {onDutyCount}
          </p>
          <p className="text-[11px] text-[#64748b]">On distribution & kitchen lines</p>
        </Card>

        <Card className="p-4 space-y-1.5 border-l-4 border-l-[#0284c7]">
          <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
            Single Counter Marshals
          </span>
          <p className="text-2xl font-black text-[#0284c7] font-sans">
            {queueMarshalsCount}
          </p>
          <p className="text-[11px] text-[#64748b]">Dedicated to ONE Counter flow</p>
        </Card>
      </div>

      {/* SEARCH & ROLE FILTER BAR */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by staff name, phone, or duty role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#64748b]" />
            <span className="text-xs font-semibold text-[#64748b]">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#cbd5e1] bg-white text-xs font-semibold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              <option value="All">All 12 Roles</option>
              {STAFF_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* STAFF ROSTER TABLE */}
      {filteredStaff.length > 0 ? (
        <Card className="overflow-hidden border border-[#e2e8f0]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Name & Contact</th>
                  <th className="px-5 py-3.5">Operational Role</th>
                  <th className="px-5 py-3.5">Department</th>
                  <th className="px-5 py-3.5">Assigned Responsibility</th>
                  <th className="px-5 py-3.5 text-center">Attendance</th>
                  <th className="px-5 py-3.5 text-center">Duty Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-[#fbf6ed]/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-[#0f172a]">{member.name}</div>
                      <div className="text-xs text-[#64748b] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-[#94a3b8]" />
                        <span>{member.phone}</span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <Badge
                        variant={
                          member.role.includes('Supervisor') || member.role.includes('Manager')
                            ? 'gold'
                            : member.role === 'Queue Management' || member.role === 'Distribution Team'
                            ? 'primary'
                            : 'secondary'
                        }
                        className="text-xs"
                      >
                        {member.role}
                      </Badge>
                    </td>

                    <td className="px-5 py-3.5 text-xs text-[#475569] font-medium">
                      {member.department}
                    </td>

                    <td className="px-5 py-3.5 text-xs text-[#334155] max-w-xs">
                      {member.responsibility}
                    </td>

                    {/* Quick 1-Tap Attendance Stepper */}
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => {
                          toggleAttendance(member.id)
                          toast.info('Attendance Toggled', `${member.name} status changed.`)
                        }}
                        className="hover:scale-105 transition-transform"
                        title="Click to cycle attendance"
                      >
                        <Badge variant={getAttendanceBadgeVariant(member.attendance)}>
                          {member.attendance}
                        </Badge>
                      </button>
                    </td>

                    <td className="px-5 py-3.5 text-center">
                      <span className="text-xs font-semibold text-[#0f172a]">
                        {member.status}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="xs"
                          leftIcon={<Edit2 className="w-3 h-3" />}
                          onClick={() => {
                            setStaffToEdit(member)
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
                          onClick={() => handleDeleteStaff(member.id, member.name)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={Users}
          title="No Crew Assigned"
          description={`No staff members found matching "${searchQuery || selectedRole}" for Day ${selectedDayNumber}.`}
          action={
            <Button
              variant="primary"
              size="sm"
              leftIcon={<UserPlus className="w-3.5 h-3.5" />}
              onClick={() => {
                setStaffToEdit(null)
                setIsModalOpen(true)
              }}
            >
              Assign Crew Member
            </Button>
          }
        />
      )}

      {/* MODAL */}
      <StaffModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setStaffToEdit(null)
        }}
        onSave={handleSaveStaff}
        staffToEdit={staffToEdit}
        events={events}
        currentEventId={selectedEventId}
        currentDayNumber={selectedDayNumber}
      />
    </div>
  )
}
