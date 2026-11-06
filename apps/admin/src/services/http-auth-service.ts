import {apiClient} from "@/services/api-client";
import {clearSession, getRefreshToken, setSession} from "@/services/session";
import type {AuthService} from "@/types/auth-types";

interface AdminAuthResponse {
  admin?: {id: string; name: string; status?: string; totpEnabled?: boolean};
  accessToken?: string;
  refreshToken: string;
  /** Present instead of tokens when the admin still needs its TOTP second factor. */
  totpRequired?: boolean;
}

/** The invitation link's `?token=` — the service interface predates URL plumbing. */
const inviteToken = () => new URLSearchParams(window.location.search).get("token") ?? "";

/**
 * Admin auth: `v1/admin/auth/sign-in` (+ refresh/logout), `invitations/lookup|accept`
 * for setup, and `auth/recovery|recovery/complete` for reset. TOTP second-factor and
 * step-up tokens have no UI yet — a `totpRequired` response surfaces as a failure.
 */
export const httpAuthService: AuthService = {
  signIn: async (credentials) => {
    const res = await apiClient.post("v1/admin/auth/sign-in", {json: credentials}).json<AdminAuthResponse>();
    if (res.totpRequired || !res.accessToken) {
      throw new Error("admin sign-in requires TOTP, which is not supported by this app yet");
    }
    setSession({accessToken: res.accessToken, refreshToken: res.refreshToken});
    return {accountStatus: res.admin?.status === "INVITED" ? "setup_required" : "active"};
  },
  getAccountSetup: async () => {
    const res = await apiClient
      .post("v1/admin/invitations/lookup", {json: {token: inviteToken()}})
      .json<{invitedBy?: string; roleLabel?: string}>();
    return {invitedBy: res.invitedBy ?? "", roleLabel: res.roleLabel ?? ""};
  },
  completeAccountSetup: async (input) => {
    await apiClient.post("v1/admin/invitations/accept", {
      json: {token: inviteToken(), firstName: input.firstName, lastName: input.lastName, password: input.password},
    });
  },
  requestPasswordReset: async (email) => {
    await apiClient.post("v1/admin/auth/recovery", {json: {email}});
  },
  resetPassword: async ({token, password}) => {
    await apiClient.post("v1/admin/auth/recovery/complete", {json: {token, password}});
  },
  resendResetLink: async (token) => {
    const res = await apiClient.post("v1/admin/auth/recovery", {json: {token}}).json<{maskedEmail?: string}>();
    return {maskedEmail: res.maskedEmail ?? ""};
  },
  getCurrentUser: async () => {
    const res = await apiClient.get("v1/admin/me").json<{admin?: {name?: string}}>();
    return {name: res.admin?.name ?? ""};
  },
  signOut: async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) await apiClient.post("v1/admin/auth/logout", {json: {refreshToken}}).catch(() => {});
    clearSession();
  },
};
