import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminLayout } from '../layouts/AdminLayout'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import {
  Dashboard,
  Login,
  Events,
  EventDetail,
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
