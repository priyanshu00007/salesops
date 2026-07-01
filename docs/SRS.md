# Software Requirements Specification — ColdSync

## Version 1.0 — MVP

---

## 1. Introduction

### 1.1 Purpose
This document defines the functional and non-functional requirements for ColdSync v1.0 (MVP), a multi-tenant cold calling operations platform.

### 1.2 Scope
ColdSync covers: multi-tenant user management, lead management, call tracking, pipeline management, role-based access, compliance (DNC/TCPA), reporting, integrations/connectors, and spreadsheet-style data handling.

### 1.3 Definitions

| Term | Definition |
|------|------------|
| Super Admin | Platform owner, manages all companies |
| Company Admin | Manages a single company's team |
| Caller | End-user who makes cold calls |
| Lead | A prospect contact |
| Call Log | Record of a phone conversation |
| Pipeline | Lead progression stages |
| DNC | Do Not Call registry |
| TCPA | Telephone Consumer Protection Act |
| Connector | Integration module for external tools |

---

## 2. Functional Requirements

### FR-1: Authentication & Authorization

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | Email + password login with JWT tokens | Must |
| FR-1.2 | Session management (refresh tokens, expiry) | Must |
| FR-1.3 | Role-based access middleware (super_admin, company_admin, manager, caller) | Must |
| FR-1.4 | Password reset flow (forgot password via email) | Should |
| FR-1.5 | OAuth/SAML SSO (Google, Microsoft) | Could |
| FR-1.6 | MFA (TOTP) | Could |
| FR-1.7 | Rate limiting on login attempts (max 5/min) | Must |

### FR-2: Multi-Tenant Company Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | Super Admin can create, suspend, delete, restore, approve companies | Must |
| FR-2.2 | Each company gets a unique identifier (company_id) scoping all data | Must |
| FR-2.3 | Company onboarding flow: invite email → set password → dashboard | Must |
| FR-2.4 | Company settings: name, domain, logo, timezone, default language | Must |
| FR-2.5 | Subscription/plan management per company | Should |
| FR-2.6 | Company-level usage quotas (users, storage, API calls) | Should |
| FR-2.7 | Company deletion with data retention policy (30-day soft delete) | Must |

### FR-3: User Management (per Company)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | Company Admin can CRUD users within their company | Must |
| FR-3.2 | Roles: company_admin, manager, caller | Must |
| FR-3.3 | Actions: invite user, activate, suspend, lock/unlock, reset password, delete | Must |
| FR-3.4 | Bulk user import via CSV | Should |
| FR-3.5 | User profile: name, email, phone, avatar, role, status, last login | Must |
| FR-3.6 | Activity log per user (calls made, leads created, last activity) | Must |

### FR-4: Lead Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | Create, edit, delete, search leads | Must |
| FR-4.2 | Lead fields: name, phone, email, company, source, status, assigned_to, notes, custom fields | Must |
| FR-4.3 | Import leads from CSV/Excel with column mapping | Must |
| FR-4.4 | Export leads to CSV/Excel | Should |
| FR-4.5 | Duplicate detection (by phone, email) | Must |
| FR-4.6 | Lead assignment (auto-round-robin, manual) | Should |
| FR-4.7 | Lead tags/labels | Should |
| FR-4.8 | Lead enrichment (auto-fill from phone/email lookup) | Could |
| FR-4.9 | Bulk lead actions (assign, tag, delete, export) | Must |

### FR-5: Call Tracking

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | Log call with: lead, duration, outcome, notes, disposition, recording URL | Must |
| FR-5.2 | Call dispositions: No Answer, Busy, Voicemail Left, Not Interested, Callback, Qualified, Meeting Booked, Closed | Must |
| FR-5.3 | Click-to-dial from lead/caller interface (WebRTC/VoIP) | Should |
| FR-5.4 | Automatic call logging via Twilio/VoIP integration | Should |
| FR-5.5 | Call recording upload & playback | Should |
| FR-5.6 | Call transcript (AI-generated) | Could |
| FR-5.7 | Call schedule / callback reminders | Should |
| FR-5.8 | Call notes with rich text | Must |

### FR-6: Pipeline Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-6.1 | Visual pipeline (Kanban) with drag-and-drop | Must |
| FR-6.2 | Stages: New → Contacted → Qualified → Proposal → Negotiation → Closed Won/Lost | Must |
| FR-6.3 | Custom pipeline stages per company | Should |
| FR-6.4 | Pipeline stage timestamps (time in stage) | Should |
| FR-6.5 | Conversion rate tracking per stage | Must |
| FR-6.6 | Deal value tracking per lead | Should |

### FR-7: Dashboard & Reports

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-7.1 | Super Admin: platform-wide stats (total companies, users, calls, leads) | Must |
| FR-7.2 | Company Admin: team stats (calls today, conversion, leaderboard) | Must |
| FR-7.3 | Caller: personal stats (daily activity, targets, performance) | Must |
| FR-7.4 | Charts: calls over time, pipeline funnel, disposition breakdown | Should |
| FR-7.5 | Export reports (PDF, CSV) | Should |
| FR-7.6 | Scheduled email reports | Could |

### FR-8: Compliance (DNC/TCPA)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-8.1 | DNC list management (upload, search, auto-block) | Must |
| FR-8.2 | TCPA opt-out tracking (verbal + SMS STOP → suppress all channels) | Must |
| FR-8.3 | 10-business-day opt-out SLA enforcement | Must |
| FR-8.4 | Consent recording (store recording of opt-in/opt-out) | Should |
| FR-8.5 | DNC scrubbing before dialing (auto-check) | Should |
| FR-8.6 | Compliance audit trail (all opt-outs, timestamps, agent, outcome) | Must |
| FR-8.7 | Caller ID reputation monitoring | Could |

### FR-9: Spreadsheet-Style Data

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-9.1 | Inline editable table views (like Google Sheets) for leads and calls | Must |
| FR-9.2 | Copy-paste from Excel/Google Sheets into platform | Should |
| FR-9.3 | Bulk cell editing (select range → edit → apply) | Should |
| FR-9.4 | Column show/hide, resize, reorder | Should |
| FR-9.5 | Filter bar (by any column) | Must |
| FR-9.6 | Sort by any column | Must |

### FR-10: Connectors & Integrations

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-10.1 | REST API (all features accessible via API) | Must |
| FR-10.2 | Webhooks (events: call.created, lead.updated, etc.) | Must |
| FR-10.3 | Zapier/Make.com integration (via API) | Should |
| FR-10.4 | Salesforce connector (bi-directional lead/call sync) | Could |
| FR-10.5 | HubSpot connector | Could |
| FR-10.6 | Twilio/VoIP provider connector | Should |
| FR-10.7 | Google Sheets integration (import/export live) | Should |
| FR-10.8 | Import from CSV/Excel (drag-drop file) | Must |
| FR-10.9 | API key management (per company, scoped permissions) | Must |

---

## 3. Non-Functional Requirements

### NFR-1: Performance

| ID | Requirement |
|----|-------------|
| NFR-1.1 | Page load < 2s (p95) |
| NFR-1.2 | API response < 500ms (p95) |
| NFR-1.3 | Concurrent users: 1,000+ |
| NFR-1.4 | CSV import: 10K rows in < 30s |
| NFR-1.5 | Search results < 1s |

### NFR-2: Security

| ID | Requirement |
|----|-------------|
| NFR-2.1 | All traffic over HTTPS |
| NFR-2.2 | Passwords hashed with bcrypt (cost 10+) |
| NFR-2.3 | JWT tokens signed with RS256 |
| NFR-2.4 | API rate limiting (100 req/min per user) |
| NFR-2.5 | SQL injection prevention (parameterized queries) |
| NFR-2.6 | XSS prevention (input sanitization) |
| NFR-2.7 | CORS configured per origin |
| NFR-2.8 | Audit logging for all sensitive operations |
| NFR-2.9 | Data isolation: company A cannot access company B data |

### NFR-3: Reliability & Availability

| ID | Requirement |
|----|-------------|
| NFR-3.1 | 99.9% uptime (paid tiers) |
| NFR-3.2 | Automatic failover for database |
| NFR-3.3 | Daily automated backups |
| NFR-3.4 | Graceful degradation (read-only mode if DB is down) |
| NFR-3.5 | Error rate < 0.1% |

### NFR-4: Scalability

| ID | Requirement |
|----|-------------|
| NFR-4.1 | Horizontal scaling for API servers |
| NFR-4.2 | Database read replicas for reporting |
| NFR-4.3 | Caching layer (Redis) for frequently accessed data |
| NFR-4.4 | Async job queue for heavy operations (imports, exports) |

### NFR-5: Maintainability

| ID | Requirement |
|----|-------------|
| NFR-5.1 | Modular codebase (routes, middlewares, services separated) |
| NFR-5.2 | Comprehensive API documentation (OpenAPI/Swagger) |
| NFR-5.3 | Unit test coverage > 80% |
| NFR-5.4 | Integration tests for critical paths |
| NFR-5.5 | CI/CD pipeline |

---

## 4. Data Requirements

### 4.1 Core Entities

```
users         → id, name, email, password, role, company_id, status, last_login
companies     → id, name, status, plan, domain, settings
leads         → id, name, phone, email, company_id, source, status, assigned_to, stage
calls         → id, lead_id, user_id, duration, outcome, disposition, notes, recording_url
pipelines     → id, company_id, name, stages[]
pipeline_items → id, lead_id, pipeline_id, stage, entered_at
dnc_entries   → id, company_id, phone, email, source, opted_out_at
callbacks     → id, lead_id, user_id, scheduled_at, notes
activity_logs → id, user_id, action, resource, resource_id, ip, metadata
```

### 4.2 Connector Entities

```
api_keys      → id, company_id, name, key_hash, permissions, expires_at
webhooks      → id, company_id, name, url, events[], secret, is_active
integrations  → id, company_id, provider, config, is_enabled
sync_logs     → id, integration_id, direction, status, records_count, error
sheets_import → id, company_id, file_name, entity, mapping, records_count, status
```
