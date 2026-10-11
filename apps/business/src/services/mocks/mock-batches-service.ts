import type {BatchDetail, BatchListResult, BatchesService, BatchShipment, BatchSummary, ShipmentTracking} from "@/types/batch-types";
import {MOCK_AUTH} from "./mock-auth-service";
import {mockDelay, mockHttpError} from "./mock-http";
import {mockSession} from "./mock-session";

const DEMO_BATCHES: BatchSummary[] = [
  {id: "BT-20242", name: "March restock", shipmentCount: 88, status: "active", createdAt: "10 Feb 2026", totalCost: 58870},
  {id: "BT-20189", name: "Bags", shipmentCount: 34, status: "issue", createdAt: "28 Jan 2026", totalCost: 58870},
  {id: "BT-20176", name: "Week 11 orders", shipmentCount: 46, status: "completed", createdAt: "15 Mar 2026", totalCost: 58870},
  {id: "BT-20155", name: "Week 9 orders", shipmentCount: 78, status: "completed", createdAt: "05 Mar 2026", totalCost: 58870},
  {id: "BT-20131", name: "Clothes order", shipmentCount: 24, status: "completed", createdAt: "23 Feb 2026", totalCost: 58870},
  {id: "BT-20110", name: "Untitled batch", shipmentCount: null, status: "draft", createdAt: "16 Jan 2026", totalCost: null},
];

const DEMO_STATS = {
  totalBatches: 38,
  activeBatches: 6,
  completeBatches: 9,
  draftBatches: 1,
  totalShipments: 1248,
  topLocker: {code: "L04", area: "Surulere", deliveries: 318},
  totalSpend: 203219,
  avgPerShipment: 672,
};

const EMPTY_STATS = {
  totalBatches: 0,
  activeBatches: 0,
  completeBatches: 0,
  draftBatches: 0,
  totalShipments: 0,
  topLocker: null,
  totalSpend: 0,
  avgPerShipment: 0,
};

const SHIPMENT_ROWS: BatchShipment[] = [
  {
    id: "SHP-88430",
    recipient: "Khadija Rabiu",
    phone: "0803 441 2210",
    destination: "Surulere Hub — L04",
    size: "M",
    priority: "standard",
    stage: "dropped_off",
  },
  {
    id: "SHP-88431",
    recipient: "Musa Abubakar",
    phone: "0812 334 9901",
    destination: "Ikeja Central — L11",
    size: "S",
    priority: "standard",
    stage: "dropped_off",
  },
  {
    id: "SHP-88432",
    recipient: "Adeola Ilesanmi",
    phone: "0706 228 5545",
    destination: "Apapa Port — L01",
    size: "M",
    priority: "express",
    stage: "in_transit",
  },
  {
    id: "SHP-88433",
    recipient: "Tonbara Ekisagha",
    phone: "0803 222 1109",
    destination: "Victoria Island — L02",
    size: "S",
    priority: "standard",
    stage: "dropped_off",
  },
  {
    id: "SHP-88434",
    recipient: "Ebizi Tonbara",
    phone: "0701 558 4431",
    destination: "Ojota Terminal — L09",
    size: "B",
    priority: "express",
    stage: "ready_for_collection",
  },
  {
    id: "SHP-88435",
    recipient: "Bilkisu Suleiman",
    phone: "0803 222 1109",
    destination: "Apapa Port — L01",
    size: "S",
    priority: "standard",
    stage: "delivered",
  },
  {
    id: "SHP-88436",
    recipient: "Chinwe Eze",
    phone: "0902 117 8845",
    destination: "Surulere Hub — L04",
    size: "S",
    priority: "standard",
    stage: "failed",
  },
  {
    id: "SHP-88437",
    recipient: "Tunde Bakare",
    phone: "0815 990 2214",
    destination: "Ikeja Hub — L07",
    size: "M",
    priority: "express",
    stage: "courier_assigned",
  },
];

const TRACKING_TIMELINE = [
  {title: "Parcel dropped off at origin locker", detail: "Surulere Hub — L04 · 16 Mar 2026, 9:10 AM", done: true},
  {title: "Courier assigned", detail: "Courier ID: CRR-1042 · 16 Mar 2026, 9:45 AM", done: true},
  {title: "Picked up from origin locker", detail: "16 Mar 2026, 10:20 AM", done: true},
  {title: "In transit to destination", detail: "En route to Surulere Hub — L04", done: true},
  {title: "Delivered to destination locker", detail: "-", done: false},
  {title: "SMS sent to recipient", detail: "-", done: false},
  {title: "Parcel collected by recipient", detail: "-", done: false},
];

const isDemo = () => mockSession.email === MOCK_AUTH.demoEmail;

function detailFor(batch: BatchSummary): BatchDetail {
  const delivered = batch.status === "completed" ? (batch.shipmentCount ?? 0) : 68;
  const failed = batch.status === "issue" ? 11 : batch.status === "draft" ? 0 : 2;
  const inProgress = Math.max(0, (batch.shipmentCount ?? 96) - delivered - failed);
  return {
    id: batch.id,
    name: batch.name,
    createdAt: `Created ${batch.createdAt}`,
    totalShipments: batch.shipmentCount ?? 0,
    delivered,
    inProgress,
    failed,
    originLocker: "Surulere Hub — L04",
    totalCost: batch.totalCost ?? 0,
    priorities: "Standard · Express",
    progress: batch.shipmentCount ? delivered / batch.shipmentCount : 0,
    allDelivered: batch.status === "completed",
    breakdown: {
      collected: delivered,
      readyForCollection: 8,
      inTransit: 6,
      courierAssigned: 3,
      awaitingDropoff: 0,
      failed,
    },
    cost: {standardCount: 80, standardCost: 40000, expressCount: 12, expressCost: 12000, platformFee: 870, total: 42000},
    shipments: batch.status === "draft" ? [] : SHIPMENT_ROWS,
  };
}

/** In-memory batches backend while the API does not exist. Never ships when `VITE_API_URL` is set. */
export const mockBatchesService: BatchesService = {
  getBatches: async (): Promise<BatchListResult> => {
    await mockDelay();
    if (!isDemo()) return {stats: EMPTY_STATS, batches: []};
    return {stats: DEMO_STATS, batches: DEMO_BATCHES};
  },
  getBatch: async (id) => {
    await mockDelay();
    const batch = DEMO_BATCHES.find((entry) => entry.id === id);
    if (!isDemo() || !batch) throw mockHttpError(`batches/${id}`, 404);
    return detailFor(batch);
  },
  getShipmentTracking: async (shipmentId) => {
    await mockDelay();
    const shipment = SHIPMENT_ROWS.find((row) => row.id === shipmentId);
    if (!shipment) throw mockHttpError(`shipments/${shipmentId}`, 404);
    const tracking: ShipmentTracking = {
      shipmentId: shipment.id,
      recipientName: shipment.recipient,
      batchId: "BT-20242",
      batchName: "March restock",
      statusTitle: "In transit",
      statusDetail: "Departed on 16 Mar 2026 at 2:34 PM",
      recipient: shipment.recipient,
      phone: shipment.phone,
      originLocker: "Surulere Hub — L04",
      destinationLocker: shipment.destination,
      size: shipment.size,
      priority: shipment.priority,
      deliveryFee: 500,
      timeline: TRACKING_TIMELINE,
    };
    return tracking;
  },
  deleteBatch: async (id) => {
    await mockDelay();
    if (id === "BT-404") throw mockHttpError(`batches/${id}`, 404);
  },
};
