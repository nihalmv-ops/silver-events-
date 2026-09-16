import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { useMenu, MENU_CATEGORIES, MENU_UNITS } from '../../hooks/useMenu'
import { formatNumber } from '../../utils/formatters'
import { useToast } from '../ui/ToastContext'
import { Sparkles, Calculator } from 'lucide-react'

export function AssignDishModal({
  isOpen,
  onClose,
  onSave,
  dayNumber,
  dayExpectedGuests = 10000,
  itemToEdit = null,
}) {
  const toast = useToast()
  const { menuItems } = useMenu()

  const [selectedCatalogId, setSelectedCatalogId] = useState('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Lunch')
  const [unit, setUnit] = useState('Pax')
  const [quantity, setQuantity] = useState(dayExpectedGuests)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (itemToEdit) {
      setSelectedCatalogId('')
      setName(itemToEdit.name || '')
      setCategory(itemToEdit.category || 'Lunch')
      setUnit(itemToEdit.unit || 'Pax')
      setQuantity(itemToEdit.quantity || dayExpectedGuests)
      setNotes(itemToEdit.notes || '')
    } else {
      setSelectedCatalogId('')
      setName('Chicken Biryani')
      setCategory('Non-Vegetarian')
      setUnit('Pax')
      setQuantity(dayExpectedGuests)
      setNotes('Freshly prepared and sealed in thermal carriers.')
    }
  }, [itemToEdit, dayExpectedGuests, isOpen])

  // When selecting a catalog item from dropdown
  const handleSelectCatalogItem = (e) => {
    const catId = e.target.value
    setSelectedCatalogId(catId)

    const catalogItem = menuItems.find((m) => m.id === catId)
    if (catalogItem) {
      setName(catalogItem.name)
      setCategory(catalogItem.category)
      setUnit(catalogItem.unit)
      // Auto-scale quantity to day's expected guests
      setQuantity(dayExpectedGuests)
      setNotes(catalogItem.notes || '')
    }
  }

  const handleMatchGuests = () => {
    setQuantity(dayExpectedGuests)
    toast.info('Auto-Calculated', `Quantity set to match Day ${dayNumber} Expected Guests (${formatNumber(dayExpectedGuests)}).`)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.warning('Name Required', 'Please enter or select a dish.')
      return
    }

    const payload = {
      name: name.trim(),
      category,
      unit,
      quantity: Number(quantity) || dayExpectedGuests,
      notes: notes.trim(),
    }

    onSave(payload)
    toast.success(
      itemToEdit ? 'Day Menu Updated' : 'Item Added to Day Menu',
      `"${payload.name}" (${formatNumber(payload.quantity)} ${payload.unit}) assigned to Day ${dayNumber}.`
    )
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={itemToEdit ? `Edit Item for Day ${dayNumber}` : `Assign Menu Item to Day ${dayNumber}`}
      description={`Day ${dayNumber} Headcount: ${formatNumber(dayExpectedGuests)} Expected Guests.`}
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {itemToEdit ? 'Save Changes' : `Add to Day ${dayNumber}`}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Optional Catalog Pre-selector */}
        {!itemToEdit && (
          <div className="p-3 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] space-y-1.5">
            <label className="block text-xs font-bold text-[#163324] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#c29c5e]" />
              Quick Pick from Master Catalog
            </label>
            <select
              value={selectedCatalogId}
              onChange={handleSelectCatalogItem}
              className="block w-full text-xs text-[#0f172a] bg-white border border-[#cbd5e1] rounded-lg p-2 focus:ring-2 focus:ring-[#163324]/20 focus:border-[#163324]"
            >
              <option value="">-- Choose from Master Catalog (Optional) --</option>
              {menuItems.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.category} • {m.unit})
                </option>
              ))}
            </select>
          </div>
        )}

        <Input
          label="Item / Dish Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Chicken Biryani or Water Bottle"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={MENU_CATEGORIES.map((c) => ({ label: c, value: c }))}
          />

          <Select
            label="Serving Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            options={MENU_UNITS.map((u) => ({ label: u, value: u }))}
          />
        </div>

        {/* Quantity Field with Match Guests auto-calculator button */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-[#334155] tracking-wide">
              Planned Quantity
            </label>
            <button
              type="button"
              onClick={handleMatchGuests}
              className="text-[11px] text-[#9d8050] hover:text-[#163324] font-medium flex items-center gap-1"
            >
              <Calculator className="w-3 h-3" />
              Auto-calculate to {formatNumber(dayExpectedGuests)} guests
            </button>
          </div>
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#334155] tracking-wide">
            Day Notes / Serving Instructions
          </label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Staged at Counters 1-16; maintain food warmers at 70°C."
            className="block w-full text-sm text-[#0f172a] bg-white border border-[#cbd5e1] rounded-lg shadow-sm p-2.5 placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#163324]/20 focus:border-[#163324] transition-colors"
          />
        </div>
      </form>
    </Modal>
  )
}

