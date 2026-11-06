import {apiClient} from "@/services/api-client";
import type {AssignmentRow, AssignmentsService, AssignmentStatus} from "@/types/assignment-types";

const U = "not supported by the API yet";

interface ApiFlag {
  id: string;
  targetType: string;
  targetId: string;
  reasonCode: string;
  status: string;
  raisedBy?: string;
  createdAt: string;
}

const FLAG_STATUS: Record<string, AssignmentStatus> = {FLAG_STATUS_OPEN: "flagged", FLAG_STATUS_RESOLVED: "completed"};

const toRow = (f: ApiFlag): AssignmentRow => ({
  id: f.id,
  type: "node",
  courier: null,
  pickup: f.targetType.replace("FLAG_TARGET_TYPE_", "").toLowerCase(),
  dropoff: f.targetId,
  items: 0,
  status: FLAG_STATUS[f.status] ?? "flagged",
  etaMin: null,
  distanceKm: null,
  position: [0, 0],
});

/**
 * Review flags ride `v1/admin/flags` — getAssignments lists open flags as flagged
 * rows, flagAssignment creates one, resolveFlag closes it. Dispatch/map/auto-assign
 * has no endpoints.
 */
export const httpAssignmentsService: AssignmentsService = {
  getAssignments: async (params) => {
    const res = await apiClient.get("v1/admin/flags", {searchParams: {pageSize: 50}}).json<{flags: ApiFlag[]; total: string}>();
    const items = res.flags.map(toRow);
    return {
      metrics: {flagged: items.length, active: 0, pendingPickup: 0, completed: 0, publicPool: 0, failed: 0},
      assignments: {items, page: params.page, pageSize: 50, total: Number(res.total)},
      filters: {statuses: ["flagged"], types: []},
    };
  },
  getAssignmentMap: async () => {
    const res = await apiClient.get("v1/admin/flags", {searchParams: {pageSize: 50}}).json<{flags: ApiFlag[]}>();
    return res.flags.map(toRow);
  },
  getAssignmentDetail: async () => {
    throw new Error(`flag detail is ${U}`);
  },
  getAssignable: async () => {
    throw new Error(`assignable list is ${U}`);
  },
  getIdleCouriers: async () => {
    throw new Error(`idle couriers is ${U}`);
  },
  assignCourier: async () => {
    throw new Error(`courier assignment is ${U}`);
  },
  flagAssignment: async (id, input) => {
    await apiClient.post("v1/admin/flags", {
      json: {targetType: "FLAG_TARGET_TYPE_ASSIGNMENT", targetId: id, reasonCode: input.reason, notes: input.notes ?? ""},
    });
    return {id, status: "flagged"};
  },
  resolveFlag: async (flagId, resolution) => {
    await apiClient.post(`v1/admin/flags/${flagId}/resolve`, {json: {resolution}});
  },
};
