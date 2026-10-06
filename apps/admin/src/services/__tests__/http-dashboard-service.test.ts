import {afterEach, describe, expect, it, vi} from "vite-plus/test";

type SentRequest = {method: string; url: string};

const VALID_OVERVIEW = {
  firstRun: true,
  kpis: {activeParcels: 0, nodesOnline: 0, nodesTotal: 0, couriersActive: 0, couriersRegistered: 0, revenueToday: 0},
  deliveryRate: {today: 0, onTime: 0, late: 0, failed: 0},
  map: {
    nodes: [{id: "LK-1", status: "online", position: [3.4, 6.5]}],
    couriers: [],
    route: [],
  },
  alerts: [],
  activity: [],
};

async function loadService(response: () => Response) {
  vi.stubEnv("VITE_API_URL", "https://api.test/v1");
  const sent: SentRequest[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (request: Request) => {
      sent.push({method: request.method, url: request.url});
      return response();
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

  it("getOverview fetches and validates the overview payload", async () => {
    const {service, sent} = await loadService(() => Response.json(VALID_OVERVIEW));

    await expect(service.getOverview()).resolves.toEqual(VALID_OVERVIEW);
    expect(sent[0].method).toBe("GET");
    expect(sent[0].url).toBe("https://api.test/v1/dashboard/overview");
  });

  it("rejects an overview response that does not match the contract", async () => {
    const {service} = await loadService(() => Response.json({firstRun: "yes"}));

    await expect(service.getOverview()).rejects.toThrow();
  });
});
