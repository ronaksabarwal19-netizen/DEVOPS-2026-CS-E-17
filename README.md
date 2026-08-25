# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

<<<<<<< HEAD
If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
=======
```
src/
├── components/
│   ├── layout/        Sidebar, Header, AppLayout, ProtectedRoute
│   ├── dashboard/      Small dashboard pieces (AccountCard, TransactionItem, SpendingChart, QuickActions)
│   └── ui/              Reusable primitives (Button, Modal, Input)
├── pages/                One component per route (SignIn, Dashboard, Accounts, Payments, Cards, Investments, Settings)
├── context/
│   └── AuthContext.jsx   Login/logout state, exposes useAuth()
├── data/
│   └── mockData.js       Seed data for users, accounts, transactions, investments, payees
├── utils/
│   └── localStorage.js   get/set/seed helpers for the localStorage "database"
├── App.jsx               Route definitions
├── main.jsx               Entry point, seeds mock data on first load
└── index.css              Tailwind entry + base styles
```

## Setup Instructions

```bash
git clone <this-repo-url>
cd banking-dashboard
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

## Git and Jenkins Automation

Enable the shared Git hook once after cloning:

```bash
git config core.hooksPath .githooks
```

The pre-commit hook runs `npm run lint` and `npm run build`, so a commit is
created only after both checks pass. It does not create or push commits
automatically, which avoids committing unintended files or causing CI loops.

To run Jenkins for every pushed commit:

1. Create a Jenkins Pipeline or Multibranch Pipeline job using this repository
  and the `Jenkinsfile` in the repository root.
2. Install/configure the Node.js and GitHub Branch Source plugins, and make
  Node.js available to the agent running the job.
3. Configure the repository webhook to send push events to
  `https://<jenkins-host>/github-webhook/`.
4. Enable the GitHub push trigger on the Jenkins job and configure the
  repository credentials if it is private.

Each push then runs `npm ci`, linting, and the production Vite build. Successful
`dist/` files are retained as Jenkins build artifacts.

## Mock Login Credentials

| ID | Password |
|---|---|
| `user1` | `password123` |
| `user2` | `password123` |
| `user3` | `password123` |

More mock users can be added in `src/data/mockData.js` (`mockUsers` array).

## How Auth & Persistence Work

On first load, `main.jsx` calls `seedData()` (from `src/utils/localStorage.js`), which writes the
mock users, accounts, transactions, investments, and payees into `localStorage` **only if they
aren't already there** — so data survives refreshes but won't get overwritten on every load.

`AuthContext` checks/writes a `bd_current_user` key in localStorage. On successful sign-in, `{id,
name, email, loggedIn: true}` is stored there. `ProtectedRoute` reads this on every protected route
and redirects to `/` if the user isn't logged in. Logging out simply removes that key.

Because everything lives in `localStorage`, clearing site data or using a different browser resets
the app back to its seeded mock state.

## Pages

- **Sign In (`/`)** — the only public route. Validates against mock users.
- **Dashboard (`/dashboard`)** — total balance, account cards, weekly spending chart, quick action
  buttons (placeholder modals), and recent transactions.
- **Accounts (`/accounts`)** — lists all accounts; "Add Account" opens a form that appends a new
  account to localStorage and re-renders the list.
- **Payments (`/payments`)** — "Send Money" form deducts the amount from the first account's
  balance and logs a new transaction; recent payees prefill the recipient field; payment history
  table below shows past payments.
- **Cards (`/cards`)** — each account rendered as a card UI with a freeze/unfreeze toggle (dims the
  card when frozen) and a "Request New Virtual Card" button that shows a toast.
- **Investments (`/investments`)** — total portfolio value, a Recharts line chart with a 1D/1W/1M/6M/1Y
  period selector (only 1Y changes the data range), a holdings table, and a static "AI Insights" text block.
- **Settings (`/settings`)** — change password (validated against and updates the mock user in
  localStorage), notification toggles, a disabled dark-mode toggle (this app is dark-only), and logout.

## Responsive Design

The sidebar is fixed on desktop/tablet (`md:` breakpoint and up) and replaced by a bottom
navigation bar on mobile. Grids of cards collapse from 3 columns → 1 column on small screens, and
tables scroll horizontally on narrow viewports instead of breaking layout.

## Known Limitations

- No real backend or database — all data lives in `localStorage` and resets if it's cleared.
- No real authentication — credentials are hardcoded and password "hashing" doesn't exist.
- Money transfers, card requests, and quick actions are simulated, not real transactions.
- No pagination — all lists render in full.

## Possible Future Improvements

- Real backend (Node/Express or similar) with a proper database
- Real authentication (JWT, sessions, or an auth provider)
- Real bank/payment API integration (e.g. Plaid-style aggregation)
- Persisted multi-device sync instead of per-browser localStorage

## Running Locally with ngrok

See [`ngrok-hosting.md`](./ngrok-hosting.md) in the repo root for step-by-step hosting instructions.
>>>>>>> fad7a3b (Test Jenkins trigger)
