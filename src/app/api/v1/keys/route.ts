export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import {
  listApiKeys,
  createNewApiKey,
  revokeApiKey,
} from "@/lib/sensifai/api-keys";

/**
 * REST API for RepairQuote Check Developer Keys
 * GET    /api/v1/keys - List active/revoked API keys (with masked secrets)
 * POST   /api/v1/keys - Generate a new dedicated application key (rq_live_...)
 * DELETE /api/v1/keys - Revoke an existing API key
 *
 * ZERO personal Logto IDs or personal developer credentials are used.
 */

export async function GET() {
  try {
    const keys = listApiKeys();
    const sanitized = keys.map((k) => ({
      id: k.id,
      name: k.name,
      maskedKey: k.maskedKey,
      createdAt: k.createdAt,
      lastUsedAt: k.lastUsedAt,
      status: k.status,
    }));

    return NextResponse.json({
      success: true,
      keys: sanitized,
      total: sanitized.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Failed to list API keys", message: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body.name || "Home Services Quote Integration Key").trim();

    const newKeyRecord = createNewApiKey(name);

    return NextResponse.json(
      {
        success: true,
        message: "API key generated successfully. Copy the key now; it will not be displayed in full again.",
        key: newKeyRecord,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Failed to create API key", message: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyId = searchParams.get("id");
    if (!keyId) {
      return NextResponse.json(
        { success: false, error: "Missing required query parameter: id" },
        { status: 400 }
      );
    }

    const revoked = revokeApiKey(keyId);
    if (!revoked) {
      return NextResponse.json(
        { success: false, error: "Key not found or could not be revoked" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `API Key ${keyId} revoked successfully.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Failed to revoke API key", message: err.message },
      { status: 500 }
    );
  }
}
