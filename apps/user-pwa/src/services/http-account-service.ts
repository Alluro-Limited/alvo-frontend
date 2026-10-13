import {apiClient} from "@/services/api-client";
import type {AccountData, AccountService, SavedAddress, VirtualAccount, WalletDetails} from "@/types/account-types";

/** Account endpoints against the real backend; shapes are placeholders until the API exists. */
export const httpAccountService: AccountService = {
  getAccount: async () => {
    return apiClient.get("users/account").json<AccountData>();
  },
  updateName: async (firstName, lastName) => {
    await apiClient.post("users/account/name", {json: {firstName, lastName}});
  },
  sendPhoneVerification: async (phone) => {
    await apiClient.post("users/account/phone/verify/send", {json: {phone}});
  },
  verifyPhone: async (code) => {
    await apiClient.post("users/account/phone/verify", {json: {code}});
  },
  getAddresses: async () => {
    return apiClient.get("users/account/addresses").json<SavedAddress[]>();
  },
  addAddress: async (node) => {
    await apiClient.post("users/account/addresses", {json: {nodeId: node.id}});
  },
  removeAddress: async (id) => {
    await apiClient.delete(`users/account/addresses/${id}`);
  },
  requestAccountDeletion: async (password) => {
    await apiClient.post("users/account/delete/request", {json: {password}});
  },
  resendDeletionCode: async () => {
    await apiClient.post("users/account/delete/resend");
  },
  confirmAccountDeletion: async (code) => {
    await apiClient.post("users/account/delete", {json: {code}});
  },
  getWallet: async () => {
    return apiClient.get("users/account/wallet").json<WalletDetails>();
  },
  generateVirtualAccount: async () => {
    return apiClient.post("users/account/wallet/virtual-account").json<VirtualAccount>();
  },
};
