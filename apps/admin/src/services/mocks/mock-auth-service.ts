import {API_ERROR_CODES} from "@/lib/api-errors";
import type {AuthService} from "@/types/auth-types";
import {mockDelay, mockHttpError} from "./mock-http";

/**
 * Inputs that drive the mock into each designed state. Anything else takes the happy path,
 * except sign-in, which only accepts `password`.
 */
export const MOCK_AUTH = {
  password: "Password123!",
  rateLimitedEmail: "locked@alvo.com",
  unavailableEmail: "unavailable@alvo.com",
  expiredToken: "expired",
  unavailableToken: "unavailable",
  maskedEmail: "ol***@alvo.com",
} as const;

const SERVICE_UNAVAILABLE = 503;

function failForEmail(path: string, email: string) {
  const normalized = email.toLowerCase();
  if (normalized === MOCK_AUTH.unavailableEmail) throw mockHttpError(path, SERVICE_UNAVAILABLE);
  if (normalized === MOCK_AUTH.rateLimitedEmail) throw mockHttpError(path, API_ERROR_CODES.RATE_LIMIT);
}

function failForToken(path: string, token: string, {allowExpired}: {allowExpired: boolean}) {
  if (token === MOCK_AUTH.unavailableToken) throw mockHttpError(path, SERVICE_UNAVAILABLE);
  if (!allowExpired && token === MOCK_AUTH.expiredToken) throw mockHttpError(path, API_ERROR_CODES.GONE);
}

/** In-memory stand-in for the backend while it does not exist. Never ships when `VITE_API_URL` is set. */
export const mockAuthService: AuthService = {
  signIn: async ({email, password}) => {
    await mockDelay();
    failForEmail("auth/login", email);
    if (password !== MOCK_AUTH.password) throw mockHttpError("auth/login", API_ERROR_CODES.UNAUTHORIZED);
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
};
