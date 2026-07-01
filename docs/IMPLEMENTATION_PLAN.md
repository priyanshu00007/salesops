# Implementation Plan — ColdSync

## From Current Codebase to Production-Ready Platform

---

## 1. Current State Assessment

### What Already Exists (sales2 codebase)

| Component | Status | Notes |
|-----------|--------|-------|
| PostgreSQL schema | Mostly done | 30+ tables exist, need call-specific tables |
| Express server | Done | Full backend with routes |
| Auth (JWT) | Done | Login, register, middleware |
| Role middleware | Done | Basic admin/user split |
| Companies CRUD | Done | Super Admin can manage |
| Users CRUD | Done | Basic user management |
| Leads CRUD | Done | Basic lead management |
| Calls tracking | Done | Basic call logging |
| Frontend (React) | Done | Admin + Company + Employee pages |
| Socket.IO | Done | Real-time events |
| Seed data | Done | Demo data exists |
| Docker | Done | Dockerfile + compose |

### What Needs to Be Built

| Component | Priority | Est. Effort |
|-----------|----------|-------------|
| Multi-tenant data isolation | Critical | 2 days |
| Advanced call management (dispositions, recording) | Critical | 3 days |
| Pipeline / Kanban | Critical | 3 days |
| DNC / TCPA compliance | Critical | 3 days |
| Spreadsheet-style inline editing | High | 2 days |
| CSV import/export | High | 2 days |
| Click-to-dial (Twilio/VoIP) | High | 3 days |
| API keys & webhooks connector | High | 3 days |
| Caller dashboard & reporting | High | 3 days |
| Company onboarding/invitation flow | Medium | 2 days |
| User-level actions (lock/unlock/reset password) | Medium | 1 day |
| Billing & subscriptions | Medium | 3 days |
| External CRM connectors (Salesforce, HubSpot) | Low | 5 days |
| AI call transcripts | Low | 3 days |
| Mobile app | Future | - |

---

## 2. Phase 1: Foundation (Weeks 1-2)

### Goal: Solid multi-tenant platform with core user/company management

### Week 1 — Database & Backend Core

| Day | Task | Details |
|-----|------|---------|
| 1 | Multi-tenant RLS policy | Enable RLS on all tables, add company_id checks |
| 2 | Company advanced actions | Approve, suspend, restore, delete (soft) endpoints |
| 3 | User advanced actions | Lock/unlock, reset password, bulk invite endpoints |
| 4 | Invitation system | Token generation, email, accept flow |
| 5 | Role hierarchy cleanup | super_admin, company_admin, manager, caller middleware |

### Week 2 — Frontend Foundation

| Day | Task | Details |
|-----|------|---------|
| 1 | Companies page (Super Admin) | Full CRUD, status actions, search, pagination |
| 2 | Employees page (Company Admin) | Full CRUD, lock/unlock, reset password, invite |
| 3 | Company onboarding flow | Invite accept → password set → dashboard redirect |
| 4 | Role-based navigation | Different sidebar + routes per role |
| 5 | Testing + bug fixes | Integration tests, edge cases |

### Deliverables:
- Super Admin can create/approve/suspend/restore/delete companies
- Company Admin can invite/manage/suspend/lock/unlock/delete users
- Users cannot access data outside their company
- Clean role-based navigation

---

## 3. Phase 2: Core Sales Features (Weeks 3-5)

### Goal: Full lead-to-close pipeline with call tracking

### Week 3 — Lead Management Upgrade

| Day | Task | Details |
|-----|------|---------|
| 1 | Lead detail page | Full record with call history, notes, activity |
| 2 | CSV import | Upload, column mapping, preview, background processing |
| 3 | CSV export | Export filtered leads, progress tracking |
| 4 | Duplicate detection | By phone, email — merge or skip |
| 5 | Bulk lead actions | Assign, tag, change status, delete (batch) |

### Week 4 — Call Tracking & Dispositions

| Day | Task | Details |
|-----|------|---------|
| 1 | Enhanced call form | Disposition picklist, duration, outcome, notes |
| 2 | Call dispositions CRUD | Admin-configurable disposition options |
| 3 | Call recording upload | File upload, storage, playback in browser |
| 4 | Call history per lead | Timeline view of all calls |
| 5 | Callback scheduler | Set + manage callbacks, notification reminders |

### Week 5 — Pipeline Management

| Day | Task | Details |
|-----|------|---------|
| 1 | Pipeline backend API | CRUD pipelines, stages, items |
| 2 | Kanban board UI | Drag-and-drop leads between stages |
| 3 | Stage timestamps | Track time-in-stage, conversion metrics |
| 4 | Pipeline reporting | Funnel visualization, conversion rates |
| 5 | Custom stages | Company admin can configure their pipeline |

### Deliverables:
- Leads can be imported via CSV, searched, filtered, bulk-managed
- Calls logged with dispositions, recordings, and callback scheduling
- Visual Kanban pipeline with drag-and-drop
- Conversion funnel reporting

---

## 4. Phase 3: Dashboard & Reporting (Week 6)

### Goal: Role-specific dashboards with actionable insights

| Day | Task | Details |
|-----|------|---------|
| 1 | Super Admin dashboard | Platform-wide metrics (companies, users, calls, leads) |
| 2 | Company Admin dashboard | Team performance, leaderboard, daily stats |
| 3 | Caller dashboard | Personal stats, targets, recent activity |
| 4 | Reports | Exportable reports (PDF/CSV) per role |
| 5 | Scheduled reports | Email reports weekly/monthly (future job) |

### Deliverables:
- Three role-specific dashboards
- Real-time stats with charts
- Exportable reports

---

## 5. Phase 4: Compliance (Week 7)

### Goal: TCPA/DNC compliance to protect the business

| Day | Task | Details |
|-----|------|---------|
| 1 | DNC table + CRUD | Upload, search, manual add |
| 2 | Auto-DNC check on import | Scan imports against DNC lists |
| 3 | TCPA opt-out flow | Verbal/SMS opt-out → suppress all channels |
| 4 | Compliance audit trail | Log all opt-outs, timestamps, agent info |
| 5 | Caller ID reputation | Monitor spam flags (future integration) |

### Deliverables:
- DNC list management
- Automatic scrubbing on lead import
- TCPA opt-out with cross-channel suppression
- Compliance audit trail

---

## 6. Phase 5: Connectors & API (Weeks 8-9)

### Goal: Make ColdSync integrable with any external tool

### Week 8 — API & Webhooks

| Day | Task | Details |
|-----|------|---------|
| 1 | API key management | Generate, revoke, scope permissions |
| 2 | Public REST API docs | OpenAPI/Swagger documentation |
| 3 | Webhook engine | Event dispatcher, HMAC signing, retry logic |
| 4 | Webhook admin UI | Configure webhooks per company |
| 5 | Rate limiting | Per-API-key rate limits + headers |

### Week 9 — External Connectors

| Day | Task | Details |
|-----|------|---------|
| 1 | Google Sheets connector | Import/export from sheets live |
| 2 | Twilio VoIP connector | Click-to-dial, auto call logging |
| 3 | Salesforce connector | Bi-directional lead sync (baseline) |
| 4 | HubSpot connector | Bi-directional lead sync (baseline) |
| 5 | Connector health monitoring | Sync logs, error tracking, retries |

### Deliverables:
- API keys with scoped permissions
- Webhook system with retry logic
- Google Sheets, Twilio, Salesforce, HubSpot connectors

---

## 7. Phase 6: Billing & Launch (Week 10)

### Goal: Production-ready with monetization

| Day | Task | Details |
|-----|------|---------|
| 1 | Subscription plans CRUD | Super Admin manages plans |
| 2 | Company subscription assignment | Plan → company mapping |
| 3 | Usage tracking | API calls, storage, users per company |
| 4 | Usage enforcement | Block actions when limit reached |
| 5 | Final integration testing | E2E tests, load testing, security audit |

### Deliverables:
- Subscription management
- Usage tracking and enforcement
- Production-ready platform

---

## 8. Future Phases (Post-Launch)

| Phase | Features | Timeline |
|-------|----------|----------|
| 7 | AI call transcripts + conversation intelligence | Month 3 |
| 8 | AI coaching (objection detection, talk ratio, sentiment) | Month 4 |
| 9 | Power dialer / parallel dialer | Month 5 |
| 10 | Mobile app (React Native) | Month 6 |
| 11 | SMS integration | Month 6 |
| 12 | Advanced analytics (predictive, forecasting) | Quarter 3 |

---

## 9. Effort Summary

| Phase | Weeks | Focus | Team Size | Effort (Person-Weeks) |
|-------|-------|-------|-----------|----------------------|
| 1 | 2 | Foundation + Multi-tenant | 2 devs | 4 |
| 2 | 3 | Leads, Calls, Pipeline | 2 devs | 6 |
| 3 | 1 | Dashboards & Reports | 1 dev | 1 |
| 4 | 1 | Compliance (DNC/TCPA) | 1 dev | 1 |
| 5 | 2 | API, Webhooks, Connectors | 2 devs | 4 |
| 6 | 1 | Billing + Launch Prep | 2 devs | 2 |
| **Total** | **10** | **MVP to Launch** | **2 devs** | **18** |

### Team Recommendation
- 2 Full-stack developers (Node.js + React)
- 1 Part-time DevOps (Docker, CI/CD, deployment)
- 1 Product owner / domain expert

---

## 10. Technical Debt Items to Address

| Item | Priority | Notes |
|------|----------|-------|
| Add proper error classes | Medium | Replace generic 500 errors |
| Request validation (Zod) for ALL endpoints | High | Currently missing on some routes |
| Pagination on all list endpoints | High | Some endpoints return all rows |
| Consistent API response format | Medium | Standardize { data, error, meta } |
| Add request ID tracking | Low | Debugging, audit |
| Database connection pooling tuning | Medium | Configure max pool size |
| Add health check endpoint | Medium | Docker health probes |
| Frontend error boundaries | Medium | Catch React render errors |
| Loading states for all async operations | High | Skeleton loaders |
| Environment variable validation | Low | Fail fast on missing config |

---

## 11. Risk & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Data leak between tenants | Low | Critical | RLS policies, company_id checks in every query, regular audits |
| TCPA compliance violation | Medium | High | DNC scrubbing, opt-out enforcement, audit trail, legal review |
| VoIP integration complexity | Medium | Medium | Start with Twilio (battle-tested), mock for development |
| Scalability at launch | Low | Medium | Horizontal scaling ready, caching layer, DB read replicas |
| User adoption low | Medium | High | Beta program, onboarding flow, support during launch |
| Competitor faster to market | Medium | Medium | Focus on underserved mid-market, multi-tenant is differentiator |
