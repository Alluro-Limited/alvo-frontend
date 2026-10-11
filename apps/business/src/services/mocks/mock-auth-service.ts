import {API_ERROR_CODES} from "@/lib/api-errors";
import type {AuthService} from "@/types/auth-types";
import {mockDelay, mockHttpError} from "./mock-http";
import {mockSession} from "./mock-session";

/**
 * Inputs that drive the mock into each designed state. Sign-in only accepts `password`,
 * sign-up rejects the three special emails, and email verification only accepts `otpCode`.
 */
export const MOCK_AUTH = {
  password: "Password123!",
  otpCode: "12345",
  rateLimitedEmail: "locked@alvo.com",
  unavailableEmail: "unavailable@alvo.com",
  takenEmail: "taken@alvo.com",
  /** Signing in as this account serves the populated dashboard instead of the fresh-account empty state. */
  demoEmail: "demo@alvo.com",
} as const;

const SERVICE_UNAVAILABLE = 503;

function failForEmail(path: string, email: string) {
  const normalized = email.toLowerCase();
  if (normalized === MOCK_AUTH.unavailableEmail) throw mockHttpError(path, SERVICE_UNAVAILABLE);
  if (normalized === MOCK_AUTH.rateLimitedEmail) throw mockHttpError(path, API_ERROR_CODES.RATE_LIMIT);
  if (normalized === MOCK_AUTH.takenEmail) throw mockHttpError(path, API_ERROR_CODES.CONFLICT);
}

/** In-memory stand-in for the backend while it does not exist. Never ships when `VITE_API_URL` is set. */
export const mockAuthService: AuthService = {
  signIn: async ({email, password}) => {
    await mockDelay();
    const normalized = email.toLowerCase();
    if (normalized === MOCK_AUTH.unavailableEmail) throw mockHttpError("auth/login", SERVICE_UNAVAILABLE);
    if (normalized === MOCK_AUTH.rateLimitedEmail) throw mockHttpError("auth/login", API_ERROR_CODES.RATE_LIMIT);
    if (password !== MOCK_AUTH.password) throw mockHttpError("auth/login", API_ERROR_CODES.UNAUTHORIZED);
    mockSession.email = normalized;
    mockSession.firstName = normalized === MOCK_AUTH.demoEmail ? "Quadri" : null;
  },
  signUp: async (input) => {
    await mockDelay();
    failForEmail("auth/sign-up", input.email);
    mockSession.email = input.email.toLowerCase();
    mockSession.firstName = input.firstName;
  },
  verifyEmail: async (code) => {
    await mockDelay();
    if (code !== MOCK_AUTH.otpCode) throw mockHttpError("auth/verify-email", API_ERROR_CODES.BAD_REQUEST);
  },
  resendVerificationCode: async () => {
    await mockDelay();
  },
  signOut: async () => {
    mockSession.email = null;
    mockSession.firstName = null;
    mockSession.walletBalance = null;
  },
};
