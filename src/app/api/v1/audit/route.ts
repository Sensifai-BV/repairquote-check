export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/sensifai/api-keys";
import { REPAIR_PRESETS } from "@/lib/presets";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization") || "";
    const apiKey = authHeader.replace(/^Bearer\s+/i, "").trim() || req.headers.get("X-API-Key") || "";

    const { valid, record } = validateApiKey(apiKey);
    if (!valid || !record) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or missing API key. Provide Authorization: Bearer rq_live_... or X-API-Key.",
          code: "UNAUTHORIZED_KEY",
        },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const trade = body.trade || "HVAC";
    const city = body.city || "Dallas";
    const quotedAmount = Number(body.totalQuoted) || 3500;

    const matchedPreset = REPAIR_PRESETS.find(
      (p) => p.trade.toLowerCase() === trade.toLowerCase()
    ) || REPAIR_PRESETS[0];

    return NextResponse.json({
      success: true,
      authenticatedAs: record.name,
      reportId: `RQC-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`,
      trade,
      city,
      totalQuoted: quotedAmount,
      fairTotalMedian: matchedPreset.fairTotalMedian,
      potentialSavings: Math.max(0, quotedAmount - matchedPreset.fairTotalMedian),
      fairnessScore: matchedPreset.fairnessScore,
      verdictHeadline: matchedPreset.verdictHeadline,
      lineItems: matchedPreset.lineItems,
      paddedFlags: matchedPreset.paddedFlags,
      negotiationScript: matchedPreset.negotiationScript,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Internal API processing error", message: err.message },
      { status: 500 }
    );
  }
}
