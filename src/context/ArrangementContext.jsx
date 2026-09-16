import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const ArrangementContext = createContext(null)

const STORAGE_KEY = 'silver_catering_arrangements_data_v1'

export const ARRANGEMENT_CATEGORIES = [
  'Venue',
  'Stage',
  'Chairs',
  'Tables',
  'Decoration',
  'Sound',
  'Lighting',
  'LED',
  'Power Backup',
  'Registration',
  'Photography',
  'Security',
  'Parking',
  'Cleaning',
  'Transportation',
  'Banner',
  'Printing',
  'Equipment',
]

export const ARRANGEMENT_STATUSES = ['Pending', 'Ordered', 'Ready', 'Completed']

// Pre-seeded authentic checklist items for the 3-day College Event across all 18 categories
const INITIAL_ARRANGEMENTS = [
  {
    id: 'arr-01',
    category: 'Venue',
    title: 'Open Grounds & Dining Pavilion Clearance',
    specification: 'Clearance & layout approval for 10,000 daily pax dining ground',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    status: 'Completed',
    vendor: 'MES College Management',
    notes: 'Ground leveled and covered with waterproof German hangar.',
  },
  {
    id: 'arr-02',
    category: 'Stage',
    title: 'Inaugural & Dignitary Main Dais',
    specification: '40x24 ft covered carpeted platform with podium and backdrop frame',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    status: 'Completed',
    vendor: 'Royal Stage Decorators',
    notes: 'Safety railing and ramp installed for faculty.',
  },
  {
    id: 'arr-03',
    category: 'Chairs',
    title: 'Auditorium & Dining Banquet Chairs',
    specification: '3,000 cushioned banquet chairs with white stretch slipcovers',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    status: 'Ready',
    vendor: 'Malabar Event Rentals',
    notes: 'Positioned in faculty dining and VIP enclosure.',
  },
  {
    id: 'arr-04',
    category: 'Tables',
    title: 'Single Distribution Counter Tables & Dining Long Tables',
    specification: '40 heavy stainless steel tables arranged for ONE central serving line',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    status: 'Ready',
    vendor: 'Silver In-House Inventory',
    notes: 'Heavy-duty skid proof tables arranged for Single Counter throughput.',
  },
  {
    id: 'arr-05',
    category: 'Decoration',
    title: 'Entrance Arch & Traditional Floral Staging',
    specification: 'Fresh jasmine & marigold gate arch + brass urn floral floats',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    status: 'Completed',
    vendor: 'Lotus Florals Valanchery',
    notes: 'Completed by 07:00 AM before inauguration.',
  },
  {
    id: 'arr-06',
    category: 'Sound',
    title: 'Line Array PA System & Microphones',
    specification: 'JBL VRX line array + 8 wireless lavalier & handheld mics',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    status: 'Completed',
    vendor: 'Acoustic Waves Pro Audio',
    notes: 'Sound check verified with college orchestra.',
  },
  {
    id: 'arr-07',
    category: 'Lighting',
    title: 'Dining Hall Warm Focus & Buffet Spot Lights',
    specification: 'Warm LED par cans over dining tables and focused food counter spots',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    status: 'Ready',
    vendor: 'Bright Beam Lighting',
    notes: 'High-CRI food presentation lighting installed.',
  },
  {
    id: 'arr-08',
    category: 'LED',
    title: 'Outdoor Video Wall & Schedule Screen',
    specification: 'P3 outdoor high-brightness LED screen (16x10 ft) at ground entrance',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    status: 'Completed',
    vendor: 'VisionTech Displays',
    notes: 'Displays lunch timing and menu announcements.',
  },
  {
    id: 'arr-09',
    category: 'Power Backup',
    title: '125 kVA Silent Commercial Generator',
    specification: 'Dual automatic transfer switch diesel generator for kitchen & counter',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    status: 'Completed',
    vendor: 'Reliable Power Gensets',
    notes: 'Fully fueled with 250 liters diesel reserve.',
  },
  {
    id: 'arr-10',
    category: 'Registration',
    title: 'Student & Delegate Food Token Desks',
    specification: '6 registration kiosks with barcode scanner stanchions',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    status: 'Completed',
    vendor: 'College Student Union',
    notes: 'Tokens verified before entering the dining enclosure.',
  },
  {
    id: 'arr-11',
    category: 'Photography',
    title: 'Event Media & Buffet Coverage',
    specification: '2 candid photographers + 4K videography team for documentation',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    status: 'Ordered',
    vendor: 'Candid Moments Media',
    notes: 'Buffet inauguration and VIP dinner capture.',
  },
  {
    id: 'arr-12',
    category: 'Security',
    title: 'Uniformed Security Guards & Marshals',
    specification: '16 private security personnel for queue line and perimeter control',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    status: 'Ready',
    vendor: 'Apex Security & Guarding',
    notes: 'Marshals briefed on 4-line flow to ONE central counter.',
  },
  {
    id: 'arr-13',
    category: 'Parking',
    title: 'VIP & Fleet Vehicle Staging Grounds',
    specification: 'Designated parking for 150 cars + dedicated logistics truck bay',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    status: 'Completed',
    vendor: 'MES Ground Staff',
    notes: 'Unobstructed entry for refrigerated food transport convoy.',
  },
  {
    id: 'arr-14',
    category: 'Cleaning',
    title: 'Waste Disposal & Continuous Sanitation Team',
    specification: '15 waste management stewards with mobile dustbins and sorting bags',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    status: 'Ready',
    vendor: 'EcoClean Kerala Services',
    notes: 'Banana leaf composting tie-up with local bio-plant.',
  },
  {
    id: 'arr-15',
    category: 'Transportation',
    title: 'Kitchen Shuttle Fleet',
    specification: '4 air-conditioned cargo vans for cauldrons and hot-boxes',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    status: 'Ready',
    vendor: 'Highway Logistics',
    notes: 'Permits and gate passes issued for college gate.',
  },
  {
    id: 'arr-16',
    category: 'Banner',
    title: 'Event Theme Welcome Flex Banners',
    specification: 'Weatherproof high-res frontlit banners at campus approach roads',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    status: 'Completed',
    vendor: 'Creative Media Printers',
    notes: '12 banners erected across highway and campus.',
  },
  {
    id: 'arr-17',
    category: 'Printing',
    title: 'Dining Guidelines & VIP Table Menus',
    specification: '300 gold embossed menu cards + laminated direction signage',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    status: 'Completed',
    vendor: 'QuickPrint Station Valanchery',
    notes: 'Delivered and placed on VIP banquet tables.',
  },
  {
    id: 'arr-18',
    category: 'Equipment',
    title: 'Commercial Chafing Roll-Tops & Water Dispensers',
    specification: '40 large brass and stainless steel warmers + thermal soup urns',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    status: 'Ready',
    vendor: 'Silver In-House Inventory',
    notes: 'Cleaned, pre-fueled with canned chafing gel, and tested.',
  },
]

export function ArrangementProvider({ children }) {
  const [arrangements, setArrangements] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // Fallback
    }
    return INITIAL_ARRANGEMENTS
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arrangements))
    } catch (e) {
      console.warn('Could not save arrangements to localStorage:', e)
    }
  }, [arrangements])

  const addArrangement = useCallback((item) => {
    const newItem = {
      id: 'arr-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      status: item.status || 'Pending',
      ...item,
      dayNumber: Number(item.dayNumber) || 1,
    }
    setArrangements((prev) => [newItem, ...prev])
    return newItem
  }, [])

  const updateArrangement = useCallback((id, updatedFields) => {
    setArrangements((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    )
  }, [])

  const deleteArrangement = useCallback((id) => {
    setArrangements((prev) => prev.filter((item) => item.id !== id))
  }, [])

  // 1-Click Status Advance: Pending -> Ordered -> Ready -> Completed -> Pending
  const cycleStatus = useCallback((id) => {
    setArrangements((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const order = ['Pending', 'Ordered', 'Ready', 'Completed']
        const nextIdx = (order.indexOf(item.status) + 1) % order.length
        return { ...item, status: order[nextIdx] }
      })
    )
  }, [])

  const value = {
    arrangements,
    categories: ARRANGEMENT_CATEGORIES,
    statuses: ARRANGEMENT_STATUSES,
    addArrangement,
    updateArrangement,
    deleteArrangement,
    cycleStatus,
  }

  return (
    <ArrangementContext.Provider value={value}>
      {children}
    </ArrangementContext.Provider>
  )
}

export function useArrangements() {
  const context = useContext(ArrangementContext)
  if (!context) {
    throw new Error('useArrangements must be used within an ArrangementProvider')
  }
  return context
}

