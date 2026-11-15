export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { REPAIR_PRESETS } from "@/lib/presets";

export async function GET() {
  const trades = [
    {
      trade: "HVAC",
      label: "Heating, Ventilation & Air Conditioning",
      benchmarkHourlyRateUsd: { low: 95, high: 165, median: 125 },
      commonPaddedItems: [
        "Nitrogen flush surcharge on intact lines",
        "Mandatory dual-capacitor replacement at 400% markup",
        "Unwarranted complete compressor condemnation",
      ],
      samplePresets: REPAIR_PRESETS.filter((p) => p.trade === "HVAC").map((p) => ({
        id: p.id,
        title: p.title,
        city: p.city,
      })),
    },
    {
      trade: "Plumbing",
      label: "Residential Plumbing & Water Heaters",
      benchmarkHourlyRateUsd: { low: 85, high: 150, median: 115 },
      commonPaddedItems: [
        "Unbundled disposal fee when already included in haul-away",
        "Redundant thermal expansion tank brackets",
        "Emergency dispatch multiplier on standard business hours",
      ],
      samplePresets: REPAIR_PRESETS.filter((p) => p.trade === "Plumbing").map((p) => ({
        id: p.id,
        title: p.title,
        city: p.city,
      })),
    },
    {
      trade: "Roofing",
      label: "Roofing, Flashing & Chimney Systems",
      benchmarkHourlyRateUsd: { low: 75, high: 135, median: 105 },
      commonPaddedItems: [
        "Complete roof redecking when only step flashing leaked",
        "Double-counted dumpster drop fees",
        "Non-existent municipal cricket permit fees",
      ],
      samplePresets: REPAIR_PRESETS.filter((p) => p.trade === "Roofing").map((p) => ({
        id: p.id,
        title: p.title,
        city: p.city,
      })),
    },
    {
      trade: "Electrical",
      label: "Electrical Panels & Service Upgrades",
      benchmarkHourlyRateUsd: { low: 90, high: 160, median: 120 },
      commonPaddedItems: [
        "Excessive meter disconnect coordination fees",
        "Unnecessary whole-home circuit breaker repull",
        "Overpriced surge protector hardware markup",
      ],
      samplePresets: REPAIR_PRESETS.filter((p) => p.trade === "Electrical").map((p) => ({
        id: p.id,
        title: p.title,
        city: p.city,
      })),
    },
  ];

  return NextResponse.json({
    success: true,
    version: "v1",
    totalTrades: trades.length,
    trades,
    supportedEndpoints: [
      {
        method: "GET",
        path: "/api/v1/trades",
        description: "List supported trade domains, benchmark labor rates, and presets.",
      },
      {
        method: "GET",
        path: "/api/v1/keys",
        description: "List active application API keys (masked).",
      },
      {
        method: "POST",
        path: "/api/v1/keys",
        description: "Generate a new application API key (rq_live_...).",
      },
      {
        method: "DELETE",
        path: "/api/v1/keys?id=:keyId",
        description: "Revoke an existing application API key.",
      },
      {
        method: "POST",
        path: "/api/v1/audit",
        description: "Run automated estimate fairness audit using application API key.",
      },
    ],
  });
}
