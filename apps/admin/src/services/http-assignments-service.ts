import * as v from "valibot";
import {apiClient} from "@/services/api-client";
import type {AssignmentsService} from "@/types/assignment-types";

const StatusSchema = v.picklist(["created", "pending_pickup", "active", "public_pool", "failed", "flagged", "completed"]);
const TypeSchema = v.picklist(["bulk", "node", "express"]);
const LngLatSchema = v.tuple([v.number(), v.number()]);

const PageSchema = <TItem extends v.GenericSchema>(item: TItem) =>
  v.object({items: v.array(item), page: v.number(), pageSize: v.number(), total: v.number()});

const RowSchema = v.object({
  id: v.string(),
  type: TypeSchema,
  courier: v.nullable(v.string()),
  pickup: v.string(),
  dropoff: v.string(),
  items: v.number(),
  status: StatusSchema,
  position: LngLatSchema,
});

const ListResponseSchema = v.object({
  metrics: v.object({
    active: v.number(),
    pendingPickup: v.number(),
    completed: v.number(),
    publicPool: v.number(),
    failed: v.number(),
    flagged: v.number(),
  }),
  assignments: PageSchema(RowSchema),
  filters: v.object({statuses: v.array(v.string()), types: v.array(v.string())}),
});

const DetailSchema = v.object({
  id: v.string(),
  type: TypeSchema,
  status: StatusSchema,
  pickup: v.string(),
  dropoff: v.string(),
  items: v.number(),
  courier: v.nullable(v.object({name: v.string(), code: v.string()})),
  progress: v.nullable(v.number()),
  etaMin: v.nullable(v.number()),
  declinedBy: v.nullable(v.array(v.string())),
  flag: v.nullable(v.object({reason: v.string(), notes: v.optional(v.string()), at: v.string()})),
  timeline: v.array(v.object({label: v.string(), at: v.nullable(v.string()), detail: v.optional(v.string()), done: v.boolean()})),
  route: v.string(),
  itemStatusOrder: v.array(v.picklist(["waiting", "picked_up", "en_route", "at_super_node", "delivered"])),
  assignmentItems: v.array(
    v.object({
      id: v.string(),
      slot: v.string(),
      weightKg: v.number(),
      status: v.picklist(["waiting", "picked_up", "en_route", "at_super_node", "delivered"]),
    })
  ),
});

const AssignableSchema = v.object({id: v.string(), type: TypeSchema, status: StatusSchema, route: v.string(), items: v.number()});

const CourierSchema = v.object({
  id: v.string(),
  name: v.string(),
  code: v.string(),
  rank: v.number(),
  zones: v.array(v.string()),
  successRate: v.number(),
});

/** Valibot-schemad HTTP contract — the shapes the real API must return. */
export const httpAssignmentsService: AssignmentsService = {
  getAssignments: async (params) => {
    const body = await apiClient
      .get("assignments", {
        searchParams: {
          page: params.page,
          ...(params.query ? {q: params.query} : {}),
          ...(params.status ? {status: params.status} : {}),
          ...(params.type ? {type: params.type} : {}),
        },
      })
      .json();
    return v.parse(ListResponseSchema, body);
  },
  getAssignmentDetail: async (id) => {
    const body = await apiClient.get(`assignments/${id}`).json();
    return v.parse(DetailSchema, body);
  },
  getAssignable: async () => {
    const body = await apiClient.get("assignments/assignable").json();
    return v.parse(v.array(AssignableSchema), body);
  },
  getIdleCouriers: async (query) => {
    const body = await apiClient.get("couriers/idle", {searchParams: query ? {q: query} : {}}).json();
    return v.parse(v.array(CourierSchema), body);
  },
  assignCourier: async (input) => {
    const body = await apiClient.post("assignments/assign", {json: input}).json();
    return v.parse(v.object({id: v.string(), courier: v.string()}), body);
  },
  flagAssignment: async (id, input) => {
    const body = await apiClient.post(`assignments/${id}/flag`, {json: input}).json();
    return v.parse(v.object({id: v.string(), status: StatusSchema}), body);
  },
};
