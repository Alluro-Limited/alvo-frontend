import {API_ERROR_CODES} from "@/lib/api-errors";
import type {FlagParcelsInput, ParcelFlagRecord, WorkloadListParams, WorkloadsService} from "@/types/workloads-types";
import {mockDelay, mockHttpError} from "./mock-http";
import {
  MOCK_PAGE_SIZE,
  MOCK_PARCEL_TOTAL,
  PARCEL_ROWS,
  parcelDetailFor,
  WORKLOAD_FILTER_OPTIONS,
  WORKLOAD_METRICS,
} from "./mock-workloads-data";

/** Flags raised this session — the mock's "DB write" so the drawer/table reflect them. */
export const flagStore = new Map<string, ParcelFlagRecord>();

function isFlagged(id: string) {
  return flagStore.has(id) || PARCEL_ROWS.find((row) => row.id === id)?.flagged === true;
}

function applyFilters(params: WorkloadListParams & {ids?: string[]}) {
  const q = params.query?.trim().toLowerCase();
  const ids = params.ids ? new Set(params.ids) : null;
  let items = PARCEL_ROWS.map((row) => ({...row, flagged: isFlagged(row.id)}));
  if (ids) items = items.filter((row) => ids.has(row.id));
  if (params.status) items = items.filter((row) => row.status === params.status);
  if (params.nodeId) items = items.filter((row) => row.destinationNodeId === params.nodeId);
  if (q)
    items = items.filter((row) =>
      [row.id, row.sender, row.destination, row.courierId ?? ""].some((field) => field.toLowerCase().includes(q))
    );
  return items;
}

/** Renders the current filtered set as CSV — the shape a real export endpoint would stream. */
function toCsv(
  items: {
    id: string;
    sender: string;
    destination: string;
    courierId: string | null;
    destinationNodeId: string;
    status: string;
    slaRemainingMin: number | null;
    flagged: boolean;
  }[]
) {
  const escape = (value: string) => (/[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value);
  const rows = items.map((row) =>
    [
      row.id,
      row.sender,
      row.destination,
      row.courierId ?? "",
      row.destinationNodeId,
      row.status,
      row.slaRemainingMin?.toString() ?? "",
      row.flagged ? "yes" : "no",
    ]
      .map(escape)
      .join(",")
  );
  return ["parcel_id,sender,destination,courier,destination_node,status,sla_remaining_min,flagged", ...rows].join("\n");
}

/** In-memory stand-in for the workloads API while it does not exist. */
export const mockWorkloadsService: WorkloadsService = {
  getWorkloads: async (params) => {
    await mockDelay();
    if (params.tab !== "single") {
      return {
        metrics: {ongoing: 0, pendingPickup: 0, expired: 0, slaAtRisk: 0, flagged: 0},
        parcels: {items: [], page: params.page, pageSize: MOCK_PAGE_SIZE, total: 0},
        filters: WORKLOAD_FILTER_OPTIONS,
      };
    }
    const items = applyFilters(params);
    const start = (params.page - 1) * MOCK_PAGE_SIZE;
    const flagged = items.filter((row) => row.flagged).length;
    return {
      metrics: {...WORKLOAD_METRICS, flagged: WORKLOAD_METRICS.flagged + flagged},
      parcels: {
        items: items.slice(start, start + MOCK_PAGE_SIZE),
        page: params.page,
        pageSize: MOCK_PAGE_SIZE,
        total: items.length === PARCEL_ROWS.length ? MOCK_PARCEL_TOTAL : items.length,
      },
      filters: WORKLOAD_FILTER_OPTIONS,
    };
  },
  getParcelDetail: async (id) => {
    await mockDelay();
    const detail = parcelDetailFor(id);
    if (!detail) throw mockHttpError("workloads/parcels", API_ERROR_CODES.NOT_FOUND);
    return {...detail, flag: flagStore.get(id) ?? detail.flag};
  },
  flagParcels: async (input: FlagParcelsInput) => {
    await mockDelay();
    for (const id of input.ids) flagStore.set(id, {reason: input.reason, notes: input.notes, at: new Date().toISOString()});
    return {flagged: input.ids.length};
  },
  exportParcels: async (params) => {
    await mockDelay();
    return toCsv(applyFilters(params));
  },
};
