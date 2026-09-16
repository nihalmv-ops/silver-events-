import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { formatNumber } from '../../utils/formatters'

export function FoodPackingModal({ isOpen, onClose, onSave, currentPacking, dayLabel }) {
  const [requiredContainers, setRequiredContainers] = useState(200)
  const [packedContainers, setPackedContainers] = useState(0)
  const [damagedContainers, setDamagedContainers] = useState(0)
  const [containerType, setContainerType] = useState('Insulated Thermal Hot-Box (50 Pax)')

  useEffect(() => {
    if (currentPacking) {
      setRequiredContainers(currentPacking.requiredContainers || 0)
      setPackedContainers(currentPacking.packedContainers || 0)
      setDamagedContainers(currentPacking.damagedContainers || 0)
      setContainerType(currentPacking.containerType || 'Insulated Thermal Hot-Box (50 Pax)')
    }
  }, [currentPacking, isOpen])

  const remaining = Math.max(0, (Number(requiredContainers) || 0) - (Number(packedContainers) || 0))
  const progressPct = Number(requiredContainers) > 0 ? Math.min(100, Math.round(((Number(packedContainers) || 0) / Number(requiredContainers)) * 100)) : 0

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      requiredContainers: Number(requiredContainers) || 0,
      packedContainers: Number(packedContainers) || 0,
      damagedContainers: Number(damagedContainers) || 0,
      containerType: containerType.trim() || 'Insulated Thermal Hot-Box (50 Pax)',
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Packaging Containers"
      description={`Set thermal container quotas and damage tallies for ${dayLabel || 'selected day'}.`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Container Specification / Model"
          value={containerType}
          onChange={(e) => setContainerType(e.target.value)}
          placeholder="e.g. Insulated Thermal Hot-Box (50 Pax)"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Required Containers"
            type="number"
            min="0"
            value={requiredContainers}
            onChange={(e) => setRequiredContainers(e.target.value)}
            required
          />

          <Input
            label="Packed Containers"
            type="number"
            min="0"
            value={packedContainers}
            onChange={(e) => setPackedContainers(e.target.value)}
            required
          />

          <Input
            label="Damaged Containers"
            type="number"
            min="0"
            value={damagedContainers}
            onChange={(e) => setDamagedContainers(e.target.value)}
            required
          />
        </div>

        {/* Real-time Calculation Summary Card */}
        <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#64748b] font-medium">Automatic Remaining Containers:</span>
            <span className="font-bold text-[#0f172a] font-sans text-sm">
              {formatNumber(remaining)} Containers
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#64748b] font-medium">Packaging Progress:</span>
            <span className="font-bold text-[#0284c7] font-sans text-sm">
              {progressPct}%
            </span>
          </div>

          <div className="w-full bg-[#e2e8f0] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#0284c7] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e8f0]">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Container Quotas
          </Button>
        </div>
      </form>
    </Modal>
  )
}

