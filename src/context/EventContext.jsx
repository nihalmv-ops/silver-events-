import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const EventContext = createContext(null)

const STORAGE_KEY = 'silver_catering_events_data_v4'

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
        menu: [
          {
            id: 'm-d1-1',
            name: 'Chicken Biryani',
            category: 'Non-Vegetarian',
            unit: 'Pax',
            quantity: 10000,
            notes: 'Authentic Thalassery dum biriyani in 40 cauldrons with egg & fried onions',
          },
          {
            id: 'm-d1-2',
            name: 'Water Bottle',
            category: 'Other',
            unit: 'Bottles',
            quantity: 10000,
            notes: '250ml hygienic chilled sealed mineral drinking water bottles',
          },
        ],
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
        foodRequired: '10,000 Pax Chicken Biryani',
        foodItem: 'Chicken Biryani with Raitha, Pickle & Pappadam',
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
        menu: [
          {
            id: 'm-d2-1',
            name: 'Chicken Biryani',
            category: 'Non-Vegetarian',
            unit: 'Pax',
            quantity: 10000,
            notes: 'Authentic Thalassery dum biriyani with aromatic spices and cashews',
          },
          {
            id: 'm-d2-2',
            name: 'Water Bottle',
            category: 'Other',
            unit: 'Bottles',
            quantity: 10000,
            notes: '250ml hygienic sealed mineral drinking water bottles',
          },
        ],
        expensesBreakdown: [
          { item: 'Fresh Poultry Procurement (Halal certified)', amount: 68000 },
          { item: 'Logistics Transport & Fuel (Day 2)', amount: 20000 },
          { item: 'Temporary Crew Day 2 (45 crew)', amount: 50000 },
        ],
        tasks: [
          { id: 'd2-t1', title: 'Central Kitchen cauldrons fire-up at 04:30 AM', done: true },
          { id: 'd2-t2', title: 'Chicken marination and dum seal temperature check', done: true },
          { id: 'd2-t3', title: 'Morning transport convoy departure at 09:30 AM', done: false },
        ],
        pending: [
          { id: 'd2-p1', text: 'Confirm second refrigerated vehicle gate pass', urgency: 'high' },
        ],
        notes: 'Day 2 repeat biryani service with heightened demand during lunch break.',
      },
      {
        dayNumber: 3,
        dayLabel: 'Day 3 — Valedictory & Closing Feast',
        date: '2026-09-18',
        expectedGuests: 10000,
        foodRequired: '10,000 Pax Chicken Biryani',
        foodItem: 'Chicken Biryani with Raitha, Pickle & Pappadam',
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
        menu: [
          {
            id: 'm-d3-1',
            name: 'Chicken Biryani',
            category: 'Non-Vegetarian',
            unit: 'Pax',
            quantity: 10000,
            notes: 'Closing feast Thalassery Chicken Biryani',
          },
          {
            id: 'm-d3-2',
            name: 'Water Bottle',
            category: 'Other',
            unit: 'Bottles',
            quantity: 10000,
            notes: '250ml chilled mineral water bottles',
          },
        ],
        expensesBreakdown: [
          { item: 'Poultry & Fresh Produce Supply', amount: 48000 },
          { item: 'Transport fleet & packing supplies', amount: 19000 },
          { item: 'Final day crew wages & wrap-up team', amount: 48000 },
        ],
        tasks: [
          { id: 'd3-t1', title: 'Central kitchen batch scheduling review', done: false },
          { id: 'd3-t2', title: 'Closing ceremony buffet setup', done: false },
        ],
        pending: [],
        notes: 'Closing ceremony buffet starts 1:30 PM followed by post-event equipment loading.',
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
        menu: [
          {
            id: 'm-w-1',
            name: 'Chicken Biryani',
            category: 'Non-Vegetarian',
            unit: 'Pax',
            quantity: 1450,
            notes: 'Thalassery special',
          },
          {
            id: 'm-w-2',
            name: 'Nadan Mutton Roast',
            category: 'Lunch',
            unit: 'Pax',
            quantity: 1450,
            notes: 'Slow roasted with coconut chips',
          },
          {
            id: 'm-w-3',
            name: 'Water Bottle',
            category: 'Other',
            unit: 'Bottles',
            quantity: 3000,
            notes: 'Chilled bottles',
          },
        ],
        expensesBreakdown: [],
        tasks: [],
        pending: [],
        notes: 'Flawlessly delivered. Client feedback 10/10.',
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

  // Add menu item to a specific day of an event
  const addDayMenuItem = useCallback((eventId, dayNumber, item) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== eventId) return evt

        const updatedDays = (evt.days || []).map((day) => {
          if (day.dayNumber !== dayNumber) return day
          const newItem = {
            id: 'm-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
            name: item.name,
            category: item.category || 'Other',
            unit: item.unit || 'Pax',
            quantity: Number(item.quantity) || day.expectedGuests || 1000,
            notes: item.notes || '',
          }
          const currentMenu = day.menu || []
          return {
            ...day,
            menu: [...currentMenu, newItem],
          }
        })

        return { ...evt, days: updatedDays }
      })
    )
  }, [])

  // Update menu item on a specific day of an event
  const updateDayMenuItem = useCallback((eventId, dayNumber, itemId, updatedFields) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== eventId) return evt

        const updatedDays = (evt.days || []).map((day) => {
          if (day.dayNumber !== dayNumber) return day
          const currentMenu = (day.menu || []).map((m) =>
            m.id === itemId ? { ...m, ...updatedFields } : m
          )
          return { ...day, menu: currentMenu }
        })

        return { ...evt, days: updatedDays }
      })
    )
  }, [])

  // Delete menu item from a specific day of an event
  const deleteDayMenuItem = useCallback((eventId, dayNumber, itemId) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== eventId) return evt

        const updatedDays = (evt.days || []).map((day) => {
          if (day.dayNumber !== dayNumber) return day
          const currentMenu = (day.menu || []).filter((m) => m.id !== itemId)
          return { ...day, menu: currentMenu }
        })

        return { ...evt, days: updatedDays }
      })
    )
  }, [])

  // Copy Menu from one day to another day (e.g. Copy Day 1 -> Day 2, Copy Day 1 -> Day 3)
  const copyDayMenu = useCallback((eventId, sourceDayNumber, targetDayNumber) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== eventId) return evt

        const sourceDay = (evt.days || []).find((d) => d.dayNumber === sourceDayNumber)
        if (!sourceDay || !sourceDay.menu || sourceDay.menu.length === 0) return evt

        const targetDay = (evt.days || []).find((d) => d.dayNumber === targetDayNumber)
        const targetGuests = targetDay?.expectedGuests || sourceDay.expectedGuests || 1000

        // Deep clone items with new IDs and adapt quantity to target day's expected guests
        const clonedMenu = sourceDay.menu.map((item) => {
          // If the item quantity in source was matching the source guests, match target guests
          const shouldScale = item.quantity === sourceDay.expectedGuests || item.unit === 'Pax' || item.unit === 'Bottles'
          return {
            ...item,
            id: 'm-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
            quantity: shouldScale ? targetGuests : item.quantity,
          }
        })

        const updatedDays = (evt.days || []).map((day) => {
          if (day.dayNumber !== targetDayNumber) return day
          return {
            ...day,
            menu: clonedMenu,
          }
        })

        return { ...evt, days: updatedDays }
      })
    )
  }, [])

  const value = {
    events,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    addDayMenuItem,
    updateDayMenuItem,
    deleteDayMenuItem,
    copyDayMenu,
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
