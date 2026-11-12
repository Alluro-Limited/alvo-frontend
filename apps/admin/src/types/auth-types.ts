export interface SignInCredentials {
  email: string;
  password: string;
}

/** `setup_required`: an invited admin signing in for the first time, who must finish account setup. */
export type AccountStatus = "active" | "setup_required";

export interface SignInResult {
  accountStatus: AccountStatus;
}

/** Base32 secret + otpauth URI for registering an authenticator app (first sign-in or account setup). */
export interface TotpEnrollment {
  secret: string;
  otpauthUri: string;
}

/**
 * Sign-in never returns a session directly — it returns a challenge the second
 * factor answers. `enrollment` is present when the admin has no authenticator yet.
 */
export interface SignInChallenge {
  challengeId: string;
  enrollment?: TotpEnrollment;
}

export interface VerifySecondFactorInput {
  challengeId: string;
  code: string;
  /** True while confirming a fresh enrollment (`totp/confirm`), false for a regular sign-in (`totp`). */
  enrolling: boolean;
}

/** What the invitation tells the new admin before they activate their account. */
export interface AccountSetupDetails {
  invitedBy: string;
  /** Display label of the role the inviting admin assigned, e.g. "Business analyst · Read-only finance". */
  roleLabel: string;
}

export interface CompleteAccountSetupInput {
  firstName: string;
  lastName: string;
  password: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface ResendResetLinkResult {
  /** The address the new link went to, masked by the backend (e.g. `ol***@alvo.com`). */
  maskedEmail: string;
}

/** The signed-in admin, shown in the shell (avatar initial today, menus later). */
export interface CurrentUser {
  name: string;
}

/** Auth service contract against the real API. */
export interface AuthService {
  /** Email + password answer the first factor; the response is always a TOTP challenge. */
  signIn: (credentials: SignInCredentials) => Promise<SignInChallenge>;
  /** Second factor: verify an enrolled authenticator's code, or confirm a fresh enrollment. */
  verifySecondFactor: (input: VerifySecondFactorInput) => Promise<SignInResult>;
  getAccountSetup: () => Promise<AccountSetupDetails>;
  /** Accepting the invitation returns the same sign-in challenge — enrollment always follows. */
  completeAccountSetup: (input: CompleteAccountSetupInput) => Promise<SignInChallenge>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (input: ResetPasswordInput) => Promise<void>;
  /** Issues a fresh link for an expired one; reuses the email stored at request time. */
  resendResetLink: (token: string) => Promise<ResendResetLinkResult>;
  getCurrentUser: () => Promise<CurrentUser>;
  signOut: () => Promise<void>;
}
