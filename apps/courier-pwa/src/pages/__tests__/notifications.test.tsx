import {fireEvent, screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {notificationsService} from "@/services/notifications-service";
import {renderRoute} from "@/test/render-route";
import type {CourierNotification} from "@/types/deliveries-types";
import {NotificationsPage} from "../notifications";

vi.mock("@/services/notifications-service", () => ({
  notificationsService: {getNotifications: vi.fn()},
}));

const getNotifications = vi.mocked(notificationsService.getNotifications);

function item(id: string, category: CourierNotification["category"], dayLabel = "Today"): CourierNotification {
  return {
    id,
    category,
    icon: category === "earning" ? "earning" : "assigned",
    title: `Title ${id}`,
    body: `Body ${id}`,
    time: "11:03 AM",
    dayLabel,
    unread: true,
  };
}

describe("NotificationsPage", () => {
  beforeEach(() => {
    getNotifications.mockReset().mockResolvedValue([item("n1", "delivery"), item("n2", "earning"), item("n3", "delivery", "Yesterday")]);
  });

  it("groups rows under their day dividers", async () => {
    renderRoute(NotificationsPage, "/notifications");
    expect(await screen.findByText("Title n1")).toBeTruthy();
    expect(screen.getByText("Today")).toBeTruthy();
    expect(screen.getByText("Yesterday")).toBeTruthy();
    expect(screen.getByText("Title n3")).toBeTruthy();
  });

  it("filters to a single category", async () => {
    renderRoute(NotificationsPage, "/notifications");
    await screen.findByText("Title n1");
    fireEvent.click(screen.getByRole("button", {name: "notif.earning"}));
    expect(screen.queryByText("Title n1")).toBeNull();
    expect(screen.getByText("Title n2")).toBeTruthy();
    expect(screen.queryByText("Yesterday")).toBeNull();
  });

  it("shows the empty state when nothing matches", async () => {
    getNotifications.mockResolvedValue([item("n1", "delivery")]);
    renderRoute(NotificationsPage, "/notifications");
    await screen.findByText("Title n1");
    fireEvent.click(screen.getByRole("button", {name: "notif.earning"}));
    expect(await screen.findByText("notif.empty")).toBeTruthy();
  });
});
