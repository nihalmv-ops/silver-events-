import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { BATCH_STATUSES, QUALITY_CHECK_STATUSES } from '../../hooks/useEvents'

export function BatchModal({ isOpen, onClose, onSave, batchToEdit, defaultBatchNumber }) {
  const [batchNumber, setBatchNumber] = useState('')
  const [quantity, setQuantity] = useState(1000)
  const [preparationStatus, setPreparationStatus] = useState('Preparing')
  const [qualityCheck, setQualityCheck] = useState('Pending')
  const [packingStatus, setPackingStatus] = useState('Pending')
  const [readyStatus, setReadyStatus] = useState('Pending')
  const [dispatchStatus, setDispatchStatus] = useState('Pending')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (batchToEdit) {
      setBatchNumber(batchToEdit.batchNumber || '')
      setQuantity(batchToEdit.quantity || 1000)
      setPreparationStatus(batchToEdit.preparationStatus || 'Preparing')
      setQualityCheck(batchToEdit.qualityCheck || 'Pending')
      setPackingStatus(batchToEdit.packingStatus || 'Pending')
      setReadyStatus(batchToEdit.readyStatus || 'Pending')
      setDispatchStatus(batchToEdit.dispatchStatus || 'Pending')
      setNotes(batchToEdit.notes || '')
    } else {
      setBatchNumber(defaultBatchNumber || 'Batch 01')
      setQuantity(3000)
      setPreparationStatus('Preparing')
      setQualityCheck('Pending')
      setPackingStatus('Pending')
      setReadyStatus('Pending')
      setDispatchStatus('Pending')
      setNotes('')
    }
  }, [batchToEdit, defaultBatchNumber, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      batchNumber: batchNumber.trim() || 'Batch',
      quantity: Number(quantity) || 0,
      preparationStatus,
      qualityCheck,
      packingStatus,
      readyStatus,
      dispatchStatus,
      notes: notes.trim(),
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={batchToEdit ? `Edit ${batchToEdit.batchNumber}` : 'Create Kitchen Cooking Batch'}
      description="Configure production quantities, quality checks, and dispatch stages for this cooking run."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Batch Number / Code"
            value={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
            placeholder="e.g. Batch 01"
            required
          />

          <Input
            label="Batch Quantity (Meals / Pax)"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0f172a] block">
              Preparation Status
            </label>
            <select
              value={preparationStatus}
              onChange={(e) => setPreparationStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              {BATCH_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0f172a] block">
              Quality Check Verification
            </label>
            <select
              value={qualityCheck}
              onChange={(e) => setQualityCheck(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              {QUALITY_CHECK_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st === 'Pass' ? 'Pass (Core Temp & Taste OK)' : st === 'Failed' ? 'Failed (Rejected)' : 'Pending Inspection'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0f172a] block">
              Packing Status
            </label>
            <select
              value={packingStatus}
              onChange={(e) => setPackingStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              <option value="Pending">Pending</option>
              <option value="Preparing">Packing in Progress</option>
              <option value="Packed">Packed in Containers</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0f172a] block">
              Ready Status
            </label>
            <select
              value={readyStatus}
              onChange={(e) => setReadyStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              <option value="Pending">Not Ready</option>
              <option value="Ready">Ready on Floor</option>
              <option value="Completed">Staged</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0f172a] block">
              Dispatch Status
            </label>
            <select
              value={dispatchStatus}
              onChange={(e) => setDispatchStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              <option value="Pending">Pending</option>
              <option value="Ready for Distribution">Ready for Distribution</option>
              <option value="Dispatched">Dispatched in Van</option>
              <option value="Completed">Delivered at Counters</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0f172a] block">
            Chef Notes & Cauldron Logs
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Cauldrons 1-14, dum sealed at 10:00 AM, thermal core 74°C verified."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#163324]"
          />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e8f0]">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {batchToEdit ? 'Save Batch Changes' : 'Create Batch'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

