import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {homeService} from "@/services/home-service";
import {notificationService} from "@/services/notification-service";

export const homeKeys = {
  area: ["home", "area"] as const,
  lockers: ["home", "lockers"] as const,
  locker: (id: string) => ["home", "locker", id] as const,
  areaSearch: (q: string) => ["home", "area-search", q] as const,
  notifications: ["notifications"] as const,
};

export function useAreaQuery() {
  return useQuery({queryKey: homeKeys.area, queryFn: () => homeService.getArea()});
}

export function useLockersQuery() {
  return useQuery({queryKey: homeKeys.lockers, queryFn: () => homeService.getLockers()});
}

export function useLockerQuery(id: string | null) {
  return useQuery({queryKey: homeKeys.locker(id ?? ""), queryFn: () => homeService.getLocker(id ?? ""), enabled: id !== null});
}

/** Enabled only while the sheet has a typed query; empty results drive the no-results state. */
export function useAreaSearchQuery(query: string) {
  return useQuery({
    queryKey: homeKeys.areaSearch(query),
    queryFn: () => homeService.searchAreas(query),
    enabled: query.trim().length >= 2,
  });
}

export function useSetAreaMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (area: string) => homeService.setArea(area),
    onSuccess: () => queryClient.invalidateQueries({queryKey: homeKeys.area}),
  });
}

export function useNotificationsQuery() {
  return useQuery({queryKey: homeKeys.notifications, queryFn: () => notificationService.getNotifications()});
}
