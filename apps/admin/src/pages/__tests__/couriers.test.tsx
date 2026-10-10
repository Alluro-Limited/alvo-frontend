import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {couriersService} from "@/services/couriers-service";
import {renderRoute} from "@/test/render-route";
import type {
  CourierAssignment,
  CourierDetail,
  CourierListResponse,
  CourierRow,
  CourierTrack,
  CourierTrackingResponse,
} from "@/types/couriers-types";
import type {Page} from "@/types/workloads-types";
import {CouriersPage} from "../couriers";

vi.mock("@/services/couriers-service", () => ({
  couriersService: {
    getCouriers: vi.fn(),
    getCourierTracking: vi.fn(),
    getCourierDetail: vi.fn(),
    getCourierAssignments: vi.fn(),
    approveVerificationItem: vi.fn(),
    suspendCourier: vi.fn(),
    unsuspendCourier: vi.fn(),
    flagCouriers: vi.fn(),
    deleteCourier: vi.fn(),
    exportCouriers: vi.fn(),
    exportCourierAssignments: vi.fn(),
  },
}));

const getCouriers = vi.mocked(couriersService.getCouriers);
const getCourierTracking = vi.mocked(couriersService.getCourierTracking);
const getCourierDetail = vi.mocked(couriersService.getCourierDetail);
const getCourierAssignments = vi.mocked(couriersService.getCourierAssignments);
const approveVerificationItem = vi.mocked(couriersService.approveVerificationItem);
const suspendCourier = vi.mocked(couriersService.suspendCourier);
const unsuspendCourier = vi.mocked(couriersService.unsuspendCourier);
const flagCouriers = vi.mocked(couriersService.flagCouriers);
const deleteCourier = vi.mocked(couriersService.deleteCourier);

const ROW: CourierRow = {
  id: "PRG-0299",
  rank: 3,
  name: "Priscilla Awolowo",
  photoUrl: null,
  vehicle: "car",
  zone: "Muritala Airport",
  verification: "verified",
  successRate: 96,
  status: "active",
  position: [3.38, 6.52],
};

const PENDING_ROW: CourierRow = {
  id: "PRG-0165",
  rank: 0,
  name: "Hannah Opuogbo",
  photoUrl: null,
  vehicle: "car",
  zone: "Oshodi",
  verification: "pending",
  successRate: null,
  status: "active",
  position: [3.39, 6.53],
};

const SUSPENDED_ROW: CourierRow = {
  id: "PRG-0311",
  rank: 5,
  name: "Rebecca Kawu",
  photoUrl: null,
  vehicle: "car",
  zone: "Oshodi",
  verification: "verified",
  successRate: 87,
  status: "suspended",
  position: [3.4, 6.54],
};

const DETAIL: CourierDetail = {
  id: "PRG-0299",
  name: "Priscilla Awolowo",
  photoUrl: null,
  status: "active",
  verification: "verified",
  fullName: "Priscilla Awolowo",
  email: "priscillaawolowo782@gmail.com",
  phone: "0801 234 5678",
  age: 28,
  nin: "726289172000",
  vehicle: "car",
  vehicleBrand: "Toyota Corolla",
  plateNumber: "ABJ720KJK",
  zone: "Muritala Airport",
  joinedAt: "2026-04-12T09:00:00Z",
  verificationItems: [
    {key: "phone_email", status: "approved", fileName: null},
    {key: "id_account", status: "approved", fileName: null},
    {key: "drivers_licence", status: "submitted", fileName: "licence_priscilla.jpg"},
    {key: "vehicle_photo", status: "submitted", fileName: "car_priscilla.jpg"},
    {key: "background_check", status: "submitted", fileName: null},
  ],
  performance: {rank: 3, successRate: 96, slaRate: 94, avgTimeMinutes: 31, totalDeliveries: 210, outOfZone: 25},
  flag: null,
  suspension: null,
};

const ASSIGNMENT: CourierAssignment = {
  date: "2026-05-19T14:30:00Z",
  id: "ASN-1089",
  type: "express",
  pickup: "VI-034 · VI",
  dropoff: "MD-487 · Maryland",
  items: 12,
  status: "completed",
};

function assignmentsPage(overrides: Partial<Page<CourierAssignment>> = {}): Page<CourierAssignment> {
  return {items: [ASSIGNMENT], page: 1, pageSize: 7, total: 12, ...overrides};
}

const TRACK: CourierTrack = {
  courierId: "PRG-0299",
  name: "Priscilla Awolowo",
  photoUrl: null,
  vehicle: "car",
  status: "in_transit",
  motion: "enroute",
  publicPool: true,
  type: "bulk",
  batchId: "B-2281",
  items: 19,
  pickup: {name: "Yaba", code: "YB-006", zone: "Yaba", position: [3.38, 6.51]},
  dropoff: {name: "Super Node", code: "SN-001", zone: "Lekki", position: [3.42, 6.43]},
  etaMinutes: 35,
  distanceKm: 35,
  position: [3.4, 6.47],
  routePath: [
    [3.38, 6.51],
    [3.4, 6.47],
    [3.42, 6.43],
  ],
  lastKnownLocation: "Yaba, Lagos",
  offlineMinutes: 0,
  rating: 4.8,
  serviceTier: "standard",
  etaAt: "2026-05-19T17:30:00Z",
  phone: "0801 222 3344",
};

const TRACK2: CourierTrack = {
  ...TRACK,
  courierId: "PRG-0165",
  name: "Hannah Opuogbo",
  status: "delayed",
  publicPool: false,
  type: "express",
  batchId: "B-2290",
};

function tracking(overrides: CourierTrack[] = [TRACK, TRACK2]): CourierTrackingResponse {
  return {
    tracks: overrides,
    filters: {statuses: ["in_transit", "delayed"], types: ["bulk", "node", "express"]},
  };
}

function list(overrides: Partial<CourierListResponse["couriers"]> = {}): CourierListResponse {
  return {
    metrics: {total: 343, active: 290, onAssignment: 17, pendingVerify: 16, flagged: 24, suspended: 13},
    filters: {
      statuses: ["active", "flagged", "suspended"],
      verifications: ["verified", "pending"],
      vehicles: ["bicycle", "car", "motorcycle", "van"],
    },
    suspendReasons: ["gps_tampering", "safety_incident", "policy_violations", "recipient_complaint", "fraud", "other"],
    deleteReasons: ["account_closed", "policy_violations", "fraud", "inactive", "other"],
    couriers: {items: [ROW, PENDING_ROW, SUSPENDED_ROW], page: 1, pageSize: 10, total: 37, ...overrides},
  };
}

/** Renders the page, waits for the list, and opens Priscilla's drawer. */
async function openDrawer() {
  renderRoute(CouriersPage, "/couriers");
  fireEvent.click(await screen.findByText("PRG-0299"));
  await waitFor(() => expect(getCourierDetail).toHaveBeenCalledWith("PRG-0299"));
  await screen.findByText("couriers.info_title");
}

describe("CouriersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getCouriers.mockResolvedValue(list());
    getCourierTracking.mockResolvedValue(tracking());
    getCourierDetail.mockResolvedValue(DETAIL);
    getCourierAssignments.mockResolvedValue(assignmentsPage());
  });

  it("shows the skeleton while couriers load", async () => {
    getCouriers.mockReturnValue(new Promise(() => {}));
    renderRoute(CouriersPage, "/couriers");
    await waitFor(() => expect(document.querySelector("[aria-busy='true']")).toBeTruthy());
  });

  it("renders metrics, the table and pagination once loaded", async () => {
    renderRoute(CouriersPage, "/couriers");

    expect(await screen.findByText("PRG-0299")).toBeTruthy();
    expect(screen.getByText("Priscilla Awolowo")).toBeTruthy();
    expect(screen.getByText("couriers.metric_total")).toBeTruthy();
    expect(screen.getByText("couriers.metric_pending_verify")).toBeTruthy();
    expect(screen.getByText("couriers.metric_on_assignment")).toBeTruthy();
    expect(screen.getByText("workloads.showing")).toBeTruthy();
  });

  it("renders '-' for the success rate and status of pending-verification rows", async () => {
    renderRoute(CouriersPage, "/couriers");
    await screen.findByText("PRG-0165");

    const row = screen.getByText("PRG-0165").closest("tr")!;
    expect(row.querySelectorAll("td")).toBeTruthy();
    const dashes = Array.from(row.querySelectorAll("td")).filter((cell) => cell.textContent === "-");
    expect(dashes).toHaveLength(2);
  });

  it("fetches with the search, status, verification and vehicle filters", async () => {
    renderRoute(CouriersPage, "/couriers");
    await screen.findByText("PRG-0299");

    fireEvent.change(screen.getByPlaceholderText("couriers.search_placeholder"), {target: {value: "PRG-99"}});
    await waitFor(() => expect(getCouriers).toHaveBeenCalledWith(expect.objectContaining({query: "PRG-99", page: 1})));

    const selects = screen.getAllByRole("combobox");
    fireEvent.change(selects[0], {target: {value: "suspended"}});
    await waitFor(() => expect(getCouriers).toHaveBeenCalledWith(expect.objectContaining({status: "suspended", page: 1})));

    fireEvent.change(selects[1], {target: {value: "pending"}});
    await waitFor(() => expect(getCouriers).toHaveBeenCalledWith(expect.objectContaining({verification: "pending", page: 1})));

    fireEvent.change(selects[2], {target: {value: "van"}});
    await waitFor(() => expect(getCouriers).toHaveBeenCalledWith(expect.objectContaining({vehicle: "van", page: 1})));
  });

  it("renders the first-run empty state", async () => {
    getCouriers.mockResolvedValue(list({items: [], total: 0}));
    renderRoute(CouriersPage, "/couriers");

    expect(await screen.findByText("couriers.empty_title")).toBeTruthy();
    expect(screen.getByText("couriers.empty_description")).toBeTruthy();
  });

  it("renders the filtered-empty state and clears filters", async () => {
    getCouriers.mockResolvedValue(list({items: [], total: 0}));
    renderRoute(CouriersPage, "/couriers");
    await screen.findByText("couriers.empty_title");

    fireEvent.change(screen.getByPlaceholderText("couriers.search_placeholder"), {target: {value: "zzz"}});
    expect(await screen.findByText("couriers.filtered_empty_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "couriers.clear_filter"}));
    await waitFor(() => expect(getCouriers).toHaveBeenLastCalledWith(expect.objectContaining({query: undefined})));
  });

  it("shows the error state and retries", async () => {
    getCouriers.mockRejectedValueOnce(new Error("down")).mockResolvedValue(list());
    renderRoute(CouriersPage, "/couriers");

    expect(await screen.findByText("workloads.load_error_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "workloads.retry"}));
    expect(await screen.findByText("PRG-0299")).toBeTruthy();
  });

  it("opens the drawer on the information tab", async () => {
    await openDrawer();

    expect(screen.getAllByText("Priscilla Awolowo").length).toBeGreaterThan(0);
    expect(screen.getByText("priscillaawolowo782@gmail.com")).toBeTruthy();
    expect(screen.getByText("ABJ720KJK")).toBeTruthy();
    expect(screen.getByText("726289172000")).toBeTruthy();
  });

  it("approves a verification item from the verification tab", async () => {
    approveVerificationItem.mockResolvedValue({...DETAIL, verification: "verified"});
    await openDrawer();

    fireEvent.click(screen.getByRole("tab", {name: "couriers.tab_verification"}));
    expect(await screen.findByText("licence_priscilla.jpg")).toBeTruthy();

    fireEvent.click(screen.getAllByText("couriers.verification_mark_approved")[0]);
    await waitFor(() => expect(approveVerificationItem).toHaveBeenCalledWith("PRG-0299", "drivers_licence"));
    expect(await screen.findByRole("status")).toBeTruthy();
  });

  it("opens the document viewer and approves from it", async () => {
    approveVerificationItem.mockResolvedValue(DETAIL);
    await openDrawer();

    fireEvent.click(screen.getByRole("tab", {name: "couriers.tab_verification"}));
    fireEvent.click((await screen.findAllByRole("button", {name: /couriers\.verification_view/}))[0]);

    expect(await screen.findByText("couriers.doc_note")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "couriers.doc_approve"}));
    await waitFor(() => expect(approveVerificationItem).toHaveBeenCalledWith("PRG-0299", "drivers_licence"));
  });

  it("shows performance on the assignment tab and opens the history modal", async () => {
    await openDrawer();

    fireEvent.click(screen.getByRole("tab", {name: "couriers.tab_assignments"}));
    expect(await screen.findByText("couriers.perf_title")).toBeTruthy();
    expect(screen.getByText("couriers.stat_out_of_zone")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", {name: /couriers\.view_history/}));
    expect(await screen.findByText("ASN-1089")).toBeTruthy();
    await waitFor(() => expect(getCourierAssignments).toHaveBeenCalledWith("PRG-0299", expect.objectContaining({page: 1})));
  });

  it("flags the courier through the kebab menu", async () => {
    flagCouriers.mockResolvedValue({ids: ["PRG-0299"], status: "flagged"});
    await openDrawer();

    fireEvent.click(screen.getByRole("button", {name: "couriers.menu_aria"}));
    fireEvent.click(await screen.findByRole("menuitem", {name: "couriers.menu_flag"}));

    fireEvent.change(await screen.findByRole("combobox"), {target: {value: "other"}});
    fireEvent.click(screen.getByRole("button", {name: "workloads.flag_confirm"}));

    await waitFor(() => expect(flagCouriers).toHaveBeenCalledWith({ids: ["PRG-0299"], reason: "other", notes: undefined}));
    expect(await screen.findByRole("status")).toBeTruthy();
  });

  it("suspends the courier through the kebab menu with a reason", async () => {
    suspendCourier.mockResolvedValue({id: "PRG-0299", status: "suspended"});
    await openDrawer();

    fireEvent.click(screen.getByRole("button", {name: "couriers.menu_aria"}));
    fireEvent.click(await screen.findByRole("menuitem", {name: "couriers.menu_suspend"}));

    expect(await screen.findByText("couriers.suspend_title")).toBeTruthy();
    fireEvent.change(screen.getByRole("combobox", {name: "couriers.suspend_reason_label"}), {target: {value: "gps_tampering"}});
    fireEvent.click(screen.getByRole("button", {name: "couriers.suspend_confirm"}));

    await waitFor(() => expect(suspendCourier).toHaveBeenCalledWith("PRG-0299", {reason: "gps_tampering", notes: undefined}));
    expect(await screen.findByRole("status")).toBeTruthy();
  });

  it("offers unsuspend for a suspended courier", async () => {
    getCourierDetail.mockResolvedValue({
      ...DETAIL,
      id: "PRG-0311",
      name: "Rebecca Kawu",
      status: "suspended",
      suspension: {reason: "gps_tampering", at: "2026-06-05T10:48:00Z"},
    });
    unsuspendCourier.mockResolvedValue({id: "PRG-0311", status: "active"});
    renderRoute(CouriersPage, "/couriers");
    fireEvent.click(await screen.findByText("PRG-0311"));
    await screen.findByText("couriers.info_title");

    fireEvent.click(screen.getByRole("button", {name: "couriers.menu_aria"}));
    fireEvent.click(await screen.findByRole("menuitem", {name: "couriers.menu_unsuspend"}));

    expect(await screen.findByText("couriers.unsuspend_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "couriers.unsuspend_confirm"}));
    await waitFor(() => expect(unsuspendCourier).toHaveBeenCalledWith("PRG-0311", {notes: undefined}));
  });

  it("deletes the courier after picking a reason", async () => {
    deleteCourier.mockResolvedValue({id: "PRG-0299"});
    await openDrawer();

    fireEvent.click(screen.getByRole("button", {name: "couriers.menu_aria"}));
    fireEvent.click(await screen.findByRole("menuitem", {name: "couriers.menu_delete"}));

    expect(await screen.findByText("couriers.delete_title")).toBeTruthy();
    const confirm = screen.getByRole<HTMLButtonElement>("button", {name: "couriers.delete_confirm"});
    expect(confirm.disabled).toBe(true);

    fireEvent.change(screen.getByRole("combobox", {name: "couriers.delete_reason_label"}), {target: {value: "account_closed"}});
    fireEvent.click(screen.getByRole("button", {name: "couriers.delete_confirm"}));

    await waitFor(() => expect(deleteCourier).toHaveBeenCalledWith("PRG-0299", {reason: "account_closed"}));
    expect(await screen.findByRole("status")).toBeTruthy();
  });

  it("bulk-flags selected couriers through the selection bar", async () => {
    flagCouriers.mockResolvedValue({ids: ["PRG-0299", "PRG-0311"], status: "flagged"});
    renderRoute(CouriersPage, "/couriers");
    await screen.findByText("PRG-0299");

    fireEvent.click(screen.getByRole("checkbox", {name: "PRG-0299"}));
    fireEvent.click(screen.getByRole("checkbox", {name: "PRG-0311"}));

    fireEvent.click(screen.getByRole("button", {name: "workloads.flag_for_review"}));
    fireEvent.change(await screen.findByRole("combobox"), {target: {value: "other"}});
    fireEvent.click(screen.getByRole("button", {name: "workloads.flag_confirm"}));

    await waitFor(() => expect(flagCouriers).toHaveBeenCalledWith({ids: ["PRG-0299", "PRG-0311"], reason: "other", notes: undefined}));
    expect(await screen.findByRole("status")).toBeTruthy();
  });

  it("bulk-suspends selected couriers through the selection bar", async () => {
    suspendCourier.mockResolvedValue({id: "PRG-0299", status: "suspended"});
    renderRoute(CouriersPage, "/couriers");
    await screen.findByText("PRG-0299");

    fireEvent.click(screen.getByRole("checkbox", {name: "PRG-0299"}));
    fireEvent.click(screen.getByRole("checkbox", {name: "PRG-0311"}));
    fireEvent.click(screen.getByRole("button", {name: "couriers.menu_suspend"}));

    expect(await screen.findByText("couriers.suspend_title")).toBeTruthy();
    fireEvent.change(screen.getByRole("combobox", {name: "couriers.suspend_reason_label"}), {target: {value: "other"}});
    fireEvent.click(screen.getByRole("button", {name: "couriers.suspend_confirm"}));

    await waitFor(() => expect(suspendCourier).toHaveBeenCalledTimes(2));
    expect(await screen.findByRole("status")).toBeTruthy();
  });

  describe("map view", () => {
    async function openMap() {
      renderRoute(CouriersPage, "/couriers");
      await screen.findByText("PRG-0299");
      fireEvent.click(screen.getByRole("tab", {name: "nodes.view_map"}));
      await screen.findByTestId("couriers-map-cards");
    }

    it("renders the floating panel with assignment cards", async () => {
      await openMap();
      await screen.findByRole("button", {name: "Priscilla Awolowo"});

      const cards = screen.getByTestId("couriers-map-cards");
      expect(cards.textContent).toContain("PRG-0299");
      expect(cards.textContent).toContain("B-2281");
      expect(cards.textContent).toContain("couriers.track_in_transit");
      expect(cards.textContent).toContain("couriers.track_public_pool");
      expect(cards.textContent).toContain("couriers.track_delayed");
      expect(getCourierTracking).toHaveBeenCalledWith(expect.objectContaining({}));
      expect(screen.getByPlaceholderText("couriers.map_search_placeholder")).toBeTruthy();
    });

    it("fetches the map with the panel's search and filters", async () => {
      await openMap();

      fireEvent.change(screen.getByPlaceholderText("couriers.map_search_placeholder"), {target: {value: "PRG-99"}});
      await waitFor(() => expect(getCourierTracking).toHaveBeenCalledWith(expect.objectContaining({query: "PRG-99"})));

      const selects = screen.getAllByRole("combobox");
      fireEvent.change(selects[0], {target: {value: "delayed"}});
      await waitFor(() => expect(getCourierTracking).toHaveBeenCalledWith(expect.objectContaining({status: "delayed"})));

      fireEvent.change(selects[1], {target: {value: "bulk"}});
      await waitFor(() => expect(getCourierTracking).toHaveBeenCalledWith(expect.objectContaining({type: "bulk"})));
    });

    it("collapses and expands the panel", async () => {
      await openMap();

      fireEvent.click(screen.getByRole("button", {name: "couriers.map_collapse"}));
      expect(screen.queryByTestId("couriers-map-cards")).toBeNull();

      fireEvent.click(screen.getByRole("button", {name: "couriers.map_expand"}));
      expect(await screen.findByTestId("couriers-map-cards")).toBeTruthy();
    });

    it("marks the selected card without opening the drawer", async () => {
      await openMap();

      const card = await screen.findByRole("button", {name: "Priscilla Awolowo"});
      fireEvent.click(card);
      expect(card.getAttribute("aria-pressed")).toBe("true");
      expect(getCourierDetail).not.toHaveBeenCalled();
    });

    it("shows the no-active-assignments empty state", async () => {
      getCourierTracking.mockResolvedValue(tracking([]));
      await openMap();

      expect(await screen.findByText("couriers.map_empty_title")).toBeTruthy();
      expect(screen.getByText("couriers.map_empty_description")).toBeTruthy();
    });

    it("shows the filtered-empty state and clears filters", async () => {
      getCourierTracking.mockResolvedValue(tracking([]));
      await openMap();
      fireEvent.change(screen.getByPlaceholderText("couriers.map_search_placeholder"), {target: {value: "zzz"}});

      expect(await screen.findByText("couriers.filtered_empty_title")).toBeTruthy();
      fireEvent.click(screen.getByRole("button", {name: "couriers.clear_filter"}));
      await waitFor(() => expect(getCourierTracking).toHaveBeenLastCalledWith(expect.objectContaining({query: undefined})));
    });

    it("shows the tracking error state and retries", async () => {
      getCourierTracking.mockRejectedValueOnce(new Error("down")).mockResolvedValue(tracking());
      renderRoute(CouriersPage, "/couriers");
      await screen.findByText("PRG-0299");
      fireEvent.click(screen.getByRole("tab", {name: "nodes.view_map"}));

      expect(await screen.findByText("couriers.map_error")).toBeTruthy();
      fireEvent.click(screen.getByRole("button", {name: "couriers.retry"}));
      expect(await screen.findByRole("button", {name: "Priscilla Awolowo"})).toBeTruthy();
    });
  });
});
