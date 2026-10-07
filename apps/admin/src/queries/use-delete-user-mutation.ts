import {useMutation, useQueryClient} from "@tanstack/react-query";
import {usersService} from "@/services/users-service";

/** Permanently deletes a user account, then refreshes user queries. */
export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersService.deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["users"]}),
  });
}
