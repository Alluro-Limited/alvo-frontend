import * as v from "valibot";
import {apiClient} from "@/services/api-client";
import type {SmesService} from "@/types/smes-types";

const StatusSchema = v.picklist(["active", "flagged", "suspended"]);
const VerificationSchema = v.picklist(["verified", "partial", "unverified"]);
const SuspendReasonSchema = v.picklist([
  "fraudulent_bulk_uploads",
  "payment_default",
  "fake_documents",
  "policy_violations",
  "abusive_behavior",
  "other",
]);
const DeactivateReasonSchema = v.picklist(["customer_decision", "business_closed", "compliance_hold", "duplicate_account", "other"]);

const PageSchema = <TItem extends v.GenericSchema>(item: TItem) =>
  v.object({items: v.array(item), page: v.number(), pageSize: v.number(), total: v.number()});

const RowSchema = v.object({
  id: v.string(),
  businessName: v.string(),
  industry: v.string(),
  location: v.string(),
  verification: VerificationSchema,
  joinedAt: v.string(),
  status: StatusSchema,
});

const ListResponseSchema = v.object({
  metrics: v.object({total: v.number(), verified: v.number(), suspended: v.number(), flagged: v.number(), newToday: v.number()}),
  smes: PageSchema(RowSchema),
  filters: v.object({statuses: v.array(v.string()), verifications: v.array(v.string())}),
  suspendReasons: v.array(SuspendReasonSchema),
  deactivateReasons: v.array(DeactivateReasonSchema),
  businessTypes: v.array(v.string()),
});

const VerificationItemSchema = v.object({
  key: v.string(),
  label: v.string(),
  status: v.picklist(["not_uploaded", "submitted", "approved"]),
  fileName: v.nullable(v.string()),
  checklist: v.array(v.string()),
});

const DetailSchema = v.object({
  id: v.string(),
  ref: v.string(),
  businessName: v.string(),
  businessType: v.string(),
  businessPhone: v.string(),
  businessEmail: v.string(),
  location: v.string(),
  contactName: v.string(),
  contactEmail: v.string(),
  contactPhone: v.string(),
  cacNumber: v.string(),
  joinedAt: v.string(),
  verification: VerificationSchema,
  status: StatusSchema,
  dvaEnabled: v.boolean(),
  flag: v.nullable(v.object({reason: v.string(), notes: v.optional(v.string()), at: v.string()})),
  suspension: v.nullable(v.object({reason: v.string(), notes: v.optional(v.string()), at: v.string()})),
  walletBalanceKobo: v.number(),
  dvaAccount: v.string(),
  bank: v.string(),
  verificationItems: v.array(VerificationItemSchema),
  batches: v.array(
    v.object({
      id: v.string(),
      parcels: v.number(),
      amountKobo: v.number(),
      createdAt: v.string(),
      status: v.picklist(["active", "completed"]),
    })
  ),
});

/** Valibot-schemad HTTP contract — the shapes the real API must return. */
export const httpSmesService: SmesService = {
  getSmes: async (params) => {
    const body = await apiClient
      .get("smes", {
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
  getSmeDetail: async (id) => {
    const body = await apiClient.get(`smes/${id}`).json();
    return v.parse(DetailSchema, body);
  },
  updateSme: async (id, input) => {
    const body = await apiClient.patch(`smes/${id}`, {json: input}).json();
    return v.parse(DetailSchema, body);
  },
  approveVerificationItem: async (id, itemKey) => {
    const body = await apiClient.post(`smes/${id}/verification/${itemKey}/approve`).json();
    return v.parse(DetailSchema, body);
  },
  suspendSme: async (id, input) => {
    const body = await apiClient.post(`smes/${id}/suspend`, {json: input}).json();
    return v.parse(v.object({id: v.string(), status: StatusSchema}), body);
  },
  unsuspendSme: async (id, input) => {
    const body = await apiClient.post(`smes/${id}/unsuspend`, {json: input}).json();
    return v.parse(v.object({id: v.string(), status: StatusSchema}), body);
  },
  flagSmes: async (input) => {
    const body = await apiClient.post("smes/flag", {json: input}).json();
    return v.parse(v.object({ids: v.array(v.string()), status: StatusSchema}), body);
  },
  deactivateSme: async (id, input) => {
    const body = await apiClient.post(`smes/${id}/deactivate`, {json: input}).json();
    return v.parse(v.object({id: v.string()}), body);
  },
  exportSmes: async (params) => {
    return apiClient
      .get("smes/export", {
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
