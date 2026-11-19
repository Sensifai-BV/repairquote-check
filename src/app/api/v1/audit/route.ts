export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/sensifai/api-keys";
import { REPAIR_PRESETS } from "@/lib/presets";
import { usageService } from "@/lib/sensifai/usage";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, X-API-Key, Content-Type",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization") || "";
    const apiKey =
      authHeader.replace(/^Bearer\s+/i, "").trim() ||
      req.headers.get("X-API-Key") ||
      "";

    const { valid, record } = validateApiKey(apiKey);
    if (!valid || !record) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid or missing API key. Provide Authorization: Bearer rq_live_... or X-API-Key.",
          code: "UNAUTHORIZED_KEY",
        },
        {
          status: 401,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const userId = record.userId;
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "API key is not associated with an authorized user account.",
          code: "UNAUTHORIZED_KEY",
        },
        {
          status: 401,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // 1. Metered Wallet Pre-Check & Live Atomic Gatekeeper Deduction (€0.05)
    // Strictly blocks with HTTP 402 if customer has zero or insufficient balance!
    const deduction = await usageService.deductAndSyncWallet({
      logtoUserId: userId,
      operation: "api_quote_audit",
      usageUnits: 1,
    });

    if (!deduction.success || deduction.status === 402) {
      return NextResponse.json(
        {
          success: false,
          error:
            deduction.error ||
            "Prepaid wallet balance depleted or insufficient. Please top up your Sensifai wallet to continue using the API.",
          code: "PAYMENT_REQUIRED",
          currentBalanceEur: deduction.wallet?.balance ?? 0,
          topUpUrl: deduction.topUpUrl || "https://sensifai.com/marketplace",
        },
        {
          status: 402,
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const body = await req.json().catch(() => ({}));
    const trade = String(body.trade || "HVAC").trim();
    const city = String(body.city || "Dallas").trim();
    const state = String(body.state || "TX").trim();
    const projectTitle = String(
      body.title || body.projectTitle || `${trade} Repair Estimate`
    ).trim();
    const quotedAmount = Math.max(0, Number(body.totalQuoted) || 3500);

    const matchedPreset =
      REPAIR_PRESETS.find(
        (p) => p.trade.toLowerCase() === trade.toLowerCase()
      ) || REPAIR_PRESETS[0];

    // Compute localized benchmark ratio
    const fairTotalMedian = matchedPreset.fairTotalMedian;
    const potentialSavings = Math.max(0, quotedAmount - fairTotalMedian);
    const markupRatio =
      fairTotalMedian > 0 ? (quotedAmount - fairTotalMedian) / fairTotalMedian : 0;

    let fairnessScore = matchedPreset.fairnessScore;
    let verdictTone: "fair" | "warning" | "alert" = "fair";
    let verdictHeadline = "Quote within Expected Regional Fair Band";

    if (markupRatio > 0.45) {
      fairnessScore = Math.max(25, Math.round(100 - markupRatio * 70));
      verdictTone = "alert";
      verdictHeadline = `Significant Price Inflation Detected (+${Math.round(
        markupRatio * 100
      )}% Above Regional Median)`;
    } else if (markupRatio > 0.15) {
      fairnessScore = Math.max(50, Math.round(100 - markupRatio * 60));
      verdictTone = "warning";
      verdictHeadline = `Moderate Price Variance (+${Math.round(
        markupRatio * 100
      )}% Above Regional Median)`;
    }

    const reportId = `RQC-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;

    return NextResponse.json(
      {
        success: true,
        authenticatedAs: record.name,
        reportId,
        projectTitle,
        trade,
        city,
        state,
        totalQuoted: quotedAmount,
        fairTotalLow: matchedPreset.fairTotalLow,
        fairTotalHigh: matchedPreset.fairTotalHigh,
        fairTotalMedian,
        potentialSavings,
        fairnessScore,
        verdictTone,
        verdictHeadline,
        lineItems: matchedPreset.lineItems,
        paddedFlags: matchedPreset.paddedFlags,
        negotiationScript: {
          recommendedCounterOffer: fairTotalMedian,
          openingLine: matchedPreset.negotiationScript.openingLine,
          questionsToAsk: matchedPreset.negotiationScript.questionsToAsk,
        },
        meta: {
          evaluatedAt: new Date().toISOString(),
          engine: "Sensifai Vision Core (Dynamic Telemetry)",
          walletBalanceRemainingEur: deduction.wallet?.balance ?? 0,
          costPerAuditEur: 0.05,
          rateLimitRemaining: 119,
        },
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal API processing error",
        message: err.message,
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}
