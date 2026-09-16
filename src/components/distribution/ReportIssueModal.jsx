import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { AlertCircle, AlertTriangle } from 'lucide-react'

const ISSUE_TYPES = [
  'Queue Congestion',
  'Buffer Batch Delay',
  'Cold Food Temperature (<65°C)',
  'Water Station Depleted',
  'Spill / Damaged Hot-Box',
  'Plates / Cutlery Shortage',
  'Other',
]

const URGENCIES = ['High', 'Medium', 'Low']

export function ReportIssueModal({ isOpen, onClose, onReport, counterName }) {
  const [type, setType] = useState('Queue Congestion')
  const [urgency, setUrgency] = useState('High')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onReport({
      type,
      urgency,
      notes: notes.trim(),
    })
    setNotes('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report Distribution Counter Incident"
      description={`Alert operations room and runners from ${counterName || 'ONE Counter'}.`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0f172a] block">
            Incident Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ISSUE_TYPES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left transition-all ${
                  type === t
                    ? 'bg-[#163324] text-[#d4af37] border-[#163324] shadow-sm'
                    : 'bg-white text-[#334155] border-[#e2e8f0] hover:bg-[#f8fafc]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0f172a] block">
            Urgency / Escalation Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {URGENCIES.map((u) => (
              <button
                type="button"
                key={u}
                onClick={() => setUrgency(u)}
                className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all ${
                  urgency === u
                    ? u === 'High'
                      ? 'bg-[#dc2626] text-white border-[#dc2626] shadow-sm'
                      : u === 'Medium'
                      ? 'bg-[#d97706] text-white border-[#d97706] shadow-sm'
                      : 'bg-[#2563eb] text-white border-[#2563eb] shadow-sm'
                    : 'bg-white text-[#475569] border-[#e2e8f0] hover:bg-[#f8fafc]'
                }`}
              >
                {u === 'High' ? '🔴 High (Immediate)' : u === 'Medium' ? '🟡 Medium' : '🔵 Low'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0f172a] block">
            Incident Notes / Location Details
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Queue buildup on Line 3. Requesting 2 line marshals and next batch immediately."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#163324]"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e8f0]">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="bg-[#dc2626] hover:bg-[#b91c1c] text-white border-transparent"
          >
            Dispatch Incident Alert
          </Button>
        </div>
      </form>
    </Modal>
  )
}
