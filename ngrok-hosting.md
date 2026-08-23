# Running Locally with ngrok

This guide walks through exposing your local dev server to the internet with ngrok, so you can
share a live link to the app running on your machine.

## Step 1 — Start the dev server (Terminal 1)

```bash
cd banking-dashboard
npm install   # first time only
npm run dev
```

Note the local port Vite prints — it's usually:

```
Local:   http://localhost:5173/
```

## Step 2 — Start ngrok (Terminal 2)

In a second terminal, point ngrok at that same port:

```bash
ngrok http 5173
```

ngrok will print a forwarding URL that looks like:

```
Forwarding    https://<random-id>.ngrok-free.app -> http://localhost:5173
```

Copy the `https://...ngrok-free.app` URL — that's your shareable link.

## Step 3 — Allow ngrok's host in Vite

By default, Vite's dev server blocks requests coming from hosts it doesn't recognize (like your
ngrok URL), so you may see a "Blocked request" error in the browser. Fix this by editing
`vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true,
  },
})
```

## Step 4 — Restart the dev server

Any change to `vite.config.js` requires a restart to take effect:

```bash
# stop the dev server (Ctrl+C in Terminal 1), then:
npm run dev
```

Now the ngrok URL should load the app correctly.

## Notes

- Free ngrok URLs change every time you restart ngrok — you'll need to re-share the new link.
- Since this app uses `localStorage` only, data won't sync between your machine and anyone else
  viewing the ngrok URL — each browser session has its own local data.
