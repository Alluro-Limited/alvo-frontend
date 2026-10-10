import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {usersService} from "@/services/users-service";
import type {UserListParams} from "@/types/users-types";

export const usersQueryKey = (params: UserListParams) => ["users", "list", params] as const;

/** Metrics + the filtered, paginated user list. Previous page data stays while the next loads. */
export function useUsersQuery(params: UserListParams) {
  return useQuery({
    queryKey: usersQueryKey(params),
    queryFn: () => usersService.getUsers(params),
    retry: false,
    placeholderData: keepPreviousData,
  });
}
