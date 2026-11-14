import {apiClient} from "@/services/api-client";
import {fetchPage} from "@/services/paged";
import {getStepUpToken} from "@/services/step-up";
import type {Page} from "@/types/workloads-types";
import type {UserDetail, UserParcel, UserRow, UserStatus, UsersService, UserVerification} from "@/types/users-types";

interface ApiUserSummary {
  id?: string;
  code?: string;
  name?: string;
  maskedEmail?: string;
  maskedPhone?: string;
  status?: string;
  verification?: string;
  createdAt?: string;
  flagged?: boolean;
}

interface ApiUserDetail {
  id?: string;
  code?: string;
  name?: string;
  preferredName?: string;
  email?: string;
  phone?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  status?: string;
  verification?: string;
  createdAt?: string;
  walletBalanceKobo?: string;
  parcels?: {sent?: string; delivered?: string; live?: string; spentKobo?: string};
}

interface ApiUserParcel {
  id?: string;
  trackingNo?: string;
  state?: string;
  sizeClass?: string;
  speedTier?: string;
  priceKobo?: string;
  originNodeId?: string;
  destNodeId?: string;
  createdAt?: string;
}

const STATUS: Record<string, UserStatus> = {
  USER_ACCOUNT_STATUS_ACTIVE: "active",
  USER_ACCOUNT_STATUS_PENDING: "active",
  USER_ACCOUNT_STATUS_SUSPENDED: "suspended",
  USER_ACCOUNT_STATUS_DELETED: "suspended",
};
const API_STATUS: Record<string, string> = {
  active: "USER_ACCOUNT_STATUS_ACTIVE",
  suspended: "USER_ACCOUNT_STATUS_SUSPENDED",
};
const VERIFICATION: Record<string, UserVerification> = {
  USER_VERIFICATION_VERIFIED: "verified",
  USER_VERIFICATION_PARTIAL: "partial",
  USER_VERIFICATION_UNVERIFIED: "unverified",
};
const API_VERIFICATION: Record<string, string> = {
  verified: "USER_VERIFICATION_VERIFIED",
  partial: "USER_VERIFICATION_PARTIAL",
  unverified: "USER_VERIFICATION_UNVERIFIED",
};

const rowStatus = (u: ApiUserSummary): UserStatus => (u.flagged ? "flagged" : (STATUS[u.status ?? ""] ?? "active"));

const toRow = (u: ApiUserSummary): UserRow => ({
  id: u.id ?? "",
  name: u.name ?? "",
  email: u.maskedEmail ?? "",
  phone: u.maskedPhone ?? "",
  verification: VERIFICATION[u.verification ?? ""] ?? "unverified",
  joinedAt: u.createdAt ?? "",
  status: rowStatus(u),
});

const PARCEL_STATUS: Record<string, UserParcel["status"]> = {
  PARCEL_STATE_CREATED: "pending_pickup",
  PARCEL_STATE_PAID: "pending_pickup",
  PARCEL_STATE_CODE_ISSUED: "pending_pickup",
  PARCEL_STATE_AT_ORIGIN: "pending_pickup",
  PARCEL_STATE_IN_TRANSIT: "in_transit",
  PARCEL_STATE_AT_DEST: "delivered",
  PARCEL_STATE_COLLECTED: "delivered",
  PARCEL_STATE_EXPIRED: "expired",
  PARCEL_STATE_CANCELLED: "failed",
  PARCEL_STATE_RETURNED: "failed",
};

const toParcel = (p: ApiUserParcel): UserParcel => ({
  id: p.trackingNo || p.id || "",
  recipient: "",
  destination: p.destNodeId ?? "",
  courier: "",
  status: PARCEL_STATUS[p.state ?? ""] ?? "pending_pickup",
  sla: "",
});

const str = (v?: string) => v ?? "";
const num = (v?: string) => Number(v ?? 0);

const toDetail = (u: ApiUserDetail): UserDetail => ({
  id: str(u.id),
  name: str(u.name),
  email: str(u.email),
  phone: str(u.phone),
  verification: VERIFICATION[str(u.verification)] ?? "unverified",
  joinedAt: str(u.createdAt),
  status: STATUS[str(u.status)] ?? "active",
  flag: null,
  suspension: null,
  walletBalanceKobo: num(u.walletBalanceKobo),
  totalSpentKobo: num(u.parcels?.spentKobo),
  parcelsSent: num(u.parcels?.sent),
  parcelsDelivered: num(u.parcels?.delivered),
  recentActivity: [],
});

/**
 * Users against `v1/admin/users/**`. Emails/phones come back masked by the backend;
 * filter options and suspend-reason catalogs aren't server-supplied, so they return
 * static lists; `flagUsers` rides `v1/admin/flags`; no export endpoint exists.
 */
export const httpUsersService: UsersService = {
  getUsers: async (params) => {
    const filters: Record<string, string> = {page_size: "50"};
    if (params.query) filters.q = params.query;
    if (params.status && API_STATUS[params.status]) filters.status = API_STATUS[params.status];
    if (params.verification && API_VERIFICATION[params.verification]) filters.verification = API_VERIFICATION[params.verification];
    const key = JSON.stringify(filters);
    const res = await fetchPage<ApiUserSummary>(`users:${key}`, params.page, (pageToken) =>
      apiClient
        .get("v1/admin/users", {searchParams: {...filters, ...(pageToken ? {page_token: pageToken} : {})}})
        .json<{users: ApiUserSummary[]; nextPageToken?: string; total?: string}>()
        .then((r) => ({items: r.users ?? [], nextPageToken: r.nextPageToken, total: Number(r.total ?? 0)}))
    );
    const flaggedOnly = params.status === "flagged";
    const items = res.items.map(toRow).filter((u) => !flaggedOnly || u.status === "flagged");
    return {
      metrics: {
        total: res.total,
        verified: items.filter((u) => u.verification === "verified").length,
        suspended: items.filter((u) => u.status === "suspended").length,
        flagged: items.filter((u) => u.status === "flagged").length,
        newToday: 0,
      },
      users: {items, page: params.page, pageSize: 50, total: res.total},
      filters: {statuses: ["active", "flagged", "suspended"], verifications: ["verified", "partial", "unverified"]},
      suspendReasons: ["suspicious_activity", "payment_fraud", "policy_violations", "abusive_behavior", "duplicate_account", "other"],
    };
  },
  getUserDetail: async (id) => {
    const res = await apiClient.get(`v1/admin/users/${id}`).json<ApiUserDetail>();
    return toDetail(res);
  },
  getUserParcels: async (id, params): Promise<Page<UserParcel>> => {
    const res = await fetchPage<ApiUserParcel>(`user-parcels:${id}`, params.page, (pageToken) =>
      apiClient
        .get(`v1/admin/users/${id}/parcels`, {searchParams: {page_size: 20, ...(pageToken ? {page_token: pageToken} : {})}})
        .json<{parcels: ApiUserParcel[]; nextPageToken?: string}>()
        .then((r) => ({items: r.parcels ?? [], nextPageToken: r.nextPageToken, total: 0}))
    );
    const items = res.items.map(toParcel);
    return {items, page: params.page, pageSize: 20, total: items.length};
  },
  suspendUser: async (id, input) => {
    await apiClient.post(`v1/admin/users/${id}/suspend`, {json: {reasonCode: input.reason, notes: input.notes ?? ""}});
    return {id, status: "suspended"};
  },
  unsuspendUser: async (id) => {
    await apiClient.post(`v1/admin/users/${id}/reactivate`, {json: {}});
    return {id, status: "active"};
  },
  flagUsers: async (input) => {
    await Promise.all(
      input.ids.map((id) =>
        apiClient.post("v1/admin/flags", {
          json: {targetType: "FLAG_TARGET_TYPE_USER", targetId: id, reasonCode: input.reason, notes: input.notes ?? ""},
        })
      )
    );
    return {ids: input.ids, status: "flagged"};
  },
  deleteUser: async (id) => {
    await apiClient.post(`v1/admin/users/${id}/delete`, {json: {}, headers: {"X-Step-Up": await getStepUpToken()}});
    return {id};
  },
  exportUsers: async () => {
    throw new Error("user export is not supported by the API yet");
  },
};
