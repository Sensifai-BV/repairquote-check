import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { APP_METADATA } from "@/lib/sensifai/app-metadata";
import {
  Wrench,
  ShieldCheck,
  FileText,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingDown,
  DollarSign,
  Scale,
  Search,
  ExternalLink,
  ChevronRight,
  Layers,
  Clock,
  Building2,
  Home,
  Key,
  Cpu,
  Terminal,
  Code,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFFCFA] text-[#0F172A] flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* Top Marketing Navigation Bar */}
      <Navbar
        appName={APP_METADATA.name}
        logoSrc="/logo.png"
        primaryColor={APP_METADATA.primaryColor}
        navLinks={[
          { label: "Studio Workspace", href: "/workspace" },
          { label: "Fairness Proof", href: "#proof" },
          { label: "Capabilities", href: "#features" },
          { label: "How It Works", href: "#how-it-works" },
          { label: "Developer API", href: "#api" },
          { label: "Pricing", href: "#pricing" },
        ]}
        ctaLabel="Audit Quote Now"
        ctaHref="/workspace"
      />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Subtle Brand Ambient Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-600/15 via-amber-500/5 to-transparent pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-5">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-900 text-xs font-semibold shadow-xs">
            <span className="h-2 w-2 rounded-full bg-orange-600 animate-pulse" />
            <span>SENSIFAI VISION CORE · CONTRACTOR QUOTE FAIRNESS INTELLIGENCE</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.14]">
            Is This Repair Quote Fair? <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-orange-600 via-orange-700 to-amber-600 bg-clip-text text-transparent">
              Photo & Quote Fairness Check
            </span>
          </h1>

          {/* Clean Plain-Text Subheadline */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Stop overpaying on emergency repairs. Cross-reference damage photos and contractor proposals against localized trade rates in under sixty seconds to detect padded labor, unnecessary replacements, and inflated permit fees.
          </p>

          {/* Hero CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/workspace"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm shadow-md transition-all duration-150 hover:shadow-lg"
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch Quote Fairness Studio</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>

            <a
              href="#proof"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-xs transition-colors"
            >
              <span>View Audit Telemetry Proof</span>
            </a>
          </div>

          {/* Stats Bar */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto border-t border-slate-200/80">
            {APP_METADATA.stats.map((s, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-white/70 border border-slate-200/60 text-left">
                <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900">{s.value}</div>
                <div className="text-xs font-semibold text-orange-800">{s.label}</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">{s.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof Section: Framed Device Mockup */}
      <section id="proof" className="py-12 md:py-16 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-bold tracking-wider text-orange-700 uppercase">
            Photographic & Line-Item Truth
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Automated Damage Verification Meets Regional Trade Benchmarks
          </h2>
          <p className="text-sm text-slate-600">
            Sensifai AI Engine extracts structured quote line items, estimates visible repair scope from photos, and highlights discrepancies between trade pricing and contractor claims.
          </p>
        </div>

        {/* Browser Chrome Container */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_20px_50px_rgba(234,88,12,0.06)] overflow-hidden">
          <div className="h-10 bg-slate-50 border-b border-slate-200/80 px-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-rose-400/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
            </div>
            <div className="text-xs font-mono text-slate-400">repairquote-check.sensifai.com/workspace</div>
            <div className="h-4 w-4 rounded-full border border-slate-300" />
          </div>

          <div className="p-4 sm:p-6 bg-slate-900 text-slate-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-orange-950/80 border border-orange-500/40 text-orange-300 text-xs font-medium">
                <AlertTriangle className="h-3.5 w-3.5 text-orange-400" />
                <span>Padded Labor & Redundant Upsell Caught</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Dallas HVAC Heat Pump Compressor
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Contractor quoted $4,850.00 for full compressor replacement and chemical flush. Sensifai AI visual analysis detected capacitor failure and intact compressor windings.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Contractor Quote:</span>
                  <span className="font-mono font-bold text-rose-400 line-through">$4,850.00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Fair Regional Median:</span>
                  <span className="font-mono font-bold text-emerald-400">$2,450.00</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-slate-700">
                  <span className="text-slate-200 font-semibold">Identified Overcharge:</span>
                  <span className="font-mono font-bold text-orange-400">$2,400.00 (49%)</span>
                </div>
              </div>

              <Link
                href="/workspace"
                className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 hover:text-orange-300"
              >
                <span>Inspect interactive analysis in workspace</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="md:col-span-7 relative rounded-xl overflow-hidden border border-slate-700/60 shadow-lg min-h-[260px] sm:min-h-[320px] bg-slate-950">
              <Image
                src="/images/hero.jpg"
                alt="RepairQuote Check Live Telemetry"
                fill
                className="object-cover opacity-90 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-slate-900/90 backdrop-blur-md border border-slate-700/70 flex items-center justify-between">
                <div className="text-xs">
                  <div className="text-slate-400 text-[11px]">Visible Defect Confirmed</div>
                  <div className="font-medium text-slate-100">Contactor pitting & capacitor bulge (96% Confidence)</div>
                </div>
                <div className="px-2 py-1 rounded bg-orange-600/30 text-orange-300 font-mono text-xs border border-orange-500/40">
                  Fairness Score: 38/100
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Section */}
      <section id="features" className="py-12 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="text-xs font-bold tracking-wider text-orange-700 uppercase">
            Core Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Full-Spectrum Repair Fairness Intelligence
          </h2>
          <p className="text-sm text-slate-600">
            Engineered for residential property owners who demand transparency and objective data when dealing with high-stakes home repair quotes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="group rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
            <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
              <Image
                src="/images/feature-1.jpg"
                alt="Visible Scope Damage Estimation"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
                  <Search className="h-3.5 w-3.5" />
                  <span>Multimodal Vision</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Visible-Scope Damage Estimation
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Inspects photos and video frames to evaluate physical damage scope, component corrosion, and structural wear before comparing against contractor claims.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-xs font-medium text-slate-500 flex items-center justify-between">
                <span>Confidence Scoring</span>
                <span className="font-mono text-orange-700 font-bold">&gt; 95%</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
            <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
              <Image
                src="/images/feature-2.jpg"
                alt="Quote Line-Item Extraction"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Document AI</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Automated Line-Item Extraction
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Parses contractor estimate PDFs, photos, and itemized invoices into structured line items, separating labor hours, materials markup, permit fees, and diagnostic charges.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-xs font-medium text-slate-500 flex items-center justify-between">
                <span>Extraction Accuracy</span>
                <span className="font-mono text-orange-700 font-bold">98.4%</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
            <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
              <Image
                src="/images/feature-3.jpg"
                alt="Regional Price-Band Comparison"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider">
                  <Scale className="h-3.5 w-3.5" />
                  <span>Cost Benchmarking</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Regional Trade Benchmarks & Negotiation
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Benchmarks contractor quote line items against localized trade rates across zip codes and metropolitan areas, calculating fair market low, median, and high cost bands.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-xs font-medium text-slate-500 flex items-center justify-between">
                <span>Negotiation Scripts</span>
                <span className="font-mono text-orange-700 font-bold">Tailored Questions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="text-xs font-bold tracking-wider text-orange-700 uppercase">
            Signature Workflow
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            From Messy Quote to Fair Price in 60 Seconds
          </h2>
          <p className="text-sm text-slate-600">
            No complex installations or manual spreadsheets. Complete clarity in three steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">Upload Photos & Quote</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Snap a picture or upload photos of the damaged equipment along with the contractor proposal PDF or photo and select your city.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">Sensifai AI Audit</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sensifai AI Engine extracts structured line items, isolates physical defect scope from photos, and benchmarks rates against regional trade databases.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900">Negotiate with Proof</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Review padded labor flags, line-item fairness scorecards, and ready-to-use contractor questions with verified counter-offer amounts.
            </p>
          </div>
        </div>
      </section>

      {/* Developer REST API Section */}
      <section id="api" className="py-12 md:py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full border-t border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="text-xs font-bold tracking-wider text-orange-700 uppercase">
            Enterprise & Developer REST API
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Automate Quote Auditing in Your Systems
          </h2>
          <p className="text-sm text-slate-600">
            Embed residential estimate fairness auditing directly into property management software, tenant portals, insurance claim desks, and warranty platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                  <Key className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Dedicated Cryptographic Keys</h3>
                  <p className="text-xs text-slate-500">App-scoped tokens (rq_live_...) with zero credential leakage.</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Sub-Second Telemetry Execution</h3>
                  <p className="text-xs text-slate-500">Benchmark HVAC, Plumbing, Roofing, and Electrical in milliseconds.</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                  <Terminal className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Structured JSON Output</h3>
                  <p className="text-xs text-slate-500">Full price-band medians, padded flags, and negotiation scripts.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/workspace?tab=api"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-colors"
              >
                <span>Launch API Hub & Mint Keys</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl bg-slate-900 text-slate-100 border border-slate-800 overflow-hidden shadow-xl">
            <div className="h-10 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-slate-300 font-semibold">POST /api/v1/audit</span>
              </div>
              <span className="text-[11px] text-slate-500">cURL REST Example</span>
            </div>

            <div className="p-5 font-mono text-xs space-y-4 overflow-x-auto">
              <div>
                <span className="text-slate-500"># Send quote details for real-time fairness evaluation</span>
                <div className="text-orange-400 mt-1">curl -X POST https://repairquote-check.sensifai.com/api/v1/audit \</div>
                <div className="pl-4 text-slate-300">-H &quot;Authorization: Bearer rq_live_sample_token&quot; \</div>
                <div className="pl-4 text-slate-300">-H &quot;Content-Type: application/json&quot; \</div>
                <div className="pl-4 text-emerald-400">-d &apos;{JSON.stringify({ trade: "HVAC", city: "Dallas", totalQuoted: 4850 }, null, 0)}&apos;</div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-slate-500"># Sample JSON Response (HTTP 200 OK)</span>
                <pre className="mt-2 text-slate-300 text-[11px] leading-relaxed">
{`{
  "success": true,
  "reportId": "RQC-20261115-4819",
  "trade": "HVAC",
  "city": "Dallas",
  "totalQuoted": 4850,
  "fairTotalMedian": 2450,
  "potentialSavings": 2400,
  "fairnessScore": 42,
  "verdictHeadline": "Significant Price Inflation Detected (+98% Above Regional Median)",
  "paddedFlags": [
    { "title": "Padded Nitrogen Line Flush", "severity": "high" },
    { "title": "Dual Capacitor 400% Markup", "severity": "medium" }
  ]
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 md:py-20 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-bold tracking-wider text-orange-700 uppercase">
            Simple Transparent Metering
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Pay As You Go on Sensifai Marketplace
          </h2>
          <p className="text-sm text-slate-600">
            Prepaid micro-metering deducted automatically from your Sensifai wallet.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border-2 border-orange-500/80 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-orange-600 text-white text-[11px] font-bold px-4 py-1 rounded-bl-xl tracking-wider uppercase">
            Prepaid Metered
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="text-sm font-semibold text-orange-700">Fairness Check Package</div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono">€0.05</span>
                <span className="text-sm text-slate-500">/ check</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full multimodal damage photo analysis, complete quote line-item extraction, regional price band comparison, and contractor negotiation talking points.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Prepaid wallet billing with zero recurring subscription fees</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Instant turnaround under sixty seconds</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Downloadable PDF and structured JSON audit reports</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-orange-50/70 border border-orange-200/70 space-y-4 text-center">
              <div className="text-xs font-semibold text-orange-900">Ready to audit your first quote?</div>
              <p className="text-xs text-slate-600">
                Sign in with your Sensifai account to access the workspace and test sample repair scenarios.
              </p>
              <Link
                href="/workspace"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm shadow-md transition-colors"
              >
                <span>Launch Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 sm:px-6 border-t border-slate-200/80 bg-white text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={20} height={20} className="rounded" />
            <span className="font-semibold text-slate-700">{APP_METADATA.name}</span>
            <span>·</span>
            <span>{APP_METADATA.tagline}</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/workspace" className="hover:text-slate-800 transition-colors">Workspace</Link>
            <a href="#proof" className="hover:text-slate-800 transition-colors">Proof</a>
            <a href="#features" className="hover:text-slate-800 transition-colors">Capabilities</a>
            <a href="https://sensifai.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-800 transition-colors">
              Sensifai Marketplace
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
