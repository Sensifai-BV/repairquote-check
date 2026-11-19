export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import {
  listApiKeys,
  createNewApiKey,
  revokeApiKey,
} from "@/lib/sensifai/api-keys";
import { getUserIdFromRequest } from "@/lib/sensifai/auth";

/**
 * REST API for RepairQuote Check Developer Keys
 * GET    /api/v1/keys - List active/revoked API keys (requires Logto auth)
 * POST   /api/v1/keys - Generate a new dedicated application key (requires Logto auth)
 * DELETE /api/v1/keys - Revoke an existing API key (requires Logto auth)
 *
 * STRICT SECURITY:
 * 1. Zero guest key generation: Unauthenticated users receive 401 Unauthorized.
 * 2. Keys are strictly bound to the authenticated user's Logto account.
 * 3. Logto user ID is strictly kept internal and NEVER leaked in responses.
 */

export async function GET(req: NextRequest) {
  try {
    const sub = getUserIdFromRequest(req);
    if (!sub) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required to view API keys. Please sign in with your Sensifai account.",
          code: "UNAUTHORIZED",
          login_url: "/api/auth/login",
        },
        { status: 401 }
      );
    }

    const keys = listApiKeys(sub);
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
    const sub = getUserIdFromRequest(req);
    if (!sub) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required to generate an API key. Please sign in with your Sensifai account.",
          code: "UNAUTHORIZED",
          login_url: "/api/auth/login",
        },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const name = String(body.name || "Home Services Quote Integration Key").trim();

    const newKeyRecord = createNewApiKey(name, sub);

    return NextResponse.json(
      {
        success: true,
        message: "API key generated successfully. Copy the key now; it will not be displayed in full again.",
        key: {
          id: newKeyRecord.id,
          name: newKeyRecord.name,
          key: newKeyRecord.key,
          maskedKey: newKeyRecord.maskedKey,
          createdAt: newKeyRecord.createdAt,
          status: newKeyRecord.status,
        },
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
    const sub = getUserIdFromRequest(req);
    if (!sub) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required to revoke an API key. Please sign in.",
          code: "UNAUTHORIZED",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const keyId = searchParams.get("id");
    if (!keyId) {
      return NextResponse.json(
        { success: false, error: "Missing required query parameter: id" },
        { status: 400 }
      );
    }

    const revoked = revokeApiKey(keyId, sub);
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
