import * as v from "valibot";
import {apiClient} from "@/services/api-client";
import type {CouriersService} from "@/types/couriers-types";

const StatusSchema = v.picklist(["active", "flagged", "suspended"]);
const VerificationSchema = v.picklist(["verified", "pending"]);
const VehicleSchema = v.picklist(["bicycle", "car", "motorcycle", "van"]);
const SuspendReasonSchema = v.picklist(["gps_tampering", "safety_incident", "policy_violations", "recipient_complaint", "fraud", "other"]);
const DeleteReasonSchema = v.picklist(["account_closed", "policy_violations", "fraud", "inactive", "other"]);
const ItemKeySchema = v.picklist(["phone_email", "id_account", "drivers_licence", "vehicle_photo", "background_check"]);
const DeliveryTypeSchema = v.picklist(["bulk", "node", "express"]);
const AssignmentStatusSchema = v.picklist(["completed", "cancelled", "failed"]);

const PageSchema = <TItem extends v.GenericSchema>(item: TItem) =>
  v.object({items: v.array(item), page: v.number(), pageSize: v.number(), total: v.number()});

const RowSchema = v.object({
  id: v.string(),
  rank: v.number(),
  name: v.string(),
  photoUrl: v.nullable(v.string()),
  vehicle: VehicleSchema,
  zone: v.string(),
  verification: VerificationSchema,
  successRate: v.nullable(v.number()),
  status: StatusSchema,
  position: v.tuple([v.number(), v.number()]),
});

const ListResponseSchema = v.object({
  metrics: v.object({
    total: v.number(),
    active: v.number(),
    onAssignment: v.number(),
    pendingVerify: v.number(),
    flagged: v.number(),
    suspended: v.number(),
  }),
  couriers: PageSchema(RowSchema),
  filters: v.object({statuses: v.array(v.string()), verifications: v.array(v.string()), vehicles: v.array(v.string())}),
  suspendReasons: v.array(SuspendReasonSchema),
  deleteReasons: v.array(DeleteReasonSchema),
});

const VerificationItemSchema = v.object({
  key: ItemKeySchema,
  status: v.picklist(["approved", "submitted"]),
  fileName: v.nullable(v.string()),
});

const DetailSchema = v.object({
  id: v.string(),
  name: v.string(),
  photoUrl: v.nullable(v.string()),
  status: StatusSchema,
  verification: VerificationSchema,
  fullName: v.string(),
  email: v.string(),
  phone: v.string(),
  age: v.number(),
  nin: v.string(),
  vehicle: VehicleSchema,
  vehicleBrand: v.string(),
  plateNumber: v.string(),
  zone: v.string(),
  joinedAt: v.string(),
  verificationItems: v.array(VerificationItemSchema),
  performance: v.object({
    rank: v.number(),
    successRate: v.number(),
    slaRate: v.number(),
    avgTimeMinutes: v.number(),
    totalDeliveries: v.number(),
    outOfZone: v.number(),
  }),
  flag: v.nullable(v.object({reason: v.string(), notes: v.optional(v.string()), at: v.string()})),
  suspension: v.nullable(v.object({reason: v.string(), notes: v.optional(v.string()), at: v.string()})),
});

const AssignmentSchema = v.object({
  date: v.string(),
  id: v.string(),
  type: DeliveryTypeSchema,
  pickup: v.string(),
  dropoff: v.string(),
  items: v.number(),
  status: AssignmentStatusSchema,
});

const NodeRefSchema = v.object({
  name: v.string(),
  code: v.string(),
  zone: v.string(),
  position: v.tuple([v.number(), v.number()]),
});

const TrackSchema = v.object({
  courierId: v.string(),
  name: v.string(),
  photoUrl: v.nullable(v.string()),
  vehicle: VehicleSchema,
  status: v.picklist(["in_transit", "delayed"]),
  motion: v.picklist(["enroute", "idle"]),
  publicPool: v.boolean(),
  type: DeliveryTypeSchema,
  batchId: v.string(),
  items: v.number(),
  pickup: NodeRefSchema,
  dropoff: NodeRefSchema,
  etaMinutes: v.number(),
  distanceKm: v.number(),
  position: v.tuple([v.number(), v.number()]),
  routePath: v.array(v.tuple([v.number(), v.number()])),
  lastKnownLocation: v.string(),
  offlineMinutes: v.number(),
  rating: v.number(),
  serviceTier: v.picklist(["standard", "express"]),
  etaAt: v.string(),
  phone: v.string(),
});

const TrackingResponseSchema = v.object({
  tracks: v.array(TrackSchema),
  filters: v.object({statuses: v.array(v.string()), types: v.array(v.string())}),
});

function listSearchParams(params: {query?: string; status?: string; verification?: string; vehicle?: string; ids?: string[]}) {
  return {
    ...(params.query ? {q: params.query} : {}),
    ...(params.status ? {status: params.status} : {}),
    ...(params.verification ? {verification: params.verification} : {}),
    ...(params.vehicle ? {vehicle: params.vehicle} : {}),
    ...(params.ids?.length ? {ids: params.ids.join(",")} : {}),
  };
}

function assignmentSearchParams(params: {query?: string; type?: string; status?: string}) {
  return {
    ...(params.query ? {q: params.query} : {}),
    ...(params.type ? {type: params.type} : {}),
    ...(params.status ? {status: params.status} : {}),
  };
}

/** Valibot-schemad HTTP contract — the shapes the real API must return. */
export const httpCouriersService: CouriersService = {
  getCouriers: async (params) => {
    const body = await apiClient
      .get("couriers", {
        searchParams: {page: params.page, ...listSearchParams(params)},
      })
      .json();
    return v.parse(ListResponseSchema, body);
  },
  getCourierTracking: async (params) => {
    const body = await apiClient.get("couriers/tracking", {searchParams: assignmentSearchParams(params)}).json();
    return v.parse(TrackingResponseSchema, body);
  },
  getCourierDetail: async (id) => {
    const body = await apiClient.get(`couriers/${id}`).json();
    return v.parse(DetailSchema, body);
  },
  getCourierAssignments: async (id, params) => {
    const body = await apiClient
      .get(`couriers/${id}/assignments`, {searchParams: {page: params.page, ...assignmentSearchParams(params)}})
      .json();
    return v.parse(PageSchema(AssignmentSchema), body);
  },
  approveVerificationItem: async (id, itemKey) => {
    const body = await apiClient.post(`couriers/${id}/verification/${itemKey}/approve`).json();
    return v.parse(DetailSchema, body);
  },
  suspendCourier: async (id, input) => {
    const body = await apiClient.post(`couriers/${id}/suspend`, {json: input}).json();
    return v.parse(v.object({id: v.string(), status: StatusSchema}), body);
  },
  unsuspendCourier: async (id, input) => {
    const body = await apiClient.post(`couriers/${id}/unsuspend`, {json: input}).json();
    return v.parse(v.object({id: v.string(), status: StatusSchema}), body);
  },
  flagCouriers: async (input) => {
    const body = await apiClient.post("couriers/flag", {json: input}).json();
    return v.parse(v.object({ids: v.array(v.string()), status: StatusSchema}), body);
  },
  deleteCourier: async (id, input) => {
    const body = await apiClient.delete(`couriers/${id}`, {json: input}).json();
    return v.parse(v.object({id: v.string()}), body);
  },
  exportCouriers: async (params) => {
    return apiClient.get("couriers/export", {searchParams: listSearchParams(params)}).text();
  },
  exportCourierAssignments: async (id, params) => {
    return apiClient.get(`couriers/${id}/assignments/export`, {searchParams: assignmentSearchParams(params)}).text();
  },
};
