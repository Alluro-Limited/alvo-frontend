export interface SignInCredentials {
  email: string;
  password: string;
}

/** Step 1 of sign-up: the business the account belongs to. */
export interface BusinessInfoInput {
  businessName: string;
  businessType: string;
  businessPhone: string;
  businessEmail: string;
}

/** Step 2 of sign-up: the person who will use the account. */
export interface PersonalDetailsInput {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

export type SignUpInput = BusinessInfoInput & PersonalDetailsInput;

/** Auth service contract against the real API. */
export interface AuthService {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  /** Creates the account and sends the verification code to `input.email`. */
  signUp: (input: SignUpInput) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  resendVerificationCode: () => Promise<void>;
  signOut: () => Promise<void>;
}
