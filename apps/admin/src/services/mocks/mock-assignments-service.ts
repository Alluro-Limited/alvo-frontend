import {API_ERROR_CODES} from "@/lib/api-errors";
import type {AssignableAssignment, AssignmentFlag, AssignmentListParams, AssignmentRow, AssignmentsService} from "@/types/assignment-types";
import {mockDelay, mockHttpError} from "./mock-http";
import {assignmentDetailFor} from "./mock-assignment-detail";
import {ASSIGNMENT_SEEDS, IDLE_COURIERS} from "./mock-assignment-seeds";

const PAGE_SIZE = 10;
const TOTAL = 343;

const STATUS_FILTERS = ["created", "pending_pickup", "active", "public_pool", "failed", "flagged", "completed"];
const TYPE_FILTERS = ["bulk", "node", "express"];

/** Statuses the manual-assign flow may pick up (per the Figma hint text). */
const ASSIGNABLE_STATUSES = new Set(["pending_pickup", "public_pool", "failed"]);

/** In-memory rows — flag/assign mutations mutate this store for the session. */
const rowsStore: AssignmentRow[] = [...ASSIGNMENT_SEEDS];
const flagsStore = new Map<string, AssignmentFlag>();

function applyFilters(params: AssignmentListParams) {
  const q = params.query?.trim().toLowerCase();
  let items = rowsStore;
  if (params.status) items = items.filter((row) => row.status === params.status);
  if (params.type) items = items.filter((row) => row.type === params.type);
  if (q) items = items.filter((row) => [row.id, row.courier ?? "", row.pickup, row.dropoff].some((f) => f.toLowerCase().includes(q)));
  return items;
}

function metricsFor(rows: AssignmentRow[]) {
  const count = (status: AssignmentRow["status"]) => rows.filter((row) => row.status === status).length;
  return {
    active: count("active"),
    pendingPickup: count("pending_pickup"),
    completed: count("completed"),
    publicPool: count("public_pool"),
    failed: count("failed"),
    flagged: count("flagged"),
  };
}

function assignableFor(row: AssignmentRow): AssignableAssignment {
  return {
    id: row.id,
    type: row.type,
    status: row.status,
    route: `${row.pickup} → ${row.dropoff}`,
    items: row.items,
  };
}

/** In-memory stand-in for the assignments API while it does not exist. */
export const mockAssignmentsService: AssignmentsService = {
  getAssignments: async (params) => {
    await mockDelay();
    const items = applyFilters(params);
    const start = (params.page - 1) * PAGE_SIZE;
    return {
      metrics: metricsFor(rowsStore),
      assignments: {
        items: items.slice(start, start + PAGE_SIZE),
        page: params.page,
        pageSize: PAGE_SIZE,
        total: items.length === rowsStore.length ? TOTAL : items.length,
      },
      filters: {statuses: STATUS_FILTERS, types: TYPE_FILTERS},
    };
  },
  getAssignmentDetail: async (id) => {
    await mockDelay();
    const row = rowsStore.find((assignment) => assignment.id === id);
    if (!row) throw mockHttpError(`assignments/${id}`, API_ERROR_CODES.NOT_FOUND);
    const flag = flagsStore.get(id);
    return flag ? {...assignmentDetailFor(row), flag} : assignmentDetailFor(row);
  },
  getAssignable: async () => {
    await mockDelay();
    return rowsStore
      .filter((row) => ASSIGNABLE_STATUSES.has(row.status))
      .slice(0, 8)
      .map(assignableFor);
  },
  getIdleCouriers: async (query) => {
    await mockDelay();
    const q = query?.trim().toLowerCase();
    if (!q) return IDLE_COURIERS;
    return IDLE_COURIERS.filter((courier) => `${courier.name} ${courier.code}`.toLowerCase().includes(q));
  },
  assignCourier: async (input) => {
    await mockDelay();
    const index = rowsStore.findIndex((assignment) => assignment.id === input.assignmentId);
    const courier = IDLE_COURIERS.find((entry) => entry.id === input.courierId);
    if (index < 0 || !courier) throw mockHttpError("assignments/assign", API_ERROR_CODES.NOT_FOUND);
    // Fresh object so refetches yield new references (in-place mutation leaves the UI stale).
    rowsStore[index] = {...rowsStore[index], courier: courier.name, status: "pending_pickup"};
    return {id: input.assignmentId, courier: courier.name};
  },
  flagAssignment: async (id, input) => {
    await mockDelay();
    const index = rowsStore.findIndex((assignment) => assignment.id === id);
    if (index < 0) throw mockHttpError(`assignments/${id}/flag`, API_ERROR_CODES.NOT_FOUND);
    rowsStore[index] = {...rowsStore[index], status: "flagged"};
    flagsStore.set(id, {reason: input.reason, notes: input.notes, at: new Date().toISOString()});
    return {id, status: "flagged"};
  },
};
