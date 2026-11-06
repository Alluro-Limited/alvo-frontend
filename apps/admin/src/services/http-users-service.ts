import {apiClient} from "@/services/api-client";
import type {Page} from "@/types/workloads-types";
import type {UserDetail, UserParcel, UserRow, UserStatus, UsersService, UserVerification} from "@/types/users-types";

interface ApiUserSummary {
  id: string;
  code: string;
  name: string;
  maskedEmail: string;
  maskedPhone: string;
  status: string;
  verification: string;
  createdAt: string;
  flagged: boolean;
}

interface ApiUserDetail {
  id: string;
  name: string;
  preferredName?: string;
  email: string;
  phone: string;
  status: string;
  verification: string;
  createdAt: string;
  walletBalanceKobo?: string;
  parcels?: {sent: string; delivered: string; live: string; spentKobo: string};
  flagged?: boolean;
}

interface ApiUserParcel {
  id: string;
  trackingNo: string;
  recipientName?: string;
  destination?: {id: string; code: string; name?: string};
  state: string;
  slaDueAt?: string;
}

interface ApiListUsersResponse {
  users: ApiUserSummary[];
  nextPageToken: string;
  total: string;
}

const STATUS: Record<string, UserStatus> = {USER_ACCOUNT_STATUS_ACTIVE: "active", USER_ACCOUNT_STATUS_SUSPENDED: "suspended"};
const VERIFICATION: Record<string, UserVerification> = {
  USER_VERIFICATION_VERIFIED: "verified",
  USER_VERIFICATION_PARTIAL: "partial",
  USER_VERIFICATION_UNVERIFIED: "unverified",
};

const rowStatus = (u: ApiUserSummary): UserStatus => (u.flagged ? "flagged" : (STATUS[u.status] ?? "active"));

const toRow = (u: ApiUserSummary): UserRow => ({
  id: u.id,
  name: u.name,
  email: u.maskedEmail,
  phone: u.maskedPhone,
  verification: VERIFICATION[u.verification] ?? "unverified",
  joinedAt: u.createdAt,
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
  id: p.trackingNo || p.id,
  recipient: p.recipientName ?? "",
  destination: p.destination ? `${p.destination.name ?? p.destination.code}` : "",
  courier: "",
  status: PARCEL_STATUS[p.state] ?? "pending_pickup",
  sla: "",
});

const detailStatus = (u: ApiUserDetail): UserStatus => (u.flagged ? "flagged" : (STATUS[u.status] ?? "active"));

const toDetail = (u: ApiUserDetail): UserDetail => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  verification: VERIFICATION[u.verification] ?? "unverified",
  joinedAt: u.createdAt,
  status: detailStatus(u),
  flag: null,
  suspension: null,
  walletBalanceKobo: Number(u.walletBalanceKobo ?? 0),
  totalSpentKobo: Number(u.parcels?.spentKobo ?? 0),
  parcelsSent: Number(u.parcels?.sent ?? 0),
  parcelsDelivered: Number(u.parcels?.delivered ?? 0),
  recentActivity: [],
});

/**
 * Users against `v1/admin/users/**`. Emails/phones come back masked by the backend;
 * filter options and suspend-reason catalogs aren't server-supplied, so they return
 * static lists; `flagUsers` rides `v1/admin/flags`; no export endpoint exists.
 */
export const httpUsersService: UsersService = {
  getUsers: async (params) => {
    const searchParams = new URLSearchParams({pageSize: "50"});
    if (params.query) searchParams.set("query", params.query);
    if (params.status) searchParams.set("status", params.status);
    if (params.verification) searchParams.set("verification", params.verification);
    const res = await apiClient.get("v1/admin/users", {searchParams}).json<ApiListUsersResponse>();
    const items = res.users.map(toRow);
    return {
      metrics: {
        total: Number(res.total),
        verified: items.filter((u) => u.verification === "verified").length,
        suspended: items.filter((u) => u.status === "suspended").length,
        flagged: items.filter((u) => u.status === "flagged").length,
        newToday: 0,
      },
      users: {items, page: params.page, pageSize: 50, total: Number(res.total)},
      filters: {statuses: ["active", "flagged", "suspended"], verifications: ["verified", "partial", "unverified"]},
      suspendReasons: ["suspicious_activity", "payment_fraud", "policy_violations", "abusive_behavior", "duplicate_account", "other"],
    };
  },
  getUserDetail: async (id) => {
    const res = await apiClient.get(`v1/admin/users/${id}`).json<{user: ApiUserDetail}>();
    return toDetail(res.user);
  },
  getUserParcels: async (id, params): Promise<Page<UserParcel>> => {
    const res = await apiClient
      .get(`v1/admin/users/${id}/parcels`, {searchParams: {pageSize: 20}})
      .json<{parcels: ApiUserParcel[]; nextPageToken: string}>();
    const items = res.parcels.map(toParcel);
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
    await apiClient.post(`v1/admin/users/${id}/delete`, {json: {}});
    return {id};
  },
  exportUsers: async () => {
    throw new Error("user export is not supported by the API yet");
  },
};
