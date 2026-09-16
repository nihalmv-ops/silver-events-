import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import {
  ARRANGEMENT_CATEGORIES,
  ARRANGEMENT_STATUSES,
} from '../../hooks/useArrangements'

export function ArrangementModal({
  isOpen,
  onClose,
  onSave,
  itemToEdit,
  events = [],
  currentEventId,
  currentDayNumber,
}) {
  const [category, setCategory] = useState(ARRANGEMENT_CATEGORIES[0])
  const [title, setTitle] = useState('')
  const [specification, setSpecification] = useState('')
  const [eventId, setEventId] = useState(currentEventId || '')
  const [dayNumber, setDayNumber] = useState(currentDayNumber || 1)
  const [status, setStatus] = useState('Pending')
  const [vendor, setVendor] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (itemToEdit) {
      setCategory(itemToEdit.category || ARRANGEMENT_CATEGORIES[0])
      setTitle(itemToEdit.title || '')
      setSpecification(itemToEdit.specification || '')
      setEventId(itemToEdit.eventId || currentEventId || '')
      setDayNumber(itemToEdit.dayNumber || currentDayNumber || 1)
      setStatus(itemToEdit.status || 'Pending')
      setVendor(itemToEdit.vendor || '')
      setNotes(itemToEdit.notes || '')
    } else {
      setCategory(ARRANGEMENT_CATEGORIES[0])
      setTitle('')
      setSpecification('')
      setEventId(currentEventId || (events[0]?.id ?? ''))
      setDayNumber(currentDayNumber || 1)
      setStatus('Pending')
      setVendor('')
      setNotes('')
    }
  }, [itemToEdit, currentEventId, currentDayNumber, events, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      category,
      title: title.trim() || `${category} Setup`,
      specification: specification.trim(),
      eventId,
      dayNumber: Number(dayNumber) || 1,
      status,
      vendor: vendor.trim(),
      notes: notes.trim(),
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={itemToEdit ? `Edit Arrangement — ${itemToEdit.category}` : 'Add Event Arrangement Checklist Item'}
      description="Configure on-site venue facilities, stage, power, audio, lighting, and hospitality gear."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0f172a] block">
              Arrangement Category (18 Categories)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              {ARRANGEMENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Arrangement Task / Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 125 kVA Silent Commercial Generator"
            required
          />
        </div>

        <Input
          label="Technical Specification & Requirements"
          value={specification}
          onChange={(e) => setSpecification(e.target.value)}
          placeholder="e.g. Dual automatic transfer switch diesel generator for kitchen & single counter"
          required
        />

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0f172a] block">
              Arrangement Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              {ARRANGEMENT_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Contractor / Vendor Responsible"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            placeholder="e.g. Reliable Power Gensets"
          />
        </div>

        <Input
          label="Operational Notes / Staging Check"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Fully fueled with 250 liters diesel reserve"
        />

        <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e8f0]">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {itemToEdit ? 'Save Changes' : 'Add Arrangement Item'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
