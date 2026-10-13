import {fireEvent, screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {notificationService} from "@/services/notification-service";
import {renderRoute} from "@/test/render-route";
import {NotificationsPage} from "../notifications";

vi.mock("@/services/notification-service", () => ({
  notificationService: {getNotifications: vi.fn()},
}));

const getNotifications = vi.mocked(notificationService.getNotifications);

const GROUPS = [
  {
    label: "Today",
    items: [
      {id: "n1", kind: "delivery" as const, title: "Parcel Received", time: "11:03 AM", body: "Picked up."},
      {id: "n2", kind: "announcement" as const, title: "We’ve Arrived in Abuja!", time: "10:44 AM", body: "New lockers."},
    ],
  },
  {
    label: "Yesterday",
    items: [{id: "n3", kind: "delivery" as const, title: "On Its Way", time: "10:23 AM", body: "Heading out."}],
  },
];

describe("NotificationsPage", () => {
  beforeEach(() => {
    getNotifications.mockReset().mockResolvedValue(GROUPS);
  });

  it("renders the grouped feed with dividers, titles, and times", async () => {
    renderRoute(NotificationsPage, "/notifications");
    expect(await screen.findByText("Parcel Received")).toBeTruthy();
    expect(screen.getByText("Today")).toBeTruthy();
    expect(screen.getByText("Yesterday")).toBeTruthy();
    expect(screen.getByText("On Its Way")).toBeTruthy();
    expect(screen.getByText("11:03 AM")).toBeTruthy();
  });

  it("filters to deliveries when the Deliveries chip is active", async () => {
    renderRoute(NotificationsPage, "/notifications");
    await screen.findByText("Parcel Received");
    fireEvent.click(screen.getByRole("button", {name: "nt.deliveries"}));
    expect(screen.getByText("Parcel Received")).toBeTruthy();
    expect(screen.queryByText("We’ve Arrived in Abuja!")).not.toBeTruthy();
  });

  it("shows the empty state when a filter matches nothing", async () => {
    renderRoute(NotificationsPage, "/notifications");
    await screen.findByText("Parcel Received");
    fireEvent.click(screen.getByRole("button", {name: "nt.payment"}));
    expect(await screen.findByText("nt.empty_title")).toBeTruthy();
    expect(screen.getByRole("link", {name: "nt.go_home"})).toBeTruthy();
  });

  it("shows the empty state when the feed is empty", async () => {
    getNotifications.mockResolvedValue([]);
    renderRoute(NotificationsPage, "/notifications");
    expect(await screen.findByText("nt.empty_title")).toBeTruthy();
  });
});
