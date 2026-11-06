/**
 * Wire DTOs for the Alvo API (`/v1/**`). The gateway speaks proto3 JSON: fields are
 * lowerCamelCase in and out, int64 money arrives as decimal strings, and errors are
 * `google.rpc.Status` — `{code, message, details}` where `code` is the gRPC status.
 */
import type {ApiUser} from "./api-v1-types";

export interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SignInResponse extends AuthTokensResponse {
  user: ApiUser;
}

export type VerifyOtpResponse = SignInResponse;

export interface RegisterUserRequest {
  fullName: string;
  preferredName?: string;
  email: string;
  phone: string;
  referralCode?: string;
}

export type OtpChannel = "OTP_CHANNEL_EMAIL" | "OTP_CHANNEL_SMS" | "OTP_CHANNEL_WHATSAPP";

export interface RequestOtpRequest {
  /** Email or E.164 phone, resolved against the user row. */
  identifier: string;
  channel: OtpChannel;
}

export interface ResendSecondsResponse {
  resendAfterSeconds: number;
}

export interface VerifyOtpRequest {
  identifier: string;
  code: string;
}

export interface SetPasswordRequest {
  newPassword: string;
  /** Version of the terms the user accepted — required when setting the first password. */
  termsVersion?: string;
  /** Required once a password exists (change-password path, not sign-up). */
  currentPassword?: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ConfirmResetRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LogoutRequest {
  refreshToken: string;
}

export * from "./api-v1-types";
