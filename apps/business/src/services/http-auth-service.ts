import {apiClient} from "@/services/api-client";
import {clearSession, getRefreshToken, setSession, type OwnerProfile} from "@/services/session";
import type {
  ApiRegisterSmeRequest,
  ApiRequestOtpRequest,
  ApiSignInSmeRequest,
  ApiSmeAuthResponse,
  ApiVerifyOtpRequest,
  AuthTokensResponse,
} from "@/types/api-types";
import type {AuthService} from "@/types/auth-types";

/** `verifyEmail`/`resendVerificationCode` take no identifier — the sign-up email rides along here. */
const PENDING_KEY = "alvo.business.pending-email";

/** The register payload has no owner fields; keep them locally until `verify` opens the session. */
const PENDING_OWNER_KEY = "alvo.business.pending-owner";

const pendingEmail = () => localStorage.getItem(PENDING_KEY) ?? "";

const pendingOwner = (): OwnerProfile | undefined => {
  try {
    const raw = localStorage.getItem(PENDING_OWNER_KEY);
    return raw ? (JSON.parse(raw) as OwnerProfile) : undefined;
  } catch {
    return undefined;
  }
};

/**
 * SME auth: `v1/sme/register` sends the emailed code, `v1/auth/verify` confirms it and
 * starts the session; sign-in takes `workEmail` + `password`. The wire register call
 * carries only businessName/workEmail/password — business type, phones, and the owner's
 * name have no fields yet.
 */
export const httpAuthService: AuthService = {
  signIn: async ({email, password}) => {
    const body: ApiSignInSmeRequest = {workEmail: email, password};
    const res = await apiClient.post("v1/sme/sign-in", {json: body}).json<ApiSmeAuthResponse>();
    setSession({accessToken: res.accessToken, refreshToken: res.refreshToken, sme: res.sme});
  },
  signUp: async (input) => {
    const body: ApiRegisterSmeRequest = {businessName: input.businessName, workEmail: input.email, password: input.password};
    await apiClient.post("v1/sme/register", {json: body});
    localStorage.setItem(PENDING_KEY, input.email);
    localStorage.setItem(PENDING_OWNER_KEY, JSON.stringify({firstName: input.firstName, lastName: input.lastName, phone: input.phone}));
  },
  verifyEmail: async (code) => {
    const body: ApiVerifyOtpRequest = {identifier: pendingEmail(), code};
    const res = await apiClient.post("v1/auth/verify", {json: body}).json<AuthTokensResponse>();
    setSession({...res, owner: pendingOwner()});
  },
  resendVerificationCode: async () => {
    const body: ApiRequestOtpRequest = {identifier: pendingEmail(), channel: "OTP_CHANNEL_EMAIL"};
    await apiClient.post("v1/auth/otp", {json: body});
  },
  signOut: async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) await apiClient.post("v1/auth/logout", {json: {refreshToken}}).catch(() => {});
    clearSession();
    localStorage.removeItem(PENDING_KEY);
    localStorage.removeItem(PENDING_OWNER_KEY);
  },
};
