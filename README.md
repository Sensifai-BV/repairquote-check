# RepairQuote Check

Automated residential contractor repair estimate audit engine powered by Sensifai Vision Core and Regional Cost Telemetry.

[![Sensifai Marketplace](https://img.shields.io/badge/Sensifai-Marketplace-EA580C?style=flat-square)](https://sensifai.com/marketplace)
[![Build Status](https://img.shields.io/badge/Build-Passing-emerald?style=flat-square)](https://repairquote-check.sensifai.com)
[![License](https://img.shields.io/badge/License-Proprietary-blue?style=flat-square)](LICENSE)

---

## Overview

**RepairQuote Check** cross-references contractor estimates against hyper-local material indexes, labor trade standards, and historical claims records. It surfaces padded line-items, unnecessary code upgrades, and inflated labor multipliers with actionable negotiation counter-scripts.

- **Canonical URL**: `https://repairquote-check.sensifai.com`
- **Application UUID**: `01a1de43-9b3b-7ca0-a6c1-10d18655ee3f`
- **Domain Archetype**: Editorial Before/After Proof with Bespoke Terracotta (`#EA580C`) Palette
- **Pricing Model**: Pay-As-You-Go (€0.05 / Audit Request)

---

## Core Capabilities

1. **Trade-Specific Line-Item Auditing**: Deep breakdowns for HVAC, Plumbing, Roofing, and Electrical trades.
2. **Regional Cost Telemetry**: Verifies contractor labor rates and material costs against local zip-code averages.
3. **Padded Item Detection**: Identifies bogus disposal fees, unwarranted permit markups, and inflated contingency surcharges.
4. **Contractor Negotiation Playbooks**: Generates polite, assertive pushback scripts citing industry standard labor times and wholesale material pricing.
5. **Developer REST API**: Secure token issuance (`rq_live_...`) for enterprise property managers and insurance adjusters.

---

## Verified Repair Presets

- **HVAC Compressor**: 4-Ton 16-SEER Heat Pump outdoor unit replacement with line flush.
- **Plumbing Water Heater**: 50-Gallon atmospheric gas water heater with thermal expansion tank.
- **Roof Leak & Flashing**: Step flashing retrofit, chimney cricket integration, and ice-and-water barrier.
- **Electrical Panel Modernization**: 200-Amp main breaker upgrade with whole-home surge protector.

---

## Technical Stack & Architecture

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS with custom Terracotta design system
- **Authentication**: Zero-mock Logto OIDC PKCE redirect (`https://auth.sensifai.com/oidc`)
- **Billing & Entitlement**: Sensifai Gatekeeper REST API with atomic balance synchronization (`https://gatekeeper.sensifai.com`)
- **AI Core**: Sensifai LiteLLM AI Gateway (`https://llm.sensifai.com`) dynamically resolving latest Gemini Flash models
- **Containerization**: Standalone multi-stage Docker build

---

## Quickstart & Local Development

### 1. Prerequisites
- Node.js 18+ or Docker 24+
- Sensifai Developer Account

### 2. Installation
```bash
git clone https://github.com/Sensifai-BV/repairquote-check.git
cd repairquote-check
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local` and populate your credentials:
```bash
cp .env.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

### 5. Automated Verification Suites
```bash
# Platform Quality Gate & Live Balance Deduction Audit
node scripts/test-sensifai.mjs

# End-to-End Playwright Browser Verification
python3 scripts/e2e-verify.py

# Visual Media Asset Verification
node scripts/generate-media.mjs
```

---

## Container Deployment (Coolify / Docker Compose)

Deploy with Docker Compose using the production container definition:

```bash
docker compose up -d --build
```

Health endpoint: `GET /api/health`

---

## Security & Privacy Notice

All contractor estimates, homeowner addresses, and invoice images are processed ephemerally. RepairQuote Check enforces strict 401 authentication gates on custom quote submissions and never stores raw homeowner credentials or PII.
