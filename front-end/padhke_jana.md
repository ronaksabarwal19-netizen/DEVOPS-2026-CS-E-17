# Digital Banking Dashboard — Project Explainer

> This file exists so I can explain my own project properly during the viva/demo. It maps
> what the professor asked for to what is actually in the code, not what I planned to build.

---

## 1. Project Title & Summary

**Ronak Bank — Digital Banking Dashboard**

This is a frontend-only React web app that simulates what a digital banking dashboard would
look like and feel like to use — checking balances, viewing transactions, sending money,
managing cards, and tracking an investment portfolio. It solves (in simulation) the problem
of "give a user one place to see and manage their money," the way apps like Google Pay, Paytm,
or a bank's own net-banking portal do. There is **no real bank, no real money movement, and no
real backend server** — everything a user sees and does is generated from mock data and stored
in the browser's `localStorage`, so the app behaves consistently for a single user on a single
browser without needing any infrastructure to run.

---

## 2. Requirement-by-Requirement Mapping

### a) Account dashboard
- **Where:** `src/pages/Dashboard.jsx`, using `src/components/dashboard/AccountCard.jsx`
- **How it works:** On mount, `useEffect` reads `accounts` and `transactions` out of
  `localStorage` via `getItem(KEYS.ACCOUNTS, [])` and `getItem(KEYS.TRANSACTIONS, [])`. Total
  balance is computed client-side with `accounts.reduce((sum, a) => sum + a.balance, 0)`. The
  first three accounts are rendered as `AccountCard` components showing masked account number,
  balance, and card network.
- **Implementation note:** Fully implemented, but "dashboard" here means one screen — it is not
  reading from any live account/banking API, it's reading from a JSON blob that was seeded into
  `localStorage` on first load.

### b) Transaction history
- **Where:** `src/components/dashboard/TransactionItem.jsx`, used on both `Dashboard.jsx`
  (last 7 transactions) and `Payments.jsx` (payment history)
- **How it works:** `Dashboard.jsx` shows the 7 most recent entries from the `transactions`
  array in localStorage. `Payments.jsx` filters that same array with
  `transactions.filter((t) => t.type === 'payment')` to show only transfers made through the
  app.
- **Implementation note — being honest here:** There is **no dedicated "all transactions" page**.
  The "View All" link on the Dashboard routes to `/payments`, but `/payments` only shows
  transactions with `type === 'payment'` — it does **not** show the full income/expense history
  from the seed data. So "transaction history" exists and works, but it's split across two pages
  and isn't a single complete, filterable ledger the way a real banking app would have.

### c) Fund transfer (simulation)
- **Where:** `src/pages/Payments.jsx`, `handleSend()`
- **How it works:** The "Send Money" form validates recipient + amount, checks
  `accounts[0].balance >= amount`, then does two writes to localStorage: it deducts the amount
  from the first account's balance (`KEYS.ACCOUNTS`) and prepends a new transaction object
  (`KEYS.TRANSACTIONS`) with `amount: -amount, type: 'payment'`. Both the on-screen balance and
  the transaction list update immediately via React state.
- **Implementation note:** This is a genuine simulation — real arithmetic happens and real state
  is persisted, but it always debits the **first account only** (`accounts[0]`), there's no
  option to pick which account to send from, and nothing ever reaches a real bank rail.

### d) Budget analysis
- **Where:** *Not implemented anywhere in this codebase.*
- **How it works:** N/A
- **Implementation note:** There is no budget-setting UI, no spending limits, no
  category-vs-budget comparison. This requirement from the assignment was **not built** in
  this version.

### e) Spending insights
- **Where:** `src/components/dashboard/SpendingChart.jsx` (Dashboard) and the "Explore AI
  Insights" button on `src/pages/Investments.jsx`
- **How it works:** `SpendingChart` renders a Recharts `LineChart` from a **hardcoded array**
  called `spendingWeekData` in `src/data/mockData.js` — it is not calculated from the actual
  `transactions` array, so spending on this chart does not reflect any real user activity in
  the app. Separately, on the Investments page, clicking "Explore AI Insights" just toggles a
  `useState` boolean that reveals one static paragraph of hardcoded text
  ("Your portfolio grew 8% this quarter...") — no calculation, no AI call, nothing dynamic.
- **Implementation note:** Both of these are visual placeholders for "insights," not a real
  spending-analysis feature. There is no categorization of transactions (e.g. food vs bills vs
  shopping) anywhere in the code.

### f) Notifications
- **Where:** Bell icon in `src/components/layout/Header.jsx`; toggle switches in
  `src/pages/Settings.jsx`
- **How it works:** The Header shows a bell icon with a hardcoded red badge that always says
  `3` — clicking it does nothing (`<button>` has no `onClick`). Settings has three toggle
  switches (email / SMS / push) that write a preferences object to `localStorage` under the
  `SETTINGS` key via `toggleNotif()` — but flipping these toggles doesn't actually trigger,
  schedule, or display any notification anywhere in the app.
- **Implementation note:** This is UI-only. There is no notification feed, no toast/alert
  system tied to events (like "money sent" triggering a notification), and the badge count
  never changes.

### g) Statement download
- **Where:** *Not implemented anywhere in this codebase.*
- **How it works:** N/A
- **Implementation note:** There is no PDF/CSV export, no "Download Statement" button, and no
  print view anywhere in the app. This requirement was **not built** in this version.

---

## 3. Tech Stack Explanation

| Tool | Why I used it |
|---|---|
| **React 18** | The assignment needed a proper component-based app, not static pages. React lets each page (Dashboard, Accounts, etc.) be its own file with its own state, and lets me reuse small pieces like `AccountCard` and `TransactionItem` across pages instead of copy-pasting HTML. |
| **Vite** | It's the fastest way to spin up a React project right now — instant dev server start, hot reload when I save a file, and a simple `npm run build` for production. Much less config headache than older tools like Create React App. |
| **Tailwind CSS** | Instead of writing separate `.css` files for every component and inventing class names, I just write utility classes directly in the JSX (`bg-card border border-border rounded-lg`). It made it easy to keep the dark theme colors consistent everywhere since I defined them once in `tailwind.config.js`. |
| **React Router DOM** | The app needs multiple pages (Dashboard, Accounts, Payments...) that feel like separate URLs (`/dashboard`, `/accounts`) without actually reloading the page. Router handles that, and it's also what lets `ProtectedRoute` block access to pages based on login state. |
| **Recharts** | I needed to draw the spending line chart and the portfolio performance chart. Recharts works directly with plain JS arrays of objects (which is exactly what my mock data already looks like), so I didn't have to reshape data to fit the chart library. |
| **Lucide React** | Just an icon pack (bell, wallet, card, etc.) so the UI doesn't look like plain text — a lot faster than finding/hosting my own SVGs. |
| **localStorage** | Since there's no backend for this project, localStorage is the simplest way to make data "stick" between page reloads inside one browser. It's built into every browser, needs zero setup, and is good enough to fake a database for a coursework demo. |

---

## 4. How Authentication Works

1. The app opens on `/` which renders `SignIn.jsx` — this is the only route that isn't gated.
2. The user types an ID and password. `handleSubmit` calls `login(id, password)` from
   `AuthContext.jsx`.
3. `login()` reads the `users` array out of localStorage and does a plain
   `users.find((u) => u.id === id && u.password === password)` — a direct string comparison,
   nothing encrypted or hashed.
4. If a match is found, a session object `{ id, name, email, loggedIn: true }` is written to
   `localStorage` under the key `bd_current_user`, and React state (`user`) is updated so the
   rest of the app re-renders as "logged in." The user is redirected to `/dashboard`.
5. If there's no match, `login()` returns `{ success: false, error: '...' }` and the SignIn page
   just shows that error text — nothing else happens.
6. `ProtectedRoute.jsx` wraps every page except Sign In and Sign Up. On every render, it checks
   `user?.loggedIn` from `AuthContext`. If that's falsy (not logged in, or the session was never
   set), it renders `<Navigate to="/" replace />`, bouncing the user straight back to the sign-in
   page. This is what stops someone from just typing `/dashboard` into the URL bar without
   logging in first.
7. Logging out (from the Header dropdown or the Settings page) calls `logout()`, which removes
   `bd_current_user` from localStorage and clears the React state, so the very next render of
   `ProtectedRoute` kicks the user back out.

**This is a simulated auth system** — passwords are stored and compared in plain text, there's
no server validating anything, no session tokens, no expiry, and anyone with basic browser dev
tools could read the "password" straight out of localStorage. That's fine for this project's
scope: the assignment is about building the dashboard UI/UX and demonstrating the concept of
protected routes, not about building production-grade security.

---

## 5. How Data Persistence Works

There is **no backend and no real database** anywhere in this project. Everything the app
"remembers" — accounts, balances, transactions, users, card freeze states, notification
preferences — lives in the browser's `localStorage`, scoped to whatever `localhost` (or ngrok
URL) the page is loaded from.

On first load, `main.jsx` calls `seedData()` from `src/utils/localStorage.js`:

```js
// only writes each key if it doesn't already exist,
// so a returning user's changes aren't overwritten
if (!localStorage.getItem(KEYS.ACCOUNTS)) setItem(KEYS.ACCOUNTS, mockAccounts);
```

Every page that needs data (Dashboard, Accounts, Payments, Cards, Investments) reads it back out
with a small `getItem(key, fallback)` helper, and any change (adding an account, sending money,
freezing a card, changing a password) is written straight back with `setItem(key, value)` — a
simple wrapper around `JSON.stringify` / `JSON.parse`.

**If the browser's storage is cleared** (clearing site data, using a private/incognito window,
or opening the app in a different browser), all of that state disappears, and the next page load
runs `seedData()` again — repopulating the original mock users, accounts, and transactions from
`src/data/mockData.js` as if it were a fresh install. Nothing is lost permanently because nothing
was "real" to begin with; it just resets to the starting demo state.

---

## 6. Folder Structure Walkthrough

```
banking-dashboard/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx          # desktop nav + mobile bottom nav
│   │   │   ├── Header.jsx           # search bar, notification bell, user dropdown/logout
│   │   │   ├── AppLayout.jsx        # wraps Sidebar + Header around every protected page
│   │   │   └── ProtectedRoute.jsx   # redirects to "/" if not logged in
│   │   ├── dashboard/
│   │   │   ├── AccountCard.jsx      # one account's masked number + balance
│   │   │   ├── TransactionItem.jsx  # one row in a transaction list (icon, name, date, amount)
│   │   │   ├── SpendingChart.jsx    # Recharts line chart of (hardcoded) weekly spending
│   │   │   └── QuickActions.jsx     # 4 buttons that open a placeholder modal, do nothing real
│   │   └── ui/
│   │       ├── Button.jsx           # shared button styles (primary/outline/ghost/danger)
│   │       ├── Input.jsx            # shared labeled text input
│   │       └── Modal.jsx            # shared popup/dialog wrapper
│   ├── pages/
│   │   ├── SignIn.jsx               # public login page
│   │   ├── SignUp.jsx               # public multi-step "connect bank" demo signup
│   │   ├── Dashboard.jsx            # balance, accounts, chart, quick actions, recent txns
│   │   ├── Accounts.jsx             # list of accounts + "Add Account" form
│   │   ├── Payments.jsx             # send-money form + payee list + payment history
│   │   ├── Cards.jsx                # card UI + freeze/unfreeze + request-card button
│   │   ├── Investments.jsx          # portfolio value, performance chart, holdings table
│   │   └── Settings.jsx             # change password, notification toggles, logout
│   ├── context/
│   │   └── AuthContext.jsx          # login/logout state, exposes useAuth()
│   ├── data/
│   │   └── mockData.js              # every seed value: users, accounts, transactions, etc.
│   ├── utils/
│   │   └── localStorage.js          # get/set/seed helpers around window.localStorage
│   ├── App.jsx                      # route definitions, wraps protected pages in AppLayout
│   ├── main.jsx                     # entry point — calls seedData() then renders <App/>
│   └── index.css                    # Tailwind entry point + a few base/scrollbar styles
├── index.html
├── vite.config.js                   # dev server config (host: true, allowedHosts: true for ngrok)
├── tailwind.config.js                # dark theme color tokens (bg, card, border, income, expense…)
├── postcss.config.js
├── package.json
├── README.md
└── ngrok-hosting.md                  # how the demo tunnel was set up
```

---

## 7. Page-by-Page Walkthrough

### Sign In (`/`)
- **Shows:** Ronak Bank logo, an ID field, a password field, a hint text ("Try: user1 /
  password123"), and a link to Sign Up.
- **User can:** type credentials and submit. On success they land on `/dashboard`; on failure
  they see an inline error.
- **Built from:** `Input`, `Button` (from `components/ui`), `useAuth()` for the actual login call.

### Sign Up (`/signup`)
- **Shows:** A 4-step wizard — pick a bank from a list (SBI/HDFC/ICICI/Axis/PNB), enter a demo
  6-digit OTP, fill in name/email/mobile/ID/password, then a success screen.
- **User can:** create a brand-new mock user, which is appended to the `users` array in
  localStorage. They still have to go back to Sign In and log in with it afterward — signing up
  does not automatically log them in.
- **Built from:** `Input`, `Button`. This page explicitly tells the user in a small banner that
  it's a demo and nothing is really connected to any bank.

### Dashboard (`/dashboard`)
- **Shows:** "Welcome, [Name]", total balance card (+2.1% today, hardcoded), up to 3 account
  cards, a weekly spending chart, 4 quick action buttons, and the 7 most recent transactions.
- **User can:** click a quick action to see a placeholder modal (nothing actually happens),
  click "View All" to jump to Payments.
- **Built from:** `AccountCard`, `TransactionItem`, `SpendingChart`, `QuickActions`.

### Accounts (`/accounts`)
- **Shows:** A grid of every account in localStorage (name, type, masked number, balance).
- **User can:** click "Add Account," fill in a form (name, type, starting balance, last 4
  digits), and it's genuinely added to the list and saved to localStorage.
- **Built from:** `Modal`, `Input`, `Button`.

### Payments (`/payments`)
- **Shows:** A "Send Money" form, a list of clickable recent payees, and a payment history list.
- **User can:** click a payee to prefill the recipient field, then submit an amount which
  actually deducts from `accounts[0]`'s balance and logs a new transaction (see section 2c).
- **Built from:** `Input`, `Button`, `TransactionItem`.

### Cards (`/cards`)
- **Shows:** Each account rendered as a styled card (masked number, cardholder name, network
  label).
- **User can:** toggle freeze/unfreeze per card (dims the card visually, saved to localStorage),
  and click "Request New Virtual Card" which shows a temporary toast message and does nothing
  else.
- **Built from:** plain divs styled with Tailwind, `Button`.

### Investments (`/investments`)
- **Shows:** Total portfolio value, a performance line chart with 1D/1W/1M/6M/1Y buttons, a
  holdings table (symbol, name, units, value, % change), and an "Explore AI Insights" button.
- **User can:** click a period button — only "1Y" actually changes the chart's data (it shows
  the full 12-month array vs. just the last 3 months for anything else); click "Explore AI
  Insights" to reveal one static paragraph of text.
- **Built from:** Recharts `LineChart`, `Button`.

### Settings (`/settings`)
- **Shows:** Change-password form, three notification toggles (email/SMS/push), a disabled
  "dark mode" toggle with an explanatory note, and a logout button.
- **User can:** actually change their password (validated and saved to the `users` array in
  localStorage), actually flip the notification toggles (saved, but not wired to any real
  notification behavior), and log out.
- **Built from:** `Input`, `Button`.

---

## 8. DevOps Tools Mentioned in the Assignment (Not Implemented — Explain Why & How They'd Fit)

The assignment listed GitHub Actions, Docker, Kubernetes, Prometheus, Grafana, Nginx, and AWS as
relevant tools for a "Digital Banking Dashboard" project. **None of these were implemented** in
this deliverable, and that's a deliberate scope decision, not an oversight: this project is a
**frontend-only academic simulation** with no real backend server, no database, and no
infrastructure to actually deploy, scale, or monitor. Here's honestly how each one *would* fit
in if this became a real, full-stack product:

- **GitHub Actions** — Would run a CI pipeline on every push/PR: install dependencies, run
  `npm run build` and any linter, and fail the check if the build breaks — catching mistakes
  before they reach `main`.
- **Docker** — Would package the app (and eventually a real backend) into a container so it runs
  identically on any machine — my laptop, a teammate's laptop, or a server — instead of relying
  on "it works on my machine."
- **Nginx** — In production, you don't serve a React app with `npm run dev` (that's a dev-only
  server). You'd run `npm run build` to produce static files, then have Nginx serve those files
  efficiently and act as a reverse proxy in front of a real backend API.
- **Kubernetes** — Only makes sense once there's a real backend + database to orchestrate. It
  would manage multiple containers (frontend, backend API, database), restart crashed ones,
  and scale up under load — overkill for a static frontend demo like this one.
- **Prometheus + Grafana** — Prometheus would collect metrics from a real backend server
  (response times, error rates, request counts); Grafana would turn those metrics into
  dashboards. There's no backend here to collect metrics from, so there's nothing for these
  tools to monitor yet.
- **AWS** — Would host the containerized app for real, permanent access — e.g. EC2 or ECS for a
  full backend + frontend deployment, or S3 + CloudFront if it stayed a static frontend like it
  is now. Instead, for this project, temporary public access was achieved with ngrok (see
  section 10).

---

## 9. How to Run This Project Locally

```bash
git clone <this-repo-url>
cd banking-dashboard
npm install
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`). Open it in a browser.

**Mock login credentials:**

| ID | Password |
|---|---|
| `user1` | `password123` |
| `user2` | `password123` |
| `user3` | `password123` |

(More can be added in `src/data/mockData.js` under `mockUsers`, or created live through the
`/signup` flow.)

---

## 10. How This Was Hosted for Demo (ngrok)

For the demo/viva, the app was **not deployed anywhere permanent** — there's no live production
URL. Instead:

1. The dev server was started locally with `npm run dev` (Vite, on `localhost:5173`).
2. A second terminal ran `ngrok http 5173`, which opened a temporary public HTTPS tunnel
   straight to that local dev server.
3. `vite.config.js` was configured with `server: { host: true, allowedHosts: true }` so Vite
   wouldn't reject requests coming in through ngrok's forwarding domain (Vite blocks unknown
   hosts by default for security).
4. The `https://xxxx.ngrok-free.app` URL ngrok printed was shared so the app could be viewed
   from outside my own machine, without setting up any real hosting.

This is a **temporary tunnel, not permanent hosting** — it only works while both the dev server
and the ngrok process are running on my machine, and free ngrok URLs change every time the
tunnel is restarted.

---

## 11. Limitations & What Would Change for a Real Production App

- **No real backend/database.** Everything lives in browser `localStorage`. A real version
  would need a backend (Node/Express, or similar) and a real database (PostgreSQL or MongoDB)
  so data is shared across devices and doesn't disappear if a user clears their browser.
- **No real authentication/security.** Passwords are stored and compared in plain text with no
  hashing, there are no session tokens (JWT or otherwise), and the whole app currently runs over
  plain HTTP on localhost. A real version needs hashed passwords, proper session/token-based
  auth, and HTTPS everywhere.
- **No real bank integration.** "Connect your bank account" in the Sign Up flow is entirely
  fake — it just picks a bank name from a list and accepts any 6-digit OTP. A real product would
  use a provider like Plaid (or, in India, an Account Aggregator framework) to actually link a
  user's real bank account with consent and verification.
- **Missing assignment features.** As covered honestly in section 2, Budget Analysis and
  Statement Download were not built at all, and Spending Insights / Notifications only exist as
  static or non-functional UI, not real working features.
- **Next steps for production (DevOps):** once there's a real backend and database, the tools
  from section 8 become relevant in roughly this order — Docker to containerize the app,
  GitHub Actions to automate build/test on every push, AWS (or another cloud) plus Nginx to
  actually host it permanently, and Kubernetes + Prometheus/Grafana once the app is complex or
  popular enough to need orchestration and monitoring at scale.
