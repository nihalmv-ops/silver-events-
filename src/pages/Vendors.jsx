import React, { useState, useMemo } from 'react'
import {
  Store,
  Plus,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Search,
  Filter,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { VendorModal } from '../components/vendors/VendorModal'
import { useVendors, VENDOR_CATEGORIES, VENDOR_STATUSES } from '../hooks/useVendors'
import { useEvents } from '../hooks/useEvents'
import { formatCurrency, formatNumber } from '../utils/formatters'
import { useToast } from '../components/ui/ToastContext'

export function Vendors() {
  const toast = useToast()
  const { events } = useEvents()
  const {
    vendors,
    categories,
    addVendor,
    updateVendor,
    deleteVendor,
    recordPayment,
  } = useVendors()

  // Selected event & day
  const [selectedEventId, setSelectedEventId] = useState(
    events[0]?.id || 'evt-college-3day'
  )
  const [selectedDayNumber, setSelectedDayNumber] = useState(1)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [vendorToEdit, setVendorToEdit] = useState(null)

  // Active event
  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0] || {}
  }, [events, selectedEventId])

  const eventDays = currentEvent?.days || []

  // Filtered vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchesEvent = !selectedEventId || v.eventId === selectedEventId
      const matchesDay = !selectedDayNumber || v.dayNumber === selectedDayNumber
      const matchesCategory =
        selectedCategory === 'All' || v.category === selectedCategory
      const matchesSearch =
        searchQuery.trim() === '' ||
        v.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.phone.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesEvent && matchesDay && matchesCategory && matchesSearch
    })
  }, [vendors, selectedEventId, selectedDayNumber, selectedCategory, searchQuery])

  // Aggregate Internal Operational Logistics Costs
  const totalContract = filteredVendors.reduce(
    (acc, v) => acc + (Number(v.contractAmount) || 0),
    0
  )
  const totalPaid = filteredVendors.reduce((acc, v) => acc + (Number(v.paid) || 0), 0)
  const totalBalance = Math.max(0, totalContract - totalPaid)

  const handleSaveVendor = (data) => {
    if (vendorToEdit) {
      updateVendor(vendorToEdit.id, data)
      toast.success('Vendor Updated', `${data.vendorName}'s contract updated.`)
    } else {
      addVendor(data)
      toast.success('Vendor Registered', `${data.vendorName} added to suppliers.`)
    }
    setVendorToEdit(null)
  }

  const handleDeleteVendor = (id, name) => {
    if (window.confirm(`Are you sure you want to remove vendor contract "${name}"?`)) {
      deleteVendor(id)
      toast.info('Vendor Removed', `${name} deleted from vendor list.`)
    }
  }

  const handleQuickPay = (vendor) => {
    const balance = Math.max(0, (Number(vendor.contractAmount) || 0) - (Number(vendor.paid) || 0))
    if (balance <= 0) {
      toast.info('Contract Settled', 'This vendor contract is already 100% settled.')
      return
    }
    const payStr = prompt(`Enter payment amount to record for ${vendor.vendorName} (Balance: ${formatCurrency(balance)}):`, String(balance))
    if (payStr && !isNaN(Number(payStr)) && Number(payStr) > 0) {
      recordPayment(vendor.id, Number(payStr))
      toast.success('Payment Logged', `Recorded ${formatCurrency(Number(payStr))} payment to ${vendor.vendorName}.`)
    }
  }

  const getStatusBadgeVariant = (st) => {
    switch (st) {
      case 'Settled':
      case 'Delivered':
        return 'success'
      case 'In Progress':
        return 'gold'
      case 'Confirmed':
        return 'primary'
      case 'Pending':
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendors & Supplier Contracts"
        description="Raw ingredients, poultry, mineral water suppliers, logistics convoys, and commercial gas agencies."
        badge={`${filteredVendors.length} Suppliers Active`}
        badgeVariant="primary"
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => {
              setVendorToEdit(null)
              setIsModalOpen(true)
            }}
          >
            Register Supplier
          </Button>
        }
      />

      {/* EVENT & DAY SELECTOR BAR */}
      <Card className="p-4 bg-gradient-to-r from-[#163324]/5 to-transparent border border-[#163324]/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-xs font-semibold text-[#163324] uppercase tracking-wider whitespace-nowrap">
              Select Event:
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value)
                setSelectedDayNumber(1)
              }}
              className="px-3.5 py-2 rounded-lg border border-[#cbd5e1] bg-white text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324] shadow-sm max-w-md"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name} ({formatNumber(evt.totalExpectedGuests)} Pax)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mr-1">
              Day:
            </span>
            {eventDays.map((d) => {
              const isSelected = d.dayNumber === selectedDayNumber
              return (
                <button
                  key={d.dayNumber}
                  onClick={() => setSelectedDayNumber(d.dayNumber)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#163324] text-[#d4af37] shadow-sm'
                      : 'bg-white text-[#475569] hover:bg-[#f1f5f9] border border-[#e2e8f0]'
                  }`}
                >
                  <span>Day {d.dayNumber}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#f1f5f9] text-[#64748b]'}`}>
                    {formatNumber(d.expectedGuests)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </Card>

      {/* 3 INTERNAL SUPPLIER COST METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 space-y-1.5 border-l-4 border-l-[#163324]">
          <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
            Total Contract Commitments
          </span>
          <p className="text-2xl font-black text-[#0f172a] font-sans">
            {formatCurrency(totalContract)}
          </p>
          <p className="text-[11px] text-[#64748b]">Internal supplier cost commitments</p>
        </Card>

        <Card className="p-4 space-y-1.5 border-l-4 border-l-[#059669]">
          <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
            Total Advances & Payments
          </span>
          <p className="text-2xl font-black text-[#059669] font-sans">
            {formatCurrency(totalPaid)}
          </p>
          <p className="text-[11px] text-[#059669] font-medium">Disbursed to date</p>
        </Card>

        <Card className="p-4 space-y-1.5 border-l-4 border-l-[#dc2626]">
          <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
            Outstanding Payable Balance
          </span>
          <p className="text-2xl font-black text-[#dc2626] font-sans">
            {formatCurrency(totalBalance)}
          </p>
          <p className="text-[11px] text-[#64748b]">Auto-calculated (`Contract - Paid`)</p>
        </Card>
      </div>

      {/* SEARCH & CATEGORY FILTER */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by vendor name, service, or contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#e2e8f0] text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#64748b]" />
            <span className="text-xs font-semibold text-[#64748b]">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#cbd5e1] bg-white text-xs font-semibold text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#163324]"
            >
              <option value="All">All Categories</option>
              {VENDOR_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* VENDORS TABLE */}
      {filteredVendors.length > 0 ? (
        <Card className="overflow-hidden border border-[#e2e8f0]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Vendor Name</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Service / Delivery</th>
                  <th className="px-5 py-3.5 text-right">Contract Amount</th>
                  <th className="px-5 py-3.5 text-right">Paid</th>
                  <th className="px-5 py-3.5 text-right">Balance</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filteredVendors.map((vendor) => {
                  const balance = Math.max(
                    0,
                    (Number(vendor.contractAmount) || 0) - (Number(vendor.paid) || 0)
                  )
                  return (
                    <tr key={vendor.id} className="hover:bg-[#fbf6ed]/20 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-[#0f172a]">{vendor.vendorName}</div>
                        <div className="text-xs text-[#64748b] flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-[#94a3b8]" />
                            {vendor.phone}
                          </span>
                          {vendor.email && (
                            <span className="hidden sm:flex items-center gap-1">
                              <Mail className="w-3 h-3 text-[#94a3b8]" />
                              {vendor.email}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <Badge variant="secondary" className="text-xs">
                          {vendor.category}
                        </Badge>
                      </td>

                      <td className="px-5 py-3.5 text-xs text-[#334155] max-w-xs">
                        <div>{vendor.service}</div>
                        {vendor.notes && (
                          <div className="text-[11px] text-[#64748b] italic mt-0.5 truncate">
                            "{vendor.notes}"
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-right font-sans font-bold text-[#0f172a]">
                        {formatCurrency(vendor.contractAmount)}
                      </td>

                      <td className="px-5 py-3.5 text-right font-sans font-bold text-[#059669]">
                        {formatCurrency(vendor.paid)}
                      </td>

                      <td className="px-5 py-3.5 text-right font-sans font-black text-[#dc2626]">
                        {formatCurrency(balance)}
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <Badge variant={getStatusBadgeVariant(vendor.status)}>
                          {vendor.status}
                        </Badge>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => handleQuickPay(vendor)}
                            title="Record payment toward balance"
                          >
                            Pay
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            leftIcon={<Edit2 className="w-3 h-3" />}
                            onClick={() => {
                              setVendorToEdit(vendor)
                              setIsModalOpen(true)
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            className="text-[#dc2626] hover:bg-[#fef2f2]"
                            leftIcon={<Trash2 className="w-3 h-3" />}
                            onClick={() => handleDeleteVendor(vendor.id, vendor.vendorName)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={Store}
          title="No Suppliers Found"
          description={`No vendors found matching "${searchQuery || selectedCategory}" for Day ${selectedDayNumber}.`}
          action={
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                setVendorToEdit(null)
                setIsModalOpen(true)
              }}
            >
              Register Supplier
            </Button>
          }
        />
      )}

      {/* MODAL */}
      <VendorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setVendorToEdit(null)
        }}
        onSave={handleSaveVendor}
        vendorToEdit={vendorToEdit}
        events={events}
        currentEventId={selectedEventId}
        currentDayNumber={selectedDayNumber}
      />
    </div>
  )
}
