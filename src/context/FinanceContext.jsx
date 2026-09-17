import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { useExpenses } from './ExpenseContext'

const FinanceContext = createContext(null)

const STORAGE_PRODUCTS_KEY = 'silver_catering_finance_products_v3'
const STORAGE_SALES_KEY = 'silver_catering_finance_sales_v3'
const STORAGE_CLOSINGS_KEY = 'silver_catering_finance_closings_v3'
const STORAGE_DAILY_STOCK_KEY = 'silver_catering_daily_stock_v3'
const STORAGE_COUNTER_STATUS_KEY = 'silver_catering_counter_status_v3'

export const PRODUCT_CATEGORIES = [
  'Main Course',
  'Beverages',
  'Desserts',
  'Welcome Drinks',
  'Snacks',
  'Condiments',
  'Other Food Items',
]

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-01',
    productName: 'Chicken Biryani',
    category: 'Main Course',
    sellingPrice: 150,
    costPrice: 95,
    unit: 'Portion / Box',
    status: 'Active',
    notes: 'Aged Jeerakasala dum biryani with marinated broiler chicken piece and egg',
  },
  {
    id: 'prod-06',
    productName: 'Popcorn',
    category: 'Snacks',
    sellingPrice: 30,
    costPrice: 10,
    unit: 'Tub / Cone',
    status: 'Active',
    notes: 'Freshly popped warm butter-salted crispy popcorn for event counter',
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

// Day 1 Exact User Baseline:
// Chicken Biryani: Prepared 5000, Sold 4700, Remaining 300, Price ₹150, Income ₹705,000
// Popcorn: Prepared 2000, Sold 1800, Remaining 200, Price ₹30, Income ₹54,000
// Water Bottle: Available 5000, Sold 4500, Remaining 500, Price ₹15, Income ₹67,500
// Total Day 1 Sales / Income: ₹826,500
// Day 2 Sales / Income: ₹882,000 | Day 3 Sales / Income: ₹847,500
// 3-Day Total Sales / Income: ₹2,556,000
const INITIAL_SALES = [
  // Day 1 (Total: ₹826,500)
  {
    id: 'sale-01',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 1,
    productId: 'prod-01',
    productName: 'Chicken Biryani',
    quantity: 4700,
    price: 150,
    total: 705000,
    date: '2026-03-20',
    notes: 'Day 1 student & faculty lunch distribution batch (4,700 portions sold)',
  },
  {
    id: 'sale-02',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 1,
    productId: 'prod-06',
    productName: 'Popcorn',
    quantity: 1800,
    price: 30,
    total: 54000,
    date: '2026-03-20',
    notes: 'Day 1 afternoon festival live popcorn counter (1,800 tubs sold)',
  },
  {
    id: 'sale-03',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 1,
    productId: 'prod-02',
    productName: 'Water Bottle',
    quantity: 4500,
    price: 15,
    total: 67500,
    date: '2026-03-20',
    notes: 'Day 1 single counter hydration distribution (4,500 bottles sold)',
  },

  // Day 2 (Total: ₹882,000)
  {
    id: 'sale-04',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 2,
    productId: 'prod-01',
    productName: 'Chicken Biryani',
    quantity: 5000,
    price: 150,
    total: 750000,
    date: '2026-03-21',
    notes: 'Day 2 inter-college participants lunch crowd (5,000 portions sold)',
  },
  {
    id: 'sale-05',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 2,
    productId: 'prod-06',
    productName: 'Popcorn',
    quantity: 2000,
    price: 30,
    total: 60000,
    date: '2026-03-21',
    notes: 'Day 2 competition zone snack demand (2,000 tubs sold)',
  },
  {
    id: 'sale-06',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 2,
    productId: 'prod-02',
    productName: 'Water Bottle',
    quantity: 4800,
    price: 15,
    total: 72000,
    date: '2026-03-21',
    notes: 'Day 2 afternoon mineral water demand (4,800 bottles sold)',
  },

  // Day 3 (Total: ₹847,500)
  {
    id: 'sale-07',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 3,
    productId: 'prod-01',
    productName: 'Chicken Biryani',
    quantity: 4800,
    price: 150,
    total: 720000,
    date: '2026-03-22',
    notes: 'Day 3 valedictory session lunch distribution (4,800 portions sold)',
  },
  {
    id: 'sale-08',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 3,
    productId: 'prod-06',
    productName: 'Popcorn',
    quantity: 1900,
    price: 30,
    total: 57000,
    date: '2026-03-22',
    notes: 'Day 3 music festival evening snack crowd (1,900 tubs sold)',
  },
  {
    id: 'sale-09',
    eventId: 'evt-college-3day',
    eventName: 'National Tech Fest 2026',
    dayNumber: 3,
    productId: 'prod-02',
    productName: 'Water Bottle',
    quantity: 4700,
    price: 15,
    total: 70500,
    date: '2026-03-22',
    notes: 'Day 3 closing event hydration tally (4,700 bottles sold)',
  },
]

const INITIAL_DAILY_STOCK = [
  // Day 1
  {
    id: 'stk-d1-01',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    productId: 'prod-01',
    productName: 'Chicken Biryani',
    openingStock: 0,
    preparedReceived: 5000,
    availableStock: 5000,
    soldDistributed: 4700,
    remainingStock: 300,
    price: 150,
    income: 705000,
    unit: 'Portion / Box',
    notes: '5,000 prepared, 4,700 distributed, 300 remaining buffer',
  },
  {
    id: 'stk-d1-02',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    productId: 'prod-06',
    productName: 'Popcorn',
    openingStock: 0,
    preparedReceived: 2000,
    availableStock: 2000,
    soldDistributed: 1800,
    remainingStock: 200,
    price: 30,
    income: 54000,
    unit: 'Tub / Cone',
    notes: '2,000 prepared, 1,800 sold, 200 remaining buffer',
  },
  {
    id: 'stk-d1-03',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    productId: 'prod-02',
    productName: 'Water Bottle',
    openingStock: 0,
    preparedReceived: 5000,
    availableStock: 5000,
    soldDistributed: 4500,
    remainingStock: 500,
    price: 15,
    income: 67500,
    unit: '250ml Sealed Bottle',
    notes: '5,000 available, 4,500 distributed, 500 cold buffer',
  },

  // Day 2
  {
    id: 'stk-d2-01',
    eventId: 'evt-college-3day',
    dayNumber: 2,
    productId: 'prod-01',
    productName: 'Chicken Biryani',
    openingStock: 0,
    preparedReceived: 5200,
    availableStock: 5200,
    soldDistributed: 5000,
    remainingStock: 200,
    price: 150,
    income: 750000,
    unit: 'Portion / Box',
    notes: '5,200 prepared, 5,000 distributed, 200 remaining buffer',
  },
  {
    id: 'stk-d2-02',
    eventId: 'evt-college-3day',
    dayNumber: 2,
    productId: 'prod-06',
    productName: 'Popcorn',
    openingStock: 0,
    preparedReceived: 2200,
    availableStock: 2200,
    soldDistributed: 2000,
    remainingStock: 200,
    price: 30,
    income: 60000,
    unit: 'Tub / Cone',
    notes: '2,200 prepared, 2,000 sold, 200 remaining buffer',
  },
  {
    id: 'stk-d2-03',
    eventId: 'evt-college-3day',
    dayNumber: 2,
    productId: 'prod-02',
    productName: 'Water Bottle',
    openingStock: 200,
    preparedReceived: 5000,
    availableStock: 5200,
    soldDistributed: 4800,
    remainingStock: 400,
    price: 15,
    income: 72000,
    unit: '250ml Sealed Bottle',
    notes: '5,200 available, 4,800 distributed, 400 cold buffer',
  },

  // Day 3
  {
    id: 'stk-d3-01',
    eventId: 'evt-college-3day',
    dayNumber: 3,
    productId: 'prod-01',
    productName: 'Chicken Biryani',
    openingStock: 0,
    preparedReceived: 5000,
    availableStock: 5000,
    soldDistributed: 4800,
    remainingStock: 200,
    price: 150,
    income: 720000,
    unit: 'Portion / Box',
    notes: '5,000 prepared, 4,800 distributed, 200 remaining buffer',
  },
  {
    id: 'stk-d3-02',
    eventId: 'evt-college-3day',
    dayNumber: 3,
    productId: 'prod-06',
    productName: 'Popcorn',
    openingStock: 0,
    preparedReceived: 2000,
    availableStock: 2000,
    soldDistributed: 1900,
    remainingStock: 100,
    price: 30,
    income: 57000,
    unit: 'Tub / Cone',
    notes: '2,000 prepared, 1,900 sold, 100 remaining buffer',
  },
  {
    id: 'stk-d3-03',
    eventId: 'evt-college-3day',
    dayNumber: 3,
    productId: 'prod-02',
    productName: 'Water Bottle',
    openingStock: 300,
    preparedReceived: 4700,
    availableStock: 5000,
    soldDistributed: 4700,
    remainingStock: 300,
    price: 15,
    income: 70500,
    unit: '250ml Sealed Bottle',
    notes: '5,000 available, 4,700 distributed, 300 cold buffer',
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

  // State: Daily Stock
  const [dailyStock, setDailyStock] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DAILY_STOCK_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // Fallback
    }
    return INITIAL_DAILY_STOCK
  })

  // State: One Counter Status
  const [counterStatus, setCounterStatusState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_COUNTER_STATUS_KEY) || 'OPEN'
    } catch {
      return 'OPEN'
    }
  })

  const setCounterStatus = useCallback((status) => {
    setCounterStatusState(status)
    try {
      localStorage.setItem(STORAGE_COUNTER_STATUS_KEY, status)
    } catch (e) {
      console.warn('Could not save counter status:', e)
    }
  }, [])

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
      localStorage.setItem(STORAGE_DAILY_STOCK_KEY, JSON.stringify(dailyStock))
    } catch (e) {
      console.warn('Could not save dailyStock to localStorage:', e)
    }
  }, [dailyStock])

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
   * @param {number} [newCostPrice]
   */
  const updateProductPrice = useCallback(
    (productId, newPrice, scope, currentDayNumber = 1, newCostPrice = undefined) => {
      const numPrice = Number(newPrice) || 0

      // 1. Update product base selling price & optional cost price
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== productId) return p
          return {
            ...p,
            sellingPrice: numPrice,
            ...(newCostPrice !== undefined ? { costPrice: Number(newCostPrice) || 0 } : {}),
          }
        })
      )

      // 2. Adjust sales records based on chosen scope without altering locked/closed days!
      setSales((prev) =>
        prev.map((sale) => {
          if (sale.productId !== productId) return sale

          // If this sale's day is already closed, NEVER alter historical completed records!
          const dayIsClosed = closings.days[sale.dayNumber]?.isClosed
          if (dayIsClosed) return sale

          let applies = false
          if (scope === 'current_day' && sale.dayNumber === currentDayNumber) applies = true
          else if (scope === 'future_days' && sale.dayNumber >= currentDayNumber) applies = true
          else if (scope === 'all_days') applies = true

          if (applies) {
            const updatedTotal = (Number(sale.quantity) || 0) * numPrice
            return { ...sale, price: numPrice, total: updatedTotal }
          }

          return sale
        })
      )

      // 3. Adjust daily stock records
      setDailyStock((prev) =>
        prev.map((stk) => {
          if (stk.productId !== productId) return stk

          const dayIsClosed = closings.days[stk.dayNumber]?.isClosed
          if (dayIsClosed) return stk

          let applies = false
          if (scope === 'current_day' && stk.dayNumber === currentDayNumber) applies = true
          else if (scope === 'future_days' && stk.dayNumber >= currentDayNumber) applies = true
          else if (scope === 'all_days') applies = true

          if (applies) {
            const updatedIncome = (Number(stk.soldDistributed) || 0) * numPrice
            return { ...stk, price: numPrice, income: updatedIncome }
          }

          return stk
        })
      )
    },
    [closings]
  )

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
  // DAILY STOCK & ONE COUNTER METHODS
  // ==========================================
  const getDailyStock = useCallback(
    (eventId, dayNumber) => {
      const targetEventId = eventId || 'evt-college-3day'
      const targetDay = Number(dayNumber) || 1

      const filtered = dailyStock.filter(
        (item) => item.eventId === targetEventId && Number(item.dayNumber) === targetDay
      )

      if (filtered.length > 0) return filtered

      // Fallback: create stock representation from products and sales
      return products.slice(0, 3).map((p) => {
        const prodSale = sales.find(
          (s) =>
            s.eventId === targetEventId &&
            Number(s.dayNumber) === targetDay &&
            (s.productId === p.id || s.productName === p.productName)
        )
        const soldQty = prodSale ? Number(prodSale.quantity) : 0
        const availableQty = soldQty + 200
        return {
          id: `stk-dyn-${targetDay}-${p.id}`,
          eventId: targetEventId,
          dayNumber: targetDay,
          productId: p.id,
          productName: p.productName,
          openingStock: 0,
          preparedReceived: availableQty,
          availableStock: availableQty,
          soldDistributed: soldQty,
          remainingStock: 200,
          price: p.sellingPrice,
          income: soldQty * p.sellingPrice,
          unit: p.unit,
          notes: '',
        }
      })
    },
    [dailyStock, products, sales]
  )

  const recordSaleIncrement = useCallback(
    (eventId, dayNumber, productName, incrementQty) => {
      const targetEventId = eventId || 'evt-college-3day'
      const targetDay = Number(dayNumber) || 1
      const qty = Number(incrementQty) || 0
      if (qty === 0) return

      // 1. Update Daily Stock
      setDailyStock((prev) => {
        const index = prev.findIndex(
          (item) =>
            item.eventId === targetEventId &&
            Number(item.dayNumber) === targetDay &&
            item.productName.toLowerCase() === productName.toLowerCase()
        )

        if (index === -1) {
          // If not present, create one
          const matchingProduct = products.find(
            (p) => p.productName.toLowerCase() === productName.toLowerCase()
          )
          const price = matchingProduct ? matchingProduct.sellingPrice : 50
          const newEntry = {
            id: 'stk-' + Date.now().toString(36),
            eventId: targetEventId,
            dayNumber: targetDay,
            productId: matchingProduct?.id || 'prod-custom',
            productName: productName,
            openingStock: 0,
            preparedReceived: qty + 100,
            availableStock: qty + 100,
            soldDistributed: qty,
            remainingStock: 100,
            price: price,
            income: qty * price,
            unit: matchingProduct?.unit || 'Portion',
            notes: 'Counter quick sale increment',
          }
          return [...prev, newEntry]
        }

        const current = prev[index]
        const newSold = Math.max(0, (Number(current.soldDistributed) || 0) + qty)
        const available = Number(current.availableStock) || (newSold + 100)
        const newRemaining = Math.max(0, available - newSold)
        const newIncome = newSold * (Number(current.price) || 0)

        const updated = {
          ...current,
          soldDistributed: newSold,
          remainingStock: newRemaining,
          income: newIncome,
        }

        const next = [...prev]
        next[index] = updated
        return next
      })

      // 2. Synchronize Sales Records
      setSales((prev) => {
        const saleIndex = prev.findIndex(
          (s) =>
            s.eventId === targetEventId &&
            Number(s.dayNumber) === targetDay &&
            s.productName.toLowerCase() === productName.toLowerCase()
        )

        if (saleIndex !== -1) {
          const s = prev[saleIndex]
          const newQty = Math.max(0, (Number(s.quantity) || 0) + qty)
          const newTotal = newQty * (Number(s.price) || 0)

          const next = [...prev]
          next[saleIndex] = {
            ...s,
            quantity: newQty,
            total: newTotal,
          }
          return next
        } else {
          // Create new sale entry
          const matchingProduct = products.find(
            (p) => p.productName.toLowerCase() === productName.toLowerCase()
          )
          const price = matchingProduct ? matchingProduct.sellingPrice : 50
          const newSale = {
            id: 'sale-' + Date.now().toString(36),
            eventId: targetEventId,
            eventName: 'National Tech Fest 2026',
            dayNumber: targetDay,
            productId: matchingProduct?.id || 'prod-custom',
            productName: productName,
            quantity: qty,
            price: price,
            total: qty * price,
            date: new Date().toISOString().split('T')[0],
            notes: 'Counter rapid distribution increment',
          }
          return [newSale, ...prev]
        }
      })
    },
    [products]
  )

  const updateDailyStock = useCallback(
    (eventId, dayNumber, productId, updatedFields) => {
      const targetEventId = eventId || 'evt-college-3day'
      const targetDay = Number(dayNumber) || 1

      setDailyStock((prev) =>
        prev.map((item) => {
          if (
            item.eventId !== targetEventId ||
            Number(item.dayNumber) !== targetDay ||
            item.productId !== productId
          ) {
            return item
          }

          const opening =
            updatedFields.openingStock !== undefined
              ? Number(updatedFields.openingStock)
              : Number(item.openingStock) || 0
          const prepared =
            updatedFields.preparedReceived !== undefined
              ? Number(updatedFields.preparedReceived)
              : Number(item.preparedReceived) || 0
          const available = opening + prepared
          const sold =
            updatedFields.soldDistributed !== undefined
              ? Number(updatedFields.soldDistributed)
              : Number(item.soldDistributed) || 0
          const price =
            updatedFields.price !== undefined
              ? Number(updatedFields.price)
              : Number(item.price) || 0
          const income = sold * price

          return {
            ...item,
            ...updatedFields,
            openingStock: opening,
            preparedReceived: prepared,
            availableStock: available,
            soldDistributed: sold,
            remainingStock: remaining,
            price: price,
            income: income,
          }
        })
      )

      // Sync with sales if soldDistributed or price changed
      if (updatedFields.soldDistributed !== undefined || updatedFields.price !== undefined) {
        setSales((prev) =>
          prev.map((s) => {
            if (
              s.eventId !== targetEventId ||
              Number(s.dayNumber) !== targetDay ||
              s.productId !== productId
            ) {
              return s
            }
            const soldQty =
              updatedFields.soldDistributed !== undefined
                ? Number(updatedFields.soldDistributed)
                : Number(s.quantity) || 0
            const effectivePrice =
              updatedFields.price !== undefined
                ? Number(updatedFields.price)
                : Number(s.price) || 0

            return {
              ...s,
              quantity: soldQty,
              price: effectivePrice,
              total: soldQty * effectivePrice,
            }
          })
        )
      }
    },
    []
  )

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

          if (Number(s.dayNumber) === 1) productSummaryMap[name].day1Qty += qty
          else if (Number(s.dayNumber) === 2) productSummaryMap[name].day2Qty += qty
          else if (Number(s.dayNumber) === 3) productSummaryMap[name].day3Qty += qty

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
    dailyStock,
    counterStatus,
    setCounterStatus,
    getDailyStock,
    recordSaleIncrement,
    updateDailyStock,
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
