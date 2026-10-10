import {HTTPError} from "ky";
import {describe, expect, it} from "vite-plus/test";
import {mockNodesService} from "../mock-nodes-service";
import {MOCK_NODE_PAGE_SIZE, nodeRowsStore} from "../mock-nodes-data";

const params = {page: 1};

describe("mockNodesService", () => {
  it("returns metrics, the first page of nodes, and status filter options", async () => {
    const data = await mockNodesService.getNodes(params);

    expect(data.metrics.total).toBeGreaterThanOrEqual(nodeRowsStore.length);
    expect(data.nodes.items).toHaveLength(Math.min(MOCK_NODE_PAGE_SIZE, nodeRowsStore.length));
    expect(data.nodes.pageSize).toBe(MOCK_NODE_PAGE_SIZE);
    expect(data.filters.statuses).toContain("online");
    expect(data.filters.statuses).toContain("decommissioned");
  });

  it("filters rows by status and search text", async () => {
    const byStatus = await mockNodesService.getNodes({...params, status: "offline"});
    expect(byStatus.nodes.items.every((row) => row.status === "offline")).toBe(true);

    const byQuery = await mockNodesService.getNodes({...params, query: "ND-10076"});
    expect(byQuery.nodes.items.map((row) => row.id)).toEqual(["ND-10076"]);
  });

  it("paginates the filtered list", async () => {
    const pageOne = await mockNodesService.getNodes(params);
    const pageTwo = await mockNodesService.getNodes({page: 2});
    expect(pageOne.nodes.items[0].id).not.toBe(pageTwo.nodes.items[0].id);
    expect(pageTwo.nodes.page).toBe(2);
  });

  it("returns a detail payload with capacity, sensors, contents, and status options", async () => {
    const detail = await mockNodesService.getNodeDetail("ND-10076");
    expect(detail.name).toBeTruthy();
    expect(detail.compartments.length).toBeGreaterThan(0);
    expect(detail.sensors).toHaveLength(4);
    expect(detail.statusOptions.length).toBeGreaterThan(0);
  });

  it("returns 404 for an unknown node id", async () => {
    await expect(mockNodesService.getNodeDetail("ND-00000")).rejects.toBeInstanceOf(HTTPError);
    await expect(mockNodesService.getNodeDetail("ND-00000")).rejects.toMatchObject({response: {status: 404}});
  });

  it("registers a node as offline with no connectivity, visible in the list", async () => {
    const row = await mockNodesService.registerNode({
      name: "Surulere Node",
      partner: "Surulere Mall",
      region: "Lagos Mainland",
      zone: "Surulere",
      address: "12 Bode Thomas",
      latitude: 6.5,
      longitude: 3.35,
      capacity: {small: 8, medium: 8, large: 8, dropoffKg: 1200},
    });

    expect(row.status).toBe("offline");
    expect(row.connectivity).toBe("no_signal");
    expect(row.capacity).toEqual({used: 0, total: 24});

    const list = await mockNodesService.getNodes({...params, query: row.id});
    expect(list.nodes.items.map((item) => item.id)).toContain(row.id);
  });

  it("changes a node status and reflects it in list and detail", async () => {
    const result = await mockNodesService.changeNodeStatus("ND-10076", {status: "maintenance", reason: "scheduled_service"});
    expect(result).toEqual({id: "ND-10076", status: "maintenance"});

    const detail = await mockNodesService.getNodeDetail("ND-10076");
    expect(detail.status).toBe("maintenance");
    expect(detail.statusOptions.some((option) => option.status === "online")).toBe(true);

    const list = await mockNodesService.getNodes({...params, query: "ND-10076"});
    expect(list.nodes.items[0].status).toBe("maintenance");

    await mockNodesService.changeNodeStatus("ND-10076", {status: "online", reason: "resolved"});
  });
});
