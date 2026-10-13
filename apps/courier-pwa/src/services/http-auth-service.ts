import {apiClient} from "@/services/api-client";
import type {CourierAuthService} from "@/types/auth-types";

/**
 * Courier auth over the real backend. Endpoint paths and bodies are placeholders until the
 * API exists. The session is set as an httpOnly cookie, so nothing is read back from responses.
 */
export const httpAuthService: CourierAuthService = {
  requestLoginOtp: async (phone) => {
    await apiClient.post("courier/auth/request-otp", {json: {phone}});
  },
  resendLoginOtp: async (phone) => {
    await apiClient.post("courier/auth/resend-otp", {json: {phone}});
  },
  verifyLoginOtp: async (phone, code) => {
    await apiClient.post("courier/auth/verify-otp", {json: {phone, code}});
  },
};
