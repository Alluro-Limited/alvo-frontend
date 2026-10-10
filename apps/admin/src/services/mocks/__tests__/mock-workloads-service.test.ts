import {HTTPError} from "ky";
import {beforeEach, describe, expect, it} from "vite-plus/test";
import {flagStore, mockWorkloadsService} from "../mock-workloads-service";
import {BATCH_PARCEL_ROWS, BATCH_ROWS, MOCK_BATCH_PAGE_SIZE} from "../mock-batches-data";
import {MOCK_SAFE_PAGE_SIZE, SAFE_ITEM_ROWS} from "../mock-safe-data";
import {MOCK_PAGE_SIZE, PARCEL_ROWS} from "../mock-workloads-data";

const params = {tab: "single" as const, page: 1};
const batchParams = {tab: "batches" as const, page: 1};
const safeParams = {tab: "safe" as const, page: 1};

describe("mockWorkloadsService", () => {
  beforeEach(() => {
    flagStore.clear();
  });

  it("returns metrics, the first page of parcels, and filter options", async () => {
    const data = await mockWorkloadsService.getWorkloads(params);

    expect(data.metrics.ongoing).toBeGreaterThan(0);
    expect(data.parcels?.items).toHaveLength(Math.min(MOCK_PAGE_SIZE, PARCEL_ROWS.length));
    expect(data.parcels?.total).toBeGreaterThan(PARCEL_ROWS.length);
    expect(data.filters.statuses).toContain("in_transit");
    expect(data.filters.locations.length).toBeGreaterThan(0);
  });

  it("filters rows by status, location, and search text", async () => {
    const byStatus = await mockWorkloadsService.getWorkloads({...params, status: "failed"});
    expect(byStatus.parcels?.items.every((row) => row.status === "failed")).toBe(true);

    const byNode = await mockWorkloadsService.getWorkloads({...params, location: "VI-007"});
    expect(byNode.parcels?.items.every((row) => row.destinationNodeId === "VI-007")).toBe(true);

    const byQuery = await mockWorkloadsService.getWorkloads({...params, query: "PRV-88183"});
    expect(byQuery.parcels?.items.map((row) => row.id)).toEqual(["PRV-88183"]);
  });

  it("returns 404 detail for an unknown parcel id", async () => {
    await expect(mockWorkloadsService.getParcelDetail("NOPE-000")).rejects.toBeInstanceOf(HTTPError);
    await expect(mockWorkloadsService.getParcelDetail("NOPE-000")).rejects.toMatchObject({response: {status: 404}});
  });

  it("persists flags so list rows, detail and export reflect the mutation", async () => {
    const result = await mockWorkloadsService.flagParcels({ids: ["PRV-88183"], reason: "damaged_item", notes: "box crushed"});
    expect(result).toEqual({flagged: 1});

    const detail = await mockWorkloadsService.getParcelDetail("PRV-88183");
    expect(detail.flag?.reason).toBe("damaged_item");
    expect(detail.flag?.notes).toBe("box crushed");

    const list = await mockWorkloadsService.getWorkloads({...params, query: "PRV-88183"});
    expect(list.parcels?.items[0].flagged).toBe(true);
    expect(list.metrics.flagged).toBeGreaterThanOrEqual(1);

    const csv = await mockWorkloadsService.exportList({...params, ids: ["PRV-88183"]});
    expect(csv).toContain("PRV-88183");
    expect(csv.trim().split("\n").at(-1)?.endsWith("yes")).toBe(true);
  });

  it("limits export rows to the given ids", async () => {
    const csv = await mockWorkloadsService.exportList({...params, ids: ["PRV-88201", "PRV-88202"]});
    const lines = csv.trim().split("\n");
    expect(lines).toHaveLength(3);
    expect(lines[0]).toContain("parcel_id");
  });
});

describe("mockWorkloadsService — batches", () => {
  beforeEach(() => {
    flagStore.clear();
  });

  it("returns batch cards, batch metrics, and tag filter options", async () => {
    const data = await mockWorkloadsService.getWorkloads(batchParams);

    expect(data.metrics.active).toBeGreaterThan(0);
    expect(data.batches?.items).toHaveLength(Math.min(MOCK_BATCH_PAGE_SIZE, BATCH_ROWS.length));
    expect(data.batches?.items[0].sme).toBeTruthy();
    expect(data.filters.statuses).toContain("active");
    expect(data.parcels).toBeUndefined();
  });

  it("filters batches by tag, city, and search text", async () => {
    const byTag = await mockWorkloadsService.getWorkloads({...batchParams, status: "stalled"});
    expect(byTag.batches?.items.every((row) => row.tags.includes("stalled"))).toBe(true);

    const byCity = await mockWorkloadsService.getWorkloads({...batchParams, location: "lekki"});
    expect(byCity.batches?.items.every((row) => row.city === "Lekki")).toBe(true);

    const byQuery = await mockWorkloadsService.getWorkloads({...batchParams, query: "kuda"});
    expect(byQuery.batches?.items.every((row) => row.sme === "Kuda Bank")).toBe(true);
  });

  it("returns batch detail with metrics and parcel filter options", async () => {
    const detail = await mockWorkloadsService.getBatchDetail("BTC-2301");

    expect(detail.id).toBe("BTC-2301");
    expect(detail.metrics.total).toBe(detail.parcelCount);
    expect(detail.filters.statuses).toContain("in_transit");
    await expect(mockWorkloadsService.getBatchDetail("BTC-0000")).rejects.toMatchObject({response: {status: 404}});
  });

  it("returns paginated, filterable parcels for a batch", async () => {
    const page = await mockWorkloadsService.getBatchParcels("BTC-2301", {tab: "batches", page: 1});
    expect(page.items.length).toBeGreaterThan(0);
    expect(page.total).toBe(BATCH_PARCEL_ROWS.length);

    const filtered = await mockWorkloadsService.getBatchParcels("BTC-2301", {tab: "batches", page: 1, status: "failed"});
    expect(filtered.items.every((row) => row.status === "failed")).toBe(true);

    await expect(mockWorkloadsService.getBatchParcels("BTC-0000", {tab: "batches", page: 1})).rejects.toMatchObject({
      response: {status: 404},
    });
  });

  it("gives batch parcels two route timelines in their detail", async () => {
    const detail = await mockWorkloadsService.getParcelDetail(BATCH_PARCEL_ROWS[0].id);
    expect(detail.routes).toHaveLength(2);
    expect(detail.routes[0].label).toBe("1st Route Timeline");
  });

  it("flagging a batch parcel shows up in the batch list metrics and parcel rows", async () => {
    const id = BATCH_PARCEL_ROWS[0].id;
    await mockWorkloadsService.flagParcels({ids: [id], reason: "suspicious_activity"});

    const parcels = await mockWorkloadsService.getBatchParcels("BTC-2301", {tab: "batches", page: 1});
    expect(parcels.items.find((row) => row.id === id)?.flagged).toBe(true);

    const detail = await mockWorkloadsService.getParcelDetail(id);
    expect(detail.flag?.reason).toBe("suspicious_activity");
  });

  it("exports batches and batch-scoped parcels as CSV", async () => {
    const batchCsv = await mockWorkloadsService.exportList(batchParams);
    expect(batchCsv.split("\n")[0]).toContain("batch_id");
    expect(batchCsv).toContain("BTC-2301");

    const parcelCsv = await mockWorkloadsService.exportList({tab: "batches", page: 1, batchId: "BTC-2301"});
    expect(parcelCsv.split("\n")[0]).toContain("parcel_id");
  });
});

describe("mockWorkloadsService — safe", () => {
  beforeEach(() => {
    flagStore.clear();
  });

  it("returns safe items, safe metrics, and status filter options", async () => {
    const data = await mockWorkloadsService.getWorkloads(safeParams);

    expect(data.metrics.active).toBeGreaterThan(0);
    expect(data.safeItems?.items).toHaveLength(Math.min(MOCK_SAFE_PAGE_SIZE, SAFE_ITEM_ROWS.length));
    expect(data.safeItems?.total).toBe(SAFE_ITEM_ROWS.length);
    expect(data.filters.statuses).toContain("expiring_soon");
    expect(data.parcels).toBeUndefined();
    expect(data.batches).toBeUndefined();
  });

  it("filters safe items by status and by id/owner search", async () => {
    const byStatus = await mockWorkloadsService.getWorkloads({...safeParams, status: "expired"});
    expect(byStatus.safeItems?.items.every((row) => row.status === "expired")).toBe(true);
    expect(byStatus.safeItems?.items.length).toBeGreaterThan(0);

    const byId = await mockWorkloadsService.getWorkloads({...safeParams, query: "sfe-10083"});
    expect(byId.safeItems?.items.map((row) => row.id)).toEqual(["SFE-10083"]);

    const byOwner = await mockWorkloadsService.getWorkloads({...safeParams, query: "olanrewaju"});
    expect(byOwner.safeItems?.items.map((row) => row.id)).toEqual(["SFE-10083"]);
  });

  it("returns item detail with info fields and a storage timeline", async () => {
    const detail = await mockWorkloadsService.getSafeItemDetail("SFE-10083");

    expect(detail.owner).toBe("Olanrewaju Quadri");
    expect(detail.item).toBeTruthy();
    expect(detail.timeline[0].key).toBe("book_safe");
    expect(detail.timeline.map((step) => step.key)).toContain("period_extended");

    await expect(mockWorkloadsService.getSafeItemDetail("SFE-00000")).rejects.toMatchObject({response: {status: 404}});
  });

  it("flagging a safe item marks its row and detail", async () => {
    await mockWorkloadsService.flagParcels({ids: ["SFE-10100"], reason: "other", notes: "seal broken"});

    const list = await mockWorkloadsService.getWorkloads({...safeParams, query: "SFE-10100"});
    expect(list.safeItems?.items[0].flagged).toBe(true);

    const detail = await mockWorkloadsService.getSafeItemDetail("SFE-10100");
    expect(detail.flag?.reason).toBe("other");
    expect(detail.flag?.notes).toBe("seal broken");
  });

  it("exports safe items as CSV honoring filters", async () => {
    const csv = await mockWorkloadsService.exportList(safeParams);
    expect(csv.split("\n")[0]).toContain("item_id");
    expect(csv).toContain("SFE-10083");

    const filtered = await mockWorkloadsService.exportList({...safeParams, status: "retrieved"});
    const lines = filtered.trim().split("\n");
    expect(lines.length).toBeGreaterThan(1);
    expect(lines.slice(1).every((line) => line.includes(",retrieved,"))).toBe(true);
  });
});
