# System Architecture — ColdSync

## Multi-Tenant Cold Calling Operations Platform

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Clients                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Web App  │  │ Mobile   │  │ API      │  │ 3rd-Party│   │
│  │ (React)  │  │ (Future) │  │ Clients  │  │ Apps     │   │
│  └────┬─────┘  └──────────┘  └────┬─────┘  └────┬─────┘   │
└───────┼────────────────────────────┼──────────────┼─────────┘
        │                            │              │
┌───────┼────────────────────────────┼──────────────┼─────────┐
│       │         CDN / Load Balancer (Nginx/CloudFlare)      │
│       └────────────────────────────┼──────────────┘         │
│                                    │                        │
│  ┌─────────────────────────────────┼────────────────────┐   │
│  │          API Gateway (Express)   │                   │   │
│  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──┴────┐ ┌──────┐    │   │
│  │  │Auth  │ │Users │ │Leads │ │Calls  │ │Pipeline│   │   │
│  │  │Route │ │Route │ │Route │ │Route  │ │Route  │   │   │
│  │  └──┬───┘ └──┬───┘ └──┬───┘ └──┬────┘ └──┬───┘    │   │
│  │  ┌──┴───┐ ┌──┴───┐ ┌──┴───┐ ┌──┴────┐ ┌──┴────┐   │   │
│  │  │Auth  │ │User  │ │Lead  │ │Call   │ │Pipeline│   │   │
│  │  │Service│ │Service│ │Service│ │Service│ │Service │   │   │
│  │  └──┬───┘ └──┬───┘ └──┬───┘ └──┬────┘ └──┬───┘    │   │
│  └─────┼────────┼────────┼────────┼──────────┼─────────┘   │
└────────┼────────┼────────┼────────┼──────────┼──────────────┘
         │        │        │        │          │
┌────────┼────────┼────────┼────────┼──────────┼──────────────┐
│  ┌─────┴────────┴────────┴────────┴──────────┴────────┐    │
│  │              PostgreSQL Database                     │   │
│  │  ┌──────────────────────────────────────────────┐    │   │
│  │  │  companies → users → leads → calls → pipeline …│   │
│  │  │  All tables scoped by company_id              │    │   │
│  │  └──────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │   Redis Cache    │  │  Bull Queue      │                │
│  │  (sessions,      │  │ (async jobs:     │                │
│  │   rate limits)   │  │  import, export, │                │
│  └──────────────────┘  │  webhooks)       │                │
│                        └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### Backend

| Component | Technology | Purpose |
|-----------|------------|---------|
| Runtime | Node.js 20+ | Server-side JS |
| Framework | Express 4.x | HTTP routing, middleware |
| Database | PostgreSQL 16 | Primary data store |
| ORM/Query | Raw SQL (pg) | Performance, control |
| Auth | JWT (jsonwebtoken) | Stateless auth |
| Validation | Zod | Request/response validation |
| Caching | Redis (via ioredis) | Sessions, rate limits, cache |
| Queue | Bull | Async job processing |
| Real-time | Socket.IO | Live updates, notifications |
| Rate Limiting | express-rate-limit | DDoS protection |
| Security | Helmet, CORS | HTTP headers, cross-origin |

### Frontend

| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | React 19 | UI components |
| Routing | React Router v7 | Client-side routing |
| State/Server | TanStack Query | Server state, caching |
| HTTP | Axios | API client |
| Styling | Tailwind CSS 4 | Utility-first styling |
| Icons | Lucide React | Icon library |
| Notifications | react-hot-toast | Toast notifications |
| Real-time | Socket.IO Client | Live updates |
| Charts | Recharts | Dashboard charts |
| Build | Vite 8 | Dev server, bundling |

### DevOps

| Component | Technology |
|-----------|------------|
| Container | Docker + Docker Compose |
| Reverse Proxy | Nginx |
| CI/CD | GitHub Actions |
| Monitoring | Sentry (errors), Grafana (metrics) |
| Backup | pg_dump (cron) |

---

## 3. Multi-Tenant Data Isolation Model

```
Strategy: Row-Level Isolation via company_id

Each table includes a company_id UUID column.
All queries include WHERE company_id = $current_company.

Key tables with company_id:
  users, leads, calls, pipelines, pipeline_items,
  dnc_entries, callbacks, api_keys, webhooks,
  integrations, sheets_imports

Tables without company_id (Super Admin only):
  companies (is itself the tenant)
  subscription_plans
  security_events (global)
  background_jobs
  platform_settings
  audit_logs (contains company_id for scoping)

Enforcement:
  1. Auth middleware attaches req.user.company_id
  2. Service layer always passes company_id to queries
  3. Row-Level Security (RLS) via PostgreSQL policies as defense-in-depth
```

### RLS Policy Example

```sql
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY lead_isolation ON leads
  USING (company_id = current_setting('app.current_company_id')::UUID);
```

---

## 4. Database Schema Design

### Core Tables

```
companies
├── id UUID PK
├── name VARCHAR(255)
├── status VARCHAR(50)        -- active, suspended, deleted
├── plan VARCHAR(100)         -- starter, growth, pro, enterprise
├── domain VARCHAR(255)
├── settings JSONB
├── employees_count INT
├── revenue VARCHAR(100)
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ

users
├── id UUID PK
├── company_id UUID FK → companies
├── name VARCHAR(255)
├── email VARCHAR(255) UNIQUE
├── password VARCHAR(255)    -- bcrypt hash
├── role VARCHAR(50)         -- super_admin, company_admin, manager, caller
├── status VARCHAR(50)       -- active, suspended, locked
├── phone VARCHAR(50)
├── avatar VARCHAR(500)
├── last_login TIMESTAMPTZ
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ

leads
├── id UUID PK
├── company_id UUID FK → companies
├── name VARCHAR(255)
├── phone VARCHAR(50)
├── email VARCHAR(255)
├── company VARCHAR(255)
├── source VARCHAR(100)      -- import, manual, api, sheet
├── status VARCHAR(50)       -- active, converted, disqualified, dnc
├── stage VARCHAR(100)       -- new, contacted, qualified, proposal, negotiation, closed_won, closed_lost
├── deal_value DECIMAL(10,2)
├── assigned_to UUID FK → users
├── created_by UUID FK → users
├── tags JSONB
├── custom_fields JSONB
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ

calls
├── id UUID PK
├── company_id UUID FK → companies
├── lead_id UUID FK → leads
├── user_id UUID FK → users
├── direction VARCHAR(20)    -- inbound, outbound
├── type VARCHAR(50)         -- cold, follow_up, callback, warm
├── duration_seconds INT
├── disposition VARCHAR(100) -- no_answer, busy, voicemail_left, not_interested, callback, qualified, meeting_booked, closed
├── result VARCHAR(100)
├── notes TEXT
├── recording_url VARCHAR(500)
├── transcript_url VARCHAR(500)
├── call_date DATE
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ

pipelines
├── id UUID PK
├── company_id UUID FK → companies
├── name VARCHAR(255)
├── stages JSONB             -- [{key, label, order, color}]
├── is_default BOOLEAN
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ

pipeline_items
├── id UUID PK
├── company_id UUID FK → companies
├── pipeline_id UUID FK → pipelines
├── lead_id UUID FK → leads
├── stage VARCHAR(100)
├── entered_at TIMESTAMPTZ
├── exited_at TIMESTAMPTZ
└── created_at TIMESTAMPTZ

dnc_entries
├── id UUID PK
├── company_id UUID FK → companies
├── phone VARCHAR(50)
├── email VARCHAR(255)
├── source VARCHAR(100)      -- sms_stop, verbal, uploaded
├── notes TEXT
├── opted_out_at TIMESTAMPTZ
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ

callbacks
├── id UUID PK
├── company_id UUID FK → companies
├── lead_id UUID FK → leads
├── user_id UUID FK → users
├── scheduled_at TIMESTAMPTZ
├── notes TEXT
├── status VARCHAR(50)       -- pending, completed, missed
├── completed_at TIMESTAMPTZ
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ
```

### Connectors & Integrations Tables

```
api_keys
├── id UUID PK
├── company_id UUID FK → companies
├── name VARCHAR(255)
├── key_hash VARCHAR(255)    -- SHA-256 of the key
├── permissions JSONB        -- ["read", "write:leads", "write:calls"]
├── last_used TIMESTAMPTZ
├── expires_at TIMESTAMPTZ
├── is_active BOOLEAN
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ

webhooks
├── id UUID PK
├── company_id UUID FK → companies
├── name VARCHAR(255)
├── url VARCHAR(500)
├── events JSONB             -- ["call.created", "lead.updated", …]
├── secret VARCHAR(255)
├── is_active BOOLEAN
├── last_triggered_at TIMESTAMPTZ
├── failure_count INT
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ

integrations
├── id UUID PK
├── company_id UUID FK → companies
├── provider VARCHAR(100)    -- twilio, salesforce, hubspot, google_sheets
├── config JSONB
├── is_enabled BOOLEAN
├── last_sync_at TIMESTAMPTZ
├── created_at TIMESTAMPTZ
└── updated_at TIMESTAMPTZ
```

---

## 5. API Design

### Base URL: `/api/v1`

### Authentication Endpoints
```
POST   /auth/login                  → { token, user }
POST   /auth/register               → { user }
POST   /auth/refresh                → { token }
POST   /auth/forgot-password        → { message }
POST   /auth/reset-password         → { message }
GET    /auth/me                     → { user }
```

### Company Endpoints (Super Admin)
```
GET    /admin/companies             → { companies[], total, page }
POST   /admin/companies             → { company }
GET    /admin/companies/:id         → { company }
PATCH  /admin/companies/:id         → { company }
PATCH  /admin/companies/:id/status  → { company }  -- activate/suspend/approve
DELETE /admin/companies/:id         → { message }   -- soft delete
POST   /admin/companies/:id/restore → { company }
POST   /admin/companies/invite     → { invitation }
```

### User Endpoints (Company Admin)
```
GET    /users                       → { users[], total, page }
POST   /users                       → { user }
GET    /users/:id                   → { user }
PATCH  /users/:id                   → { user }
DELETE /users/:id                   → { message }
PATCH  /users/:id/status            → { user }  -- active/suspended/locked
POST   /users/:id/reset-password    → { message }
POST   /users/:id/unlock            → { user }
POST   /users/invite                → { invitation }
```

### Lead Endpoints
```
GET    /leads                       → { leads[], total, page }
POST   /leads                       → { lead }
GET    /leads/:id                   → { lead }
PATCH  /leads/:id                   → { lead }
DELETE /leads/:id                   → { message }
POST   /leads/import                → { job_id }
POST   /leads/export                → { download_url }
POST   /leads/bulk                  → { affected }
```

### Call Endpoints
```
GET    /calls                       → { calls[], total }
POST   /calls                       → { call }
GET    /calls/:id                   → { call }
PATCH  /calls/:id                   → { call }
DELETE /calls/:id                   → { message }
```

### Pipeline Endpoints
```
GET    /pipelines                   → { pipelines[] }
POST   /pipelines                   → { pipeline }
PATCH  /pipelines/:id               → { pipeline }
DELETE /pipelines/:id               → { message }
PATCH  /pipelines/:id/stage         → { item }  -- move lead to stage
GET    /pipelines/:id/items         → { items[] }
```

### Connector Endpoints
```
GET    /api-keys                    → { api_keys[] }
POST   /api-keys                    → { api_key }  -- returns raw key once
DELETE /api-keys/:id                → { message }

GET    /webhooks                    → { webhooks[] }
POST   /webhooks                    → { webhook }
PATCH  /webhooks/:id                → { webhook }
DELETE /webhooks/:id                → { message }

GET    /integrations                → { integrations[] }
POST   /integrations                → { integration }
PATCH  /integrations/:id            → { integration }
DELETE /integrations/:id            → { message }
POST   /integrations/:id/sync      → { job_id }
```

### Compliance Endpoints
```
GET    /dnc                         → { entries[], total }
POST   /dnc                         → { entry }
POST   /dnc/import                  → { job_id }
DELETE /dnc/:id                     → { message }
POST   /dnc/check                  → { allowed: boolean }
```

---

## 6. Security Architecture

```
┌──────────────────────────────────────────────────┐
│                 Internet                         │
└──────────────────┬───────────────────────────────┘
                   │
┌──────────────────┴───────────────────────────────┐
│              CloudFlare/WAF                      │
│  - DDoS protection                               │
│  - Rate limiting                                 │
│  - SSL termination                               │
└──────────────────┬───────────────────────────────┘
                   │
┌──────────────────┴───────────────────────────────┐
│           Nginx (Reverse Proxy)                  │
│  - Static file serving                           │
│  - API routing                                   │
│  - Rate limiting (per IP)                        │
└──────────────────┬───────────────────────────────┘
                   │
┌──────────────────┴───────────────────────────────┐
│         Express API Server                       │
│                                                   │
│  Middleware Pipeline:                             │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌────────┐ ┌──────┐ │
│  │Helmet│ │ CORS │ │ Rate│ │ Auth  │ │Role  │ │
│  │      │ │      │ │Limit│ │ (JWT) │ │Gate  │ │
│  └──────┘ └──────┘ └──────┘ └────────┘ └──────┘ │
│                                                   │
│  Auth Middleware:                                 │
│  1. Extract JWT from Authorization header         │
│  2. Verify JWT signature + expiry                 │
│  3. Attach { user_id, role, company_id } to req   │
│                                                   │
│  Role Gate:                                       │
│  - Super Admin: full access                       │
│  - Company Admin: company-scoped access           │
│  - Manager: team-scoped access                    │
│  - Caller: self-scoped access                     │
└───────────────────────────────────────────────────┘
```

---

## 7. Integration / Connector Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Connector Framework                    │
│                                                          │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────┐   │
│  │ Import     │  │ Export     │  │ Sync Connectors  │   │
│  │ Engine     │  │ Engine     │  │ (Salesforce,     │   │
│  │ (CSV/XLSX) │  │ (CSV/XLSX) │  │  HubSpot, Sheets) │   │
│  └─────┬──────┘  └─────┬──────┘  └────────┬─────────┘   │
│        │               │                   │            │
│  ┌─────┴───────────────┴───────────────────┴─────────┐   │
│  │              Webhook Dispatcher                    │   │
│  │  Events: call.created, lead.updated, lead.closed   │   │
│  │  Delivery: HTTP POST with HMAC-SHA256 signature    │   │
│  └────────────────────┬──────────────────────────────┘   │
│                       │                                  │
│  ┌────────────────────┴──────────────────────────────┐   │
│  │              REST API (Public)                     │   │
│  │  Auth: Bearer token (API key)                     │   │
│  │  Scoped: per-key permissions                       │   │
│  │  Rate: 1000 req/hr per key                         │   │
│  └───────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

### Webhook Event Catalog

| Event | Triggered When | Payload |
|-------|---------------|---------|
| `lead.created` | New lead added | `{ lead_id, name, phone, company_id }` |
| `lead.updated` | Lead fields changed | `{ lead_id, changes, company_id }` |
| `lead.assigned` | Lead reassigned | `{ lead_id, from, to, company_id }` |
| `lead.stage_changed` | Pipeline stage moved | `{ lead_id, from_stage, to_stage, company_id }` |
| `lead.closed` | Lead won/lost | `{ lead_id, outcome, deal_value, company_id }` |
| `call.created` | Call logged | `{ call_id, lead_id, user_id, duration, disposition }` |
| `call.recorded` | Recording available | `{ call_id, recording_url, duration }` |
| `user.created` | User invited | `{ user_id, email, role, company_id }` |
| `dnc.added` | Number added to DNC | `{ phone, source, company_id }` |

---

## 8. Deployment Architecture

### Docker Compose (Development)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    volumes: [./db/init.sql:/docker-entrypoint-initdb.d/init.sql]
    environment:
      POSTGRES_DB: sales2
      POSTGRES_USER: sales2
      POSTGRES_PASSWORD: sales2

  redis:
    image: redis:7-alpine

  api:
    build: .
    ports: ["3000:3000"]
    depends_on: [postgres, redis]
    environment:
      DATABASE_URL: postgres://sales2:sales2@postgres:5432/sales2
      REDIS_URL: redis://redis:6379

  frontend:
    build: ./frontend
    ports: ["80:80"]
    depends_on: [api]
```

### Production (Cloud Deployment)

```
┌──────────────────────────────────────────┐
│           CloudFlare (DNS + WAF)         │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────┴───────────────────────┐
│   Load Balancer (AWS ALB / GCP HTTP LB)  │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────┴───────────────────────┐
│      Nginx (ECS / GKE / K8s)            │
│  - Static files (CloudFront/CDN)         │
│  - API proxy                             │
└──────────────────┬───────────────────────┘
                   │
┌──────────────────┴───────────────────────┐
│  Express API (auto-scaled, min 2 pods)   │
└────────┬──────────────┬──────────────────┘
         │              │
┌────────┴────────┐ ┌──┴────────────────┐
│ PostgreSQL RDS  │ │  ElastiCache Redis│
│ - Multi-AZ      │ │  - Primary/Reader │
│ - Read replicas │ │  - Sessions, cache│
└─────────────────┘ └───────────────────┘
```
