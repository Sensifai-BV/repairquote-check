---
app_id: repairquote-check
name: RepairQuote Check
tagline: Is This Repair Quote Fair? Photo + Quote Fairness Check
category: ecommerce
version: 0.1.0
stack: nextjs-vercel
apis:
  - { provider: sensifai-litellm, env_key: AI_GATEWAY_KEY, usage: "Latest Gemini Flash/Pro via LiteLLM Gateway" }
pricing:
  type: pay_as_go
  status: recommended
  reason: "Usage-based prepaid billing — customers pay €0.05 per repair quote fairness check, line-item audit, and negotiation guidance from their Sensifai wallet with instant metering."
marketplace:
  description_short: "Upload damage photos and contractor quotes to verify fair price ranges, detect padded line items, and generate contractor negotiation scripts in under 60 seconds."
  description_long: |
    RepairQuote Check is an automated repair quote fairness verification engine built for homeowners, residential landlords, and property managers. In under 60 seconds, it cross-references damage photos, contractor estimate PDFs or photos, and regional pricing data to calculate realistic price ranges, flag duplicate or padded labor hours, and arm property owners with contractor-ready negotiation questions.

    Homeowners and property managers routinely overpay on emergency plumbing, HVAC, electrical, and roofing repairs due to urgent timelines and technical information asymmetry. Without specialized trade knowledge, evaluating whether a two thousand dollar estimate is legitimate or artificially inflated is nearly impossible.

    RepairQuote Check eliminates this asymmetry by combining Sensifai AI multimodal vision with deterministic regional trade cost bands. It inspects visible repair scope from photos, extracts structured line items from contractor estimates, flags suspicious upsells, and computes market fairness bands with line-by-line confidence scores and verifiable photo evidence.

    Key capabilities include visible-scope damage estimation from photos, automated line-item quote extraction, regional trade price benchmarking, padded-item and duplicate-fee detection, and instant contractor negotiation script generation metered transparently at €0.05 per check from your Sensifai prepaid wallet.

    Sign in with your Sensifai account, select a sample repair scenario or upload your own contractor quote and damage photos, and receive actionable cost breakdowns, fairness scorecards, and negotiation points metered directly through your Sensifai wallet.
  use_cases:
    - "Homeowners auditing emergency HVAC, plumbing, or electrical repair quotes before signing"
    - "Residential landlords verifying contractor estimates across rental unit portfolios"
    - "Tenant associations checking common-area maintenance and repair proposals"
    - "Property managers evaluating subcontractor line-item pricing for competitive bidding"
  tags:
    - home-services
    - contractor-quotes
    - repair-estimation
    - quote-fairness
    - cost-benchmarking
    - computer-vision
    - document-ai
    - sensifai
  target_users:
    - "Homeowners, residential landlords, and tenant associations"
    - "Property managers and HOA board members"
    - "Home warranty policyholders and insurance claimants"
    - "Real estate investors managing rental renovation budgets"
media_brand:
  primary_color: "#EA580C"
  ui_archetype: "editorial"
  style: "modern minimal, contractor fairness audit, terracotta and warm slate inspection aesthetic"
  keywords:
    - "repair quote check"
    - "contractor quote fairness"
    - "fair price range"
    - "padded item detection"
    - "home repair cost benchmark"
  visual_metaphor: "side-by-side damage photo inspection and line-item contractor quote fairness telemetry with confidence scores"
---

# RepairQuote Check — Is This Repair Quote Fair? Photo + Quote Fairness Check

> **Sensifai AI Marketplace · Series 2 (2026)**
> Production-ready AI API for image, video, audio & document understanding.
> Powered by Google Gemini (primary multimodal) + OpenAI GPT-4o (validation / fallback).

## 1. Product Snapshot

| Field | Detail |
|---|---|
| Product | RepairQuote Check |
| Tagline | Is This Repair Quote Fair? Photo + Quote Fairness Check |
| Category | Home Services (B2C/B2B2C) |
| Primary buyer | Homeowners, landlords, tenant associations |
| Demand score (research) | 10/10 |
| Suggested pricing anchor | $7.99 per check |
| Input | Damage/problem photos or video, contractor quote PDF/photo, city |
| Output | Fair-price range with line-item breakdown, padded-item flags, questions to ask, second-quote recommendation |
| Core promise | A result in under 60 seconds from a photo, recording or document — no training, no hardware, no integration project |

## 2. The Problem (Why This Exists)

Homeowners cannot judge repair quotes; overcharging thrives on urgency and information asymmetry.

Today the buyer solves this with some mix of: senior-staff time, spreadsheets, phone calls, outsourced review, or simply absorbing the loss. All four options are slow, inconsistent between people and shifts, impossible to audit at 100% volume, and — critically — produce **no reusable structured data**. The pain is not "we lack AI"; the pain is measurable money, hours and disputes, which is exactly why this product can charge from day one.

### Cost of doing nothing
- **Time:** skilled staff hours burned on work a multimodal model does in seconds.
- **Leakage:** errors found late (or never), when fixing them costs 10× more.
- **Inconsistency:** outcome depends on who was on shift.
- **No evidence trail:** when a dispute arrives, there is nothing structured to defend with.

### Why now
1. Gemini-class models natively fuse image + audio + video + long documents in one call.
2. Every buyer already carries the sensor: a phone camera and microphone.
3. Vertical buyers in 2026 pay for outcomes ($ per case/document/room), not seats — this product is priced exactly that way.

## 3. Target Users & Personas

**Primary buyer:** Homeowners, landlords, tenant associations.

### Persona A — The operator (daily user)
Does the frontline work, captures input on a phone, needs an answer in under a minute, will abandon anything with a learning curve. Success = "it read my messy input correctly the first time."

### Persona B — The manager / owner (payer)
Sees the dashboard and the monthly savings/loss-prevention report. Success = a number they can repeat in a meeting: hours saved, cases caught, disputes won.

### Persona C — The reviewer / approver (trust gate)
Checks flagged items, signs off outputs, needs the evidence trail (source image, timestamp, confidence) behind every AI claim. Success = never being surprised by an unexplainable result.

### Anti-persona
Enterprises wanting a multi-quarter custom platform build. RepairQuote Check is deliberately a focused API + lightweight app that lands in a week and expands per site/team.

## 4. Solution Overview

RepairQuote Check takes **Damage/problem photos or video, contractor quote PDF/photo, city** and returns **Fair-price range with line-item breakdown, padded-item flags, questions to ask, second-quote recommendation**.

The design principle is *exception-first*: clean, unambiguous inputs are processed end-to-end automatically; anything uncertain is routed to a human review queue with the evidence already organized. The user never starts from a blank form again — they review and confirm.

### Signature workflow (under 60 seconds)
1. **Capture** — guided camera/voice/upload flow with live quality checks (blur, glare, angle, audio level).
2. **Understand** — Gemini multimodal pass extracts structure, entities, measurements and anomalies.
3. **Verify** — deterministic rules + GPT-4o second-opinion check on high-impact fields; arithmetic and cross-document consistency are computed in code, never "imagined" by the LLM.
4. **Deliver** — structured result screen + exportable report (PDF/CSV/API JSON) with confidence per field and evidence crops.
5. **Learn** — every human correction is stored as a labeled example for threshold tuning and future fine-tuning.

## 5. Core Features (MVP)

1. **Visible-scope estimation from photos**
2. **Quote line-item extraction**
3. **Regional price-band comparison**
4. **Upsell & duplicate-line flags**
5. **Negotiation script generator**

### Cross-cutting features in every build
- Confidence score per field/finding, with low-confidence items visually quarantined for review.
- Evidence-first UI: every claim links back to the exact image region, audio timestamp or document page.
- Full audit log (who confirmed, what was edited, when).
- PDF report export + REST API + webhook for system-of-record integration.
- Multilingual input handling, English report output with localized summaries on demand.

## 6. Input / Output Specification

### Input
Damage/problem photos or video, contractor quote PDF/photo, city

- Accepted media: JPEG/PNG/HEIC photos, MP4/MOV video, MP3/WAV/M4A audio, multi-page PDF.
- Practical limits (MVP): photo ≤ 20 MB, video ≤ 5 min (sampled), audio ≤ 60 min, PDF ≤ 200 pages.
- Capture guidance is part of the product: on-screen framing helpers and retake prompts when quality is insufficient. Garbage-in is treated as a UX failure, not a user failure.

### Output
Fair-price range with line-item breakdown, padded-item flags, questions to ask, second-quote recommendation

- Machine-readable JSON (see §9), human-readable report (web + PDF), and CSV where tabular.
- Every output field carries: `value`, `confidence (0-1)`, `evidence_ref`, `needs_review (bool)`.
- Turnaround targets: photo/document < 10 s, 1-min audio < 30 s, 5-min video < 90 s.

## 7. AI Pipeline Design

```
Capture → Quality Gate → Pre-process → Gemini Multimodal Pass
        → Deterministic Checks (code) → GPT-4o Validation (high-impact fields)
        → Confidence Router → Auto-accept | Human Review Queue
        → Report/API Delivery → Correction Capture (learning loop)
```

1. **Quality gate (client + server):** blur/glare/occlusion detection; audio SNR check; PDF page legibility. Reject early with a specific retake instruction.
2. **Pre-processing:** EXIF orientation, de-skew, page segmentation; video keyframe sampling at scene changes; audio diarization where speakers matter.
3. **Primary model — Gemini (Flash for speed tier, Pro for accuracy tier):** structured extraction via strict JSON schema prompts, few-shot exemplars from the vertical, temperature 0 for extraction tasks.
4. **Deterministic layer (plain code, no LLM):** arithmetic, date logic, totals, range/plausibility checks, cross-document matching. This layer is the product's trust anchor.
5. **Second opinion — GPT-4o:** re-reads only fields that are (a) high-impact and (b) below confidence threshold; disagreements go to humans with both readings shown.
6. **Confidence routing:** ≥0.90 auto-accept · 0.70–0.90 accept-with-highlight · <0.70 human review queue.

### Model-agnostic by design
All prompts and schemas are stored as versioned product assets. Swapping Gemini ↔ GPT ↔ future models is a config change — the moat is the vertical schema, the checks, and the labeled correction data, not any single vendor.

## 8. User Experience Flow

1. **Home / New case** — one big action: *Capture / Upload*. No menu maze.
2. **Guided capture** — framing overlay, quality meter, "good shot" confirmation for each required view.
3. **Processing state** — honest progress ("Reading… Checking… Building report"), never a silent spinner over 5 s.
4. **Result screen** — verdict first, details below: findings sorted by impact, evidence crops inline, edit-any-field inline.
5. **Review queue (manager view)** — only exceptions, keyboard-fast approve/edit, bulk actions.
6. **Share / export** — PDF, CSV, API push, or a signed share-link for the counter-party where disputes matter.
7. **History & search** — every case retrievable by date, asset/person/site ID and outcome.

## 9. API Design (Marketplace Listing Surface)

Base: `https://api.sensifai.com/v2/repairquote-check`

| Endpoint | Method | Purpose |
|---|---|---|
| `/cases` | POST | Create case; upload media (multipart or signed URLs) |
| `/cases/{id}` | GET | Poll status / fetch result |
| `/cases/{id}/confirm` | POST | Human confirmation & field edits (feeds learning loop) |
| `/cases/{id}/report.pdf` | GET | Export signed report |
| `/webhooks` | POST | Register completion webhook |

## 10. Data Model (MVP)

- `workspace` — buyer account, plan, retention policy.
- `case` — one unit of work; status, timestamps, site/asset/person external IDs.
- `media_asset` — uploads with quality-gate results and evidence coordinates.
- `finding` — typed result rows with confidence + evidence references.
- `review_action` — human confirmations/edits (gold data for improvement).
- `export` — generated reports and webhook deliveries.

## 11. Accuracy, KPIs & Quality System

| KPI | MVP target | Why it matters |
|---|---|---|
| Field-level accuracy (auto-accepted) | ≥ 95% | Trust to remove humans from the clean path |
| Human-review rate | ≤ 25% of cases | The ROI story: 75% straight-through |
| Median turnaround | < 10 s (photo/doc) | Field usability |
| Correction rate trend | ↓ month over month | Proof the learning loop works |
| Evidence coverage | 100% of findings | No unexplained claims, ever |

## 12. Pricing & Business Model

**Anchor:** $7.99 per check.

- **Starter** — single site/team, core workflow, standard speed tier, 90-day retention.
- **Growth** — multi-site, accuracy tier (Pro model), API + webhooks, priority queue.
- **Enterprise / API** — per-case volume pricing, zero-retention, SSO, custom templates/checklists, SLA.

## 13. Go-To-Market (Sensifai Marketplace First)

1. **Marketplace listing** — photorealistic cover, app icon, 60-second demo: messy real input → clean structured output.
2. **Seed users** — 5–10 operators in the exact buyer segment (Homeowners, landlords, tenant associations); free pilot in exchange for labeled corrections and a testimonial metric.
3. **Proof asset** — one public before/after case study with hours/money numbers.
4. **Integrations** — export/webhook into the buyer's existing system of record before building any dashboard vanity.
5. **Expansion** — second site/team at the same customer before chasing new logos.

## 14. Risks, Compliance & Trust

- **Product-specific caution:** Estimates are guidance bands, not binding valuations; hidden damage disclaimer.
- **Privacy:** media may contain faces, plates, documents or premises — encryption, role-based access, configurable retention and one-click purge are MVP features, not roadmap promises.
- **AI honesty:** low-confidence output is labeled, never dressed up. Inconclusive is a first-class result.
- **Regulated adjacency:** output supports licensed/qualified professionals; it does not replace their legally accountable judgement. This sentence ships in-product, in reports and in terms.
- **Vendor risk:** model-agnostic pipeline (§7) prevents single-provider lock-in or outage dependency.

## 15. Roadmap

**MVP (v1, weeks 1–3):** guided capture, core extraction + deterministic checks, result screen, PDF export, review queue, API.

## 16. Sensifai Marketplace Listing Copy

**Title:** RepairQuote Check — Is This Repair Quote Fair? Photo + Quote Fairness Check

**Short description:** Upload damage/problem photos or video, contractor quote pdf/photo, city and get fair-price range with line-item breakdown, padded-item flags, questions to ask, second-quote recommendation in seconds — with confidence scores and photo/document evidence behind every finding. Built for homeowners, landlords, tenant associations.

**Tags:** home services (b2c/b2b2c), computer vision, document AI, audio AI, gemini, gpt-4o, automation, sensifai

## 17. Media Package

- `logo.png` — minimal 3D app icon, transparent background, no text.
- `cover.jpg` — photorealistic 16:9 marketplace cover, no text/watermark.
