import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {dashboardService} from "@/services/dashboard-service";

export const dashboardKeys = {
  overview: ["dashboard", "overview"] as const,
  notifications: ["dashboard", "notifications"] as const,
};

export function useDashboardOverview() {
  return useQuery({queryKey: dashboardKeys.overview, queryFn: dashboardService.getOverview});
}

export function useNotifications() {
  return useQuery({queryKey: dashboardKeys.notifications, queryFn: dashboardService.getNotifications});
}

/** Marks every notification read and refreshes the list so unread dots clear. */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dashboardService.markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries({queryKey: dashboardKeys.notifications}),
  });
}
