import {API_ERROR_CODES, getErrorMessage, getServerMessage, type ErrorContext} from "@/lib/api-errors";
import {m} from "@/paraglide/messages";

const signInErrorContext: ErrorContext = {
  [API_ERROR_CODES.BAD_REQUEST]: m["sign_in.errors.invalid_credentials"],
  [API_ERROR_CODES.UNAUTHORIZED]: m["sign_in.errors.invalid_credentials"],
  [API_ERROR_CODES.RATE_LIMIT]: m["sign_in.errors.too_many_attempts"],
};

/** Prefers the backend's own message; otherwise maps the status code. Network failures and 5xx read as an outage. */
export function getSignInErrorMessage(error: Error): string {
  return getServerMessage(error) ?? getErrorMessage(error, signInErrorContext, m["sign_in.errors.service_unavailable"])();
}
