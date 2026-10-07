import {describe, expect, it, vi} from "vite-plus/test";
import {mockUsersService} from "../mock-users-service";

vi.mock("../mock-http", async (importOriginal) => {
  const original = await importOriginal<typeof import("../mock-http")>();
  return {...original, mockDelay: () => Promise.resolve()};
});

describe("mockUsersService", () => {
  describe("getUsers", () => {
    it("returns the first page with metrics, filters and suspend reasons", async () => {
      const response = await mockUsersService.getUsers({page: 1});
      expect(response.users.items).toHaveLength(10);
      expect(response.users.page).toBe(1);
      expect(response.users.pageSize).toBe(10);
      expect(response.users.total).toBe(3438);
      expect(response.metrics.total).toBe(3438);
      expect(response.metrics.suspended).toBeGreaterThan(0);
      expect(response.metrics.flagged).toBeGreaterThan(0);
      expect(response.filters.statuses).toEqual(["active", "flagged", "suspended"]);
      expect(response.filters.verifications).toEqual(["verified", "partial", "unverified"]);
      expect(response.suspendReasons).toContain("suspicious_activity");
      expect(response.suspendReasons).toContain("other");
    });

    it("filters by status, verification and free-text query", async () => {
      const byStatus = await mockUsersService.getUsers({page: 1, status: "suspended"});
      expect(byStatus.users.items.every((row) => row.status === "suspended")).toBe(true);
      expect(byStatus.users.total).toBeLessThan(3438);

      const byVerification = await mockUsersService.getUsers({page: 1, verification: "partial"});
      expect(byVerification.users.items.every((row) => row.verification === "partial")).toBe(true);

      const byQuery = await mockUsersService.getUsers({page: 1, query: "emakaokonkwo781"});
      expect(byQuery.users.items).toHaveLength(1);
      expect(byQuery.users.items[0].name).toBe("Emeka Okonkwo");

      const byPhone = await mockUsersService.getUsers({page: 1, query: "0801 234 5678"});
      expect(byPhone.users.items.some((row) => row.id === "USR-1002")).toBe(true);
    });

    it("paginates deterministically", async () => {
      const first = await mockUsersService.getUsers({page: 1});
      const second = await mockUsersService.getUsers({page: 2});
      const ids = new Set(first.users.items.map((row) => row.id));
      expect(second.users.items.every((row) => !ids.has(row.id))).toBe(true);
    });
  });

  describe("getUserDetail", () => {
    it("builds the drawer payload with wallet stats and activity", async () => {
      const detail = await mockUsersService.getUserDetail("USR-1002");
      expect(detail.name).toBe("Emeka Okonkwo");
      expect(detail.flag).toBeNull();
      expect(detail.suspension).toBeNull();
      expect(detail.parcelsSent).toBeGreaterThan(0);
      expect(detail.walletBalanceKobo).toBeGreaterThan(0);
      expect(detail.recentActivity.length).toBeGreaterThan(0);
    });

    it("rejects unknown ids", async () => {
      await expect(mockUsersService.getUserDetail("USR-9999")).rejects.toMatchObject({response: {status: 404}});
    });
  });

  describe("getUserParcels", () => {
    it("paginates and filters the parcels modal data", async () => {
      const page = await mockUsersService.getUserParcels("USR-1002", {page: 1});
      expect(page.items).toHaveLength(7);
      expect(page.pageSize).toBe(7);
      expect(page.total).toBe(13);

      const filtered = await mockUsersService.getUserParcels("USR-1002", {page: 1, status: "delivered"});
      expect(filtered.items.every((parcel) => parcel.status === "delivered")).toBe(true);
      expect(filtered.items.length).toBeGreaterThan(0);
    });
  });

  describe("mutations", () => {
    it("suspends and unsuspends a user, updating the row and detail", async () => {
      const suspended = await mockUsersService.suspendUser("USR-9103", {reason: "payment_fraud", notes: "chargeback"});
      expect(suspended.status).toBe("suspended");

      const detail = await mockUsersService.getUserDetail("USR-9103");
      expect(detail.status).toBe("suspended");
      expect(detail.suspension).toMatchObject({reason: "payment_fraud", notes: "chargeback"});
      expect(detail.suspension?.at).toBeTruthy();

      const unsuspended = await mockUsersService.unsuspendUser("USR-9103", {});
      expect(unsuspended.status).toBe("active");
      const restored = await mockUsersService.getUserDetail("USR-9103");
      expect(restored.status).toBe("active");
      expect(restored.suspension).toBeNull();
    });

    it("flags multiple users and records the reason on each detail", async () => {
      const result = await mockUsersService.flagUsers({ids: ["USR-9018", "USR-8205"], reason: "suspicious_activity", notes: "dupes"});
      expect(result.ids).toEqual(["USR-9018", "USR-8205"]);

      for (const id of result.ids) {
        const detail = await mockUsersService.getUserDetail(id);
        expect(detail.status).toBe("flagged");
        expect(detail.flag).toMatchObject({reason: "suspicious_activity", notes: "dupes"});
      }
    });

    it("deletes a user so later lookups 404", async () => {
      await mockUsersService.deleteUser("USR-2640");
      await expect(mockUsersService.getUserDetail("USR-2640")).rejects.toMatchObject({response: {status: 404}});

      const list = await mockUsersService.getUsers({page: 1, query: "USR-2640"});
      expect(list.users.items).toHaveLength(0);
    });

    it("exports CSV scoped to ids or filters", async () => {
      const scoped = await mockUsersService.exportUsers({ids: ["USR-3714"]});
      const lines = scoped.split("\n");
      expect(lines[0]).toBe("id,name,email,phone,verification,joined_at,status");
      expect(lines).toHaveLength(2);
      expect(lines[1]).toContain("USR-3714");

      const filtered = await mockUsersService.exportUsers({verification: "unverified"});
      expect(filtered.split("\n").length).toBeGreaterThan(1);
    });
  });
});
