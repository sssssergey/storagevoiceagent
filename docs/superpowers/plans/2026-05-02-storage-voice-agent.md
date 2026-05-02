# Crown Storage Voice Agent — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Crown Storage marketing landing page with an embedded ElevenLabs voice agent that answers questions, collects leads, and books consultations via n8n workflows that integrate with Google Calendar and Gmail.

**Architecture:** Static Next.js page → ElevenLabs widget (web component) → ElevenLabs agent with three webhook tools → n8n workflows on `https://n8n.srv983772.hstgr.cloud` → Google Calendar + Gmail. No custom backend; bookings live in Calendar, leads in Gmail.

**Tech Stack:** Next.js 16.2.4 / React 19.2.4 / Tailwind CSS v4 / TypeScript / ElevenLabs Conversational AI (V3 voice) / n8n self-hosted / Google Calendar API / Gmail API.

**Source spec:** `docs/superpowers/specs/2026-05-02-storage-voice-agent-design.md`.

---

## File Structure

**New files**
- `knowledge-base/knowledge-base.md` — agent's KB upload (Crown Storage facts).
- `n8n-workflows/check-availability.json` — exported workflow JSON.
- `n8n-workflows/book-consultation.json` — exported workflow JSON.
- `n8n-workflows/send-lead-email.json` — exported workflow JSON.
- `src/components/ConvaiWidget.tsx` — client component, mounts the ElevenLabs widget.
- `src/components/sections/Hero.tsx`
- `src/components/sections/Services.tsx`
- `src/components/sections/HowItWorks.tsx`
- `src/components/sections/Pricing.tsx`
- `src/components/sections/FAQ.tsx`
- `src/components/sections/Contact.tsx`
- `.env.local` — local-only, holds `NEXT_PUBLIC_ELEVENLABS_AGENT_ID`.
- `docs/setup-guide.md` — click-by-click manual setup instructions.

**Modified files**
- `src/app/layout.tsx` — update title/meta, mount `<ConvaiWidget />`.
- `src/app/page.tsx` — replace scaffold with section composition.
- `src/app/globals.css` — add brand color tokens, drop dark-mode auto-switch.
- `.gitignore` — ensure `.env.local` is ignored (probably already is).

**Boundaries**
- Each section component is self-contained server component (~50–100 lines).
- `ConvaiWidget` is the only client component, owns script injection + element render + open-conversation helper.
- n8n workflows are independent; each has one webhook in / one response out.

---

## Conventions

- **Commit message style:** plain descriptive (no conventional-commit prefix), match existing repo style. Each commit ends with the `Co-Authored-By: Claude Opus 4.7` trailer when produced by Claude.
- **No test framework configured** — verification uses lint, build, MCP validation, `curl` smoke tests, and manual browser checks instead of unit tests.
- **n8n nodeType prefixes:**
  - For `search_nodes` / `validate_node`: short — `nodes-base.gmail`, `nodes-base.googleCalendar`.
  - For workflow operations (`n8n_create_workflow`, `n8n_update_partial_workflow`): full — `n8n-nodes-base.gmail`, `n8n-nodes-base.googleCalendar`.
- **Skills to consult on n8n tasks:** `n8n-mcp-tools-expert` (ALWAYS for MCP tool calls), `n8n-workflow-patterns`, `n8n-node-configuration`, `n8n-expression-syntax`, `n8n-validation-expert`, `n8n-code-javascript`.
- **Skills to consult on agent tasks:** `agents` (ElevenLabs).

---

# Phase 0 — Manual prerequisites

These are user actions in a browser. Claude pauses here until the user confirms each is green.

### Task 0.1: Set up Google Calendar OAuth credential in n8n

**Files:** none (n8n credential store).

- [ ] **Step 1: User opens n8n credentials**

Open `https://n8n.srv983772.hstgr.cloud/home/credentials` in a browser.

- [ ] **Step 2: User creates a Google Calendar OAuth2 API credential**

Click "Add Credential" → search "Google Calendar OAuth2 API" → click. n8n shows OAuth client ID/secret fields; if not pre-filled, the user follows n8n's "Connect my Google Account" flow that uses n8n's hosted OAuth client (or pastes their own GCP OAuth client). Click "Sign in with Google", grant Calendar access, return to n8n.

- [ ] **Step 3: User confirms green check**

Credential should display "Account Connected" with a green check. Note the credential's display name (e.g., "Google Calendar account") for later use.

- [ ] **Step 4: User reports back**

User tells Claude: "Calendar credential ready as `<name>`."

### Task 0.2: Set up Gmail OAuth credential in n8n

**Files:** none.

- [ ] **Step 1: User adds Gmail OAuth2 credential**

In the same n8n credentials page, click "Add Credential" → search "Gmail OAuth2 API" → click. Same Google account; n8n separates the credentials per scope.

- [ ] **Step 2: User completes OAuth**

"Sign in with Google" → grant Gmail send/read scopes → return to n8n.

- [ ] **Step 3: User confirms green check**

"Account Connected" + green check. Note display name.

- [ ] **Step 4: User reports back**

"Gmail credential ready as `<name>`."

---

# Phase 1 — n8n workflows

For all Phase 1 tasks, **first invoke the `n8n-mcp-tools-expert` skill**. Use `n8n_health_check` once at the start of the phase to confirm the instance is reachable.

### Task 1.1: Build & validate Workflow C — Send Lead Email

**Files:** managed in n8n (no local file yet; export comes in 1.7).

**Workflow shape**

```
[Webhook: POST /send-lead-email]
   → [IF: validate name+phone present]
        true → [Gmail: Send] → [Respond to Webhook 200 success]
        false → [Respond to Webhook 400 missing_fields]
```

- [ ] **Step 1: Confirm node types**

Run:
```
search_nodes({query: "webhook"})
search_nodes({query: "gmail"})
search_nodes({query: "respond to webhook"})
search_nodes({query: "if"})
```
Expected: returns include `nodes-base.webhook`, `nodes-base.gmail`, `nodes-base.respondToWebhook`, `nodes-base.if`.

- [ ] **Step 2: Validate Webhook node config**

```
validate_node({
  nodeType: "nodes-base.webhook",
  config: {
    httpMethod: "POST",
    path: "send-lead-email",
    responseMode: "responseNode"
  },
  profile: "runtime"
})
```
Expected: valid (no errors).

- [ ] **Step 3: Validate Gmail node config**

```
validate_node({
  nodeType: "nodes-base.gmail",
  config: {
    resource: "message",
    operation: "send",
    sendTo: "szergej.soros@gmail.com",
    subject: "=New Crown Storage Lead: {{ $json.body.customer_name }}",
    emailType: "html",
    message: "<h2>...</h2>",
    options: {}
  },
  profile: "runtime"
})
```
Expected: valid. If validator complains about missing required fields, follow `n8n-validation-expert` guidance.

- [ ] **Step 4: Create the workflow**

```
n8n_create_workflow({
  name: "Crown Storage — Send Lead Email",
  nodes: [
    {
      id: "webhook",
      name: "Webhook",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      position: [240, 300],
      parameters: {
        httpMethod: "POST",
        path: "send-lead-email",
        responseMode: "responseNode"
      }
    },
    {
      id: "validate",
      name: "Validate Input",
      type: "n8n-nodes-base.if",
      typeVersion: 2,
      position: [480, 300],
      parameters: {
        conditions: {
          options: { caseSensitive: true, typeValidation: "strict" },
          combinator: "and",
          conditions: [
            {
              leftValue: "={{ $json.body.customer_name }}",
              rightValue: "",
              operator: { type: "string", operation: "notEmpty" }
            },
            {
              leftValue: "={{ $json.body.customer_phone }}",
              rightValue: "",
              operator: { type: "string", operation: "notEmpty" }
            }
          ]
        }
      }
    },
    {
      id: "gmail",
      name: "Send Lead Email",
      type: "n8n-nodes-base.gmail",
      typeVersion: 2.1,
      position: [720, 200],
      parameters: {
        resource: "message",
        operation: "send",
        sendTo: "szergej.soros@gmail.com",
        subject: "=New Crown Storage Lead: {{ $json.body.customer_name }}",
        emailType: "html",
        message: "=<h2>New Lead from AI Voice Agent</h2><p><strong>Name:</strong> {{ $json.body.customer_name }}</p><p><strong>Phone:</strong> {{ $json.body.customer_phone }}</p><p><strong>Estimated Shipment Size:</strong> {{ $json.body.shipment_size }}</p><p><strong>Notes:</strong> {{ $json.body.notes || '—' }}</p><p><strong>Received:</strong> {{ $now.toISO() }}</p><hr><p><em>Sent automatically by Crown Storage AI Voice Agent via n8n</em></p>",
        options: {}
      },
      credentials: { gmailOAuth2: { id: "<gmail-cred-id>", name: "<gmail-cred-name>" } }
    },
    {
      id: "respondOk",
      name: "Respond OK",
      type: "n8n-nodes-base.respondToWebhook",
      typeVersion: 1.1,
      position: [960, 200],
      parameters: {
        respondWith: "json",
        responseBody: "={\"success\": true, \"message\": \"Lead email sent successfully\"}"
      }
    },
    {
      id: "respondBad",
      name: "Respond Missing Fields",
      type: "n8n-nodes-base.respondToWebhook",
      typeVersion: 1.1,
      position: [720, 400],
      parameters: {
        respondWith: "json",
        responseBody: "={\"success\": false, \"error\": \"missing_fields\"}",
        options: { responseCode: 400 }
      }
    }
  ],
  connections: {
    "Webhook": { "main": [[{ "node": "Validate Input", "type": "main", "index": 0 }]] },
    "Validate Input": {
      "main": [
        [{ "node": "Send Lead Email", "type": "main", "index": 0 }],
        [{ "node": "Respond Missing Fields", "type": "main", "index": 0 }]
      ]
    },
    "Send Lead Email": { "main": [[{ "node": "Respond OK", "type": "main", "index": 0 }]] }
  }
})
```

Note: replace `<gmail-cred-id>` and `<gmail-cred-name>` with the values from Task 0.2. The MCP server may require querying n8n for the credential ID — use `n8n_list_credentials` if available or look it up in the n8n UI URL when editing the credential.

- [ ] **Step 5: Validate the workflow**

```
n8n_validate_workflow({ id: "<workflow-id-from-step-4>" })
```
Expected: 0 errors. Fix per `n8n-validation-expert` if any.

- [ ] **Step 6: Activate**

```
n8n_update_partial_workflow({
  id: "<workflow-id>",
  intent: "Activate Send Lead Email workflow for testing",
  operations: [{ type: "activateWorkflow" }]
})
```

- [ ] **Step 7: Commit**

(No local files yet — workflow lives in n8n. JSON export happens in Task 1.7.)

### Task 1.2: Smoke-test Workflow C

**Files:** none.

- [ ] **Step 1: Happy-path curl**

Run in Bash:
```bash
curl -sS -X POST https://n8n.srv983772.hstgr.cloud/webhook/send-lead-email \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Test User","customer_phone":"555-0100","shipment_size":"a few boxes","notes":"smoke test"}'
```
Expected response:
```json
{"success":true,"message":"Lead email sent successfully"}
```
And: an email arrives at `szergej.soros@gmail.com` with subject `New Crown Storage Lead: Test User`.

- [ ] **Step 2: Missing-field curl**

```bash
curl -sS -X POST https://n8n.srv983772.hstgr.cloud/webhook/send-lead-email \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"Only Name"}'
```
Expected:
```json
{"success":false,"error":"missing_fields"}
```
HTTP status 400.

- [ ] **Step 3: If failures, debug**

If the email didn't arrive, check Gmail credential is connected and "Send" scope was granted. If JSON parse fails, check the Webhook node's body location — n8n puts JSON body under `$json.body`, not `$json`.

### Task 1.3: Build & validate Workflow A — Check Availability

**Files:** managed in n8n.

**Workflow shape**

```
[Webhook: POST /check-availability]
   → [Set: dateRange]
   → [Google Calendar: Get Many Events]
   → [Code (JS): generateSlots]
   → [Respond to Webhook]
```

- [ ] **Step 1: Confirm node types**

```
search_nodes({query: "google calendar"})
search_nodes({query: "code"})
search_nodes({query: "set"})
```
Expected includes `nodes-base.googleCalendar`, `nodes-base.code`, `nodes-base.set`.

- [ ] **Step 2: Validate Google Calendar Get Many Events**

```
validate_node({
  nodeType: "nodes-base.googleCalendar",
  config: {
    resource: "event",
    operation: "getAll",
    calendar: { __rl: true, value: "primary", mode: "list" },
    timeMin: "={{ $('Set Date Range').item.json.timeMin }}",
    timeMax: "={{ $('Set Date Range').item.json.timeMax }}",
    options: { singleEvents: true, orderBy: "startTime" },
    returnAll: true
  },
  profile: "runtime"
})
```
Expected: valid.

- [ ] **Step 3: Slot generator JavaScript (paste into Code node)**

This is the body of the Code node. Mode: "Run Once for All Items". Language: JavaScript.

```javascript
try {
  const TZ = "America/Chicago";
  const businessHoursStart = 9;   // 9:00
  const businessHoursEnd = 17;    // 17:00
  const slotMinutes = 30;
  const maxSlots = 6;

  // 1) determine date range from the Set node upstream
  const range = $('Set Date Range').first().json;
  const rangeStart = new Date(range.timeMin);
  const rangeEnd = new Date(range.timeMax);

  // 2) collect busy intervals from Google Calendar items
  const events = $input.all().map(i => i.json);
  const busy = events
    .filter(e => e.start && e.end && (e.start.dateTime || e.start.date))
    .map(e => ({
      start: new Date(e.start.dateTime || e.start.date),
      end: new Date(e.end.dateTime || e.end.date)
    }));

  // 3) walk every business-hour slot in range, skipping weekends and overlaps
  const slots = [];
  const cursor = new Date(rangeStart);
  cursor.setHours(businessHoursStart, 0, 0, 0);

  while (cursor < rangeEnd && slots.length < maxSlots) {
    const day = cursor.getDay(); // 0=Sun, 6=Sat
    const hour = cursor.getHours();

    if (day === 0 || day === 6) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(businessHoursStart, 0, 0, 0);
      continue;
    }
    if (hour >= businessHoursEnd) {
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(businessHoursStart, 0, 0, 0);
      continue;
    }

    const slotStart = new Date(cursor);
    const slotEnd = new Date(cursor.getTime() + slotMinutes * 60 * 1000);
    const overlaps = busy.some(b => slotStart < b.end && slotEnd > b.start);

    if (!overlaps) {
      const dayName = slotStart.toLocaleDateString("en-US", { weekday: "long", timeZone: TZ });
      const dateStr = slotStart.toLocaleDateString("en-CA", { timeZone: TZ }); // YYYY-MM-DD
      const timeStr = slotStart.toLocaleTimeString("en-US", {
        hour: "numeric", minute: "2-digit", hour12: true, timeZone: TZ
      });
      slots.push({ date: dateStr, time: timeStr, day: dayName });
    }

    cursor.setTime(cursor.getTime() + slotMinutes * 60 * 1000);
  }

  return [{ json: { available_slots: slots } }];
} catch (err) {
  return [{ json: { available_slots: [], error: String(err) } }];
}
```

- [ ] **Step 4: Set Date Range expression block**

The "Set Date Range" node creates two values, evaluated server-side at request time:

`timeMin` (string, expression):
```
={{ $json.body.preferred_date
     ? $json.body.preferred_date + 'T00:00:00.000-05:00'
     : $now.setZone('America/Chicago').startOf('day').toISO() }}
```

`timeMax` (string, expression):
```
={{ $json.body.preferred_date
     ? $json.body.preferred_date + 'T23:59:59.999-05:00'
     : $now.setZone('America/Chicago').plus({ days: 4 }).startOf('day').toISO() }}
```

(Note: range is "today + next 3 business days" inclusive — we set timeMax to start of day+4 so the slot generator naturally bounds within 4 calendar days; weekends are filtered in the JS.)

- [ ] **Step 5: Create the workflow**

```
n8n_create_workflow({
  name: "Crown Storage — Check Availability",
  nodes: [
    {
      id: "webhook",
      name: "Webhook",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      position: [240, 300],
      parameters: {
        httpMethod: "POST",
        path: "check-availability",
        responseMode: "responseNode"
      }
    },
    {
      id: "setRange",
      name: "Set Date Range",
      type: "n8n-nodes-base.set",
      typeVersion: 3.4,
      position: [460, 300],
      parameters: {
        assignments: {
          assignments: [
            { id: "1", name: "timeMin", type: "string", value: "<paste timeMin expression from Step 4>" },
            { id: "2", name: "timeMax", type: "string", value: "<paste timeMax expression from Step 4>" }
          ]
        },
        options: {}
      }
    },
    {
      id: "calendarGet",
      name: "Get Calendar Events",
      type: "n8n-nodes-base.googleCalendar",
      typeVersion: 1.3,
      position: [680, 300],
      parameters: {
        resource: "event",
        operation: "getAll",
        calendar: { __rl: true, value: "primary", mode: "list" },
        timeMin: "={{ $('Set Date Range').item.json.timeMin }}",
        timeMax: "={{ $('Set Date Range').item.json.timeMax }}",
        options: { singleEvents: true, orderBy: "startTime" },
        returnAll: true
      },
      credentials: { googleCalendarOAuth2Api: { id: "<calendar-cred-id>", name: "<calendar-cred-name>" } }
    },
    {
      id: "code",
      name: "Generate Slots",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [900, 300],
      parameters: {
        mode: "runOnceForAllItems",
        language: "javaScript",
        jsCode: "<paste full JS from Step 3>"
      }
    },
    {
      id: "respond",
      name: "Respond",
      type: "n8n-nodes-base.respondToWebhook",
      typeVersion: 1.1,
      position: [1120, 300],
      parameters: {
        respondWith: "json",
        responseBody: "={{ JSON.stringify($json) }}"
      }
    }
  ],
  connections: {
    "Webhook": { "main": [[{ "node": "Set Date Range", "type": "main", "index": 0 }]] },
    "Set Date Range": { "main": [[{ "node": "Get Calendar Events", "type": "main", "index": 0 }]] },
    "Get Calendar Events": { "main": [[{ "node": "Generate Slots", "type": "main", "index": 0 }]] },
    "Generate Slots": { "main": [[{ "node": "Respond", "type": "main", "index": 0 }]] }
  }
})
```

- [ ] **Step 6: Validate**

```
n8n_validate_workflow({ id: "<workflow-id>" })
```
Expected: 0 errors.

- [ ] **Step 7: Activate**

```
n8n_update_partial_workflow({
  id: "<workflow-id>",
  intent: "Activate Check Availability workflow",
  operations: [{ type: "activateWorkflow" }]
})
```

### Task 1.4: Smoke-test Workflow A

- [ ] **Step 1: No-preferred-date curl**

```bash
curl -sS -X POST https://n8n.srv983772.hstgr.cloud/webhook/check-availability \
  -H "Content-Type: application/json" \
  -d '{}'
```
Expected: response body has `available_slots` array, length 0–6, each entry shape `{date, time, day}`.

- [ ] **Step 2: Preferred-date curl**

Pick a future weekday in YYYY-MM-DD format:
```bash
curl -sS -X POST https://n8n.srv983772.hstgr.cloud/webhook/check-availability \
  -H "Content-Type: application/json" \
  -d '{"preferred_date":"2026-05-04"}'
```
Expected: slots only on 2026-05-04. Verify by inspecting `date` field on results.

- [ ] **Step 3: Manual conflict check**

Create a fake event on Google Calendar at 10:00 AM on a weekday in the next 3 days. Re-curl. Expect: 10:00 AM slot for that day is **absent** from `available_slots`. Delete the test event.

### Task 1.5: Build & validate Workflow B — Book Consultation

**Workflow shape**

```
[Webhook: POST /book-consultation]
   → [IF: validate name+phone+date+time]
        true → [Set: composeDateTime]
              → [Google Calendar: Create Event]
              → [Gmail: Send confirmation]
              → [Set: response]
              → [Respond OK]
        false → [Respond Missing Fields 400]
```

- [ ] **Step 1: Validate Calendar Create Event config**

```
validate_node({
  nodeType: "nodes-base.googleCalendar",
  config: {
    resource: "event",
    operation: "create",
    calendar: { __rl: true, value: "primary", mode: "list" },
    start: "={{ $json.startISO }}",
    end: "={{ $json.endISO }}",
    additionalFields: {
      summary: "=Sales Consultation — {{ $('Webhook').item.json.body.customer_name }}",
      description: "=Phone: {{ $('Webhook').item.json.body.customer_phone }}\nEstimated storage: {{ $('Webhook').item.json.body.shipment_size || 'not specified' }}\nBooked via Crown Storage AI Voice Agent",
      timezone: "America/Chicago"
    }
  },
  profile: "runtime"
})
```
Expected: valid.

- [ ] **Step 2: Compose-datetime expressions**

The "Compose DateTime" Set node creates two string fields:

`startISO`:
```
={{ DateTime.fromFormat($('Webhook').item.json.body.date + ' ' + $('Webhook').item.json.body.time, 'yyyy-MM-dd h:mm a', { zone: 'America/Chicago' }).toISO() }}
```
`endISO`:
```
={{ DateTime.fromFormat($('Webhook').item.json.body.date + ' ' + $('Webhook').item.json.body.time, 'yyyy-MM-dd h:mm a', { zone: 'America/Chicago' }).plus({ minutes: 30 }).toISO() }}
```

(`DateTime` is Luxon, exposed in n8n expressions.)

- [ ] **Step 3: Create the workflow**

```
n8n_create_workflow({
  name: "Crown Storage — Book Consultation",
  nodes: [
    { id: "webhook", name: "Webhook", type: "n8n-nodes-base.webhook", typeVersion: 2,
      position: [240, 300],
      parameters: { httpMethod: "POST", path: "book-consultation", responseMode: "responseNode" } },

    { id: "validate", name: "Validate Input", type: "n8n-nodes-base.if", typeVersion: 2,
      position: [460, 300],
      parameters: {
        conditions: {
          options: { caseSensitive: true, typeValidation: "strict" },
          combinator: "and",
          conditions: [
            { leftValue: "={{ $json.body.customer_name }}", rightValue: "", operator: { type: "string", operation: "notEmpty" } },
            { leftValue: "={{ $json.body.customer_phone }}", rightValue: "", operator: { type: "string", operation: "notEmpty" } },
            { leftValue: "={{ $json.body.date }}", rightValue: "", operator: { type: "string", operation: "notEmpty" } },
            { leftValue: "={{ $json.body.time }}", rightValue: "", operator: { type: "string", operation: "notEmpty" } }
          ]
        }
      } },

    { id: "compose", name: "Compose DateTime", type: "n8n-nodes-base.set", typeVersion: 3.4,
      position: [680, 200],
      parameters: {
        assignments: { assignments: [
          { id: "1", name: "startISO", type: "string", value: "<paste startISO expression>" },
          { id: "2", name: "endISO", type: "string", value: "<paste endISO expression>" }
        ] },
        options: {}
      } },

    { id: "calendar", name: "Create Calendar Event", type: "n8n-nodes-base.googleCalendar", typeVersion: 1.3,
      position: [900, 200],
      parameters: {
        resource: "event", operation: "create",
        calendar: { __rl: true, value: "primary", mode: "list" },
        start: "={{ $json.startISO }}",
        end: "={{ $json.endISO }}",
        additionalFields: {
          summary: "=Sales Consultation — {{ $('Webhook').item.json.body.customer_name }}",
          description: "=Phone: {{ $('Webhook').item.json.body.customer_phone }}\nEstimated storage: {{ $('Webhook').item.json.body.shipment_size || 'not specified' }}\nBooked via Crown Storage AI Voice Agent",
          timezone: "America/Chicago"
        }
      },
      credentials: { googleCalendarOAuth2Api: { id: "<calendar-cred-id>", name: "<calendar-cred-name>" } } },

    { id: "gmail", name: "Send Confirmation", type: "n8n-nodes-base.gmail", typeVersion: 2.1,
      position: [1120, 200],
      parameters: {
        resource: "message", operation: "send",
        sendTo: "szergej.soros@gmail.com",
        subject: "=Booking confirmed — {{ $('Webhook').item.json.body.customer_name }} on {{ $('Webhook').item.json.body.date }} {{ $('Webhook').item.json.body.time }}",
        emailType: "html",
        message: "=<h2>Consultation booked</h2><p><strong>Name:</strong> {{ $('Webhook').item.json.body.customer_name }}</p><p><strong>Phone:</strong> {{ $('Webhook').item.json.body.customer_phone }}</p><p><strong>Estimated storage:</strong> {{ $('Webhook').item.json.body.shipment_size || '—' }}</p><p><strong>When:</strong> {{ $('Webhook').item.json.body.date }} at {{ $('Webhook').item.json.body.time }} (America/Chicago)</p><p><strong>Calendar event:</strong> {{ $('Create Calendar Event').item.json.id }}</p>",
        options: {}
      },
      credentials: { gmailOAuth2: { id: "<gmail-cred-id>", name: "<gmail-cred-name>" } } },

    { id: "buildResp", name: "Build Response", type: "n8n-nodes-base.set", typeVersion: 3.4,
      position: [1340, 200],
      parameters: {
        assignments: { assignments: [
          { id: "1", name: "success", type: "boolean", value: "={{ true }}" },
          { id: "2", name: "booking_id", type: "string", value: "={{ $('Create Calendar Event').item.json.id }}" },
          { id: "3", name: "confirmed_date", type: "string", value: "={{ $('Webhook').item.json.body.date }}" },
          { id: "4", name: "confirmed_time", type: "string", value: "={{ $('Webhook').item.json.body.time }}" },
          { id: "5", name: "message", type: "string", value: "Consultation booked successfully" }
        ] },
        options: {}
      } },

    { id: "respondOk", name: "Respond OK", type: "n8n-nodes-base.respondToWebhook", typeVersion: 1.1,
      position: [1560, 200],
      parameters: {
        respondWith: "json",
        responseBody: "={{ JSON.stringify($json) }}"
      } },

    { id: "respondBad", name: "Respond Missing Fields", type: "n8n-nodes-base.respondToWebhook", typeVersion: 1.1,
      position: [680, 400],
      parameters: {
        respondWith: "json",
        responseBody: "={\"success\": false, \"error\": \"missing_fields\"}",
        options: { responseCode: 400 }
      } }
  ],
  connections: {
    "Webhook": { "main": [[{ "node": "Validate Input", "type": "main", "index": 0 }]] },
    "Validate Input": {
      "main": [
        [{ "node": "Compose DateTime", "type": "main", "index": 0 }],
        [{ "node": "Respond Missing Fields", "type": "main", "index": 0 }]
      ]
    },
    "Compose DateTime": { "main": [[{ "node": "Create Calendar Event", "type": "main", "index": 0 }]] },
    "Create Calendar Event": { "main": [[{ "node": "Send Confirmation", "type": "main", "index": 0 }]] },
    "Send Confirmation": { "main": [[{ "node": "Build Response", "type": "main", "index": 0 }]] },
    "Build Response": { "main": [[{ "node": "Respond OK", "type": "main", "index": 0 }]] }
  }
})
```

- [ ] **Step 4: Validate**

```
n8n_validate_workflow({ id: "<workflow-id>" })
```
Expected: 0 errors.

- [ ] **Step 5: Activate**

```
n8n_update_partial_workflow({
  id: "<workflow-id>",
  intent: "Activate Book Consultation workflow",
  operations: [{ type: "activateWorkflow" }]
})
```

### Task 1.6: Smoke-test Workflow B

- [ ] **Step 1: Happy-path curl**

Pick a future weekday at a likely-free time:
```bash
curl -sS -X POST https://n8n.srv983772.hstgr.cloud/webhook/book-consultation \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name":"Smoke Test",
    "customer_phone":"555-0199",
    "date":"2026-05-06",
    "time":"3:00 PM",
    "shipment_size":"1-bedroom apartment"
  }'
```
Expected response (`success: true`, populated `booking_id`):
```json
{"success":true,"booking_id":"...","confirmed_date":"2026-05-06","confirmed_time":"3:00 PM","message":"Consultation booked successfully"}
```
Verify: (a) Google Calendar shows new event "Sales Consultation — Smoke Test" at 3:00 PM CT on 2026-05-06; (b) confirmation email arrived in `szergej.soros@gmail.com`.

- [ ] **Step 2: Missing-field curl**

```bash
curl -sS -X POST https://n8n.srv983772.hstgr.cloud/webhook/book-consultation \
  -H "Content-Type: application/json" \
  -d '{"customer_name":"No Phone"}'
```
Expected: HTTP 400, `{"success":false,"error":"missing_fields"}`.

- [ ] **Step 3: Cleanup**

Delete the smoke-test event from Google Calendar.

### Task 1.7: Export workflows to JSON in repo

- [ ] **Step 1: Get each workflow JSON**

```
n8n_get_workflow({ id: "<send-lead-email-id>" })
n8n_get_workflow({ id: "<check-availability-id>" })
n8n_get_workflow({ id: "<book-consultation-id>" })
```

- [ ] **Step 2: Save each to disk**

Use the `Write` tool to create:
- `n8n-workflows/send-lead-email.json` — body of returned workflow.
- `n8n-workflows/check-availability.json`
- `n8n-workflows/book-consultation.json`

- [ ] **Step 3: Commit**

```bash
git add n8n-workflows/
git commit -m "Add n8n workflow exports for storage voice agent"
```

---

# Phase 2 — Knowledge base

### Task 2.1: Write `knowledge-base/knowledge-base.md`

**Files:** Create `knowledge-base/knowledge-base.md`.

- [ ] **Step 1: Write file**

Full content:

````markdown
# Crown Storage — Knowledge Base

## About Us
Crown Storage is a locally-owned storage and moving-storage facility serving the Springfield, Illinois area since 2009. We operate three facilities with over 1,200 individual units and serve both residential and business customers. We're not a franchise — every facility is run by people who live in the community.

## Storage Unit Sizes & Pricing
All prices are monthly. First month free with a 6-month commitment.

- **Small (5×5)** — about 25 sq ft. Fits 30–40 boxes, small furniture, seasonal items. **$59/month.**
- **Medium (10×10)** — about 100 sq ft. Fits the contents of a 1-bedroom apartment, including a queen bed and a couch. **$129/month.** *Most popular.*
- **Large (10×20)** — about 200 sq ft. Fits a 2–3 bedroom house. **$229/month.**
- **Extra Large (10×30)** — about 300 sq ft. Fits a full house plus a vehicle. **$329/month.**

Climate control is available on any size for an additional $30/month.

## Services
- Climate-controlled units (kept at 55–80°F year-round).
- 24/7 gated access via personal entry code.
- Moving supplies onsite (boxes, tape, bubble wrap, mattress covers).
- Truck rental partnership with U-Haul — book through us at a discount.
- Short-term and long-term contracts (month-to-month default).
- Business storage — inventory, archived files, equipment.
- Vehicle and RV storage at our north location.

## Security
- 24/7 video surveillance recorded and retained 30 days.
- Individual unit alarms — opening any unit without disarming triggers an alert.
- Gated entry with personal access code per customer.
- On-site manager weekdays 9 AM – 6 PM.
- Perimeter fencing and exterior lighting.

## Policies
- Month-to-month is the default; no long-term contract required.
- 30-day written notice required to vacate.
- Autopay required (credit card or ACH).
- $25 one-time admin fee on move-in.
- Insurance: $12/month basic coverage from us, or you can use your homeowner's/renter's policy.
- We accept Visa, Mastercard, AmEx, Discover, and ACH bank transfer.
- We do **not** accept cash on-site. Online payment only.
- Move-in special: first month free with a 6-month commit.

## FAQ

**Can I access my unit at night?**
Yes — gated access is 24/7 with your personal entry code. The office is staffed weekdays 9 AM – 6 PM and Saturdays 9 AM – 4 PM.

**Do I need insurance?**
Some kind of coverage is required. You can use ours ($12/month) or your existing homeowner's or renter's policy if it covers off-site storage.

**How do I pay?**
Autopay via credit card or ACH bank transfer. You'll set this up at move-in.

**What if I move out before my term is up?**
For month-to-month, just give 30 days written notice. For 6-month commits, the move-in special is forfeited if you leave early but there's no early-termination fee.

**Do you have boxes and supplies onsite?**
Yes — boxes, packing tape, bubble wrap, mattress covers, and locks are all available at the office.

**Do you store boats or RVs?**
Yes, at our north location. Pricing depends on length; please ask the sales rep when they call.

**What does "climate-controlled" mean?**
The unit is kept between 55 and 80 degrees Fahrenheit year-round, with humidity managed. It's recommended for electronics, wood furniture, photos, documents, and instruments.

**How do I get my gate code?**
You'll receive it by email after move-in paperwork is signed and your first payment clears.

## Contact
- **Phone:** (555) 123-7890
- **Email:** info@crownstorage.example
- **Address:** 2400 Industrial Way, Springfield, IL 62704
- **Office hours:** Monday–Friday 9 AM – 6 PM, Saturday 9 AM – 4 PM, Sunday closed.
- **Gate access:** 24 hours, every day.
````

- [ ] **Step 2: Commit**

```bash
git add knowledge-base/knowledge-base.md
git commit -m "Add Crown Storage knowledge base for voice agent"
```

---

# Phase 3 — ElevenLabs voice agent

For all Phase 3 tasks, **first invoke the `agents` skill** (ElevenLabs).

### Task 3.1: Determine agent creation path

**Files:** none.

- [ ] **Step 1: Invoke `agents` skill, check capabilities**

The skill defines what tools are available. Specifically check whether agent creation is API-driven (skill exposes a `create_agent` tool) or dashboard-only.

- [ ] **Step 2: Branch based on result**

- **If API path available** → proceed to Task 3.2 (auto creation).
- **If dashboard-only** → proceed to Task 3.3 (generate paste-ready package, ask user to create agent in dashboard, capture agent ID).

### Task 3.2: Create agent via API (if path available)

**Files:** none yet — agent ID is captured for `.env.local` later.

- [ ] **Step 1: Construct create-agent payload**

Required fields:
- `name`: "Crown Storage Assistant"
- `conversation_config`:
  - `agent.first_message`: `"Hi there! Welcome to Crown Storage. I'm here to help you with any questions about our storage solutions. How can I assist you today?"`
  - `agent.language`: `"en"`
  - `agent.prompt.prompt`: see Step 2 below.
  - `agent.prompt.temperature`: `0.7`
  - `tts.voice_id`: select a warm V3-compatible voice via `agents` skill's voice listing — record the chosen ID and name in `docs/setup-guide.md`.
- Tools: see Step 3.
- Knowledge base: see Step 4.

- [ ] **Step 2: System prompt text**

```
You are a friendly and professional AI assistant for Crown Storage, a storage and moving storage company. Your role is to:

1. GREET the caller warmly and introduce yourself
2. ANSWER any questions about storage services, pricing, unit sizes, locations, security features, access hours, and policies using the provided knowledge base
3. COLLECT lead information during the conversation naturally:
   - Customer full name
   - Customer phone number
   - Estimated size of the shipment/items they want to store (e.g., "a few boxes", "a 1-bedroom apartment", "full house contents")
4. SCHEDULE a consultation call with a sales representative when the customer is interested:
   - Use the check_availability tool to find open time slots
   - Present 2-3 available options to the customer
   - Use the book_consultation tool to confirm the booking
   - Confirm the date, time, and that a sales rep will call them

Conversation guidelines:
- Be conversational and natural — don't sound robotic or scripted
- Don't ask for all information at once. Collect it organically through the conversation
- If the customer asks a question not covered in the knowledge base, be honest and offer to have a sales rep follow up
- Always confirm details before booking (name, phone, preferred time)
- After booking, summarize: "Great, [name]! You're all set for [date/time]. Our sales rep will call you at [phone number]. Is there anything else I can help with?"
- Keep responses concise — this is a voice conversation, not a text chat
- Once you have collected the customer's name, phone, and shipment size, use the send_lead_email tool to send the lead details via email for follow-up

Speech style:
- Pronounce dollar amounts naturally (say "eighty-nine dollars" not "dollar sign eight nine")
- Read times naturally (say "ten AM" not "ten colon zero zero AM")
- Spell phone numbers as digit pairs when confirming back ("five five five, zero one zero zero")
```

- [ ] **Step 3: Tool definitions**

Three tools, each a webhook tool. Schema follows ElevenLabs' tool-config format (verify exact field names with the `agents` skill).

```json
{
  "name": "check_availability",
  "description": "Check available 30-minute time slots for a sales consultation call. Returns up to 6 open slots in the next 4 days, or a single day if preferred_date is given.",
  "type": "webhook",
  "url": "https://n8n.srv983772.hstgr.cloud/webhook/check-availability",
  "method": "POST",
  "request_body_schema": {
    "type": "object",
    "properties": {
      "preferred_date": {
        "type": "string",
        "description": "Preferred date in YYYY-MM-DD format (optional). If omitted, the agent gets the next 3 business days."
      }
    },
    "required": []
  }
}
```

```json
{
  "name": "book_consultation",
  "description": "Book a consultation call with a sales representative at a specific date and time.",
  "type": "webhook",
  "url": "https://n8n.srv983772.hstgr.cloud/webhook/book-consultation",
  "method": "POST",
  "request_body_schema": {
    "type": "object",
    "properties": {
      "customer_name": { "type": "string", "description": "Customer's full name" },
      "customer_phone": { "type": "string", "description": "Phone number for the sales rep to call" },
      "date": { "type": "string", "description": "Booking date in YYYY-MM-DD format" },
      "time": { "type": "string", "description": "Booking time as h:mm AM/PM, e.g. '10:00 AM'" },
      "shipment_size": { "type": "string", "description": "Estimated storage size, e.g. '1-bedroom apartment'" }
    },
    "required": ["customer_name", "customer_phone", "date", "time"]
  }
}
```

```json
{
  "name": "send_lead_email",
  "description": "Send an email with collected lead information for sales follow-up. Use once name, phone, and shipment size are collected, even if the caller hasn't booked yet.",
  "type": "webhook",
  "url": "https://n8n.srv983772.hstgr.cloud/webhook/send-lead-email",
  "method": "POST",
  "request_body_schema": {
    "type": "object",
    "properties": {
      "customer_name": { "type": "string" },
      "customer_phone": { "type": "string" },
      "shipment_size": { "type": "string" },
      "notes": { "type": "string", "description": "Any extra context from the conversation (optional)" }
    },
    "required": ["customer_name", "customer_phone", "shipment_size"]
  }
}
```

- [ ] **Step 4: Knowledge base attachment**

Upload `knowledge-base/knowledge-base.md` to the agent. Method depends on `agents` skill API — typically a multi-step: create document → attach to agent.

- [ ] **Step 5: Verify and capture agent ID**

After creation, the API returns an agent ID. Save it. Hand it to the user; the user will paste it into `.env.local` in Phase 4.

### Task 3.3: Manual agent creation fallback (if API path not available)

Skip if Task 3.2 succeeded.

- [ ] **Step 1: Generate setup-guide.md**

Create `docs/setup-guide.md` with click-by-click ElevenLabs dashboard instructions:
1. Open `https://elevenlabs.io/app/conversational-ai`.
2. Click "Create Agent" → name "Crown Storage Assistant".
3. Voice tab: select a V3-compatible voice (recommend testing 2–3 warm voices and picking one). Document the chosen voice in this file.
4. Behavior tab: paste the first message and the system prompt from Task 3.2 Steps 1–2.
5. Knowledge tab: upload `knowledge-base/knowledge-base.md`.
6. Tools tab: create three custom tools using the JSON from Task 3.2 Step 3 (the dashboard accepts each tool's schema as a form — copy fields from the JSON).
7. Save → copy the agent ID from the URL or "Embed" tab.

- [ ] **Step 2: User completes dashboard setup**

User performs the steps and reports back with the agent ID.

- [ ] **Step 3: Commit setup guide**

```bash
git add docs/setup-guide.md
git commit -m "Add ElevenLabs agent manual setup guide"
```

### Task 3.4: Test the agent in the ElevenLabs playground

**Files:** none.

- [ ] **Step 1: Open agent's playground**

In ElevenLabs dashboard, open the agent and click "Test agent" (or equivalent).

- [ ] **Step 2: Scenario A — info-only conversation**

Have a voice/text conversation. Ask: "What sizes do you have? How much is the medium one? Do you have climate control?"
Expect: agent answers from knowledge base. No tool calls.

- [ ] **Step 3: Scenario B — full booking flow**

Conversation: "I want to store a 1-bedroom apartment. My name is Demo Tester, phone five five five, zero zero zero one. Can I book a call?"
Expect: agent calls `check_availability`, presents slots, you pick one, agent calls `book_consultation`, confirms back. Verify: Google Calendar event created, confirmation email arrived.

- [ ] **Step 4: Scenario C — abandoned-before-booking**

Conversation: provide name, phone, and shipment size, then say "Actually I'll think about it, thanks."
Expect: agent calls `send_lead_email` before goodbye. Verify lead email arrived.

- [ ] **Step 5: Cleanup**

Delete any Calendar events created during testing.

---

# Phase 4 — Landing page

### Task 4.1: Update brand tokens in `globals.css`

**Files:** Modify `src/app/globals.css`.

- [ ] **Step 1: Replace globals.css**

Full new contents:

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #0f172a;
  --color-brand-deep: #1e3a5f;
  --color-brand: #2563a8;
  --color-warm: #f5f1ea;
  --color-accent: #f59e0b;
  --color-accent-hover: #d97706;
  --color-ink: #0f172a;
  --color-muted: #475569;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-brand-deep: var(--color-brand-deep);
  --color-brand: var(--color-brand);
  --color-warm: var(--color-warm);
  --color-accent: var(--color-accent);
  --color-accent-hover: var(--color-accent-hover);
  --color-ink: var(--color-ink);
  --color-muted: var(--color-muted);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), system-ui, sans-serif;
}
```

(Removed the dark-mode auto-switch — Crown Storage's design uses one consistent palette.)

- [ ] **Step 2: Verify build**

```bash
npm run lint
npm run build
```
Expected: both pass without errors. (Build will still render the placeholder `page.tsx`; that's fine until Task 4.10.)

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "Add Crown Storage brand color tokens"
```

### Task 4.2: Create `ConvaiWidget.tsx` client component

**Files:** Create `src/components/ConvaiWidget.tsx`.

- [ ] **Step 1: Write the file**

```tsx
"use client";

import { useEffect } from "react";

const SCRIPT_SRC = "https://elevenlabs.io/convai-widget/index.js";
const SCRIPT_ID = "elevenlabs-convai-script";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { "agent-id"?: string },
        HTMLElement
      >;
    }
  }
}

export default function ConvaiWidget() {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(SCRIPT_ID)) return;
    const s = document.createElement("script");
    s.id = SCRIPT_ID;
    s.src = SCRIPT_SRC;
    s.async = true;
    document.head.appendChild(s);
  }, []);

  if (!agentId) return null;
  return <elevenlabs-convai agent-id={agentId} />;
}

export function openConvaiWidget() {
  if (typeof document === "undefined") return;
  const el = document.querySelector("elevenlabs-convai") as HTMLElement | null;
  if (!el) return;
  const button = el.shadowRoot?.querySelector("button") as HTMLButtonElement | null;
  button?.click();
}
```

(`openConvaiWidget` is a helper that section components import to wire CTA buttons to the floating widget.)

- [ ] **Step 2: Lint check**

```bash
npm run lint
```
Expected: pass. If TypeScript complains about JSX intrinsic, the `declare global` block above resolves it.

- [ ] **Step 3: Commit**

```bash
git add src/components/ConvaiWidget.tsx
git commit -m "Add ConvaiWidget client component for ElevenLabs embed"
```

### Task 4.3: Update `layout.tsx` — title, meta, mount widget

**Files:** Modify `src/app/layout.tsx`.

- [ ] **Step 1: Replace layout.tsx**

Full new contents:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ConvaiWidget from "@/components/ConvaiWidget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crown Storage — Storage that gets out of your way",
  description:
    "Climate-controlled storage units, 24/7 gated access, and a real person on call. Talk to our AI assistant to get a unit picked for you in under 5 minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-warm text-ink">
        {children}
        <ConvaiWidget />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Lint + build**

```bash
npm run lint
npm run build
```
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "Wire ConvaiWidget into root layout and update metadata"
```

### Task 4.4: Create Hero section

**Files:** Create `src/components/sections/Hero.tsx`.

- [ ] **Step 1: Write the file**

```tsx
"use client";

import { openConvaiWidget } from "@/components/ConvaiWidget";

export default function Hero() {
  return (
    <section className="bg-brand-deep text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-20 sm:py-28 lg:py-32">
        <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-white/90">
          Locally owned · Springfield, IL · Since 2009
        </span>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Storage that gets out of your way.
        </h1>
        <p className="max-w-2xl text-lg text-white/80 sm:text-xl">
          Climate-controlled units, 24/7 gated access, and a real person on call.
          Talk to our AI assistant — it&apos;ll size your unit and book a 15-minute
          consultation in under five minutes.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={openConvaiWidget}
            className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Talk to our AI assistant
          </button>
          <a
            href="#pricing"
            className="inline-flex items-center justify-center rounded-md border border-white/30 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            See pricing
          </a>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-white/80 sm:grid-cols-4">
          <div>
            <dt className="text-white/60">Customers</dt>
            <dd className="text-lg font-semibold text-white">4,000+</dd>
          </div>
          <div>
            <dt className="text-white/60">Access</dt>
            <dd className="text-lg font-semibold text-white">24 / 7</dd>
          </div>
          <div>
            <dt className="text-white/60">Climate</dt>
            <dd className="text-lg font-semibold text-white">55–80°F</dd>
          </div>
          <div>
            <dt className="text-white/60">Contracts</dt>
            <dd className="text-lg font-semibold text-white">Month-to-month</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Lint**

```bash
npm run lint
```
Expected: pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "Add Hero section"
```

### Task 4.5: Create Services section

**Files:** Create `src/components/sections/Services.tsx`.

- [ ] **Step 1: Write the file**

```tsx
const services = [
  {
    title: "Personal storage",
    body: "Boxes, furniture, seasonal gear. Sizes from 5×5 closet to full-house 10×30.",
  },
  {
    title: "Business storage",
    body: "Inventory, archived files, equipment. Bulk-rate plans available for 3+ units.",
  },
  {
    title: "Climate-controlled",
    body: "Kept 55–80°F year-round with humidity managed. For electronics, wood, photos.",
  },
  {
    title: "Vehicle & RV",
    body: "Outdoor and covered options at our north location. Boats, RVs, project cars.",
  },
];

export default function Services() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            What we store
          </h2>
          <p className="mt-3 text-lg text-muted">
            Four categories, all on the same gated, monitored property.
          </p>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <li
              key={s.title}
              className="rounded-lg border border-black/5 bg-warm p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{s.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/sections/Services.tsx
git commit -m "Add Services section"
```

### Task 4.6: Create HowItWorks section

**Files:** Create `src/components/sections/HowItWorks.tsx`.

- [ ] **Step 1: Write the file**

```tsx
const steps = [
  {
    n: 1,
    title: "Talk to our AI",
    body: "It asks about what you're storing and walks you through the right size.",
  },
  {
    n: 2,
    title: "Book a consult",
    body: "Pick a 15-minute slot. A real person calls you to lock in details.",
  },
  {
    n: 3,
    title: "Move in same week",
    body: "Sign paperwork, get a gate code, and start moving in — usually within 3 days.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-warm py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            How it works
          </h2>
        </div>
        <ol className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.n}
              className="rounded-lg border border-black/5 bg-white p-6 shadow-sm"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white text-sm font-bold">
                {s.n}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/sections/HowItWorks.tsx
git commit -m "Add HowItWorks section"
```

### Task 4.7: Create Pricing section

**Files:** Create `src/components/sections/Pricing.tsx`.

- [ ] **Step 1: Write the file**

```tsx
"use client";

import { openConvaiWidget } from "@/components/ConvaiWidget";

const tiers = [
  {
    name: "Small",
    size: "5 × 5",
    sqft: "≈ 25 sq ft",
    price: 59,
    fits: "Boxes, small furniture, seasonal items.",
    popular: false,
  },
  {
    name: "Medium",
    size: "10 × 10",
    sqft: "≈ 100 sq ft",
    price: 129,
    fits: "1-bedroom apartment with bed, couch, and boxes.",
    popular: true,
  },
  {
    name: "Large",
    size: "10 × 20",
    sqft: "≈ 200 sq ft",
    price: 229,
    fits: "2–3 bedroom house contents.",
    popular: false,
  },
  {
    name: "Extra Large",
    size: "10 × 30",
    sqft: "≈ 300 sq ft",
    price: 329,
    fits: "Full house plus a vehicle.",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Pricing
          </h2>
          <p className="mt-3 text-lg text-muted">
            Month-to-month. First month free with a 6-month commit. Climate
            control adds $30/month on any size.
          </p>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((t) => (
            <li
              key={t.name}
              className={`relative rounded-lg border p-6 shadow-sm ${
                t.popular
                  ? "border-accent bg-warm"
                  : "border-black/5 bg-white"
              }`}
            >
              {t.popular && (
                <span className="absolute -top-3 right-4 inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold text-ink">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-ink">{t.name}</h3>
              <p className="text-sm text-muted">
                {t.size} · {t.sqft}
              </p>
              <p className="mt-4">
                <span className="text-3xl font-bold text-ink">${t.price}</span>
                <span className="text-sm text-muted"> / month</span>
              </p>
              <p className="mt-3 text-sm leading-6 text-muted">{t.fits}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={openConvaiWidget}
            className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-accent-hover"
          >
            Not sure which size? Ask our AI
          </button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/sections/Pricing.tsx
git commit -m "Add Pricing section"
```

### Task 4.8: Create FAQ section

**Files:** Create `src/components/sections/FAQ.tsx`.

- [ ] **Step 1: Write the file**

```tsx
const faqs = [
  {
    q: "Can I access my unit at night?",
    a: "Yes — gated access is 24/7 with your personal entry code. The office is staffed weekdays 9–6 and Saturdays 9–4.",
  },
  {
    q: "Do I need insurance?",
    a: "Some kind of coverage is required. You can use ours ($12/month) or your existing homeowner's or renter's policy if it covers off-site storage.",
  },
  {
    q: "How do I pay?",
    a: "Autopay via credit card or ACH bank transfer. We don't accept cash on-site.",
  },
  {
    q: "What if I move out before my term is up?",
    a: "Month-to-month means just 30 days written notice. On a 6-month commit, the move-in special is forfeited if you leave early — but no early-termination fee.",
  },
  {
    q: "Do you have boxes and supplies onsite?",
    a: "Yes — boxes, packing tape, bubble wrap, mattress covers, and locks are at the office.",
  },
  {
    q: "Do you store boats and RVs?",
    a: "Yes, at our north location. Pricing depends on length — ask the sales rep when they call.",
  },
  {
    q: "What does climate-controlled actually mean?",
    a: "We hold the unit between 55 and 80°F year-round, with humidity managed. Recommended for electronics, wood furniture, photos, documents, and instruments.",
  },
  {
    q: "How do I get my gate code?",
    a: "By email after move-in paperwork is signed and your first payment clears.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-warm py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Frequently asked
        </h2>
        <ul className="mt-10 divide-y divide-black/10 rounded-lg border border-black/5 bg-white">
          {faqs.map((f) => (
            <li key={f.q}>
              <details className="group p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-ink">
                  {f.q}
                  <span className="ml-4 text-muted transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-muted">{f.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/sections/FAQ.tsx
git commit -m "Add FAQ section"
```

### Task 4.9: Create Contact section

**Files:** Create `src/components/sections/Contact.tsx`.

- [ ] **Step 1: Write the file**

```tsx
"use client";

import { openConvaiWidget } from "@/components/ConvaiWidget";

export default function Contact() {
  return (
    <section className="bg-brand-deep py-20 text-white sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to talk?
            </h2>
            <p className="mt-3 max-w-xl text-lg text-white/80">
              Our AI assistant is the fastest way to get a quote. It can also
              book you a 15-minute call with a real person.
            </p>
            <button
              type="button"
              onClick={openConvaiWidget}
              className="mt-8 inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-base font-semibold text-ink transition-colors hover:bg-accent-hover"
            >
              Talk to our AI assistant
            </button>
          </div>
          <dl className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-white/60">Phone</dt>
              <dd className="mt-1 text-base font-semibold">(555) 123-7890</dd>
            </div>
            <div>
              <dt className="text-white/60">Address</dt>
              <dd className="mt-1 text-base font-semibold">
                2400 Industrial Way
                <br />
                Springfield, IL 62704
              </dd>
            </div>
            <div>
              <dt className="text-white/60">Office hours</dt>
              <dd className="mt-1 text-base font-semibold">
                Mon–Fri 9–6
                <br />
                Sat 9–4 · Sun closed
              </dd>
            </div>
            <div>
              <dt className="text-white/60">Gate access</dt>
              <dd className="mt-1 text-base font-semibold">24 / 7 every day</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Lint + commit**

```bash
npm run lint
git add src/components/sections/Contact.tsx
git commit -m "Add Contact section"
```

### Task 4.10: Replace `page.tsx` to compose sections

**Files:** Modify `src/app/page.tsx`.

- [ ] **Step 1: Replace page.tsx**

Full new contents:

```tsx
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Services />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <Contact />
    </main>
  );
}
```

- [ ] **Step 2: Lint + build**

```bash
npm run lint
npm run build
```
Expected: both pass.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "Replace scaffold page with Crown Storage landing page"
```

### Task 4.11: Wire `NEXT_PUBLIC_ELEVENLABS_AGENT_ID`

**Files:** Create `.env.local`.

- [ ] **Step 1: Confirm `.env.local` is gitignored**

Open `.gitignore`. If it doesn't already cover `.env*.local`, add:
```
.env.local
```

- [ ] **Step 2: Create `.env.local`**

```
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=<paste-agent-id-from-task-3.2-or-3.3>
```

- [ ] **Step 3: Commit `.gitignore` change (if any)**

```bash
git add .gitignore
git commit -m "Ignore .env.local"
```

(`.env.local` itself never gets committed.)

### Task 4.12: Local dev verification

**Files:** none.

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Open in browser**

Navigate to `http://localhost:3000`. Expected:
- Page renders all 6 sections.
- Floating ElevenLabs widget visible bottom-right.
- Hero CTA "Talk to our AI assistant" opens the widget conversation.
- No console errors except possibly fonts/network on first paint.

- [ ] **Step 3: Mobile responsive check**

Open browser dev tools → device emulation → iPhone 12 (390×844). Verify:
- All sections stack vertically without overflow.
- Hero CTAs stack vertically (sm breakpoint).
- Pricing cards become 2-column on tablet, 1-column on phone.
- Widget button stays in viewport, not clipped.

- [ ] **Step 4: Production build**

```bash
npm run build
npm run start
```
Open `http://localhost:3000`. Same verification as Step 2.

- [ ] **Step 5: Stop server**

Ctrl-C.

---

# Phase 5 — End-to-end test

### Task 5.1: Full conversation flow end-to-end

**Files:** none.

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Conduct full booking conversation**

In the browser at `http://localhost:3000`:
1. Click "Talk to our AI assistant" in the hero.
2. Allow microphone access.
3. Speak: "Hi, I want to store stuff from a 1-bedroom apartment. My name is E2E Test, phone five five five, zero one nine nine."
4. Ask about pricing: "How much would that cost?"
5. Ask to book: "Can I book a consultation?"
6. Pick the first time the agent offers.
7. Confirm booking.

- [ ] **Step 3: Verify all three side-effects**

- Google Calendar: new event "Sales Consultation — E2E Test" at the chosen time.
- Email inbox `szergej.soros@gmail.com`: booking confirmation email.
- Email inbox: lead email (the agent should have called `send_lead_email` once name+phone+size were collected).

- [ ] **Step 4: Cleanup**

Delete the test calendar event.

- [ ] **Step 5: Stop dev server**

Ctrl-C.

### Task 5.2: Mobile end-to-end (best effort)

**Files:** none.

- [ ] **Step 1: Expose dev server to local network or use a phone browser via dev tools emulation**

If easy: `npm run dev -- -H 0.0.0.0`, then open `http://<your-ip>:3000` on a phone on the same Wi-Fi.

If not: use Chrome DevTools device emulation at iPhone 12 size and run through the same flow as Task 5.1, but via text-mode if mic isn't available in emulation.

- [ ] **Step 2: Verify**

Same three side-effects as Task 5.1 Step 3. Confirm widget remains usable on mobile width.

- [ ] **Step 3: Cleanup test event.**

### Task 5.3 (optional): Error Trigger workflow

Skip if implementation runs short.

**Files:** managed in n8n; export to `n8n-workflows/error-handler.json`.

- [ ] **Step 1: Create workflow**

```
n8n_create_workflow({
  name: "Crown Storage — Error Handler",
  nodes: [
    { id: "trigger", name: "Error Trigger", type: "n8n-nodes-base.errorTrigger", typeVersion: 1, position: [240, 300], parameters: {} },
    { id: "gmail", name: "Notify on Error", type: "n8n-nodes-base.gmail", typeVersion: 2.1, position: [480, 300],
      parameters: {
        resource: "message", operation: "send",
        sendTo: "szergej.soros@gmail.com",
        subject: "=Crown Storage workflow failure: {{ $json.execution.error.message }}",
        emailType: "html",
        message: "=<h2>Workflow failure</h2><p><strong>Workflow:</strong> {{ $json.workflow.name }}</p><p><strong>Execution:</strong> {{ $json.execution.url }}</p><pre>{{ JSON.stringify($json.execution.error, null, 2) }}</pre>",
        options: {}
      },
      credentials: { gmailOAuth2: { id: "<gmail-cred-id>", name: "<gmail-cred-name>" } } }
  ],
  connections: { "Error Trigger": { "main": [[{ "node": "Notify on Error", "type": "main", "index": 0 }]] } }
})
```

- [ ] **Step 2: Validate + activate**

Same pattern as Tasks 1.x.

- [ ] **Step 3: Wire each main workflow to use this error workflow**

For each of the three main workflows, run:
```
n8n_update_partial_workflow({
  id: "<main-workflow-id>",
  intent: "Set Error Handler as the workflow-level error workflow",
  operations: [{ type: "updateSettings", settings: { errorWorkflow: "<error-handler-workflow-id>" } }]
})
```

- [ ] **Step 4: Export and commit**

```
n8n_get_workflow({ id: "<error-handler-id>" })
```
Save to `n8n-workflows/error-handler.json`.

```bash
git add n8n-workflows/error-handler.json
git commit -m "Add error handler workflow for storage voice agent"
```

---

# Done

At this point:
- Three n8n workflows are running and have been smoke-tested.
- An ElevenLabs agent is configured with KB and three tools.
- A static Next.js landing page composes six sections and embeds the widget.
- End-to-end booking flow works in the browser — Calendar event created, two emails sent.

Hardening (deferred): webhook `X-API-Key` auth, rate limiting, accessibility audit, real-content polish.
