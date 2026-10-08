import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {adminsService} from "@/services/admins-service";
import type {AdminListParams} from "@/types/admins-types";

export const adminsQueryKey = (params: AdminListParams) => ["admins", "list", params] as const;
export const adminDetailQueryKey = (id: string) => ["admins", "detail", id] as const;
export const permissionCatalogQueryKey = ["admins", "permission-catalog"] as const;

/** Metrics + the filtered, paginated admin list. Previous page data stays while the next loads. */
export function useAdminsQuery(params: AdminListParams) {
  return useQuery({
    queryKey: adminsQueryKey(params),
    queryFn: () => adminsService.getAdmins(params),
    retry: false,
    placeholderData: keepPreviousData,
  });
}

/** The module/permission catalog behind the invite drawer and edit dialog — stable, cache forever. */
export function usePermissionCatalogQuery(enabled: boolean) {
  return useQuery({
    queryKey: permissionCatalogQueryKey,
    queryFn: () => adminsService.getPermissionCatalog(),
    retry: false,
    enabled,
    staleTime: Infinity,
  });
}

/** The drawer's account details + module access payload. */
export function useAdminDetailQuery(id: string | null) {
  return useQuery({
    queryKey: adminDetailQueryKey(id ?? ""),
    queryFn: () => adminsService.getAdminDetail(id ?? ""),
    retry: false,
    enabled: id !== null,
  });
}
