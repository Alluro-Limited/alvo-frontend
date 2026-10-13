import {fireEvent, screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {activityService} from "@/services/activity-service";
import {renderRoute} from "@/test/render-route";
import type {ActivityItem, DeliveryDetail} from "@/types/activity-types";
import {ActivitiesPage} from "../activities";

vi.mock("@/services/activity-service", () => ({
  activityService: {
    getActivities: vi.fn(),
    getDelivery: vi.fn(),
    upgradeLocker: vi.fn(),
    cancelShipment: vi.fn(),
  },
}));

const getActivities = vi.mocked(activityService.getActivities);
const getDelivery = vi.mocked(activityService.getDelivery);
const upgradeLocker = vi.mocked(activityService.upgradeLocker);
const cancelShipment = vi.mocked(activityService.cancelShipment);

const ITEMS: ActivityItem[] = [
  {
    id: "a5",
    kind: "package",
    refId: "PR1234",
    status: "pending",
    recipient: "Quadri Olatunji",
    amount: 3500,
    eta: "20th Dec, 2025 • 3:45PM",
    day: "today",
  },
  {
    id: "a1",
    kind: "safe",
    refId: "SF1234",
    status: "booked",
    recipient: "Akande Toyyib",
    amount: 3500,
    eta: "20th Dec, 2025 • 3:45PM",
    day: "today",
  },
  {
    id: "a2",
    kind: "package",
    refId: "PKG1234",
    status: "enroute",
    recipient: "Quadri Olatunji",
    amount: 3500,
    eta: "20th Dec, 2025 • 9:45AM",
    day: "today",
  },
  {
    id: "a3",
    kind: "package",
    refId: "PKG2201",
    status: "collected",
    recipient: "Akande Toyyib",
    amount: 2800,
    eta: "12th Dec, 2025 • 10:45AM",
    day: "yesterday",
  },
  {
    id: "a4",
    kind: "package",
    refId: "PKG1188",
    status: "cancelled",
    recipient: "Akande Toyyib",
    amount: 1500,
    eta: "18 Dec • 9:00AM",
    day: "yesterday",
  },
];

const PENDING: DeliveryDetail = {
  id: "a5",
  kind: "package",
  refId: "PR1234",
  origin: "LEKKI PHASE I",
  destination: "AJAH",
  status: "pending",
  statusMessage: "Package is larger than the selected locker size",
  updatedAt: "20 Dec, 9:45 AM",
  progress: 0,
  amountPaid: 3500,
  paymentMethod: "Wallet",
  paidAt: "20 Dec, 2025, 9:45AM",
  dropoffAccess: {code: "B-1247", validUntil: "Dec 22, 11:34 AM", remaining: "7 hours 59 mins remaining", expired: false},
  pickupAccess: null,
  pickupLocation: {node: "Ikeja City Center", locker: "#SC-12", directions: "Ground Floor, near the main entrance escalators."},
  pickupExtensionFee: 500,
  extensionsRemaining: 3,
  lockerUpgrade: {currentSize: "Small", newSize: "Medium", fee: 1500},
  safe: null,
  storage: null,
  track: {pickupTime: "17:50", eta: "19:05", duration: "1HR 15MIN", distance: "3.5km", progress: 0},
  info: {size: "Small", contents: "Box", value: 0, recipient: "Quadri Olatunji", phone: "+234 801 234 5678", note: "", speed: "Standard"},
  timeline: [],
};

async function openUpgradeSheet() {
  fireEvent.click(await screen.findByRole("button", {name: "act.change_size"}));
  expect(await screen.findByRole("heading", {name: "upg.title"})).toBeTruthy();
}

describe("ActivitiesPage", () => {
  beforeEach(() => {
    getActivities.mockReset().mockResolvedValue(ITEMS);
    getDelivery.mockReset().mockResolvedValue(PENDING);
    upgradeLocker.mockReset().mockResolvedValue(undefined);
    cancelShipment.mockReset().mockResolvedValue(undefined);
  });

  it("renders the title, chips, day groups, and all activity cards", async () => {
    renderRoute(ActivitiesPage, "/activities");
    expect(await screen.findByText("#SF1234")).toBeTruthy();
    expect(screen.getByText("act.title")).toBeTruthy();
    expect(screen.getByText("act.day_today")).toBeTruthy();
    expect(screen.getByText("act.day_yesterday")).toBeTruthy();
    expect(screen.getByText("#PR1234")).toBeTruthy();
    expect(screen.getByText("#PKG2201")).toBeTruthy();
    expect(screen.getByText("#PKG1188")).toBeTruthy();
    expect(screen.getAllByText("Quadri Olatunji").length).toBe(2);
  });

  it("renders the safe card with Location/Expires rows and the RESERVED pill", async () => {
    renderRoute(ActivitiesPage, "/activities");
    expect(await screen.findByText("#SF1234")).toBeTruthy();
    expect(screen.getByText("act.safe_id")).toBeTruthy();
    expect(screen.getByText("act.location")).toBeTruthy();
    expect(screen.getByText("act.expires")).toBeTruthy();
    expect(screen.getByText("del.st_reserved")).toBeTruthy();
    expect(screen.getAllByText("act.recipient").length).toBe(4);
  });

  it("filters to active items only", async () => {
    renderRoute(ActivitiesPage, "/activities");
    await screen.findByText("#SF1234");
    fireEvent.click(screen.getByRole("radio", {name: "act.chip_active"}));
    expect(screen.getByText("#PR1234")).toBeTruthy();
    expect(screen.getByText("#SF1234")).toBeTruthy();
    expect(screen.getByText("#PKG1234")).toBeTruthy();
    expect(screen.queryByText("#PKG2201")).not.toBeTruthy();
    expect(screen.queryByText("#PKG1188")).not.toBeTruthy();
  });

  it("filters to completed and cancelled items", async () => {
    renderRoute(ActivitiesPage, "/activities");
    await screen.findByText("#SF1234");
    fireEvent.click(screen.getByRole("radio", {name: "act.chip_done"}));
    expect(screen.getByText("#PKG2201")).toBeTruthy();
    expect(screen.queryByText("#PKG1234")).not.toBeTruthy();
    fireEvent.click(screen.getByRole("radio", {name: "act.chip_cancelled"}));
    expect(screen.getByText("#PKG1188")).toBeTruthy();
    expect(screen.queryByText("#PKG2201")).not.toBeTruthy();
  });

  it("shows the empty state when the feed is empty", async () => {
    getActivities.mockResolvedValue([]);
    renderRoute(ActivitiesPage, "/activities");
    expect(await screen.findByText("act.empty")).toBeTruthy();
  });

  it("navigates to the delivery detail and support from card actions", async () => {
    renderRoute(ActivitiesPage, "/activities");
    await screen.findByText("#PKG1234");
    fireEvent.click(screen.getAllByRole("button", {name: "act.view_details"})[1]);
    expect(await screen.findByText("stub:/delivery/$id")).toBeTruthy();
  });

  it("navigates to support from a completed card", async () => {
    renderRoute(ActivitiesPage, "/activities");
    await screen.findByText("#PKG2201");
    fireEvent.click(screen.getByRole("button", {name: "act.contact_support"}));
    expect(await screen.findByText("stub:/support")).toBeTruthy();
  });

  it("pays the locker-size difference through the upgrade sheet", async () => {
    renderRoute(ActivitiesPage, "/activities");
    await openUpgradeSheet();
    expect(screen.getByText("Small")).toBeTruthy();
    expect(screen.getByText("Medium")).toBeTruthy();
    expect(screen.getAllByText("₦1,500").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("radio", {name: "send.wallet"}));
    fireEvent.click(screen.getByRole("button", {name: "upg.pay"}));
    expect(await screen.findByText("upg.success_title")).toBeTruthy();
    expect(upgradeLocker).toHaveBeenCalledWith("a5", "wallet");
    fireEvent.click(screen.getByRole("button", {name: "upg.details"}));
    expect(await screen.findByText("stub:/delivery/$id")).toBeTruthy();
  });

  it("keeps the shipment when the cancel dialog is dismissed", async () => {
    renderRoute(ActivitiesPage, "/activities");
    await openUpgradeSheet();
    fireEvent.click(screen.getByRole("button", {name: "upg.cancel"}));
    expect(await screen.findByRole("heading", {name: "cxl.title"})).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "cxl.keep"}));
    expect(screen.queryByRole("heading", {name: "cxl.title"})).not.toBeTruthy();
    expect(await screen.findByText("#PR1234")).toBeTruthy();
    expect(cancelShipment).not.toHaveBeenCalled();
  });

  it("cancels the shipment and shows the success screen", async () => {
    renderRoute(ActivitiesPage, "/activities");
    await openUpgradeSheet();
    fireEvent.click(screen.getByRole("button", {name: "upg.cancel"}));
    fireEvent.click(await screen.findByRole("button", {name: "cxl.confirm"}));
    expect(await screen.findByText("cxl.done_title")).toBeTruthy();
    expect(cancelShipment).toHaveBeenCalledWith("a5");
    expect(screen.getByText("cxl.next_title")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "cxl.new"}));
    expect(await screen.findByText("stub:/send")).toBeTruthy();
  });
});
