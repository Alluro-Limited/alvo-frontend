import {getAuthErrorMessage} from "@/components/auth/auth-errors";
import {API_ERROR_CODES, type ErrorContext} from "@/lib/api-errors";
import {m} from "@/paraglide/messages";

const twoFactorErrorContext: ErrorContext = {
  [API_ERROR_CODES.BAD_REQUEST]: m["sign_in.totp.errors.invalid_code"],
  [API_ERROR_CODES.UNAUTHORIZED]: m["sign_in.totp.errors.invalid_code"],
  [API_ERROR_CODES.GONE]: m["sign_in.totp.errors.challenge_expired"],
};

export function getTwoFactorErrorMessage(error: Error): string {
  return getAuthErrorMessage(error, twoFactorErrorContext);
}
