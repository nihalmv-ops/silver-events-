import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminLayout } from '../layouts/AdminLayout'
import {
  Dashboard,
  Events,
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
  Reports,
  Printouts,
  Settings,
} from '../pages'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="events" element={<Events />} />
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
        <Route path="reports" element={<Reports />} />
        <Route path="printouts" element={<Printouts />} />
        <Route path="settings" element={<Settings />} />
        {/* Wildcard redirect back to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

