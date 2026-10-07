import {describe, expect, it, vi} from "vite-plus/test";
import {mockSmesService} from "../mock-smes-service";

vi.mock("../mock-http", async (importOriginal) => {
  const original = await importOriginal<typeof import("../mock-http")>();
  return {...original, mockDelay: () => Promise.resolve()};
});

describe("mockSmesService", () => {
  describe("getSmes", () => {
    it("returns the first page with metrics, filters and reason options", async () => {
      const response = await mockSmesService.getSmes({page: 1});
      expect(response.smes.items).toHaveLength(10);
      expect(response.smes.page).toBe(1);
      expect(response.smes.total).toBe(343);
      expect(response.metrics.total).toBe(343);
      expect(response.metrics.suspended).toBeGreaterThan(0);
      expect(response.metrics.flagged).toBeGreaterThan(0);
      expect(response.filters.statuses).toEqual(["active", "flagged", "suspended"]);
      expect(response.filters.verifications).toEqual(["verified", "partial", "unverified"]);
      expect(response.suspendReasons).toContain("fraudulent_bulk_uploads");
      expect(response.deactivateReasons).toContain("customer_decision");
      expect(response.businessTypes).toContain("E-commerce");
    });

    it("filters by status, verification and free-text query", async () => {
      const byStatus = await mockSmesService.getSmes({page: 1, status: "suspended"});
      expect(byStatus.smes.items.every((row) => row.status === "suspended")).toBe(true);
      expect(byStatus.smes.total).toBeLessThan(343);

      const byVerification = await mockSmesService.getSmes({page: 1, verification: "partial"});
      expect(byVerification.smes.items.every((row) => row.verification === "partial")).toBe(true);

      const byQuery = await mockSmesService.getSmes({page: 1, query: "emmaj"});
      expect(byQuery.smes.items).toHaveLength(1);
      expect(byQuery.smes.items[0].businessName).toBe("Emmaj Textile");
    });

    it("paginates deterministically", async () => {
      const first = await mockSmesService.getSmes({page: 1});
      const second = await mockSmesService.getSmes({page: 2});
      const ids = new Set(first.smes.items.map((row) => row.id));
      expect(second.smes.items.every((row) => !ids.has(row.id))).toBe(true);
    });
  });

  describe("getSmeDetail", () => {
    it("builds the drawer payload with contact info, wallet and verification items", async () => {
      const detail = await mockSmesService.getSmeDetail("PRV-1002");
      expect(detail.businessName).toBe("Zuri Commerce Ltd");
      expect(detail.ref).toMatch(/^SME-\d{3}$/);
      expect(detail.contactName).toBeTruthy();
      expect(detail.cacNumber).toMatch(/^RC-/);
      expect(detail.walletBalanceKobo).toBeGreaterThan(0);
      expect(detail.verificationItems.map((item) => item.key)).toEqual(["cac_certificate", "public_search"]);
      expect(detail.batches.length).toBeGreaterThan(0);
    });

    it("renders the batches empty state for unverified or suspended accounts", async () => {
      const suspended = await mockSmesService.getSmeDetail("PRV-0357");
      expect(suspended.batches).toHaveLength(0);
      expect(suspended.suspension).not.toBeNull();
    });
  });

  describe("approveVerificationItem", () => {
    it("marks the item approved and returns a fresh detail payload", async () => {
      const detail = await mockSmesService.getSmeDetail("PRV-0357");
      const target = detail.verificationItems.find((item) => item.status === "submitted");
      expect(target).toBeTruthy();

      const updated = await mockSmesService.approveVerificationItem("PRV-0357", target!.key);
      expect(updated.verificationItems.find((item) => item.key === target!.key)?.status).toBe("approved");
    });
  });

  describe("mutations", () => {
    it("suspend then unsuspend round-trips the row status", async () => {
      const suspended = await mockSmesService.suspendSme("PRV-9103", {reason: "policy_violations", notes: "test"});
      expect(suspended.status).toBe("suspended");
      const detail = await mockSmesService.getSmeDetail("PRV-9103");
      expect(detail.status).toBe("suspended");
      expect(detail.suspension?.reason).toBe("policy_violations");

      const reinstated = await mockSmesService.unsuspendSme("PRV-9103", {});
      expect(reinstated.status).toBe("active");
      expect((await mockSmesService.getSmeDetail("PRV-9103")).suspension).toBeNull();
    });

    it("flags accounts in bulk", async () => {
      const result = await mockSmesService.flagSmes({ids: ["PRV-9018"], reason: "other"});
      expect(result.status).toBe("flagged");
      const detail = await mockSmesService.getSmeDetail("PRV-9018");
      expect(detail.status).toBe("flagged");
      expect(detail.flag?.reason).toBe("other");
    });

    it("updates editable fields on both the detail and the list row", async () => {
      await mockSmesService.updateSme("PRV-6589", {businessName: "Lagos Green Energy HQ", contactName: "Test Person"});
      const detail = await mockSmesService.getSmeDetail("PRV-6589");
      expect(detail.businessName).toBe("Lagos Green Energy HQ");
      expect(detail.contactName).toBe("Test Person");
      const list = await mockSmesService.getSmes({page: 1, query: "Green Energy HQ"});
      expect(list.smes.items.some((row) => row.businessName === "Lagos Green Energy HQ")).toBe(true);
    });

    it("deactivates an account so it stops appearing", async () => {
      await mockSmesService.deactivateSme("PRV-7492", {reason: "customer_decision"});
      await expect(mockSmesService.getSmeDetail("PRV-7492")).rejects.toBeTruthy();
      const list = await mockSmesService.getSmes({page: 1, query: "LagosTech"});
      expect(list.smes.items).toHaveLength(0);
    });
  });

  describe("exportSmes", () => {
    it("returns CSV for the filtered set or selected ids", async () => {
      const csv = await mockSmesService.exportSmes({ids: ["PRV-9103", "PRV-9018"]});
      const lines = csv.split("\n");
      expect(lines[0]).toContain("business_name");
      expect(lines).toHaveLength(3);
      expect(csv).toContain("Emmaj Textile");
    });
  });
});
