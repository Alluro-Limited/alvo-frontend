import {HTTPError} from "ky";
import {API_ERROR_CODES, getErrorMessage, getServerMessage, type ErrorContext} from "@/lib/api-errors";
import {m} from "@/paraglide/messages";

const CREDENTIAL_CODES = new Set<number>([API_ERROR_CODES.BAD_REQUEST, API_ERROR_CODES.UNAUTHORIZED]);

const alertContext: ErrorContext = {[API_ERROR_CODES.RATE_LIMIT]: m["login.errors.too_many_attempts"]};

export interface LoginError {
  /** Wrong credentials land under the password field, like the designed error state. */
  passwordError?: string;
  /** Rate limiting, outages and backend-sent messages read as a form-level alert. */
  alertMessage?: string;
}

export function getLoginError(error: Error): LoginError {
  const code = error instanceof HTTPError ? error.response.status : null;
  if (code !== null && CREDENTIAL_CODES.has(code)) return {passwordError: m["login.errors.invalid_credentials"]()};
  const message = getServerMessage(error) ?? getErrorMessage(error, alertContext, m["login.errors.service_unavailable"])();
  return {alertMessage: message};
}
