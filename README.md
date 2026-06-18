# EcoGuide AI — Carbon Footprint Awareness Platform

> Measure, understand, and reduce your carbon footprint with AI-powered analysis, personalized recommendations, and what-if simulations.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)](https://nodejs.org/)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen)](#testing)

---

## Features

| Feature | Description |
|---|---|
| 🧮 Carbon Calculator | 4-step form covering transport, energy, food & shopping |
| 🤖 AI Recommendations | Personalised, prioritised reduction actions |
| 🎛️ What-If Simulator | Project emissions impact of behaviour changes |
| 📊 Progress Tracking | View history and trend over multiple assessments |
| 🔒 Privacy-First | Anonymous UUIDs only — no PII collected or stored |
| ♿ Accessible | WCAG 2.1 AA — skip link, ARIA, keyboard navigation |

---

## Architecture

```
┌─────────────────────────────────┐     HTTPS      ┌───────────────────────────────┐
│        Vercel (Frontend)        │ ─────────────► │     Railway (Backend API)     │
│   React 18 + Vite + Tailwind    │                 │    Express 4 + Helmet + Zod   │
└─────────────────────────────────┘                 └──────────────┬────────────────┘
                                                                   │ Prisma ORM
                                                                   ▼
                                                    ┌───────────────────────────────┐
                                                    │      Neon (PostgreSQL)        │
                                                    │   Users · Assessments · Recs  │
                                                    └───────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS 3, Recharts |
| Routing | React Router v6 (lazy-loaded pages) |
| Backend | Node.js 18+, Express 4, Helmet, Zod |
| ORM | Prisma 5 |
| Database | PostgreSQL 15 (Neon serverless) |
| Testing | Vitest, Testing Library |
| Deployment | Vercel (frontend) · Railway (backend) |

---

## Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9
- A **PostgreSQL** database (e.g. [Neon](https://neon.tech) — free tier works)

---

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/logeshn554/carbon.git
cd carbon

# 2. Install backend dependencies
cd backend
npm install
cp .env.example .env      # fill in DATABASE_URL

# 3. Run database migrations
npx prisma migrate deploy

# 4. Install frontend dependencies
cd ../frontend
npm install
cp .env.example .env      # fill in VITE_API_URL

# 5. Start development servers (two terminals)
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (pooler URL for Neon) |
| `PORT` | ❌ | Server port (default: 3001) |
| `NODE_ENV` | ❌ | `development` / `production` / `test` |
| `CORS_ORIGIN` | ❌ | Comma-separated allowed origins |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ✅ | Full backend API base URL including `/api` |

---

## Testing

```bash
# Backend tests
cd backend
npm test                  # run all unit tests
npm run test:coverage     # with coverage report

# Frontend tests
cd frontend
npm test                  # run all unit tests
npm run test:coverage     # with coverage report
```

Test suites include:
- **Carbon Calculator** — emission factors, edge cases, unknown inputs
- **Scoring Service** — boundary values at each threshold (2000/3000/5000/7500/12000 kg)
- **Recommendation Engine** — rule coverage for all categories
- **Sanitize utility** — HTML stripping, range clamping, NaN handling
- **Debounce utility** — timing, coalescing, argument passing
- **Calculation Cache** — hit/miss, key stability, eviction

---

## Security

| Measure | Implementation |
|---|---|
| Security headers | Helmet.js — CSP, HSTS, X-Frame-Options, noSniff |
| Rate limiting | `express-rate-limit` — 100 req/15 min on all `/api/` routes |
| Input validation | Zod schemas on every endpoint |
| Input sanitization | Frontend `sanitize.js` — strips HTML, clamps numeric ranges |
| Body size limit | 100 kb maximum request body |
| CORS | Allowlist-based — localhost + `*.vercel.app` |

---

## Accessibility

- **WCAG 2.1 AA** compliant
- Skip-to-main-content link on every page
- All form inputs have explicit `<label htmlFor>` associations
- Diet selection uses `role="radiogroup"` with keyboard (Enter / Space)
- `aria-live="polite"` on dynamic result areas
- `aria-current="step"` on active step indicator

---

## Privacy

> EcoGuide AI does **not** collect personal data. All calculations use anonymous session IDs stored only in your browser's `localStorage`. No names, emails, or identifying information are required or retained.

All data is stored as anonymous UUIDs. Users can clear their data at any time by clearing browser storage.

---

## Deployment

### Vercel (Frontend)
1. Import the GitHub repo
2. Set **Root Directory** to `frontend`
3. Add environment variable: `VITE_API_URL = https://your-backend.railway.app/api`

### Railway (Backend)
1. Create a new service from the GitHub repo
2. Set **Root Directory** to `backend`
3. Add environment variables: `DATABASE_URL`, `NODE_ENV=production`, `CORS_ORIGIN=https://your-app.vercel.app`
4. Railway auto-detects `npm start` which runs `prisma migrate deploy && node src/index.js`

---

## Folder Structure

```
carbon/
├── backend/
│   ├── prisma/          # Schema + migrations
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/  # Error handler, rate limiter
│   │   ├── routes/      # Express routers
│   │   ├── services/    # Business logic (calculator, scorer, recommender)
│   │   ├── tests/       # Vitest unit + integration tests
│   │   └── utils/       # Prisma client, logger
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/  # UI + calculator + layout + dashboard
│   │   ├── hooks/       # useUser, useAssessment
│   │   ├── pages/       # Route-level page components (lazy loaded)
│   │   ├── services/    # API client (axios)
│   │   ├── tests/       # Vitest unit tests
│   │   └── utils/       # constants, formatters, sanitize, debounce, cache, logger
│   └── .env.example
├── .editorconfig
├── LICENSE
└── vercel.json
```

---

## License

[MIT](./LICENSE) © 2024 EcoGuide AI