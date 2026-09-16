import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useExpenses } from './ExpenseContext'

const FinanceContext = createContext(null)

const STORAGE_PRODUCTS_KEY = 'silver_catering_finance_products_v1'
const STORAGE_SALES_KEY = 'silver_catering_finance_sales_v1'
const STORAGE_CLOSINGS_KEY = 'silver_catering_finance_closings_v1'

export const PRODUCT_CATEGORIES = [
  'Main Course',
  'Beverages',
  'Desserts',
  'Welcome Drinks',
  'Snacks',
  'Condiments',
  'Other Food Items',
]

const INITIAL_PRODUCTS = [
  {
    id: 'prod-01',
    productName: 'Chicken Biryani',
    category: 'Main Course',
    sellingPrice: 150,
    costPrice: 100,
    unit: 'Portion / Box',
    status: 'Active',
    notes: 'Aged Jeerakasala dum biryani with marinated broiler chicken piece and egg',
  },
  {
    id: 'prod-02',
    productName: 'Water Bottle',
    category: 'Beverages',
    sellingPrice: 15,
    costPrice: 8,
    unit: '250ml Sealed Bottle',
    status: 'Active',
    notes: '250ml tamper-proof mineral water bottle',
  },
  {
    id: 'prod-03',
    productName: 'Gulab Jamun Sweet',
    category: 'Desserts',
    sellingPrice: 30,
    costPrice: 15,
    unit: 'Cup (2 pcs)',
    status: 'Active',
    notes: 'Hot sugar syrup gulab jamuns for dessert service',
  },
  {
    id: 'prod-04',
    productName: 'Vegetable Salad Raitha',
    category: 'Condiments',
    sellingPrice: 20,
    costPrice: 10,
    unit: 'Cup (150g)',
    status: 'Active',
    notes: 'Fresh curd, chopped onions, and cilantro',
  },
  {
    id: 'prod-05',
    productName: 'Lime Mint Welcome Drink',
    category: 'Welcome Drinks',
    sellingPrice: 25,
    costPrice: 12,
    unit: 'Cup (200ml)',
    status: 'Active',
    notes: 'Fresh chilled mint lime cooler for guest reception',
  },
]

// Authentic 3-Day 30,000 People College Event Sales Dataset
// Day 1: 5,000 Biryani @ 150 + 5,000 Water @ 15 = 8,25,000
// Day 2: 5,200 Biryani @ 150 + 5,200 Water @ 15 = 8,58,000
// Day 3: 4,900 Biryani @ 150 + 4,900 Water @ 15 = 8,08,500
// Total 3-Day Biryani: 15,100 | Total Water: 15,100 | Grand Total: ₹24,91,500
const INITIAL_SALES = [
  // Day 1
  {
    id: 'sale-01',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 1,
    productId: 'prod-01',
    productName: 'Chicken Biryani',
    quantity: 5000,
    price: 150,
    total: 750000,
    date: '2026-03-20',
    notes: 'Day 1 student & faculty lunch distribution batch',
  },
  {
    id: 'sale-02',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 1,
    productId: 'prod-02',
    productName: 'Water Bottle',
    quantity: 5000,
    price: 15,
    total: 75000,
    date: '2026-03-20',
    notes: 'Day 1 single counter hydration distribution',
  },

  // Day 2
  {
    id: 'sale-03',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 2,
    productId: 'prod-01',
    productName: 'Chicken Biryani',
    quantity: 5200,
    price: 150,
    total: 780000,
    date: '2026-03-21',
    notes: 'Day 2 inter-college participants lunch crowd',
  },
  {
    id: 'sale-04',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 2,
    productId: 'prod-02',
    productName: 'Water Bottle',
    quantity: 5200,
    price: 15,
    total: 78000,
    date: '2026-03-21',
    notes: 'Day 2 afternoon mineral water demand',
  },

  // Day 3
  {
    id: 'sale-05',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 3,
    productId: 'prod-01',
    productName: 'Chicken Biryani',
    quantity: 4900,
    price: 150,
    total: 735000,
    date: '2026-03-22',
    notes: 'Day 3 valedictory session lunch distribution',
  },
  {
    id: 'sale-06',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 3,
    productId: 'prod-02',
    productName: 'Water Bottle',
    quantity: 4900,
    price: 15,
    total: 73500,
    date: '2026-03-22',
    notes: 'Day 3 closing event hydration tally',
  },
]

const INITIAL_CLOSINGS = {
  days: {
    1: { isClosed: false, closedAt: null, notes: '' },
    2: { isClosed: false, closedAt: null, notes: '' },
    3: { isClosed: false, closedAt: null, notes: '' },
  },
  eventClosed: false,
  eventClosedAt: null,
  finalNotes: '',
}

export function FinanceProvider({ children }) {
  const { expenses } = useExpenses()

  // State: Products
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PRODUCTS_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // Fallback
    }
    return INITIAL_PRODUCTS
  })

  // State: Sales records
  const [sales, setSales] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SALES_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // Fallback
    }
    return INITIAL_SALES
  })

  // State: Closings
  const [closings, setClosings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CLOSINGS_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // Fallback
    }
    return INITIAL_CLOSINGS
  })

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PRODUCTS_KEY, JSON.stringify(products))
    } catch (e) {
      console.warn('Could not save products to localStorage:', e)
    }
  }, [products])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SALES_KEY, JSON.stringify(sales))
    } catch (e) {
      console.warn('Could not save sales to localStorage:', e)
    }
  }, [sales])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CLOSINGS_KEY, JSON.stringify(closings))
    } catch (e) {
      console.warn('Could not save closings to localStorage:', e)
    }
  }, [closings])

  // ==========================================
  // PRODUCT & PRICE MANAGEMENT METHODS
  // ==========================================
  const addProduct = useCallback((productData) => {
    const newProduct = {
      id: 'prod-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      productName: productData.productName?.trim() || 'New Item',
      category: productData.category || 'Main Course',
      sellingPrice: Number(productData.sellingPrice) || 0,
      costPrice: Number(productData.costPrice) || 0,
      unit: productData.unit || 'Portion / Box',
      status: productData.status || 'Active',
      notes: productData.notes || '',
    }
    setProducts((prev) => [...prev, newProduct])
    return newProduct
  }, [])

  const updateProduct = useCallback((id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        return {
          ...p,
          ...updatedFields,
          sellingPrice:
            updatedFields.sellingPrice !== undefined
              ? Number(updatedFields.sellingPrice)
              : p.sellingPrice,
          costPrice:
            updatedFields.costPrice !== undefined
              ? Number(updatedFields.costPrice)
              : p.costPrice,
        }
      })
    )
  }, [])

  /**
   * Price editing with scope selection:
   * @param {string} productId
   * @param {number} newPrice
   * @param {'current_day' | 'future_days' | 'all_days'} scope
   * @param {number} currentDayNumber
   */
  const updateProductPrice = useCallback((productId, newPrice, scope, currentDayNumber = 1) => {
    const numPrice = Number(newPrice) || 0

    // 1. Update product base selling price
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, sellingPrice: numPrice } : p))
    )

    // 2. Adjust sales records based on chosen scope without altering locked/closed days!
    setSales((prev) =>
      prev.map((sale) => {
        if (sale.productId !== productId) return sale

        // If this sale's day is already closed, NEVER alter historical completed records!
        const dayIsClosed = closings.days[sale.dayNumber]?.isClosed
        if (dayIsClosed) return sale

        if (scope === 'current_day') {
          if (sale.dayNumber === currentDayNumber) {
            const updatedTotal = (Number(sale.quantity) || 0) * numPrice
            return { ...sale, price: numPrice, total: updatedTotal }
          }
        } else if (scope === 'future_days') {
          if (sale.dayNumber >= currentDayNumber) {
            const updatedTotal = (Number(sale.quantity) || 0) * numPrice
            return { ...sale, price: numPrice, total: updatedTotal }
          }
        } else if (scope === 'all_days') {
          const updatedTotal = (Number(sale.quantity) || 0) * numPrice
          return { ...sale, price: numPrice, total: updatedTotal }
        }

        return sale
      })
    )
  }, [closings])

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  // ==========================================
  // SALES RECORDING METHODS
  // ==========================================
  const addSale = useCallback((saleData) => {
    const qty = Number(saleData.quantity) || 0
    const price = Number(saleData.price) || 0
    const total = qty * price

    const newSale = {
      id: 'sale-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      eventId: saleData.eventId || 'evt-college-3day',
      eventName: saleData.eventName || 'National Tech Fest 2026',
      dayNumber: Number(saleData.dayNumber) || 1,
      productId: saleData.productId,
      productName: saleData.productName,
      quantity: qty,
      price: price,
      total: total,
      date: saleData.date || new Date().toISOString().split('T')[0],
      notes: saleData.notes || '',
    }

    setSales((prev) => [newSale, ...prev])
    return newSale
  }, [])

  const updateSale = useCallback((id, updatedFields) => {
    setSales((prev) =>
      prev.map((sale) => {
        if (sale.id !== id) return sale
        const qty =
          updatedFields.quantity !== undefined
            ? Number(updatedFields.quantity)
            : sale.quantity
        const price =
          updatedFields.price !== undefined ? Number(updatedFields.price) : sale.price
        const total = qty * price

        return {
          ...sale,
          ...updatedFields,
          quantity: qty,
          price: price,
          total: total,
        }
      })
    )
  }, [])

  const deleteSale = useCallback((id) => {
    setSales((prev) => prev.filter((sale) => sale.id !== id))
  }, [])

  // ==========================================
  // CLOSING WORKFLOWS
  // ==========================================
  const closeDay = useCallback((dayNumber, notes = '') => {
    setClosings((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [dayNumber]: {
          isClosed: true,
          closedAt: new Date().toISOString(),
          notes: notes || `Day ${dayNumber} operations and financials verified & locked.`,
        },
      },
    }))
  }, [])

  const reopenDay = useCallback((dayNumber) => {
    setClosings((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [dayNumber]: {
          isClosed: false,
          closedAt: null,
          notes: '',
        },
      },
    }))
  }, [])

  const closeEvent = useCallback((notes = '') => {
    setClosings((prev) => ({
      ...prev,
      eventClosed: true,
      eventClosedAt: new Date().toISOString(),
      finalNotes: notes || 'All 3-Day catering operations and financial reconciliations closed.',
    }))
  }, [])

  const reopenEvent = useCallback(() => {
    setClosings((prev) => ({
      ...prev,
      eventClosed: false,
      eventClosedAt: null,
      finalNotes: '',
    }))
  }, [])

  // ==========================================
  // FINANCIAL CALCULATIONS & AGGREGATIONS
  // ==========================================
  const getDailyFinancials = useCallback(
    (eventId, dayNumber) => {
      const daySales = sales.filter((s) => {
        if (eventId && s.eventId !== eventId) return false
        return Number(s.dayNumber) === Number(dayNumber)
      })

      const totalSales = daySales.reduce((sum, s) => sum + (Number(s.total) || 0), 0)

      const dayExpenses = expenses.filter((e) => {
        if (eventId && e.eventId !== eventId) return false
        return Number(e.dayNumber) === Number(dayNumber)
      })

      const totalExpenses = dayExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
      const netIncome = totalSales - totalExpenses

      return {
        dayNumber: Number(dayNumber),
        sales: daySales,
        totalSales,
        expenses: dayExpenses,
        totalExpenses,
        netIncome,
        isClosed: !!closings.days[dayNumber]?.isClosed,
        closedAt: closings.days[dayNumber]?.closedAt,
        notes: closings.days[dayNumber]?.notes,
      }
    },
    [sales, expenses, closings]
  )

  const getThreeDayFinancials = useCallback(
    (eventId) => {
      const day1 = getDailyFinancials(eventId, 1)
      const day2 = getDailyFinancials(eventId, 2)
      const day3 = getDailyFinancials(eventId, 3)

      const totalSales = day1.totalSales + day2.totalSales + day3.totalSales
      const totalExpenses = day1.totalExpenses + day2.totalExpenses + day3.totalExpenses
      const finalNetIncome = totalSales - totalExpenses

      // Product-wise sales summary
      const productSummaryMap = {}
      products.forEach((p) => {
        productSummaryMap[p.productName] = {
          productName: p.productName,
          category: p.category,
          unit: p.unit,
          day1Qty: 0,
          day2Qty: 0,
          day3Qty: 0,
          totalQty: 0,
          appliedPrice: p.sellingPrice,
          totalIncome: 0,
        }
      })

      sales
        .filter((s) => !eventId || s.eventId === eventId)
        .forEach((s) => {
          const name = s.productName
          if (!productSummaryMap[name]) {
            productSummaryMap[name] = {
              productName: name,
              category: 'Food & Beverage',
              unit: 'Unit',
              day1Qty: 0,
              day2Qty: 0,
              day3Qty: 0,
              totalQty: 0,
              appliedPrice: s.price,
              totalIncome: 0,
            }
          }
          const qty = Number(s.quantity) || 0
          const tot = Number(s.total) || 0

          if (s.dayNumber === 1) productSummaryMap[name].day1Qty += qty
          else if (s.dayNumber === 2) productSummaryMap[name].day2Qty += qty
          else if (s.dayNumber === 3) productSummaryMap[name].day3Qty += qty

          productSummaryMap[name].totalQty += qty
          productSummaryMap[name].totalIncome += tot
        })

      const productSummary = Object.values(productSummaryMap).filter((item) => item.totalQty > 0)

      // Expense category breakdown
      const expenseCategoryMap = {}
      expenses
        .filter((e) => !eventId || e.eventId === eventId)
        .forEach((e) => {
          const cat = e.category || 'Other'
          const amt = Number(e.amount) || 0
          expenseCategoryMap[cat] = (expenseCategoryMap[cat] || 0) + amt
        })

      const expenseCategorySummary = Object.entries(expenseCategoryMap)
        .map(([category, total]) => ({ category, total }))
        .sort((a, b) => b.total - a.total)

      return {
        day1,
        day2,
        day3,
        totalSales,
        totalExpenses,
        finalNetIncome,
        productSummary,
        expenseCategorySummary,
        isEventClosed: closings.eventClosed,
        eventClosedAt: closings.eventClosedAt,
        finalNotes: closings.finalNotes,
      }
    },
    [getDailyFinancials, products, sales, expenses, closings]
  )

  const value = {
    products,
    categories: PRODUCT_CATEGORIES,
    sales,
    closings,
    addProduct,
    updateProduct,
    updateProductPrice,
    deleteProduct,
    addSale,
    updateSale,
    deleteSale,
    closeDay,
    reopenDay,
    closeEvent,
    reopenEvent,
    getDailyFinancials,
    getThreeDayFinancials,
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}

