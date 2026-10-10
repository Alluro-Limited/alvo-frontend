import {useMutation, useQueryClient} from "@tanstack/react-query";
import {usersService} from "@/services/users-service";
import type {FlagUsersInput} from "@/types/users-types";

/** Flags one or more user accounts for review, then refreshes user queries. */
export function useFlagUsersMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: FlagUsersInput) => usersService.flagUsers(input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["users"]}),
  });
}
