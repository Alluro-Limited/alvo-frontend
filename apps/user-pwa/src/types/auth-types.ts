export const OTP_LENGTH = 5;

export type VerificationMethod = "email" | "sms" | "whatsapp";

/** The fields collected on the first sign-up step. */
export interface SignUpDetails {
  fullName: string;
  preferredName: string;
  phone: string;
  email: string;
  referralCode: string;
}

export interface SignInResult {
  /** Shown on the "Login Successful!" screen. */
  name: string;
}

export interface UserAuthService {
  /** Step 1 — creates the pending account the verification code is sent against. */
  createAccount: (details: SignUpDetails) => Promise<void>;
  /** Step 2 — sends a code through the chosen channel. */
  requestVerificationCode: (method: VerificationMethod) => Promise<void>;
  /** Step 2b — validates the 5-digit code; 400 when wrong. */
  verifyCode: (code: string) => Promise<void>;
  /** Step 3 — sets the password and finishes registration. */
  completeRegistration: (password: string) => Promise<void>;
  /** Email + password sign-in; 401 when the password is wrong. */
  signIn: (email: string, password: string) => Promise<SignInResult>;
  /** Reset step 1 — always succeeds, matching the design's "if an account exists" copy. */
  requestPasswordReset: (email: string) => Promise<void>;
  /** Reset step 2 — validates the emailed code; 400 when wrong. */
  verifyResetCode: (code: string) => Promise<void>;
  /** Reset step 3 — saves the new password. */
  resetPassword: (password: string) => Promise<void>;
}
