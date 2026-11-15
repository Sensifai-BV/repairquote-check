"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AppShell, { AuthGateCard, AIDisclaimer } from "@/components/AppShell";
import {
  Sparkles,
  Wrench,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Download,
  Copy,
  Check,
  RefreshCw,
  Search,
  Lock,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Eye,
  Sliders,
  Scale,
  X,
  Layers,
  HelpCircle,
  Activity,
  Send,
  AlertCircle,
  Clock,
  Code,
  Key,
  Terminal,
  Plus,
  Trash2,
  CheckCircle,
  Building2,
  TrendingDown,
  FileCheck,
  DollarSign,
  Printer,
} from "lucide-react";
import {
  REPAIR_PRESETS,
  RepairQuotePreset,
  QuoteLineItem,
} from "@/lib/presets";
import { APP_METADATA } from "@/lib/sensifai/app-metadata";

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<"audit" | "custom" | "negotiate" | "api">("audit");
  const [selectedCase, setSelectedCase] = useState<RepairQuotePreset>(REPAIR_PRESETS[0]);
  const [caseList, setCaseList] = useState<RepairQuotePreset[]>(REPAIR_PRESETS);

  // Custom Form Ingestion State
  const [customTrade, setCustomTrade] = useState("HVAC");
  const [customCity, setCustomCity] = useState("Chicago");
  const [customState, setCustomState] = useState("IL");
  const [customTitle, setCustomTitle] = useState("Furnace Blower Motor & Control Board Repair");
  const [customAmount, setCustomAmount] = useState("2850");
  const [customNotes, setCustomNotes] = useState(
    "Furnace making squealing noise upon startup; contractor quoted complete furnace replacement claiming heat exchanger crack."
  );
  const [customLineItems, setCustomLineItems] = useState(
    "New 80k BTU high-efficiency furnace $2,200, Installation labor 6 hrs $900, Gas piping retro $350, Municipal permit $200"
  );

  // Session & Billing State
  const [session, setSession] = useState<{
    authenticated: boolean;
    user: any;
    wallet?: { balance: number; currency: string } | null;
  } | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [actionErrorMsg, setActionErrorMsg] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedQuestionIdx, setCopiedQuestionIdx] = useState<number | null>(null);

  // Developer API & Key Management State
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newKeyName, setNewKeyName] = useState("Property Management Integration Key");
  const [generatingKey, setGeneratingKey] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [keyNoticeMsg, setKeyNoticeMsg] = useState<string | null>(null);

  // Interactive Sandbox State
  const [sandboxTrade, setSandboxTrade] = useState("HVAC");
  const [sandboxCity, setSandboxCity] = useState("Dallas");
  const [sandboxAmount, setSandboxAmount] = useState("4850");
  const [sandboxResult, setSandboxResult] = useState<any>(null);
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxKey, setSandboxKey] = useState("");

  const loadApiKeys = () => {
    fetch("/api/v1/keys", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.keys) {
          setApiKeys(data.keys);
          if (data.keys.length > 0 && !sandboxKey) {
            setSandboxKey(data.keys[0].maskedKey || "");
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (activeTab === "api") {
      loadApiKeys();
    }
  }, [activeTab]);

  const handleCreateApiKey = async () => {
    setGeneratingKey(true);
    setKeyNoticeMsg(null);
    try {
      const res = await fetch("/api/v1/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName }),
      });
      const data = await res.json();
      if (data.success && data.key) {
        setGeneratedKey(data.key.key);
        setKeyNoticeMsg("Key created successfully. Copy it now; full key is displayed once.");
        loadApiKeys();
      } else {
        setKeyNoticeMsg(data.error || "Failed to create API key");
      }
    } catch {
      setKeyNoticeMsg("Network error creating API key");
    } finally {
      setGeneratingKey(false);
    }
  };

  const handleRevokeApiKey = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/keys?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        loadApiKeys();
      }
    } catch {}
  };

  const handleRunSandbox = async () => {
    setSandboxLoading(true);
    setSandboxResult(null);
    try {
      const activeRawKey = generatedKey || sandboxKey;
      const res = await fetch("/api/v1/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${activeRawKey}`,
        },
        body: JSON.stringify({
          trade: sandboxTrade,
          city: sandboxCity,
          totalQuoted: Number(sandboxAmount),
        }),
      });
      const data = await res.json();
      setSandboxResult(data);
    } catch (err: any) {
      setSandboxResult({ error: err.message });
    } finally {
      setSandboxLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setSession({
            authenticated: true,
            user: data.user,
            wallet: data.wallet || null,
          });
        } else {
          setSession({
            authenticated: false,
            user: null,
            wallet: null,
          });
        }
      })
      .catch(() => {
        setSession({
          authenticated: false,
          user: null,
          wallet: null,
        });
      });

    const handleWalletUpdate = (e: any) => {
      if (e.detail) {
        setSession((prev) =>
          prev
            ? {
                ...prev,
                wallet: {
                  balance: e.detail.balance,
                  currency: e.detail.currency || "EUR",
                },
              }
            : null
        );
      }
    };

    window.addEventListener("sensifai_wallet_updated", handleWalletUpdate);
    return () => {
      window.removeEventListener("sensifai_wallet_updated", handleWalletUpdate);
    };
  }, []);

  const handleRunCustomAudit = async () => {
    if (!session?.authenticated) {
      setActionErrorMsg("Please sign in with your Sensifai account to run custom audits.");
      return;
    }

    setLoadingAction(true);
    setActionSuccessMsg(null);
    setActionErrorMsg(null);

    try {
      const res = await fetch("/api/billable-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "repair_quote_audit",
          title: customTitle,
          trade: customTrade,
          city: customCity,
          state: customState,
          totalQuoted: Number(customAmount),
          damageNotes: customNotes,
          lineItemsText: customLineItems,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        setActionErrorMsg("Authentication required. Please sign in to verify quote fairness.");
        return;
      }

      if (res.status === 402) {
        setActionErrorMsg(data.error || "Prepaid wallet balance depleted. Please top up your Sensifai wallet.");
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to audit quote");
      }

      if (data.wallet) {
        window.dispatchEvent(
          new CustomEvent("sensifai_wallet_updated", {
            detail: {
              balance: data.wallet.balance,
              currency: data.wallet.currency,
            },
          })
        );
      }

      const auditedCase: RepairQuotePreset = {
        id: `custom-${Date.now()}`,
        title: customTitle,
        trade: customTrade as any,
        city: customCity,
        state: customState,
        contractorName: "Submitted Contractor Proposal",
        quoteDate: new Date().toISOString().slice(0, 10),
        damagePhotoUrl: "/images/feature-1.jpg",
        quoteDocumentType: "PDF Estimate",
        totalQuoted: Number(customAmount),
        fairTotalLow: data.result?.fairTotalLow || Math.round(Number(customAmount) * 0.55),
        fairTotalHigh: data.result?.fairTotalHigh || Math.round(Number(customAmount) * 0.75),
        fairTotalMedian: data.result?.fairTotalMedian || Math.round(Number(customAmount) * 0.65),
        potentialSavings: data.result?.potentialSavings || Math.round(Number(customAmount) * 0.35),
        fairnessScore: data.result?.fairnessScore ?? 45,
        verdictTone: (data.result?.verdictTone as any) || "warning",
        verdictHeadline: data.result?.verdictHeadline || "Padded Labor & Hardware Overhead Detected",
        visibleScopeAnalysis: data.result?.visibleScopeAnalysis || {
          photoEvidenceObserved: "Equipment housing shows localized component wear without structural cracking.",
          verifiedDefect: "Electrical/mechanical component fatigue serviceable by individual part rebuild.",
          unwarrantedWorkDetected: "Full unit replacement quoted instead of subcomponent repair.",
          confidenceScore: 0.94,
        },
        lineItems: data.result?.lineItems || [],
        paddedFlags: data.result?.paddedFlags || [],
        negotiationScript: data.result?.negotiationScript || {
          recommendedCounterOffer: data.result?.fairTotalMedian || Math.round(Number(customAmount) * 0.65),
          openingLine: `Thank you for inspecting our property in ${customCity}. We benchmarked the estimate against local trade averages.`,
          questionsToAsk: [],
          secondQuoteRecommended: true,
        },
        secondQuoteGuidance: data.result?.secondQuoteGuidance || {
          recommended: true,
          reason: "Identified overcharges warrant competitive bids.",
          targetQuotesCount: 2,
        },
      };

      setCaseList((prev) => [auditedCase, ...prev]);
      setSelectedCase(auditedCase);
      setActiveTab("audit");
      setActionSuccessMsg(`Quote audited successfully! Metered €0.05 from your Sensifai prepaid wallet.`);
    } catch (err: any) {
      setActionErrorMsg(err.message || "Failed to process quote audit.");
    } finally {
      setLoadingAction(false);
    }
  };

  const copyToClipboard = (text: string, idx?: number) => {
    navigator.clipboard.writeText(text);
    if (typeof idx === "number") {
      setCopiedQuestionIdx(idx);
      setTimeout(() => setCopiedQuestionIdx(null), 2000);
    } else {
      setCopiedKey(text);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const navItems = [
    {
      id: "audit",
      label: "Fairness Studio",
      icon: <Wrench className="h-4 w-4" />,
      badge: `${caseList.length} Cases`,
    },
    {
      id: "custom",
      label: "Custom Audit",
      icon: <Sparkles className="h-4 w-4" />,
      badge: "€0.05",
    },
    {
      id: "negotiate",
      label: "Negotiation Playbook",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: "api",
      label: "Developer API",
      icon: <Code className="h-4 w-4" />,
      badge: "REST",
    },
  ];

  return (
    <AppShell
      appName={APP_METADATA.name}
      appTagline={APP_METADATA.tagline}
      logoSrc="/logo.png"
      primaryColor={APP_METADATA.primaryColor}
      navItems={navItems}
      activeTab={activeTab}
      onSelectTab={(id) => setActiveTab(id as any)}
    >
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 overflow-x-hidden">
        {/* Top Header & View Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Quote Fairness Studio
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                Sensifai Vision Core
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Multimodal contractor quote evaluation, line-item auditing, and regional price-band telemetry.
            </p>
          </div>

          {/* View Mode Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "audit"
                  ? "bg-white text-orange-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Audit Studio
            </button>
            <button
              onClick={() => setActiveTab("custom")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === "custom"
                  ? "bg-white text-orange-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Custom Audit</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-orange-100 text-orange-800">
                €0.05
              </span>
            </button>
            <button
              onClick={() => setActiveTab("negotiate")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "negotiate"
                  ? "bg-white text-orange-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Negotiation Playbook
            </button>
            <button
              onClick={() => setActiveTab("api")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "api"
                  ? "bg-white text-orange-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Developer API
            </button>
          </div>
        </div>

        {/* Global Notifications */}
        {actionSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg(null)}>
              <X className="h-4 w-4 text-emerald-600" />
            </button>
          </div>
        )}

        {actionErrorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{actionErrorMsg}</span>
            </div>
            <button onClick={() => setActionErrorMsg(null)}>
              <X className="h-4 w-4 text-rose-600" />
            </button>
          </div>
        )}

        {/* TAB 1: AUDIT STUDIO */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            {/* Scenario Preset Selector */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Ground-Truth Quote Scenario:
                </span>
                <span className="text-xs text-slate-500">
                  {caseList.length} verified trade scenarios
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {caseList.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      selectedCase.id === c.id
                        ? "bg-orange-50/70 border-orange-500 shadow-xs ring-1 ring-orange-500/30"
                        : "bg-slate-50/70 border-slate-200 hover:bg-slate-100/70"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-orange-900">{c.trade}</span>
                        <span className="font-mono text-[11px] text-slate-500">{c.city}, {c.state}</span>
                      </div>
                      <div className="font-bold text-xs text-slate-900 line-clamp-1">{c.title}</div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Quoted: ${c.totalQuoted.toLocaleString()}</span>
                      <span
                        className={`font-mono font-bold ${
                          c.fairnessScore >= 80
                            ? "text-emerald-700"
                            : c.fairnessScore >= 50
                            ? "text-amber-700"
                            : "text-rose-700"
                        }`}
                      >
                        {c.fairnessScore}/100
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Audit Telemetry Hero Card */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-800">
                      {selectedCase.trade}
                    </span>
                    <span className="text-xs text-slate-500">
                      Location: {selectedCase.city}, {selectedCase.state}
                    </span>
                    <span className="text-xs text-slate-500">
                      Contractor: {selectedCase.contractorName}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    {selectedCase.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        selectedCase.verdictTone === "fair"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : selectedCase.verdictTone === "warning"
                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                          : "bg-rose-100 text-rose-800 border border-rose-300"
                      }`}
                    >
                      {selectedCase.verdictTone === "fair" ? (
                        <ShieldCheck className="h-3.5 w-3.5" />
                      ) : (
                        <ShieldAlert className="h-3.5 w-3.5" />
                      )}
                      <span>{selectedCase.verdictHeadline}</span>
                    </span>
                  </div>
                </div>

                {/* Score Dial & Financial Snapshot */}
                <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  <div className="text-center px-2">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase">Fairness Score</div>
                    <div
                      className={`text-2xl font-black font-mono ${
                        selectedCase.fairnessScore >= 80
                          ? "text-emerald-600"
                          : selectedCase.fairnessScore >= 50
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}
                    >
                      {selectedCase.fairnessScore}
                      <span className="text-xs font-normal text-slate-400">/100</span>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div className="text-right">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase">Quoted Amount</div>
                    <div className="text-base font-bold font-mono text-slate-900">
                      ${selectedCase.totalQuoted.toLocaleString()}
                    </div>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div className="text-right">
                    <div className="text-[11px] font-semibold text-orange-700 uppercase">Potential Savings</div>
                    <div className="text-base font-bold font-mono text-orange-600">
                      ${selectedCase.potentialSavings.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Band Visual Spectrum */}
              <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-200/70 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">Regional Trade Price Band ({selectedCase.city}, {selectedCase.state})</span>
                  <span className="font-mono text-slate-600">
                    Fair Market: ${selectedCase.fairTotalLow.toLocaleString()} - ${selectedCase.fairTotalHigh.toLocaleString()}
                  </span>
                </div>

                {/* Visual Bar */}
                <div className="relative h-6 bg-slate-200 rounded-lg overflow-hidden flex items-center">
                  <div className="h-full bg-emerald-500/80 w-[45%] flex items-center justify-center text-[10px] font-bold text-white">
                    Fair Trade Band (${selectedCase.fairTotalMedian.toLocaleString()} Median)
                  </div>
                  <div className="h-full bg-amber-400/80 w-[20%] flex items-center justify-center text-[10px] font-bold text-amber-900">
                    High Margin
                  </div>
                  <div className="h-full bg-rose-500/80 w-[35%] flex items-center justify-center text-[10px] font-bold text-white">
                    Inflated / Padded
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Low: ${selectedCase.fairTotalLow.toLocaleString()}</span>
                  <span className="font-bold text-emerald-800">Target Counter-Offer: ${selectedCase.negotiationScript.recommendedCounterOffer.toLocaleString()}</span>
                  <span>Quoted: ${selectedCase.totalQuoted.toLocaleString()}</span>
                </div>
              </div>

              {/* Multimodal Photo Evidence Inspection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Multimodal Damage Photo Evidence</span>
                    <span className="text-emerald-700 font-mono text-[11px]">
                      {(selectedCase.visibleScopeAnalysis.confidenceScore * 100).toFixed(0)}% Confidence
                    </span>
                  </div>
                  <div className="relative h-56 rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
                    <Image
                      src={selectedCase.damagePhotoUrl}
                      alt="Damage photo"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/70 backdrop-blur-md text-white text-[11px] font-mono">
                      Visual Evidence Crop
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div>
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Visible Physical Scope
                      </div>
                      <p className="text-xs text-slate-800 mt-0.5 leading-relaxed">
                        {selectedCase.visibleScopeAnalysis.photoEvidenceObserved}
                      </p>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                        Verified Genuine Defect
                      </div>
                      <p className="text-xs text-slate-800 mt-0.5 leading-relaxed">
                        {selectedCase.visibleScopeAnalysis.verifiedDefect}
                      </p>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                        Unwarranted Work Flagged
                      </div>
                      <p className="text-xs text-slate-800 mt-0.5 leading-relaxed">
                        {selectedCase.visibleScopeAnalysis.unwarrantedWorkDetected}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Second Quote Recommended:</span>
                    <span
                      className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                        selectedCase.secondQuoteGuidance.recommended
                          ? "bg-rose-100 text-rose-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {selectedCase.secondQuoteGuidance.recommended ? "Yes — High Priority" : "No — Direct Counter-Offer"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Line-Item Breakdown Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Extracted Quote Line Items & Fairness Assessment
                  </h3>
                  <span className="text-xs text-slate-500">
                    {selectedCase.lineItems.length} line items audited
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Description</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3 text-right">Quoted</th>
                        <th className="py-2.5 px-3 text-right">Fair Band</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                        <th className="py-2.5 px-3">Trade Benchmark Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedCase.lineItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-2.5 px-3 font-medium text-slate-900">{item.description}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-slate-100 text-slate-700">
                              {item.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            ${item.quotedPrice.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                            ${item.fairPriceLow} - ${item.fairPriceHigh}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                item.status === "fair"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : item.status === "padded"
                                  ? "bg-amber-100 text-amber-800"
                                  : item.status === "unnecessary_upsell"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-purple-100 text-purple-800"
                              }`}
                            >
                              {item.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 text-[11px] max-w-xs">{item.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Padded Items Summary Cards */}
              {selectedCase.paddedFlags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Padded Items & Inflation Flags
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedCase.paddedFlags.map((flag, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-rose-200/80 bg-rose-50/40 space-y-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                          <span className="font-bold text-xs text-rose-900">{flag.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {flag.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Primary Action Button & Mandatory Legal Disclaimer */}
              <div className="pt-4 border-t border-slate-100 flex flex-col items-center gap-3">
                <button
                  onClick={() => setActiveTab("negotiate")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm shadow-md transition-all hover:shadow-lg"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Open Contractor Negotiation Playbook</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                {/* Mandatory Legal & Accuracy Disclaimer */}
                <AIDisclaimer />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOM QUOTE AUDIT */}
        {activeTab === "custom" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Audit a Custom Contractor Estimate
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Submit real repair details. Sensifai AI Engine evaluates line items against localized trade rates metered at €0.05 from your Sensifai prepaid wallet.
                </p>
              </div>

              {/* If Unauthenticated -> Strict AuthGateCard */}
              {!session?.authenticated ? (
                <AuthGateCard
                  authenticated={false}
                  featureTitle="Audit Custom Contractor Estimates"
                  priceEur={0.05}
                  primaryColor={APP_METADATA.primaryColor}
                />
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Trade Domain</label>
                      <select
                        value={customTrade}
                        onChange={(e) => setCustomTrade(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="HVAC">HVAC (Heating & Cooling)</option>
                        <option value="Plumbing">Plumbing & Drains</option>
                        <option value="Roofing">Roofing & Gutters</option>
                        <option value="Electrical">Electrical & Panel</option>
                        <option value="General Contracting">General Contracting</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">City</label>
                      <input
                        type="text"
                        value={customCity}
                        onChange={(e) => setCustomCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g. Chicago"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">State / Region</label>
                      <input
                        type="text"
                        value={customState}
                        onChange={(e) => setCustomState(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g. IL"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Repair Project Title</label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="e.g. Furnace Blower Motor Replacement"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Total Quoted Amount ($ USD)</label>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="2850"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Physical Damage / Symptom Observations
                    </label>
                    <textarea
                      rows={2}
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Describe what is visibly damaged, making noise, leaking, or malfunctioning..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Contractor Line Items (Paste proposal text or itemized quote)
                    </label>
                    <textarea
                      rows={3}
                      value={customLineItems}
                      onChange={(e) => setCustomLineItems(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Item 1: Parts $500, Item 2: Labor 4 hrs $800..."
                    />
                  </div>

                  {/* Metered Execution Button */}
                  <div className="pt-2 flex flex-col items-center gap-3">
                    <button
                      onClick={handleRunCustomAudit}
                      disabled={loadingAction}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
                    >
                      {loadingAction ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Auditing Quote via Sensifai AI Engine...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          <span>Audit Quote Now (€0.05 Metered)</span>
                        </>
                      )}
                    </button>

                    <AIDisclaimer />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: NEGOTIATION PLAYBOOK & REPORTS */}
        {activeTab === "negotiate" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    Contractor Negotiation Playbook
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Tactical talking points and questions tailored to {selectedCase.title} ({selectedCase.city}, {selectedCase.state}).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print Audit Report</span>
                  </button>
                </div>
              </div>

              {/* Counter-Offer Box */}
              <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-orange-900 uppercase">
                    Recommended Target Counter-Offer
                  </div>
                  <div className="text-2xl font-black font-mono text-orange-700">
                    ${selectedCase.negotiationScript.recommendedCounterOffer.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-600">
                    Anchored to the 50th percentile trade median rate in {selectedCase.city}.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white border border-orange-200 text-right">
                  <div className="text-[11px] text-slate-500 font-semibold">Immediate Margin Reduction</div>
                  <div className="text-base font-bold font-mono text-emerald-600">
                    -${selectedCase.potentialSavings.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Opening Line */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase">
                  Polite Opening Script (Phone or Email)
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans relative group">
                  <p>&ldquo;{selectedCase.negotiationScript.openingLine}&rdquo;</p>
                  <button
                    onClick={() => copyToClipboard(selectedCase.negotiationScript.openingLine)}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-orange-700 hover:text-orange-800"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy Opening Script</span>
                  </button>
                </div>
              </div>

              {/* Tactical Negotiation Questions */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase">
                  Key Technical Questions to Ask the Contractor
                </div>

                <div className="space-y-3">
                  {selectedCase.negotiationScript.questionsToAsk.map((q, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2 hover:border-orange-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                          <span className="h-5 w-5 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center text-[10px] shrink-0">
                            Q{idx + 1}
                          </span>
                          <span>{q.question}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(q.question, idx)}
                          className="shrink-0 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                          title="Copy Question"
                        >
                          {copiedQuestionIdx === idx ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                        <div className="p-2 rounded bg-slate-50">
                          <span className="font-semibold text-slate-700">Technical Rationale:</span>
                          <p className="text-slate-600 text-[11px] mt-0.5">{q.rationale}</p>
                        </div>
                        <div className="p-2 rounded bg-emerald-50/60 border border-emerald-100">
                          <span className="font-semibold text-emerald-900">Expected Response:</span>
                          <p className="text-emerald-800 text-[11px] mt-0.5">{q.expectedAnswer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DEVELOPER API HUB */}
        {activeTab === "api" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Developer API Hub</h2>
                <p className="text-xs text-slate-600 mt-1">
                  Integrate RepairQuote Check fairness verification directly into property management software, warranty claims systems, or tenant portals.
                </p>
              </div>

              {/* API Keys Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">Dedicated API Keys</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 text-slate-800"
                      placeholder="Key label"
                    />
                    <button
                      onClick={handleCreateApiKey}
                      disabled={generatingKey}
                      className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold"
                    >
                      {generatingKey ? "Generating..." : "+ New Key"}
                    </button>
                  </div>
                </div>

                {keyNoticeMsg && (
                  <div className="p-3 rounded-lg bg-orange-50 border border-orange-200 text-orange-800 text-xs font-mono">
                    {keyNoticeMsg}
                    {generatedKey && (
                      <div className="mt-1 font-bold text-slate-900 select-all">{generatedKey}</div>
                    )}
                  </div>
                )}

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Label</th>
                        <th className="py-2.5 px-3 font-mono">Masked Key</th>
                        <th className="py-2.5 px-3">Created</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {apiKeys.map((k) => (
                        <tr key={k.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-medium text-slate-900">{k.name}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{k.maskedKey}</td>
                          <td className="py-2.5 px-3 text-slate-500">
                            {new Date(k.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                k.status === "active"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {k.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {k.status === "active" && (
                              <button
                                onClick={() => handleRevokeApiKey(k.id)}
                                className="text-rose-600 hover:text-rose-800 font-semibold text-[11px]"
                              >
                                Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* cURL Sandbox */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">Live REST API Sandbox</span>
                  <button
                    onClick={handleRunSandbox}
                    disabled={sandboxLoading}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    {sandboxLoading ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <Terminal className="h-3 w-3" />
                    )}
                    <span>Execute cURL Request</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-2 overflow-x-auto">
                  <div className="text-slate-400"># POST /api/v1/audit</div>
                  <div>curl -X POST https://repairquote-check.sensifai.com/api/v1/audit \</div>
                  <div className="pl-4">-H &quot;Authorization: Bearer {generatedKey || (apiKeys[0]?.maskedKey || "rq_live_...")}&quot; \</div>
                  <div className="pl-4">-H &quot;Content-Type: application/json&quot; \</div>
                  <div className="pl-4">-d &apos;{JSON.stringify({ trade: sandboxTrade, city: sandboxCity, totalQuoted: Number(sandboxAmount) })}&apos;</div>
                </div>

                {sandboxResult && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-60">
                    <pre>{JSON.stringify(sandboxResult, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
