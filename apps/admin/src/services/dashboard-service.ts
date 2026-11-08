import type {DashboardService} from "@/types/dashboard-types";
import {httpDashboardService} from "./http-dashboard-service";

/** Dashboard Service service against the real API. */
export const dashboardService: DashboardService = httpDashboardService;
