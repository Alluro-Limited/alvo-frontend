import type {DashboardService} from "@/types/dashboard-types";
import {httpDashboardService} from "./http-dashboard-service";
import {mockDashboardService} from "./mocks/mock-dashboard-service";

/**
 * There is no backend yet: without `VITE_API_URL`, dashboard data is served by the local mock.
 * Signing in as `demo@alvo.com` returns the populated design state; any other account is a fresh
 * empty dashboard. Setting the URL switches to HTTP.
 */
export const dashboardService: DashboardService = import.meta.env.VITE_API_URL ? httpDashboardService : mockDashboardService;
