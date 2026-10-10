import {useQuery} from "@tanstack/react-query";
import {usersService} from "@/services/users-service";

export const userQueryKey = (id: string) => ["users", "detail", id] as const;

/** The user drawer payload — info rows, wallet, stats, activity, flag/suspension records. */
export function useUserQuery(id: string | null) {
  return useQuery({
    queryKey: userQueryKey(id ?? ""),
    queryFn: () => usersService.getUserDetail(id ?? ""),
    enabled: id !== null,
    retry: false,
  });
}
