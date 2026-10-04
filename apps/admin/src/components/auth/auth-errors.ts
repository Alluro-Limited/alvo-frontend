import {API_ERROR_CODES, getErrorMessage, getServerMessage, type ErrorContext} from "@/lib/api-errors";
import {m} from "@/paraglide/messages";

const rateLimitContext: ErrorContext = {[API_ERROR_CODES.RATE_LIMIT]: m["auth.errors.too_many_attempts"]};

/**
 * Prefers the backend's own message; otherwise maps the status code through `context`
 * (rate limiting is always covered). Network failures and 5xx read as an outage.
 */
export function getAuthErrorMessage(error: Error, context: ErrorContext = {}): string {
  const message = getErrorMessage(error, {...rateLimitContext, ...context}, m["auth.errors.service_unavailable"]);
  return getServerMessage(error) ?? message();
}
