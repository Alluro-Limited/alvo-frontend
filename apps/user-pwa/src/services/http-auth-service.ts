import {mapError} from "@/lib/api-errors";
import {toE164} from "@/lib/phone";
import {apiClient} from "@/services/api-client";
import {clearSession, getRefreshToken, setSession} from "@/services/session";
import type {
  ConfirmResetRequest,
  OtpChannel,
  RegisterUserRequest,
  RequestOtpRequest,
  ResendSecondsResponse,
  SetPasswordRequest,
  SignInResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "@/types/api-types";
import {TERMS_VERSION, type SignInResult, type UserAuthService, type VerificationMethod} from "@/types/auth-types";

const OTP_CHANNEL: Record<VerificationMethod, OtpChannel> = {
  email: "OTP_CHANNEL_EMAIL",
  sms: "OTP_CHANNEL_SMS",
  whatsapp: "OTP_CHANNEL_WHATSAPP",
};

/** The OTP identifier is the destination the code went to — E.164 for phone channels. */
const otpIdentifier = (identifier: string, method: VerificationMethod) => (method === "email" ? identifier : toE164(identifier));

/**
 * User auth against the real API (`/v1/auth/**`). Sign-in and verify return Bearer
 * tokens, which land in the session store that `apiClient` reads on every call.
 */
export const httpAuthService: UserAuthService = {
  createAccount: async (details) => {
    const body: RegisterUserRequest = {
      fullName: details.fullName,
      email: details.email,
      phone: toE164(details.phone),
    };
    if (details.preferredName) body.preferredName = details.preferredName;
    if (details.referralCode) body.referralCode = details.referralCode;
    await apiClient.post("v1/auth/register", {json: body});
  },
  requestVerificationCode: async (identifier, method) => {
    const body: RequestOtpRequest = {identifier: otpIdentifier(identifier, method), channel: OTP_CHANNEL[method]};
    const res = await apiClient.post("v1/auth/otp", {json: body}).json<ResendSecondsResponse>();
    return res.resendAfterSeconds;
  },
  verifyCode: async (identifier, method, code) => {
    const body: VerifyOtpRequest = {identifier: otpIdentifier(identifier, method), code};
    const res = await apiClient
      .post("v1/auth/verify", {json: body})
      .json<VerifyOtpResponse>()
      .catch(mapError({400: "invalid_code"}));
    setSession(res);
  },
  completeRegistration: async (password) => {
    const body: SetPasswordRequest = {newPassword: password, termsVersion: TERMS_VERSION};
    await apiClient.post("v1/users/password", {json: body});
  },
  signIn: async (email, password) => {
    const res = await apiClient.post("v1/auth/sign-in", {json: {email, password}}).json<SignInResponse>();
    setSession(res);
    const result: SignInResult = {name: res.user.preferredName || res.user.name};
    return result;
  },
  requestPasswordReset: async (email) => {
    const res = await apiClient.post("v1/auth/reset-password", {json: {email}}).json<ResendSecondsResponse>();
    return res.resendAfterSeconds;
  },
  confirmPasswordReset: async (email, code, newPassword) => {
    const body: ConfirmResetRequest = {email, code, newPassword};
    await apiClient.post("v1/auth/reset-password/confirm", {json: body}).catch(mapError({400: "invalid_code"}));
  },
  signOut: async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) await apiClient.post("v1/auth/logout", {json: {refreshToken}});
    } finally {
      clearSession();
    }
  },
};
