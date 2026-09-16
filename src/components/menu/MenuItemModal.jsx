import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { MENU_CATEGORIES, MENU_UNITS } from '../../context/MenuContext'
import { useToast } from '../ui/ToastContext'

export function MenuItemModal({ isOpen, onClose, onSave, itemToEdit = null }) {
  const toast = useToast()

  const [name, setName] = useState('')
  const [category, setCategory] = useState('Lunch')
  const [unit, setUnit] = useState('Pax')
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name || '')
      setCategory(itemToEdit.category || 'Lunch')
      setUnit(itemToEdit.unit || 'Pax')
      setQuantity(itemToEdit.quantity || 1)
      setNotes(itemToEdit.notes || '')
    } else {
      setName('')
      setCategory('Lunch')
      setUnit('Pax')
      setQuantity(1)
      setNotes('')
    }
  }, [itemToEdit, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.warning('Name Required', 'Please enter a name for the menu item.')
      return
    }

    const payload = {
      name: name.trim(),
      category,
      unit,
      quantity: Number(quantity) || 1,
      notes: notes.trim(),
    }

    onSave(payload)
    toast.success(
      itemToEdit ? 'Menu Item Updated' : 'Menu Item Added',
      `"${payload.name}" saved in category ${payload.category}.`
    )
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={itemToEdit ? 'Edit Catalog Menu Item' : 'Add Dish to Master Catalog'}
      description="Define menu name, category, standard unit, and preparation guidelines."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {itemToEdit ? 'Update Item' : 'Save Dish to Catalog'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Item / Dish Name"
          placeholder="e.g., Chicken Biryani or Water Bottle"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={MENU_CATEGORIES.map((c) => ({ label: c, value: c }))}
          />

          <Select
            label="Standard Serving Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            options={MENU_UNITS.map((u) => ({ label: u, value: u }))}
          />
        </div>

        <Input
          label="Default / Per-Head Quantity"
          type="number"
          min="0.1"
          step="any"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          helperText="Standard serving baseline (e.g. 1 per pax or standard batch size)"
        />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#334155] tracking-wide">
            Preparation & Serving Notes
          </label>
          <textarea
            rows="3"
            placeholder="e.g. Authentic Malabar Thalassery dum style; serve hot with raitha and pickle."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="block w-full text-sm text-[#0f172a] bg-white border border-[#cbd5e1] rounded-lg shadow-sm p-2.5 placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#163324]/20 focus:border-[#163324] transition-colors"
          />
        </div>
      </form>
    </Modal>
  )
}

