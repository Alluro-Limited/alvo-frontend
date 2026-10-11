/**
 * The mock services share one in-memory session so the dashboard can greet the
 * person who signed in (or signed up) and serve the canned "demo" account data.
 * Real sessions come from cookies — this only exists while `VITE_API_URL` is unset.
 */
export interface MockSession {
  email: string | null;
  firstName: string | null;
  /** Mutable demo wallet so paying by wallet visibly debits the balance in the header. */
  walletBalance: number | null;
}

export const mockSession: MockSession = {email: null, firstName: null, walletBalance: null};
