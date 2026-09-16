import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const EventContext = createContext(null)

const STORAGE_KEY = 'silver_catering_events_data'

// Realistic initial seed data featuring the 3-Day College Event (30,000 pax)
const INITIAL_EVENTS = [
  {
    id: 'evt-college-3day',
    code: 'EVT-2026-COLLEGE',
    name: 'COLLEGE FUNCTION (TECH & CULTURAL FEST)',
    type: 'College Fest',
    clientName: 'Prof. K. Narayanan (Convener)',
    clientPhone: '+91 98471 23456',
    clientEmail: 'convener@mesce.ac.in',
    venue: 'MES Engineering College Grounds, Valanchery',
    startDate: '2026-09-16',
    endDate: '2026-09-18',
    numberOfDays: 3,
    totalExpectedGuests: 30000,
    status: 'Ongoing',
    statusVariant: 'success',
    cateringManager: 'Capt. Pradeep Menon',
    days: [
      {
        dayNumber: 1,
        dayLabel: 'Day 1 — Inauguration & Cultural Night',
        date: '2026-09-16',
        expectedGuests: 10000,
        foodRequired: '10,000 Pax Chicken Biryani',
        foodItem: 'Chicken Biryani with Raitha, Pickle & Pappadam',
        foodPrepared: 10000,
        foodPacked: 9800,
        foodDelivered: 7450,
        foodRemaining: 2350,
        waterRequired: '10,000 Bottles',
        waterTotalNumber: 10000,
        waterDelivered: 7800,
        waterRemaining: 2200,
        counterStatus: 'OPEN',
        expenses: 124000,
        expensesBreakdown: [
          { item: 'Logistics Fleet & Diesel (4 trucks)', amount: 22000 },
          { item: 'Temporary Service Stewards (45 crew)', amount: 54000 },
          { item: 'Dry Ice & Ice Block Staging', amount: 18000 },
          { item: 'Commercial LPG Cylinder Refills', amount: 18000 },
          { item: 'Emergency Market Veg & Mint Leaves', amount: 12000 },
        ],
        tasks: [
          { id: 'd1-t1', title: 'Open 16 dining buffet counters at 12:30 PM', done: true },
          { id: 'd1-t2', title: 'Check food temperature at thermal staging depot (>68°C)', done: true },
          { id: 'd1-t3', title: 'Replenish 800 water bottles at Main Entrance Wing', done: true },
          { id: 'd1-t4', title: 'Staging Round 2 buffer biryani hot boxes for late batches', done: false },
          { id: 'd1-t5', title: 'Banana leaf disposal and recycling bags dispatch', done: false },
        ],
        pending: [
          { id: 'd1-p1', text: 'Ice replenishment for Mocktail Bar counter #2', urgency: 'high' },
          { id: 'd1-p2', text: 'Extra 50 chafing dish fuel cans for evening round', urgency: 'medium' },
          { id: 'd1-p3', text: 'Steward briefing for 3:00 PM VIP faculty seating', urgency: 'normal' },
        ],
        notes: 'Main gate opened at 11:30 AM. Peak crowd estimated between 1:00 PM and 2:30 PM. 16 main lines running smoothly.',
      },
      {
        dayNumber: 2,
        dayLabel: 'Day 2 — Tech Expo & Grand Banquet',
        date: '2026-09-17',
        expectedGuests: 10000,
        foodRequired: '10,000 Pax Malabar Dum Ghee Rice & Mutton Curry',
        foodItem: 'Jeerakasala Ghee Rice, Nadan Mutton Roast & Dal Tadka',
        foodPrepared: 10000,
        foodPacked: 2400,
        foodDelivered: 0,
        foodRemaining: 10000,
        waterRequired: '10,000 Bottles',
        waterTotalNumber: 10000,
        waterDelivered: 1500,
        waterRemaining: 8500,
        counterStatus: 'SCHEDULED',
        expenses: 138000,
        expensesBreakdown: [
          { item: 'Fresh Mutton Procurement (Halal certified)', amount: 68000 },
          { item: 'Logistics Transport & Fuel (Day 2)', amount: 20000 },
          { item: 'Temporary Crew Day 2 (45 crew)', amount: 50000 },
        ],
        tasks: [
          { id: 'd2-t1', title: 'Central Kitchen cauldrons fire-up at 04:30 AM', done: true },
          { id: 'd2-t2', title: 'Mutton marination and slow-braising temperature check', done: true },
          { id: 'd2-t3', title: 'Morning transport convoy departure at 09:30 AM', done: false },
          { id: 'd2-t4', title: 'Setup VIP lounge live dessert station (Palada Payasam)', done: false },
        ],
        pending: [
          { id: 'd2-p1', text: 'Confirm second refrigerated vehicle gate pass', urgency: 'high' },
          { id: 'd2-p2', text: 'Pre-chill 10,000 water bottles at venue cold room', urgency: 'normal' },
        ],
        notes: 'Pro-show evening schedule expects high student crowd. Service captains to coordinate rapid buffet replenishments.',
      },
      {
        dayNumber: 3,
        dayLabel: 'Day 3 — Valedictory & Closing Feast',
        date: '2026-09-18',
        expectedGuests: 10000,
        foodRequired: '10,000 Pax Indo-Chinese Fried Rice & Chilly Chicken Feast',
        foodItem: 'Executive Fried Rice, Chilly Chicken Gravy & Veg Spring Rolls',
        foodPrepared: 0,
        foodPacked: 0,
        foodDelivered: 0,
        foodRemaining: 10000,
        waterRequired: '10,000 Bottles',
        waterTotalNumber: 10000,
        waterDelivered: 0,
        waterRemaining: 10000,
        counterStatus: 'PLANNED',
        expenses: 115000,
        expensesBreakdown: [
          { item: 'Poultry & Fresh Produce Supply', amount: 48000 },
          { item: 'Transport fleet & packing supplies', amount: 19000 },
          { item: 'Final day crew wages & wrap-up team', amount: 48000 },
        ],
        tasks: [
          { id: 'd3-t1', title: 'Central kitchen batch scheduling review', done: false },
          { id: 'd3-t2', title: 'Closing ceremony VIP high-tea arrangements', done: false },
          { id: 'd3-t3', title: 'Final venue equipment pack-up & inventory recount', done: false },
        ],
        pending: [
          { id: 'd3-p1', text: 'Return vehicle logistics schedule sign-off', urgency: 'normal' },
        ],
        notes: 'Closing ceremony buffet starts 1:30 PM followed by post-event equipment loading and inventory count.',
      },
    ],
  },
  {
    id: 'evt-wedding-rohit',
    code: 'EVT-2026-0916',
    name: 'Dr. Rohit & Dr. Ananya — Royal Grand Wedding Reception',
    type: 'Wedding Reception',
    clientName: 'Dr. Madhavan Nair',
    clientPhone: '+91 94470 11223',
    clientEmail: 'madhavan.nair@keralahealth.org',
    venue: 'Grand Hyatt Ballroom & Lakeside Lawns, Kochi',
    startDate: '2026-09-16',
    endDate: '2026-09-16',
    numberOfDays: 1,
    totalExpectedGuests: 1450,
    status: 'Completed',
    statusVariant: 'silver',
    cateringManager: 'Capt. Pradeep Menon',
    days: [
      {
        dayNumber: 1,
        dayLabel: 'Day 1 — Grand Wedding Feast',
        date: '2026-09-16',
        expectedGuests: 1450,
        foodRequired: '1,450 Pax Thalassery Biriyani & Continental Spread',
        foodItem: 'Thalassery Biriyani, Nadan Mutton Roast & Chemmeen Roast',
        foodPrepared: 1450,
        foodPacked: 1450,
        foodDelivered: 1450,
        foodRemaining: 0,
        waterRequired: '3,000 Bottles',
        waterTotalNumber: 3000,
        waterDelivered: 3000,
        waterRemaining: 0,
        counterStatus: 'CLOSED',
        expenses: 68500,
        expensesBreakdown: [
          { item: 'Dry Ice & Ice Replenishment', amount: 9500 },
          { item: 'Truck Transport & Tolls', amount: 8000 },
          { item: 'Service Stewards & Banquet Captains', amount: 36000 },
          { item: 'Banana Leaves & Floral Linens', amount: 15000 },
        ],
        tasks: [
          { id: 'w-t1', title: 'Dinner buffet setup at Grand Hyatt Lawns', done: true },
          { id: 'w-t2', title: 'Live Appam & Stew counter staging', done: true },
        ],
        pending: [],
        notes: 'Flawlessly delivered. Client feedback 10/10.',
      },
    ],
  },
  {
    id: 'evt-techmatrix-gala',
    code: 'EVT-2026-0922',
    name: 'TechMatrix Global Annual Banquet & Dinner',
    type: 'Corporate Banquet',
    clientName: 'Sneha Verma (HR Director)',
    clientPhone: '+91 98950 44556',
    clientEmail: 's.verma@techmatrix.com',
    venue: 'Crowne Plaza Convention Center, Maradu',
    startDate: '2026-09-22',
    endDate: '2026-09-22',
    numberOfDays: 1,
    totalExpectedGuests: 450,
    status: 'Upcoming',
    statusVariant: 'gold',
    cateringManager: 'Arun Varma',
    days: [
      {
        dayNumber: 1,
        dayLabel: 'Day 1 — Executive Multicuisine Gala',
        date: '2026-09-22',
        expectedGuests: 450,
        foodRequired: '450 Pax Multicuisine Buffet',
        foodItem: 'Continental Starters, Mughlai Biryani, Kerala Fish Curry',
        foodPrepared: 0,
        foodPacked: 0,
        foodDelivered: 0,
        foodRemaining: 450,
        waterRequired: '1,000 Bottles',
        waterTotalNumber: 1000,
        waterDelivered: 0,
        waterRemaining: 1000,
        counterStatus: 'PLANNED',
        expenses: 35000,
        expensesBreakdown: [
          { item: 'Corporate Buffet Utensils Staging', amount: 12000 },
          { item: 'Uniformed Banquet Stewards (15 pax)', amount: 23000 },
        ],
        tasks: [
          { id: 'c-t1', title: 'Confirm Crowne Plaza loading dock access timing', done: false },
        ],
        pending: [
          { id: 'c-p1', text: 'Confirm dietary preferences (25 vegan pax)', urgency: 'normal' },
        ],
        notes: 'Corporate event with mocktail bar and plated dessert counter.',
      },
    ],
  },
  {
    id: 'evt-sadhya-heritage',
    code: 'EVT-2026-0925',
    name: 'Malabar Heritage Traditional Wedding Sadhya',
    type: 'Traditional Sadhya',
    clientName: 'Sreedharan Nambiar',
    clientPhone: '+91 97455 88990',
    clientEmail: 'nambiar.family@gmail.com',
    venue: 'Calicut Trade Centre, Kozhikode',
    startDate: '2026-09-25',
    endDate: '2026-09-26',
    numberOfDays: 2,
    totalExpectedGuests: 3500,
    status: 'Upcoming',
    statusVariant: 'gold',
    cateringManager: 'Suresh Kumar',
    days: [
      {
        dayNumber: 1,
        dayLabel: 'Day 1 — Pre-wedding Feast',
        date: '2026-09-25',
        expectedGuests: 1500,
        foodRequired: '1,500 Pax Biriyani & Snacks',
        foodItem: 'Kozhikode Dum Biriyani & Sulaimani',
        foodPrepared: 0,
        foodPacked: 0,
        foodDelivered: 0,
        foodRemaining: 1500,
        waterRequired: '3,000 Bottles',
        waterTotalNumber: 3000,
        waterDelivered: 0,
        waterRemaining: 3000,
        counterStatus: 'PLANNED',
        expenses: 42000,
        expensesBreakdown: [],
        tasks: [],
        pending: [],
        notes: 'Pre-wedding informal dinner.',
      },
      {
        dayNumber: 2,
        dayLabel: 'Day 2 — 28-Dish Traditional Kerala Sadhya',
        date: '2026-09-26',
        expectedGuests: 2000,
        foodRequired: '2,000 Pax Traditional Sadhya',
        foodItem: 'Authentic 28-dish Kerala Sadhya on Fresh Plantain Leaves',
        foodPrepared: 0,
        foodPacked: 0,
        foodDelivered: 0,
        foodRemaining: 2000,
        waterRequired: '4,500 Bottles',
        waterTotalNumber: 4500,
        waterDelivered: 0,
        waterRemaining: 4500,
        counterStatus: 'PLANNED',
        expenses: 78000,
        expensesBreakdown: [],
        tasks: [],
        pending: [],
        notes: 'Traditional banana leaf sit-down dining in 4 successive rounds of 500 seats.',
      },
    ],
  },
]

export function EventProvider({ children }) {
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // Fallback
    }
    return INITIAL_EVENTS
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    } catch (e) {
      console.warn('Could not save events to localStorage:', e)
    }
  }, [events])

  const createEvent = useCallback((newEvent) => {
    const id = 'evt-' + Date.now().toString(36)
    const code = 'EVT-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000)

    const fullEvent = {
      id,
      code,
      status: newEvent.status || 'Upcoming',
      statusVariant: newEvent.status === 'Ongoing' ? 'success' : newEvent.status === 'Completed' ? 'silver' : 'gold',
      cateringManager: newEvent.cateringManager || 'Lead Operations Captain',
      ...newEvent,
    }

    setEvents((prev) => [fullEvent, ...prev])
    return fullEvent
  }, [])

  const updateEvent = useCallback((id, updatedFields) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === id) {
          const merged = { ...evt, ...updatedFields }
          // Update status variant if status changed
          if (updatedFields.status) {
            merged.statusVariant =
              updatedFields.status === 'Ongoing'
                ? 'success'
                : updatedFields.status === 'Completed'
                ? 'silver'
                : 'gold'
          }
          return merged
        }
        return evt
      })
    )
  }, [])

  const deleteEvent = useCallback((id) => {
    setEvents((prev) => prev.filter((evt) => evt.id !== id))
  }, [])

  const getEventById = useCallback(
    (id) => {
      return events.find((evt) => evt.id === id) || null
    },
    [events]
  )

  const value = {
    events,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
  }

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>
}

export function useEvents() {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider')
  }
  return context
}
