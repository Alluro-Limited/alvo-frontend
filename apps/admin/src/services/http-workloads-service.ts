import {apiClient} from "@/services/api-client";
import {fetchPage} from "@/services/paged";
import {LABEL, listParcels, metrics, toBatch, toDetail, toRow} from "@/services/http-workloads-map";
import type {ApiAdminBatch, ApiFlag, ApiParcelDetail} from "@/services/http-workloads-map";
import type {BatchDetail, Page, ParcelFlagRecord, ParcelRow, WorkloadsService} from "@/types/workloads-types";

const UNSUPPORTED = "not supported by the API yet";

/**
 * Workloads against `v1/admin/parcels`, `v1/admin/batches` and `v1/admin/flags`. The Safe
 * tab, live tracking, courier joins, and CSV exports have no endpoints — `safeItems`,
 * `getSafeItemDetail` and `exportList` throw or return empty.
 */
export const httpWorkloadsService: WorkloadsService = {
  getWorkloads: async (params) => {
    if (params.tab === "batches") {
      const res = await fetchPage<ApiAdminBatch>("batches", params.page, (pageToken) =>
        apiClient
          .get("v1/admin/batches", {searchParams: {page_size: "50", ...(pageToken ? {page_token: pageToken} : {})}})
          .json<{batches: ApiAdminBatch[]; nextPageToken?: string; total?: string}>()
          .then((r) => ({items: r.batches ?? [], nextPageToken: r.nextPageToken, total: Number(r.total ?? 0)}))
      );
      return {
        metrics: {total: res.total},
        batches: {items: res.items.map(toBatch), page: params.page, pageSize: 50, total: res.total},
        filters: {statuses: [], locations: []},
      };
    }
    if (params.tab === "safe") {
      return {metrics: {}, safeItems: {items: [], page: params.page, pageSize: 0, total: 0}, filters: {statuses: [], locations: []}};
    }
    const extra: Record<string, string> = {};
    if (params.query) extra.q = params.query;
    if (params.status && LABEL[params.status]) extra.label = LABEL[params.status];
    if (params.location) extra.node_id = params.location;
    if (params.batchId) extra.batch_id = params.batchId;
    const res = await listParcels(params.page, extra);
    return {
      metrics: metrics(res.stats),
      parcels: {items: res.items.map(toRow), page: params.page, pageSize: 50, total: res.total},
      filters: {statuses: ["pending_pickup", "in_transit", "delivered", "failed", "expired"], locations: []},
    };
  },
  getBatchDetail: async (id): Promise<BatchDetail> => {
    const res = await apiClient.get(`v1/admin/batches/${id}`).json<{batch: ApiAdminBatch}>();
    const row = toBatch(res.batch);
    return {...row, metrics: {total: row.parcelCount, delivered: row.delivered}, filters: {statuses: [], locations: []}};
  },
  getBatchParcels: async (batchId, params): Promise<Page<ParcelRow>> => {
    const res = await listParcels(params.page, {batch_id: batchId});
    return {items: res.items.map(toRow), page: params.page, pageSize: 50, total: res.total};
  },
  getParcelDetail: async (id) => {
    const flag = await apiClient
      .get("v1/admin/flags", {
        searchParams: {target_type: "FLAG_TARGET_TYPE_PARCEL", target_id: id, status: "FLAG_STATUS_OPEN", page_size: 1},
      })
      .json<{flags?: ApiFlag[]}>()
      .then((res) => res.flags?.[0])
      .then((f): ParcelFlagRecord | null => (f ? {reason: f.reasonCode, notes: f.notes, at: f.createdAt} : null))
      .catch(() => null);
    const res = await apiClient.get(`v1/admin/parcels/${id}`).json<ApiParcelDetail>();
    return toDetail(res, flag);
  },
  getSafeItemDetail: async () => {
    throw new Error(`safe item detail is ${UNSUPPORTED}`);
  },
  flagParcels: async (input) => {
    await Promise.all(
      input.ids.map((id) =>
        apiClient.post("v1/admin/flags", {
          json: {targetType: "FLAG_TARGET_TYPE_PARCEL", targetId: id, reasonCode: input.reason, notes: input.notes ?? ""},
        })
      )
    );
    return {flagged: input.ids.length};
  },
  exportList: async () => {
    throw new Error(`export is ${UNSUPPORTED}`);
  },
  revealParcel: async (id, reasonCode) => {
    const res = await apiClient
      .post(`v1/admin/parcels/${id}/reveal`, {json: {reasonCode}})
      .json<{recipientName?: string; recipientPhone?: string; senderEmail?: string; senderPhone?: string}>();
    return {sender: res.senderEmail ?? res.senderPhone, recipient: res.recipientName ?? res.recipientPhone};
  },
};
