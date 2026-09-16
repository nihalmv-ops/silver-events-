/**
 * Mock data for Silver Catering Dashboard Preview
 */
export const mockDashboardData = {
  // Top level event metrics
  eventStats: [
    {
      id: 'total-events',
      title: 'Total Events',
      value: 148,
      subtext: 'This catering season',
      trend: '+14% vs last month',
      trendType: 'positive',
      icon: 'CalendarDays',
      accentColor: 'primary',
    },
    {
      id: 'upcoming-events',
      title: 'Upcoming Events',
      value: 12,
      subtext: 'Scheduled next 14 days',
      trend: '4 mega events (>1000 pax)',
      trendType: 'neutral',
      icon: 'Clock',
      accentColor: 'gold',
    },
    {
      id: 'ongoing-events',
      title: 'Ongoing Events',
      value: 2,
      subtext: 'Active on-ground today',
      trend: 'Live operations running',
      trendType: 'active',
      icon: 'Activity',
      accentColor: 'success',
    },
    {
      id: 'completed-events',
      title: 'Completed Events',
      value: 134,
      subtext: 'Flawlessly delivered',
      trend: '99.2% satisfaction rate',
      trendType: 'positive',
      icon: 'CheckCircle2',
      accentColor: 'silver',
    },
  ],

  // Today's primary active event showcase
  todayEvent: {
    name: 'Dr. Rohit & Dr. Ananya — Royal Grand Wedding Reception',
    code: 'EVT-2026-0916',
    venue: 'Grand Hyatt Ballroom & Lakeside Lawns, Kochi',
    serviceType: 'Grand Thalassery Dum Biriyani & Live Continental Counters',
    pax: 1450,
    startTime: '12:30 PM',
    endTime: '04:30 PM',
    eventManager: 'Capt. Pradeep Menon (Operations Lead)',
    status: 'Buffet Active',
    statusVariant: 'success',
    menuHighlights: [
      'Authentic Thalassery Jeerakasala Chicken Biriyani',
      'Slow-braised Nadan Mutton Roast with Coconut Chips',
      'Travancore Chemmeen (Tiger Prawn) Tawa Roast',
      'Live Appam & Malabar Stew Counter',
      'Palada Payasam & Tender Coconut Souffle',
    ],
  },

  // Operational metrics for today's execution
  todayOperations: {
    expectedGuests: {
      total: 1450,
      arrived: 820,
      percentage: 57,
      peakTime: '01:15 PM – 02:30 PM',
      sessions: 'Lunch Banquet + Evening High Tea',
    },
    foodPrepared: {
      status: '95% Complete',
      value: 95,
      note: 'Main course batches 1 & 2 done; Hot breads live at counters',
      badge: 'On Schedule',
      badgeVariant: 'success',
    },
    foodPacked: {
      status: '88% Dispatched',
      value: 88,
      note: '42 / 48 Insulated Cambro hot boxes dispatched from central kitchen',
      badge: 'In Transit',
      badgeVariant: 'info',
    },
    foodDelivered: {
      status: '8 of 8 Counters Ready',
      value: 100,
      note: '6 General buffets + 2 VIP family counters fully staged & chafers lit',
      badge: 'Delivered',
      badgeVariant: 'success',
    },
    waterDelivered: {
      status: '2,800 Bottles / 8 Dispensers',
      value: 93,
      note: 'Chilled 250ml bottles distributed to all guest stations; ice replenished',
      badge: 'Staged',
      badgeVariant: 'success',
    },
    pendingTasks: {
      count: 3,
      urgentCount: 1,
      items: [
        {
          id: 'task-1',
          title: 'Final ice replenishment for Mocktail Bar counter #2',
          urgency: 'high',
          assignedTo: 'Suresh (Logistics)',
          due: '15 mins',
        },
        {
          id: 'task-2',
          title: 'Staging extra 50 chafing dish fuel refills for evening round',
          urgency: 'medium',
          assignedTo: 'Arun (Equipment)',
          due: '45 mins',
        },
        {
          id: 'task-3',
          title: 'Service crew briefing for 2:00 PM VIP family seating',
          urgency: 'low',
          assignedTo: 'Capt. Pradeep',
          due: '1 hour',
        },
      ],
    },
    todayExpenses: {
      total: 48500,
      currency: 'INR',
      note: 'Internal operational logistics expenses for today',
      breakdown: [
        { category: 'Dry Ice & Cubes', amount: 8200 },
        { category: 'Truck Fuel & Tolls', amount: 6500 },
        { category: 'Temporary Service Stewards (12 pax)', amount: 24000 },
        { category: 'Fresh Banana Leaves & Flowers Staging', amount: 9800 },
      ],
    },
  },

  // Second ongoing event (smaller corporate banquet)
  secondaryEvent: {
    name: 'TechMatrix Global Annual Banquet & Dinner',
    code: 'EVT-2026-0917',
    venue: 'Crowne Plaza Convention Center, Maradu',
    serviceType: 'Multicuisine Executive Buffet',
    pax: 450,
    startTime: '07:00 PM',
    status: 'Prep Underway',
    statusVariant: 'warning',
  },
}

