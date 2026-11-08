/** The six boxes in the verification screen — the backend sends a 6-digit SMS code. */
export const OTP_LENGTH = 6;

/** Auth service contract against the real API. */
export interface CourierAuthService {
  /** Sends the SMS code to `phone` (local digits, e.g. "8012345678"). 404 = no courier account. */
  requestLoginOtp: (phone: string) => Promise<void>;
  resendLoginOtp: (phone: string) => Promise<void>;
  /** 400 = wrong code, 429 = too many attempts. On success the session is established server-side. */
  verifyLoginOtp: (phone: string, code: string) => Promise<void>;
}
