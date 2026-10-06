import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {assignmentsService} from "@/services/assignments-service";
import {renderRoute} from "@/test/render-route";
import type {AssignmentDetail, AssignmentListResponse, AssignmentRow} from "@/types/assignment-types";
import {AssignmentPage} from "../assignment";

vi.mock("@/services/assignments-service", () => ({
  assignmentsService: {
    getAssignments: vi.fn(),
    getAssignmentDetail: vi.fn(),
    getAssignable: vi.fn(),
    getIdleCouriers: vi.fn(),
    assignCourier: vi.fn(),
    flagAssignment: vi.fn(),
  },
}));

const getAssignments = vi.mocked(assignmentsService.getAssignments);
const getAssignmentDetail = vi.mocked(assignmentsService.getAssignmentDetail);
const getAssignable = vi.mocked(assignmentsService.getAssignable);
const getIdleCouriers = vi.mocked(assignmentsService.getIdleCouriers);
const assignCourier = vi.mocked(assignmentsService.assignCourier);
const flagAssignment = vi.mocked(assignmentsService.flagAssignment);

const ACTIVE_ROW: AssignmentRow = {
  id: "ASN-0382",
  type: "express",
  courier: "Adaeze Kalu",
  pickup: "Ikeja Hub",
  dropoff: "Lekki Node LK-015",
  items: 3,
  status: "active",
  position: [3.42, 6.44],
};

const POOL_ROW: AssignmentRow = {
  id: "ASN-1089",
  type: "bulk",
  courier: null,
  pickup: "Yaba Hub",
  dropoff: "VI Node VI-002",
  items: 12,
  status: "public_pool",
  position: [3.4, 6.51],
};

const DETAIL: AssignmentDetail = {
  id: "ASN-0382",
  type: "express",
  status: "active",
  pickup: "Ikeja Hub",
  dropoff: "Lekki Node LK-015",
  items: 3,
  courier: {name: "Adaeze Kalu", code: "PRG-034"},
  progress: 62,
  etaMin: 14,
  declinedBy: null,
  flag: null,
  timeline: [
    {label: "Assignment created", at: "2025-01-10T08:00:00Z", done: true},
    {label: "Courier accepted", at: "2025-01-10T08:05:00Z", done: true},
    {label: "Delivered", at: null, done: false},
  ],
  route: "Ikeja Hub → Lekki Node LK-015",
  itemStatusOrder: ["picked_up", "en_route", "delivered"],
  assignmentItems: [
    {id: "PRV-1001", slot: "Slot A1", weightKg: 1.2, status: "en_route"},
    {id: "PRV-1002", slot: "Slot A2", weightKg: 0.8, status: "picked_up"},
  ],
};

function list(overrides: Partial<AssignmentListResponse["assignments"]> = {}): AssignmentListResponse {
  return {
    metrics: {active: 8, pendingPickup: 4, completed: 21, publicPool: 2, failed: 1, flagged: 1},
    filters: {
      statuses: ["created", "pending_pickup", "active", "public_pool", "failed", "flagged", "completed"],
      types: ["bulk", "node", "express"],
    },
    assignments: {items: [ACTIVE_ROW, POOL_ROW], page: 1, pageSize: 10, total: 37, ...overrides},
  };
}

describe("AssignmentPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getAssignments.mockResolvedValue(list());
    getAssignmentDetail.mockResolvedValue(DETAIL);
    getAssignable.mockResolvedValue([
      {id: "ASN-1089", type: "bulk", status: "public_pool", route: "Yaba Hub → VI Node VI-002", items: 12},
      {id: "ASN-0182", type: "express", status: "failed", route: "Surulere Hub → Ikoyi Node IK-004", items: 1},
    ]);
    getIdleCouriers.mockResolvedValue([
      {id: "courier-1", name: "Firdausi Kabiru", code: "PRG-047", rank: 3, zones: ["Lekki"], successRate: 96},
    ]);
  });

  it("shows the skeleton while assignments load", async () => {
    getAssignments.mockReturnValue(new Promise(() => {}));
    renderRoute(AssignmentPage, "/assignment");
    await waitFor(() => expect(document.querySelector("[aria-busy='true']")).toBeTruthy());
  });

  it("renders metrics, the table and pagination once loaded", async () => {
    renderRoute(AssignmentPage, "/assignment");

    expect(await screen.findByText("ASN-0382")).toBeTruthy();
    expect(screen.getByText("ASN-1089")).toBeTruthy();
    expect(screen.getByText("assignment.metric_active")).toBeTruthy();
    expect(screen.getByText("assignment.metric_public_pool")).toBeTruthy();
    expect(screen.getByText("assignment.type_bulk_short")).toBeTruthy();
    expect(screen.getByText("workloads.showing")).toBeTruthy();
  });

  it("fetches with the search query, status and type filters", async () => {
    renderRoute(AssignmentPage, "/assignment");
    await screen.findByText("ASN-0382");

    fireEvent.change(screen.getByPlaceholderText("assignment.search_placeholder"), {target: {value: "ASN-99"}});
    await waitFor(() => expect(getAssignments).toHaveBeenCalledWith(expect.objectContaining({query: "ASN-99", page: 1})));

    fireEvent.change(screen.getAllByRole("combobox")[0], {target: {value: "active"}});
    await waitFor(() => expect(getAssignments).toHaveBeenCalledWith(expect.objectContaining({status: "active", page: 1})));

    fireEvent.change(screen.getAllByRole("combobox")[1], {target: {value: "bulk"}});
    await waitFor(() => expect(getAssignments).toHaveBeenCalledWith(expect.objectContaining({type: "bulk", page: 1})));
  });

  it("renders the first-run empty state", async () => {
    getAssignments.mockResolvedValue(list({items: [], total: 0}));
    renderRoute(AssignmentPage, "/assignment");

    expect(await screen.findByText("assignment.empty_title")).toBeTruthy();
    expect(screen.getByText("assignment.empty_description")).toBeTruthy();
  });

  it("renders the filtered-empty state and clears filters", async () => {
    getAssignments.mockResolvedValue(list({items: [], total: 0}));
    renderRoute(AssignmentPage, "/assignment");
    await screen.findByText("assignment.empty_title");

    fireEvent.change(screen.getByPlaceholderText("assignment.search_placeholder"), {target: {value: "zzz"}});
    expect(await screen.findByText("assignment.filtered_empty_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "assignment.clear_filter"}));
    await waitFor(() => expect(getAssignments).toHaveBeenLastCalledWith(expect.objectContaining({query: undefined})));
  });

  it("shows the error state and retries", async () => {
    getAssignments.mockRejectedValueOnce(new Error("down")).mockResolvedValue(list());
    renderRoute(AssignmentPage, "/assignment");

    expect(await screen.findByText("assignment.error_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "assignment.retry"}));
    expect(await screen.findByText("ASN-0382")).toBeTruthy();
  });

  it("opens the detail drawer when a row is clicked", async () => {
    renderRoute(AssignmentPage, "/assignment");
    fireEvent.click(await screen.findByText("ASN-0382"));

    expect(await screen.findByText("assignment.info_title")).toBeTruthy();
    expect(getAssignmentDetail).toHaveBeenCalledWith("ASN-0382");
    expect(screen.getAllByText("Adaeze Kalu").length).toBeGreaterThan(1);
    expect(screen.getByText("PRG-034")).toBeTruthy();
  });

  it("opens the items modal from the drawer", async () => {
    renderRoute(AssignmentPage, "/assignment");
    fireEvent.click(await screen.findByText("ASN-0382"));
    fireEvent.click(await screen.findByRole("button", {name: /assignment\.view_items/}));

    expect(await screen.findByText("assignment.items_title")).toBeTruthy();
    expect(screen.getByText("PRV-1001")).toBeTruthy();
    expect(screen.getByText("PRV-1002")).toBeTruthy();
  });

  it("switches to the map view from the drawer track action", async () => {
    renderRoute(AssignmentPage, "/assignment");
    fireEvent.click(await screen.findByText("ASN-0382"));
    fireEvent.click(await screen.findByRole("button", {name: "assignment.track_map_aria"}));

    await waitFor(() => expect(screen.getByRole("tab", {name: "nodes.view_map"}).getAttribute("aria-selected")).toBe("true"));
  });

  it("assigns a courier through the two-step modal and shows the toast", async () => {
    assignCourier.mockResolvedValue({id: "ASN-1089", courier: "Firdausi Kabiru"});
    renderRoute(AssignmentPage, "/assignment");
    await screen.findByText("ASN-0382");

    fireEvent.click(screen.getByRole("button", {name: "assignment.manual_assign"}));
    expect(await screen.findByText("assignment.assign_title")).toBeTruthy();

    // Continue is gated until an assignment is picked.
    const continueButton = screen.getByRole<HTMLButtonElement>("button", {name: "assignment.assign_continue"});
    expect(continueButton.disabled).toBe(true);
    fireEvent.click(await screen.findByRole("radio", {name: /ASN-1089/}));
    fireEvent.click(continueButton);

    expect(await screen.findByRole("radio", {name: /Firdausi Kabiru/})).toBeTruthy();
    const confirmButton = screen.getByRole<HTMLButtonElement>("button", {name: "assignment.assign_confirm"});
    expect(confirmButton.disabled).toBe(true);
    fireEvent.click(screen.getByRole("radio", {name: /Firdausi Kabiru/}));
    fireEvent.click(confirmButton);

    await waitFor(() => expect(assignCourier).toHaveBeenCalledWith({assignmentId: "ASN-1089", courierId: "courier-1"}));
    expect(await screen.findByRole("status")).toBeTruthy();
  });

  it("flags an assignment from the drawer and shows the toast", async () => {
    flagAssignment.mockResolvedValue({id: "ASN-0382", status: "flagged"});
    renderRoute(AssignmentPage, "/assignment");
    fireEvent.click(await screen.findByText("ASN-0382"));
    fireEvent.click(await screen.findByRole("button", {name: "assignment.flag_aria"}));

    fireEvent.change(screen.getByRole("combobox"), {target: {value: "suspicious_activity"}});
    fireEvent.click(screen.getByRole("button", {name: "workloads.flag_confirm"}));

    expect(await screen.findByRole("status")).toBeTruthy();
    expect(flagAssignment).toHaveBeenCalledWith("ASN-0382", {reason: "suspicious_activity", notes: undefined});
  });

  it("bulk-flags selected assignments through the selection bar", async () => {
    flagAssignment.mockResolvedValue({id: "ASN-0382", status: "flagged"});
    renderRoute(AssignmentPage, "/assignment");
    await screen.findByText("ASN-0382");

    fireEvent.click(screen.getByRole("checkbox", {name: "ASN-0382"}));
    fireEvent.click(screen.getByRole("checkbox", {name: "ASN-1089"}));

    fireEvent.click(screen.getAllByRole("button", {name: "workloads.flag_for_review"})[0]);
    fireEvent.change(await screen.findByRole("combobox"), {target: {value: "other"}});
    fireEvent.click(screen.getByRole("button", {name: "workloads.flag_confirm"}));

    await waitFor(() => expect(flagAssignment).toHaveBeenCalledWith("ASN-1089", {reason: "other", notes: undefined}));
    expect(flagAssignment).toHaveBeenCalledWith("ASN-0382", {reason: "other", notes: undefined});
  });
});
