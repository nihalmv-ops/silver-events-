import React, { useState, useMemo } from 'react'
import {
  ReceiptText,
  Plus,
  IndianRupee,
  Calendar,
  Layers,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Building2,
  ShieldAlert,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Tag,
  CreditCard,
  Store,
  Edit2,
  Trash2,
  FileCheck2,
  AlertCircle,
  DollarSign,
  PieChart,
} from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useToast } from '../components/ui/ToastContext'
import { useEvents } from '../context/EventContext'
import { useExpenses, EXPENSE_CATEGORIES, PAYMENT_METHODS, EXPENSE_STATUSES } from '../hooks/useExpenses'
import { useVendors } from '../hooks/useVendors'
import { ExpenseModal } from '../components/expenses/ExpenseModal'
import { VendorPaymentModal } from '../components/expenses/VendorPaymentModal'

export function Expenses() {
  const toast = useToast()
  const { events, activeEventId } = useEvents()
  const {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    toggleExpenseStatus,
    getExpenseSummary,
  } = useExpenses()
  const { vendors, recordPayment } = useVendors()

  // Selected Event & Day state
  const [selectedEventId, setSelectedEventId] = useState(activeEventId || 'evt-college-3day')
  const [selectedDay, setSelectedDay] = useState('All') // 'All', 1, 2, 3

  // Active view tab: 'expenses' | 'vendors' | 'categories'
  const [activeTab, setActiveTab] = useState('expenses')

  // Expense filters
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All') // 'All', 'Paid', 'Pending'
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal states
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [payingVendor, setPayingVendor] = useState(null)

  // Current active event details
  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0]

  // Summary Metrics
  const summary = useMemo(() => {
    return getExpenseSummary(selectedEventId)
  }, [getExpenseSummary, selectedEventId, expenses])

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      if (selectedEventId && item.eventId !== selectedEventId) return false
      if (selectedDay !== 'All' && String(item.dayNumber) !== String(selectedDay)) return false
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false
      if (statusFilter !== 'All' && item.status !== statusFilter) return false
      if (paymentMethodFilter !== 'All' && item.paymentMethod !== paymentMethodFilter) return false

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchesDesc = item.description?.toLowerCase().includes(query)
        const matchesVendor = item.vendor?.toLowerCase().includes(query)
        const matchesCategory = item.category?.toLowerCase().includes(query)
        const matchesReceipt = item.receipt?.toLowerCase().includes(query)
        if (!matchesDesc && !matchesVendor && !matchesCategory && !matchesReceipt) return false
      }

      return true
    })
  }, [expenses, selectedEventId, selectedDay, categoryFilter, statusFilter, paymentMethodFilter, searchQuery])

  // Filtered Vendors for the selected event
  const eventVendors = useMemo(() => {
    return vendors.filter((v) => {
      if (selectedEventId && v.eventId && v.eventId !== selectedEventId) return false
      return true
    })
  }, [vendors, selectedEventId])

  // Vendor summary calculations
  const vendorSummary = useMemo(() => {
    const totalContract = eventVendors.reduce((sum, v) => sum + (Number(v.contractAmount) || 0), 0)
    const totalAdvance = eventVendors.reduce((sum, v) => sum + (Number(v.advance) || 0), 0)
    const totalPaid = eventVendors.reduce((sum, v) => sum + (Number(v.paid) || 0), 0)
    const totalBalance = Math.max(0, totalContract - totalPaid)

    return { totalContract, totalAdvance, totalPaid, totalBalance }
  }, [eventVendors])

  // Category breakdown for reporting
  const categoryBreakdown = useMemo(() => {
    const map = {}
    EXPENSE_CATEGORIES.forEach((cat) => {
      map[cat] = { total: 0, paid: 0, pending: 0, count: 0 }
    })

    expenses
      .filter((e) => !selectedEventId || e.eventId === selectedEventId)
      .forEach((e) => {
        const cat = e.category || 'Other'
        if (!map[cat]) map[cat] = { total: 0, paid: 0, pending: 0, count: 0 }
        const amt = Number(e.amount) || 0
        map[cat].total += amt
        map[cat].count += 1
        if (e.status === 'Paid') map[cat].paid += amt
        else map[cat].pending += amt
      })

    return Object.entries(map)
      .map(([name, data]) => ({ name, ...data }))
      .filter((item) => item.total > 0)
      .sort((a, b) => b.total - a.total)
  }, [expenses, selectedEventId])

  // Handlers
  const handleSaveExpense = (expenseData) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, expenseData)
      toast.success('Expense Updated', `Updated ${expenseData.category} expense record.`)
    } else {
      addExpense(expenseData)
      toast.success('Expense Logged', `Logged ₹${Number(expenseData.amount).toLocaleString('en-IN')} for ${expenseData.category}.`)
    }
    setEditingExpense(null)
  }

  const handleDeleteExpense = (id, desc) => {
    if (window.confirm(`Delete expense record: "${desc}"?`)) {
      deleteExpense(id)
      toast.info('Expense Deleted', 'Expense record removed.')
    }
  }

  const handleToggleStatus = (id, currentStatus) => {
    toggleExpenseStatus(id)
    const next = currentStatus === 'Paid' ? 'Pending' : 'Paid'
    toast.info('Status Updated', `Expense status changed to ${next}.`)
  }

  const handleOpenRecordPayment = (vendor) => {
    setPayingVendor(vendor)
    setIsPaymentModalOpen(true)
  }

  const handleConfirmVendorPayment = (vendorId, paymentData) => {
    recordPayment(vendorId, paymentData)

    if (paymentData.autoLogExpense) {
      // Also log as an expense in the operations ledger
      addExpense({
        eventId: paymentData.eventId || selectedEventId,
        eventName: paymentData.eventName || activeEvent?.eventName || 'National Tech Fest 2026',
        dayNumber: paymentData.dayNumber || (selectedDay === 'All' ? 1 : selectedDay),
        category: paymentData.category?.includes('Poultry')
          ? 'Chicken'
          : paymentData.category?.includes('Rice')
          ? 'Rice'
          : paymentData.category?.includes('Spices')
          ? 'Spices'
          : paymentData.category?.includes('Water')
          ? 'Water'
          : paymentData.category?.includes('Packaging')
          ? 'Containers'
          : paymentData.category?.includes('LPG')
          ? 'Gas/Fuel'
          : paymentData.category?.includes('Transport')
          ? 'Transportation'
          : 'Staff',
        description: `Disbursal to ${paymentData.vendorName} (${paymentData.notes || 'Vendor payment'})`,
        vendor: paymentData.vendorName,
        amount: paymentData.amount,
        date: paymentData.date,
        paymentMethod: paymentData.paymentMethod,
        status: 'Paid',
        receipt: paymentData.receipt || `VOUCH-${Math.floor(1000 + Math.random() * 9000)}`,
        notes: paymentData.notes || 'Auto-logged from Vendor Payments module.',
      })
    }

    toast.success('Payment Recorded', `Disbursed ₹${Number(paymentData.amount).toLocaleString('en-IN')} to ${paymentData.vendorName}.`)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Internal Expenses & Vendor Payments"
        description="Track on-site operations spending, ingredient procurement, daily logistics costs, and supplier payments."
        badge="Zero Customer Billing"
        badgeVariant="gold"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Store className="w-4 h-4" />}
              onClick={() => setActiveTab('vendors')}
            >
              Vendor Payments ({eventVendors.length})
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingExpense(null)
                setIsExpenseModalOpen(true)
              }}
            >
              Log Expense
            </Button>
          </div>
        }
      />

      {/* Operational Notice Banner */}
      <div className="p-3.5 rounded-xl bg-[#fffbeb] border border-[#fde68a] text-xs text-[#92400e] flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 shrink-0 text-[#d97706]" />
          <span>
            <strong>Internal Operations Only:</strong> This module strictly logs event execution costs (food ingredients, chicken, rice, water, fuel, labor wages, supplier balances). It does <strong>NOT</strong> generate customer billing or sales invoices.
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#fef3c7] text-[#b45309] shrink-0">
          Admin Cost Ledger
        </span>
      </div>

      {/* Event & Day Selection Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-[#163324]" />
          <div>
            <span className="text-[10px] uppercase font-bold text-[#64748b] tracking-wider block">
              Active Event Cost Center
            </span>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="text-sm font-bold text-[#0f172a] bg-transparent border-none focus:outline-none cursor-pointer pr-4"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.eventName} — {ev.clientName} ({ev.numberOfDays} Days)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#f1f5f9] border border-[#e2e8f0]">
          {['All', 1, 2, 3].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                selectedDay === day
                  ? 'bg-[#163324] text-white shadow-sm'
                  : 'text-[#64748b] hover:text-[#0f172a] hover:bg-white/60'
              }`}
            >
              {day === 'All' ? 'All Days' : `Day ${day}`}
            </button>
          ))}
        </div>
      </div>

      {/* ================================================== */}
      {/* SUMMARY DASHBOARD — Top 4 KPIs + Daily Breakdown   */}
      {/* ================================================== */}
      <div className="space-y-4">
        {/* 4 Main KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Estimated Expense */}
          <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-sm">
            <div className="flex items-center justify-between text-[#64748b] mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Estimated Expense</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#0f172a]">
              ₹{summary.estimatedExpense.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-[#64748b] mt-1 flex items-center gap-1">
              <span>Target event operational budget</span>
            </div>
          </div>

          {/* 2. Actual Expense */}
          <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-sm">
            <div className="flex items-center justify-between text-[#64748b] mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Actual Expense</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#0f172a]">
              ₹{summary.actualExpense.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-[#64748b] mt-1 flex items-center gap-1">
              <span className="text-indigo-600 font-semibold">
                {summary.estimatedExpense > 0
                  ? `${Math.round((summary.actualExpense / summary.estimatedExpense) * 100)}% of budget`
                  : '100%'}
              </span>
              <span>across all logged costs</span>
            </div>
          </div>

          {/* 3. Paid Expense */}
          <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-sm bg-gradient-to-br from-emerald-50/40 to-white">
            <div className="flex items-center justify-between text-emerald-800 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Paid Expense</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-800">
              ₹{summary.paidExpense.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
              <span className="font-semibold">
                {summary.actualExpense > 0
                  ? `${Math.round((summary.paidExpense / summary.actualExpense) * 100)}%`
                  : '0%'}
              </span>
              <span>disbursed & cleared</span>
            </div>
          </div>

          {/* 4. Pending Expense */}
          <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-sm bg-gradient-to-br from-amber-50/40 to-white">
            <div className="flex items-center justify-between text-amber-800 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider">Pending Expense</span>
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-800">
              ₹{summary.pendingExpense.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-amber-700 mt-1 flex items-center gap-1">
              <span className="font-semibold">
                {summary.actualExpense > 0
                  ? `${Math.round((summary.pendingExpense / summary.actualExpense) * 100)}%`
                  : '0%'}
              </span>
              <span>pending disbursal</span>
            </div>
          </div>
        </div>

        {/* Daily Breakdown Row & Total Event Expense */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Day 1 Expense */}
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
            <div className="flex items-center justify-between text-xs font-bold text-[#475569] mb-1">
              <span>Day 1 Expense</span>
              <span className="text-[10px] text-[#64748b]">Est: ₹{summary.day1Estimated.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-lg font-black text-[#0f172a]">
              ₹{summary.day1Expense.toLocaleString('en-IN')}
            </div>
            <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#163324] h-full rounded-full"
                style={{
                  width: `${Math.min(100, Math.round((summary.day1Expense / summary.day1Estimated) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Day 2 Expense */}
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
            <div className="flex items-center justify-between text-xs font-bold text-[#475569] mb-1">
              <span>Day 2 Expense</span>
              <span className="text-[10px] text-[#64748b]">Est: ₹{summary.day2Estimated.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-lg font-black text-[#0f172a]">
              ₹{summary.day2Expense.toLocaleString('en-IN')}
            </div>
            <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#163324] h-full rounded-full"
                style={{
                  width: `${Math.min(100, Math.round((summary.day2Expense / summary.day2Estimated) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Day 3 Expense */}
          <div className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
            <div className="flex items-center justify-between text-xs font-bold text-[#475569] mb-1">
              <span>Day 3 Expense</span>
              <span className="text-[10px] text-[#64748b]">Est: ₹{summary.day3Estimated.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-lg font-black text-[#0f172a]">
              ₹{summary.day3Expense.toLocaleString('en-IN')}
            </div>
            <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#163324] h-full rounded-full"
                style={{
                  width: `${Math.min(100, Math.round((summary.day3Expense / summary.day3Estimated) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Total Event Expense */}
          <div className="p-3.5 rounded-xl bg-[#163324] text-white border border-[#1e3a2b] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-bold text-[#cbd5e1]">
              <span>Total Event Expense</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#c29c5e] text-[#163324] font-black">
                RECONCILED
              </span>
            </div>
            <div className="text-xl font-black text-[#dfbe82] my-1">
              ₹{summary.totalEventExpense.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-[#94a3b8]">
              Total actual outlay across all 3 days
            </div>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* MAIN VIEW NAVIGATION TABS                           */}
      {/* ================================================== */}
      <div className="flex items-center gap-2 border-b border-[#e2e8f0]">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'expenses'
              ? 'border-[#163324] text-[#163324]'
              : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
          }`}
        >
          <ReceiptText className="w-4 h-4" />
          Event Expenses Log
          <span className="ml-1 px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[10px] text-[#475569]">
            {filteredExpenses.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('vendors')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'vendors'
              ? 'border-[#163324] text-[#163324]'
              : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
          }`}
        >
          <Store className="w-4 h-4" />
          Vendor Payments
          <span className="ml-1 px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[10px] text-[#475569]">
            {eventVendors.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'categories'
              ? 'border-[#163324] text-[#163324]'
              : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
          }`}
        >
          <PieChart className="w-4 h-4" />
          Category Cost Breakdown
          <span className="ml-1 px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[10px] text-[#475569]">
            {categoryBreakdown.length}
          </span>
        </button>
      </div>

      {/* ================================================== */}
      {/* TAB 1: EVENT EXPENSES LOG                          */}
      {/* ================================================== */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          {/* Filter Toolbar */}
          <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#94a3b8]" />
                <input
                  type="text"
                  placeholder="Search description, vendor, receipt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
                />
              </div>

              {/* Category Filter (18 Categories) */}
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
                >
                  <option value="All">All Categories (18)</option>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
                >
                  <option value="All">All Payment Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              {/* Payment Method Filter */}
              <div>
                <select
                  value={paymentMethodFilter}
                  onChange={(e) => setPaymentMethodFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#cbd5e1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#163324]"
                >
                  <option value="All">All Payment Methods</option>
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Category Quick Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <span className="text-[11px] text-[#64748b] font-medium mr-1 shrink-0">Quick Filter:</span>
              <button
                onClick={() => setCategoryFilter('All')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors shrink-0 ${
                  categoryFilter === 'All'
                    ? 'bg-[#163324] text-white'
                    : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                }`}
              >
                All ({expenses.length})
              </button>
              {['Chicken', 'Rice', 'Spices', 'Vegetables', 'Water', 'Containers', 'Staff', 'Transportation', 'Gas/Fuel'].map((cat) => {
                const count = expenses.filter((e) => e.category === cat).length
                if (count === 0) return null
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors shrink-0 ${
                      categoryFilter === cat
                        ? 'bg-[#163324] text-white'
                        : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                )
              })}
            </div>
          </div>

          {/* Expenses Table */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Date / Day</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Description & Payee</th>
                    <th className="py-3 px-4">Receipt Ref</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4 text-right">Amount (₹)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[#64748b]">
                        <ReceiptText className="w-8 h-8 mx-auto text-[#cbd5e1] mb-2" />
                        <p className="font-semibold text-sm">No expenses matched your filter</p>
                        <p className="text-xs text-[#94a3b8] mt-1">Try resetting search or filter criteria.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((item) => (
                      <tr key={item.id} className="hover:bg-[#f8fafc] transition-colors">
                        {/* Date / Day */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-medium text-[#0f172a]">{item.date}</div>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#f1f5f9] text-[#475569]">
                            {item.dayNumber === 'All' ? 'All Days' : `Day ${item.dayNumber}`}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[11px] bg-[#eef2f6] text-[#334155]">
                            <Tag className="w-3 h-3 text-[#64748b]" />
                            {item.category}
                          </span>
                        </td>

                        {/* Description & Payee */}
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-bold text-[#0f172a]">{item.description}</div>
                          <div className="text-[11px] text-[#64748b] flex items-center gap-1 mt-0.5">
                            <Store className="w-3 h-3" />
                            {item.vendor || 'Direct / Internal'}
                          </div>
                          {item.notes && (
                            <div className="text-[10px] text-[#94a3b8] italic mt-0.5 line-clamp-1">
                              {item.notes}
                            </div>
                          )}
                        </td>

                        {/* Receipt Ref */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {item.receipt ? (
                            <span className="font-mono text-[11px] font-medium text-[#475569] bg-[#f1f5f9] px-2 py-0.5 rounded border border-[#e2e8f0]">
                              {item.receipt}
                            </span>
                          ) : (
                            <span className="text-[11px] text-[#94a3b8]">—</span>
                          )}
                        </td>

                        {/* Payment Method */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="text-[11px] font-medium text-[#334155] bg-white border border-[#e2e8f0] px-2 py-0.5 rounded shadow-2xs">
                            {item.paymentMethod}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="py-3 px-4 whitespace-nowrap text-right font-black text-[#0f172a] text-sm">
                          ₹{Number(item.amount).toLocaleString('en-IN')}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleToggleStatus(item.id, item.status)}
                            title="Click to toggle Paid / Pending"
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-transform active:scale-95 cursor-pointer ${
                              item.status === 'Paid'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }`}
                          >
                            {item.status === 'Paid' ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" /> Paid
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3" /> Pending
                              </>
                            )}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setEditingExpense(item)
                                setIsExpenseModalOpen(true)
                              }}
                              className="p-1 rounded hover:bg-[#e2e8f0] text-[#64748b] hover:text-[#0f172a]"
                              title="Edit Expense"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(item.id, item.description)}
                              className="p-1 rounded hover:bg-red-50 text-[#64748b] hover:text-red-600"
                              title="Delete Expense"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary */}
            <div className="p-3.5 bg-[#f8fafc] border-t border-[#e2e8f0] flex flex-wrap items-center justify-between text-xs text-[#64748b] gap-2">
              <span>
                Showing <strong>{filteredExpenses.length}</strong> of <strong>{expenses.length}</strong> logged expenses
              </span>
              <div className="flex items-center gap-4 font-semibold text-[#0f172a]">
                <span>
                  Filtered Total: <strong>₹{filteredExpenses.reduce((s, i) => s + (Number(i.amount) || 0), 0).toLocaleString('en-IN')}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* TAB 2: VENDOR PAYMENTS                             */}
      {/* ================================================== */}
      {activeTab === 'vendors' && (
        <div className="space-y-4">
          {/* Vendor Payments KPI Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-sm">
              <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">
                Total Contract Value
              </span>
              <div className="text-xl font-black text-[#0f172a] mt-1">
                ₹{vendorSummary.totalContract.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-[#64748b]">All committed supplier contracts</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#e2e8f0] shadow-sm">
              <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">
                Total Advances
              </span>
              <div className="text-xl font-black text-blue-700 mt-1">
                ₹{vendorSummary.totalAdvance.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-[#64748b]">Disbursed at contract booking</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-emerald-200 shadow-sm bg-emerald-50/20">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Total Disbursed (Paid)
              </span>
              <div className="text-xl font-black text-emerald-800 mt-1">
                ₹{vendorSummary.totalPaid.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-emerald-700">Advances + progress settlements</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-amber-200 shadow-sm bg-amber-50/20">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                Total Outstanding Balance
              </span>
              <div className="text-xl font-black text-amber-800 mt-1">
                ₹{vendorSummary.totalBalance.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-amber-700">Remaining supplier payables</span>
            </div>
          </div>

          {/* Vendor Payments Table */}
          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Vendor</th>
                    <th className="py-3 px-4">Event</th>
                    <th className="py-3 px-4 text-right">Total Amount (₹)</th>
                    <th className="py-3 px-4 text-right">Advance (₹)</th>
                    <th className="py-3 px-4 text-right">Paid (₹)</th>
                    <th className="py-3 px-4 text-right">Balance (₹)</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {eventVendors.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-[#64748b]">
                        <Store className="w-8 h-8 mx-auto text-[#cbd5e1] mb-2" />
                        <p className="font-semibold text-sm">No vendors registered for this event</p>
                        <p className="text-xs text-[#94a3b8] mt-1">Add vendors in the Vendors module.</p>
                      </td>
                    </tr>
                  ) : (
                    eventVendors.map((vendor) => {
                      const total = Number(vendor.contractAmount) || 0
                      const advance = Number(vendor.advance) || 0
                      const paid = Number(vendor.paid) || 0
                      const balance = Math.max(0, total - paid)
                      const isOverdue = vendor.dueDate && new Date(vendor.dueDate) < new Date() && balance > 0

                      return (
                        <tr key={vendor.id} className="hover:bg-[#f8fafc] transition-colors">
                          {/* Vendor */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#0f172a]">{vendor.vendorName}</div>
                            <div className="text-[10px] text-[#64748b] flex items-center gap-1.5 mt-0.5">
                              <span className="px-1.5 py-0.2 rounded bg-[#f1f5f9] text-[#475569] font-medium">
                                {vendor.category}
                              </span>
                              <span>{vendor.phone}</span>
                            </div>
                          </td>

                          {/* Event */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-medium text-[#0f172a]">{vendor.eventName || activeEvent?.eventName}</div>
                            <span className="text-[10px] text-[#64748b]">Day {vendor.dayNumber || 1}</span>
                          </td>

                          {/* Total Amount */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-right font-black text-[#0f172a]">
                            ₹{total.toLocaleString('en-IN')}
                          </td>

                          {/* Advance */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-right text-[#475569]">
                            ₹{advance.toLocaleString('en-IN')}
                          </td>

                          {/* Paid */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-right font-bold text-emerald-700">
                            ₹{paid.toLocaleString('en-IN')}
                          </td>

                          {/* Balance (Total Amount - Paid) */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-right font-black text-amber-700">
                            ₹{balance.toLocaleString('en-IN')}
                          </td>

                          {/* Due Date */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 font-medium text-[#334155]">
                              <Calendar className="w-3.5 h-3.5 text-[#94a3b8]" />
                              <span>{vendor.dueDate || '2026-03-22'}</span>
                            </div>
                            {isOverdue && (
                              <span className="text-[10px] font-bold text-red-600 flex items-center gap-0.5 mt-0.5">
                                <AlertCircle className="w-3 h-3" /> Due Soon
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                balance === 0 || vendor.status === 'Paid' || vendor.status === 'Settled'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : paid > 0 || vendor.status === 'Partial' || vendor.status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {balance === 0 || vendor.status === 'Paid' || vendor.status === 'Settled' ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3" /> Paid
                                </>
                              ) : paid > 0 || vendor.status === 'Partial' ? (
                                <>
                                  <Clock className="w-3 h-3" /> Partial
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3" /> Pending
                                </>
                              )}
                            </span>
                          </td>

                          {/* Action */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-right">
                            {balance > 0 ? (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleOpenRecordPayment(vendor)}
                              >
                                Record Payment
                              </Button>
                            ) : (
                              <span className="text-[11px] font-bold text-emerald-700 inline-flex items-center gap-1">
                                <FileCheck2 className="w-3.5 h-3.5" /> Settled
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* TAB 3: CATEGORY COST BREAKDOWN                     */}
      {/* ================================================== */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#0f172a] mb-1">
              Category Spending Distribution ({categoryBreakdown.length} Active Categories)
            </h3>
            <p className="text-xs text-[#64748b] mb-4">
              Detailed operations breakdown across the 18 standardized event cost categories.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryBreakdown.map((item) => {
                const percentOfActual = summary.actualExpense > 0 ? Math.round((item.total / summary.actualExpense) * 100) : 0
                return (
                  <div key={item.name} className="p-3.5 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0f172a]">{item.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e2e8f0] text-[#475569]">
                          {item.count} voucher{item.count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="text-lg font-black text-[#163324] mt-1.5">
                        ₹{item.total.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#e2e8f0] text-[10px] flex items-center justify-between text-[#64748b]">
                      <span className="text-emerald-700 font-semibold">
                        Paid: ₹{item.paid.toLocaleString('en-IN')}
                      </span>
                      <span className="text-amber-700 font-semibold">
                        Pending: ₹{item.pending.toLocaleString('en-IN')}
                      </span>
                      <span className="font-bold text-[#334155]">
                        {percentOfActual}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false)
          setEditingExpense(null)
        }}
        onSave={handleSaveExpense}
        expense={editingExpense}
        defaultEventId={selectedEventId}
        defaultDay={selectedDay === 'All' ? 1 : selectedDay}
      />

      <VendorPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false)
          setPayingVendor(null)
        }}
        vendor={payingVendor}
        onRecordPayment={handleConfirmVendorPayment}
      />
    </div>
  )
}
