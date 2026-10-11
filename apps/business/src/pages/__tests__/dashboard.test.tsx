import {screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {dashboardService} from "@/services/dashboard-service";
import {renderRoute} from "@/test/render-route";
import type {DashboardOverview} from "@/types/dashboard-types";
import {DashboardPage} from "../dashboard";

vi.mock("@/services/dashboard-service", () => ({
  dashboardService: {getOverview: vi.fn(), getNotifications: vi.fn(), markAllNotificationsRead: vi.fn()},
}));

const getOverview = vi.mocked(dashboardService.getOverview);

const EMPTY: DashboardOverview = {
  firstName: "Ada",
  walletBalance: 0,
  stats: {
    totalBatches: 0,
    activeBatches: 0,
    completeBatches: 0,
    draftBatches: 0,
    totalShipments: 0,
    topLocker: null,
    totalSpend: 0,
    avgPerShipment: 0,
    activeShipments: 0,
    activeShipmentBatches: 0,
    deliveredLast30Days: 0,
    pending: 0,
    failed: 0,
  },
  recentShipments: [],
};

const POPULATED: DashboardOverview = {
  firstName: "Quadri",
  walletBalance: 48500,
  stats: {
    totalBatches: 38,
    activeBatches: 6,
    completeBatches: 9,
    draftBatches: 1,
    totalShipments: 2878,
    topLocker: {code: "L04", area: "Surulere", deliveries: 318},
    totalSpend: 203219,
    avgPerShipment: 672,
    activeShipments: 38,
    activeShipmentBatches: 2,
    deliveredLast30Days: 1248,
    pending: 12,
    failed: 12,
  },
  recentShipments: [
    {
      id: "shp-1",
      recipient: "Khadija Rabiu",
      phone: "0803 441 2210",
      destination: "Surulere Hub — L04",
      size: "M",
      priority: "express",
      status: "in_transit",
    },
    {
      id: "shp-2",
      recipient: "Adeola Ilesanmi",
      phone: "0803 222 1109",
      destination: "Victoria Island — L02",
      size: "S",
      priority: "standard",
      status: "failed",
    },
  ],
};

const renderDashboard = () => renderRoute(DashboardPage, "/dashboard");

describe("DashboardPage", () => {
  beforeEach(() => {
    getOverview.mockReset();
  });

  it("renders eight skeleton tiles while the overview loads", async () => {
    getOverview.mockReturnValue(new Promise(() => {}));
    renderDashboard();

    expect(await screen.findByRole("heading", {level: 1, name: "dashboard.greeting"})).toBeTruthy();
    expect(screen.getByRole("heading", {name: "dashboard.recent_shipments"})).toBeTruthy();
    expect(screen.queryByText("dashboard.stat_batches")).toBeNull();
  });

  it("shows the empty state and both CTAs for a fresh account", async () => {
    getOverview.mockResolvedValue(EMPTY);
    renderDashboard();

    expect(await screen.findByText("dashboard.stat_batches")).toBeTruthy();
    expect(screen.getByText("dashboard.stat_top_locker_empty")).toBeTruthy();
    expect(screen.getByText("dashboard.empty_title")).toBeTruthy();
    expect(screen.getByText("dashboard.empty_description")).toBeTruthy();
    expect(screen.getByRole("button", {name: "dashboard.empty_send"}).getAttribute("href")).toBe("/new-shipment");
    expect(screen.getByRole("button", {name: "dashboard.empty_template"})).toBeTruthy();
  });

  it("renders the populated stats and the recent shipments table", async () => {
    getOverview.mockResolvedValue(POPULATED);
    renderDashboard();

    expect(await screen.findByText("Khadija Rabiu")).toBeTruthy();
    expect(screen.getByText("2,878")).toBeTruthy();
    expect(screen.getByText("L04")).toBeTruthy();
    expect(screen.getByText("shipments.col_recipient")).toBeTruthy();
    expect(screen.getByText("shipments.status_failed")).toBeTruthy();
    expect(screen.getByRole("button", {name: "shipments.resolve"})).toBeTruthy();
    expect(screen.getByRole("link", {name: "dashboard.view_all"}).getAttribute("href")).toBe("/shipments");
    expect(screen.getByRole("button", {name: "dashboard.new_batch"}).getAttribute("href")).toBe("/new-shipment");
    expect(screen.queryByText("dashboard.empty_title")).toBeNull();
  });
});
