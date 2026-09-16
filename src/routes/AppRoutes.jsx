import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminLayout } from '../layouts/AdminLayout'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import {
  Dashboard,
  Login,
  Events,
  EventDetail,
  DayOperations,
  OneCounter,
  StockManagement,
  ProductsPrices,
  CateringMenu,
  FoodPreparation,
  FoodPacking,
  FoodDistribution,
  WaterManagement,
  Arrangements,
  Vendors,
  Staff,
  Tasks,
  Pending,
  Expenses,
  SalesIncome,
  FinancialSummary,
  Reports,
  PrintReports,
  Printouts,
  Settings,
} from '../pages'

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetail />} />

          {/* 3-Day Event Operations Dedicated Routes */}
          <Route path="day-1" element={<DayOperations defaultDay={1} />} />
          <Route path="day-2" element={<DayOperations defaultDay={2} />} />
          <Route path="day-3" element={<DayOperations defaultDay={3} />} />
          <Route path="day/:dayNumber" element={<DayOperations />} />
          <Route path="one-counter" element={<OneCounter />} />
          <Route path="stock" element={<StockManagement />} />
          <Route path="products" element={<ProductsPrices />} />

          {/* Core Operations & Financials */}
          <Route path="catering-menu" element={<CateringMenu />} />
          <Route path="food-prep" element={<FoodPreparation />} />
          <Route path="food-packing" element={<FoodPacking />} />
          <Route path="food-distribution" element={<FoodDistribution />} />
          <Route path="water-management" element={<WaterManagement />} />
          <Route path="arrangements" element={<Arrangements />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="staff" element={<Staff />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="pending" element={<Pending />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="sales" element={<SalesIncome />} />
          <Route path="financials" element={<FinancialSummary />} />
          <Route path="reports" element={<Reports />} />
          <Route path="print-reports" element={<PrintReports />} />
          <Route path="printouts" element={<Printouts />} />
          <Route path="settings" element={<Settings />} />

          {/* Wildcard redirect back to Dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}
