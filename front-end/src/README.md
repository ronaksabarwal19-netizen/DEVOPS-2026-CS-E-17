# src/ — Source Structure

This document describes the folder layout of the `front-end/src/` directory.

```
src/
├── main.jsx              # App entry point — mounts React, seeds localStorage
├── App.jsx               # Root component — BrowserRouter, routes, AuthProvider
├── index.css             # Global CSS / Tailwind base styles
│
├── assets/               # Static assets (images, SVGs)
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
│
├── components/           # Reusable UI components, grouped by concern
│   ├── dashboard/        # Dashboard-specific widgets
│   │   ├── AccountCard.jsx      # Single account card (balance, type)
│   │   ├── QuickActions.jsx     # Quick action buttons (transfer, pay, etc.)
│   │   ├── SpendingChart.jsx    # Monthly spending bar/line chart (Recharts)
│   │   └── TransactionItem.jsx  # Single transaction row
│   │
│   ├── layout/           # App chrome — wraps authenticated pages
│   │   ├── AppLayout.jsx        # Sidebar + Header + main content wrapper
│   │   ├── Header.jsx           # Top bar: search, notifications, user menu
│   │   ├── ProtectedRoute.jsx   # Auth guard — redirects unauthenticated users
│   │   └── Sidebar.jsx          # Desktop sidebar + mobile bottom nav
│   │
│   └── ui/               # Generic, design-system-level primitives
│       ├── Button.jsx           # Themed button component
│       ├── Input.jsx            # Labeled text input
│       └── Modal.jsx            # Dialog/modal overlay
│
├── context/              # React context providers
│   └── AuthContext.jsx   # Authentication state (login/logout/current user)
│
├── data/                 # Static/mock data
│   └── mockData.js       # Seed data: users, accounts, transactions, etc.
│
├── pages/                # Page-level components (one per route)
│   ├── SignIn.jsx         # /         — Login page
│   ├── SignUp.jsx         # /signup   — Multi-step account creation
│   ├── Dashboard.jsx      # /dashboard
│   ├── Accounts.jsx       # /accounts
│   ├── Payments.jsx       # /payments
│   ├── Cards.jsx          # /cards
│   ├── Investments.jsx    # /investments
│   └── Settings.jsx       # /settings
│
└── utils/                # Shared utility functions
    └── localStorage.js   # getItem / setItem / seedData helpers
```

## Conventions

- **Pages** import components; components do not import pages.
- **Context** is imported by pages and components that need auth state.
- **Utils** are pure helper functions with no React dependencies.
- All imports use relative paths from within `src/`.
