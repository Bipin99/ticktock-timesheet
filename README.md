# ticktock

A timesheet management web app — log in, browse weekly timesheets, open a week, and add / edit / delete task entries.

**Live demo:** https://ticktock-timesheet-kappa.vercel.app/dashboard

## Features

- Credential login with session cookie (`Remember me` supported)
- Dashboard table with date/status filters, status pills, and pagination
- Week detail view with progress bar, day groups, and task rows
- Add / edit entry modal with validation
- Create / Update / View actions based on timesheet status

## Quick start

**Requirements:** Node.js 18+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

| Variable | Purpose |
| --- | --- |
| `NEXTAUTH_URL` | App URL (`http://localhost:3000` locally) |
| `NEXTAUTH_SECRET` | Secret used to sign the session cookie |

For production (e.g. Vercel), set the same variables to your deployed URL and a strong secret.

### Demo account

- Email: `name@example.com`
- Password: `password123`

### Scripts

```bash
npm run dev    # development server
npm run lint   # ESLint
npm run test   # Vitest
npm run build  # production build
```

## Tech stack

| Library | Role |
| --- | --- |
| **Next.js** (App Router) | Framework, routing, API routes |
| **React** | UI |
| **TypeScript** | Typing |
| **Tailwind CSS** | Styling |
| **Inter** (`next/font`) | Typography |
| **next-auth** | Auth + httpOnly session cookie |
| **Zod** | Form validation |
| **lucide-react** | Icons |
| **clsx** / **tailwind-merge** | ClassName helpers |
| **Vitest** + **Testing Library** | Tests |

## Architecture notes

- UI talks only to internal `/api/*` routes; mock data stays server-side and is never imported in client components.
- Auth uses next-auth credentials; the session lives in an httpOnly cookie (not `localStorage`).
- **Remember me:** checked → 30 days; unchecked → 1 day.
- Timesheet status is derived from hours: `0` → MISSING, `< 40` → INCOMPLETE, `≥ 40` → COMPLETED.
- Entry hours use an integer stepper (1–24).
- Data is an in-memory mock store, so edits can reset after a server restart or serverless cold start.
- Layout is responsive; on small screens the login panel stacks and table rows become cards.

## License

Private / personal project.
