export interface SignInCredentials {
  email: string;
  password: string;
}

/** `setup_required`: an invited admin signing in for the first time, who must finish account setup. */
export type AccountStatus = "active" | "setup_required";

export interface SignInResult {
  accountStatus: AccountStatus;
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

/** Everything the auth screens need from the backend; implemented over HTTP and by the local mock. */
export interface AuthService {
  signIn: (credentials: SignInCredentials) => Promise<SignInResult>;
  getAccountSetup: () => Promise<AccountSetupDetails>;
  completeAccountSetup: (input: CompleteAccountSetupInput) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (input: ResetPasswordInput) => Promise<void>;
  /** Issues a fresh link for an expired one, so the user never re-enters their email. */
  resendResetLink: (token: string) => Promise<ResendResetLinkResult>;
  getCurrentUser: () => Promise<CurrentUser>;
  signOut: () => Promise<void>;
}
