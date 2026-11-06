import {mapError} from "@/lib/api-errors";
import {formatDate, sectionLabel} from "@/lib/datetime";
import {koboToNaira} from "@/lib/money";
import {fromE164, toE164} from "@/lib/phone";
import {apiClient} from "@/services/api-client";
import {clearSession} from "@/services/session";
import type {
  ApiConfirmCodeRequest,
  ApiDeleteAccountRequest,
  ApiDeleteRequestBody,
  ApiGetMeResponse,
  ApiGetWalletResponse,
  ApiListNodesResponse,
  ApiListTransactionsResponse,
  ApiPhoneChangeRequest,
  ApiTransaction,
  ApiUpdateProfileRequest,
  ApiVirtualAccount,
  ApiWallet,
} from "@/types/api-types";
import type {AccountService, SavedAddress, VirtualAccount, WalletDetails, WalletTransaction} from "@/types/account-types";

const TXN_TITLE: Record<string, string> = {
  TRANSACTION_KIND_TOP_UP: "Wallet Top-up",
  TRANSACTION_KIND_PAYMENT: "Delivery",
  TRANSACTION_KIND_UPGRADE: "Locker Upgrade",
  TRANSACTION_KIND_REFUND: "Refund",
  TRANSACTION_KIND_FEE: "Extension Fee",
  TRANSACTION_KIND_REVERSAL: "Reversal",
  TRANSACTION_KIND_ADJUSTMENT: "Adjustment",
};

const TXN_KIND: Record<string, WalletTransaction["kind"]> = {
  TRANSACTION_KIND_PAYMENT: "delivery",
  TRANSACTION_KIND_UPGRADE: "delivery",
  TRANSACTION_KIND_REFUND: "delivery",
  TRANSACTION_KIND_FEE: "delivery",
};

const toTransaction = (txn: ApiTransaction): WalletTransaction => {
  const title = TXN_TITLE[txn.kind] ?? "Wallet";
  return {
    id: txn.id,
    title: txn.trackingNo ? `${title} #${txn.trackingNo}` : title,
    kind: TXN_KIND[txn.kind] ?? "topup",
    date: formatDate(txn.createdAt),
    section: sectionLabel(txn.createdAt),
    amount: koboToNaira(txn.amountKobo),
    status: "successful",
  };
};

const toVirtualAccount = (account?: ApiVirtualAccount): VirtualAccount | null =>
  account ? {number: account.accountNumber, bankName: account.bankName, accountName: account.accountName} : null;

const walletBalance = (wallet: ApiWallet) => koboToNaira(wallet.balanceKobo);

/**
 * Account against `v1/me/**` and `v1/wallet/**`. Saved Addresses map to favorite nodes
 * (the generic `me/addresses` shape has no node link), the wallet's "linked bank" has no
 * user-side field, and the API stores a single `name` — the app splits it on first space.
 */
export const httpAccountService: AccountService = {
  getAccount: async () => {
    const [me, walletRes] = await Promise.all([
      apiClient.get("v1/me").json<ApiGetMeResponse>(),
      apiClient.get("v1/wallet").json<ApiGetWalletResponse>(),
    ]);
    const {user} = me;
    const [firstName = "", ...rest] = (user.name ?? "").split(" ");
    return {
      profile: {
        firstName,
        lastName: rest.join(" "),
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        phone: user.phoneVerified && user.phone ? fromE164(user.phone) : null,
      },
      wallet: {balance: walletBalance(walletRes.wallet), bank: null},
    };
  },
  updateName: async (firstName, lastName) => {
    const body: ApiUpdateProfileRequest = {name: `${firstName} ${lastName}`.trim()};
    await apiClient.post("v1/me", {json: body});
  },
  sendPhoneVerification: async (phone) => {
    const body: ApiPhoneChangeRequest = {phone: toE164(phone)};
    await apiClient.post("v1/me/phone", {json: body}).catch(mapError({400: "invalid_phone", 409: "phone_in_use"}));
  },
  verifyPhone: async (code) => {
    const body: ApiConfirmCodeRequest = {code};
    await apiClient.post("v1/me/phone/confirm", {json: body}).catch(mapError({400: "invalid_code"}));
  },
  getAddresses: async () => {
    const res = await apiClient.get("v1/me/favorite-nodes").json<ApiListNodesResponse>();
    return res.nodes.map((node): SavedAddress => ({id: node.id, name: node.name, address: node.accessNotes}));
  },
  addAddress: async (node) => {
    await apiClient.put(`v1/me/favorite-nodes/${node.id}`);
  },
  removeAddress: async (id) => {
    await apiClient.delete(`v1/me/favorite-nodes/${id}`);
  },
  requestAccountDeletion: async (password) => {
    const body: ApiDeleteRequestBody = {password};
    await apiClient.post("v1/me/delete/request", {json: body}).catch(mapError({400: "invalid_password", 401: "invalid_password"}));
  },
  resendDeletionCode: async (password) => {
    const body: ApiDeleteRequestBody = {password};
    await apiClient.post("v1/me/delete/request", {json: body}).catch(mapError({400: "invalid_password", 401: "invalid_password"}));
  },
  confirmAccountDeletion: async (code) => {
    const body: ApiDeleteAccountRequest = {code};
    await apiClient.post("v1/me/delete", {json: body}).catch(mapError({400: "invalid_code"}));
    clearSession();
  },
  getWallet: async () => {
    const [walletRes, txns] = await Promise.all([
      apiClient.get("v1/wallet").json<ApiGetWalletResponse>(),
      apiClient.get("v1/wallet/transactions", {searchParams: {limit: 50}}).json<ApiListTransactionsResponse>(),
    ]);
    const details: WalletDetails = {
      balance: walletBalance(walletRes.wallet),
      virtualAccount: toVirtualAccount(walletRes.virtualAccount),
      transactions: txns.transactions.map(toTransaction),
    };
    return details;
  },
  generateVirtualAccount: async () => {
    const res = await apiClient.post("v1/wallet/virtual-account").json<ApiVirtualAccount>();
    const account = toVirtualAccount(res);
    if (!account) throw new Error("no virtual account returned");
    return account;
  },
  startCheckout: async (amountKobo) => {
    const res = await apiClient
      .post("v1/wallet/checkout", {json: {amountKobo}})
      .json<{authorizationUrl?: string; checkoutUrl?: string; reference?: string}>();
    return {authorizationUrl: res.authorizationUrl ?? res.checkoutUrl ?? "", reference: res.reference ?? ""};
  },
  redeemCode: async (code, nodeId) => {
    const res = await apiClient
      .post("v1/codes/redeem", {json: {code, nodeId: nodeId ?? "", purpose: "CODE_PURPOSE_DROPOFF"}})
      .json<{trackingNo?: string}>();
    return {trackingNo: res.trackingNo ?? ""};
  },
  getUserAddresses: async () => {
    const res = await apiClient.get("v1/me/addresses").json<{addresses: {id: string; label: string; address: string}[]}>();
    return res.addresses.map((a) => ({id: a.id, name: a.label, address: a.address}));
  },
  saveUserAddress: async (address) => {
    await apiClient.post("v1/me/addresses", {json: {label: address.name, address: address.address}});
  },
  deleteUserAddress: async (id) => {
    await apiClient.delete(`v1/me/addresses/${id}`);
  },
};
