import {useQuery} from "@tanstack/react-query";
import {notificationsService} from "@/services/notifications-service";

export const notificationsKeys = {
  all: ["notifications"] as const,
};

export function useNotificationsQuery() {
  return useQuery({queryKey: notificationsKeys.all, queryFn: () => notificationsService.getNotifications()});
}
