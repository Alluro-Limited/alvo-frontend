import {API_ERROR_CODES} from "@/lib/api-errors";
import {clearSession, setSession} from "@/services/session";
import type {UserAuthService} from "@/types/auth-types";
import {mockDelay, mockHttpError} from "./mock-http";

/** The API returns a 60s `resendAfterSeconds`; the mock keeps 30s so dev flows stay snappy. */
export const MOCK_RESEND_SECONDS = 30;

/**
 * Inputs that drive the mock into each designed state: `otpCode` is the only code that
 * verifies (sign-up and reset), `password` is the only password that signs in, and any
 * other password lands on the "Wrong Password" banner. `MOCK_AUTH.name` is what the
 * "Login Successful!" screen greets.
 */
export const MOCK_AUTH = {
  otpCode: "123456",
  password: "Password1",
  name: "Olatunji",
} as const;

const MOCK_SESSION = {accessToken: "mock-access", refreshToken: "mock-refresh"};

/** In-memory stand-in for the backend. Never ships when `VITE_API_URL` is set. */
export const mockAuthService: UserAuthService = {
  createAccount: async () => {
    await mockDelay();
  },
  requestVerificationCode: async () => {
    await mockDelay();
    return MOCK_RESEND_SECONDS;
  },
  verifyCode: async (_identifier, _method, code) => {
    await mockDelay();
    if (code !== MOCK_AUTH.otpCode) throw mockHttpError("v1/auth/verify", API_ERROR_CODES.BAD_REQUEST);
    setSession(MOCK_SESSION);
  },
  completeRegistration: async () => {
    await mockDelay();
  },
  signIn: async (_email, password) => {
    await mockDelay();
    if (password !== MOCK_AUTH.password) throw mockHttpError("v1/auth/sign-in", API_ERROR_CODES.UNAUTHORIZED);
    setSession(MOCK_SESSION);
    return {name: MOCK_AUTH.name};
  },
  requestPasswordReset: async () => {
    await mockDelay();
    return MOCK_RESEND_SECONDS;
  },
  confirmPasswordReset: async (_email, code) => {
    await mockDelay();
    if (code !== MOCK_AUTH.otpCode) throw mockHttpError("v1/auth/reset-password/confirm", API_ERROR_CODES.BAD_REQUEST);
  },
  signOut: async () => {
    await mockDelay();
    clearSession();
  },
};
