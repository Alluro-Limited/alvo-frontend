import {describe, expect, it} from "vite-plus/test";
import {mockAdminsService} from "../mock-admins-service";

const LIST_PARAMS = {page: 1};

describe("mockAdminsService", () => {
  it("returns seeded rows, metrics, filters, and role options", async () => {
    const res = await mockAdminsService.getAdmins(LIST_PARAMS);
    expect(res.admins.items.length).toBeGreaterThan(0);
    expect(res.metrics.total).toBe(12);
    expect(res.metrics.active + res.metrics.suspended + res.metrics.invited).toBe(res.metrics.total);
    expect(res.filters.statuses).toEqual(["active", "suspended", "invited"]);
    expect(res.roles).toHaveLength(5);
  });

  it("filters by query, status, and role", async () => {
    const {admins} = await mockAdminsService.getAdmins(LIST_PARAMS);
    const first = admins.items[0];
    const byName = await mockAdminsService.getAdmins({...LIST_PARAMS, query: first.name.slice(0, 4)});
    expect(byName.admins.items.some((row) => row.id === first.id)).toBe(true);
    const byStatus = await mockAdminsService.getAdmins({...LIST_PARAMS, status: "suspended"});
    expect(byStatus.admins.items.every((row) => row.status === "suspended")).toBe(true);
    const byRole = await mockAdminsService.getAdmins({...LIST_PARAMS, role: first.role});
    expect(byRole.admins.items.every((row) => row.role === first.role)).toBe(true);
  });

  it("paginates with a 10-row page size", async () => {
    const page1 = await mockAdminsService.getAdmins({page: 1});
    const page2 = await mockAdminsService.getAdmins({page: 2});
    expect(page1.admins.items).toHaveLength(10);
    expect(page2.admins.items).toHaveLength(2);
    expect(page1.admins.items[0].id).not.toBe(page2.admins.items[0]?.id);
  });

  it("serves the permission catalog with presets for every role", async () => {
    const catalog = await mockAdminsService.getPermissionCatalog();
    expect(catalog.modules.length).toBeGreaterThanOrEqual(10);
    for (const preset of Object.values(catalog.presets)) {
      expect(preset.length).toBeGreaterThan(0);
    }
  });

  it("invites an admin who lands at the top with the invited status", async () => {
    const detail = await mockAdminsService.inviteAdmin({
      firstName: "Test",
      lastName: "Admin",
      email: "test@alvo.ng",
      role: "viewer",
      permissions: ["home.overview"],
    });
    expect(detail.status).toBe("invited");
    expect(detail.name).toBe("Test Admin");
    const {admins} = await mockAdminsService.getAdmins(LIST_PARAMS);
    expect(admins.items[0].id).toBe(detail.id);
    expect(admins.items[0].status).toBe("invited");
    // Restore: keep the store consistent for later tests.
    await mockAdminsService.deleteAdmin(detail.id);
  });

  it("suspends then reactivates an admin", async () => {
    const {admins} = await mockAdminsService.getAdmins(LIST_PARAMS);
    const target = admins.items.find((row) => row.status === "active");
    expect(target).toBeTruthy();
    const suspended = await mockAdminsService.suspendAdmin(target!.id);
    expect(suspended.status).toBe("suspended");
    const reactivated = await mockAdminsService.reactivateAdmin(target!.id);
    expect(reactivated.status).toBe("active");
  });

  it("updates account info and permissions on the detail", async () => {
    const {admins} = await mockAdminsService.getAdmins(LIST_PARAMS);
    const target = admins.items[1];
    const updated = await mockAdminsService.updateAdmin(target.id, {
      firstName: "Edited",
      lastName: "Name",
      email: "edited@alvo.ng",
      role: "viewer",
      permissions: ["home.overview"],
    });
    expect(updated.name).toBe("Edited Name");
    expect(updated.role).toBe("viewer");
    expect(updated.permissions).toEqual(["home.overview"]);
    const again = await mockAdminsService.getAdminDetail(target.id);
    expect(again.email).toBe("edited@alvo.ng");
  });

  it("deletes an admin so it disappears from the list", async () => {
    const detail = await mockAdminsService.inviteAdmin({
      firstName: "Gone",
      lastName: "Soon",
      email: "gone@alvo.ng",
      role: "viewer",
      permissions: [],
    });
    await mockAdminsService.deleteAdmin(detail.id);
    const {admins} = await mockAdminsService.getAdmins({...LIST_PARAMS, query: "gone@alvo.ng"});
    expect(admins.items).toHaveLength(0);
  });

  it("throws a 404 for an unknown admin id", async () => {
    await expect(mockAdminsService.getAdminDetail("ADM-999")).rejects.toThrow();
  });
});
