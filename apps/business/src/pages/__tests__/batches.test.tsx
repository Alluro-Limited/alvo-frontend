import {fireEvent, screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {batchesService} from "@/services/batches-service";
import {renderRoute} from "@/test/render-route";
import type {BatchDetail, BatchListResult, ShipmentTracking} from "@/types/batch-types";
import {BatchDetailPage} from "../batch-detail";
import {BatchesPage} from "../batches";

vi.mock("@/services/batches-service", () => ({
  batchesService: {getBatches: vi.fn(), getBatch: vi.fn(), getShipmentTracking: vi.fn(), deleteBatch: vi.fn()},
}));

const getBatches = vi.mocked(batchesService.getBatches);
const getBatch = vi.mocked(batchesService.getBatch);
const getShipmentTracking = vi.mocked(batchesService.getShipmentTracking);

const EMPTY: BatchListResult = {
  stats: {
    totalBatches: 0,
    activeBatches: 0,
    completeBatches: 0,
    draftBatches: 0,
    totalShipments: 0,
    topLocker: null,
    totalSpend: 0,
    avgPerShipment: 0,
  },
  batches: [],
};

const POPULATED: BatchListResult = {
  stats: {
    totalBatches: 38,
    activeBatches: 6,
    completeBatches: 9,
    draftBatches: 1,
    totalShipments: 1248,
    topLocker: {code: "L04", area: "Surulere", deliveries: 318},
    totalSpend: 203219,
    avgPerShipment: 672,
  },
  batches: [
    {id: "BT-20242", name: "March restock", shipmentCount: 92, status: "active", createdAt: "16 Mar 2026", totalCost: 42000},
    {id: "BT-20241", name: "Weekend orders", shipmentCount: 40, status: "completed", createdAt: "14 Mar 2026", totalCost: 20100},
    {id: "BT-20240", name: "Untitled batch", shipmentCount: null, status: "draft", createdAt: "12 Mar 2026", totalCost: null},
  ],
};

const DETAIL: BatchDetail = {
  id: "BT-20242",
  name: "March restock",
  createdAt: "16 Mar 2026",
  totalShipments: 92,
  delivered: 68,
  inProgress: 20,
  failed: 4,
  originLocker: "Surulere Hub — L04",
  totalCost: 42000,
  priorities: "Standard · Express",
  progress: 0.71,
  allDelivered: false,
  breakdown: {collected: 68, readyForCollection: 8, inTransit: 6, courierAssigned: 3, awaitingDropoff: 0, failed: 11},
  cost: {standardCount: 80, standardCost: 40000, expressCount: 12, expressCost: 12000, platformFee: 870, total: 42000},
  shipments: [
    {
      id: "SHP-88430",
      recipient: "Adaeze Okonkwo",
      phone: "0803 441 2210",
      destination: "Ikeja Hub — L07",
      size: "M",
      priority: "standard",
      stage: "in_transit",
    },
    {
      id: "SHP-88431",
      recipient: "Bola Adeyemi",
      phone: "0801 200 3311",
      destination: "Lekki Hub — L09",
      size: "S",
      priority: "express",
      stage: "delivered",
    },
  ],
};

const TRACKING: ShipmentTracking = {
  shipmentId: "SHP-88430",
  recipientName: "Adaeze Okonkwo",
  batchId: "BT-20242",
  batchName: "March restock",
  statusTitle: "In transit",
  statusDetail: "Courier is on the way to the destination locker",
  recipient: "Adaeze Okonkwo",
  phone: "0803 441 2210",
  originLocker: "Surulere Hub — L04",
  destinationLocker: "Ikeja Hub — L07",
  size: "M",
  priority: "standard",
  deliveryFee: 500,
  timeline: [
    {title: "Parcel dropped off at origin locker", detail: "Surulere Hub — L04 · 16 Mar 2026, 9:10 AM", done: true},
    {title: "Courier assigned", detail: "Courier ID: CRR-1042 · 16 Mar 2026, 9:45 AM", done: true},
    {title: "Delivered", detail: "Pending", done: false},
  ],
};

const renderList = () => renderRoute(BatchesPage, "/shipments");
const renderDetail = () => renderRoute(() => <BatchDetailPage batchId="BT-20242" />, "/shipments");

describe("BatchesPage", () => {
  beforeEach(() => {
    getBatches.mockReset();
  });

  it("shows the empty state with feature chips and both CTAs", async () => {
    getBatches.mockResolvedValue(EMPTY);
    renderList();

    expect(await screen.findByText("batches.empty_title")).toBeTruthy();
    expect(screen.getByText("batches.empty_sub")).toBeTruthy();
    expect(screen.getByText("batches.feat_tracking")).toBeTruthy();
    expect(screen.getByText("batches.feat_sms")).toBeTruthy();
    expect(screen.getByText("batches.feat_volume")).toBeTruthy();
    expect(screen.getByRole("link", {name: "batches.empty_cta"}).getAttribute("href")).toBe("/new-shipment");
    expect(screen.getByRole("button", {name: "batches.empty_template"})).toBeTruthy();
  });

  it("renders the populated stats and the batches table", async () => {
    getBatches.mockResolvedValue(POPULATED);
    renderList();

    expect(await screen.findByText("March restock")).toBeTruthy();
    expect(screen.getByText("38")).toBeTruthy();
    expect(screen.getByText("L04")).toBeTruthy();
    expect(screen.getByText("₦203,219")).toBeTruthy();
    expect(screen.getByText("Weekend orders")).toBeTruthy();
    expect(screen.getByText("Untitled batch")).toBeTruthy();
    expect(screen.getByText("batches.status_draft")).toBeTruthy();
  });

  it("filters rows by search text", async () => {
    getBatches.mockResolvedValue(POPULATED);
    renderList();
    await screen.findByText("March restock");

    fireEvent.change(screen.getByPlaceholderText("batches.search_ph"), {target: {value: "weekend"}});
    expect(screen.queryByText("March restock")).toBeNull();
    expect(screen.getByText("Weekend orders")).toBeTruthy();
  });

  it("filters rows by the draft status chip", async () => {
    getBatches.mockResolvedValue(POPULATED);
    renderList();
    await screen.findByText("March restock");

    fireEvent.click(screen.getByRole("tab", {name: "batches.filter_draft"}));
    expect(screen.queryByText("March restock")).toBeNull();
    expect(screen.getByText("Untitled batch")).toBeTruthy();
  });

  it("navigates to the batch detail when a row is clicked", async () => {
    getBatches.mockResolvedValue(POPULATED);
    const router = renderList();
    await screen.findByText("March restock");

    fireEvent.click(screen.getByText("March restock"));
    expect(router.state.location.pathname).toBe("/shipments/BT-20242");
  });

  it("opens the row menu and navigates via View Details", async () => {
    getBatches.mockResolvedValue(POPULATED);
    const router = renderList();
    await screen.findByText("March restock");

    fireEvent.click(screen.getAllByRole("button", {name: /batches\.row_actions/})[0]);
    fireEvent.click(await screen.findByText("batches.view_details"));
    expect(router.state.location.pathname).toBe("/shipments/BT-20242");
  });
});

describe("BatchDetailPage", () => {
  beforeEach(() => {
    getBatch.mockReset();
    getShipmentTracking.mockReset();
  });

  it("renders the batch info card, shipments table, and side panels", async () => {
    getBatch.mockResolvedValue(DETAIL);
    renderDetail();

    expect(await screen.findByText("BT-20242")).toBeTruthy();
    expect(screen.getByText("Surulere Hub — L04")).toBeTruthy();
    expect(screen.getByText("Adaeze Okonkwo")).toBeTruthy();
    expect(screen.getByText("batches.breakdown")).toBeTruthy();
    expect(screen.getByText("batches.cost_summary")).toBeTruthy();
    expect(screen.getAllByText("₦42,000").length).toBeGreaterThan(0);
    expect(screen.queryByText("batches.done_title")).toBeNull();
  });

  it("shows the all-delivered banner when every parcel is collected", async () => {
    getBatch.mockResolvedValue({...DETAIL, allDelivered: true});
    renderDetail();

    expect(await screen.findByText("batches.done_title")).toBeTruthy();
    expect(screen.getByText("batches.done_sub")).toBeTruthy();
  });

  it("filters shipments to the active stages", async () => {
    getBatch.mockResolvedValue(DETAIL);
    renderDetail();
    await screen.findByText("Adaeze Okonkwo");

    fireEvent.click(screen.getByRole("tab", {name: "batches.filter_active"}));
    expect(screen.getByText("Adaeze Okonkwo")).toBeTruthy(); // in_transit stays
    expect(screen.queryByText("Bola Adeyemi")).toBeNull(); // delivered is hidden
  });

  it("opens the tracking overlay from a row's Track button and closes it", async () => {
    getBatch.mockResolvedValue(DETAIL);
    getShipmentTracking.mockResolvedValue(TRACKING);
    renderDetail();
    await screen.findByText("Adaeze Okonkwo");

    fireEvent.click(screen.getAllByRole("button", {name: "batches.track"})[0]);
    expect(await screen.findByRole("dialog")).toBeTruthy();
    expect(screen.getByText("Courier is on the way to the destination locker")).toBeTruthy();
    expect(screen.getByText("Parcel dropped off at origin locker")).toBeTruthy();
    expect(screen.getByText("batches.shipment_details")).toBeTruthy();

    fireEvent.click(screen.getAllByRole("button", {name: "batches.track_close"})[0]);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
