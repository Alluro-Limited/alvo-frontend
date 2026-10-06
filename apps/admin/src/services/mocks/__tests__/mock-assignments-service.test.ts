import {describe, expect, it, vi} from "vite-plus/test";
import {mockAssignmentsService} from "../mock-assignments-service";

vi.mock("../mock-http", async (importOriginal) => {
  const original = await importOriginal<typeof import("../mock-http")>();
  return {...original, mockDelay: () => Promise.resolve()};
});

describe("mockAssignmentsService", () => {
  describe("getAssignments", () => {
    it("returns the first page with metrics and filter options", async () => {
      const response = await mockAssignmentsService.getAssignments({page: 1});
      expect(response.assignments.items).toHaveLength(10);
      expect(response.assignments.page).toBe(1);
      expect(response.assignments.pageSize).toBe(10);
      expect(response.assignments.total).toBe(343);
      expect(response.metrics.active).toBeGreaterThan(0);
      expect(response.filters.statuses).toContain("public_pool");
      expect(response.filters.types).toEqual(["bulk", "node", "express"]);
    });

    it("filters by status, type, and free-text query", async () => {
      const byStatus = await mockAssignmentsService.getAssignments({page: 1, status: "public_pool"});
      expect(byStatus.assignments.items.every((row) => row.status === "public_pool")).toBe(true);

      const byType = await mockAssignmentsService.getAssignments({page: 1, type: "express"});
      expect(byType.assignments.items.every((row) => row.type === "express")).toBe(true);

      const byQuery = await mockAssignmentsService.getAssignments({page: 1, query: "ASN-1089"});
      expect(byQuery.assignments.items).toHaveLength(1);
      expect(byQuery.assignments.items[0].id).toBe("ASN-1089");

      const byCourier = await mockAssignmentsService.getAssignments({page: 1, query: "adebayo"});
      expect(byCourier.assignments.items.some((row) => row.courier?.name === "Adebayo Kalu")).toBe(true);
    });

    it("paginates deterministically", async () => {
      const first = await mockAssignmentsService.getAssignments({page: 1});
      const second = await mockAssignmentsService.getAssignments({page: 2});
      const ids = new Set(first.assignments.items.map((row) => row.id));
      expect(second.assignments.items.every((row) => !ids.has(row.id))).toBe(true);
    });
  });

  describe("getAssignmentMap", () => {
    it("returns every matching row unpaginated", async () => {
      const rows = await mockAssignmentsService.getAssignmentMap({});
      expect(rows.length).toBe(343);
      expect(rows.every((row) => row.position.length === 2)).toBe(true);
    });

    it("applies the same filters as the list", async () => {
      const actives = await mockAssignmentsService.getAssignmentMap({status: "active", type: "bulk"});
      expect(actives.length).toBeGreaterThan(0);
      expect(actives.every((row) => row.status === "active" && row.type === "bulk")).toBe(true);

      const byCourierCode = await mockAssignmentsService.getAssignmentMap({query: "PRG-274"});
      expect(byCourierCode.some((row) => row.courier?.code === "PRG-274")).toBe(true);

      const empty = await mockAssignmentsService.getAssignmentMap({query: "no-such-assignment"});
      expect(empty).toHaveLength(0);
    });
  });

  describe("getAssignmentDetail", () => {
    it("builds the drawer payload with type-specific item status order", async () => {
      const bulk = await mockAssignmentsService.getAssignmentDetail("ASN-4401");
      expect(bulk.itemStatusOrder).toEqual(["waiting", "picked_up", "en_route", "at_super_node"]);
      expect(bulk.assignmentItems).toHaveLength(24);
      expect(bulk.courier?.name).toBe("Adebayo Kalu");
      expect(bulk.progress).toBe(65);

      const node = await mockAssignmentsService.getAssignmentDetail("ASN-0382");
      expect(node.itemStatusOrder).toContain("delivered");
    });

    it("exposes declined couriers for public-pool assignments", async () => {
      const detail = await mockAssignmentsService.getAssignmentDetail("ASN-1089");
      expect(detail.status).toBe("public_pool");
      expect(detail.declinedBy).toEqual(["ADK-09", "ADK-12"]);
      expect(detail.courier).toBeNull();
    });

    it("rejects unknown ids", async () => {
      await expect(mockAssignmentsService.getAssignmentDetail("ASN-9999")).rejects.toMatchObject({response: {status: 404}});
    });
  });

  describe("manual assignment", () => {
    it("only offers pending, public-pool, and failed assignments", async () => {
      const assignable = await mockAssignmentsService.getAssignable();
      expect(assignable.length).toBeGreaterThan(0);
      expect(assignable.every((a) => ["pending_pickup", "public_pool", "failed"].includes(a.status))).toBe(true);
    });

    it("searches idle couriers by name or code", async () => {
      const all = await mockAssignmentsService.getIdleCouriers();
      expect(all.length).toBeGreaterThan(0);
      const matches = await mockAssignmentsService.getIdleCouriers("firdausi");
      expect(matches).toHaveLength(1);
      expect(matches[0].code).toBe("PRG-047");
    });

    it("assigns a courier and moves the row to pending pickup", async () => {
      const result = await mockAssignmentsService.assignCourier({assignmentId: "ASN-1089", courierId: "courier-firdausi"});
      expect(result.courier).toBe("Firdausi Kabiru");

      const detail = await mockAssignmentsService.getAssignmentDetail("ASN-1089");
      expect(detail.status).toBe("pending_pickup");
      expect(detail.courier?.name).toBe("Firdausi Kabiru");

      const list = await mockAssignmentsService.getAssignments({page: 1, query: "ASN-1089"});
      expect(list.assignments.items[0].status).toBe("pending_pickup");
    });
  });

  describe("flagAssignment", () => {
    it("persists the flag reason on the detail", async () => {
      const result = await mockAssignmentsService.flagAssignment("ASN-0382", {reason: "suspicious_activity", notes: "seal broken"});
      expect(result.status).toBe("flagged");

      const detail = await mockAssignmentsService.getAssignmentDetail("ASN-0382");
      expect(detail.status).toBe("flagged");
      expect(detail.flag).toMatchObject({reason: "suspicious_activity", notes: "seal broken"});
      expect(detail.flag?.at).toBeTruthy();
    });
  });
});
