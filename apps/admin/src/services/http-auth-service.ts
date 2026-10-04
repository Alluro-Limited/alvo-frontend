import * as v from "valibot";
import {apiClient} from "@/services/api-client";
import type {AuthService} from "@/types/auth-types";

const ResendResetLinkResponseSchema = v.object({maskedEmail: v.string()});

/**
 * Auth over the real backend. Endpoint paths and bodies are placeholders until the API exists.
 * The session is set as an httpOnly cookie, so successful calls have no body to keep.
 */
export const httpAuthService: AuthService = {
  signIn: async (credentials) => {
    await apiClient.post("auth/login", {json: credentials});
  },
  requestPasswordReset: async (email) => {
    await apiClient.post("auth/forgot-password", {json: {email}});
  },
  resetPassword: async (input) => {
    await apiClient.post("auth/reset-password", {json: input});
  },
  resendResetLink: async (token) => {
    const body = await apiClient.post("auth/reset-password/resend", {json: {token}}).json();
    return v.parse(ResendResetLinkResponseSchema, body);
  },
};
