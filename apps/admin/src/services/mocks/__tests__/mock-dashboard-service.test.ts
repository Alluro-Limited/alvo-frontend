import {afterEach, beforeEach, describe, expect, it, vi} from "vite-plus/test";
import {MOCK_AUTH, mockAuthService} from "../mock-auth-service";
import {MOCK_DASHBOARD, mockDashboardService} from "../mock-dashboard-service";
import {MOCK_LATENCY_MS} from "../mock-http";
import {mockSession} from "../mock-session";

async function settle<T>(promise: Promise<T>) {
  const settled = promise.then((value) => value);
  await vi.advanceTimersByTimeAsync(MOCK_LATENCY_MS);
  return settled;
}

describe("mockDashboardService", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockSession.email = null;
    mockSession.pendingSetupEmail = null;
    mockSession.justActivated = false;
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("reports a normal sign-in as not first-run", async () => {
    await settle(mockAuthService.signIn({email: "ada@alvo.com", password: MOCK_AUTH.password}));

    const overview = await settle(mockDashboardService.getOverview());
    expect(overview.firstRun).toBe(false);
  });

  it("reports the welcome demo email as first-run", async () => {
    await settle(mockAuthService.signIn({email: MOCK_DASHBOARD.welcomeEmail, password: MOCK_AUTH.password}));

    expect((await settle(mockDashboardService.getOverview())).firstRun).toBe(true);
  });

  it("reports a freshly activated admin as first-run until sign-out", async () => {
    await settle(mockAuthService.signIn({email: MOCK_AUTH.invitedEmail, password: MOCK_AUTH.password}));
    await settle(mockAuthService.completeAccountSetup({firstName: "Ada", lastName: "Lovelace", password: "x"}));

    expect((await settle(mockDashboardService.getOverview())).firstRun).toBe(true);

    await settle(mockAuthService.signOut());
    expect((await settle(mockDashboardService.getOverview())).firstRun).toBe(false);
  });

  it("returns the empty overview for a fresh tenant", async () => {
    await settle(mockAuthService.signIn({email: MOCK_DASHBOARD.welcomeEmail, password: MOCK_AUTH.password}));

    const overview = await settle(mockDashboardService.getOverview());

    expect(overview.kpis).toEqual({
      activeParcels: 0,
      nodesOnline: 0,
      nodesTotal: 0,
      couriersActive: 0,
      couriersRegistered: 0,
      revenueToday: 0,
    });
    expect(overview.deliveryRate).toEqual({today: 99.1, onTime: 0, late: 0, failed: 0});
    expect(overview.map.nodes).toEqual([]);
    expect(overview.map.couriers).toEqual([]);
    expect(overview.alerts).toEqual([]);
    expect(overview.activity).toEqual([]);
  });

  it("returns the populated overview for an operating tenant", async () => {
    await settle(mockAuthService.signIn({email: "ada@alvo.com", password: MOCK_AUTH.password}));

    const overview = await settle(mockDashboardService.getOverview());

    expect(overview.firstRun).toBe(false);
    expect(overview.kpis.activeParcels).toBeGreaterThan(0);
    expect(overview.kpis.parcelsDeltaPct).toBeGreaterThan(0);
    expect(overview.map.nodes.length).toBeGreaterThan(0);
    expect(overview.map.nodes.every((node) => node.position.length === 2)).toBe(true);
    expect(overview.alerts.length).toBeGreaterThan(0);
    expect(overview.activity.length).toBeGreaterThan(0);
  });
});
