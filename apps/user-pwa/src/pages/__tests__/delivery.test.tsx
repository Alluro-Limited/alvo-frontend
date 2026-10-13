import {fireEvent, screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {activityService} from "@/services/activity-service";
import {renderRoute} from "@/test/render-route";
import type {DeliveryDetail} from "@/types/activity-types";
import {DeliveryPage} from "../delivery";

vi.mock("@/services/activity-service", () => ({
  activityService: {
    getActivities: vi.fn(),
    getDelivery: vi.fn(),
    previewDropoffExtension: vi.fn(),
    extendDropoff: vi.fn(),
    previewPickupExtension: vi.fn(),
    reactivatePickup: vi.fn(),
    sendPickupVerification: vi.fn(),
    verifyPickup: vi.fn(),
  },
}));

const getDelivery = vi.mocked(activityService.getDelivery);
const previewDropoffExtension = vi.mocked(activityService.previewDropoffExtension);
const extendDropoff = vi.mocked(activityService.extendDropoff);
const previewPickupExtension = vi.mocked(activityService.previewPickupExtension);
const reactivatePickup = vi.mocked(activityService.reactivatePickup);
const sendPickupVerification = vi.mocked(activityService.sendPickupVerification);
const verifyPickup = vi.mocked(activityService.verifyPickup);

const ENROUTE: DeliveryDetail = {
  id: "a2",
  kind: "package",
  refId: "PKG1234",
  origin: "OSHODI",
  destination: "AJAH",
  status: "enroute",
  statusMessage: "On the way to destination locker",
  updatedAt: "12 Dec, 9:45 PM",
  progress: 2.5,
  amountPaid: 3500,
  paymentMethod: "Wallet",
  paidAt: "01 May, 2026, 9:15AM",
  dropoffAccess: {code: "B-1247", validUntil: "Dec 22, 11:34 AM", remaining: "7 hours 59 mins remaining", expired: false},
  pickupAccess: {code: "P-8823", validUntil: "Dec 24, 11:34 AM", remaining: "2 days remaining", expired: false},
  pickupLocation: {node: "Ikeja City Center", locker: "#SC-12", directions: "Ground Floor, near the main entrance escalators."},
  pickupExtensionFee: 500,
  extensionsRemaining: 3,
  lockerUpgrade: null,
  safe: null,
  storage: null,
  track: {pickupTime: "17:50", eta: "19:05", duration: "1HR 15MIN", distance: "3.5km", progress: 0.6},
  info: {
    size: "Small",
    contents: "Box",
    value: 0,
    recipient: "Agbaje Falilu",
    phone: "+234 801 234 5678",
    note: "Wishing you long life and prosperity.",
    speed: "Standard",
  },
  timeline: [
    {label: "Booked", time: "20 Dec, 9:45 AM", sub: null, done: true},
    {label: "In transit", time: "20 Dec, 10:15 AM", sub: "Now • 15 mins away", done: false},
  ],
};

const SAFE: DeliveryDetail = {
  id: "a1",
  kind: "safe",
  refId: "SF1234",
  origin: "LEKKI PHASE I",
  destination: "LEKKI PHASE I",
  status: "booked",
  statusMessage: "Safe reserved. Drop off your items to begin.",
  updatedAt: "12 Dec, 9:45 PM",
  progress: 0,
  amountPaid: 3500,
  paymentMethod: "Wallet",
  paidAt: "01 May, 2026, 9:15AM",
  dropoffAccess: {code: "B-1247", validUntil: "Dec 22, 11:34 AM", remaining: "7 hours 59 mins remaining", expired: false},
  pickupAccess: {code: "B-1247", validUntil: "10 minutes", remaining: "", expired: false, protected: true},
  pickupLocation: {node: "Lekki Phase 1 Smart Locker", locker: "LK-43", directions: "23 Admiralty Way, Lagos State"},
  pickupExtensionFee: 500,
  extensionsRemaining: 3,
  lockerUpgrade: null,
  track: {pickupTime: "17:50", eta: "19:05", duration: "1HR 15MIN", distance: "3.5km", progress: 0},
  info: {
    size: "Medium",
    contents: "Bag",
    value: 0,
    recipient: "Akande Toyyib",
    phone: "+234 801 234 5678",
    note: "",
    speed: "Standard",
  },
  timeline: [
    {label: "Reserved", time: "20 Dec, 9:45 AM", sub: null, done: true},
    {label: "Stored securely", time: "20 Dec, 10:15 AM", sub: null, done: true},
  ],
  safe: {
    stage: "stored",
    expiresIn: "1HR 15MIN",
    bookedAt: "17:50PM",
    pickupAt: "19:05PM",
    lockerName: "Lekki Locker",
    lockerNo: "LK-43",
    address: "Lekki Phase 1 Smart Locker, 23 Admiralty Way, Lagos State",
    distance: "2 mins away",
  },
  storage: {
    node: "#P-IKJ01",
    location: "Lekki Phase 1 Smart Locker",
    address: "23 Admiralty Way, Lagos State",
    lockerSize: "Medium (30x20x15cm)",
    duration: "4 hours (until 6:00 PM)",
    item: "Bag",
  },
};

describe("DeliveryPage", () => {
  beforeEach(() => {
    getDelivery.mockReset().mockResolvedValue(ENROUTE);
    previewDropoffExtension.mockReset().mockResolvedValue({addedTime: "+3 Hours", newDeadline: "Today, 5:45 PM", fee: 0});
    extendDropoff
      .mockReset()
      .mockResolvedValue({newDeadline: "Today, 5:45 PM", lockerNode: "Ikeja City Center", status: "Access Code Reactivated"});
    previewPickupExtension.mockReset().mockResolvedValue({addedTime: "+24 Hours", newDeadline: "Tomorrow, Jan 7, 11:34 AM", fee: 500});
    reactivatePickup
      .mockReset()
      .mockResolvedValue({newDeadline: "Tomorrow, Jan 7, 11:34 AM", lockerNode: "Ikeja City Center", status: "Access Code Reactivated"});
    sendPickupVerification.mockReset().mockResolvedValue(undefined);
    verifyPickup.mockReset().mockResolvedValue(undefined);
  });

  it("renders the status card and payment summary for an enroute delivery", async () => {
    renderRoute(DeliveryPage, "/delivery/$id", "/delivery/a2");
    expect(await screen.findByText("On the way to destination locker")).toBeTruthy();
    expect(screen.getByText("del.title")).toBeTruthy();
    expect(screen.getByText("del.st_enroute")).toBeTruthy();
    expect(screen.getByText(/OSHODI/)).toBeTruthy();
    expect(screen.getByText("PKG1234")).toBeTruthy();
    expect(screen.getByText("₦3,500")).toBeTruthy();
    expect(screen.getByText("Wallet")).toBeTruthy();
    expect(screen.getByRole("button", {name: "del.support"})).toBeTruthy();
  });

  it("navigates to live tracking from the track row", async () => {
    renderRoute(DeliveryPage, "/delivery/$id", "/delivery/a2");
    fireEvent.click(await screen.findByRole("button", {name: /del.track_cta/}));
    expect(await screen.findByText("stub:/delivery/$id/track")).toBeTruthy();
  });

  it("opens the access screen from the Access tile with drop-off and pickup tabs", async () => {
    renderRoute(DeliveryPage, "/delivery/$id", "/delivery/a2");
    await screen.findByText("On the way to destination locker");
    fireEvent.click(screen.getByRole("button", {name: /del.tab_access/}));
    expect(await screen.findByText("acc.title")).toBeTruthy();
    expect(screen.getByText("B - 1 2 4 7")).toBeTruthy();
    expect(screen.getByRole("button", {name: "acc.guide"})).toBeTruthy();
    expect(screen.getByRole("button", {name: "acc.extend"})).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "acc.tab_pick"}));
    expect(screen.getByText("P - 8 8 2 3")).toBeTruthy();
    expect(screen.getByText("Ikeja City Center")).toBeTruthy();
    expect(screen.getByText("#SC-12")).toBeTruthy();
    expect(screen.getByRole("button", {name: /acc.save/})).toBeTruthy();
    expect(screen.getByRole("button", {name: /acc.share/})).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "auth.back"}));
    expect(await screen.findByText("On the way to destination locker")).toBeTruthy();
  });

  it("shows the not-ready state when the pickup code isn't issued yet", async () => {
    getDelivery.mockResolvedValue({...ENROUTE, pickupAccess: null});
    renderRoute(DeliveryPage, "/delivery/$id", "/delivery/a2");
    await screen.findByText("On the way to destination locker");
    fireEvent.click(screen.getByRole("button", {name: /del.tab_access/}));
    fireEvent.click(await screen.findByRole("button", {name: "acc.tab_pick"}));
    expect(await screen.findByText("acc.not_ready")).toBeTruthy();
    expect(screen.getByText("acc.not_ready_desc")).toBeTruthy();
  });

  it("reactivates an expired pickup code through the paid sheet", async () => {
    getDelivery.mockResolvedValue({...ENROUTE, pickupAccess: {...ENROUTE.pickupAccess!, expired: true}});
    renderRoute(DeliveryPage, "/delivery/$id", "/delivery/a2");
    await screen.findByText("On the way to destination locker");
    fireEvent.click(screen.getByRole("button", {name: /del.tab_access/}));
    fireEvent.click(await screen.findByRole("button", {name: "acc.tab_pick"}));
    expect(await screen.findByText("acc.reactivate_note")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "acc.reactivate"}));
    expect(await screen.findByRole("heading", {name: "acc.sheet_title"})).toBeTruthy();
    expect(screen.getByText("acc.fee_note")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("safe.duration"), {target: {value: "24"}});
    expect(await screen.findByText("acc.ext_fee")).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", {name: /send.wallet/}));
    fireEvent.click(screen.getByRole("button", {name: /acc.pay_reactivate/}));
    await screen.findByText("acc.title");
    expect(reactivatePickup).toHaveBeenCalledWith("a2", 24, "wallet");
  });

  it("extends the drop-off window through the duration sheet", async () => {
    renderRoute(DeliveryPage, "/delivery/$id", "/delivery/a2");
    await screen.findByText("On the way to destination locker");
    fireEvent.click(screen.getByRole("button", {name: /del.tab_access/}));
    fireEvent.click(await screen.findByRole("button", {name: "acc.extend"}));
    expect(await screen.findByRole("heading", {name: "acc.sheet_title"})).toBeTruthy();
    expect(screen.getByText(/acc.ext_left/)).toBeTruthy();
    fireEvent.change(screen.getByLabelText("safe.duration"), {target: {value: "3"}});
    expect(await screen.findByText("acc.schedule_title")).toBeTruthy();
    expect(screen.getByText("+3 Hours")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "acc.confirm"}));
    expect(await screen.findByText("acc.success_title")).toBeTruthy();
    expect(screen.getByText("Ikeja City Center")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "acc.done"}));
    expect(await screen.findByText("acc.title")).toBeTruthy();
  });

  it("renders the expired state for an expired code", async () => {
    getDelivery.mockResolvedValue({
      ...ENROUTE,
      dropoffAccess: {...ENROUTE.dropoffAccess, expired: true},
    });
    renderRoute(DeliveryPage, "/delivery/$id", "/delivery/a2");
    await screen.findByText("On the way to destination locker");
    fireEvent.click(screen.getByRole("button", {name: /del.tab_access/}));
    expect(await screen.findByText(/acc.expired_at/)).toBeTruthy();
    expect(screen.getByText("acc.expired_note")).toBeTruthy();
    expect(screen.queryByText("B - 1 2 4 7")).not.toBeTruthy();
  });

  it("opens the package info and timeline sheets from their tiles", async () => {
    renderRoute(DeliveryPage, "/delivery/$id", "/delivery/a2");
    await screen.findByText("On the way to destination locker");
    fireEvent.click(screen.getByRole("button", {name: /del.tab_details/}));
    expect(await screen.findByRole("heading", {name: "del.info_title"})).toBeTruthy();
    expect(screen.getByText("Agbaje Falilu")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", {name: "loc.close"})[0]);
    fireEvent.click(screen.getByRole("button", {name: /del.tab_timeline/}));
    expect(await screen.findByRole("heading", {name: "del.timeline_title"})).toBeTruthy();
    expect(screen.getByText("Booked")).toBeTruthy();
    expect(screen.getByText("In transit")).toBeTruthy();
  });

  it("renders the safe details body with the stage, countdown, and locker block", async () => {
    getDelivery.mockResolvedValue(SAFE);
    renderRoute(DeliveryPage, "/delivery/$id", "/delivery/a1");
    expect(await screen.findByText("del.ss_stored")).toBeTruthy();
    expect(screen.getByText("del.safe_title")).toBeTruthy();
    expect(screen.getByText("del.expires_in")).toBeTruthy();
    expect(screen.getByText("1HR 15MIN")).toBeTruthy();
    expect(screen.getByText("Lekki Locker")).toBeTruthy();
    expect(screen.getByText(/LK-43/)).toBeTruthy();
    expect(screen.getByRole("button", {name: /del.navigate/})).toBeTruthy();
    expect(screen.getByRole("button", {name: "del.extend_pickup"})).toBeTruthy();
    expect(screen.getByRole("button", {name: "del.need_help"})).toBeTruthy();
    expect(screen.getByText("SF1234")).toBeTruthy();
  });

  it("opens the storage details sheet on the Details tile for a safe", async () => {
    getDelivery.mockResolvedValue(SAFE);
    renderRoute(DeliveryPage, "/delivery/$id", "/delivery/a1");
    await screen.findByText("del.ss_stored");
    fireEvent.click(screen.getByRole("button", {name: /del.tab_details/}));
    expect(await screen.findByRole("heading", {name: "del.storage_title"})).toBeTruthy();
    expect(screen.getByText("#P-IKJ01")).toBeTruthy();
    expect(screen.getByText("Medium (30x20x15cm)")).toBeTruthy();
    expect(screen.getByText("Bag")).toBeTruthy();
  });

  it("shows the fee row when extending a safe pickup", async () => {
    getDelivery.mockResolvedValue(SAFE);
    previewDropoffExtension.mockResolvedValue({addedTime: "+3 Hours", newDeadline: "Today, 5:45 PM", fee: 700});
    renderRoute(DeliveryPage, "/delivery/$id", "/delivery/a1");
    await screen.findByText("del.ss_stored");
    fireEvent.click(screen.getByRole("button", {name: "del.extend_pickup"}));
    fireEvent.change(await screen.findByLabelText("safe.duration"), {target: {value: "3"}});
    expect(await screen.findByText("acc.fee_attached")).toBeTruthy();
    expect(screen.getByText("₦700")).toBeTruthy();
  });

  async function openVerifySheet() {
    fireEvent.click(screen.getByRole("button", {name: /del.tab_access/}));
    fireEvent.click(await screen.findByRole("button", {name: "acc.tab_pick"}));
    expect(screen.queryByText("B - 1 2 4 7")).not.toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "acc.retrieve"}));
    expect(await screen.findByRole("heading", {name: "acc.verify_title"})).toBeTruthy();
    expect(sendPickupVerification).toHaveBeenCalledWith("a1");
  }

  it("rejects a wrong safe pickup code and resends the verification", async () => {
    getDelivery.mockResolvedValue(SAFE);
    renderRoute(DeliveryPage, "/delivery/$id", "/delivery/a1");
    await screen.findByText("del.ss_stored");
    await openVerifySheet();
    verifyPickup.mockRejectedValueOnce(new Error("invalid_code"));
    fireEvent.change(screen.getByLabelText("auth.code_label"), {target: {value: "123456"}});
    fireEvent.click(screen.getByRole("button", {name: "acc.verify"}));
    expect(await screen.findByText("acc.verify_err_title")).toBeTruthy();
    expect(verifyPickup).toHaveBeenCalledWith("a1", "123456");
    fireEvent.click(screen.getByRole("button", {name: "acc.resend_link"}));
    await vi.waitFor(() => expect(sendPickupVerification).toHaveBeenCalledTimes(2));
  });

  it("unmasks the safe pickup code after the six-digit verification", async () => {
    getDelivery.mockResolvedValue(SAFE);
    renderRoute(DeliveryPage, "/delivery/$id", "/delivery/a1");
    await screen.findByText("del.ss_stored");
    await openVerifySheet();
    getDelivery.mockResolvedValue({
      ...SAFE,
      pickupAccess: {code: "B-1247", validUntil: "10 minutes", remaining: "", expired: false},
    });
    fireEvent.change(screen.getByLabelText("auth.code_label"), {target: {value: "555555"}});
    fireEvent.click(screen.getByRole("button", {name: "acc.verify"}));
    await vi.waitFor(() => expect(verifyPickup).toHaveBeenCalledWith("a1", "555555"));
    expect(await screen.findByText("B - 1 2 4 7")).toBeTruthy();
  });

  it("renders the collected layout for a terminal delivery", async () => {
    getDelivery.mockResolvedValue({...ENROUTE, status: "collected", statusMessage: "Package collected from locker"});
    renderRoute(DeliveryPage, "/delivery/$id", "/delivery/a3");
    expect(await screen.findByText("Package collected from locker")).toBeTruthy();
    expect(screen.queryByText("del.track_cta")).not.toBeTruthy();
  });

  it("shows the not-found page for an unknown delivery", async () => {
    getDelivery.mockRejectedValue(new Error("not_found"));
    renderRoute(DeliveryPage, "/delivery/$id", "/delivery/nope");
    expect(await screen.findByText("not_found.title")).toBeTruthy();
  });
});
