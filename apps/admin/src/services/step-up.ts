import {apiClient} from "./api-client";

interface StepUpTicket {
  token: string;
  expiresAt: number;
}

interface Waiter {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

const EXPIRY_MARGIN_MS = 30_000;

let ticket: StepUpTicket | null = null;
let waiters: Waiter[] = [];
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());
const settle = (fn: (waiter: Waiter) => void) => {
  const queued = waiters;
  waiters = [];
  queued.forEach(fn);
  notify();
};

/** The shell's step-up dialog subscribes so it opens when a privileged call needs a token. */
export function subscribeStepUp(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isStepUpPending(): boolean {
  return waiters.length > 0;
}

/**
 * A fresh `X-Step-Up` token for calls the API marks high-risk. The first call opens
 * the step-up dialog and resolves once the admin enters an authenticator code;
 * concurrent callers share that prompt, and later calls reuse the token until it
 * expires. Rejects when the dialog is dismissed.
 */
export function getStepUpToken(): Promise<string> {
  if (ticket && ticket.expiresAt - EXPIRY_MARGIN_MS > Date.now()) return Promise.resolve(ticket.token);
  return new Promise<string>((resolve, reject) => {
    waiters.push({resolve, reject});
    notify();
  });
}

/** Called by the step-up dialog — trades the authenticator code for the short-lived token. */
export async function submitStepUpCode(code: string): Promise<void> {
  const res = await apiClient.post("v1/admin/auth/step-up", {json: {code}}).json<{token?: string; expiresAt?: string}>();
  if (!res.token) throw new Error("step-up did not return a token");
  ticket = {token: res.token, expiresAt: Date.parse(res.expiresAt ?? "") || Date.now() + 60_000};
  settle((waiter) => waiter.resolve(res.token ?? ""));
}

/** Dismissed without a code — the pending privileged calls abort. */
export function cancelStepUp(): void {
  settle((waiter) => waiter.reject(new Error("step-up cancelled")));
}

export function clearStepUp(): void {
  ticket = null;
}
