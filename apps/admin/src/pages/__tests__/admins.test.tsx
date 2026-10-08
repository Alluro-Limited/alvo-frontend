import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {adminsService} from "@/services/admins-service";
import {renderRoute} from "@/test/render-route";
import type {AdminDetail, AdminListResponse, AdminRow, PermissionCatalog} from "@/types/admins-types";
import {AdminsPage} from "../admins";

vi.mock("@/services/admins-service", () => ({
  adminsService: {
    getAdmins: vi.fn(),
    getPermissionCatalog: vi.fn(),
    getAdminDetail: vi.fn(),
    inviteAdmin: vi.fn(),
    updateAdmin: vi.fn(),
    suspendAdmin: vi.fn(),
    reactivateAdmin: vi.fn(),
    deleteAdmin: vi.fn(),
  },
}));

const getAdmins = vi.mocked(adminsService.getAdmins);
const getPermissionCatalog = vi.mocked(adminsService.getPermissionCatalog);
const getAdminDetail = vi.mocked(adminsService.getAdminDetail);
const inviteAdmin = vi.mocked(adminsService.inviteAdmin);
const updateAdmin = vi.mocked(adminsService.updateAdmin);
const suspendAdmin = vi.mocked(adminsService.suspendAdmin);

const ROWS: AdminRow[] = [
  {
    id: "ADM-001",
    name: "Dayo Ogunseye",
    email: "dayo@alvo.ng",
    role: "super_admin",
    lastActive: "2 min ago",
    addedAt: "Oct 1, 2025",
    status: "active",
  },
  {
    id: "ADM-002",
    name: "Ada Nwosu",
    email: "ada@alvo.ng",
    role: "finance_admin",
    lastActive: "1 hour ago",
    addedAt: "Oct 3, 2025",
    status: "suspended",
  },
];

const LIST: AdminListResponse = {
  metrics: {total: 12, active: 8, suspended: 2, invited: 2},
  admins: {items: ROWS, page: 1, pageSize: 10, total: 2},
  filters: {statuses: ["active", "suspended", "invited"], roles: ["super_admin", "finance_admin"]},
  roles: [
    {id: "super_admin", label: "Super Admin", hint: "Full platform access."},
    {id: "finance_admin", label: "Finance Admin", hint: "Revenue and payout management."},
    {id: "viewer", label: "Viewer", hint: "Read-only access."},
  ],
};

const DETAIL: AdminDetail = {
  ...ROWS[0],
  firstName: "Dayo",
  lastName: "Ogunseye",
  addedBy: "System",
  moduleAccess: [{key: "finance", label: "Finance", granted: 6, total: 7}],
  roleHint: "Full platform access.",
  permissions: ["home.overview", "revenue.view"],
};

const CATALOG: PermissionCatalog = {
  modules: [
    {
      key: "home",
      label: "Home",
      subtitle: "Dashboard overview",
      icon: "home",
      permissions: [{key: "home.overview", label: "Overview access"}],
    },
    {
      key: "revenue",
      label: "Finance Revenue",
      subtitle: "Platform earnings",
      icon: "revenue",
      permissions: [
        {key: "revenue.view", label: "View revenue data"},
        {key: "revenue.export", label: "Export revenue"},
      ],
    },
  ],
  presets: {
    super_admin: ["home.overview", "revenue.view", "revenue.export"],
    operational_admin: ["home.overview"],
    finance_admin: ["home.overview", "revenue.view"],
    support_admin: ["home.overview"],
    viewer: ["home.overview"],
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  getAdmins.mockResolvedValue(LIST);
  getPermissionCatalog.mockResolvedValue(CATALOG);
  getAdminDetail.mockResolvedValue(DETAIL);
  inviteAdmin.mockResolvedValue(DETAIL);
  updateAdmin.mockResolvedValue(DETAIL);
  suspendAdmin.mockResolvedValue({id: "ADM-001", status: "suspended"});
});

describe("AdminsPage", () => {
  it("renders the metrics, toolbar, and populated table", async () => {
    renderRoute(AdminsPage, "/admins");
    expect(await screen.findByTestId("admins-metrics")).toBeTruthy();
    expect(screen.getByText("Dayo Ogunseye")).toBeTruthy();
    expect(screen.getByText("Ada Nwosu")).toBeTruthy();
    expect(screen.getByText("12")).toBeTruthy();
    expect(screen.getAllByText("admins.status_active").length).toBeGreaterThan(0);
  });

  it("refetches when search, status, and role filters change", async () => {
    renderRoute(AdminsPage, "/admins");
    await screen.findByTestId("admins-metrics");
    fireEvent.change(screen.getByPlaceholderText("admins.search_placeholder"), {target: {value: "dayo"}});
    await waitFor(() => expect(getAdmins).toHaveBeenCalledWith(expect.objectContaining({query: "dayo"})));
    fireEvent.change(screen.getByRole("combobox", {name: "admins.filter_status"}), {target: {value: "suspended"}});
    await waitFor(() => expect(getAdmins).toHaveBeenCalledWith(expect.objectContaining({status: "suspended"})));
    fireEvent.change(screen.getByRole("combobox", {name: "admins.filter_role"}), {target: {value: "viewer"}});
    await waitFor(() => expect(getAdmins).toHaveBeenCalledWith(expect.objectContaining({role: "viewer"})));
  });

  it("shows the empty state when no admins exist", async () => {
    getAdmins.mockResolvedValue({...LIST, admins: {items: [], page: 1, pageSize: 10, total: 0}});
    renderRoute(AdminsPage, "/admins");
    expect(await screen.findByTestId("admins-empty")).toBeTruthy();
  });

  it("shows the filtered-empty state after searching", async () => {
    getAdmins.mockResolvedValue({...LIST, admins: {items: [], page: 1, pageSize: 10, total: 0}});
    renderRoute(AdminsPage, "/admins");
    await screen.findByTestId("admins-metrics");
    fireEvent.change(screen.getByPlaceholderText("admins.search_placeholder"), {target: {value: "zzz"}});
    expect(await screen.findByTestId("admins-filtered-empty")).toBeTruthy();
  });

  it("shows an error card and retries", async () => {
    getAdmins.mockRejectedValueOnce(new Error("boom"));
    renderRoute(AdminsPage, "/admins");
    expect(await screen.findByTestId("admins-error")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "admins.retry"}));
    await waitFor(() => expect(getAdmins).toHaveBeenCalledTimes(2));
  });

  it("opens the invite drawer, applies the role preset, and submits", async () => {
    renderRoute(AdminsPage, "/admins");
    await screen.findByTestId("admins-metrics");
    fireEvent.click(screen.getByRole("button", {name: /admins\.invite$/}));
    expect(await screen.findByText("admins.invite_subtitle")).toBeTruthy();
    await screen.findByText("Home");
    fireEvent.change(screen.getByRole("combobox", {name: "admins.role_label"}), {target: {value: "finance_admin"}});
    fireEvent.change(screen.getByRole("textbox", {name: "admins.first_name"}), {target: {value: "Test"}});
    fireEvent.change(screen.getByRole("textbox", {name: "admins.last_name"}), {target: {value: "Admin"}});
    fireEvent.change(screen.getByRole("textbox", {name: "admins.email"}), {target: {value: "test@alvo.ng"}});
    fireEvent.click(screen.getByRole("button", {name: "admins.invite_submit"}));
    await waitFor(() =>
      expect(inviteAdmin).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: "Test",
          lastName: "Admin",
          role: "finance_admin",
          permissions: ["home.overview", "revenue.view"],
        })
      )
    );
  });

  it("toggles a permission switch in the invite tree", async () => {
    renderRoute(AdminsPage, "/admins");
    await screen.findByTestId("admins-metrics");
    fireEvent.click(screen.getByRole("button", {name: /admins\.invite$/}));
    await screen.findByText("Export revenue");
    const toggle = screen.getByRole("switch", {name: "Finance Revenue — Export revenue"});
    expect(toggle.getAttribute("aria-checked")).not.toBe("true");
    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-checked")).toBe("true");
  });

  it("opens the detail drawer with account details and module access", async () => {
    renderRoute(AdminsPage, "/admins");
    const row = (await screen.findByText("Dayo Ogunseye")).closest("tr")!;
    fireEvent.click(row);
    expect(await screen.findByText("admins.account_details")).toBeTruthy();
    expect(screen.getByText("ADM-001")).toBeTruthy();
    expect(screen.getByText("admins.module_access")).toBeTruthy();
    expect(getAdminDetail).toHaveBeenCalledWith("ADM-001");
  });

  it("runs the suspend confirmation from the drawer menu", async () => {
    renderRoute(AdminsPage, "/admins");
    const row = (await screen.findByText("Dayo Ogunseye")).closest("tr")!;
    fireEvent.click(row);
    await screen.findByText("admins.account_details");
    fireEvent.click(screen.getByRole("button", {name: "admins.menu_aria"}));
    fireEvent.click(await screen.findByText("admins.menu_suspend"));
    expect(await screen.findByText("admins.suspend_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "admins.suspend_confirm"}));
    await waitFor(() => expect(suspendAdmin).toHaveBeenCalledWith("ADM-001"));
  });

  it("opens the edit dialog from the drawer and saves", async () => {
    renderRoute(AdminsPage, "/admins");
    const row = (await screen.findByText("Dayo Ogunseye")).closest("tr")!;
    fireEvent.click(row);
    await screen.findByText("admins.account_details");
    fireEvent.click(screen.getByRole("button", {name: "admins.edit"}));
    expect(await screen.findByText("admins.edit_note")).toBeTruthy();
    fireEvent.change(screen.getByRole("textbox", {name: "admins.first_name"}), {target: {value: "Edited"}});
    fireEvent.click(screen.getByRole("button", {name: "admins.edit_save"}));
    await waitFor(() => expect(updateAdmin).toHaveBeenCalledWith("ADM-001", expect.objectContaining({firstName: "Edited"})));
  });
});
