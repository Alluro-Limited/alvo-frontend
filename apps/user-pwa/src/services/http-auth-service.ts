import {apiClient} from "@/services/api-client";
import type {SignInResult, UserAuthService} from "@/types/auth-types";

/**
 * User auth over the real backend. Endpoint paths and bodies are placeholders until the
 * API exists. The session is set as an httpOnly cookie, so nothing is read back from responses.
 */
export const httpAuthService: UserAuthService = {
  createAccount: async (details) => {
    await apiClient.post("users/auth/sign-up", {json: details});
  },
  requestVerificationCode: async (method) => {
    await apiClient.post("users/auth/request-code", {json: {method}});
  },
  verifyCode: async (code) => {
    await apiClient.post("users/auth/verify-code", {json: {code}});
  },
  completeRegistration: async (password) => {
    await apiClient.post("users/auth/complete-registration", {json: {password}});
  },
  signIn: async (email, password) => {
    return apiClient.post("users/auth/sign-in", {json: {email, password}}).json<SignInResult>();
  },
  requestPasswordReset: async (email) => {
    await apiClient.post("users/auth/request-reset", {json: {email}});
  },
  verifyResetCode: async (code) => {
    await apiClient.post("users/auth/verify-reset-code", {json: {code}});
  },
  resetPassword: async (password) => {
    await apiClient.post("users/auth/reset-password", {json: {password}});
  },
};
