import {fireEvent, screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {activityService} from "@/services/activity-service";
import {renderRoute} from "@/test/render-route";
import type {DeliveryDetail} from "@/types/activity-types";
import {TrackPage} from "../track";

vi.mock("@/services/activity-service", () => ({
  activityService: {getActivities: vi.fn(), getDelivery: vi.fn()},
}));

const getDelivery = vi.mocked(activityService.getDelivery);

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
  track: {pickupTime: "17:50", eta: "19:05", duration: "1HR 15MIN", distance: "3.5km", progress: 0.6},
  info: {size: "Small", contents: "Box", value: 0, recipient: "Agbaje Falilu", phone: "+234 801 234 5678", note: "", speed: "Standard"},
  timeline: [],
};

describe("TrackPage", () => {
  beforeEach(() => {
    getDelivery.mockReset().mockResolvedValue(ENROUTE);
  });

  it("renders the route title, pickup/ETA times, and distance", async () => {
    renderRoute(TrackPage, "/delivery/$id/track", "/delivery/a2/track");
    expect(await screen.findByText("17:50")).toBeTruthy();
    expect(screen.getByText(/OSHODI/)).toBeTruthy();
    expect(screen.getByText("19:05")).toBeTruthy();
    expect(screen.getByText("1HR 15MIN")).toBeTruthy();
    expect(screen.getByText("3.5km")).toBeTruthy();
    expect(screen.getByText("del.pickup")).toBeTruthy();
    expect(screen.getByText("del.eta")).toBeTruthy();
  });

  it("navigates back to the delivery detail", async () => {
    renderRoute(TrackPage, "/delivery/$id/track", "/delivery/a2/track");
    await screen.findByText("17:50");
    fireEvent.click(screen.getByRole("button", {name: "auth.back"}));
    expect(await screen.findByText("stub:/delivery/$id")).toBeTruthy();
  });

  it("shows the not-found page for an unknown delivery", async () => {
    getDelivery.mockRejectedValue(new Error("not_found"));
    renderRoute(TrackPage, "/delivery/$id/track", "/delivery/nope/track");
    expect(await screen.findByText("not_found.title")).toBeTruthy();
  });
});
