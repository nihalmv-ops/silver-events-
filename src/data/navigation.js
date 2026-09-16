import {
  LayoutDashboard,
  CalendarDays,
  UtensilsCrossed,
  ChefHat,
  PackageCheck,
  Truck,
  Droplets,
  Layers,
  Store,
  Users,
  CheckSquare,
  ClockAlert,
  ReceiptText,
  BarChart3,
  Printer,
  Settings,
} from 'lucide-react'

export const navigationGroups = [
  {
    title: 'Overview',
    items: [
      {
        id: 'dashboard',
        name: 'Dashboard',
        path: '/',
        icon: LayoutDashboard,
        badge: 'Live',
        badgeVariant: 'success',
        description: 'Real-time overview of current events, kitchen prep, and operational metrics.',
      },
      {
        id: 'events',
        name: 'Events',
        path: '/events',
        icon: CalendarDays,
        description: 'Manage wedding receptions, corporate banquets, and celebration schedules.',
      },
    ],
  },
  {
    title: 'Food Operations',
    items: [
      {
        id: 'catering-menu',
        name: 'Catering & Menu',
        path: '/catering-menu',
        icon: UtensilsCrossed,
        description: 'Menu configurations, customized course packages, and dish catalogs.',
      },
      {
        id: 'food-prep',
        name: 'Food Preparation',
        path: '/food-prep',
        icon: ChefHat,
        description: 'Kitchen batch scheduling, cooking milestones, and master chef assignments.',
      },
      {
        id: 'food-packing',
        name: 'Food Packing',
        path: '/food-packing',
        icon: PackageCheck,
        description: 'Hot box packaging, container labelling, and thermal staging check.',
      },
      {
        id: 'food-distribution',
        name: 'Food Distribution',
        path: '/food-distribution',
        icon: Truck,
        description: 'Buffet counter dispatch, replenishment logistics, and live counter distribution.',
      },
    ],
  },
  {
    title: 'Site & Logistics',
    items: [
      {
        id: 'water-management',
        name: 'Water Management',
        path: '/water-management',
        icon: Droplets,
        description: 'Mineral water dispenser allocation, guest drinking counters, and refill logs.',
      },
      {
        id: 'arrangements',
        name: 'Arrangements',
        path: '/arrangements',
        icon: Layers,
        description: 'Buffet layouts, chafing warmers, premium cutlery, and seating arrangements.',
      },
      {
        id: 'vendors',
        name: 'Vendors',
        path: '/vendors',
        icon: Store,
        description: 'Raw spice, poultry, dairy, produce suppliers and procurement directories.',
      },
      {
        id: 'staff',
        name: 'Staff & Captains',
        path: '/staff',
        icon: Users,
        description: 'Floor managers, service captains, chefs, and catering stewards roster.',
      },
    ],
  },
  {
    title: 'Operations Tracking',
    items: [
      {
        id: 'tasks',
        name: 'Tasks',
        path: '/tasks',
        icon: CheckSquare,
        description: 'Event execution task boards, checklist milestones, and operational handoffs.',
      },
      {
        id: 'pending',
        name: 'Pending Actions',
        path: '/pending',
        icon: ClockAlert,
        badge: '4 Urgent',
        badgeVariant: 'warning',
        description: 'Critical pending approvals, missing materials, and time-sensitive bottlenecks.',
      },
      {
        id: 'expenses',
        name: 'Expenses',
        path: '/expenses',
        icon: ReceiptText,
        description: 'Internal operations purchases, fuel, ice, temporary labor, and daily logistics costs.',
      },
    ],
  },
  {
    title: 'System & Outputs',
    items: [
      {
        id: 'reports',
        name: 'Reports',
        path: '/reports',
        icon: BarChart3,
        description: 'Post-event consumption summaries, kitchen efficiency ratings, and wastage analysis.',
      },
      {
        id: 'printouts',
        name: 'Printouts',
        path: '/printouts',
        icon: Printer,
        description: 'Kitchen prep sheets, packing checklists, delivery gate passes, and crew allocations.',
      },
      {
        id: 'settings',
        name: 'Settings',
        path: '/settings',
        icon: Settings,
        description: 'Branch profiles, operational defaults, kitchen zones, and system preferences.',
      },
    ],
  },
]

export const allNavItems = navigationGroups.flatMap((group) => group.items)

