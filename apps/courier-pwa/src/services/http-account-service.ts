import {apiClient} from "@/services/api-client";
import type {AccountService, BankAccount, CourierProfile, NotificationPrefs, SupportContact, VehicleType} from "@/types/earnings-types";

/** Profile + support contact over the real backend. Endpoint paths are placeholders until the API exists. */
export const httpAccountService: AccountService = {
  getProfile: () => apiClient.get("courier/profile").json<CourierProfile>(),
  getSupportContact: () => apiClient.get("courier/support-contact").json<SupportContact>(),
  signOut: async () => {
    await apiClient.post("courier/auth/logout");
  },
  requestDeleteCode: async () => {
    await apiClient.post("courier/account/delete-code");
  },
  deleteAccount: async (code) => {
    await apiClient.post("courier/account/delete", {json: {code}});
  },
  requestVehicleChange: async (vehicle: VehicleType) => {
    await apiClient.post("courier/vehicle/change-request", {json: {vehicle}});
  },
  getBankAccount: () => apiClient.get("courier/bank-account").json<BankAccount>(),
  getBanks: () => apiClient.get("courier/banks").json<string[]>(),
  requestBankChange: async (account: BankAccount) => {
    await apiClient.post("courier/bank-account/change-request", {json: account});
  },
  getNotificationPrefs: () => apiClient.get("courier/notification-preferences").json<NotificationPrefs>(),
  setNotificationPref: async (key, enabled) => {
    await apiClient.patch("courier/notification-preferences", {json: {key, enabled}});
  },
};
