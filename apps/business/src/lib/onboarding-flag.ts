/**
 * Session-scoped flag set when a fresh signup finishes email verification. The app
 * shell consumes it once to open the welcome modal + tour. A real backend would
 * return this in the profile payload instead.
 */
let pendingWelcome = false;

export function markOnboardingPending() {
  pendingWelcome = true;
}

export function consumeOnboardingPending() {
  const pending = pendingWelcome;
  pendingWelcome = false;
  return pending;
}
