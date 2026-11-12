import ky from "ky";

const STORAGE_KEY = "alvo.admin.session";

export const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/?$/, "/");

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

let tokens: SessionTokens | null = load();
let refreshPromise: Promise<boolean> | null = null;

function load(): SessionTokens | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionTokens) : null;
  } catch {
    return null;
  }
}

export function getAccessToken(): string | null {
  return tokens?.accessToken ?? null;
}

export function getRefreshToken(): string | null {
  return tokens?.refreshToken ?? null;
}

export function isSignedIn(): boolean {
  return tokens !== null;
}

export function setSession(next: SessionTokens): void {
  tokens = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearSession(): void {
  tokens = null;
  localStorage.removeItem(STORAGE_KEY);
}

/** Concurrent 401s share one in-flight refresh; a failed refresh clears the session. */
export function refreshSession(): Promise<boolean> {
  refreshPromise ??= doRefresh().finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

/** Admin tokens rotate through the admin refresh endpoint, not the user one. */
async function doRefresh(): Promise<boolean> {
  const refreshToken = tokens?.refreshToken;
  if (!refreshToken) return false;
  try {
    const next = await ky.post("v1/admin/auth/refresh", {prefix: API_BASE, json: {refreshToken}}).json<SessionTokens>();
    setSession({accessToken: next.accessToken, refreshToken: next.refreshToken});
    return true;
  } catch {
    clearSession();
    return false;
  }
}
