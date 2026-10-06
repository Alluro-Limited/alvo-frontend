import {API_ERROR_CODES} from "@/lib/api-errors";
import type {
  BatchRow,
  FlagParcelsInput,
  ParcelFlagRecord,
  ParcelRow,
  SafeItemRow,
  WorkloadListParams,
  WorkloadsService,
} from "@/types/workloads-types";
import {mockDelay, mockHttpError} from "./mock-http";
import {
  BATCH_FILTER_OPTIONS,
  BATCH_LIST_METRICS,
  BATCH_PARCEL_ROWS,
  BATCH_PARCEL_ROUTES,
  batchDetailFor,
  BATCH_ROWS,
  MOCK_BATCH_PAGE_SIZE,
  MOCK_BATCH_TOTAL,
} from "./mock-batches-data";
import {MOCK_SAFE_PAGE_SIZE, SAFE_FILTER_OPTIONS, SAFE_ITEM_ROWS, SAFE_METRICS, safeItemDetailFor} from "./mock-safe-data";
import {
  MOCK_PAGE_SIZE,
  MOCK_PARCEL_TOTAL,
  PARCEL_ROWS,
  detailFor,
  parcelDetailFor,
  WORKLOAD_FILTER_OPTIONS,
  WORKLOAD_METRICS,
} from "./mock-workloads-data";

/** Flags raised this session — the mock's "DB write" so the drawer/table reflect them. */
export const flagStore = new Map<string, ParcelFlagRecord>();

function isFlagged(row: {id: string; flagged: boolean}) {
  return flagStore.has(row.id) || row.flagged;
}

function applyParcelFilters(params: WorkloadListParams & {ids?: string[]}) {
  const q = params.query?.trim().toLowerCase();
  const ids = params.ids ? new Set(params.ids) : null;
  let items = PARCEL_ROWS.map((row) => ({...row, flagged: isFlagged(row)}));
  if (ids) items = items.filter((row) => ids.has(row.id));
  if (params.status) items = items.filter((row) => row.status === params.status);
  if (params.location) items = items.filter((row) => row.destinationNodeId === params.location);
  if (q)
    items = items.filter((row) =>
      [row.id, row.sender, row.destination, row.courierId ?? ""].some((field) => field.toLowerCase().includes(q))
    );
  return items;
}

function applyBatchFilters(params: WorkloadListParams & {ids?: string[]}) {
  const q = params.query?.trim().toLowerCase();
  const ids = params.ids ? new Set(params.ids) : null;
  let items = BATCH_ROWS;
  if (ids) items = items.filter((row) => ids.has(row.id));
  if (params.status) items = items.filter((row) => row.tags.includes(params.status as BatchRow["tags"][number]));
  if (params.location) items = items.filter((row) => row.city.toLowerCase() === params.location);
  if (q) items = items.filter((row) => [row.id, row.sme].some((field) => field.toLowerCase().includes(q)));
  return items;
}

function applyBatchParcelFilters(params: WorkloadListParams & {ids?: string[]}) {
  const q = params.query?.trim().toLowerCase();
  const ids = params.ids ? new Set(params.ids) : null;
  let items = BATCH_PARCEL_ROWS.map((row) => ({...row, flagged: isFlagged(row)}));
  if (ids) items = items.filter((row) => ids.has(row.id));
  if (params.status) items = items.filter((row) => row.status === params.status);
  if (params.location) items = items.filter((row) => (row.lastNodeId ?? row.destinationNodeId) === params.location);
  if (q)
    items = items.filter((row) =>
      [row.id, row.recipient ?? row.sender, row.destination, row.courierId ?? ""].some((field) => field.toLowerCase().includes(q))
    );
  return items;
}

function applySafeFilters(params: WorkloadListParams & {ids?: string[]}) {
  const q = params.query?.trim().toLowerCase();
  const ids = params.ids ? new Set(params.ids) : null;
  let items = SAFE_ITEM_ROWS.map((row) => ({...row, flagged: isFlagged(row)}));
  if (ids) items = items.filter((row) => ids.has(row.id));
  if (params.status) items = items.filter((row) => row.status === params.status);
  if (q) items = items.filter((row) => [row.id, row.owner].some((field) => field.toLowerCase().includes(q)));
  return items;
}

function escapeCsv(value: string) {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

/** Renders the current filtered set as CSV — the shape a real export endpoint would stream. */
function toCsv(headers: string, rows: string[][]) {
  return [headers, ...rows.map((row) => row.map(escapeCsv).join(","))].join("\n");
}

function parcelsCsv(items: ParcelRow[]) {
  return toCsv(
    "parcel_id,party,destination,courier,node,status,sla_remaining_min,flagged",
    items.map((row) => [
      row.id,
      row.recipient ?? row.sender,
      row.destination,
      row.courierId ?? "",
      row.lastNodeId ?? row.destinationNodeId,
      row.status,
      row.slaRemainingMin?.toString() ?? "",
      row.flagged ? "yes" : "no",
    ])
  );
}

function batchesCsv(items: BatchRow[]) {
  return toCsv(
    "batch_id,tags,sme,created_at,city,total_value,parcel_count,delivered",
    items.map((row) => [
      row.id,
      row.tags.join("|"),
      row.sme,
      row.createdAt,
      row.city,
      row.totalValue.toString(),
      row.parcelCount.toString(),
      row.delivered.toString(),
    ])
  );
}

function safeCsv(items: SafeItemRow[]) {
  return toCsv(
    "item_id,owner,node,stored_at,status,flagged",
    items.map((row) => [row.id, row.owner, row.nodeId, row.storedAt, row.status, row.flagged ? "yes" : "no"])
  );
}

/** In-memory stand-in for the workloads API while it does not exist. */
export const mockWorkloadsService: WorkloadsService = {
  getWorkloads: async (params) => {
    await mockDelay();
    if (params.tab === "batches") {
      const items = applyBatchFilters(params);
      const start = (params.page - 1) * MOCK_BATCH_PAGE_SIZE;
      const flagged = BATCH_PARCEL_ROWS.filter((row) => isFlagged(row)).length;
      return {
        metrics: {...BATCH_LIST_METRICS, flagged: (BATCH_LIST_METRICS.flagged ?? 0) + flagged},
        batches: {
          items: items.slice(start, start + MOCK_BATCH_PAGE_SIZE),
          page: params.page,
          pageSize: MOCK_BATCH_PAGE_SIZE,
          total: items.length === BATCH_ROWS.length ? MOCK_BATCH_TOTAL : items.length,
        },
        filters: BATCH_FILTER_OPTIONS,
      };
    }
    if (params.tab === "safe") {
      const items = applySafeFilters(params);
      const start = (params.page - 1) * MOCK_SAFE_PAGE_SIZE;
      const flagged = items.filter((row) => row.flagged).length;
      return {
        metrics: {...SAFE_METRICS, flagged: (SAFE_METRICS.flagged ?? 0) + flagged},
        safeItems: {
          items: items.slice(start, start + MOCK_SAFE_PAGE_SIZE),
          page: params.page,
          pageSize: MOCK_SAFE_PAGE_SIZE,
          total: items.length,
        },
        filters: SAFE_FILTER_OPTIONS,
      };
    }
    const items = applyParcelFilters(params);
    const start = (params.page - 1) * MOCK_PAGE_SIZE;
    const flagged = items.filter((row) => row.flagged).length;
    return {
      metrics: {...WORKLOAD_METRICS, flagged: (WORKLOAD_METRICS.flagged ?? 0) + flagged},
      parcels: {
        items: items.slice(start, start + MOCK_PAGE_SIZE),
        page: params.page,
        pageSize: MOCK_PAGE_SIZE,
        total: items.length === PARCEL_ROWS.length ? MOCK_PARCEL_TOTAL : items.length,
      },
      filters: WORKLOAD_FILTER_OPTIONS,
    };
  },
  getBatchDetail: async (id) => {
    await mockDelay();
    const detail = batchDetailFor(id);
    if (!detail) throw mockHttpError(`workloads/batches/${id}`, API_ERROR_CODES.NOT_FOUND);
    const flagged = BATCH_PARCEL_ROWS.filter((row) => isFlagged(row)).length;
    return {...detail, metrics: {...detail.metrics, flagged: (detail.metrics.flagged ?? 0) + flagged}};
  },
  getBatchParcels: async (batchId, params) => {
    await mockDelay();
    if (!batchDetailFor(batchId)) throw mockHttpError(`workloads/batches/${batchId}/parcels`, API_ERROR_CODES.NOT_FOUND);
    const items = applyBatchParcelFilters(params);
    const start = (params.page - 1) * MOCK_PAGE_SIZE;
    return {items: items.slice(start, start + MOCK_PAGE_SIZE), page: params.page, pageSize: MOCK_PAGE_SIZE, total: items.length};
  },
  getParcelDetail: async (id) => {
    await mockDelay();
    const detail = parcelDetailFor(id) ?? batchParcelDetail(id);
    if (!detail) throw mockHttpError("workloads/parcels", API_ERROR_CODES.NOT_FOUND);
    return {...detail, flag: flagStore.get(id) ?? detail.flag};
  },
  getSafeItemDetail: async (id) => {
    await mockDelay();
    const detail = safeItemDetailFor(id);
    if (!detail) throw mockHttpError(`workloads/safe/${id}`, API_ERROR_CODES.NOT_FOUND);
    return {...detail, flag: flagStore.get(id) ?? detail.flag};
  },
  flagParcels: async (input: FlagParcelsInput) => {
    await mockDelay();
    for (const id of input.ids) flagStore.set(id, {reason: input.reason, notes: input.notes, at: new Date().toISOString()});
    return {flagged: input.ids.length};
  },
  exportList: async (params) => {
    await mockDelay();
    if (params.batchId) return parcelsCsv(applyBatchParcelFilters(params));
    if (params.tab === "batches") return batchesCsv(applyBatchFilters(params));
    if (params.tab === "safe") return safeCsv(applySafeFilters(params));
    return parcelsCsv(applyParcelFilters(params));
  },
};

/** Batch parcels get the two-leg route timelines from the batch context. */
function batchParcelDetail(id: string) {
  const row = BATCH_PARCEL_ROWS.find((parcel) => parcel.id === id);
  return row ? detailFor(row, BATCH_PARCEL_ROUTES) : undefined;
}
