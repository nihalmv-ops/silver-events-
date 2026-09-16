import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import {
  STAFF_ROLES,
  ATTENDANCE_STATUSES,
  STAFF_STATUSES,
} from '../../hooks/useStaff'

export function StaffModal({
  isOpen,
  onClose,
  onSave,
  staffToEdit,
  events = [],
  currentEventId,
  currentDayNumber,
}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState(STAFF_ROLES[0])
  const [department, setDepartment] = useState('Operations & Management')
  const [eventId, setEventId] = useState(currentEventId || '')
  const [dayNumber, setDayNumber] = useState(currentDayNumber || 1)
  const [responsibility, setResponsibility] = useState('')
  const [attendance, setAttendance] = useState('Present')
  const [status, setStatus] = useState('Active')

  useEffect(() => {
    if (staffToEdit) {
      setName(staffToEdit.name || '')
      setPhone(staffToEdit.phone || '')
      setRole(staffToEdit.role || STAFF_ROLES[0])
      setDepartment(staffToEdit.department || 'Operations & Management')
      setEventId(staffToEdit.eventId || currentEventId || '')
      setDayNumber(staffToEdit.dayNumber || currentDayNumber || 1)
      setResponsibility(staffToEdit.responsibility || '')
      setAttendance(staffToEdit.attendance || 'Present')
      setStatus(staffToEdit.status || 'Active')
    } else {
      setName('')
      setPhone('+91 ')
      setRole(STAFF_ROLES[0])
      setDepartment('Operations & Management')
      setEventId(currentEventId || (events[0]?.id ?? ''))
      setDayNumber(currentDayNumber || 1)
      setResponsibility('')
      setAttendance('Present')
      setStatus('Active')
    }
  }, [staffToEdit, currentEventId, currentDayNumber, events, isOpen])

  // Automatically adjust department based on role selection
  const handleRoleChange = (newRole) => {
    setRole(newRole)
    if (newRole.includes('Kitchen')) {
      setDepartment('Kitchen Production')
    } else if (newRole === 'Packing Team') {
      setDepartment('Packaging & Thermal Staging')
    } else if (newRole === 'Distribution Team' || newRole === 'Queue Management') {
      setDepartment('Distribution & Counter')
    } else if (newRole === 'Water Team') {
      setDepartment('Hydration & Water')
    } else if (newRole === 'Runner' || newRole === 'Logistics') {
      setDepartment('Logistics & Transport')
    } else if (newRole === 'Cleaning') {
      setDepartment('Grounds & Sanitation')
    } else {
      setDepartment('Operations & Management')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      name: name.trim(),
      phone: phone.trim(),
      role,
      department,
      eventId,
      dayNumber: Number(dayNumber) || 1,
      responsibility: responsibility.trim(),
      attendance,
      status,
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={staffToEdit ? `Edit Staff Member — ${staffToEdit.name}` : 'Assign Crew Member'}
      description="Register operational staff, captains, supervisors, runners, or cleaners."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Staff Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Muhammed Shafi"
            required
          />

          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98470 12345"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0f172a] block">
              Operational Role (12 Standard Roles)
            </label>
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              {STAFF_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Department / Unit"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="e.g. Distribution & Counter"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0f172a] block">
              Assign to Event
            </label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0f172a] block">
              Day Number
            </label>
            <select
              value={dayNumber}
              onChange={(e) => setDayNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              <option value={1}>Day 1</option>
              <option value={2}>Day 2</option>
              <option value={3}>Day 3</option>
            </select>
          </div>
        </div>

        <Input
          label="Specific Operational Responsibility"
          value={responsibility}
          onChange={(e) => setResponsibility(e.target.value)}
          placeholder="e.g. Single Main Distribution Counter oversight and steward coordination"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0f172a] block">
              Attendance
            </label>
            <select
              value={attendance}
              onChange={(e) => setAttendance(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              {ATTENDANCE_STATUSES.map((att) => (
                <option key={att} value={att}>
                  {att}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0f172a] block">
              Duty Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              {STAFF_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e8f0]">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {staffToEdit ? 'Save Changes' : 'Assign Crew Member'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
