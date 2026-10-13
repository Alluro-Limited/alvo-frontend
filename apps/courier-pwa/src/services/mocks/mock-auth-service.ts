import {API_ERROR_CODES} from "@/lib/api-errors";
import type {CourierAuthService} from "@/types/auth-types";
import {mockDelay, mockHttpError} from "./mock-http";
import {mockSession} from "./mock-session";

/**
 * Inputs that drive the mock into each designed state: `otpCode` is the only code that
 * verifies, `unknownPhone` is the only number with no account, and `maxAttempts` wrong
 * codes lock the number out with a 429 ("Too Many Attempts" alert).
 */
export const MOCK_AUTH = {
  otpCode: "12345",
  unknownPhone: "0000000000",
  maxAttempts: 3,
} as const;

const failedAttempts = new Map<string, number>();

function assertAccountExists(path: string, phone: string) {
  if (phone === MOCK_AUTH.unknownPhone) throw mockHttpError(path, API_ERROR_CODES.NOT_FOUND);
}

/** In-memory stand-in for the backend while it does not exist. Never ships when `VITE_API_URL` is set. */
export const mockAuthService: CourierAuthService = {
  requestLoginOtp: async (phone) => {
    await mockDelay();
    assertAccountExists("courier/auth/request-otp", phone);
    failedAttempts.delete(phone);
  },
  resendLoginOtp: async (phone) => {
    await mockDelay();
    assertAccountExists("courier/auth/resend-otp", phone);
  },
  verifyLoginOtp: async (phone, code) => {
    await mockDelay();
    if (code === MOCK_AUTH.otpCode) {
      failedAttempts.delete(phone);
      mockSession.phone = phone;
      return;
    }
    const attempts = (failedAttempts.get(phone) ?? 0) + 1;
    failedAttempts.set(phone, attempts);
    const status = attempts >= MOCK_AUTH.maxAttempts ? API_ERROR_CODES.RATE_LIMIT : API_ERROR_CODES.BAD_REQUEST;
    throw mockHttpError("courier/auth/verify-otp", status);
  },
};
