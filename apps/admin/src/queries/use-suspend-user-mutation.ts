import {useMutation, useQueryClient} from "@tanstack/react-query";
import {usersService} from "@/services/users-service";
import type {SuspendUserInput} from "@/types/users-types";

interface SuspendInput {
  ids: string[];
  intent: "suspend" | "unsuspend";
  reason?: SuspendUserInput["reason"];
  notes?: string;
}

/** Suspends or reinstates one or more accounts, then refreshes user queries for pills and metrics. */
export function useSuspendUserMutation() {
  const queryClient = useQueryClient();
  return useMutation<string[], Error, SuspendInput>({
    mutationFn: async ({ids, intent, reason, notes}) => {
      await Promise.all(
        ids.map((id) =>
          intent === "suspend" ? usersService.suspendUser(id, {reason: reason ?? "other", notes}) : usersService.unsuspendUser(id, {notes})
        )
      );
      return ids;
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["users"]}),
  });
}
