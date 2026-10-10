import type {DashboardService} from "@/types/dashboard-types";
import {httpDashboardService} from "./http-dashboard-service";
import {mockDashboardService} from "./mocks/mock-dashboard-service";

/** Same mock/HTTP split as auth: no `VITE_API_URL` means the local mock serves the dashboard. */
export const dashboardService: DashboardService = import.meta.env.VITE_API_URL ? httpDashboardService : mockDashboardService;
