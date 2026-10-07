import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {usersService} from "@/services/users-service";
import type {UserParcelsParams} from "@/types/users-types";

export const userParcelsQueryKey = (id: string, params: UserParcelsParams) => ["users", "parcels", id, params] as const;

/** The drawer's "View all items" modal — filtered, paginated parcels sent by this user. */
export function useUserParcelsQuery(id: string | null, params: UserParcelsParams) {
  return useQuery({
    queryKey: userParcelsQueryKey(id ?? "", params),
    queryFn: () => usersService.getUserParcels(id ?? "", params),
    enabled: id !== null,
    retry: false,
    placeholderData: keepPreviousData,
  });
}
