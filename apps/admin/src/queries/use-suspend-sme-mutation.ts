import {useMutation, useQueryClient} from "@tanstack/react-query";
import {smesService} from "@/services/smes-service";
import type {SuspendSmeInput} from "@/types/smes-types";

interface SuspendInput {
  ids: string[];
  intent: "suspend" | "unsuspend";
  reason?: SuspendSmeInput["reason"];
  notes?: string;
}

/** Suspends or reinstates one or more SME accounts, then refreshes SME queries for pills and metrics. */
export function useSuspendSmeMutation() {
  const queryClient = useQueryClient();
  return useMutation<string[], Error, SuspendInput>({
    mutationFn: async ({ids, intent, reason, notes}) => {
      await Promise.all(
        ids.map((id) =>
          intent === "suspend" ? smesService.suspendSme(id, {reason: reason ?? "other", notes}) : smesService.unsuspendSme(id, {notes})
        )
      );
      return ids;
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["smes"]}),
  });
}
