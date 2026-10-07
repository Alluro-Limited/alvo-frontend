import {useMutation, useQueryClient} from "@tanstack/react-query";
import {couriersService} from "@/services/couriers-service";
import type {SuspendCourierInput} from "@/types/couriers-types";

interface SuspendInput {
  ids: string[];
  intent: "suspend" | "unsuspend";
  reason?: SuspendCourierInput["reason"];
  notes?: string;
}

/** Suspends or reinstates one or more couriers, then refreshes courier queries for pills and metrics. */
export function useSuspendCourierMutation() {
  const queryClient = useQueryClient();
  return useMutation<string[], Error, SuspendInput>({
    mutationFn: async ({ids, intent, reason, notes}) => {
      await Promise.all(
        ids.map((id) =>
          intent === "suspend"
            ? couriersService.suspendCourier(id, {reason: reason ?? "other", notes})
            : couriersService.unsuspendCourier(id, {notes})
        )
      );
      return ids;
    },
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["couriers"]}),
  });
}
