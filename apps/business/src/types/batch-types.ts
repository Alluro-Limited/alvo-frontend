import type {ShipmentPriority, ShipmentSize} from "./dashboard-types";

export type BatchStatus = "active" | "issue" | "completed" | "draft";
export type BatchFilter = "all" | BatchStatus;
export type BatchPeriod = "7d" | "30d" | "90d" | "all";

/** One row of the batches table. Drafts have no shipments or cost yet. */
export interface BatchSummary {
  id: string;
  name: string;
  shipmentCount: number | null;
  status: BatchStatus;
  createdAt: string;
  totalCost: number | null;
}

export interface TopLocker {
  code: string;
  area: string;
  deliveries: number;
}

export interface BatchListStats {
  totalBatches: number;
  activeBatches: number;
  completeBatches: number;
  draftBatches: number;
  totalShipments: number;
  topLocker: TopLocker | null;
  totalSpend: number;
  avgPerShipment: number;
}

export interface BatchListResult {
  stats: BatchListStats;
  batches: BatchSummary[];
}

/** Delivery stages shown in the shipments table and the delivery-breakdown panel. */
export type ShipmentStage =
  | "awaiting_dropoff"
  | "courier_assigned"
  | "dropped_off"
  | "in_transit"
  | "ready_for_collection"
  | "delivered"
  | "failed";

export interface BatchShipment {
  id: string;
  recipient: string;
  phone: string;
  destination: string;
  size: ShipmentSize;
  priority: ShipmentPriority;
  stage: ShipmentStage;
}

export interface DeliveryBreakdown {
  collected: number;
  readyForCollection: number;
  inTransit: number;
  courierAssigned: number;
  awaitingDropoff: number;
  failed: number;
}

export interface BatchCostSummary {
  standardCount: number;
  standardCost: number;
  expressCount: number;
  expressCost: number;
  platformFee: number;
  total: number;
}

export interface BatchDetail {
  id: string;
  name: string;
  createdAt: string;
  totalShipments: number;
  delivered: number;
  inProgress: number;
  failed: number;
  originLocker: string;
  totalCost: number;
  /** e.g. "Standard · Express" — the priorities used in this batch. */
  priorities: string;
  /** 0–1 fraction of parcels collected. */
  progress: number;
  allDelivered: boolean;
  breakdown: DeliveryBreakdown;
  cost: BatchCostSummary;
  shipments: BatchShipment[];
}

export interface TrackingEvent {
  title: string;
  detail: string;
  done: boolean;
}

export interface ShipmentTracking {
  shipmentId: string;
  recipientName: string;
  batchId: string;
  batchName: string;
  statusTitle: string;
  statusDetail: string;
  recipient: string;
  phone: string;
  originLocker: string;
  destinationLocker: string;
  size: ShipmentSize;
  priority: ShipmentPriority;
  deliveryFee: number;
  timeline: TrackingEvent[];
}

export interface BatchesService {
  getBatches: () => Promise<BatchListResult>;
  getBatch: (id: string) => Promise<BatchDetail>;
  getShipmentTracking: (shipmentId: string) => Promise<ShipmentTracking>;
  deleteBatch: (id: string) => Promise<void>;
}
