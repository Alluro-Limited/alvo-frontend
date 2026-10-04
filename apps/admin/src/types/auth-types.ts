export interface SignInCredentials {
  email: string;
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

/** Everything the auth screens need from the backend; implemented over HTTP and by the local mock. */
export interface AuthService {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (input: ResetPasswordInput) => Promise<void>;
  /** Issues a fresh link for an expired one, so the user never re-enters their email. */
  resendResetLink: (token: string) => Promise<ResendResetLinkResult>;
}
