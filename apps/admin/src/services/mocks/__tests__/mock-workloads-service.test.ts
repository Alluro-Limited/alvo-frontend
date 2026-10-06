import {HTTPError} from "ky";
import {beforeEach, describe, expect, it} from "vite-plus/test";
import {flagStore, mockWorkloadsService} from "../mock-workloads-service";
import {MOCK_PAGE_SIZE, PARCEL_ROWS} from "../mock-workloads-data";

const params = {tab: "single" as const, page: 1};

describe("mockWorkloadsService", () => {
  beforeEach(() => {
    flagStore.clear();
  });

  it("returns metrics, the first page of parcels, and filter options", async () => {
    const data = await mockWorkloadsService.getWorkloads(params);

    expect(data.metrics.ongoing).toBeGreaterThan(0);
    expect(data.parcels.items).toHaveLength(Math.min(MOCK_PAGE_SIZE, PARCEL_ROWS.length));
    expect(data.parcels.total).toBeGreaterThan(PARCEL_ROWS.length);
    expect(data.filters.statuses).toContain("in_transit");
    expect(data.filters.nodes.length).toBeGreaterThan(0);
  });

  it("filters rows by status, node, and search text", async () => {
    const byStatus = await mockWorkloadsService.getWorkloads({...params, status: "failed"});
    expect(byStatus.parcels.items.every((row) => row.status === "failed")).toBe(true);

    const byNode = await mockWorkloadsService.getWorkloads({...params, nodeId: "VI-007"});
    expect(byNode.parcels.items.every((row) => row.destinationNodeId === "VI-007")).toBe(true);

    const byQuery = await mockWorkloadsService.getWorkloads({...params, query: "PRV-88183"});
    expect(byQuery.parcels.items.map((row) => row.id)).toEqual(["PRV-88183"]);
  });

  it("returns an empty page for tabs that have no states yet", async () => {
    const data = await mockWorkloadsService.getWorkloads({tab: "batches", page: 1});
    expect(data.parcels.items).toHaveLength(0);
    expect(data.parcels.total).toBe(0);
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
    expect(list.parcels.items[0].flagged).toBe(true);
    expect(list.metrics.flagged).toBeGreaterThanOrEqual(1);

    const csv = await mockWorkloadsService.exportParcels({...params, ids: ["PRV-88183"]});
    expect(csv).toContain("PRV-88183");
    expect(csv.trim().split("\n").at(-1)?.endsWith("yes")).toBe(true);
  });

  it("limits export rows to the given ids", async () => {
    const csv = await mockWorkloadsService.exportParcels({...params, ids: ["PRV-88201", "PRV-88202"]});
    const lines = csv.trim().split("\n");
    expect(lines).toHaveLength(3);
    expect(lines[0]).toContain("parcel_id");
  });
});
