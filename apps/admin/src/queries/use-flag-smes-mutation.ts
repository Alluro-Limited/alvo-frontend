import {useMutation, useQueryClient} from "@tanstack/react-query";
import {smesService} from "@/services/smes-service";
import type {FlagSmesInput} from "@/types/smes-types";

/** Flags one or more SME accounts for review, then refreshes SME queries. */
export function useFlagSmesMutation() {
  const queryClient = useQueryClient();
  return useMutation<{ids: string[]}, Error, FlagSmesInput>({
    mutationFn: (input) => smesService.flagSmes(input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["smes"]}),
  });
}
