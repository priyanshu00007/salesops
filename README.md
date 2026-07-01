<div align="center">

# ColdSync ⚡

### The Open Cold Calling Operations Platform

**Multi-tenant | Pipeline-Driven | Compliance-First | Connector-Ready**

[![Node](https://img.shields.io/badge/Node-20%2B-339933?logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Postgres](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://postgresql.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)](https://expressjs.com)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

[Features](#features) • [Architecture](#architecture) • [Quick Start](#quick-start) • [Project Structure](#project-structure) • [API Overview](#api-overview) • [Email System](#-email-system) • [Roles](#-role-hierarchy) • [Deployment](#deployment) • [Roadmap](#roadmap)

</div>

---

## Overview

**ColdSync** replaces the fragmented tool stack — separate CRM, dialer, spreadsheets, and compliance tools — that cold calling teams currently juggle. It provides a **unified platform** for the complete cold calling lifecycle:

```
Lead Import → Call Tracking → Pipeline Management → Close → Compliance → Analytics
```

Built as a **multi-tenant system**, ColdSync lets a single platform operator (Super Admin) manage multiple client companies, each with their own Company Admin and callers — all data fully isolated.

---

## Features

### Core Platform
| Feature | Description |
|---------|-------------|
| **Multi-Tenant Architecture** | Super Admin → Company Admin → Caller hierarchy with full data isolation |
| **Role-Based Access** | Four tiers: `super_admin`, `company_admin`, `manager`, `caller` |
| **Company Lifecycle** | Create, approve, suspend, restore, soft-delete companies |
| **User Management** | Invite, activate, suspend, lock/unlock, reset passwords, delete users |
| **Audit Trail** | Every action logged with user, timestamp, IP, and metadata |

### Sales Operations
| Feature | Description |
|---------|-------------|
| **Lead Management** | Create, import (CSV/Excel), search, filter, bulk assign, tag |
| **Call Tracking** | Log calls with disposition, duration, notes, recording URL |
| **Dispositions** | Configurable outcomes: No Answer, Voicemail, Qualified, Meeting Booked, Closed Won/Lost |
| **Pipeline / Kanban** | Drag-and-drop visual pipeline with custom stages |
| **Callback Scheduling** | Schedule and track follow-up calls per lead |
| **Spreadsheet-Style Editing** | Inline editable tables, column sort/filter, bulk cell edits |

### Compliance
| Feature | Description |
|---------|-------------|
| **DNC List Management** | Upload, search, auto-block against Do Not Call registry |
| **TCPA Opt-Out Tracking** | Verbal/SMS opt-out → cross-channel suppression |
| **10-Day SLA Enforcement** | Auto-track opt-out response deadlines |
| **Compliance Audit Trail** | All opt-outs timestamped and searchable |

### Connectors & Integrations
| Feature | Description |
|---------|-------------|
| **REST API** | All features accessible via scoped API keys |
| **Webhooks** | Real-time event dispatcher with HMAC signing & retry |
| **CSV/Excel Import/Export** | Column mapping, preview, background processing |
| **VoIP / Twilio Connector** | Click-to-dial and auto-call-logging |
| **External CRM Sync** | Salesforce, HubSpot bidirectional sync (roadmap) |

### Dashboards & Reporting
| Role | Dashboard |
|------|-----------|
| **Super Admin** | Platform-wide: total companies, users, calls, leads |
| **Company Admin** | Team leaderboard, daily stats, conversion funnel |
| **Caller** | Personal stats, daily targets, upcoming callbacks |

---

## Architecture

```
 ┌─────────────────────────────────────────────────────────────────────┐
 │                            CLIENTS                                  │
 │      ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐     │
 │      │  React Web   │  │  API Clients │  │ External Tools   │     │
 │      │  (Port 5173) │  │  (cURL, etc) │  │ (Zapier, Sheets) │     │
 │      └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘     │
 └─────────────┼─────────────────┼───────────────────┼────────────────┘
               │                 │                   │
               ▼                 ▼                   ▼
 ┌─────────────────────────────────────────────────────────────────────┐
 │                      EXPRESS API SERVER (Port 3000)                  │
 │                                                                      │
 │  ┌──────┐ ┌──────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐  │
 │  │Auth  │ │Users │ │Leads   │ │Calls   │ │Pipeline│ │Connectors│  │
 │  │Routes│ │Routes│ │Routes  │ │Routes  │ │Routes  │ │Routes    │  │
 │  └──┬───┘ └──┬───┘ └───┬────┘ └───┬────┘ └───┬────┘ └────┬─────┘  │
 │     │        │         │         │         │          │          │
 │  ┌──┴────────┴─────────┴─────────┴─────────┴──────────┴──────┐   │
 │  │              MIDDLEWARE PIPELINE                            │   │
 │  │  Helmet → CORS → Rate Limit → Auth (JWT) → Role Gate      │   │
 │  └─────────────────────────────────────────────────────────────┘   │
 │                                                                      │
 │  ┌─────────────────────────────────────────────────────────────┐   │
 │  │                LAYERED SERVICES                               │   │
 │  │  AuthService  │  UserService  │  LeadService  │ CallService  │   │
 │  │  PipelineSvc  │  DNCService   │  WebhookSvc   │ SyncService  │   │
 │  └─────────────────────────────────────────────────────────────┘   │
 └─────────────────────────────────────────────────────────────────────┘
               │
               ▼
 ┌─────────────────────────────────────────────────────────────────────┐
 │                    POSTGRESQL DATABASE (Port 5432)                   │
 │                                                                      │
 │  ┌─────────────────────────────────────────────────────────────┐   │
 │  │                         SCHEMA                                │   │
 │  │                                                               │   │
 │  │  companies ◄─ users ◄─ leads ◄─ calls ◄─ pipelines           │   │
 │  │       │          │        │        │         │               │   │
 │  │       │          │        │        │         │               │   │
 │  │       ├── departments   │        │         └── pipeline_items│   │
 │  │       ├── subscriptions │        │                           │   │
 │  │       ├── usage         │        └── dnc_entries             │   │
 │  │       └── domains       │                                    │   │
 │  │                         └── callbacks                        │   │
 │  │                                                               │   │
 │  │  ┌─── CONNECTORS ─────────────────────────────────────────┐  │   │
 │  │  │  api_keys │ webhooks │ integrations │ sync_logs        │  │   │
 │  │  └────────────────────────────────────────────────────────┘  │   │
 │  │                                                               │   │
 │  │  ┌─── COMPLIANCE ──────────────────────────────────────────┐  │   │
 │  │  │  activity_logs │ audit_logs │ security_events           │  │   │
 │  │  └────────────────────────────────────────────────────────┘  │   │
 │  └─────────────────────────────────────────────────────────────┘   │
 │                                                                      │
 │  Data Isolation: Row-Level Security via company_id on every table   │
 │  All queries include: WHERE company_id = $current_user_company_id   │
 └─────────────────────────────────────────────────────────────────────┘
               │
               ▼
 ┌─────────────────────────────────────────────────────────────────────┐
 │                      REACT FRONTEND                                 │
 │                                                                      │
 │  ┌──────────────────────────────────────────────────────────────┐   │
 │  │                     ROUTES (React Router v7)                  │   │
 │  │                                                               │   │
 │  │  /login  /register                                            │   │
 │  │                                                               │   │
 │  │  /admin/*  ─── Super Admin Portal                             │   │
 │  │  ├── dashboard                                                │   │
 │  │  ├── companies  ├── employees  ├── settings                   │   │
 │  │  ├── analytics  ├── logs       ├── api-keys                   │   │
 │  │  ├── billing    ├── backups    ├── subscriptions              │   │
 │  │  ├── background-jobs                                          │   │
 │  │  └── service-status                                           │   │
 │  │                                                               │   │
 │  │  /manager/* ─── Company Admin Portal                          │   │
 │  │  ├── dashboard  ├── organization  ├── employees               │   │
 │  │  ├── permissions  ├── leads  ├── clients                     │   │
 │  │  ├── calls  ├── calendar  ├── reports                        │   │
 │  │                                                               │   │
 │  │  /user/* ─── Cold Caller Portal                               │   │
 │  │  ├── dashboard  ├── leads  ├── calls                         │   │
 │  │  ├── activity  ├── tasks  ├── calendar                       │   │
 │  └──────────────────────────────────────────────────────────────┘   │
 └─────────────────────────────────────────────────────────────────────┘

 ┌─────────────────────────────────────────────────────────────────────┐
 │                       INFRASTRUCTURE                                │
 │                                                                      │
 │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────────┐│
 │  │  Docker    │  │  Nginx     │  │  Node.js   │  │  PostgreSQL    ││
 │  │  Compose   │  │  Reverse   │  │  Cluster   │  │  w/ RLS        ││
 │  │            │  │  Proxy     │  │  (PM2)     │  │                ││
 │  └────────────┘  └────────────┘  └────────────┘  └────────────────┘│
 └─────────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, React Router v7, TanStack Query, Tailwind CSS 4, Lucide React | UI, routing, server state, styling, icons |
| **Backend** | Node.js 20+, Express 4, Socket.IO, JWT, Zod | API server, real-time, auth, validation |
| **Database** | PostgreSQL 16 w/ Row-Level Security | Primary data store, multi-tenant isolation |
| **Infrastructure** | Docker Compose, Nginx | Dev/prod environment, reverse proxy |

---

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16 (or Docker)
- npm 10+

### 1. Clone & Install

```bash
git clone <repo-url>
cd sales2

# Backend dependencies
npm install

# Frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Environment

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=sales2
JWT_SECRET="your-256-bit-secret-here"
JWT_EXPIRES_IN="7d"
PORT=3000
```

### 3. Database

**Option A — Docker (recommended):**

```bash
docker compose up -d db
```

**Option B — Local PostgreSQL:**

```bash
# Create the database
createdb sales2

# Run init script
psql -d sales2 -f db/init.sql
```

### 4. Seed & Run

```bash
# Initialize schema + seed demo data
npm run setup
npm run seed

# Start backend (port 3000)
npm run dev

# In another terminal — start frontend (port 5173)
cd frontend && npm run dev
```

Open **http://localhost:5173** and log in with:

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | `admin@coldsync.io` | `password123` |
| **Company Admin** | `priya@realcorp.com` | `password123` |
| **Caller** | `amit@realcorp.com` | `password123` |

---

## Project Structure

```
sales2/
├── db/
│   └── init.sql                 # Full database schema (30+ tables)
├── docs/
│   ├── PRD.md                   # Product Requirements Document
│   ├── SRS.md                   # Software Requirements Specification
│   ├── SYSTEM_ARCHITECTURE.md    # Architecture & Design
│   ├── FLOWS.md                  # User Flows & Workflows
│   └── IMPLEMENTATION_PLAN.md    # Roadmap & Milestones
├── frontend/
│   ├── src/
│   │   ├── api/                  # Axios client setup
│   │   ├── components/           # Layout, Sidebar, Modal, Pagination, etc.
│   │   ├── context/              # AuthContext, SocketContext
│   │   ├── data/                 # Permissions config
│   │   ├── hooks/                # useApi custom hook
│   │   └── pages/
│   │       ├── admin/            # 11 Super Admin pages
│   │       ├── company/          # 9 Company Admin pages
│   │       └── employee/         # 6 Caller pages
│   ├── App.jsx                   # Route definitions
│   └── main.jsx                  # Entry point
├── src/
│   ├── index.js                  # Express server entry
│   ├── setup.js                  # DB schema setup
│   ├── seed.js                   # Demo data seeder
│   ├── check-db.js               # Health check
│   ├── lib/
│   │   ├── db.js                 # PostgreSQL pool
│   │   ├── jwt.js                # Token sign/verify
│   │   ├── socket.js             # Socket.IO init
│   │   └── schemas.js            # Zod validation schemas
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   └── role.js               # Role-based authorization
│   └── routes/
│       ├── auth.js               # Login, register, profile
│       ├── admin.js              # User management, reports
│       ├── companies.js          # Company CRUD + status
│       ├── leads.js              # Lead CRUD + import/export
│       ├── calls.js              # Call logging
│       ├── tasks.js              # Task management
│       ├── clients.js            # Client management
│       ├── invoices.js           # Invoice management
│       ├── dashboard.js          # Dashboard stats
│       ├── settings.js           # Platform settings
│       ├── analytics.js          # Analytics endpoints
│       ├── logs.js               # Activity logs
│       ├── admin-core.js         # Core admin features
│       └── admin-platform.js     # Platform admin features
├── docker-compose.yml            # Full stack orchestration
├── Dockerfile                    # Backend container
└── package.json
```

---

## API Overview

All API routes are prefixed with `/api`.

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in (returns JWT) |
| GET | `/api/auth/me` | Current user profile |

### Companies (Super Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/companies` | List companies (paginated, searchable) |
| POST | `/api/companies` | Create company |
| PATCH | `/api/companies/:id/status` | Update status (active/suspended/approved) |
| DELETE | `/api/companies/:id` | Soft-delete company |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List users (paginated, filterable) |
| POST | `/api/admin/users` | Create user |
| PATCH | `/api/admin/users/:id` | Update user |
| PATCH | `/api/admin/users/:id/role` | Change role |
| DELETE | `/api/admin/users/:id` | Delete user |

### Leads
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | List leads |
| POST | `/api/leads` | Create lead |
| PATCH | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead |

### Calls
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/calls` | List calls |
| POST | `/api/calls` | Log a call |
| PATCH | `/api/calls/:id` | Update call |
| DELETE | `/api/calls/:id` | Delete call |

> Full API documentation available in [docs/SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md#5-api-design).

---

## 📧 Email System

ColdSync includes a comprehensive email notification system for platform communications.

### Email Types

| Email | Trigger | Recipient | Salutation |
|-------|---------|-----------|------------|
| **Company Invitation** | Super Admin invites a company | Company Admin | `Dear {Company Name},` |
| **User Invitation** | Company Admin invites a caller | New User | `Dear {First Name},` |
| **Password Reset** | User requests reset | Requesting User | `Dear {First Name},` |
| **Account Locked** | Failed login attempts | Locked User | `Dear {First Name},` |
| **Account Activated** | Admin activates user | Activated User | `Dear {First Name},` |
| **Welcome Email** | First login | New User | `Welcome to ColdSync, {First Name}!` |

### Salutation Rules

```
If user.name exists         → "Dear {First Name},"
If company_name exists      → "Dear {Company Name},"
If neither                  → "Dear User,"
Fallback for formal         → "Dear Sir/Madam,"
Time-based greeting         → "Good Morning/Afternoon/Evening"
```

### Email Template System

Email templates are stored in a `email_templates` DB table and support:

```
Subject: Welcome to ColdSync, {{first_name}}!
Body:
  Hello {{first_name}},

  Your account has been created at {{company_name}}.
  Login: {{login_url}}
  Email: {{email}}

  Regards,
  The ColdSync Team
```

Templates can be customized per company via the Settings panel.

---

## 👤 Role Hierarchy

```
                    ┌─────────────────┐
                    │  SUPER ADMIN    │
                    │  (Platform Ops) │
                    └────────┬────────┘
                             │ Manages
                    ┌────────▼────────┐
                    │  COMPANY ADMIN  │
                    │  (Per Company)  │
                    └────────┬────────┘
                             │ Manages
                    ┌────────▼────────┐
                    │    MANAGER      │
                    │  (Team Lead)    │
                    └────────┬────────┘
                             │ Supervises
                    ┌────────▼────────┐
                    │    CALLER       │
                    │  (End User)    │
                    └─────────────────┘
```

| Role | Scope | Permissions |
|------|-------|-------------|
| **Super Admin** | Global | Full CRUD on all companies, all users, platform settings, billing |
| **Company Admin** | Their company | Manage team, leads, calls, pipeline, reports within their company |
| **Manager** | Their team | View team stats, assign leads, review calls, access reports |
| **Caller** | Self only | Log own calls, manage assigned leads, view own stats |

Permission enforcement is handled by middleware (`src/middleware/role.js`):

```js
// Example: Only Super Admin can access
authorize('admin')

// Example: Manager+ can access
authorizeMinRole('manager')

// Example: Any authenticated user
authenticate
```

---

## Deployment

### Docker (Full Stack)

```bash
docker compose up --build
```

This starts:
- **PostgreSQL** (port 5432) — database
- **Backend** (port 3000) — Express API
- **Frontend** (port 80) — Nginx-served React app

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `CORS_ORIGIN` to your production domain
- [ ] Enable PostgreSQL SSL (`PGSSLMODE=require`)
- [ ] Configure proper database backups
- [ ] Set up monitoring (Sentry, Grafana)
- [ ] Enable rate limiting for auth endpoints
- [ ] Set `NODE_ENV=production`

---

## Development Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start backend with hot-reload |
| `npm run setup` | Initialize database schema |
| `npm run seed` | Seed demo data |
| `npm run reset` | Drop all tables and reset |
| `npm run db:check` | Verify database connection |
| `cd frontend && npm run dev` | Start frontend dev server |
| `cd frontend && npm run build` | Build frontend for production |

---

## Roadmap

| Phase | Focus | Timeline |
|-------|-------|----------|
| **Phase 1** | Foundation — Multi-tenant isolation, company/user advanced actions, invitations | Week 1-2 |
| **Phase 2** | Core Sales — Pipeline kanban, call dispositions, CSV import/export, recording | Week 3-5 |
| **Phase 3** | Dashboards — Role-specific dashboards, leaderboards, exportable reports | Week 6 |
| **Phase 4** | Compliance — DNC scrubbing, TCPA opt-out, audit trail, 10-day SLA | Week 7 |
| **Phase 5** | Connectors — API keys, webhooks, Google Sheets, Twilio, Salesforce | Week 8-9 |
| **Phase 6** | Launch — Subscriptions, billing, usage enforcement, production hardening | Week 10 |
| **Post-Launch** | AI transcripts, conversation intelligence, power dialer, mobile app | Q3 |

---

## Documentation

| Document | Description |
|----------|-------------|
| [PRD.md](docs/PRD.md) | Product requirements, market analysis, personas, monetization |
| [SRS.md](docs/SRS.md) | Functional & non-functional requirements, 70+ specs |
| [SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md) | Architecture, DB schema, API design, security, deployment |
| [FLOWS.md](docs/FLOWS.md) | User workflows, pipeline state machine, compliance flows |
| [IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) | Phase-wise build plan, effort estimates, risk matrix |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <strong>ColdSync</strong> — One platform. One workflow. Every call counted.
</div>
