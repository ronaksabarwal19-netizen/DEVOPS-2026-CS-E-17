# Aurevia Bank Backend

A REST API backend for the supplied Aurevia Bank React/Vite coursework frontend. It uses **Node.js, Express, SQLite, JWT, and bcrypt**. Data is stored locally in a SQLite database file.

> **Important:** this is a coursework/demo backend, not a real banking system. Payments only update simulated database balances. There is no real bank, UPI, card processor, OTP delivery, market-data provider, KYC, or regulatory/security certification.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

1. Open a terminal in this `back-end` folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create your environment file:

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell, use `Copy-Item .env.example .env`.

4. Edit `.env` and set `JWT_SECRET` to a long random value (at least 24 characters).
5. Create demo users and accounts:

   ```bash
   npm run seed
   ```

6. Start the API:

   ```bash
   npm run dev
   ```

API runs at `http://localhost:4000`. Check `http://localhost:4000/api/health`.

## Demo login

- Username: `user1`
- Password: `password123`

Also seeded: `user2` and `user3`, each with password `password123`.

The seed command is safe to rerun for these starter rows. It does not reset existing account balances or user passwords.

## Connect the frontend

The repository's `front-end/` React/Vite application uses this API for registration and login. The frontend defaults to `http://localhost:4000/api`; set `VITE_API_URL` in a local frontend `.env` only when using a different API URL. The frontend stores the returned JWT in browser local storage and sends `Authorization: Bearer <token>` on protected API requests. Other dashboard data and actions remain simulated coursework features.

For local development the API allows `http://localhost:5173`. If your Vite app uses another origin, change `CLIENT_ORIGIN` in `.env`. Example request:

```js
const API_URL = 'http://localhost:4000/api';

export async function api(path, { token, ...options } = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Sign in:
const result = await api('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ username: 'user1', password: 'password123' }),
});
console.log(result.user, result.token);
```

Registration returns the same `{ user, token }` shape. Protected API routes require the token.

## API endpoints

All paths are relative to `http://localhost:4000/api`.

| Method | Endpoint | Auth | Purpose |
|---|---|---:|---|
| GET | `/health` | No | Health check |
| POST | `/auth/register` | No | Create demo user, initial accounts and payees |
| POST | `/auth/login` | No | Sign in and receive JWT |
| GET | `/auth/me` | Yes | Current user profile |
| PATCH | `/auth/password` | Yes | Change password |
| GET | `/accounts` | Yes | List current user's accounts |
| POST | `/accounts` | Yes | Create an account |
| GET | `/accounts/:id` | Yes | Read one owned account |
| GET | `/transactions` | Yes | List transactions (`?limit=100`, max 500) |
| GET | `/payments/payees` | Yes | List payees |
| POST | `/payments/send` | Yes | Record a simulated payment and deduct balance atomically |
| GET | `/cards` | Yes | List card/account display data and freeze state |
| PATCH | `/cards/:accountId/freeze` | Yes | Freeze/unfreeze a card |
| POST | `/cards/request` | Yes | Record a demo virtual-card request |
| GET | `/settings` | Yes | Read notification preferences |
| PUT | `/settings` | Yes | Update notification preferences |
| GET | `/investments` | Yes | Read static sample portfolio data |

### Example request bodies

**Register** (`POST /auth/register`)
```json
{
  "username": "newuser",
  "password": "secure-demo-password",
  "name": "Demo User",
  "email": "demo@example.com",
  "mobile": "+91 9876543210",
  "bankName": "State Bank of India"
}
```

**Create account** (`POST /accounts`)
```json
{
  "name": "My Savings",
  "type": "Savings",
  "balance": 1000,
  "lastDigits": "1234",
  "cardType": "Visa"
}
```

**Send simulated payment** (`POST /payments/send`)
```json
{
  "recipient": "Rahul Gupta",
  "amount": 250,
  "note": "Dinner"
}
```

**Freeze/unfreeze** (`PATCH /cards/:accountId/freeze`)
```json
{ "frozen": true }
```

**Notification settings** (`PUT /settings`)
```json
{ "email": true, "sms": false, "push": true }
```

## Notes and limitations

- Users' passwords are hashed with bcrypt. Never store plaintext passwords.
- JWTs expire after the configured period. The demo frontend will need to handle expired sessions.
- SQLite is suitable for local development/coursework; a production financial application requires professional security review, stronger operational controls, audit logging, monitoring, backups, and regulated payment/banking integrations.
- Investment holdings are sample static data and not live financial information.
- The signup frontend currently accepts any six-digit demo OTP without sending or verifying a real code. This backend does not implement real OTP delivery.
- Keep `.env` private and never commit real secrets.


When using the combined project ZIP, the frontend is in `../front-end`. Start it separately with `npm install` and `npm run dev`; the frontend's default API URL is `http://localhost:4000/api`.
