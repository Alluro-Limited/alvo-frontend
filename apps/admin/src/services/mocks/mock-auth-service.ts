import {API_ERROR_CODES} from "@/lib/api-errors";
import type {AuthService} from "@/types/auth-types";
import {mockDelay, mockHttpError} from "./mock-http";

/**
 * Inputs that drive the mock into each designed state. Anything else takes the happy path,
 * except sign-in, which only accepts `password`. Signing in with an `invited*` email leads to
 * account setup; the `-expired` / `-unavailable` variants then fail the activation.
 */
export const MOCK_AUTH = {
  password: "Password123!",
  rateLimitedEmail: "locked@alvo.com",
  unavailableEmail: "unavailable@alvo.com",
  invitedEmail: "invited@alvo.com",
  invitedExpiredEmail: "invited-expired@alvo.com",
  invitedUnavailableEmail: "invited-unavailable@alvo.com",
  invitation: {invitedBy: "Dayo Ogunseye", roleLabel: "Business analyst · Read-only finance"},
  expiredToken: "expired",
  unavailableToken: "unavailable",
  maskedEmail: "ol***@alvo.com",
  currentUser: {name: "Dayo Ogunseye"},
} as const;

const SERVICE_UNAVAILABLE = 503;

/** Stands in for the session cookie: which invited admin is mid-setup. */
let pendingSetupEmail: string | null = null;

function failForEmail(path: string, email: string) {
  const normalized = email.toLowerCase();
  if (normalized === MOCK_AUTH.unavailableEmail) throw mockHttpError(path, SERVICE_UNAVAILABLE);
  if (normalized === MOCK_AUTH.rateLimitedEmail) throw mockHttpError(path, API_ERROR_CODES.RATE_LIMIT);
}

function failForToken(path: string, token: string, {allowExpired}: {allowExpired: boolean}) {
  if (token === MOCK_AUTH.unavailableToken) throw mockHttpError(path, SERVICE_UNAVAILABLE);
  if (!allowExpired && token === MOCK_AUTH.expiredToken) throw mockHttpError(path, API_ERROR_CODES.GONE);
}

function failForPendingSetup(path: string) {
  if (pendingSetupEmail === MOCK_AUTH.invitedExpiredEmail) throw mockHttpError(path, API_ERROR_CODES.GONE);
  if (pendingSetupEmail === MOCK_AUTH.invitedUnavailableEmail) throw mockHttpError(path, SERVICE_UNAVAILABLE);
}

/** In-memory stand-in for the backend while it does not exist. Never ships when `VITE_API_URL` is set. */
export const mockAuthService: AuthService = {
  signIn: async ({email, password}) => {
    await mockDelay();
    failForEmail("auth/login", email);
    if (password !== MOCK_AUTH.password) throw mockHttpError("auth/login", API_ERROR_CODES.UNAUTHORIZED);
    const normalized = email.toLowerCase();
    const isInvited = normalized.startsWith("invited");
    pendingSetupEmail = isInvited ? normalized : null;
    return {accountStatus: isInvited ? "setup_required" : "active"};
  },
  getAccountSetup: async () => {
    await mockDelay();
    return {...MOCK_AUTH.invitation};
  },
  completeAccountSetup: async () => {
    await mockDelay();
    failForPendingSetup("auth/account-setup");
    pendingSetupEmail = null;
  },
  requestPasswordReset: async (email) => {
    await mockDelay();
    failForEmail("auth/forgot-password", email);
  },
  resetPassword: async ({token}) => {
    await mockDelay();
    failForToken("auth/reset-password", token, {allowExpired: false});
  },
  resendResetLink: async (token) => {
    await mockDelay();
    failForToken("auth/reset-password/resend", token, {allowExpired: true});
    return {maskedEmail: MOCK_AUTH.maskedEmail};
  },
  getCurrentUser: async () => {
    await mockDelay();
    return {...MOCK_AUTH.currentUser};
  },
  signOut: async () => {
    await mockDelay();
    pendingSetupEmail = null;
  },
};
