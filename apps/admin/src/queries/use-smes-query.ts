import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {smesService} from "@/services/smes-service";
import type {SmeListParams} from "@/types/smes-types";

export const smesQueryKey = (params: SmeListParams) => ["smes", "list", params] as const;

/** Metrics + the filtered, paginated SME list. Previous page data stays while the next loads. */
export function useSmesQuery(params: SmeListParams) {
  return useQuery({
    queryKey: smesQueryKey(params),
    queryFn: () => smesService.getSmes(params),
    retry: false,
    placeholderData: keepPreviousData,
  });
}
