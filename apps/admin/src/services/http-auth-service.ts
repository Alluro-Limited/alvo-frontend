import {apiClient} from "@/services/api-client";
import {clearSession, getRefreshToken, setSession} from "@/services/session";
import {clearStepUp} from "@/services/step-up";
import type {AuthService, SignInChallenge, SignInResult} from "@/types/auth-types";

interface ApiChallenge {
  challengeId?: string;
  totpEnrollmentRequired?: boolean;
}

interface ApiTotpEnrollment {
  secret?: string;
  otpauthUri?: string;
}

interface ApiAdminSession {
  accessToken?: string;
  refreshToken?: string;
  admin?: {status?: string};
}

interface ApiInvitation {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  inviterName?: string;
  expiresAt?: string;
}

/** The invitation link's `?token=` — the service interface predates URL plumbing. */
const inviteToken = () => new URLSearchParams(window.location.search).get("token") ?? "";

const RECOVERY_EMAIL_KEY = "alvo.admin.recovery-email";

const roleLabel = (role?: string) =>
  role
    ? role
        .replace("ADMIN_ROLE_", "")
        .split("_")
        .filter(Boolean)
        .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
        .join(" ")
    : "";

/**
 * The challenge carries `totp_enrollment_required`; enrolling first fetches the
 * authenticator secret so the screen can show it before the code entry.
 */
async function toChallenge(res: ApiChallenge): Promise<SignInChallenge> {
  if (!res.challengeId) throw new Error("admin sign-in did not return a challenge");
  if (!res.totpEnrollmentRequired) return {challengeId: res.challengeId};
  const enrollment = await apiClient.post("v1/admin/auth/totp/enroll", {json: {challengeId: res.challengeId}}).json<ApiTotpEnrollment>();
  return {
    challengeId: res.challengeId,
    enrollment: {secret: enrollment.secret ?? "", otpauthUri: enrollment.otpauthUri ?? ""},
  };
}

const toResult = (session: ApiAdminSession): SignInResult => ({
  accountStatus: session.admin?.status === "ADMIN_STATUS_INVITED" ? "setup_required" : "active",
});

/**
 * Admin auth is two-factor by design: `sign-in` and `invitations/accept` return a
 * challenge, `auth/totp` verifies it (or `totp/enroll` + `totp/confirm` for a first
 * authenticator), and only then is a session issued. Step-up tokens for high-risk
 * mutations ride the `X-Step-Up` header via `services/step-up`.
 */
export const httpAuthService: AuthService = {
  signIn: async (credentials) => {
    const res = await apiClient.post("v1/admin/auth/sign-in", {json: credentials}).json<ApiChallenge>();
    return toChallenge(res);
  },
  verifySecondFactor: async (input) => {
    const res = await apiClient
      .post(input.enrolling ? "v1/admin/auth/totp/confirm" : "v1/admin/auth/totp", {
        json: {challengeId: input.challengeId, code: input.code},
      })
      // `totp` returns the session directly; `totp/confirm` wraps it in `{session}`.
      .json<ApiAdminSession & {session?: ApiAdminSession}>();
    const session = res.session ?? res;
    if (!session.accessToken || !session.refreshToken) throw new Error("second-factor check did not return a session");
    setSession({accessToken: session.accessToken, refreshToken: session.refreshToken});
    return toResult(session);
  },
  getAccountSetup: async () => {
    const res = await apiClient.post("v1/admin/invitations/lookup", {json: {token: inviteToken()}}).json<ApiInvitation>();
    return {invitedBy: res.inviterName ?? "", roleLabel: roleLabel(res.role)};
  },
  completeAccountSetup: async (input) => {
    const res = await apiClient
      .post("v1/admin/invitations/accept", {
        json: {token: inviteToken(), firstName: input.firstName, lastName: input.lastName, password: input.password},
      })
      .json<ApiChallenge>();
    return toChallenge(res);
  },
  requestPasswordReset: async (email) => {
    await apiClient.post("v1/admin/auth/recovery", {json: {email}});
    // Resend on the expired-link view reuses this address — the API has no resend-by-token.
    sessionStorage.setItem(RECOVERY_EMAIL_KEY, email);
  },
  resetPassword: async ({token, password}) => {
    await apiClient.post("v1/admin/auth/recovery/complete", {json: {token, newPassword: password}});
  },
  resendResetLink: async () => {
    const email = sessionStorage.getItem(RECOVERY_EMAIL_KEY) ?? "";
    if (!email) throw new Error("no recovery email on file — request a fresh link from forgot-password");
    await apiClient.post("v1/admin/auth/recovery", {json: {email}});
    return {maskedEmail: email};
  },
  getCurrentUser: async () => {
    const res = await apiClient.get("v1/admin/me").json<{name?: string}>();
    return {name: res.name ?? ""};
  },
  signOut: async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) await apiClient.post("v1/admin/auth/logout", {json: {refreshToken}}).catch(() => {});
    clearStepUp();
    clearSession();
    sessionStorage.removeItem(RECOVERY_EMAIL_KEY);
  },
};
