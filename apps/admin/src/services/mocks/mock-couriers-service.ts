import {API_ERROR_CODES} from "@/lib/api-errors";
import type {
  CourierFlag,
  CourierListParams,
  CourierRow,
  CouriersService,
  CourierSuspension,
  CourierVerificationItemKey,
} from "@/types/couriers-types";
import {courierAssignmentsFor, courierDetailFor} from "./mock-courier-detail";
import {COURIER_SEEDS} from "./mock-courier-seeds";
import {mockDelay, mockHttpError} from "./mock-http";

const PAGE_SIZE = 10;
const HISTORY_PAGE_SIZE = 7;

const STATUS_FILTERS = ["active", "flagged", "suspended"];
const VERIFICATION_FILTERS = ["verified", "pending"];
const VEHICLE_FILTERS = ["bicycle", "car", "motorcycle", "van"];
const SUSPEND_REASONS = ["gps_tampering", "safety_incident", "policy_violations", "recipient_complaint", "fraud", "other"] as const;
const DELETE_REASONS = ["account_closed", "policy_violations", "fraud", "inactive", "other"] as const;

/** In-memory rows — suspend/flag/delete mutations mutate this store for the session. */
const rowsStore: CourierRow[] = [...COURIER_SEEDS];

/** Flag/suspension records seeded for every flagged/suspended row so flows stay consistent pre-mutation. */
const flagsStore = new Map<string, CourierFlag>(
  COURIER_SEEDS.filter((row) => row.status === "flagged").map((row) => [
    row.id,
    {reason: "recipient_complaint", notes: "Repeated recipient complaints about handling.", at: "2026-10-02T09:30:00Z"},
  ])
);
const suspensionsStore = new Map<string, CourierSuspension>(
  COURIER_SEEDS.filter((row) => row.status === "suspended").map((row) => [
    row.id,
    {reason: "gps_tampering", notes: "GPS tampering suspected on multiple routes.", at: "2026-09-28T14:05:00Z"},
  ])
);

/** Per-courier item approvals — the row pill re-derives once every item is approved. */
const approvalsStore = new Map<string, Map<CourierVerificationItemKey, string>>();

function applyFilters(params: Omit<CourierListParams, "page">) {
  const q = params.query?.trim().toLowerCase();
  let items = rowsStore;
  if (params.status) items = items.filter((row) => row.status === params.status);
  if (params.verification) items = items.filter((row) => row.verification === params.verification);
  if (params.vehicle) items = items.filter((row) => row.vehicle === params.vehicle);
  if (q) items = items.filter((row) => [row.id, row.name, row.zone].some((f) => f.toLowerCase().includes(q)));
  return items;
}

function metricsFor(rows: CourierRow[]) {
  const count = (status: CourierRow["status"]) => rows.filter((row) => row.status === status).length;
  return {
    total: rows.length,
    active: count("active"),
    onAssignment: Math.max(3, Math.floor(rows.length * 0.05)),
    pendingVerify: rows.filter((row) => row.verification === "pending").length,
    flagged: count("flagged"),
    suspended: count("suspended"),
  };
}

function findRow(id: string, path: string) {
  const index = rowsStore.findIndex((row) => row.id === id);
  if (index < 0) throw mockHttpError(path, API_ERROR_CODES.NOT_FOUND);
  return index;
}

function detailFor(index: number) {
  const row = rowsStore[index];
  return courierDetailFor(row, index, {
    flag: flagsStore.get(row.id) ?? null,
    suspension: suspensionsStore.get(row.id) ?? null,
    approvals: approvalsStore.get(row.id),
  });
}

function toCsv(rows: CourierRow[]) {
  const header = "id,rank,name,vehicle,zone,verification,success_rate,status";
  const body = rows.map((row) =>
    [row.id, row.rank, row.name, row.vehicle, row.zone, row.verification, row.successRate ?? "", row.status].join(",")
  );
  return [header, ...body].join("\n");
}

/** In-memory stand-in for the couriers API while it does not exist. */
export const mockCouriersService: CouriersService = {
  getCouriers: async (params) => {
    await mockDelay();
    const items = applyFilters(params);
    const start = (params.page - 1) * PAGE_SIZE;
    return {
      metrics: metricsFor(rowsStore),
      couriers: {items: items.slice(start, start + PAGE_SIZE), page: params.page, pageSize: PAGE_SIZE, total: items.length},
      filters: {statuses: STATUS_FILTERS, verifications: VERIFICATION_FILTERS, vehicles: VEHICLE_FILTERS},
      suspendReasons: [...SUSPEND_REASONS],
      deleteReasons: [...DELETE_REASONS],
    };
  },

  getCourierMap: async (params) => {
    await mockDelay();
    return applyFilters(params).map((row) => ({...row}));
  },

  getCourierDetail: async (id) => {
    await mockDelay();
    return detailFor(findRow(id, `couriers/${id}`));
  },

  getCourierAssignments: async (id, params) => {
    await mockDelay();
    const index = findRow(id, `couriers/${id}/assignments`);
    const total = detailFor(index).performance.totalDeliveries;
    const all = courierAssignmentsFor(rowsStore[index], total);
    const q = params.query?.trim().toLowerCase();
    let items = all;
    if (params.type) items = items.filter((row) => row.type === params.type);
    if (params.status) items = items.filter((row) => row.status === params.status);
    if (q) items = items.filter((row) => [row.id, row.type, row.pickup, row.dropoff].some((f) => f.toLowerCase().includes(q)));
    const start = (params.page - 1) * HISTORY_PAGE_SIZE;
    return {items: items.slice(start, start + HISTORY_PAGE_SIZE), page: params.page, pageSize: HISTORY_PAGE_SIZE, total: items.length};
  },

  approveVerificationItem: async (id, itemKey) => {
    await mockDelay();
    const index = findRow(id, `couriers/${id}/verification/${itemKey}/approve`);
    const approvals = approvalsStore.get(id) ?? new Map<CourierVerificationItemKey, string>();
    approvals.set(itemKey, new Date().toISOString());
    approvalsStore.set(id, approvals);
    // Fresh row object once every item is approved — refetches yield new references.
    if (detailFor(index).verification === "verified" && rowsStore[index].verification !== "verified") {
      rowsStore[index] = {...rowsStore[index], verification: "verified", successRate: 80 + ((index * 11) % 20)};
    }
    return detailFor(index);
  },

  suspendCourier: async (id, input) => {
    await mockDelay();
    const index = findRow(id, `couriers/${id}/suspend`);
    rowsStore[index] = {...rowsStore[index], status: "suspended"};
    suspensionsStore.set(id, {reason: input.reason, notes: input.notes, at: new Date().toISOString()});
    return {id, status: "suspended"};
  },

  unsuspendCourier: async (id) => {
    await mockDelay();
    const index = findRow(id, `couriers/${id}/unsuspend`);
    rowsStore[index] = {...rowsStore[index], status: "active"};
    suspensionsStore.delete(id);
    return {id, status: "active"};
  },

  flagCouriers: async (input) => {
    await mockDelay();
    for (const id of input.ids) {
      const index = findRow(id, "couriers/flag");
      rowsStore[index] = {...rowsStore[index], status: "flagged"};
      flagsStore.set(id, {reason: input.reason, notes: input.notes, at: new Date().toISOString()});
    }
    return {ids: input.ids, status: "flagged"};
  },

  deleteCourier: async (id) => {
    await mockDelay();
    const index = findRow(id, `couriers/${id}`);
    rowsStore.splice(index, 1);
    flagsStore.delete(id);
    suspensionsStore.delete(id);
    approvalsStore.delete(id);
    return {id};
  },

  exportCouriers: async (params) => {
    await mockDelay();
    const rows = params.ids?.length ? rowsStore.filter((row) => params.ids?.includes(row.id)) : applyFilters(params);
    return toCsv(rows);
  },

  exportCourierAssignments: async (id, params) => {
    await mockDelay();
    const index = findRow(id, `couriers/${id}/assignments/export`);
    const all = courierAssignmentsFor(rowsStore[index], detailFor(index).performance.totalDeliveries);
    const q = params.query?.trim().toLowerCase();
    let items = params.ids?.length ? all.filter((row) => params.ids?.includes(row.id)) : all;
    if (params.type) items = items.filter((row) => row.type === params.type);
    if (params.status) items = items.filter((row) => row.status === params.status);
    if (q) items = items.filter((row) => [row.id, row.type, row.pickup, row.dropoff].some((f) => f.toLowerCase().includes(q)));
    const header = "date,id,type,pickup,dropoff,items,status";
    const body = items.map((row) => [row.date, row.id, row.type, row.pickup, row.dropoff, row.items, row.status].join(","));
    return [header, ...body].join("\n");
  },
};
