import {HTTPError} from "ky";
import {mapError} from "@/lib/api-errors";
import {toE164} from "@/lib/phone";
import {apiClient} from "@/services/api-client";
import {clearSession, setSession} from "@/services/session";
import type {ApiGetCourierProfileResponse, RequestOtpRequest, SignInResponse, VerifyOtpRequest} from "@/types/api-types";
import type {CourierAuthService} from "@/types/auth-types";

/** Courier sign-in rides the shared user auth (`v1/auth/**`) — SMS OTP → verify → Bearer tokens. */
export const httpAuthService: CourierAuthService = {
  requestLoginOtp: async (phone) => {
    const body: RequestOtpRequest = {identifier: toE164(phone), channel: "OTP_CHANNEL_SMS"};
    await apiClient.post("v1/auth/otp", {json: body});
  },
  resendLoginOtp: async (phone) => {
    const body: RequestOtpRequest = {identifier: toE164(phone), channel: "OTP_CHANNEL_SMS"};
    await apiClient.post("v1/auth/otp", {json: body});
  },
  verifyLoginOtp: async (phone, code) => {
    const body: VerifyOtpRequest = {identifier: toE164(phone), code};
    const res = await apiClient
      .post("v1/auth/verify", {json: body})
      .json<SignInResponse>()
      .catch(mapError({400: "invalid_code", 429: "too_many_attempts"}));
    setSession(res);
    // OTP sign-in succeeds for any user — confirm this one is actually a courier.
    try {
      await apiClient.get("v1/courier/profile").json<ApiGetCourierProfileResponse>();
    } catch (err) {
      if (err instanceof HTTPError && err.response.status === 404) {
        clearSession();
        err.data = {code: "not_courier"};
      }
      throw err;
    }
  },
};
