import {API_ERROR_CODES} from "@/lib/api-errors";
import type {DashboardService} from "@/types/dashboard-types";
import {mockDelay, mockHttpError} from "./mock-http";
import {COURIER_DETAILS, EMPTY_OVERVIEW, NODE_DETAILS, POPULATED_OVERVIEW} from "./mock-overview-data";
import {mockSession} from "./mock-session";

export const MOCK_DASHBOARD = {
  /** Sign in with this email to demo the welcome first-run without going through account setup. */
  welcomeEmail: "fresh@alvo.com",
} as const;

/** In-memory stand-in for the dashboard API while it does not exist. */
export const mockDashboardService: DashboardService = {
  getOverview: async () => {
    await mockDelay();
    const firstRun = mockSession.justActivated || mockSession.email === MOCK_DASHBOARD.welcomeEmail;
    return {...(firstRun ? EMPTY_OVERVIEW : POPULATED_OVERVIEW), firstRun};
  },
  getNodeDetail: async (id) => {
    await mockDelay();
    const detail = NODE_DETAILS[id];
    if (!detail) throw mockHttpError("dashboard/nodes", API_ERROR_CODES.NOT_FOUND);
    return detail;
  },
  getCourierDetail: async (id) => {
    await mockDelay();
    const detail = COURIER_DETAILS[id];
    if (!detail) throw mockHttpError("dashboard/couriers", API_ERROR_CODES.NOT_FOUND);
    return detail;
  },
};
