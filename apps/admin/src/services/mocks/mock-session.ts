/**
 * Shared state the service mocks pretend the session cookie carries.
 * Auth writes it, other mocks read it — so e.g. the dashboard knows who signed in.
 */
export const mockSession = {
  /** The signed-in email. */
  email: null as string | null,
  /** Which invited admin is mid account setup. */
  pendingSetupEmail: null as string | null,
  /** Set when a new admin finishes account setup — drives the dashboard's welcome state. */
  justActivated: false,
};
