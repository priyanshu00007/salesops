# User Flows & Workflows — ColdSync

## End-to-End Cold Calling Operations

---

## 1. Super Admin Flows

### 1.1 Company Lifecycle

```
SUPER ADMIN DASHBOARD
        │
        ├── CREATE COMPANY
        │     │
        │     ├── Fill: name, domain, plan, admin email
        │     ├── System: create company record (status: pending)
        │     └── Send invitation email to company admin
        │
        ├── APPROVE COMPANY
        │     │
        │     ├── Review company details
        │     ├── Click "Approve" → status becomes "active"
        │     ├── System: create company_subscription record
        │     └── Company admin receives welcome email
        │
        ├── SUSPEND COMPANY
        │     │
        │     ├── Select company → click "Suspend"
        │     ├── Confirm with reason
        │     ├── Status becomes "suspended"
        │     ├── All company users locked out
        │     └── Audit log entry created
        │
        ├── RESTORE COMPANY
        │     ├── Select suspended company → click "Restore"
        │     └── Status becomes "active"
        │
        └── DELETE COMPANY
              │
              ├── Soft delete (status: deleted)
              ├── Data retained for 30 days
              ├── All users deactivated
              └── After 30 days → hard delete (cron job)

Super Admin Views:
  - Platform Dashboard: total companies, active, suspended
  - Per-Company Dashboard: users, calls, leads, usage
  - Audit Trail: all actions across all companies
```

### 1.2 Invitation Flow

```
Super Admin clicks "Invite Company"
        │
        ├── Enters: company name, admin name, admin email
        ├── System generates token
        ├── Email sent with magic link: /accept-invite/:token
        │
        └── Company Admin receives email
              │
              ├── Clicks link → sets password
              ├── First login → forced profile setup
              └── Redirected to Company Dashboard
```

---

## 2. Company Admin Flows

### 2.1 Team Management

```
COMPANY ADMIN DASHBOARD
        │
        ├── INVITE CALLER
        │     │
        │     ├── Enter: name, email, role (manager/caller)
        │     ├── System: send invitation email
        │     ├── User: accepts invite, sets password
        │     └── User appears in team list (status: active)
        │
        ├── MANAGE CALLERS
        │     │
        │     ├── View list: name, email, role, status, last active
        │     ├── Actions per user:
        │     │   ├── EDIT: change name, role, email
        │     │   ├── SUSPEND: user cannot login
        │     │   ├── LOCK: user locked out (wrong password)
        │     │   ├── UNLOCK: restore access
        │     │   ├── RESET PASSWORD: send reset link
        │     │   └── DELETE: remove user
        │     └── Bulk import callers via CSV
        │
        └── TEAM REPORTS
              │
              ├── Leaderboard: calls today, connects, conversion
              ├── Per-caller drill-down: daily activity, outcomes
              └── Export reports (CSV/PDF)
```

### 2.2 Lead Flow

```
COMPANY ADMIN
        │
        ├── IMPORT LEADS
        │     │
        │     ├── Upload CSV/Excel file
        │     ├── Column mapping UI (map name, phone, email, etc.)
        │     ├── Preview first 10 rows
        │     ├── Click "Import" → async job processes
        │     ├── Results: X imported, Y duplicates skipped, Z errors
        │     └── New leads appear in lead list
        │
        ├── MANAGE LEADS
        │     │
        │     ├── Table view with inline edit
        │     ├── Filter: status, assigned_to, source, stage
        │     ├── Search: by name, phone, email
        │     ├── Sort: by any column
        │     ├── Bulk actions:
        │     │   ├── Assign to caller
        │     │   ├── Change status
        │     │   ├── Add tag
        │     │   └── Delete
        │     └── Export filtered results
        │
        ├── ASSIGN LEADS
        │     │
        │     ├── Manual: select leads → assign to caller
        │     ├── Round-robin: auto-assign evenly across team
        │     └── Lead pool: unassigned leads visible to all callers
        │
        └── PIPELINE VIEW
              │
              ├── Kanban board: drag leads between stages
              ├── Stages: New → Contacted → Qualified → Proposal → Negotiation → Closed
              ├── Click lead → view all calls, notes, activity
              └── Conversion metrics per stage
```

---

## 3. Cold Caller Flow

### 3.1 Daily Workflow

```
CALLER LOGIN
  │
  ├── DASHBOARD
  │     ├── Today's stats: calls made, connects, meetings booked
  │     ├── My target: progress bar
  │     ├── Upcoming callbacks (scheduled)
  │     └── Leaderboard (optional visibility)
  │
  ├── MY LEADS
  │     ├── Assigned leads list (spreadsheet view)
  │     ├── Quick filters: new, callback, hot
  │     ├── Click lead → detail view
  │     │     ├── Lead info (name, phone, email, notes)
  │     │     ├── Call history (all past calls + recordings)
  │     │     └── Pipeline stage + move options
  │     └── Click phone number → click-to-dial (if VoIP enabled)
  │
  ├── MAKE A CALL
  │     ├── Lead detail opens
  │     ├── Click "Call" (or manually dial)
  │     ├── After call → log result:
  │     │     ├── Disposition: No Answer / Busy / Voicemail /
  │     │     │              Not Interested / Callback / Qualified /
  │     │     │              Meeting Booked / Closed Won / Closed Lost
  │     │     ├── Duration: auto/manual
  │     │     ├── Notes: type notes about conversation
  │     │     └── Next step: callback date / follow-up action
  │     └── Call saved → appears in call history
  │
  ├── LOG A CALL (manual)
  │     ├── Search/select lead
  │     ├── Enter: disposition, duration, notes, recording
  │     └── Save
  │
  ├── CALLBACKS
  │     ├── Today's callbacks (ordered by time)
  │     ├── Click lead → opens with context
  │     └── Complete callback → prompt to log new call
  │
  └── PIPELINE (My Deals)
        ├── My leads in pipeline view
        ├── Drag to update stage
        └── Close won/lost with deal value
```

### 3.2 Call-to-Close Flow

```
LEAD ASSIGNED TO CALLER
        │
        v
CALL 1: First Contact
  ├── Disposition options:
  │   ├── No Answer → schedule callback
  │   ├── Voicemail Left → mark as contacted, next call
  │   ├── Not Interested → move to disqualified (reason noted)
  │   └── Qualified / Meeting Booked → move to next stage
  └── Notes captured
        │
        v
CALL 2: Follow-up
  ├── If Qualified → discuss needs, qualify further
  └── If Meeting Booked → confirm meeting details
        │
        v
CALL 3: Proposal / Pitch
  ├── Present solution
  ├── Handle objections (notes capture objections)
  └── Outcome: Interested / Not Interested / Need more time
        │
        v
CALL 4: Negotiation / Close
  ├── Negotiate terms
  ├── If agreed → move to Closed Won
  │   └── Deal value recorded
  └── If lost → move to Closed Lost
      └── Loss reason captured
```

### 3.3 Lead Pipeline State Diagram

```
                    ┌─────────────┐
                    │    NEW      │
                    └──────┬──────┘
                           │ First call made
                           v
                    ┌─────────────┐
              ┌─────┤  CONTACTED  │◄────┐
              │     └──────┬──────┘     │
              │            │            │
              │     Qualified?          │ Callback
              │            │            │
              │            v            │
              │     ┌─────────────┐     │
              │     │  QUALIFIED  │─────┘
              │     └──────┬──────┘
              │            │
              │     Proposal sent
              │            │
              │            v
              │     ┌─────────────┐
              │     │  PROPOSAL   │
              │     └──────┬──────┘
              │            │
              │     Negotiation
              │            │
              │            v
              │     ┌──────────────┐
              │     │ NEGOTIATION  │
              │     └──────┬───────┘
              │            │
              │      ┌─────┴─────┐
              │      v           v
              │  ┌────────┐ ┌──────────┐
              │  │CLOSED  │ │ CLOSED   │
              │  │ WON    │ │ LOST     │
              │  └────────┘ └──────────┘
              │
              └── Disqualified (Not Interested, DNC, Wrong Number)
```

---

## 4. Data Integration Flow

### 4.1 CSV Import Flow

```
User drags CSV file onto import zone
        │
        v
File uploaded to temp storage (multer)
        │
        v
Parse CSV headers → show column mapping UI
        │
        v
User maps:
  CSV "Full Name"  → System "name"
  CSV "Phone Num"  → System "phone"
  CSV "Email Addr" → System "email"
  ...skip columns that don't map
        │
        v
Preview: show first 10 rows with mapping applied
        │
        v
User confirms → Background Job Created
        │
        v
Job processes in queue:
  1. Validate each row
  2. Check duplicates (by phone, email)
  3. Insert new leads
  4. Track: imported, skipped, errors
        │
        v
User notified via toast + notification
  "2,450 leads imported. 12 duplicates skipped. 3 errors."
        │
        v
Errors downloadable as CSV (row number + reason)
```

### 4.2 Webhook Flow

```
External system (e.g., Zapier) sends webhook to ColdSync
        │
        v
ColdSync REST API receives POST /api/v1/leads
  Headers: Authorization: Bearer <api_key>
           Content-Type: application/json
        │
        v
Middleware:
  1. Extract API key → look up in api_keys table
  2. Verify key_hash matches
  3. Check permissions (write:leads)
  4. Check rate limit
  5. Attach company_id from key
        │
        v
Route handler creates lead (company_id from key)
        │
        v
Lead created → check if any webhooks configured for "lead.created"
        │
        v
Webhook Dispatcher:
  - Load all active webhooks for company
  - Filter by event "lead.created"
  - POST to each URL with payload + HMAC signature header
  - Retry 3x on failure (exponential backoff)
  - Log delivery success/failure
```

### 4.3 External CRM Sync Flow (Salesforce/HubSpot)

```
USER triggers sync from ColdSync UI
        │
        v
ColdSync reads config from integrations table
  - provider: "salesforce"
  - config: { instance_url, client_id, client_secret, refresh_token }
        │
        v
OAuth2 refresh → get new access token
        │
        v
Job launched:
  Direction: BI-DIRECTIONAL (configurable)
  │
  ├── COLD SYNC → CRM:
  │   ├── Query leads updated since last_sync_at
  │   ├── Transform to CRM format (field mapping)
  │   ├── Upsert to CRM via REST/SOAP API
  │   └── Log sync results
  │
  └── CRM → COLD SYNC:
      ├── Query CRM leads updated since last_sync_at
      ├── Upsert to ColdSync leads table
      ├── Link new CRM IDs to ColdSync IDs
      └── Log sync results
        │
        v
Sync log created:
  - Records added, updated, failed
  - Error details for troubleshooting
  - User notified on completion
```

---

## 5. Compliance Flow

### 5.1 TCPA Opt-Out Flow

```
PROSPECT SAYS "Don't call me again" on call
        │
        v
Caller selects disposition: "Do Not Contact"
        │
        v
System:
  1. Add phone + email to DNC table
  2. Timestamp the opt-out
  3. Note the caller who took it
  4. Log to compliance audit trail
  5. Suppress all future dialing to this number
        │
        v
Automatic cross-channel suppression:
  - Calls: block dialing (show warning if attempted)
  - SMS: block sending
  - Email: block (if integrated)
  - All channels: suppressed immediately
        │
        v
10-business-day SLA enforcement:
  - System calculates deadline from opt-out timestamp
  - If attempt made before deadline → violation flag
  - Audit trail searchable for regulators
```

### 5.2 DNC Scrubbing Flow

```
Before any dialing session:
        │
        v
Caller imports new lead list (CSV)
        │
        v
System auto-checks each phone number:
  1. Against company DNC table
  2. Against state DNC registry (via API)
  3. Against federal DNC registry (via API)
        │
        v
Results:
  - Clean → allow call
  - Company DNC match → mark as DNC, suppress
  - State/Federal match → add to company DNC, suppress
        │
        v
Report generated: "130 numbers clean, 12 DNC matches"
```
