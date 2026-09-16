import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const VendorContext = createContext(null)

const STORAGE_KEY = 'silver_catering_vendors_data_v1'

export const VENDOR_CATEGORIES = [
  'Fresh Poultry & Meat',
  'Spices & Rice',
  'Dairy & Ghee',
  'Beverages & Water',
  'Packaging & Thermal Boxes',
  'Logistics & Transport',
  'Commercial LPG Gas',
  'Sound & AV',
  'Lighting & Power',
  'Decor & Stage',
  'Waste & Sanitation',
  'Other',
]

export const VENDOR_STATUSES = [
  'Confirmed',
  'In Progress',
  'Delivered',
  'Pending',
  'Settled',
]

const INITIAL_VENDORS = [
  {
    id: 'v-01',
    vendorName: 'Malabar Broilers & Farm Fresh Poultry',
    category: 'Fresh Poultry & Meat',
    phone: '+91 94470 12890',
    email: 'orders@malabarbroilers.com',
    service: 'Halal cleaned fresh dressed chicken (4,500 kg daily cut for biryani)',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    contractAmount: 680000,
    advance: 300000,
    paid: 300000,
    status: 'Delivered',
    notes: 'Morning 04:00 AM delivery verified at central kitchen with temp audit.',
  },
  {
    id: 'v-02',
    vendorName: 'Kaveri Pure Aqua Springs Ltd',
    category: 'Beverages & Water',
    phone: '+91 98471 66321',
    email: 'supply@kaveriaqua.in',
    service: '250ml sealed mineral water bottles (10,000 bottles daily)',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    contractAmount: 85000,
    advance: 40000,
    paid: 40000,
    status: 'Delivered',
    notes: 'Delivered in shrink-wrapped pallets at venue hydration point.',
  },
  {
    id: 'v-03',
    vendorName: 'Calicut Heritage Spice Mills & Royal Basmati',
    category: 'Spices & Rice',
    phone: '+91 99460 77891',
    email: 'sales@calicutspices.org',
    service: 'Premium aged Jeerakasala & XXL Basmati rice + whole garam masala',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    contractAmount: 420000,
    advance: 250000,
    paid: 420000,
    status: 'Settled',
    notes: 'Aged grains inspected for aroma and zero breakage.',
  },
  {
    id: 'v-04',
    vendorName: 'Highway Logistics & Cold Chain Transport',
    category: 'Logistics & Transport',
    phone: '+91 95670 44123',
    email: 'dispatch@highwaylogistics.co.in',
    service: '4 insulated refrigerated trucks for food and water shuttling',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    contractAmount: 65000,
    advance: 25000,
    paid: 45000,
    status: 'In Progress',
    notes: 'Convoy shuttling between kitchen and MES grounds.',
  },
  {
    id: 'v-05',
    vendorName: 'Milma Dairy Cooperative Federation',
    category: 'Dairy & Ghee',
    phone: '+91 98462 11980',
    email: 'bulk@milmadairy.com',
    service: 'Pure cow ghee for biryani dum + fresh curd for raitha',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    contractAmount: 95000,
    advance: 50000,
    paid: 50000,
    status: 'Delivered',
    notes: 'Direct morning supply from local chilling plant.',
  },
  {
    id: 'v-06',
    vendorName: 'Kerala Flame Commercial LPG Agency',
    category: 'Commercial LPG Gas',
    phone: '+91 97451 88234',
    email: 'flame@keralagas.com',
    service: '47.5 kg commercial cooking gas cylinders (12 cylinders)',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    contractAmount: 48000,
    advance: 20000,
    paid: 48000,
    status: 'Settled',
    notes: 'Delivered to kitchen burning lines with safety valves inspected.',
  },
]

export function VendorProvider({ children }) {
  const [vendors, setVendors] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // Fallback
    }
    return INITIAL_VENDORS
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vendors))
    } catch (e) {
      console.warn('Could not save vendors to localStorage:', e)
    }
  }, [vendors])

  const addVendor = useCallback((vendor) => {
    const contractAmount = Number(vendor.contractAmount) || 0
    const advance = Number(vendor.advance) || 0
    const paid = Number(vendor.paid) !== undefined ? Number(vendor.paid) : advance

    const newVendor = {
      id: 'v-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      ...vendor,
      contractAmount,
      advance,
      paid,
      dayNumber: Number(vendor.dayNumber) || 1,
      status: vendor.status || 'Confirmed',
    }

    setVendors((prev) => [newVendor, ...prev])
    return newVendor
  }, [])

  const updateVendor = useCallback((id, updatedFields) => {
    setVendors((prev) =>
      prev.map((vendor) => {
        if (vendor.id !== id) return vendor
        const contractAmount =
          updatedFields.contractAmount !== undefined
            ? Number(updatedFields.contractAmount)
            : vendor.contractAmount
        const advance =
          updatedFields.advance !== undefined ? Number(updatedFields.advance) : vendor.advance
        const paid =
          updatedFields.paid !== undefined ? Number(updatedFields.paid) : vendor.paid

        return {
          ...vendor,
          ...updatedFields,
          contractAmount,
          advance,
          paid,
        }
      })
    )
  }, [])

  const deleteVendor = useCallback((id) => {
    setVendors((prev) => prev.filter((vendor) => vendor.id !== id))
  }, [])

  const recordPayment = useCallback((id, paymentAmount) => {
    setVendors((prev) =>
      prev.map((vendor) => {
        if (vendor.id !== id) return vendor
        const currentPaid = Number(vendor.paid) || 0
        const newPaid = currentPaid + Number(paymentAmount)
        const isSettled = newPaid >= (Number(vendor.contractAmount) || 0)
        return {
          ...vendor,
          paid: newPaid,
          status: isSettled ? 'Settled' : vendor.status,
        }
      })
    )
  }, [])

  const value = {
    vendors,
    categories: VENDOR_CATEGORIES,
    statuses: VENDOR_STATUSES,
    addVendor,
    updateVendor,
    deleteVendor,
    recordPayment,
  }

  return <VendorContext.Provider value={value}>{children}</VendorContext.Provider>
}

export function useVendors() {
  const context = useContext(VendorContext)
  if (!context) {
    throw new Error('useVendors must be used within a VendorProvider')
  }
  return context
}
