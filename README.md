# BrainBox Frontend

React + Vite UI for BrainBox: save YouTube videos, tweets, and notes, group them in folders, and share a folder or the whole dashboard.

Pair it with [Brainly-Backend](../Brainly-Backend).

## Stack

- React 18, TypeScript, Vite
- Tailwind CSS v4
- React Router
- TipTap (notes)
- Google Identity (`@react-oauth/google`)

## Local setup

Backend should already be running on `http://localhost:3000`.

```sh
cd Brainly-Frontend
npm install
cp .env.example .env
```

`.env`:

```
VITE_BACKEND_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

`VITE_*` values are inlined at **build** time. Changing them requires restarting Vite (dev) or redeploying (prod).

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production bundle → `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |

## Auth

The JWT from sign-in / Google is stored as `localStorage.token` and sent as header `token`. User profile is cached as `brainbox_user`.

Google Cloud Console → OAuth client → **Authorized JavaScript origins**:

- `http://localhost:5173`
- your Vercel URL (`https://your-app.vercel.app`)

The Google button requests `openid email profile` and posts `accessToken` to `POST /api/v1/auth/google`.

## Routes

| Path | Page |
| --- | --- |
| `/` | Sign in |
| `/signup` | Sign up |
| `/dashboard` | Home (all content). **Share BrainBox** copies a public link to everything |
| `/dashboard/notes` | Notes |
| `/dashboard/tweets` | Tweets |
| `/dashboard/youtube` | YouTube |
| `/dashboard/folders/:id` | One folder. **Share folder** copies a link to that folder only |
| `/share/:shareId` | Public shared brain or folder (read-only) |

## Folders

Each item belongs to one folder or none (still on Home). Create folders from the sidebar. Add content into a folder, or move a card with the folder dropdown. Deleting a folder unfiles items; it does not delete them.

## Deploy on Vercel

Deploy the **backend on Render first** so you have a public API URL.

1. New Vercel project from this repo.
2. **Root directory:** `Brainly-Frontend`
3. Framework: Vite (see `vercel.json`: SPA rewrites so `/dashboard` and `/share/:id` work).
4. Environment variables (set **before** the production build):

   - `VITE_BACKEND_URL` — Render URL, no trailing slash, e.g. `https://brainbox-xxxx.onrender.com`
   - `VITE_GOOGLE_CLIENT_ID` — same client id as the backend

5. Add the Vercel origin in Google Cloud Console.

Changing `VITE_*` later requires a **redeploy**. Preview deployments get their own URLs; add those origins in Google if you need Google sign-in on previews.

## Project layout

```
Brainly-Frontend/
├── public/                 # favicon / logo (brainbox.png)
├── src/
│   ├── components/         # shell, cards, TipTap editor, auth UI
│   ├── hooks/              # user, folders, content
│   ├── icons/
│   ├── lib/share.ts
│   ├── pages/
│   ├── App.tsx
│   └── config.ts           # reads VITE_BACKEND_URL and VITE_GOOGLE_CLIENT_ID
├── vercel.json
└── .env.example
```
