import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const TaskContext = createContext(null)

const STORAGE_KEY = 'silver_catering_tasks_data_v1'

export const TASK_CATEGORIES = [
  'Event',
  'Catering',
  'Food',
  'Packing',
  'Water',
  'Arrangement',
  'Staff',
  'Vendor',
  'Task',
  'Expense',
]

export const TASK_STATUSES = ['Pending', 'In Progress', 'Completed']

export const TASK_PRIORITIES = ['High', 'Medium', 'Low']

export const AUTOMATIC_EVENT_TASK_TEMPLATES = [
  { task: 'Confirm Guest Count', category: 'Event', priority: 'High', responsible: 'Capt. Pradeep Menon (Operations Lead)', notes: 'Verify registered delegate numbers with college convener.' },
  { task: 'Confirm Menu', category: 'Catering', priority: 'High', responsible: 'Capt. Pradeep Menon', notes: 'Finalize courses and dietary counts for all 3 days.' },
  { task: 'Confirm Food Quantity', category: 'Food', priority: 'High', responsible: 'Chef Moideen Kutty (Head Chef)', notes: 'Calibrate cauldrons: 10,000 portions per day.' },
  { task: 'Confirm Water Quantity', category: 'Water', priority: 'High', responsible: 'Suhail Ahmed (Water Team Lead)', notes: 'Confirm 10,000 chilled 250ml mineral water bottles per day.' },
  { task: 'Confirm Venue', category: 'Arrangement', priority: 'Medium', responsible: 'Muhammed Shafi (Venue Supervisor)', notes: 'Inspect dining ground hangar, entry gates, and electrical points.' },
  { task: 'Confirm Vendors', category: 'Vendor', priority: 'High', responsible: 'Capt. Pradeep Menon', notes: 'Verify fresh poultry, aged basmati rice, and LPG gas deliveries.' },
  { task: 'Assign Staff', category: 'Staff', priority: 'High', responsible: 'Capt. Pradeep Menon', notes: 'Allocate 45 crew across kitchen, packing, single counter, and cleaning.' },
  { task: 'Confirm Transport', category: 'Expense', priority: 'Medium', responsible: 'Manoj Kumar (Logistics Lead)', notes: 'Inspect 4 refrigerated transport trucks and gate passes.' },
  { task: 'Food Quality Check', category: 'Food', priority: 'High', responsible: 'Chef Moideen Kutty', notes: 'Thermal core temp (>68°C), spice level, and tenderness verification.' },
  { task: 'Complete Packing', category: 'Packing', priority: 'High', responsible: 'Rajesh Nair (Packing Lead)', notes: 'Seal 200 insulated thermal hot-boxes (50 pax each).' },
  { task: 'Water Stock Check', category: 'Water', priority: 'Medium', responsible: 'Suhail Ahmed', notes: 'Unload pallets at Main Distribution Counter hydration station.' },
  { task: 'Counter Setup', category: 'Arrangement', priority: 'High', responsible: 'Muhammed Shafi', notes: 'Strictly ONE central distribution counter with 4 barricaded flow lines.' },
  { task: 'Final Stock Check', category: 'Task', priority: 'High', responsible: 'Suresh Babu (Stock Lead)', notes: 'Verify disposable banana-leaf paper plates, spoons, and cups.' },
  { task: 'Final Venue Inspection', category: 'Arrangement', priority: 'High', responsible: 'Capt. Pradeep Menon', notes: 'Walkthrough with client convener before opening dining gates.' },
]

// Pre-seeded authentic tasks for the 3-day College Event
const INITIAL_TASKS = [
  {
    id: 'tsk-01',
    task: 'Confirm Guest Count',
    category: 'Event',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsiblePerson: 'Capt. Pradeep Menon',
    dueDate: '2026-09-16',
    priority: 'High',
    status: 'Completed',
    notes: 'Finalized 10,000 expected pax with Convener Prof. Narayanan.',
  },
  {
    id: 'tsk-02',
    task: 'Confirm Menu',
    category: 'Catering',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsiblePerson: 'Capt. Pradeep Menon',
    dueDate: '2026-09-16',
    priority: 'High',
    status: 'Completed',
    notes: 'Chicken Biryani with raitha, pickle, and 250ml water bottles locked in.',
  },
  {
    id: 'tsk-03',
    task: 'Confirm Food Quantity',
    category: 'Food',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsiblePerson: 'Chef Moideen Kutty',
    dueDate: '2026-09-16',
    priority: 'High',
    status: 'Completed',
    notes: '40 cauldrons of dum biriyani fired up at central kitchen.',
  },
  {
    id: 'tsk-04',
    task: 'Confirm Water Quantity',
    category: 'Water',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsiblePerson: 'Suhail Ahmed',
    dueDate: '2026-09-16',
    priority: 'High',
    status: 'Completed',
    notes: '10,000 bottles delivered and pre-chilled in transport van.',
  },
  {
    id: 'tsk-05',
    task: 'Confirm Venue',
    category: 'Arrangement',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsiblePerson: 'Muhammed Shafi',
    dueDate: '2026-09-16',
    priority: 'Medium',
    status: 'Completed',
    notes: 'MES College grounds pavilion setup and sanitized.',
  },
  {
    id: 'tsk-06',
    task: 'Confirm Vendors',
    category: 'Vendor',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsiblePerson: 'Capt. Pradeep Menon',
    dueDate: '2026-09-16',
    priority: 'High',
    status: 'Completed',
    notes: 'Poultry, spices, and commercial gas delivered on time.',
  },
  {
    id: 'tsk-07',
    task: 'Assign Staff',
    category: 'Staff',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsiblePerson: 'Capt. Pradeep Menon',
    dueDate: '2026-09-16',
    priority: 'High',
    status: 'Completed',
    notes: '45 crew briefed and assigned to stations.',
  },
  {
    id: 'tsk-08',
    task: 'Confirm Transport',
    category: 'Expense',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsiblePerson: 'Manoj Kumar',
    dueDate: '2026-09-16',
    priority: 'Medium',
    status: 'Completed',
    notes: '4 refrigerated trucks on active shuttle route.',
  },
  {
    id: 'tsk-09',
    task: 'Food Quality Check',
    category: 'Food',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsiblePerson: 'Chef Moideen Kutty',
    dueDate: '2026-09-16',
    priority: 'High',
    status: 'Completed',
    notes: 'Temperature verified at 74°C upon arrival at venue.',
  },
  {
    id: 'tsk-10',
    task: 'Complete Packing',
    category: 'Packing',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsiblePerson: 'Rajesh Nair',
    dueDate: '2026-09-16',
    priority: 'High',
    status: 'Completed',
    notes: '196 containers sealed and loaded in staging trucks.',
  },
  {
    id: 'tsk-11',
    task: 'Water Stock Check',
    category: 'Water',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsiblePerson: 'Suhail Ahmed',
    dueDate: '2026-09-16',
    priority: 'Medium',
    status: 'In Progress',
    notes: 'Replenishing remaining 2,200 bottles to counter pallets.',
  },
  {
    id: 'tsk-12',
    task: 'Counter Setup',
    category: 'Arrangement',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsiblePerson: 'Muhammed Shafi',
    dueDate: '2026-09-16',
    priority: 'High',
    status: 'Completed',
    notes: 'Single central distribution counter open and serving 4 lines.',
  },
  {
    id: 'tsk-13',
    task: 'Final Stock Check',
    category: 'Task',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsiblePerson: 'Suresh Babu',
    dueDate: '2026-09-16',
    priority: 'High',
    status: 'In Progress',
    notes: 'Buffer plates and cutlery replenishment check for evening round.',
  },
  {
    id: 'tsk-14',
    task: 'Final Venue Inspection',
    category: 'Arrangement',
    eventId: 'evt-college-3day',
    dayNumber: 1,
    responsiblePerson: 'Capt. Pradeep Menon',
    dueDate: '2026-09-16',
    priority: 'High',
    status: 'Pending',
    notes: 'Post-service waste disposal and security sweep.',
  },
  // Additional Day 2 & Day 3 Pending Tasks
  {
    id: 'tsk-d2-01',
    task: 'Day 2 Poultry & Marination Early Fire-up',
    category: 'Food',
    eventId: 'evt-college-3day',
    dayNumber: 2,
    responsiblePerson: 'Chef Moideen Kutty',
    dueDate: '2026-09-17',
    priority: 'High',
    status: 'Pending',
    notes: 'Central kitchen boilers fire up at 04:00 AM.',
  },
  {
    id: 'tsk-d2-02',
    task: 'Replenish Dry Ice for Day 2 Water Convoy',
    category: 'Water',
    eventId: 'evt-college-3day',
    dayNumber: 2,
    responsiblePerson: 'Suhail Ahmed',
    dueDate: '2026-09-17',
    priority: 'High',
    status: 'Pending',
    notes: 'Order 800 kg ice blocks for second 10,000 bottle batch.',
  },
  {
    id: 'tsk-d2-03',
    task: 'Review Single Counter Queue Barricades',
    category: 'Arrangement',
    eventId: 'evt-college-3day',
    dayNumber: 2,
    responsiblePerson: 'Vipin Das',
    dueDate: '2026-09-17',
    priority: 'Medium',
    status: 'Pending',
    notes: 'Tighten stanchions to maintain orderly queue flow.',
  },
  {
    id: 'tsk-d3-01',
    task: 'Day 3 Valedictory Buffet Setup',
    category: 'Event',
    eventId: 'evt-college-3day',
    dayNumber: 3,
    responsiblePerson: 'Capt. Pradeep Menon',
    dueDate: '2026-09-18',
    priority: 'Medium',
    status: 'Pending',
    notes: 'Closing ceremony schedule alignment with college dignitaries.',
  },
]

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) return JSON.parse(saved)
    } catch {
      // Fallback
    }
    return INITIAL_TASKS
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (e) {
      console.warn('Could not save tasks to localStorage:', e)
    }
  }, [tasks])

  const createTask = useCallback((taskData) => {
    const newTask = {
      id: 'tsk-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      priority: taskData.priority || 'Medium',
      status: taskData.status || 'Pending',
      dayNumber: Number(taskData.dayNumber) || 1,
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      notes: taskData.notes || '',
      ...taskData,
    }
    setTasks((prev) => [newTask, ...prev])
    return newTask
  }, [])

  const updateTask = useCallback((id, updatedFields) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t))
    )
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const completeTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Completed' } : t))
    )
  }, [])

  const toggleTaskStatus = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const next =
          t.status === 'Pending'
            ? 'In Progress'
            : t.status === 'In Progress'
            ? 'Completed'
            : 'Pending'
        return { ...t, status: next }
      })
    )
  }, [])

  // Automatically generate the 14 standard tasks for an event
  const generateEventTasks = useCallback((eventId, eventName, startDate) => {
    const dateStr = startDate || new Date().toISOString().split('T')[0]
    const generated = AUTOMATIC_EVENT_TASK_TEMPLATES.map((tmpl, idx) => ({
      id: 'tsk-' + Date.now().toString(36) + '-' + idx,
      task: tmpl.task,
      category: tmpl.category,
      eventId,
      dayNumber: 1,
      responsiblePerson: tmpl.responsible,
      dueDate: dateStr,
      priority: tmpl.priority,
      status: 'Pending',
      notes: tmpl.notes,
    }))

    setTasks((prev) => [...generated, ...prev])
    return generated
  }, [])

  const value = {
    tasks,
    categories: TASK_CATEGORIES,
    statuses: TASK_STATUSES,
    priorities: TASK_PRIORITIES,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    toggleTaskStatus,
    generateEventTasks,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider')
  }
  return context
}
