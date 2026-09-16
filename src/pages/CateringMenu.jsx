import React, { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  UtensilsCrossed,
  Plus,
  Search,
  Filter,
  Copy,
  ArrowRight,
  Edit2,
  Trash2,
  Users,
  Droplets,
  PackageCheck,
  Sparkles,
  Calculator,
  Calendar,
  CheckCircle2,
  ChefHat,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { MenuItemModal } from '../components/menu/MenuItemModal'
import { AssignDishModal } from '../components/menu/AssignDishModal'
import { useMenu, MENU_CATEGORIES } from '../hooks/useMenu'
import { useEvents } from '../hooks/useEvents'
import { formatNumber } from '../utils/formatters'
import { useToast } from '../components/ui/ToastContext'

export function CateringMenu() {
  const toast = useToast()
  const location = useLocation()
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useMenu()
  const { events, addDayMenuItem, updateDayMenuItem, deleteDayMenuItem, copyDayMenu } = useEvents()

  // Top view mode: 'planning' (Event Daily Menu) vs 'catalog' (Master Catalog)
  const [viewMode, setViewMode] = useState('planning')

  // Selected event for Catering Planning (defaults to deep link state or College Function)
  const [selectedEventId, setSelectedEventId] = useState(
    location.state?.selectedEventId || events[0]?.id || 'evt-college-3day'
  )
  const [selectedDayNumber, setSelectedDayNumber] = useState(
    location.state?.selectedDay || 1
  )

  useEffect(() => {
    if (location.state?.selectedEventId) {
      setSelectedEventId(location.state.selectedEventId)
    }
    if (location.state?.selectedDay) {
      setSelectedDayNumber(location.state.selectedDay)
    }
  }, [location.state])

  // Modals state
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false)
  const [catalogItemToEdit, setCatalogItemToEdit] = useState(null)

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [dayItemToEdit, setDayItemToEdit] = useState(null)

  // Catalog search & filter state
  const [catalogSearch, setCatalogSearch] = useState('')
  const [catalogCategory, setCatalogCategory] = useState('All')

  // Current active event & day
  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0]
  }, [events, selectedEventId])

  const eventDays = currentEvent?.days || []
  const currentDay = useMemo(() => {
    return eventDays.find((d) => d.dayNumber === selectedDayNumber) || eventDays[0] || {}
  }, [eventDays, selectedDayNumber])

  const dayMenu = currentDay?.menu || []
  const expectedGuests = currentDay?.expectedGuests || 10000

  // Filtered Master Catalog
  const filteredCatalog = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        item.notes.toLowerCase().includes(catalogSearch.toLowerCase())
      const matchesCategory =
        catalogCategory === 'All' || item.category === catalogCategory
      return matchesSearch && matchesCategory
    })
  }, [menuItems, catalogSearch, catalogCategory])

  // Automatic Catering Planning Calculations
  const calculatedFoodTotal = useMemo(() => {
    // Sum quantities of items where unit is Pax, Portions, or Plates
    return dayMenu
      .filter((item) => ['Pax', 'Portions', 'Plates'].includes(item.unit))
      .reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
  }, [dayMenu])

  const calculatedWaterTotal = useMemo(() => {
    // Sum bottles
    return dayMenu
      .filter((item) => item.unit === 'Bottles')
      .reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
  }, [dayMenu])

  // Copy Handlers
  const handleCopyDay = (sourceDay, targetDay) => {
    if (!currentEvent) return
    copyDayMenu(currentEvent.id, sourceDay, targetDay)
    toast.success(
      'Menu Copied',
      `Assigned Day ${sourceDay} menu items to Day ${targetDay} (quantities auto-adapted to Day ${targetDay} guests).`
    )
  }

  // Master Catalog CRUD Handlers
  const handleSaveCatalogItem = (payload) => {
    if (catalogItemToEdit) {
      updateMenuItem(catalogItemToEdit.id, payload)
    } else {
      addMenuItem(payload)
    }
  }

  const handleDeleteCatalogItem = (id, name) => {
    deleteMenuItem(id)
    toast.info('Item Removed', `"${name}" was deleted from the master catalog.`)
  }

  // Day Menu CRUD Handlers
  const handleSaveDayItem = (payload) => {
    if (!currentEvent) return
    if (dayItemToEdit) {
      updateDayMenuItem(currentEvent.id, selectedDayNumber, dayItemToEdit.id, payload)
    } else {
      addDayMenuItem(currentEvent.id, selectedDayNumber, payload)
    }
  }

  const handleDeleteDayItem = (itemId, name) => {
    if (!currentEvent) return
    deleteDayMenuItem(currentEvent.id, selectedDayNumber, itemId)
    toast.info('Item Removed', `"${name}" removed from Day ${selectedDayNumber} menu.`)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Catering & Menu Management"
        description="Configure master dish catalogs, assign daily menus to events (Day 1, Day 2, Day 3), copy menus across days, and automate catering planning quantities."
        badge="Catering Command"
        badgeVariant="gold"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'planning' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('planning')}
              leftIcon={<Calendar className="w-3.5 h-3.5" />}
            >
              Event Daily Menu
            </Button>
            <Button
              variant={viewMode === 'catalog' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('catalog')}
              leftIcon={<UtensilsCrossed className="w-3.5 h-3.5" />}
            >
              Master Catalog ({menuItems.length})
            </Button>
          </div>
        }
      />

      {/* VIEW MODE 1: Event Daily Menu & Catering Planning */}
      {viewMode === 'planning' && (
        <div className="space-y-6">
          {/* Top Event & Day Selection Bar */}
          <Card className="p-4 bg-white">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Event Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#163324] whitespace-nowrap">
                  Selected Event:
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => {
                    setSelectedEventId(e.target.value)
                    setSelectedDayNumber(1)
                  }}
                  className="text-xs sm:text-sm font-semibold text-[#0f172a] bg-[#f8fafc] border border-[#cbd5e1] rounded-lg p-2 focus:ring-2 focus:ring-[#163324]/20 focus:border-[#163324]"
                >
                  {events.map((evt) => (
                    <option key={evt.id} value={evt.id}>
                      {evt.name} ({evt.numberOfDays} Days • {formatNumber(evt.totalExpectedGuests)} Pax)
                    </option>
                  ))}
                </select>
              </div>

              {/* Day Switcher Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                {eventDays.map((day) => (
                  <button
                    key={day.dayNumber}
                    type="button"
                    onClick={() => setSelectedDayNumber(day.dayNumber)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                      selectedDayNumber === day.dayNumber
                        ? 'bg-[#163324] text-white shadow-sm'
                        : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                    }`}
                  >
                    <span>Day {day.dayNumber}</span>
                    <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-black/20 text-white">
                      {formatNumber(day.expectedGuests)} Pax
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Automatic Catering Planning Summary Card */}
          <div className="rounded-2xl bg-[#0e1f16] text-white p-6 border border-[#244b36] shadow-card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#c29c5e]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#c29c5e]" />
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Catering Planning & Auto-Calculations — Day {selectedDayNumber}
                  </h3>
                </div>

                <Badge variant="gold" size="sm" className="bg-[#c29c5e]/20 text-[#dfbe82] border-[#c29c5e]/30">
                  {currentDay?.dayLabel || `Day ${selectedDayNumber}`}
                </Badge>
              </div>

              {/* 3 Prominent Metrics Required: Expected Guests, Food Required, Water Required */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {/* 1. Expected Guests */}
                <div className="p-4 rounded-xl bg-[#142e20]/80 border border-[#234d37] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#85a392] block">
                    Expected Guests
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-white font-sans">
                    {formatNumber(expectedGuests)} Pax
                  </span>
                  <p className="text-[11px] text-[#94a3b8]">
                    Headcount scheduled for Day {selectedDayNumber}
                  </p>
                </div>

                {/* 2. Food Required */}
                <div className="p-4 rounded-xl bg-[#142e20]/80 border border-[#234d37] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#85a392] block">
                    Food Required
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-[#dfbe82] font-sans">
                    {calculatedFoodTotal > 0 ? `${formatNumber(calculatedFoodTotal)} Pax` : `${formatNumber(expectedGuests)} Pax`}
                  </span>
                  <p className="text-[11px] text-[#94a3b8]">
                    {dayMenu.length} dishes configured for service
                  </p>
                </div>

                {/* 3. Water Required */}
                <div className="p-4 rounded-xl bg-[#142e20]/80 border border-[#234d37] space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#85a392] block">
                    Water Required
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-[#38bdf8] font-sans">
                    {calculatedWaterTotal > 0 ? `${formatNumber(calculatedWaterTotal)} Bottles` : `${formatNumber(expectedGuests)} Bottles`}
                  </span>
                  <p className="text-[11px] text-[#94a3b8]">
                    Auto-calculated baseline: 1 bottle per guest
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Copy Menu Bar (Copy Day 1 -> Day 2, Copy Day 1 -> Day 3) */}
          <Card className="p-4 bg-[#fbf6ed] border-[#edd9be] flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#866a39]">
              <Copy className="w-4 h-4 shrink-0 text-[#9d8050]" />
              <span>
                <strong>Quick Menu Duplication:</strong> Clone entire menu items and auto-scale quantities to other days.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white border-[#dfbe82] text-[#866a39] hover:bg-[#f5ede0]"
                leftIcon={<Copy className="w-3.5 h-3.5" />}
                onClick={() => handleCopyDay(1, 2)}
              >
                Copy Day 1 → Day 2
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="bg-white border-[#dfbe82] text-[#866a39] hover:bg-[#f5ede0]"
                leftIcon={<Copy className="w-3.5 h-3.5" />}
                onClick={() => handleCopyDay(1, 3)}
              >
                Copy Day 1 → Day 3
              </Button>
            </div>
          </Card>

          {/* Assigned Day Menu Items Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle>Assigned Menu — Day {selectedDayNumber}</CardTitle>
                  <CardDescription>
                    Dishes and beverages staged for Day {selectedDayNumber} ({formatNumber(expectedGuests)} expected guests)
                  </CardDescription>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setDayItemToEdit(null)
                    setIsAssignModalOpen(true)
                  }}
                >
                  Assign Dish to Day {selectedDayNumber}
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {dayMenu.length === 0 ? (
                <EmptyState
                  icon={UtensilsCrossed}
                  title={`No Menu Items for Day ${selectedDayNumber}`}
                  description="No food or water items have been assigned to this day yet. You can assign dishes from the catalog or copy Day 1's menu."
                  phase="Day Menu Planning"
                  action={
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Plus className="w-4 h-4" />}
                        onClick={() => {
                          setDayItemToEdit(null)
                          setIsAssignModalOpen(true)
                        }}
                      >
                        Add First Dish
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Copy className="w-4 h-4" />}
                        onClick={() => handleCopyDay(1, selectedDayNumber)}
                      >
                        Copy Day 1 Menu
                      </Button>
                    </div>
                  }
                />
              ) : (
                <div className="overflow-x-auto rounded-xl border border-[#e2e8f0]">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#f8fafc] text-[#475569] font-bold uppercase tracking-wider border-b border-[#e2e8f0]">
                      <tr>
                        <th className="p-3.5">Item Name</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Unit</th>
                        <th className="p-3.5">Planned Quantity</th>
                        <th className="p-3.5">Preparation Notes</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9] text-[#334155] bg-white">
                      {dayMenu.map((item) => (
                        <tr key={item.id} className="hover:bg-[#f8fafc] transition-colors">
                          <td className="p-3.5 font-bold text-[#0f172a] text-sm">
                            {item.name}
                          </td>
                          <td className="p-3.5">
                            <Badge variant="gold" size="sm">
                              {item.category}
                            </Badge>
                          </td>
                          <td className="p-3.5 font-mono text-[#64748b]">{item.unit}</td>
                          <td className="p-3.5 font-bold text-[#0f172a] font-sans text-sm">
                            {formatNumber(item.quantity)} {item.unit}
                          </td>
                          <td className="p-3.5 text-[#64748b] max-w-sm leading-relaxed">
                            {item.notes || '—'}
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setDayItemToEdit(item)
                                  setIsAssignModalOpen(true)
                                }}
                                className="p-1.5 rounded-lg text-[#64748b] hover:text-[#163324] hover:bg-[#f1f5f9] transition-colors"
                                title="Edit Item"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteDayItem(item.id, item.name)}
                                className="p-1.5 rounded-lg text-[#64748b] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-colors"
                                title="Delete from Day"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* VIEW MODE 2: Master Menu Catalog */}
      {viewMode === 'catalog' && (
        <div className="space-y-6">
          {/* Catalog Controls: Search, Category Filter & Add Button */}
          <Card className="p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#94a3b8]">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search dishes by name or notes..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[#0f172a] placeholder:text-[#94a3b8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163324]/20 focus:border-[#163324] transition-all"
                />
              </div>

              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => {
                  setCatalogItemToEdit(null)
                  setIsCatalogModalOpen(true)
                }}
              >
                Add Dish to Catalog
              </Button>
            </div>

            {/* 11 Categories Filter Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-1 no-scrollbar">
              {['All', ...MENU_CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCatalogCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    catalogCategory === cat
                      ? 'bg-[#163324] text-white shadow-sm'
                      : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Card>

          {/* Master Catalog Grid */}
          {filteredCatalog.length === 0 ? (
            <EmptyState
              icon={UtensilsCrossed}
              title="No Dishes Found"
              description="No menu items match your search or category filter. Try selecting a different category or add a new dish."
              action={
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => {
                    setCatalogCategory('All')
                    setCatalogSearch('')
                    setIsCatalogModalOpen(true)
                  }}
                >
                  Add New Dish
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCatalog.map((dish) => (
                <Card key={dish.id} className="p-5 flex flex-col justify-between hover:shadow-card-hover transition-all">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-[#0f172a] leading-tight">
                        {dish.name}
                      </h4>
                      <Badge variant="gold" size="sm">
                        {dish.category}
                      </Badge>
                    </div>

                    <div className="text-xs text-[#64748b] space-y-1">
                      <div className="flex items-center justify-between">
                        <p>
                          Serving Unit: <strong className="text-[#0f172a]">{dish.unit}</strong>
                        </p>
                        {dish.price !== undefined && (
                          <span className="font-mono font-bold text-[#163324] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs">
                            ₹{dish.price}
                          </span>
                        )}
                      </div>
                      {dish.notes && (
                        <p className="text-[11px] leading-relaxed line-clamp-2">
                          {dish.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#f1f5f9]">
                    <span className="text-[11px] font-mono text-[#94a3b8]">
                      Default: {dish.quantity} {dish.unit}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setCatalogItemToEdit(dish)
                          setIsCatalogModalOpen(true)
                        }}
                        className="p-1.5 rounded-lg text-[#64748b] hover:text-[#163324] hover:bg-[#f1f5f9] transition-colors"
                        title="Edit Dish"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCatalogItem(dish.id, dish.name)}
                        className="p-1.5 rounded-lg text-[#64748b] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-colors"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Master Catalog Item Modal */}
      <MenuItemModal
        isOpen={isCatalogModalOpen || Boolean(catalogItemToEdit)}
        onClose={() => {
          setIsCatalogModalOpen(false)
          setCatalogItemToEdit(null)
        }}
        onSave={handleSaveCatalogItem}
        itemToEdit={catalogItemToEdit}
      />

      {/* Day Dish Assignment Modal */}
      <AssignDishModal
        isOpen={isAssignModalOpen || Boolean(dayItemToEdit)}
        onClose={() => {
          setIsAssignModalOpen(false)
          setDayItemToEdit(null)
        }}
        onSave={handleSaveDayItem}
        dayNumber={selectedDayNumber}
        dayExpectedGuests={expectedGuests}
        itemToEdit={dayItemToEdit}
      />
    </div>
  )
}
