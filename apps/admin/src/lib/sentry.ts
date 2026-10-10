import * as Sentry from "@sentry/react";
import type {AnyRouter} from "@tanstack/react-router";

let started = false;

/**
 * Starts Sentry in production builds that have a DSN. Traces are named after the
 * matched route, which is why this is called from `getRouter`. Telemetry must
 * never take the app down, so a failure to start leaves the app untraced.
 */
export function startSentry(router: AnyRouter): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (started || typeof window === "undefined" || !import.meta.env.PROD || !dsn) return;
  started = true;

  const apiUrl = import.meta.env.VITE_API_URL;

  try {
    Sentry.init({
      dsn,
      // Query strings can carry tokens or codes, so they are dropped rather than filtered.
      dataCollection: {userInfo: false, urlQueryParams: false},
      environment: import.meta.env.MODE,
      integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
      tracesSampleRate: 1,
      // Only the API: trace headers on other origins would leak the id and fail their preflight.
      tracePropagationTargets: apiUrl ? [apiUrl] : [],
    });
  } catch {
    started = false;
  }
}
