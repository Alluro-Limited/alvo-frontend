import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {usersService} from "@/services/users-service";
import {renderRoute} from "@/test/render-route";
import type {UserDetail, UserListResponse, UserParcel, UserRow} from "@/types/users-types";
import {UsersPage} from "../users";

vi.mock("@/services/users-service", () => ({
  usersService: {
    getUsers: vi.fn(),
    getUserDetail: vi.fn(),
    getUserParcels: vi.fn(),
    suspendUser: vi.fn(),
    unsuspendUser: vi.fn(),
    flagUsers: vi.fn(),
    deleteUser: vi.fn(),
    exportUsers: vi.fn(),
  },
}));

const getUsers = vi.mocked(usersService.getUsers);
const getUserDetail = vi.mocked(usersService.getUserDetail);
const getUserParcels = vi.mocked(usersService.getUserParcels);
const suspendUser = vi.mocked(usersService.suspendUser);
const unsuspendUser = vi.mocked(usersService.unsuspendUser);
const flagUsers = vi.mocked(usersService.flagUsers);
const deleteUser = vi.mocked(usersService.deleteUser);

const ROW: UserRow = {
  id: "USR-1002",
  name: "Emeka Okonkwo",
  email: "emakaokonkwo781@gmail.com",
  phone: "0801 234 5678",
  verification: "verified",
  joinedAt: "2025-03-12T10:00:00Z",
  status: "active",
};

const SUSPENDED_ROW: UserRow = {
  id: "USR-0357",
  name: "Sadiya Maiwada",
  email: "adamawapeak@hotmail.com",
  phone: "0801 234 5605",
  verification: "partial",
  joinedAt: "2026-06-05T10:48:00Z",
  status: "suspended",
};

const DETAIL: UserDetail = {
  ...ROW,
  flag: null,
  suspension: null,
  walletBalanceKobo: 1_240_000,
  totalSpentKobo: 4_820_000,
  parcelsSent: 24,
  parcelsDelivered: 17,
  recentActivity: [
    {id: "a1", label: "Parcel PRV-88201 dropped off", at: "Today, 10:14 AM"},
    {id: "a2", label: "Account created", at: "Mar 12, 2025"},
  ],
};

const PARCEL: UserParcel = {
  id: "PRV-88201",
  recipient: "Hauwa Zubairu",
  destination: "Ikeja, Lagos (IK-022)",
  courier: "PRG-023",
  status: "pending_pickup",
  sla: "1h 14m",
};

function list(overrides: Partial<UserListResponse["users"]> = {}): UserListResponse {
  return {
    metrics: {total: 3438, verified: 2800, suspended: 41, flagged: 17, newToday: 489},
    filters: {statuses: ["active", "flagged", "suspended"], verifications: ["verified", "partial", "unverified"]},
    suspendReasons: ["suspicious_activity", "payment_fraud", "other"],
    users: {items: [ROW, SUSPENDED_ROW], page: 1, pageSize: 10, total: 37, ...overrides},
  };
}

/** Renders the page, waits for the list, and opens Emeka's drawer. */
async function openDrawer() {
  renderRoute(UsersPage, "/users");
  fireEvent.click(await screen.findByText("USR-1002"));
  await waitFor(() => expect(getUserDetail).toHaveBeenCalledWith("USR-1002"));
  await screen.findByText("users.info_title");
}

describe("UsersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getUsers.mockResolvedValue(list());
    getUserDetail.mockResolvedValue(DETAIL);
    getUserParcels.mockResolvedValue({items: [PARCEL], page: 1, pageSize: 7, total: 1});
  });

  it("shows the skeleton while users load", async () => {
    getUsers.mockReturnValue(new Promise(() => {}));
    renderRoute(UsersPage, "/users");
    await waitFor(() => expect(document.querySelector("[aria-busy='true']")).toBeTruthy());
  });

  it("renders metrics, the table and pagination once loaded", async () => {
    renderRoute(UsersPage, "/users");

    expect(await screen.findByText("USR-1002")).toBeTruthy();
    expect(screen.getByText("Emeka Okonkwo")).toBeTruthy();
    expect(screen.getByText("Sadiya Maiwada")).toBeTruthy();
    expect(screen.getByText("users.metric_total")).toBeTruthy();
    expect(screen.getByText("users.metric_new_today")).toBeTruthy();
    expect(screen.getAllByText("users.status_suspended").length).toBeGreaterThan(0);
    expect(screen.getByText("workloads.showing")).toBeTruthy();
  });

  it("fetches with the search, status and verification filters", async () => {
    renderRoute(UsersPage, "/users");
    await screen.findByText("USR-1002");

    fireEvent.change(screen.getByPlaceholderText("users.search_placeholder"), {target: {value: "USR-99"}});
    await waitFor(() => expect(getUsers).toHaveBeenCalledWith(expect.objectContaining({query: "USR-99", page: 1})));

    fireEvent.change(screen.getAllByRole("combobox")[0], {target: {value: "suspended"}});
    await waitFor(() => expect(getUsers).toHaveBeenCalledWith(expect.objectContaining({status: "suspended", page: 1})));

    fireEvent.change(screen.getAllByRole("combobox")[1], {target: {value: "partial"}});
    await waitFor(() => expect(getUsers).toHaveBeenCalledWith(expect.objectContaining({verification: "partial", page: 1})));
  });

  it("renders the first-run empty state", async () => {
    getUsers.mockResolvedValue(list({items: [], total: 0}));
    renderRoute(UsersPage, "/users");

    expect(await screen.findByText("users.empty_title")).toBeTruthy();
    expect(screen.getByText("users.empty_description")).toBeTruthy();
  });

  it("renders the filtered-empty state and clears filters", async () => {
    getUsers.mockResolvedValue(list({items: [], total: 0}));
    renderRoute(UsersPage, "/users");
    await screen.findByText("users.empty_title");

    fireEvent.change(screen.getByPlaceholderText("users.search_placeholder"), {target: {value: "zzz"}});
    expect(await screen.findByText("users.filtered_empty_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "users.clear_filter"}));
    await waitFor(() => expect(getUsers).toHaveBeenLastCalledWith(expect.objectContaining({query: undefined})));
  });

  it("shows the error state and retries", async () => {
    getUsers.mockRejectedValueOnce(new Error("down")).mockResolvedValue(list());
    renderRoute(UsersPage, "/users");

    expect(await screen.findByText("workloads.load_error_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "workloads.retry"}));
    expect(await screen.findByText("USR-1002")).toBeTruthy();
  });

  it("opens the detail drawer with wallet stats when a row is clicked", async () => {
    await openDrawer();

    expect(screen.getByText("users.wallet_title")).toBeTruthy();
    expect(screen.getByText("₦12,400")).toBeTruthy();
    expect(screen.getByText("Parcel PRV-88201 dropped off")).toBeTruthy();
  });

  it("opens the parcels modal from the drawer banner", async () => {
    await openDrawer();

    fireEvent.click(await screen.findByRole("button", {name: /users\.view_items/}));
    await waitFor(() => expect(getUserParcels).toHaveBeenCalledWith("USR-1002", {page: 1}));

    expect(await screen.findByText("PRV-88201")).toBeTruthy();
    expect(screen.getByText("Hauwa Zubairu")).toBeTruthy();
  });

  it("suspends an account through the kebab menu with a reason", async () => {
    suspendUser.mockResolvedValue({id: "USR-1002", status: "suspended"});
    await openDrawer();

    fireEvent.click(screen.getByRole("button", {name: "users.menu_aria"}));
    fireEvent.click(await screen.findByRole("menuitem", {name: /users\.menu_suspend/}));

    expect(await screen.findByText("users.suspend_title")).toBeTruthy();
    fireEvent.change(screen.getByRole("combobox", {name: "users.suspend_reason_label"}), {target: {value: "payment_fraud"}});
    fireEvent.click(screen.getByRole("button", {name: "users.suspend_confirm"}));

    await waitFor(() => expect(suspendUser).toHaveBeenCalledWith("USR-1002", {reason: "payment_fraud", notes: undefined}));
    expect(await screen.findByRole("status")).toBeTruthy();
  });

  it("offers unsuspend for a suspended account", async () => {
    getUserDetail.mockResolvedValue({
      ...DETAIL,
      id: "USR-0357",
      name: "Sadiya Maiwada",
      status: "suspended",
      suspension: {reason: "policy_violations", at: "2026-06-05T10:48:00Z"},
    });
    unsuspendUser.mockResolvedValue({id: "USR-0357", status: "active"});
    renderRoute(UsersPage, "/users");
    fireEvent.click(await screen.findByText("USR-0357"));
    await screen.findByText("users.info_title");

    fireEvent.click(screen.getByRole("button", {name: "users.menu_aria"}));
    fireEvent.click(await screen.findByRole("menuitem", {name: "users.menu_unsuspend"}));

    expect(await screen.findByText("users.unsuspend_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "users.unsuspend_confirm"}));
    await waitFor(() => expect(unsuspendUser).toHaveBeenCalledWith("USR-0357", {notes: undefined}));
  });

  it("requires the typed name before deleting an account", async () => {
    deleteUser.mockResolvedValue({id: "USR-1002"});
    await openDrawer();

    fireEvent.click(screen.getByRole("button", {name: "users.menu_aria"}));
    fireEvent.click(await screen.findByRole("menuitem", {name: "users.menu_delete"}));
    expect(await screen.findByText("users.delete_title")).toBeTruthy();

    const input = document.getElementById("delete-confirm")!;
    fireEvent.change(input, {target: {value: "Wrong Name"}});
    const confirmButton = screen.getByRole<HTMLButtonElement>("button", {name: "users.delete_confirm"});
    expect(confirmButton.disabled).toBe(true);

    fireEvent.change(input, {target: {value: "Emeka Okonkwo"}});
    expect(confirmButton.disabled).toBe(false);
    fireEvent.click(confirmButton);

    await waitFor(() => expect(deleteUser).toHaveBeenCalledWith("USR-1002"));
    expect(await screen.findByRole("status")).toBeTruthy();
  });

  it("bulk-flags selected users through the selection bar", async () => {
    flagUsers.mockResolvedValue({ids: ["USR-1002", "USR-0357"], status: "flagged"});
    renderRoute(UsersPage, "/users");
    await screen.findByText("USR-1002");

    fireEvent.click(screen.getByRole("checkbox", {name: "USR-1002"}));
    fireEvent.click(screen.getByRole("checkbox", {name: "USR-0357"}));

    fireEvent.click(screen.getByRole("button", {name: "workloads.flag_for_review"}));
    fireEvent.change(await screen.findByRole("combobox"), {target: {value: "other"}});
    fireEvent.click(screen.getByRole("button", {name: "workloads.flag_confirm"}));

    await waitFor(() => expect(flagUsers).toHaveBeenCalledWith({ids: ["USR-1002", "USR-0357"], reason: "other", notes: undefined}));
    expect(await screen.findByRole("status")).toBeTruthy();
  });

  it("bulk-suspends selected users through the selection bar", async () => {
    suspendUser.mockResolvedValue({id: "USR-1002", status: "suspended"});
    renderRoute(UsersPage, "/users");
    await screen.findByText("USR-1002");

    fireEvent.click(screen.getByRole("checkbox", {name: "USR-1002"}));
    fireEvent.click(screen.getByRole("checkbox", {name: "USR-0357"}));
    fireEvent.click(screen.getByRole("button", {name: "users.menu_suspend"}));

    expect(await screen.findByText("users.suspend_title")).toBeTruthy();
    fireEvent.change(screen.getByRole("combobox", {name: "users.suspend_reason_label"}), {target: {value: "other"}});
    fireEvent.click(screen.getByRole("button", {name: "users.suspend_confirm"}));

    await waitFor(() => expect(suspendUser).toHaveBeenCalledTimes(2));
    expect(await screen.findByRole("status")).toBeTruthy();
  });
});
