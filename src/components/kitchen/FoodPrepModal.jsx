import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { formatNumber } from '../../utils/formatters'

export function FoodPrepModal({ isOpen, onClose, onSave, currentPrep, eventName, dayLabel }) {
  const [requiredMeals, setRequiredMeals] = useState(10000)
  const [preparedMeals, setPreparedMeals] = useState(0)
  const [qualityChecked, setQualityChecked] = useState(0)
  const [rejectedMeals, setRejectedMeals] = useState(0)

  useEffect(() => {
    if (currentPrep) {
      setRequiredMeals(currentPrep.requiredMeals || 0)
      setPreparedMeals(currentPrep.preparedMeals || 0)
      setQualityChecked(currentPrep.qualityChecked || 0)
      setRejectedMeals(currentPrep.rejectedMeals || 0)
    }
  }, [currentPrep, isOpen])

  const remaining = Math.max(0, (Number(requiredMeals) || 0) - (Number(preparedMeals) || 0))
  const progressPct = Number(requiredMeals) > 0 ? Math.min(100, Math.round(((Number(preparedMeals) || 0) / Number(requiredMeals)) * 100)) : 0

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      requiredMeals: Number(requiredMeals) || 0,
      preparedMeals: Number(preparedMeals) || 0,
      qualityChecked: Number(qualityChecked) || 0,
      rejectedMeals: Number(rejectedMeals) || 0,
    })
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Food Preparation Tallies"
      description={`Adjust kitchen quotas and verification logs for ${dayLabel || 'selected day'}.`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Required Meals"
            type="number"
            min="0"
            value={requiredMeals}
            onChange={(e) => setRequiredMeals(e.target.value)}
            required
          />

          <Input
            label="Prepared Meals"
            type="number"
            min="0"
            value={preparedMeals}
            onChange={(e) => setPreparedMeals(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Quality Checked (Passed)"
            type="number"
            min="0"
            value={qualityChecked}
            onChange={(e) => setQualityChecked(e.target.value)}
            required
          />

          <Input
            label="Rejected / Damaged Meals"
            type="number"
            min="0"
            value={rejectedMeals}
            onChange={(e) => setRejectedMeals(e.target.value)}
            required
          />
        </div>

        {/* Real-time Calculation Summary Card */}
        <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#64748b] font-medium">Automatic Remaining:</span>
            <span className="font-bold text-[#0f172a] font-sans text-sm">
              {formatNumber(remaining)} Meals
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#64748b] font-medium">Cooking Completion:</span>
            <span className="font-bold text-[#059669] font-sans text-sm">
              {progressPct}%
            </span>
          </div>

          <div className="w-full bg-[#e2e8f0] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#163324] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-[#e2e8f0]">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Preparation Tallies
          </Button>
        </div>
      </form>
    </Modal>
  )
}

