# Crown Storage Voice Agent — Design Spec

**Date:** 2026-05-02
**Source PRD:** `prd-storage-voice-agent` (repo root)
**Status:** approved, ready for implementation plan

---

## 1. Goal

Ship a single-page Crown Storage marketing site with an embedded ElevenLabs voice agent that answers prospect questions, collects lead info (name, phone, estimated shipment size), checks Google Calendar availability, books consultation calls, and emails lead details — all without a custom backend. The voice agent's tools call self-hosted n8n webhooks, and n8n owns the integrations with Google Calendar and Gmail.

---

## 2. Architecture

```
Visitor browser
     │
     ▼
Next.js landing page (single static route — src/app/page.tsx)
     │  embeds <elevenlabs-convai> web component (floating button, bottom-right)
     ▼
ElevenLabs Voice Agent (cloud)
   • V3 Expressive voice
   • System prompt
   • Knowledge base = knowledge-base.md
   • 3 server tools → n8n webhooks
     │
     ▼
n8n (https://n8n.srv983772.hstgr.cloud)
   • POST /webhook/check-availability
   • POST /webhook/book-consultation
   • POST /webhook/send-lead-email
     │
     ▼
Google Calendar (primary calendar) + Gmail (sends to szergej.soros@gmail.com)
```

No custom backend. Bookings live in Google Calendar; leads live in inbox.

---

## 3. Locked decisions

| Decision | Choice | Reason |
|---|---|---|
| Landing-page tech | Existing Next.js 16 / React 19 / Tailwind v4 scaffold | Already in place; static export possible |
| Widget integration | Official `<elevenlabs-convai>` web component via `<script>` tag | Simpler than SDK; widget owns the floating-button UI |
| Email transport | n8n Gmail node (OAuth2) | Same Google account as Calendar, single OAuth |
| Lead destination | `szergej.soros@gmail.com` | User-confirmed |
| KB content | Fictional plausible Crown Storage (US suburban, Springfield IL) | Demo project; no real business behind it |
| Widget trigger | Floating button only | Less intrusive |
| Voice | One V3 Expressive voice picked at build time, documented in spec | Easy to swap; not worth a survey at this stage |
| Webhook auth | None (MVP) | PRD allows; `X-API-Key` deferred to hardening |
| Timezone | `America/Chicago` (matches fictional Springfield, IL location) | One-line change in n8n Set node if relocated |

---

## 4. Build/manual split

### Built by Claude
- Landing page (all sections, brand tokens, widget mount).
- `knowledge-base/knowledge-base.md`.
- Three n8n workflows via `n8n_create_workflow` + `n8n_update_partial_workflow`, validated via `validate_node` and `n8n_validate_workflow`, exported to `n8n-workflows/*.json` as backup.
- Optional Error Trigger workflow that emails on workflow failure.
- Setup guide doc with click-by-click instructions for the manual steps below.
- ElevenLabs agent configuration (system prompt, tool JSON, KB upload). If the installed `agents` skill can create agents via API, Claude will create it directly. Otherwise Claude generates a paste-ready dashboard configuration package and the user clicks through once.

### Done manually by user (in browser)
1. n8n credentials UI — create **Google Calendar OAuth2 API** credential (one-time OAuth consent).
2. n8n credentials UI — create **Gmail OAuth2 API** credential (same Google account, separate n8n credential).
3. Activate the three workflows in n8n once Claude reports them validated.
4. If agent must be created manually: create agent in ElevenLabs dashboard following Claude's guide; copy agent ID to `.env.local`.
5. End-to-end test pass.

---

## 5. Component A — Landing page

### File layout

```
src/
  app/
    layout.tsx          ← UPDATE: title, meta, mount <ConvaiWidget /> here
    page.tsx            ← REPLACE: composes section components
    globals.css         ← UPDATE: brand tokens in @theme inline
  components/
    ConvaiWidget.tsx    ← NEW (client): injects script + custom element
    sections/
      Hero.tsx
      Services.tsx
      HowItWorks.tsx
      Pricing.tsx
      FAQ.tsx
      Contact.tsx
.env.local              ← NEW: NEXT_PUBLIC_ELEVENLABS_AGENT_ID=...
```

Path alias `@/* → src/*` already configured in `tsconfig.json`.

### Sections

1. **Hero** — Headline + sub-copy + primary CTA "Talk to our AI assistant" + trust strip ("4,000+ customers", "24/7 access", "Climate controlled").
2. **Services** — 4-card grid: Personal / Business / Climate-controlled / Vehicle. Icon + 1-line each.
3. **How It Works** — 3-step horizontal: Talk to our AI → Book a consult → Move in same week.
4. **Pricing** — 4 tiers (5×5, 10×10, 10×20, 10×30): monthly price + sq ft + "fits a..." description. 10×10 highlighted as "most popular".
5. **FAQ** — 6–8 collapsible Q&A using native `<details>` (no JS).
6. **Contact / CTA** — Final panel: phone, address, second AI-assistant CTA.

All section components are server components (static markup); only `ConvaiWidget` is client.

### Brand tokens (Tailwind v4 `@theme inline {}`)

- `--color-brand-deep`: `#1e3a5f` (industrial blue)
- `--color-brand`: `#2563a8`
- `--color-warm`: `#f5f1ea` (warm neutral)
- `--color-accent`: `#f59e0b` (amber — CTAs)
- `--color-ink`: `#0f172a`

### Widget mount

`ConvaiWidget.tsx` is a client component, mounted once in `layout.tsx`:

1. On mount, append `<script src="https://elevenlabs.io/convai-widget/index.js" async>` to `<head>` if not already present.
2. Render `<elevenlabs-convai agent-id={process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID}>`.
3. Hero CTA button dispatches a click on the widget's button element to open the conversation. Falls back to scroll-to-FAQ if the widget isn't mounted yet.
4. `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` is public (agent IDs are not secret).

### Performance budget

- `npm run build` produces a static page (no server runtime needed). Goal: <3s load on mobile (PRD success criterion). Single ElevenLabs script is the only third-party network call before user interaction.

---

## 6. Component B — ElevenLabs voice agent

### Settings

| Setting | Value |
|---|---|
| Voice model | V3 (Expressive) |
| Voice | Warm/professional V3-compatible voice; final choice documented in setup guide |
| LLM | ElevenLabs default (Gemini Flash / GPT-4o-mini class) |
| Temperature | 0.7 |
| Language | English |

### First message

> "Hi there! Welcome to Crown Storage. I'm here to help you with any questions about our storage solutions. How can I assist you today?"

### System prompt

PRD verbatim, with two additions:
- "Pronounce dollar amounts naturally (e.g. 'eighty-nine dollars', not 'dollar sign eight nine')."
- "Read times naturally (e.g. 'ten AM', not 'ten colon zero zero AM')."

### Knowledge base content (`knowledge-base/knowledge-base.md`)

- **About** — Crown Storage, locally owned, serving Springfield IL since 2009, 3 facilities, 1,200+ units.
- **Pricing (monthly)** — 5×5 = $59, 10×10 = $129, 10×20 = $229, 10×30 = $329. First month free on 6-month commits. Climate control adds $30/mo.
- **Services** — climate control, U-Haul truck partnership, moving supplies onsite, business storage, short/long-term.
- **Security** — 24/7 video, individual unit alarms, gated entry with personal code, on-site manager weekdays.
- **Policies** — month-to-month default, 30-day notice to vacate, autopay required, $25 admin fee, insurance $12/mo or use homeowner's.
- **FAQ** — ~8 Q&A: night access, insurance, payment, early move-out, supplies, boat/RV, climate-control meaning, gate code.
- **Contact** — phone `(555) 123-7890`, address `2400 Industrial Way, Springfield, IL 62704`, hours: office Mon–Fri 9–6, Sat 9–4, Sun closed (gate access 24/7).

### Custom tools (3)

All POST, response mode "Last Node". Names, params, and response shapes match PRD section "Agent Tools".

| Tool | URL | Required params |
|---|---|---|
| `check_availability` | `https://n8n.srv983772.hstgr.cloud/webhook/check-availability` | none (`preferred_date` optional, `YYYY-MM-DD`) |
| `book_consultation` | `https://n8n.srv983772.hstgr.cloud/webhook/book-consultation` | `customer_name`, `customer_phone`, `date`, `time` (`shipment_size` optional) |
| `send_lead_email` | `https://n8n.srv983772.hstgr.cloud/webhook/send-lead-email` | `customer_name`, `customer_phone`, `shipment_size` (`notes` optional) |

System-prompt rule: agent calls `send_lead_email` once name + phone + size are collected, even if no booking happens — so abandoned-pre-booking calls still produce a lead.

---

## 7. Component C — n8n workflows

### Conventions

- Created via `n8n_create_workflow` MCP tool; iterated with `n8n_update_partial_workflow` (always supplying `intent`).
- Each workflow validated via `validate_node` per node and `n8n_validate_workflow` end-to-end before activation.
- Webhook auth: none (MVP).
- All Code nodes use try/catch and return safe defaults on error.
- Each workflow exported to `n8n-workflows/<name>.json` for version control.

### Workflow A — `check-availability`

`POST /webhook/check-availability` — body: `{ preferred_date?: "YYYY-MM-DD" }`

```
[Webhook]
  → [Set: dateRange]
        if body.preferred_date → single day
        else → today + next 3 business days
        constants: businessHoursStart=9, businessHoursEnd=17, slotMinutes=30, tz="America/Chicago"
  → [Google Calendar: Get Many Events]   calendar=primary, timeMin=range.start, timeMax=range.end
  → [Code (JavaScript): generateSlots]
        - Build 30-min slots in business hours across range
        - Skip Sat/Sun
        - Drop any slot overlapping an existing event
        - Return up to 6 slots: { date, time, day }
        - try/catch; on error return []
  → [Respond to Webhook]   { available_slots: [...] }
```

### Workflow B — `book-consultation`

`POST /webhook/book-consultation` — body: `{ customer_name, customer_phone, date, time, shipment_size? }`

```
[Webhook]
  → [IF: validate]   customer_name && customer_phone && date && time
       false → [Respond to Webhook]   400 { success:false, error:"missing_fields" }
       true  → [Set: composeDateTime]
                  startISO = `${date}T${parseTime(time)}`
                  endISO   = startISO + 30min
            → [Google Calendar: Create Event]
                  calendar = primary
                  summary  = "Sales Consultation — {{ $json.customer_name }}"
                  description = "Phone: {{...}}\nEstimated storage: {{... || 'not specified'}}\nBooked via Crown Storage AI Voice Agent"
                  start = startISO, end = endISO, timezone = America/Chicago
            → [Gmail: Send]
                  to: szergej.soros@gmail.com
                  subject: "Booking confirmed — {{ name }} on {{ date }} {{ time }}"
                  html: name, phone, shipment_size, time, event ID
            → [Set: response]   booking_id = calendar event id
            → [Respond to Webhook]   { success:true, booking_id, confirmed_date, confirmed_time, message }
```

### Workflow C — `send-lead-email`

`POST /webhook/send-lead-email` — body: `{ customer_name, customer_phone, shipment_size, notes? }`

```
[Webhook]
  → [IF: validate]   customer_name && customer_phone
       false → [Respond to Webhook]   400 { success:false, error:"missing_fields" }
       true  → [Gmail: Send]
                  to: szergej.soros@gmail.com
                  subject: "New Crown Storage Lead: {{ customer_name }}"
                  html: name, phone, shipment_size, notes, timestamp, branded footer
            → [Respond to Webhook]   { success:true, message:"Lead email sent successfully" }
```

### Optional — Error monitoring workflow

A 3-node Error Trigger workflow that catches any failure in the three above and sends a notification email to `szergej.soros@gmail.com`. Built last; can be skipped if implementation runs short.

---

## 8. Build order

1. **n8n credentials prerequisite (manual, user)** — Google Calendar OAuth2 + Gmail OAuth2.
2. **Workflow C** — Send Lead Email (simplest; validates Gmail + webhook pattern).
3. **Workflow A** — Check Availability (validates Calendar + slot generation logic).
4. **Workflow B** — Book Consultation (depends on Calendar working).
5. **`curl` smoke test** of each webhook from Bash.
6. **Knowledge base** file written.
7. **ElevenLabs agent** created (auto via skill, or manual via dashboard with Claude-supplied JSON).
8. **Landing page** built; agent ID wired via `NEXT_PUBLIC_ELEVENLABS_AGENT_ID`.
9. **End-to-end test** — run `npm run dev`, open browser, talk to agent, verify calendar event + emails.
10. **Polish** — copy, mobile breakpoints, any last design tweaks.
11. **(Optional)** Error Trigger workflow.

---

## 9. Error handling

- **Code node failures (slot generation):** try/catch, return `[]` so the agent says "I'm not finding open slots right now".
- **Webhook validation failures:** structured 400 with `{ success:false, error:"missing_fields" }` so the agent can react gracefully.
- **Google Calendar / Gmail API failures:** propagate via Error Trigger workflow → notification email.
- **ElevenLabs widget script fails to load:** Hero CTA falls back to scroll-to-FAQ instead of dispatching a click on a non-existent element.
- **Agent ID env var missing in production:** widget renders but won't connect; document this in setup guide.

---

## 10. Testing strategy

No test runner is configured (per `CLAUDE.md`). Verification is manual + smoke-test driven:

- **Per-workflow:** `curl` POST against each webhook with valid + invalid payloads; assert response shape.
- **Agent prompt:** test in ElevenLabs playground with three scripted conversations: (a) info-only no booking, (b) full booking flow, (c) abandons before booking but gives name+phone+size (verify `send_lead_email` fires).
- **End-to-end:** `npm run dev` → browser → click widget → run booking flow → assert (1) Google Calendar event exists, (2) booking confirmation email arrived, (3) lead email arrived.
- **Mobile check:** open on phone or use browser device emulator at 375×667; verify <3s LCP.

---

## 11. Out of scope (deferred)

- Webhook `X-API-Key` auth.
- Rate limiting.
- Per-call analytics dashboard.
- Real-time slot reservation (we're checking availability at call time, no hold).
- Multi-language support.
- A/B testing widget triggers.
- CMS-driven knowledge base (file is fine for one location).

---

## 12. Success criteria (from PRD)

- Voice agent greets naturally and handles common storage questions.
- Agent collects name, phone, shipment size without sounding like a form.
- Calendar availability check returns real open slots.
- Booking creates a confirmed Google Calendar event.
- Lead email arrives after each call with collected info.
- Landing page loads in <3s, looks professional on mobile.
- End-to-end flow: visitor → speaks with agent → books consult → event in calendar + lead email received.
