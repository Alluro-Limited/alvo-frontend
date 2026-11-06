import {mapError} from "@/lib/api-errors";
import {fromE164} from "@/lib/phone";
import {apiClient} from "@/services/api-client";
import {clearSession, getRefreshToken} from "@/services/session";
import type {
  ApiConfirmCodeRequest,
  ApiGetBankAccountResponse,
  ApiGetCourierProfileResponse,
  ApiGetMeResponse,
  ApiGetNotificationPrefsResponse,
  ApiListBanksResponse,
  ApiNotificationPref,
  ApiSetBankAccountRequest,
  RequestOtpRequest,
} from "@/types/api-types";
import type {
  AccountService,
  BankAccount,
  NotificationPrefKey,
  NotificationPrefs,
  SupportContact,
  VehicleType,
} from "@/types/earnings-types";

const VEHICLE: Record<string, VehicleType> = {
  VEHICLE_TYPE_BICYCLE: "bicycle",
  VEHICLE_TYPE_BIKE: "motorcycle",
  VEHICLE_TYPE_CAR: "car",
  VEHICLE_TYPE_VAN: "van",
};

const PREF_KEY: Record<NotificationPrefKey, string> = {jobs: "jobs", payments: "payments", admin: "admin"};

const prefOn = (prefs: ApiNotificationPref[], key: string) => prefs.find((p) => p.key === key)?.enabled ?? true;

/** Support details have no endpoint — static contact until the API grows one. */
const SUPPORT: SupportContact = {
  team: "Alvo Courier Support",
  availability: "Mon–Sat, 8am–8pm",
  phone: "+234 700 000 0000",
  email: "couriers@alvo.africa",
};

/**
 * Account against `v1/me` (user fields), `v1/courier/profile`, `v1/courier/bank-account`,
 * `v1/courier/banks`, and `v1/courier/notification-prefs`. No endpoint exists for the
 * support contact or a vehicle-change request — the former is a constant, the latter throws.
 * Deletion rides the user endpoints: an SMS code then `v1/me/delete` (couriers have no
 * password, so `v1/me/delete/request` can't be used).
 */
export const httpAccountService: AccountService = {
  getProfile: async () => {
    const [me, profile] = await Promise.all([
      apiClient.get("v1/me").json<ApiGetMeResponse>(),
      apiClient.get("v1/courier/profile").json<ApiGetCourierProfileResponse>(),
    ]);
    return {
      name: me.user.name,
      courierId: profile.courier.id,
      email: me.user.email,
      phone: me.user.phone ? fromE164(me.user.phone) : "",
      avatarUrl: null,
      vehicle: VEHICLE[profile.courier.vehicleType] ?? "motorcycle",
    };
  },
  getSupportContact: async () => SUPPORT,
  signOut: async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) await apiClient.post("v1/auth/logout", {json: {refreshToken}}).catch(() => {});
    clearSession();
  },
  requestDeleteCode: async () => {
    const me = await apiClient.get("v1/me").json<ApiGetMeResponse>();
    const body: RequestOtpRequest = {identifier: me.user.phone, channel: "OTP_CHANNEL_SMS"};
    await apiClient.post("v1/auth/otp", {json: body});
  },
  deleteAccount: async (code) => {
    const body: ApiConfirmCodeRequest = {code};
    await apiClient.post("v1/me/delete", {json: body}).catch(mapError({400: "invalid_code"}));
    clearSession();
  },
  requestVehicleChange: async () => {
    // No API for vehicle change yet — surface the failure rather than pretend success.
    throw new Error("vehicle change requests are not supported by the API yet");
  },
  getBankAccount: async () => {
    const res = await apiClient.get("v1/courier/bank-account").json<ApiGetBankAccountResponse>();
    return {bankName: res.bankName, accountNumber: res.accountNumber, accountName: res.accountName};
  },
  getBanks: async () => {
    const res = await apiClient.get("v1/courier/banks").json<ApiListBanksResponse>();
    return res.banks.map((b) => b.name);
  },
  requestBankChange: async (account: BankAccount) => {
    const {banks} = await apiClient.get("v1/courier/banks").json<ApiListBanksResponse>();
    const code = banks.find((b) => b.name === account.bankName)?.code;
    if (!code) throw new Error(`unknown bank: ${account.bankName}`);
    const body: ApiSetBankAccountRequest = {bankCode: code, accountNumber: account.accountNumber, accountName: account.accountName};
    await apiClient.post("v1/courier/bank-account", {json: body});
  },
  getNotificationPrefs: async (): Promise<NotificationPrefs> => {
    const res = await apiClient.get("v1/courier/notification-prefs").json<ApiGetNotificationPrefsResponse>();
    return {
      jobs: prefOn(res.prefs, PREF_KEY.jobs),
      payments: prefOn(res.prefs, PREF_KEY.payments),
      admin: prefOn(res.prefs, PREF_KEY.admin),
    };
  },
  setNotificationPref: async (key, enabled) => {
    await apiClient.post("v1/courier/notification-prefs", {json: {key: PREF_KEY[key], enabled}});
  },
};
