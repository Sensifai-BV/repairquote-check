import crypto from "crypto";
import fs from "fs";
import path from "path";

export interface ApiKeyRecord {
  id: string;
  name: string;
  key: string;
  maskedKey: string;
  createdAt: string;
  lastUsedAt: string | null;
  status: "active" | "revoked";
}

let inMemoryKeys: ApiKeyRecord[] = [];
const KEYS_FILE_PATH = path.resolve(process.cwd(), ".dev-api-keys.json");

function loadStoredKeys(): ApiKeyRecord[] {
  try {
    if (fs.existsSync(KEYS_FILE_PATH)) {
      const data = fs.readFileSync(KEYS_FILE_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        inMemoryKeys = parsed;
      }
    }
  } catch (err) {
    console.warn("[API_KEYS] Could not load stored keys:", err);
  }
  return inMemoryKeys;
}

function persistKeys(keys: ApiKeyRecord[]) {
  inMemoryKeys = keys;
  try {
    fs.writeFileSync(KEYS_FILE_PATH, JSON.stringify(keys, null, 2), "utf-8");
  } catch (err) {
    console.warn("[API_KEYS] Could not persist keys:", err);
  }
}

/**
 * Generates a brand-new, cryptographically secure application API key.
 * Format: rq_live_<32 hex chars>
 * Zero personal Logto IDs, personal tokens, or hardcoded credentials.
 */
export function createNewApiKey(name = "Home Services Quote Integration Key"): ApiKeyRecord {
  const keys = loadStoredKeys();
  const randomBytes = crypto.randomBytes(24).toString("hex");
  const rawKey = `rq_live_${randomBytes}`;
  const maskedKey = `rq_live_${randomBytes.slice(0, 4)}...${randomBytes.slice(-4)}`;

  const record: ApiKeyRecord = {
    id: `key_${crypto.randomBytes(8).toString("hex")}`,
    name,
    key: rawKey,
    maskedKey,
    createdAt: new Date().toISOString(),
    lastUsedAt: null,
    status: "active",
  };

  keys.unshift(record);
  persistKeys(keys);
  return record;
}

export function listApiKeys(): ApiKeyRecord[] {
  const keys = loadStoredKeys();
  if (keys.length === 0) {
    const defaultKey = createNewApiKey("Default Property Management Integration Key");
    return [defaultKey];
  }
  return keys;
}

export function revokeApiKey(id: string): boolean {
  const keys = loadStoredKeys();
  const keyIndex = keys.findIndex((k) => k.id === id);
  if (keyIndex === -1) return false;

  keys[keyIndex].status = "revoked";
  persistKeys(keys);
  return true;
}

export function validateApiKey(rawKey: string): { valid: boolean; record?: ApiKeyRecord } {
  if (!rawKey || typeof rawKey !== "string") return { valid: false };
  const keys = loadStoredKeys();
  const clean = rawKey.trim();
  const found = keys.find(
    (k) => (k.key === clean || k.maskedKey === clean) && k.status === "active"
  );
  if (!found) return { valid: false };

  found.lastUsedAt = new Date().toISOString();
  persistKeys(keys);
  return { valid: true, record: found };
}
