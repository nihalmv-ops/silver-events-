import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import {
  TASK_CATEGORIES,
  TASK_STATUSES,
  TASK_PRIORITIES,
} from '../../hooks/useTasks'

export function TaskModal({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  events = [],
  currentEventId,
  currentDayNumber,
}) {
  const [task, setTask] = useState('')
  const [category, setCategory] = useState(TASK_CATEGORIES[0])
  const [eventId, setEventId] = useState(currentEventId || '')
  const [dayNumber, setDayNumber] = useState(currentDayNumber || 1)
  const [responsiblePerson, setResponsiblePerson] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [status, setStatus] = useState('Pending')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (taskToEdit) {
      setTask(taskToEdit.task || '')
      setCategory(taskToEdit.category || TASK_CATEGORIES[0])
      setEventId(taskToEdit.eventId || currentEventId || '')
      setDayNumber(taskToEdit.dayNumber || currentDayNumber || 1)
      setResponsiblePerson(taskToEdit.responsiblePerson || '')
      setDueDate(taskToEdit.dueDate || new Date().toISOString().split('T')[0])
      setPriority(taskToEdit.priority || 'Medium')
      setStatus(taskToEdit.status || 'Pending')
      setNotes(taskToEdit.notes || '')
    } else {
      setTask('')
      setCategory(TASK_CATEGORIES[0])
      setEventId(currentEventId || (events[0]?.id ?? ''))
      setDayNumber(currentDayNumber || 1)
      setResponsiblePerson('')
      setDueDate(new Date().toISOString().split('T')[0])
      setPriority('Medium')
      setStatus('Pending')
      setNotes('')
    }
  }, [taskToEdit, currentEventId, currentDayNumber, events, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      task: task.trim(),
      category,
      eventId,
      dayNumber: Number(dayNumber) || 1,
      responsiblePerson: responsiblePerson.trim() || 'Operations Captain',
      dueDate,
      priority,
      status,
      notes: notes.trim(),
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edit Task / Action Item' : 'Add Operations Task'}
      description="Assign actionable tasks across event coordination, kitchen prep, water, packing, or arrangements."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Description"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="e.g. Confirm Water Quantity with Kaveri Aqua"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0f172a] block">
              Operational Category (10 Categories)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              {TASK_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Responsible Person"
            value={responsiblePerson}
            onChange={(e) => setResponsiblePerson(e.target.value)}
            placeholder="e.g. Capt. Pradeep Menon"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0f172a] block">
              Event
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Target Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0f172a] block">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              {TASK_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0f172a] block">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              {TASK_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0f172a] block">
            Operational Notes / Action Details
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Check barcode tokens and student union volunteer gate passes before opening."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#163324]"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e8f0]">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {taskToEdit ? 'Save Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
