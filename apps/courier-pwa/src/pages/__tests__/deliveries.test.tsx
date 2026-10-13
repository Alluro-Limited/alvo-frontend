import {fireEvent, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {deliveriesService} from "@/services/deliveries-service";
import {homeService} from "@/services/home-service";
import {renderRoute} from "@/test/render-route";
import type {CompletedDelivery, DeliveriesOverview} from "@/types/deliveries-types";
import type {CourierJob} from "@/types/home-types";
import {DeliveriesPage} from "../deliveries";
import {AnalyticsPage} from "../analytics";

vi.mock("@/services/deliveries-service", () => ({
  deliveriesService: {getDeliveries: vi.fn(), getAnalytics: vi.fn()},
}));
vi.mock("@/services/home-service", () => ({
  homeService: {acceptJob: vi.fn(), declineJob: vi.fn()},
}));

const getDeliveries = vi.mocked(deliveriesService.getDeliveries);
const getAnalytics = vi.mocked(deliveriesService.getAnalytics);
const acceptJob = vi.mocked(homeService.acceptJob);
const declineJob = vi.mocked(homeService.declineJob);

function active(stage: CourierJob["stage"] = "assignment"): CourierJob {
  return {
    id: "PRI-4728123780",
    kind: "regular",
    stage,
    origin: "OSHODI",
    destination: "AJAH",
    payout: 4000,
    packages: 7,
    pickupTime: "17:50",
    eta: "19:05",
    duration: "1HR 15MIN",
    distanceKm: 3.5,
  };
}

function completed(id: string, kind: CompletedDelivery["kind"] = "regular"): CompletedDelivery {
  return {
    id,
    kind,
    payout: 2900,
    originNode: "Node P13, Lekki",
    destinationNode: "Node P08, Lekki",
    packages: 14,
    distanceKm: 3.4,
    dateLabel: "20th Dec, 2025 · 9:45",
  };
}

function overview(overrides: Partial<DeliveriesOverview> = {}): DeliveriesOverview {
  return {active: null, completed: [], ...overrides};
}

describe("DeliveriesPage", () => {
  beforeEach(() => {
    getDeliveries.mockReset().mockResolvedValue(overview());
    acceptJob.mockReset().mockResolvedValue(undefined);
    declineJob.mockReset().mockResolvedValue(undefined);
  });

  it("shows the empty milestone and completed-empty states", async () => {
    renderRoute(DeliveriesPage, "/deliveries");
    expect(await screen.findByText("deliveries.no_active")).toBeTruthy();
    expect(screen.getByText("deliveries.no_completed")).toBeTruthy();
    expect(screen.getByRole("link", {name: "deliveries.view_analytics"})).toBeTruthy();
  });

  it("lists completed deliveries and filters by kind", async () => {
    getDeliveries.mockResolvedValue(overview({completed: [completed("PRI-1"), completed("SPD-1", "speed")]}));
    renderRoute(DeliveriesPage, "/deliveries");
    expect(await screen.findByText("PRI-1")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", {name: "jobs.speed"}));
    expect(screen.queryByText("PRI-1")).toBeNull();
    expect(screen.getByText("SPD-1")).toBeTruthy();
  });

  it("shows the active job card and accepts through the dialog", async () => {
    getDeliveries.mockResolvedValue(overview({active: active()}));
    renderRoute(DeliveriesPage, "/deliveries");
    fireEvent.click(await screen.findByRole("button", {name: "home.accept"}));
    fireEvent.click(await screen.findByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", {name: "home.confirm_accept"}));
    await waitFor(() => expect(acceptJob).toHaveBeenCalledWith("PRI-4728123780"));
  });
});

describe("AnalyticsPage", () => {
  it("renders the stat cards and the job chart", async () => {
    getAnalytics.mockResolvedValue({
      allTimeJobs: 103,
      todayJobs: 2,
      allTimeEarnings: 145900,
      todayEarnings: 3200,
      weeklyJobs: [30, 55, 40, 65, 55, 75, 50],
    });
    renderRoute(AnalyticsPage, "/analytics");
    expect(await screen.findByText("₦145,900")).toBeTruthy();
    expect(screen.getByText("103 analytics.jobs")).toBeTruthy();
    expect(screen.getByText("analytics.job_chart")).toBeTruthy();
    expect(screen.getByText("Sat")).toBeTruthy();
  });
});
