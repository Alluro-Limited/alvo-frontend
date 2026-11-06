import ky from "ky";

const STORAGE_KEY = "alvo.business.session";

export const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/?$/, "/");

export interface SmeProfile {
  id: string;
  businessName: string;
  workEmail: string;
  tier: string;
  status: string;
}

export interface SessionData {
  accessToken: string;
  refreshToken: string;
  /** The SME snapshot returned at sign-in — no `/v1/sme/me` endpoint exists yet. */
  sme?: SmeProfile;
}

let session: SessionData | null = load();
let refreshPromise: Promise<boolean> | null = null;

function load(): SessionData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionData) : null;
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  return session?.accessToken ?? null;
}

export function getRefreshToken(): string | null {
  return session?.refreshToken ?? null;
}

export function getSme(): SmeProfile | null {
  return session?.sme ?? null;
}

export function isSignedIn(): boolean {
  return session !== null;
}

export function setSession(next: SessionData): void {
  session = {...next, sme: next.sme ?? session?.sme};
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  session = null;
  localStorage.removeItem(STORAGE_KEY);
}

/** Concurrent 401s share one in-flight refresh; a failed refresh clears the session. */
export function refreshSession(): Promise<boolean> {
  refreshPromise ??= doRefresh().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

async function doRefresh(): Promise<boolean> {
  const refreshToken = session?.refreshToken;
  if (!refreshToken) return false;
  try {
    const next = await ky.post("v1/auth/refresh", {prefix: API_BASE, json: {refreshToken}}).json<SessionData>();
    setSession(next);
    return true;
  } catch {
    clearSession();
    return false;
  }
}
