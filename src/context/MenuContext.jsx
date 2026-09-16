import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const MenuContext = createContext(null)

const STORAGE_KEY = 'silver_catering_master_menu'

export const MENU_CATEGORIES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snacks',
  'Desserts',
  'Tea/Coffee',
  'Welcome Drinks',
  'Vegetarian',
  'Non-Vegetarian',
  'Special Menu',
  'Other',
]

export const MENU_UNITS = [
  'Pax',
  'Bottles',
  'Plates',
  'Portions',
  'Pieces',
  'Cups',
  'Liters',
  'Kg',
  'Glasses',
]

// Authentic initial catalog dishes covering all 11 required categories
const INITIAL_CATALOG = [
  {
    id: 'dish-1',
    name: 'Chicken Biryani',
    category: 'Non-Vegetarian',
    unit: 'Pax',
    quantity: 1,
    notes: 'Authentic Thalassery Jeerakasala Chicken Dum Biriyani with boiled egg, fried onion & cashews.',
  },
  {
    id: 'dish-2',
    name: 'Water Bottle',
    category: 'Other',
    unit: 'Bottles',
    quantity: 1,
    notes: '250ml hygienic sealed purified mineral drinking water bottle.',
  },
  {
    id: 'dish-3',
    name: 'Nadan Mutton Roast',
    category: 'Lunch',
    unit: 'Pax',
    quantity: 1,
    notes: 'Tender mutton slow-cooked with roasted coconut slices, curry leaves, and Malabar spices.',
  },
  {
    id: 'dish-4',
    name: 'Malabar Dum Ghee Rice',
    category: 'Lunch',
    unit: 'Pax',
    quantity: 1,
    notes: 'Aromatic short-grain rice sautéed in pure ghee with whole spices, raisins, and roasted nuts.',
  },
  {
    id: 'dish-5',
    name: 'Executive Fried Rice & Chilly Chicken',
    category: 'Dinner',
    unit: 'Pax',
    quantity: 1,
    notes: 'Indo-Chinese wok-tossed fried rice with spicy boneless chilly chicken.',
  },
  {
    id: 'dish-6',
    name: '28-Dish Traditional Kerala Sadhya',
    category: 'Vegetarian',
    unit: 'Pax',
    quantity: 1,
    notes: 'Authentic pure vegetarian feast served on plantain leaves with 28 accompaniments & 2 payasams.',
  },
  {
    id: 'dish-7',
    name: 'Live Appam & Vegetable Stew',
    category: 'Breakfast',
    unit: 'Pax',
    quantity: 2,
    notes: 'Lacy fermented rice hoppers made fresh at counter with coconut milk vegetable stew.',
  },
  {
    id: 'dish-8',
    name: 'Pazham Pori & Unnakaya',
    category: 'Snacks',
    unit: 'Pieces',
    quantity: 2,
    notes: 'Crispy ripe banana fritters and Malabar stuffed plantain delicacy.',
  },
  {
    id: 'dish-9',
    name: 'Palada Payasam',
    category: 'Desserts',
    unit: 'Cups',
    quantity: 1,
    notes: 'Classic pink Kerala dessert slow-cooked with rice ada, rich milk, and cardamom.',
  },
  {
    id: 'dish-10',
    name: 'Tender Coconut Souffle',
    category: 'Special Menu',
    unit: 'Cups',
    quantity: 1,
    notes: 'Signature chilled dessert crafted from fresh tender coconut malai.',
  },
  {
    id: 'dish-11',
    name: 'Fresh Mint Lime Cooler',
    category: 'Welcome Drinks',
    unit: 'Glasses',
    quantity: 1,
    notes: 'Refreshing welcome drink infused with crushed mint, lime, and crushed ice.',
  },
  {
    id: 'dish-12',
    name: 'Malabar Dum Tea & Filter Coffee',
    category: 'Tea/Coffee',
    unit: 'Cups',
    quantity: 1,
    notes: 'Freshly brewed frothy meter-tea and South Indian chicory filter coffee.',
  },
]

export function MenuProvider({ children }) {
  const [menuItems, setMenuItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // Fallback
    }
    return INITIAL_CATALOG
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(menuItems))
    } catch (e) {
      console.warn('Could not save menu items to localStorage:', e)
    }
  }, [menuItems])

  const addMenuItem = useCallback((item) => {
    const newItem = {
      id: 'dish-' + Date.now().toString(36),
      quantity: Number(item.quantity) || 1,
      ...item,
    }
    setMenuItems((prev) => [newItem, ...prev])
    return newItem
  }, [])

  const updateMenuItem = useCallback((id, updatedFields) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    )
  }, [])

  const deleteMenuItem = useCallback((id) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const value = {
    menuItems,
    categories: MENU_CATEGORIES,
    units: MENU_UNITS,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  }

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider')
  }
  return context
}

