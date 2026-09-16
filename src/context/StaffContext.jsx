import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const StaffContext = createContext(null)

const STORAGE_KEY = 'silver_catering_staff_data_v1'

export const STAFF_ROLES = [
  'Event Operations Manager',
  'Catering Supervisor',
  'Kitchen Supervisor',
  'Kitchen Staff',
  'Packing Team',
  'Distribution Team',
  'Water Team',
  'Stock Team',
  'Runner',
  'Logistics',
  'Queue Management',
  'Cleaning',
]

export const ATTENDANCE_STATUSES = ['Present', 'Absent', 'Late', 'On Duty']

export const STAFF_STATUSES = ['Active', 'Break', 'Completed', 'Off Duty']

const INITIAL_STAFF = [
  {
    id: 'st-01',
    name: 'Capt. Pradeep Menon',
    phone: '+91 98470 55123',
    role: 'Event Operations Manager',
    department: 'Operations & Management',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsibility: 'Overall venue coordination, client liaison, and schedule management',
    attendance: 'Present',
    status: 'Active',
  },
  {
    id: 'st-02',
    name: 'Chef Moideen Kutty',
    phone: '+91 94471 22890',
    role: 'Kitchen Supervisor',
    department: 'Kitchen Production',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsibility: 'Lead biryani dum master for 40 cauldrons, spice seasoning oversight',
    attendance: 'Present',
    status: 'Active',
  },
  {
    id: 'st-03',
    name: 'Muhammed Shafi',
    phone: '+91 99462 33412',
    role: 'Catering Supervisor',
    department: 'Distribution & Counter',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsibility: 'Single Main Distribution Counter oversight and steward coordination',
    attendance: 'On Duty',
    status: 'Active',
  },
  {
    id: 'st-04',
    name: 'Rajesh Nair',
    phone: '+91 98463 44521',
    role: 'Packing Team',
    department: 'Packaging & Thermal Staging',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsibility: 'Insulated thermal hot-box temperature checks (>68°C) and sealing',
    attendance: 'Present',
    status: 'Active',
  },
  {
    id: 'st-05',
    name: 'Anas K.V.',
    phone: '+91 97455 66782',
    role: 'Distribution Team',
    department: 'Distribution & Counter',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsibility: 'Main Counter Section A chicken biryani plate dispensing',
    attendance: 'Present',
    status: 'Active',
  },
  {
    id: 'st-06',
    name: 'Suhail Ahmed',
    phone: '+91 96331 88902',
    role: 'Water Team',
    department: 'Hydration & Water',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsibility: 'Chilled 250ml mineral bottle crate staging and replenishment',
    attendance: 'Present',
    status: 'Active',
  },
  {
    id: 'st-07',
    name: 'Vipin Das',
    phone: '+91 95672 11432',
    role: 'Queue Management',
    department: 'Distribution & Counter',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsibility: 'Single counter queue barricades and 4-line flow marshaling',
    attendance: 'On Duty',
    status: 'Active',
  },
  {
    id: 'st-08',
    name: 'Haris P.',
    phone: '+91 98460 77123',
    role: 'Runner',
    department: 'Packaging & Thermal Staging',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsibility: 'Rapid shuttle of thermal boxes from ready stock truck to Main Counter',
    attendance: 'Present',
    status: 'Active',
  },
  {
    id: 'st-09',
    name: 'Manoj Kumar',
    phone: '+91 94468 99012',
    role: 'Logistics',
    department: 'Logistics & Transport',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsibility: 'Refrigerated van transport convoy driver (Kitchen to MES College)',
    attendance: 'Present',
    status: 'Active',
  },
  {
    id: 'st-10',
    name: 'Suresh Babu',
    phone: '+91 97470 12389',
    role: 'Stock Team',
    department: 'Operations & Management',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsibility: 'Disposable plates, cutlery, raitha cups, and banana leaf reserves',
    attendance: 'Present',
    status: 'Active',
  },
  {
    id: 'st-11',
    name: 'Babu Chandran',
    phone: '+91 98477 33214',
    role: 'Cleaning',
    department: 'Grounds & Sanitation',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsibility: 'Post-dining plate disposal, food waste segregation, and table sanitization',
    attendance: 'Present',
    status: 'Active',
  },
  {
    id: 'st-12',
    name: 'Siddique Ali',
    phone: '+91 99460 44321',
    role: 'Kitchen Staff',
    department: 'Kitchen Production',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsibility: 'Onions browning station, cashew frying, and egg boiling line',
    attendance: 'Present',
    status: 'Active',
  },
]

export function StaffProvider({ children }) {
  const [staffList, setStaffList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // Fallback
    }
    return INITIAL_STAFF
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(staffList))
    } catch (e) {
      console.warn('Could not save staff to localStorage:', e)
    }
  }, [staffList])

  const addStaff = useCallback((staffMember) => {
    const newMember = {
      id: 'st-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      attendance: staffMember.attendance || 'Present',
      status: staffMember.status || 'Active',
      ...staffMember,
      dayNumber: Number(staffMember.dayNumber) || 1,
    }
    setStaffList((prev) => [newMember, ...prev])
    return newMember
  }, [])

  const updateStaff = useCallback((id, updatedFields) => {
    setStaffList((prev) =>
      prev.map((member) => (member.id === id ? { ...member, ...updatedFields } : member))
    )
  }, [])

  const deleteStaff = useCallback((id) => {
    setStaffList((prev) => prev.filter((member) => member.id !== id))
  }, [])

  const toggleAttendance = useCallback((id) => {
    setStaffList((prev) =>
      prev.map((member) => {
        if (member.id !== id) return member
        const current = member.attendance
        const next =
          current === 'Present'
            ? 'On Duty'
            : current === 'On Duty'
            ? 'Late'
            : current === 'Late'
            ? 'Absent'
            : 'Present'
        return { ...member, attendance: next }
      })
    )
  }, [])

  const value = {
    staffList,
    roles: STAFF_ROLES,
    attendanceStatuses: ATTENDANCE_STATUSES,
    staffStatuses: STAFF_STATUSES,
    addStaff,
    updateStaff,
    deleteStaff,
    toggleAttendance,
  }

  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>
}

export function useStaff() {
  const context = useContext(StaffContext)
  if (!context) {
    throw new Error('useStaff must be used within a StaffProvider')
  }
  return context
}

