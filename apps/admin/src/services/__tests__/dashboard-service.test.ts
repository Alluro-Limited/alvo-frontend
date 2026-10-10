import {afterEach, describe, expect, it, vi} from "vite-plus/test";

async function loadDashboardService(apiUrl: string) {
  vi.stubEnv("VITE_API_URL", apiUrl);
  vi.resetModules();
  const [{dashboardService}, {httpDashboardService}, {mockDashboardService}] = await Promise.all([
    import("../dashboard-service"),
    import("../http-dashboard-service"),
    import("../mocks/mock-dashboard-service"),
  ]);
  return {dashboardService, httpDashboardService, mockDashboardService};
}

describe("dashboardService", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("uses the local mock while no backend URL is configured", async () => {
    const {dashboardService, mockDashboardService} = await loadDashboardService("");

    expect(dashboardService).toBe(mockDashboardService);
  });

  it("uses HTTP once a backend URL is configured", async () => {
    const {dashboardService, httpDashboardService} = await loadDashboardService("https://api.test/v1");

    expect(dashboardService).toBe(httpDashboardService);
  });
});
