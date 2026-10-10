import {describe, expect, it, vi} from "vite-plus/test";
import {mockCouriersService} from "../mock-couriers-service";

vi.mock("../mock-http", async (importOriginal) => {
  const original = await importOriginal<typeof import("../mock-http")>();
  return {...original, mockDelay: () => Promise.resolve()};
});

describe("mockCouriersService", () => {
  describe("getCouriers", () => {
    it("returns the first page with metrics, filters and reason options", async () => {
      const response = await mockCouriersService.getCouriers({page: 1});
      expect(response.couriers.items).toHaveLength(10);
      expect(response.couriers.page).toBe(1);
      expect(response.couriers.total).toBe(343);
      expect(response.metrics.total).toBe(343);
      expect(response.metrics.flagged).toBeGreaterThan(0);
      expect(response.metrics.suspended).toBeGreaterThan(0);
      expect(response.metrics.pendingVerify).toBeGreaterThan(0);
      expect(response.filters.statuses).toEqual(["active", "flagged", "suspended"]);
      expect(response.filters.verifications).toEqual(["verified", "pending"]);
      expect(response.filters.vehicles).toEqual(["bicycle", "car", "motorcycle", "van"]);
      expect(response.suspendReasons).toContain("gps_tampering");
      expect(response.deleteReasons).toContain("account_closed");
    });

    it("filters by status, verification, vehicle and free-text query", async () => {
      const byStatus = await mockCouriersService.getCouriers({page: 1, status: "suspended"});
      expect(byStatus.couriers.items.every((row) => row.status === "suspended")).toBe(true);
      expect(byStatus.couriers.total).toBeLessThan(343);

      const byVerification = await mockCouriersService.getCouriers({page: 1, verification: "pending"});
      expect(byVerification.couriers.items.every((row) => row.verification === "pending")).toBe(true);
      expect(byVerification.couriers.items.every((row) => row.successRate === null)).toBe(true);

      const byVehicle = await mockCouriersService.getCouriers({page: 1, vehicle: "van"});
      expect(byVehicle.couriers.items.every((row) => row.vehicle === "van")).toBe(true);

      const byQuery = await mockCouriersService.getCouriers({page: 1, query: "priscilla"});
      expect(byQuery.couriers.items).toHaveLength(1);
      expect(byQuery.couriers.items[0].name).toBe("Priscilla Awolowo");
    });

    it("paginates deterministically", async () => {
      const first = await mockCouriersService.getCouriers({page: 1});
      const second = await mockCouriersService.getCouriers({page: 2});
      const ids = new Set(first.couriers.items.map((row) => row.id));
      expect(second.couriers.items.every((row) => !ids.has(row.id))).toBe(true);
    });
  });

  describe("getCourierTracking", () => {
    it("returns active-assignment tracks matching the on-assignment metric", async () => {
      const list = await mockCouriersService.getCouriers({page: 1});
      const {tracks, filters} = await mockCouriersService.getCourierTracking({});

      expect(tracks).toHaveLength(list.metrics.onAssignment);
      expect(filters.statuses).toContain("in_transit");
      expect(filters.types).toContain("bulk");
      expect(
        tracks.every(
          (track) =>
            track.batchId.startsWith("B-") && track.items > 0 && track.routePath.length >= 2 && track.etaMinutes > 0 && track.rating > 0
        )
      ).toBe(true);
    });

    it("tracks only ride for active verified couriers", async () => {
      const {tracks} = await mockCouriersService.getCourierTracking({});
      for (const track of tracks) {
        const detail = await mockCouriersService.getCourierDetail(track.courierId);
        expect(detail.status).toBe("active");
        expect(detail.verification).toBe("verified");
      }
    });

    it("filters by status, type and query", async () => {
      const all = await mockCouriersService.getCourierTracking({});
      const delayed = await mockCouriersService.getCourierTracking({status: "delayed"});
      expect(delayed.tracks.every((track) => track.status === "delayed")).toBe(true);

      const first = all.tracks[0];
      const typed = await mockCouriersService.getCourierTracking({type: first.type});
      expect(typed.tracks.every((track) => track.type === first.type)).toBe(true);
      expect(typed.tracks.length).toBeGreaterThan(0);

      const searched = await mockCouriersService.getCourierTracking({query: first.name.split(" ")[0]});
      expect(searched.tracks.some((track) => track.courierId === first.courierId)).toBe(true);
    });

    it("drops tracks when the courier is suspended", async () => {
      const before = await mockCouriersService.getCourierTracking({});
      const target = before.tracks[0];
      await mockCouriersService.suspendCourier(target.courierId, {reason: "fraud"});
      const after = await mockCouriersService.getCourierTracking({});
      expect(after.tracks.some((track) => track.courierId === target.courierId)).toBe(false);
      await mockCouriersService.unsuspendCourier(target.courierId, {});
    });
  });

  describe("getCourierDetail", () => {
    it("builds the drawer payload with info fields, verification items and performance", async () => {
      const detail = await mockCouriersService.getCourierDetail("PRG-0299");
      expect(detail.name).toBe("Priscilla Awolowo");
      expect(detail.email).toContain("@gmail.com");
      expect(detail.nin).toBeTruthy();
      expect(detail.plateNumber).toBeTruthy();
      expect(detail.verificationItems.map((item) => item.key)).toEqual([
        "phone_email",
        "id_account",
        "drivers_licence",
        "vehicle_photo",
        "background_check",
      ]);
      expect(detail.verificationItems.every((item) => item.status === "approved")).toBe(true);
      expect(detail.performance.totalDeliveries).toBeGreaterThan(0);
    });

    it("renders submitted items and zero deliveries for pending couriers", async () => {
      const detail = await mockCouriersService.getCourierDetail("PRG-0165");
      expect(detail.verification).toBe("pending");
      expect(detail.verificationItems.every((item) => item.status === "submitted")).toBe(true);
      expect(detail.verificationItems.find((item) => item.key === "drivers_licence")?.fileName).toBe("licence_hannah.jpg");
      expect(detail.performance.totalDeliveries).toBe(0);
    });
  });

  describe("getCourierAssignments", () => {
    it("paginates and filters the assignment history", async () => {
      const first = await mockCouriersService.getCourierAssignments("PRG-0299", {page: 1});
      expect(first.items).toHaveLength(7);
      expect(first.total).toBeGreaterThan(7);

      const second = await mockCouriersService.getCourierAssignments("PRG-0299", {page: 2});
      const ids = new Set(first.items.map((row) => row.id));
      expect(second.items.every((row) => !ids.has(row.id))).toBe(true);

      const failed = await mockCouriersService.getCourierAssignments("PRG-0299", {page: 1, status: "failed"});
      expect(failed.items.every((row) => row.status === "failed")).toBe(true);
    });
  });

  describe("approveVerificationItem", () => {
    it("marks the item approved and verifies the courier once every item clears", async () => {
      const pending = await mockCouriersService.getCourierDetail("PRG-0132");
      expect(pending.verification).toBe("pending");

      for (const item of pending.verificationItems) {
        await mockCouriersService.approveVerificationItem("PRG-0132", item.key);
      }
      const detail = await mockCouriersService.getCourierDetail("PRG-0132");
      expect(detail.verification).toBe("verified");
      // The list row flips to verified with a real success rate.
      const list = await mockCouriersService.getCouriers({page: 1, query: "PRG-0132"});
      expect(list.couriers.items[0].verification).toBe("verified");
      expect(list.couriers.items[0].successRate).not.toBeNull();
    });
  });

  describe("mutations", () => {
    it("suspend then unsuspend round-trips the row status", async () => {
      const suspended = await mockCouriersService.suspendCourier("PRG-0228", {reason: "gps_tampering", notes: "test"});
      expect(suspended.status).toBe("suspended");
      const detail = await mockCouriersService.getCourierDetail("PRG-0228");
      expect(detail.status).toBe("suspended");
      expect(detail.suspension?.reason).toBe("gps_tampering");

      const reinstated = await mockCouriersService.unsuspendCourier("PRG-0228", {});
      expect(reinstated.status).toBe("active");
      expect((await mockCouriersService.getCourierDetail("PRG-0228")).suspension).toBeNull();
    });

    it("flags accounts in bulk with a flag record", async () => {
      const result = await mockCouriersService.flagCouriers({ids: ["PRG-0215"], reason: "other"});
      expect(result.status).toBe("flagged");
      const detail = await mockCouriersService.getCourierDetail("PRG-0215");
      expect(detail.status).toBe("flagged");
      expect(detail.flag?.reason).toBe("other");
    });

    it("deletes the courier so the account stops resolving", async () => {
      await mockCouriersService.deleteCourier("PRG-500", {reason: "account_closed"});
      await expect(mockCouriersService.getCourierDetail("PRG-500")).rejects.toBeTruthy();
      const list = await mockCouriersService.getCouriers({page: 1, query: "PRG-500"});
      expect(list.couriers.items).toHaveLength(0);
    });
  });

  describe("exports", () => {
    it("returns CSV for the filtered set or selected ids", async () => {
      const csv = await mockCouriersService.exportCouriers({ids: ["PRG-0299", "PRG-0302"]});
      const lines = csv.split("\n");
      expect(lines[0]).toContain("success_rate");
      expect(lines).toHaveLength(3);
      expect(csv).toContain("Priscilla Awolowo");
    });

    it("exports only the selected assignment rows", async () => {
      const page = await mockCouriersService.getCourierAssignments("PRG-0299", {page: 1});
      const ids = page.items.slice(0, 2).map((row) => row.id);
      const csv = await mockCouriersService.exportCourierAssignments("PRG-0299", {ids});
      const lines = csv.split("\n");
      expect(lines[0]).toContain("dropoff");
      expect(lines).toHaveLength(3);
      expect(csv).toContain(ids[0]);
    });
  });
});
