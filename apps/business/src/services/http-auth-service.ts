import {apiClient} from "@/services/api-client";
import type {AuthService} from "@/types/auth-types";

/**
 * Auth over the real backend. Endpoint paths and bodies are placeholders until the API exists.
 * The session is set as an httpOnly cookie, so nothing is read back from the response.
 */
export const httpAuthService: AuthService = {
  signIn: async (credentials) => {
    await apiClient.post("auth/login", {json: credentials});
  },
  signUp: async (input) => {
    await apiClient.post("auth/sign-up", {json: input});
  },
  verifyEmail: async (code) => {
    await apiClient.post("auth/verify-email", {json: {code}});
  },
  resendVerificationCode: async () => {
    await apiClient.post("auth/verify-email/resend");
  },
  signOut: async () => {
    await apiClient.post("auth/logout");
  },
};
