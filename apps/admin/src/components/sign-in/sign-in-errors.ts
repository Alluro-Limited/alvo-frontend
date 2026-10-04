import {getAuthErrorMessage} from "@/components/auth/auth-errors";
import {API_ERROR_CODES, type ErrorContext} from "@/lib/api-errors";
import {m} from "@/paraglide/messages";

const signInErrorContext: ErrorContext = {
  [API_ERROR_CODES.BAD_REQUEST]: m["sign_in.errors.invalid_credentials"],
  [API_ERROR_CODES.UNAUTHORIZED]: m["sign_in.errors.invalid_credentials"],
};

export function getSignInErrorMessage(error: Error): string {
  return getAuthErrorMessage(error, signInErrorContext);
}
