import * as v from "valibot";
import {apiClient} from "@/services/api-client";
import type {AuthService} from "@/types/auth-types";

const SignInResponseSchema = v.object({accountStatus: v.picklist(["active", "setup_required"])});
const AccountSetupResponseSchema = v.object({invitedBy: v.string(), roleLabel: v.string()});
const ResendResetLinkResponseSchema = v.object({maskedEmail: v.string()});
const CurrentUserResponseSchema = v.object({name: v.string()});

/**
 * Auth over the real backend. Endpoint paths and bodies are placeholders until the API exists.
 * The session is set as an httpOnly cookie, so only the fields the screens need are read back.
 */
export const httpAuthService: AuthService = {
  signIn: async (credentials) => {
    const body = await apiClient.post("auth/login", {json: credentials}).json();
    return v.parse(SignInResponseSchema, body);
  },
  getAccountSetup: async () => {
    const body = await apiClient.get("auth/account-setup").json();
    return v.parse(AccountSetupResponseSchema, body);
  },
  completeAccountSetup: async (input) => {
    await apiClient.post("auth/account-setup", {json: input});
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
  getCurrentUser: async () => {
    const body = await apiClient.get("auth/me").json();
    return v.parse(CurrentUserResponseSchema, body);
  },
  signOut: async () => {
    await apiClient.post("auth/logout");
  },
};
