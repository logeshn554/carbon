# 🌿 EcoGuide AI — Carbon Footprint Awareness Platform

> A production-ready full-stack web application helping users measure, understand, and reduce their carbon footprint through AI-powered recommendations, impact simulations, and progress tracking.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-purple)](https://prisma.io)

---

## 📋 Project Overview

EcoGuide AI empowers individuals to take meaningful climate action by:

- 🧮 **Calculating** annual CO₂ emissions using real IPCC/EPA emission factors
- 🤖 **Generating** personalized, priority-sorted recommendations with decision-tree AI logic
- 🔬 **Simulating** future scenarios (EV switch, solar panels, diet change) with projected savings
- 📊 **Tracking** progress over time with visual trend charts and score comparisons
- 🏆 **Scoring** sustainability 0–100 against Paris Agreement targets

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧮 Calculator | 4-section form: Transport, Energy, Food, Shopping |
| 🤖 AI Recommendations | Decision-tree engine with HIGH/MEDIUM/LOW priorities |
| 🔬 Impact Simulator | 8 preset scenarios + custom parameter support |
| 🏆 Sustainability Score | 0–100 scale against Paris Agreement 2050 target |
| 📊 Dashboard | Pie charts, trend lines, score gauge (Recharts) |
| 📈 Progress Tracking | Historical assessments with comparison metrics |
| 🔒 Security | Helmet, CORS, rate limiting, Zod validation, Prisma ORM |
| ♿ Accessibility | WCAG 2.1 AA, ARIA labels, keyboard navigation, focus management |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                  │
│  Pages: Home, Calculator, Dashboard, Simulator, History  │
│  Charts: Recharts (Pie, Line)  │  State: Hooks + Context │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP (Axios, /api proxy)
┌────────────────────▼────────────────────────────────────┐
│                  Express.js Backend API                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Carbon Calc │  │ Recommend.   │  │ Simulation   │   │
│  │  Service     │  │ Engine       │  │ Service      │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│  Security: Helmet │ CORS │ Rate Limit │ Zod Validation   │
└────────────────────┬────────────────────────────────────┘
                     │ Prisma ORM
┌────────────────────▼────────────────────────────────────┐
│                  PostgreSQL Database                      │
│   users │ assessments │ recommendations │ simulations    │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Design

```
users
  id (cuid)  name  email (unique)  createdAt  updatedAt

assessments
  id  userId → users.id
  dailyCarKm  carFuelType  publicTransportKmPerWeek  cyclingKmPerWeek
  shortFlightsPerYear  longFlightsPerYear
  monthlyElectricityKwh  renewablePercentage
  dietType  clothingItemsPerYear  electronicsItemsPerYear
  transportEmission  energyEmission  foodEmission  shoppingEmission
  totalEmission  sustainabilityScore  createdAt

recommendations
  id  assessmentId → assessments.id
  title  description  estimatedSavings  priority  category  createdAt

simulations
  id  assessmentId → assessments.id
  scenarioName  scenarioParams (JSON)
  originalEmission  projectedEmission  reductionPercentage  annualSavingsKg
  createdAt
```

---

## 🔌 API Documentation

### Users
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/users` | Create or find user by email (upsert) |
| GET | `/api/users/:id` | Get user by ID |

### Assessments
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/assessments` | Create assessment (calculates emissions + generates recommendations) |
| GET | `/api/assessments/:id` | Get assessment with recommendations & simulations |
| GET | `/api/assessments/user/:userId` | Get all assessments for a user |

### Recommendations
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/recommendations/:assessmentId` | Get recommendations for assessment |

### Simulations
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/simulations` | Run a scenario simulation |
| GET | `/api/simulations/:id` | Get simulation result |

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** 18+
- **Docker Desktop** (for PostgreSQL) — OR a local PostgreSQL 15+ instance

### 1. Clone and Setup

```bash
git clone <repository-url>
cd carbon
```

### 2. Start PostgreSQL (Docker)

```bash
# Start the database and pgAdmin
docker-compose up -d

# Verify it's running
docker-compose ps
```

pgAdmin is available at `http://localhost:5050`  
(Email: `admin@ecoguide.ai`, Password: `admin123`)

### 3. Backend Setup

```bash
cd backend

# Copy environment variables
copy .env.example .env

# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed sample data (optional)
npm run db:seed

# Start development server
npm run dev
```

Backend runs at `http://localhost:3001`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL="postgresql://ecoguide:ecoguide_secret@localhost:5432/ecoguide_db?schema=public"
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Docker (`.env` at root, optional)

```env
DB_USER=ecoguide
DB_PASSWORD=ecoguide_secret
DB_NAME=ecoguide_db
DB_PORT=5432
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests (unit + integration)
npm test

# Run with coverage report
npm run test:coverage

# Watch mode
npm run test:watch
```

**Unit Tests** (`src/tests/unit/`):
- `carbonCalculator.test.js` — 20+ tests for emission calculations
- `scoringService.test.js` — Scoring logic & label accuracy
- `recommendationEngine.test.js` — Decision-tree recommendation logic

**Integration Tests** (`src/tests/integration/`):
- `assessments.test.js` — Full assessment CRUD cycle
- `recommendations.test.js` — Recommendation retrieval
- `simulations.test.js` — Scenario simulation accuracy

> ⚠️ Integration tests require a running PostgreSQL instance. Start Docker before running them.

---

## 📁 Project Structure

```
carbon/
├── docker-compose.yml
├── .env.example
├── README.md
│
├── backend/
│   ├── package.json
│   ├── vitest.config.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── src/
│       ├── index.js          # Server entry point
│       ├── app.js            # Express app
│       ├── controllers/      # Route handlers
│       ├── routes/           # Express routers
│       ├── services/         # Business logic
│       │   ├── carbonCalculator.js
│       │   ├── recommendationEngine.js
│       │   ├── simulationService.js
│       │   └── scoringService.js
│       ├── middleware/       # Validation, errors, rate limiting
│       └── tests/
│           ├── unit/
│           └── integration/
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── pages/            # Route-level components
        ├── components/
        │   ├── ui/           # Reusable UI primitives
        │   ├── layout/       # Navbar, Footer, Modal
        │   ├── calculator/   # Form sections
        │   ├── dashboard/    # Charts & cards
        │   └── simulator/    # Scenario UI
        ├── hooks/            # Custom React hooks
        ├── services/         # API service layer
        └── utils/            # Formatters & constants
```

---

## 🌍 Emission Factors

All calculations use peer-reviewed emission factors:

| Source | Factor | Reference |
|--------|--------|-----------|
| Petrol car | 0.21 kg CO₂/km | UK BEIS 2023 |
| Diesel car | 0.17 kg CO₂/km | UK BEIS 2023 |
| Electric car | 0.047 kg CO₂/km | UK grid mix 2023 |
| Grid electricity | 0.233 kg CO₂/kWh | UK BEIS 2023 |
| Short-haul flight | 255 kg CO₂/return | IPCC AR6 |
| Long-haul flight | 1,620 kg CO₂/return | IPCC AR6 |
| Vegan diet | 1,500 kg CO₂/year | Poore & Nemecek 2018 |
| Mixed diet | 2,500 kg CO₂/year | Poore & Nemecek 2018 |

---

## 🔒 Security

- **Helmet.js** — Security headers (CSP, HSTS, etc.)
- **CORS** — Configurable allowed origins
- **express-rate-limit** — 100 req/15min API-wide, 20/hr for user creation
- **Zod** — Input validation with detailed error messages
- **Prisma ORM** — Parameterized queries, SQL injection protection
- **Environment variables** — No credentials in source code

---

## ♿ Accessibility (WCAG 2.1 AA)

- Semantic HTML5 (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- ARIA labels, roles, and `aria-describedby` on all interactive elements
- Focus trap in Modal dialogs
- `aria-live` regions for dynamic content
- Screen-reader-only descriptions for charts
- Keyboard navigation throughout
- Color contrast ≥ 4.5:1 for all text
- `prefers-reduced-motion` compatible animations

---

## 🔮 Assumptions

1. **No password authentication** — Users are identified by email (upsert pattern) for simplicity
2. **UK/EU emission factors** — Grid electricity uses UK BEIS 2023 average (0.233 kg CO₂/kWh)
3. **Return flights** — Flight emissions calculated as return journeys
4. **Single household** — Energy calculations assume single person or proportional share

---

## 🚀 Future Enhancements

- [ ] Full JWT authentication with refresh tokens
- [ ] Carbon offset marketplace integration
- [ ] Community leaderboard and challenges
- [ ] Mobile app (React Native)
- [ ] AI chatbot (GPT-4) for conversational recommendations
- [ ] Corporate team assessments and reporting
- [ ] Integration with smart home energy monitors
- [ ] Country-specific emission factors

---

## 📄 License

MIT License — Free to use, modify, and distribute.
#   c a r b o n  
 #   c a r b o n  
 