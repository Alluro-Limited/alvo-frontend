import {HTTPError} from "ky";
import {API_ERROR_CODES, getErrorMessage, getServerMessage, type ErrorContext} from "@/lib/api-errors";
import {m} from "@/paraglide/messages";

const INVALID_CODE_CODES = new Set<number>([API_ERROR_CODES.BAD_REQUEST, API_ERROR_CODES.UNAUTHORIZED]);

const alertContext: ErrorContext = {
  [API_ERROR_CODES.RATE_LIMIT]: m["sign_up.errors.too_many_attempts"],
  [API_ERROR_CODES.CONFLICT]: m["sign_up.errors.email_taken"],
};

/** Sign-up submission failures read as a form-level alert above the fields. */
export function getSignUpErrorMessage(error: Error): string {
  return getServerMessage(error) ?? getErrorMessage(error, alertContext, m["sign_up.errors.service_unavailable"])();
}

export interface VerificationError {
  title: string;
  body: string;
}

/** 400/401 means the typed code was wrong; anything else is a verification failure. */
export function getVerificationError(error: Error): VerificationError {
  const code = error instanceof HTTPError ? error.response.status : null;
  if (code !== null && INVALID_CODE_CODES.has(code)) {
    return {title: m["sign_up.errors.incorrect_code_title"](), body: m["sign_up.errors.incorrect_code_body"]()};
  }
  return {
    title: m["sign_up.errors.verification_failed"](),
    body: getServerMessage(error) ?? getErrorMessage(error, alertContext, m["sign_up.errors.service_unavailable"])(),
  };
}
