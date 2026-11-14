import {formatDate} from "@/lib/datetime";
import {koboToNaira} from "@/lib/money";
import {apiClient} from "@/services/api-client";
import type {ApiBatch, ApiGetBatchResponse, ApiListBatchesResponse, ApiShipment} from "@/types/api-types";
import type {BatchDetail, BatchStatus, BatchSummary, BatchesService, ShipmentStage} from "@/types/batch-types";
import type {ShipmentSize} from "@/types/dashboard-types";

const SIZE: Record<string, ShipmentSize> = {SIZE_CLASS_SMALL: "S", SIZE_CLASS_MEDIUM: "M", SIZE_CLASS_LARGE: "B"};

const STAGE: Record<string, ShipmentStage> = {
  PARCEL_STATE_CREATED: "awaiting_dropoff",
  PARCEL_STATE_PAID: "awaiting_dropoff",
  PARCEL_STATE_CODE_ISSUED: "awaiting_dropoff",
  PARCEL_STATE_AT_ORIGIN: "dropped_off",
  PARCEL_STATE_IN_TRANSIT: "in_transit",
  PARCEL_STATE_AT_DEST: "ready_for_collection",
  PARCEL_STATE_COLLECTED: "delivered",
  PARCEL_STATE_EXPIRED: "failed",
  PARCEL_STATE_CANCELLED: "failed",
  PARCEL_STATE_RETURN_PENDING: "failed",
  PARCEL_STATE_RETURNED: "failed",
};

const batchStatus = (status?: string): BatchStatus => {
  if (!status) return "active";
  if (status.includes("DRAFT")) return "draft";
  if (status.includes("COMPLETE")) return "completed";
  if (status.includes("ISSUE") || status.includes("FAIL")) return "issue";
  return "active";
};

const toSummary = (b: ApiBatch): BatchSummary => ({
  id: b.id ?? "",
  name: b.fileName || "Untitled batch",
  shipmentCount: b.totalParcels ?? 0,
  status: batchStatus(b.status),
  createdAt: formatDate(b.createdAt),
  totalCost: koboToNaira(b.totalPriceKobo),
});

const toRow = (s: ApiShipment): BatchDetail["shipments"][number] => ({
  id: s.trackingNo ?? "",
  recipient: s.recipientName ?? s.recipientPhone ?? "",
  phone: s.recipientPhone ?? "",
  destination: "",
  size: SIZE[s.sizeClass ?? ""] ?? "S",
  priority: "standard",
  stage: STAGE[s.state ?? ""] ?? "awaiting_dropoff",
});

type ShipmentRow = BatchDetail["shipments"][number];

const byStage = (shipments: ShipmentRow[], stage: ShipmentStage) => shipments.filter((s) => s.stage === stage).length;

const batchId = (b?: ApiBatch) => b?.id ?? "";
const batchName = (b?: ApiBatch) => b?.fileName || "Untitled batch";

const toCost = (b: ApiBatch | undefined, shipments: ShipmentRow[], express: ShipmentRow[]): BatchDetail["cost"] => ({
  standardCount: shipments.length - express.length,
  standardCost: 0,
  expressCount: express.length,
  expressCost: 0,
  platformFee: 0,
  total: koboToNaira(b?.totalPriceKobo),
});

const toBreakdown = (shipments: ShipmentRow[], delivered: number, failed: number): BatchDetail["breakdown"] => ({
  collected: delivered,
  readyForCollection: byStage(shipments, "ready_for_collection"),
  inTransit: byStage(shipments, "in_transit"),
  courierAssigned: byStage(shipments, "courier_assigned"),
  awaitingDropoff: byStage(shipments, "awaiting_dropoff"),
  failed,
});

const priorities = (shipments: ShipmentRow[]) =>
  [...new Set(shipments.map((s) => (s.priority === "express" ? "Express" : "Standard")))].join(" · ");

/** Breakdown, progress, and priorities are computed client-side — no stats endpoint exists. */
const toDetail = (res: ApiGetBatchResponse): BatchDetail => {
  const shipments = (res.shipments ?? []).map(toRow);
  const b = res.batch;
  const count = b?.totalParcels || shipments.length;
  const delivered = byStage(shipments, "delivered");
  const failed = byStage(shipments, "failed");
  const express = shipments.filter((s) => s.priority === "express");
  return {
    id: batchId(b),
    name: batchName(b),
    createdAt: `Created ${formatDate(b?.createdAt)}`,
    totalShipments: count,
    delivered,
    inProgress: count - delivered - failed,
    failed,
    originLocker: "",
    totalCost: koboToNaira(b?.totalPriceKobo),
    priorities: priorities(shipments),
    progress: count ? delivered / count : 0,
    allDelivered: count > 0 && delivered === count,
    breakdown: toBreakdown(shipments, delivered, failed),
    cost: toCost(b, shipments, express),
    shipments,
  };
};

/**
 * Batches against `v1/sme/batches`. The wire has no per-shipment tracking route,
 * no batch delete, no origin/destination names on shipments, and no cost split —
 * tracking/delete throw until the API grows them.
 */
export const httpBatchesService: BatchesService = {
  getBatches: async () => {
    const res = await apiClient.get("v1/sme/batches", {searchParams: {limit: 100}}).json<ApiListBatchesResponse>();
    const batches = (res.batches ?? []).map(toSummary);
    const spend = batches.reduce((sum, b) => sum + (b.totalCost ?? 0), 0);
    const shipments = batches.reduce((sum, b) => sum + (b.shipmentCount ?? 0), 0);
    return {
      stats: {
        totalBatches: batches.length,
        activeBatches: batches.filter((b) => b.status === "active").length,
        completeBatches: batches.filter((b) => b.status === "completed").length,
        draftBatches: batches.filter((b) => b.status === "draft").length,
        totalShipments: shipments,
        topLocker: null,
        totalSpend: spend,
        avgPerShipment: shipments ? Math.round(spend / shipments) : 0,
      },
      batches,
    };
  },
  getBatch: async (id) => toDetail(await apiClient.get(`v1/sme/batches/${id}`).json<ApiGetBatchResponse>()),
  getShipmentTracking: async () => {
    throw new Error("shipment tracking is not supported by the API yet");
  },
  deleteBatch: async () => {
    throw new Error("batch deletion is not supported by the API yet");
  },
};
