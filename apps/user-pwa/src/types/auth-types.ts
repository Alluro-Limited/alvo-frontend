export const OTP_LENGTH = 6;

/** Sent with the first password as `termsVersion` — bump when the terms copy changes. */
export const TERMS_VERSION = "v1";

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
  /** Step 2 — sends a code to the identifier (email or phone) through the chosen channel. Resolves to the resend cooldown in seconds. */
  requestVerificationCode: (identifier: string, method: VerificationMethod) => Promise<number>;
  /** Step 2b — validates the 6-digit code and starts the session; 400 when wrong. */
  verifyCode: (identifier: string, method: VerificationMethod, code: string) => Promise<void>;
  /** Step 3 — sets the password with the accepted terms version and finishes registration. */
  completeRegistration: (password: string) => Promise<void>;
  /** Email + password sign-in; 401 when the password is wrong. */
  signIn: (email: string, password: string) => Promise<SignInResult>;
  /** Reset step 1 — always succeeds, matching the design's "if an account exists" copy. Resolves to the resend cooldown in seconds. */
  requestPasswordReset: (email: string) => Promise<number>;
  /** Reset steps 2+3 — the API verifies the code and saves the new password in one call. Throws `invalid_code` when the code is wrong. */
  confirmPasswordReset: (email: string, code: string, newPassword: string) => Promise<void>;
  /** Ends the server session and clears the stored tokens. */
  signOut: () => Promise<void>;
}
