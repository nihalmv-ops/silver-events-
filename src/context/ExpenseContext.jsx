import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const ExpenseContext = createContext(null)

const STORAGE_KEY = 'silver_catering_expenses_data_v1'
const BUDGET_STORAGE_KEY = 'silver_catering_budget_data_v1'

export const EXPENSE_CATEGORIES = [
  'Food',
  'Chicken',
  'Rice',
  'Vegetables',
  'Spices',
  'Water',
  'Containers',
  'Packing Materials',
  'Staff',
  'Transportation',
  'Gas/Fuel',
  'Equipment',
  'Decoration',
  'Sound',
  'Lighting',
  'Printing',
  'Cleaning',
  'Other',
]

export const PAYMENT_METHODS = [
  'Cash',
  'UPI',
  'Bank Transfer',
  'Cheque',
]

export const EXPENSE_STATUSES = [
  'Paid',
  'Pending',
]

const DEFAULT_BUDGETS = {
  'evt-college-3day': {
    totalEstimated: 2650000,
    day1Estimated: 920000,
    day2Estimated: 890000,
    day3Estimated: 840000,
  },
  'evt-wedding-royal': {
    totalEstimated: 1250000,
    day1Estimated: 1250000,
    day2Estimated: 0,
    day3Estimated: 0,
  },
}

const INITIAL_EXPENSES = [
  // Day 1
  {
    id: 'exp-01',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 1,
    category: 'Chicken',
    description: '4,500 kg fresh dressed broiler chicken cut for Day 1 biryani',
    vendor: 'Malabar Broilers & Farm Fresh Poultry',
    amount: 220000,
    date: '2026-03-20',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    receipt: 'RCP-MB-01',
    notes: '04:00 AM delivery inspected and cold chain temperature verified.',
  },
  {
    id: 'exp-02',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 1,
    category: 'Rice',
    description: '3,000 kg premium aged Jeerakasala biryani rice',
    vendor: 'Calicut Heritage Spice Mills & Royal Basmati',
    amount: 140000,
    date: '2026-03-19',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    receipt: 'RCP-CH-102',
    notes: 'Pre-inspected sacks stacked at dry kitchen storage.',
  },
  {
    id: 'exp-03',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 1,
    category: 'Spices',
    description: 'Whole garam masala, cardamom, cloves, cinnamon & pure saffron',
    vendor: 'Calicut Heritage Spice Mills & Royal Basmati',
    amount: 55000,
    date: '2026-03-19',
    paymentMethod: 'UPI',
    status: 'Paid',
    receipt: 'RCP-SP-44',
    notes: 'Direct mill ground aromatic whole spices.',
  },
  {
    id: 'exp-04',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 1,
    category: 'Vegetables',
    description: '1,200 kg onions, ginger, garlic, green chilies and mint/coriander',
    vendor: 'Ooty Fresh Produce Hub',
    amount: 42000,
    date: '2026-03-20',
    paymentMethod: 'Cash',
    status: 'Paid',
    receipt: 'RCP-VG-88',
    notes: 'Delivered at 03:30 AM to prep chopping line.',
  },
  {
    id: 'exp-05',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 1,
    category: 'Water',
    description: '10,000 bottles (250ml) shrink-wrapped mineral water for Day 1',
    vendor: 'Kaveri Pure Aqua Springs Ltd',
    amount: 28000,
    date: '2026-03-20',
    paymentMethod: 'UPI',
    status: 'Paid',
    receipt: 'RCP-KA-11',
    notes: 'Stationed beside Single Distribution Counter line.',
  },
  {
    id: 'exp-06',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 1,
    category: 'Containers',
    description: '10,000 heavy-duty leakproof meal containers with tight lids',
    vendor: 'EcoPack Kraft Food Containers',
    amount: 36000,
    date: '2026-03-19',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    receipt: 'RCP-EP-201',
    notes: 'Hot-safe food grade containers for speedy packaging.',
  },
  {
    id: 'exp-07',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 1,
    category: 'Packing Materials',
    description: 'Thermal seal foil covers, packaging cling wrap & master cartons',
    vendor: 'Modern Paper & Packaging Mart',
    amount: 12500,
    date: '2026-03-19',
    paymentMethod: 'Cash',
    status: 'Paid',
    receipt: 'RCP-PM-91',
    notes: 'For packing assembly line table station.',
  },
  {
    id: 'exp-08',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 1,
    category: 'Gas/Fuel',
    description: '4 commercial 47.5 kg LPG cooking gas cylinders for dum burners',
    vendor: 'Kerala Flame Commercial LPG Agency',
    amount: 16000,
    date: '2026-03-20',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    receipt: 'RCP-LPG-01',
    notes: 'Connected to high-pressure burner bank.',
  },
  {
    id: 'exp-09',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 1,
    category: 'Transportation',
    description: 'Refrigerated food transport truck convoy between kitchen and venue',
    vendor: 'Highway Logistics & Cold Chain Transport',
    amount: 22000,
    date: '2026-03-20',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    receipt: 'RCP-HL-50',
    notes: 'Round trip hot-box shuttle service.',
  },
  {
    id: 'exp-10',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 1,
    category: 'Staff',
    description: 'Central kitchen master chefs, packing team & counter marshals daily wages',
    vendor: 'Internal Operations Crew Disbursal',
    amount: 85000,
    date: '2026-03-20',
    paymentMethod: 'Cash',
    status: 'Paid',
    receipt: 'RCP-STF-01',
    notes: 'Signed duty muster payment sheet on file.',
  },
  {
    id: 'exp-11',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 1,
    category: 'Cleaning',
    description: 'Post-distribution cleaning crew & biodegradable waste removal',
    vendor: 'CleanPro Facility & Hygiene Services',
    amount: 14000,
    date: '2026-03-20',
    paymentMethod: 'UPI',
    status: 'Pending',
    receipt: 'RCP-CL-12',
    notes: 'Final ground clean-up sign-off pending college inspection.',
  },

  // Day 2
  {
    id: 'exp-12',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 2,
    category: 'Chicken',
    description: '4,500 kg fresh dressed broiler chicken for Day 2 biryani',
    vendor: 'Malabar Broilers & Farm Fresh Poultry',
    amount: 220000,
    date: '2026-03-21',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    receipt: 'RCP-MB-02',
    notes: 'Morning fresh cut delivered on time.',
  },
  {
    id: 'exp-13',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 2,
    category: 'Rice',
    description: '3,000 kg aged Jeerakasala biryani rice',
    vendor: 'Calicut Heritage Spice Mills & Royal Basmati',
    amount: 140000,
    date: '2026-03-21',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    receipt: 'RCP-CH-103',
    notes: 'Batch quality check verified.',
  },
  {
    id: 'exp-14',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 2,
    category: 'Vegetables',
    description: 'Day 2 fresh onions, herbs, garlic, ginger and lemons for raitha',
    vendor: 'Ooty Fresh Produce Hub',
    amount: 44000,
    date: '2026-03-21',
    paymentMethod: 'Cash',
    status: 'Paid',
    receipt: 'RCP-VG-89',
    notes: 'Delivered directly to central peeling & chopping bay.',
  },
  {
    id: 'exp-15',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 2,
    category: 'Water',
    description: '10,000 bottles (250ml) mineral water for Day 2',
    vendor: 'Kaveri Pure Aqua Springs Ltd',
    amount: 28000,
    date: '2026-03-21',
    paymentMethod: 'UPI',
    status: 'Paid',
    receipt: 'RCP-KA-12',
    notes: 'Single counter hydration stack maintained.',
  },
  {
    id: 'exp-16',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 2,
    category: 'Containers',
    description: '10,000 leakproof meal containers with covers for Day 2',
    vendor: 'EcoPack Kraft Food Containers',
    amount: 36000,
    date: '2026-03-21',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
    receipt: 'RCP-EP-202',
    notes: 'Inspected for intact lids and structural rigidity.',
  },
  {
    id: 'exp-17',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 2,
    category: 'Staff',
    description: 'Day 2 kitchen cooks, packing team and counter queue marshals',
    vendor: 'Internal Operations Crew Disbursal',
    amount: 85000,
    date: '2026-03-21',
    paymentMethod: 'Cash',
    status: 'Paid',
    receipt: 'RCP-STF-02',
    notes: 'All 34 personnel on-site attendance confirmed.',
  },
  {
    id: 'exp-18',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 2,
    category: 'Sound',
    description: 'PA speaker array and mic stations along single counter line',
    vendor: 'Apex Pro Sound & Stage Systems',
    amount: 18000,
    date: '2026-03-21',
    paymentMethod: 'UPI',
    status: 'Pending',
    receipt: 'RCP-SND-01',
    notes: 'Balance due upon end of day sound technician clearance.',
  },

  // Day 3
  {
    id: 'exp-19',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 3,
    category: 'Chicken',
    description: '4,500 kg fresh dressed chicken for Day 3 grand finale biryani',
    vendor: 'Malabar Broilers & Farm Fresh Poultry',
    amount: 220000,
    date: '2026-03-22',
    paymentMethod: 'Bank Transfer',
    status: 'Pending',
    receipt: 'RCP-MB-03',
    notes: 'Scheduled for 03:45 AM arrival at kitchen bay.',
  },
  {
    id: 'exp-20',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 3,
    category: 'Rice',
    description: '3,000 kg Jeerakasala biryani rice for Day 3',
    vendor: 'Calicut Heritage Spice Mills & Royal Basmati',
    amount: 140000,
    date: '2026-03-22',
    paymentMethod: 'Bank Transfer',
    status: 'Pending',
    receipt: 'RCP-CH-104',
    notes: 'Reserved in warehouse; to be dispatched by 04:00 AM.',
  },
  {
    id: 'exp-21',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 3,
    category: 'Vegetables',
    description: 'Fresh vegetables, ginger, garlic & onions for Day 3 cooking',
    vendor: 'Ooty Fresh Produce Hub',
    amount: 45000,
    date: '2026-03-22',
    paymentMethod: 'Cash',
    status: 'Pending',
    receipt: 'RCP-VG-90',
    notes: 'Early morning vegetable arrival.',
  },
  {
    id: 'exp-22',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 3,
    category: 'Water',
    description: '10,000 bottles (250ml) mineral water for Day 3 distribution',
    vendor: 'Kaveri Pure Aqua Springs Ltd',
    amount: 29000,
    date: '2026-03-22',
    paymentMethod: 'UPI',
    status: 'Pending',
    receipt: 'RCP-KA-13',
    notes: 'Dispatched in pallet packs.',
  },
  {
    id: 'exp-23',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 3,
    category: 'Containers',
    description: '10,000 meal containers and lids for Day 3',
    vendor: 'EcoPack Kraft Food Containers',
    amount: 38000,
    date: '2026-03-22',
    paymentMethod: 'Bank Transfer',
    status: 'Pending',
    receipt: 'RCP-EP-203',
    notes: 'Day 3 container pallet ready for delivery.',
  },
  {
    id: 'exp-24',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 3,
    category: 'Staff',
    description: 'Day 3 kitchen chefs, packing line, queue marshals & closing crew',
    vendor: 'Internal Operations Crew Disbursal',
    amount: 85000,
    date: '2026-03-22',
    paymentMethod: 'Cash',
    status: 'Pending',
    receipt: 'RCP-STF-03',
    notes: 'Payable at 06:00 PM upon final kitchen demobilization.',
  },
  {
    id: 'exp-25',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 3,
    category: 'Printing',
    description: 'Thermal container labels, batch numbers & counter signboards',
    vendor: 'Calicut Rapid Print & Media',
    amount: 6500,
    date: '2026-03-20',
    paymentMethod: 'UPI',
    status: 'Paid',
    receipt: 'RCP-PRT-05',
    notes: 'High-contrast directional queue signage and container stickers.',
  },
  {
    id: 'exp-26',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 3,
    category: 'Decoration',
    description: 'Single distribution counter skirting, canopy drape & queue stanchions',
    vendor: 'Royal Elegance Event Decors',
    amount: 24000,
    date: '2026-03-19',
    paymentMethod: 'Cheque',
    status: 'Paid',
    receipt: 'RCP-DEC-10',
    notes: 'Installed around single distribution zone on grounds.',
  },
]

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_EXPENSES
  })

  const [budgets, setBudgets] = useState(() => {
    try {
      const saved = localStorage.getItem(BUDGET_STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // Fallback
    }
    return DEFAULT_BUDGETS
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
    } catch (e) {
      console.warn('Could not save expenses to localStorage:', e)
    }
  }, [expenses])

  useEffect(() => {
    try {
      localStorage.setItem(BUDGET_STORAGE_KEY, JSON.stringify(budgets))
    } catch (e) {
      console.warn('Could not save budgets to localStorage:', e)
    }
  }, [budgets])

  const addExpense = useCallback((expenseData) => {
    const amount = Number(expenseData.amount) || 0
    const newExpense = {
      id: 'exp-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      ...expenseData,
      amount,
      dayNumber: expenseData.dayNumber === 'All' ? 'All' : Number(expenseData.dayNumber) || 1,
      date: expenseData.date || new Date().toISOString().split('T')[0],
      status: expenseData.status || 'Paid',
      paymentMethod: expenseData.paymentMethod || 'Bank Transfer',
      receipt: expenseData.receipt || `RCP-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: expenseData.notes || '',
    }

    setExpenses((prev) => [newExpense, ...prev])
    return newExpense
  }, [])

  const updateExpense = useCallback((id, updatedFields) => {
    setExpenses((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const amount =
          updatedFields.amount !== undefined ? Number(updatedFields.amount) : item.amount
        return {
          ...item,
          ...updatedFields,
          amount,
        }
      })
    )
  }, [])

  const deleteExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const toggleExpenseStatus = useCallback((id) => {
    setExpenses((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const nextStatus = item.status === 'Paid' ? 'Pending' : 'Paid'
        return {
          ...item,
          status: nextStatus,
        }
      })
    )
  }, [])

  const updateEventBudget = useCallback((eventId, budgetData) => {
    setBudgets((prev) => ({
      ...prev,
      [eventId]: {
        ...(prev[eventId] || {}),
        ...budgetData,
      },
    }))
  }, [])

  const getExpenseSummary = useCallback(
    (eventId) => {
      const filtered = eventId ? expenses.filter((e) => e.eventId === eventId) : expenses
      const eventBudget = (eventId && budgets[eventId]) || {
        totalEstimated: 2650000,
        day1Estimated: 920000,
        day2Estimated: 890000,
        day3Estimated: 840000,
      }

      const actualExpense = filtered.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
      const paidExpense = filtered
        .filter((item) => item.status === 'Paid')
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
      const pendingExpense = filtered
        .filter((item) => item.status === 'Pending')
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)

      const day1Expense = filtered
        .filter((item) => Number(item.dayNumber) === 1)
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)

      const day2Expense = filtered
        .filter((item) => Number(item.dayNumber) === 2)
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)

      const day3Expense = filtered
        .filter((item) => Number(item.dayNumber) === 3)
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)

      return {
        estimatedExpense: eventBudget.totalEstimated || 2650000,
        actualExpense,
        paidExpense,
        pendingExpense,
        day1Expense,
        day2Expense,
        day3Expense,
        day1Estimated: eventBudget.day1Estimated || 920000,
        day2Estimated: eventBudget.day2Estimated || 890000,
        day3Estimated: eventBudget.day3Estimated || 840000,
        totalEventExpense: actualExpense,
      }
    },
    [expenses, budgets]
  )

  const value = {
    expenses,
    categories: EXPENSE_CATEGORIES,
    paymentMethods: PAYMENT_METHODS,
    statuses: EXPENSE_STATUSES,
    addExpense,
    updateExpense,
    deleteExpense,
    toggleExpenseStatus,
    updateEventBudget,
    getExpenseSummary,
  }

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
}

export function useExpenses() {
  const context = useContext(ExpenseContext)
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider')
  }
  return context
}

