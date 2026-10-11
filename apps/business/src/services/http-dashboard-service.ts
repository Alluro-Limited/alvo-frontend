import {apiClient} from "@/services/api-client";
import type {AppNotification, DashboardOverview, DashboardService} from "@/types/dashboard-types";

/** Dashboard over the real backend. Endpoint paths are placeholders until the API exists. */
export const httpDashboardService: DashboardService = {
  getOverview: async () => apiClient.get("dashboard/overview").json<DashboardOverview>(),
  getNotifications: async () => apiClient.get("dashboard/notifications").json<AppNotification[]>(),
  markAllNotificationsRead: async () => {
    await apiClient.post("dashboard/notifications/mark-all-read");
  },
};
