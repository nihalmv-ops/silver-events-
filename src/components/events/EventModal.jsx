import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Badge } from '../ui/Badge'
import { Calendar, Users, Calculator, Sparkles, Building2, Phone, Mail, FileText } from 'lucide-react'
import { formatNumber } from '../../utils/formatters'
import { useToast } from '../ui/ToastContext'

const EVENT_TYPES = [
  'College Fest',
  'Wedding Reception',
  'Corporate Banquet',
  'Traditional Sadhya',
  'Private Gala',
  'Engagement Feast',
  'Anniversary Celebration',
  'Public Gathering',
]

export function EventModal({ isOpen, onClose, onSave, eventToEdit = null }) {
  const toast = useToast()

  const [name, setName] = useState('')
  const [type, setType] = useState('College Fest')
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [venue, setVenue] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [numberOfDays, setNumberOfDays] = useState(3)
  const [status, setStatus] = useState('Upcoming')

  // Array of guest counts per day, e.g. [10000, 10000, 10000]
  const [dailyGuests, setDailyGuests] = useState([10000, 10000, 10000])

  // Pre-fill fields when editing or reset when creating
  useEffect(() => {
    if (eventToEdit) {
      setName(eventToEdit.name || '')
      setType(eventToEdit.type || 'College Fest')
      setClientName(eventToEdit.clientName || '')
      setClientPhone(eventToEdit.clientPhone || '')
      setClientEmail(eventToEdit.clientEmail || '')
      setVenue(eventToEdit.venue || '')
      setStartDate(eventToEdit.startDate || '')
      setEndDate(eventToEdit.endDate || '')
      setNumberOfDays(eventToEdit.numberOfDays || 1)
      setStatus(eventToEdit.status || 'Upcoming')

      if (eventToEdit.days && eventToEdit.days.length > 0) {
        setDailyGuests(eventToEdit.days.map((d) => d.expectedGuests || 0))
      } else {
        setDailyGuests([eventToEdit.totalExpectedGuests || 1000])
      }
    } else {
      // Default new 3-day event
      setName('')
      setType('College Fest')
      setClientName('')
      setClientPhone('')
      setClientEmail('')
      setVenue('')
      setStartDate(new Date().toISOString().split('T')[0])
      // Default 3 days later
      const future = new Date()
      future.setDate(future.getDate() + 2)
      setEndDate(future.toISOString().split('T')[0])
      setNumberOfDays(3)
      setStatus('Upcoming')
      setDailyGuests([10000, 10000, 10000])
    }
  }, [eventToEdit, isOpen])

  // Adjust dailyGuests array length when numberOfDays changes
  const handleDaysCountChange = (newCount) => {
    const count = Math.max(1, Math.min(10, parseInt(newCount, 10) || 1))
    setNumberOfDays(count)

    setDailyGuests((prev) => {
      const next = [...prev]
      while (next.length < count) {
        // default to last day's count or 5000
        next.push(next[next.length - 1] || 10000)
      }
      return next.slice(0, count)
    })
  }

  // Update specific day's guest count
  const handleDailyGuestChange = (index, value) => {
    const parsedVal = Math.max(0, parseInt(value, 10) || 0)
    setDailyGuests((prev) => {
      const next = [...prev]
      next[index] = parsedVal
      return next
    })
  }

  // Automatic calculation: Total Expected Guests
  const totalExpectedGuests = dailyGuests.reduce((acc, curr) => acc + (Number(curr) || 0), 0)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.warning('Event Name Required', 'Please enter a title for the catering event.')
      return
    }

    if (!clientName.trim()) {
      toast.warning('Client Name Required', 'Please enter the client / organizer contact name.')
      return
    }

    if (!venue.trim()) {
      toast.warning('Venue Required', 'Please specify the event location or dining hall.')
      return
    }

    // Build day objects
    const daysData = dailyGuests.map((guests, idx) => {
      const existingDay = eventToEdit?.days?.[idx]
      return {
        dayNumber: idx + 1,
        dayLabel: `Day ${idx + 1}`,
        expectedGuests: guests,
        foodRequired: `${formatNumber(guests)} Pax Catering Menu`,
        foodItem: existingDay?.foodItem || (idx === 0 ? 'Chicken Biryani' : 'Banquet Meal'),
        foodPrepared: existingDay?.foodPrepared || (status === 'Completed' ? guests : 0),
        foodPacked: existingDay?.foodPacked || 0,
        foodDelivered: existingDay?.foodDelivered || 0,
        foodRemaining: guests,
        waterRequired: `${formatNumber(guests)} Bottles`,
        waterTotalNumber: guests,
        waterDelivered: existingDay?.waterDelivered || 0,
        waterRemaining: guests,
        counterStatus: existingDay?.counterStatus || (status === 'Ongoing' ? 'OPEN' : 'PLANNED'),
        expenses: existingDay?.expenses || Math.round(guests * 12),
        expensesBreakdown: existingDay?.expensesBreakdown || [],
        tasks: existingDay?.tasks || [],
        pending: existingDay?.pending || [],
        notes: existingDay?.notes || `Day ${idx + 1} operations schedule for ${formatNumber(guests)} expected guests.`,
      }
    })

    const payload = {
      name: name.trim(),
      type,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      venue: venue.trim(),
      startDate,
      endDate,
      numberOfDays,
      totalExpectedGuests,
      status,
      days: daysData,
    }

    onSave(payload)
    toast.success(
      eventToEdit ? 'Event Updated' : 'Event Created Successfully',
      `"${payload.name}" configured for ${formatNumber(totalExpectedGuests)} total guests across ${numberOfDays} days.`
    )
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={eventToEdit ? 'Edit Catering Event' : 'Schedule New Catering Event'}
      description="Configure client details, multi-day schedules, and day-by-day guest planning."
      size="lg"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {eventToEdit ? 'Update Event Record' : 'Create Event Schedule'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Event Information */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#163324] flex items-center gap-1.5 border-b pb-1.5 border-[#e2e8f0]">
            <Building2 className="w-3.5 h-3.5 text-[#c29c5e]" />
            Event Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Event Name"
                placeholder="e.g., COLLEGE FUNCTION (TECH & CULTURAL FEST)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <Select
              label="Event Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={EVENT_TYPES.map((t) => ({ label: t, value: t }))}
            />

            <Select
              label="Event Operational Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              options={[
                { label: 'Upcoming (Scheduled)', value: 'Upcoming' },
                { label: 'Ongoing (Active on Ground)', value: 'Ongoing' },
                { label: 'Completed (Service Finished)', value: 'Completed' },
              ]}
            />

            <div className="sm:col-span-2">
              <Input
                label="Venue / Dining Location"
                placeholder="e.g., MES Engineering College Grounds, Valanchery"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Client & Organizer Contacts */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#163324] flex items-center gap-1.5 border-b pb-1.5 border-[#e2e8f0]">
            <Users className="w-3.5 h-3.5 text-[#c29c5e]" />
            Client & Coordinator Contact
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Client / Organizer Name"
              placeholder="e.g., Prof. K. Narayanan"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />

            <Input
              label="Client Phone"
              placeholder="+91 98471 23456"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
            />

            <Input
              label="Client Email"
              type="email"
              placeholder="convener@mesce.ac.in"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Schedule & Multi-Day Planning */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#163324] flex items-center gap-1.5 border-b pb-1.5 border-[#e2e8f0]">
            <Calendar className="w-3.5 h-3.5 text-[#c29c5e]" />
            Dates & Multi-Day Duration
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />

            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />

            <Select
              label="Number of Days"
              value={numberOfDays}
              onChange={(e) => handleDaysCountChange(e.target.value)}
              options={[
                { label: '1 Day Event', value: 1 },
                { label: '2 Days Event', value: 2 },
                { label: '3 Days (e.g. College Fest)', value: 3 },
                { label: '4 Days Event', value: 4 },
                { label: '5 Days Event', value: 5 },
                { label: '6 Days Event', value: 6 },
                { label: '7 Days Event', value: 7 },
              ]}
            />
          </div>
        </div>

        {/* Daily Guest Planning with Automatic Total Calculation */}
        <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-[#0f172a] flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-[#c29c5e]" />
                Daily Guest Planning
              </h4>
              <p className="text-xs text-[#64748b]">
                Enter expected attendance for each individual day (numbers can vary).
              </p>
            </div>

            {/* Live Auto Calculated Total */}
            <div className="px-3 py-1.5 rounded-lg bg-[#163324] text-white flex items-center gap-2 self-start sm:self-auto shadow-sm">
              <span className="text-[10px] uppercase tracking-wider text-[#c29c5e] font-semibold">
                Total Guests:
              </span>
              <span className="text-base font-extrabold text-white font-sans">
                {formatNumber(totalExpectedGuests)} Pax
              </span>
            </div>
          </div>

          {/* Dynamic Day Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {dailyGuests.map((count, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-white border border-[#cbd5e1] space-y-1.5 shadow-sm focus-within:border-[#163324] focus-within:ring-1 focus-within:ring-[#163324]/20"
              >
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`day-guests-${index}`}
                    className="text-xs font-bold text-[#163324] uppercase tracking-wider"
                  >
                    Day {index + 1} Guests
                  </label>
                  <span className="text-[10px] text-[#94a3b8]">Pax</span>
                </div>
                <input
                  id={`day-guests-${index}`}
                  type="number"
                  min="0"
                  step="50"
                  value={count}
                  onChange={(e) => handleDailyGuestChange(index, e.target.value)}
                  className="w-full text-base font-bold text-[#0f172a] bg-transparent border-0 p-0 focus:outline-none focus:ring-0"
                  placeholder="e.g. 10000"
                />
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#64748b] italic">
            *Total Expected Guests automatically updates as you adjust each day's count.
          </p>
        </div>
      </form>
    </Modal>
  )
}

