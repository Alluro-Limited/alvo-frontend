import {afterEach, describe, expect, it, vi} from "vite-plus/test";

type SentRequest = {method: string; url: string};

const OVERVIEW = {
  parcelsToday: "12",
  inTransit: "8",
  deliveredToday: "4",
  deliveryRate: {onTime: "40", late: "3", failed: "1"},
  activeNodes: "9",
  registeredNodes: "10",
  onlineCouriers: "7",
  slaAtRisk: "2",
};

const NODES = {
  nodes: [
    {id: "n1", code: "LK-1", name: "Lekki", lat: 6.5, lng: 3.4, status: "NODE_STATUS_AVAILABLE"},
    {id: "n2", code: "IK-2", name: "Ikeja", lat: 6.6, lng: 3.5, status: "NODE_STATUS_OFFLINE"},
  ],
};

const ALERTS = {
  alerts: [{kind: "ALERT_KIND_NODE_OFFLINE", targetId: "n2", targetRef: "IK-2", raisedAt: "2026-03-01T10:00:00Z", parcelsAffected: "3"}],
};
const ACTIVITY = {
  activity: [
    {id: "e1", actorRole: "ops_admin", action: "nodes:status:write", targetType: "node", targetId: "n2", createdAt: "2026-03-01T10:00:00Z"},
  ],
};

async function loadService() {
  vi.stubEnv("VITE_API_URL", "https://api.test/");
  const sent: SentRequest[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (request: Request) => {
      sent.push({method: request.method, url: request.url});
      const {pathname} = new URL(request.url);
      if (pathname.endsWith("/admin/overview")) return Response.json(OVERVIEW);
      if (pathname.endsWith("/admin/overview/alerts")) return Response.json(ALERTS);
      if (pathname.endsWith("/admin/overview/activity")) return Response.json(ACTIVITY);
      if (pathname.endsWith("/admin/nodes")) return Response.json(NODES);
      return new Response(null, {status: 404});
    })
  );
  vi.resetModules();
  const {httpDashboardService} = await import("../http-dashboard-service");
  return {service: httpDashboardService, sent};
}

describe("httpDashboardService", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("getOverview composes the overview, alerts, activity, and node markers", async () => {
    const {service, sent} = await loadService();

    const overview = await service.getOverview();
    const urls = sent.map((r) => new URL(r.url).pathname);
    expect(urls).toContain("/v1/admin/overview");
    expect(urls).toContain("/v1/admin/overview/alerts");
    expect(urls).toContain("/v1/admin/overview/activity");
    expect(urls).toContain("/v1/admin/nodes");

    expect(overview.kpis).toMatchObject({activeParcels: 8, nodesOnline: 9, nodesTotal: 10, couriersActive: 7});
    expect(overview.deliveryRate).toEqual({today: 4, onTime: 40, late: 3, failed: 1});
    expect(overview.map.nodes).toEqual([
      {id: "n1", status: "online", position: [3.4, 6.5]},
      {id: "n2", status: "offline", position: [3.5, 6.6]},
    ]);
    expect(overview.alerts).toHaveLength(1);
    expect(overview.alerts[0]).toMatchObject({severity: "error", title: "IK-2"});
    expect(overview.activity[0]).toMatchObject({title: "nodes:status:write"});
  });

  it("getNodeDetail reads one node and maps capacity", async () => {
    vi.stubEnv("VITE_API_URL", "https://api.test/");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          node: {
            id: "n1",
            code: "LK-1",
            name: "Lekki",
            lat: 6.5,
            lng: 3.4,
            status: "NODE_STATUS_AVAILABLE",
            capacity: {small: 4, medium: 4, large: 2},
            available: {small: 1, medium: 2, large: 1},
          },
        })
      )
    );
    vi.resetModules();
    const {httpDashboardService} = await import("../http-dashboard-service");

    const detail = await httpDashboardService.getNodeDetail("n1");
    expect(detail).toMatchObject({id: "n1", status: "online", capacityUsed: 6, capacityTotal: 10});
  });
});
