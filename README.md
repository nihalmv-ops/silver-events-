# SILVER CATERING — Event Administration & Operations System

Internal event administration and catering operations management platform for **Silver Catering**.

> **Note**: This is strictly an event administration & operations system (kitchen batching, food packaging, buffet dispatch, hydration logistics, crew rosters, internal event spend). It is **not** a customer billing/sales application.

---

## Tech Stack
- **React 18**
- **Vite 6**
- **Tailwind CSS 3**
- **React Router 6**
- **Lucide React**

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Phase 1 Deliverables
- **Centralized Brand Design System**: Tailored around Silver Catering's visual identity (Deep Emerald Slate `#163324`, Warm Champagne Brass `#c29c5e`, soft slate surfaces, and Google Fonts `Outfit` + `Playfair Display`).
- **Reusable UI Suite**: Button, Badge, Card, Input, Select, Modal, Table, PageHeader, StatCard, EmptyState, LoadingState, ToastContext.
- **Responsive Layout**: Desktop Sidebar + Topbar with live event indicators, Mobile slide-over drawer + on-ground 5-tab quick bottom bar for active event service.
- **16 Operational Routes**:
  - Dashboard (`/`)
  - Events (`/events`)
  - Catering & Menu (`/catering-menu`)
  - Food Preparation (`/food-prep`)
  - Food Packing (`/food-packing`)
  - Food Distribution (`/food-distribution`)
  - Water Management (`/water-management`)
  - Arrangements (`/arrangements`)
  - Vendors (`/vendors`)
  - Staff (`/staff`)
  - Tasks (`/tasks`)
  - Pending (`/pending`)
  - Expenses (`/expenses` - Internal costs only)
  - Reports (`/reports`)
  - Printouts (`/printouts`)
  - Settings (`/settings`)
- **Operations Dashboard Preview**: Full operational metrics, today's live event showcase, expected guests, food prep, food packing, buffet delivery, water logs, and internal operational spend.

