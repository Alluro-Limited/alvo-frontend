/** The five boxes in the verification screen — the backend sends a 5-digit SMS code. */
export const OTP_LENGTH = 5;

/** Phone-number + OTP sign-in for couriers; implemented over HTTP and by the local mock. */
export interface CourierAuthService {
  /** Sends the SMS code to `phone` (local digits, e.g. "8012345678"). 404 = no courier account. */
  requestLoginOtp: (phone: string) => Promise<void>;
  resendLoginOtp: (phone: string) => Promise<void>;
  /** 400 = wrong code, 429 = too many attempts. On success the session is established server-side. */
  verifyLoginOtp: (phone: string, code: string) => Promise<void>;
}
