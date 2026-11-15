# REVIEW — RepairQuote Check (repairquote-check)

Verification and Quality Gate Report for **RepairQuote Check**.

---

## 1. Visual & Media Assets Verification (`node scripts/generate-media.mjs`)

| Asset Path | Dimensions / Type | Verification Status | Purpose |
|---|---|---|---|
| `media/logo.png` & `public/logo.png` | 1024×1024 PNG (1:1) | **VERIFIED (100% Transparent Alpha)** | Minimalist 3D vector app icon; solid white background stripped programmatically (462,661 alpha pixels). |
| `media/cover.png` | 1376×768 PNG (16:9) | **VERIFIED (Text-Free)** | Photorealistic domain cover photograph for Sensifai Marketplace listing. |
| `public/images/hero.jpg` | 16:9 Widescreen JPG | **VERIFIED (Cinematic)** | Editorial photograph of technician inspecting residential water heater and copper piping with warm terracotta lighting accents. |
| `public/images/feature-1.jpg` | 16:9 Widescreen JPG | **VERIFIED (Macro)** | Visible-scope damage estimation showing residential plumbing fittings, pressure gauge, and diagnostic tools. |
| `public/images/feature-2.jpg` | 16:9 Widescreen JPG | **VERIFIED (Studio)** | Quote line-item extraction showing contractor desk, calipers, blueprints, and digital telemetry screen. |
| `public/images/feature-3.jpg` | 16:9 Widescreen JPG | **VERIFIED (Tabletop)** | Regional price-band comparison and contractor negotiation tabletop with floor plans and tablet. |
| `media/platform-mockup.png` | 1280×720 PNG (16:9) | **VERIFIED (Live UI Capture)** | Real desktop screenshot of the running interactive `/workspace` application showing Left Sidebar, scorecards, and line-item table. |
| `public/images/platform-ui.png` | 1280×720 PNG (16:9) | **VERIFIED (Framed Mockup)** | Real product UI screenshot embedded inside the landing page browser frame. |

---

## 2. Dedicated API Key Isolation & Developer API Hub

- **Dedicated LiteLLM Gateway Key (`AI_GATEWAY_KEY`):** Newly minted via `POST https://llm.sensifai.com/key/generate` with `key_alias: "repairquote-check"`.
  - Virtual Key: `sk--nAMk4ax2Bjzsxu5EIDLlg` (Verified unique, NOT equal to master key `sk-EGSXOIkl4X2dqQqaBL_Uyw`).
  - Tested with live Gemini Flash inference on `https://llm.sensifai.com`.
- **Dedicated Developer API Hub (`/api/v1/keys`, `/api/v1/audit`):**
  - Generates application-scoped cryptographic keys (`rq_live_<32 hex chars>`).
  - **Zero Logto / Personal Credential Exposure:** Internal Logto subject IDs, client secrets, and Gatekeeper master keys are strictly isolated and never leaked to external clients.
  - Interactive UI Sandbox & Code Generator embedded in `/workspace` (supporting cURL and REST payloads).

---

## 3. End-to-End (E2E) Browser Verification Suite (`scripts/e2e-verify.py`)

All 6 automated browser test journeys executed via Playwright against the live production build (`http://localhost:3000`):

| Test Journey | Status | Details |
|---|---|---|
| [E2E Test 1] Zero Runtime & Console Errors | **PASS** | 0 uncaught page exceptions, 0 React crashes, 0 console errors, 0 hydration mismatches on `/` and `/workspace`. |
| [E2E Test 2] Plain-Text Copy Cleanliness & Asset Integrity | **PASS** | 0 raw Markdown markers (`**`, `###`, backticks) or broken escape sequences in rendered copy; all 6 image elements loaded with `complete === true && naturalWidth > 0`. |
| [E2E Test 3] Interactive Preset Switching Flow | **PASS** | Switching between HVAC Compressor, Plumbing Water Heater, Roofing Chimney Flashing, and Electrical Panel presets dynamically updates titles, price bands, line items, and renders mandatory `<AIDisclaimer />`. |
| [E2E Test 4] Custom Input Auth Gate Flow | **PASS** | Unauthenticated custom submissions strictly render `AuthGateCard` with Sign In prompt; direct API call to `/api/billable-action` returns `401 Unauthorized`. |
| [E2E Test 5] Real Logto OIDC PKCE Login Redirect | **PASS** | Navigating to `/api/auth/login` returns HTTP 302/307 redirecting to live Logto endpoint `https://auth.sensifai.com/oidc/auth` with `response_type=code` and PKCE `code_challenge`. |
| [E2E Test 6] Responsive Layouts & Zero Overflow | **PASS** | Desktop (`1280px`): Collapsible Left Sidebar and Prepaid Wallet Card rendered; Mobile (`375px`): Native Fixed Bottom Navigation Bar rendered with zero horizontal overflow (`scrollWidth <= innerWidth`). |

---

## 4. Production & Container Deliverables

- `Dockerfile`: Standalone Next.js multi-stage build (`deps` with `RUN npm ci --include=dev`, `builder`, `runner`).
- `docker-compose.yml`: Production container service with `expose: - "3000"` only (NEVER `ports:`), healthcheck against `http://127.0.0.1:3000/api/health`.
- `.dockerignore`: Excludes `.git`, `.agents`, `.env*`, and build caches.
- Healthcheck endpoint: `GET /api/health` returning `200 OK` with `status: "ok"`.


---

## 5. Marketplace Registration & Live Credentials

- **Marketplace Application UUID:** `01a1de43-9b3b-7ca0-a6c1-10d18655ee3f`
- **Canonical Production URL:** `https://repairquote-check.sensifai.com`
- **Logto OIDC Client ID:** `w5mm2s5aw643xf34ee9cr`
- **Logto OIDC Client Secret:** `sjntNgBgV12toT5BGsDpp6au5iwKvgdG`
- **Logto Redirect URIs:**
  - `https://repairquote-check.sensifai.com/callback`
  - `http://localhost:3000/callback`
- **Dedicated Application API Key:** `smp_live_wgv34lbqi2slz3625unafv2re6ln5qnzxjiuuk3jqdexuj7gsg2a`
- **Price Model ID (Pay-As-You-Go €0.05 / request):** `01a1de4a-f3a1-7c77-8770-fce93c43eab7`
- **Webhook Secret:** `whsec_d2347cf11c90ae45285ae61d8bb328b16beca8b3e42720c6`
- **Dedicated LiteLLM Key:** `sk--nAMk4ax2Bjzsxu5EIDLlg`
- **Catalog Publication Status:** Published to Sensifai Marketplace (`is_published: true`)

---

## 6. Platform Quality Gate & Live Audit Results (`node scripts/test-sensifai.mjs`)

```text
=====================================================================
  ALL PLATFORM QUALITY GATES & LIVE TESTS PASSED (7/7)
  Tests: [1] Codebase & English UI | [2] Cache Protection | [3] Auth OIDC PKCE
         [4] Gatekeeper Balance | [4b] Live Wallet Deduction | [5] Webhooks | [6] Latest Gemini AI
=====================================================================

[Audit 1] Codebase & English UI: PASS (0 mock bypasses, 401 auth gate enforced, 100% English copy)
[Audit 2] Cache Protection: PASS (no-store enforced, force-dynamic /api/wallet)
[Test 3] Auth OIDC PKCE: PASS (Live discovery at auth.sensifai.com/oidc, S256 PKCE verified)
[Test 4] Gatekeeper Balance: PASS (€14.692 EUR live balance query)
[Test 4b] Live Wallet Deduction: PASS (Real money flow: €14.692 → €14.642, -€0.050)
[Test 5] Webhook HMAC-SHA256: PASS (Idempotency and replay defense verified)
[Test 6] Latest Gemini AI: PASS (vertex_ai/gemini-3.8-flash dynamically resolved and inferred in 4.70s)
```

---

## 7. Coolify Deployment & Environment Block

Configure the application in Coolify with Docker Compose deployment type:

```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://repairquote-check.sensifai.com
CANONICAL_DOMAIN=https://repairquote-check.sensifai.com

# Sensifai Identity (Logto OIDC)
LOGTO_ENDPOINT=https://auth.sensifai.com/oidc
LOGTO_APP_ID=w5mm2s5aw643xf34ee9cr
LOGTO_APP_SECRET=sjntNgBgV12toT5BGsDpp6au5iwKvgdG
LOGTO_COOKIE_SECRET=588a4c0a597c27ad6e1a4993cbf7e31b53df28d65a88c3a50e9323c9ce183a91

# Sensifai Gatekeeper & Marketplace
SENSIFAI_GATEKEEPER_URL=https://gatekeeper.sensifai.com
SENSIFAI_API_KEY=smp_live_wgv34lbqi2slz3625unafv2re6ln5qnzxjiuuk3jqdexuj7gsg2a
SENSIFAI_PRICE_ID=01a1de4a-f3a1-7c77-8770-fce93c43eab7
SENSIFAI_WEBHOOK_SECRET=whsec_d2347cf11c90ae45285ae61d8bb328b16beca8b3e42720c6
MARKETPLACE_APP_UUID=01a1de43-9b3b-7ca0-a6c1-10d18655ee3f

# Sensifai Dedicated LiteLLM AI Gateway
AI_GATEWAY_URL=https://llm.sensifai.com
AI_GATEWAY_KEY=sk--nAMk4ax2Bjzsxu5EIDLlg
```
