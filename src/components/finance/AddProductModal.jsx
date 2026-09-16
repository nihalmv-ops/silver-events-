import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { IndianRupee, Tag, Plus } from 'lucide-react'
import { useFinance, PRODUCT_CATEGORIES } from '../../hooks/useFinance'
import { useToast } from '../ui/ToastContext'

export function AddProductModal({ isOpen, onClose }) {
  const toast = useToast()
  const { addProduct } = useFinance()

  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('Snacks')
  const [sellingPrice, setSellingPrice] = useState('40')
  const [costPrice, setCostPrice] = useState('15')
  const [unit, setUnit] = useState('Cone / Tub (100g)')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!productName.trim()) {
      toast.warning('Name Required', 'Please enter a product / dish name.')
      return
    }

    const sPrice = Number(sellingPrice) || 0
    if (sPrice <= 0) {
      toast.warning('Price Required', 'Please enter a valid selling price greater than ₹0.')
      return
    }

    addProduct({
      productName: productName.trim(),
      category,
      sellingPrice: sPrice,
      costPrice: Number(costPrice) || 0,
      unit: unit.trim() || 'Portion / Unit',
      status: 'Active',
      notes: notes.trim(),
    })

    toast.success('Dish Added', `"${productName.trim()}" added to product price catalog at ₹${sPrice}.`)
    onClose()
    setProductName('')
    setNotes('')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Dish / Product"
      description="Add a new food item or beverage to the operational pricing catalog."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <Input
          label="Product / Dish Name"
          placeholder="e.g. Popcorn or Chicken Roll"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={PRODUCT_CATEGORIES.map((c) => ({ label: c, value: c }))}
          />

          <Input
            label="Portion Unit"
            placeholder="e.g. Cone / Tub (100g) or Portion"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Selling Price (₹) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
              <input
                type="number"
                min="1"
                step="1"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="e.g. 40"
                className="w-full pl-9 pr-3 py-2 text-sm font-black text-[#163324] border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1">
              Cost Price (₹)
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
              <input
                type="number"
                min="0"
                step="1"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="e.g. 15"
                className="w-full pl-9 pr-3 py-2 text-sm font-semibold text-[#475569] border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[#334155]">Notes / Description</label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Freshly popped butter salted corn served at live counter"
            className="w-full p-2.5 text-xs text-[#0f172a] bg-white border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e2e8f0]">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Save Dish to Catalog
          </Button>
        </div>
      </form>
    </Modal>
  )
}

