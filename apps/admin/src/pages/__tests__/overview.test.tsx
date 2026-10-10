import {fireEvent, screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {dashboardService} from "@/services/dashboard-service";
import {renderRoute} from "@/test/render-route";
import type {DashboardOverview} from "@/types/dashboard-types";
import {OverviewPage} from "../overview";

vi.mock("@/services/dashboard-service", () => ({dashboardService: {getOverview: vi.fn()}}));

const getOverview = vi.mocked(dashboardService.getOverview);

function overview(overrides: Partial<DashboardOverview> = {}): DashboardOverview {
  return {
    firstRun: false,
    kpis: {activeParcels: 0, nodesOnline: 0, nodesTotal: 0, couriersActive: 0, couriersRegistered: 0, revenueToday: 0},
    deliveryRate: {today: 99.1, onTime: 0, late: 0, failed: 0},
    map: {nodes: [], couriers: [], route: []},
    alerts: [],
    activity: [],
    ...overrides,
  };
}

describe("OverviewPage", () => {
  beforeEach(() => {
    getOverview.mockReset();
  });

  it("shows the skeleton while the overview loads", async () => {
    getOverview.mockReturnValue(new Promise(() => {}));
    renderRoute(OverviewPage, "/dashboard");

    expect(await screen.findByRole("status")).toBeTruthy();
  });

  it("renders the empty dashboard when it is not the first run", async () => {
    getOverview.mockResolvedValue(overview());
    renderRoute(OverviewPage, "/dashboard");

    await screen.findByText("overview.kpi_parcels");
    expect(screen.getByText("overview.map_title")).toBeTruthy();
    expect(screen.getByText("overview.alerts_empty_title")).toBeTruthy();
    expect(screen.getByText("overview.activity_empty_title")).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows the welcome modal over the dashboard on first run", async () => {
    getOverview.mockResolvedValue(overview({firstRun: true}));
    renderRoute(OverviewPage, "/dashboard");

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeTruthy();
    expect(screen.getByText("overview.welcome_title")).toBeTruthy();
    expect(screen.getByRole("button", {name: "overview.start_tour"})).toBeTruthy();
    expect(screen.getByRole("button", {name: "overview.activate_first_node"})).toBeTruthy();
  });

  it("dismisses the welcome modal when starting the tour", async () => {
    getOverview.mockResolvedValue(overview({firstRun: true}));
    renderRoute(OverviewPage, "/dashboard");

    await screen.findByRole("dialog");
    fireEvent.click(screen.getByRole("button", {name: "overview.start_tour"}));

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByText("overview.alerts_empty_title")).toBeTruthy();
  });

  it("navigates to the nodes page from Activate first node", async () => {
    getOverview.mockResolvedValue(overview({firstRun: true}));
    renderRoute(OverviewPage, "/dashboard");

    await screen.findByRole("dialog");
    fireEvent.click(screen.getByRole("button", {name: "overview.activate_first_node"}));

    expect(await screen.findByText("stub:/nodes")).toBeTruthy();
  });

  it("shows the error state and retries on demand", async () => {
    getOverview.mockRejectedValueOnce(new Error("down")).mockResolvedValue(overview());
    renderRoute(OverviewPage, "/dashboard");

    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(screen.getByText("overview.load_error_title")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", {name: "overview.retry"}));
    expect(await screen.findByText("overview.kpi_parcels")).toBeTruthy();
  });

  it("renders the populated dashboard with trend badges, alerts, and the activity feed", async () => {
    getOverview.mockResolvedValue(
      overview({
        kpis: {
          activeParcels: 847,
          parcelsDeltaPct: 2.3,
          nodesOnline: 142,
          nodesTotal: 158,
          nodesUptimePct: 90,
          couriersActive: 89,
          couriersRegistered: 114,
          couriersOffline: 25,
          revenueToday: 201892,
          revenueDeltaPct: 90,
        },
        deliveryRate: {today: 99.1, onTime: 94.2, late: 3.8, failed: 1.4},
        alerts: [
          {id: "a1", severity: "error", title: "Ikeja Node offline", description: "No heartbeat", at: "2024-01-01T00:00:00Z"},
          {id: "a2", severity: "warning", title: "Node LK-044 offline", description: "14 parcels affected", at: "2024-01-01T00:00:00Z"},
        ],
        activity: [
          {
            id: "ac1",
            tone: "success",
            title: "Delivered",
            detail: "PRV-88198 · Yaba node",
            at: new Date(Date.now() - 6 * 60_000).toISOString(),
          },
        ],
      })
    );
    renderRoute(OverviewPage, "/dashboard");

    await screen.findByText("847");
    expect(screen.getByText("+2.3%")).toBeTruthy();
    expect(screen.getByText("142/158")).toBeTruthy();
    expect(screen.getByText("201,892")).toBeTruthy();
    expect(screen.getByText("Ikeja Node offline")).toBeTruthy();
    expect(screen.getByText("Delivered")).toBeTruthy();
    expect(screen.queryByText("overview.alerts_empty_title")).toBeNull();
    expect(screen.queryByText("overview.activity_empty_title")).toBeNull();
  });

  it("dismisses an alert and restores the empty state when all are dismissed", async () => {
    getOverview.mockResolvedValue(
      overview({
        alerts: [{id: "a1", severity: "error", title: "Ikeja Node offline", description: "No heartbeat", at: "2024-01-01T00:00:00Z"}],
      })
    );
    renderRoute(OverviewPage, "/dashboard");

    expect(await screen.findByText("Ikeja Node offline")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "overview.alert_dismiss"}));

    expect(screen.queryByText("Ikeja Node offline")).toBeNull();
    expect(screen.getByText("overview.alerts_empty_title")).toBeTruthy();
  });

  it("switches the live-map filter tabs", async () => {
    getOverview.mockResolvedValue(overview());
    renderRoute(OverviewPage, "/dashboard");

    const nodesTab = await screen.findByRole("tab", {name: "overview.map_filter_nodes"});
    fireEvent.click(nodesTab);

    expect(nodesTab.getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tab", {name: "overview.map_filter_all"}).getAttribute("aria-selected")).toBe("false");
  });
});
