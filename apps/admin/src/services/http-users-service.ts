import * as v from "valibot";
import {apiClient} from "@/services/api-client";
import type {UsersService} from "@/types/users-types";

const StatusSchema = v.picklist(["active", "flagged", "suspended"]);
const VerificationSchema = v.picklist(["verified", "partial", "unverified"]);
const ParcelStatusSchema = v.picklist(["pending_pickup", "in_transit", "delivered", "failed", "expired"]);
const SuspendReasonSchema = v.picklist([
  "suspicious_activity",
  "payment_fraud",
  "policy_violations",
  "abusive_behavior",
  "duplicate_account",
  "other",
]);

const PageSchema = <TItem extends v.GenericSchema>(item: TItem) =>
  v.object({items: v.array(item), page: v.number(), pageSize: v.number(), total: v.number()});

const RowSchema = v.object({
  id: v.string(),
  name: v.string(),
  email: v.string(),
  phone: v.string(),
  verification: VerificationSchema,
  joinedAt: v.string(),
  status: StatusSchema,
});

const ListResponseSchema = v.object({
  metrics: v.object({total: v.number(), verified: v.number(), suspended: v.number(), flagged: v.number(), newToday: v.number()}),
  users: PageSchema(RowSchema),
  filters: v.object({statuses: v.array(v.string()), verifications: v.array(v.string())}),
  suspendReasons: v.array(SuspendReasonSchema),
});

const DetailSchema = v.object({
  id: v.string(),
  name: v.string(),
  email: v.string(),
  phone: v.string(),
  verification: VerificationSchema,
  joinedAt: v.string(),
  status: StatusSchema,
  flag: v.nullable(v.object({reason: v.string(), notes: v.optional(v.string()), at: v.string()})),
  suspension: v.nullable(v.object({reason: v.string(), notes: v.optional(v.string()), at: v.string()})),
  walletBalanceKobo: v.number(),
  totalSpentKobo: v.number(),
  parcelsSent: v.number(),
  parcelsDelivered: v.number(),
  recentActivity: v.array(v.object({id: v.string(), label: v.string(), at: v.string()})),
});

const ParcelSchema = v.object({
  id: v.string(),
  recipient: v.string(),
  destination: v.string(),
  courier: v.string(),
  status: ParcelStatusSchema,
  sla: v.string(),
});

/** Valibot-schemad HTTP contract — the shapes the real API must return. */
export const httpUsersService: UsersService = {
  getUsers: async (params) => {
    const body = await apiClient
      .get("users", {
        searchParams: {
          page: params.page,
          ...(params.query ? {q: params.query} : {}),
          ...(params.status ? {status: params.status} : {}),
          ...(params.verification ? {verification: params.verification} : {}),
        },
      })
      .json();
    return v.parse(ListResponseSchema, body);
  },
  getUserDetail: async (id) => {
    const body = await apiClient.get(`users/${id}`).json();
    return v.parse(DetailSchema, body);
  },
  getUserParcels: async (id, params) => {
    const body = await apiClient
      .get(`users/${id}/parcels`, {
        searchParams: {
          page: params.page,
          ...(params.query ? {q: params.query} : {}),
          ...(params.status ? {status: params.status} : {}),
        },
      })
      .json();
    return v.parse(PageSchema(ParcelSchema), body);
  },
  suspendUser: async (id, input) => {
    const body = await apiClient.post(`users/${id}/suspend`, {json: input}).json();
    return v.parse(v.object({id: v.string(), status: StatusSchema}), body);
  },
  unsuspendUser: async (id, input) => {
    const body = await apiClient.post(`users/${id}/unsuspend`, {json: input}).json();
    return v.parse(v.object({id: v.string(), status: StatusSchema}), body);
  },
  flagUsers: async (input) => {
    const body = await apiClient.post("users/flag", {json: input}).json();
    return v.parse(v.object({ids: v.array(v.string()), status: StatusSchema}), body);
  },
  deleteUser: async (id) => {
    const body = await apiClient.delete(`users/${id}`).json();
    return v.parse(v.object({id: v.string()}), body);
  },
  exportUsers: async (params) => {
    return apiClient
      .get("users/export", {
        searchParams: {
          ...(params.query ? {q: params.query} : {}),
          ...(params.status ? {status: params.status} : {}),
          ...(params.verification ? {verification: params.verification} : {}),
          ...(params.ids?.length ? {ids: params.ids.join(",")} : {}),
        },
      })
      .text();
  },
};
