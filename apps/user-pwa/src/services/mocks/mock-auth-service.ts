import {API_ERROR_CODES} from "@/lib/api-errors";
import type {UserAuthService} from "@/types/auth-types";
import {mockDelay, mockHttpError} from "./mock-http";

/**
 * Inputs that drive the mock into each designed state: `otpCode` is the only code that
 * verifies (sign-up and reset), `password` is the only password that signs in, and any
 * other password lands on the "Wrong Password" banner. `MOCK_AUTH.name` is what the
 * "Login Successful!" screen greets.
 */
export const MOCK_AUTH = {
  otpCode: "12345",
  password: "Password1",
  name: "Olatunji",
} as const;

/** In-memory stand-in for the backend while it does not exist. Never ships when `VITE_API_URL` is set. */
export const mockAuthService: UserAuthService = {
  createAccount: async () => {
    await mockDelay();
  },
  requestVerificationCode: async () => {
    await mockDelay();
  },
  verifyCode: async (code) => {
    await mockDelay();
    if (code !== MOCK_AUTH.otpCode) throw mockHttpError("users/auth/verify-code", API_ERROR_CODES.BAD_REQUEST);
  },
  completeRegistration: async () => {
    await mockDelay();
  },
  signIn: async (_email, password) => {
    await mockDelay();
    if (password !== MOCK_AUTH.password) throw mockHttpError("users/auth/sign-in", API_ERROR_CODES.UNAUTHORIZED);
    return {name: MOCK_AUTH.name};
  },
  requestPasswordReset: async () => {
    await mockDelay();
  },
  verifyResetCode: async (code) => {
    await mockDelay();
    if (code !== MOCK_AUTH.otpCode) throw mockHttpError("users/auth/verify-reset-code", API_ERROR_CODES.BAD_REQUEST);
  },
  resetPassword: async () => {
    await mockDelay();
  },
};
