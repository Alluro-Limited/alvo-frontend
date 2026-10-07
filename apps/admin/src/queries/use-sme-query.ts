import {useQuery} from "@tanstack/react-query";
import {smesService} from "@/services/smes-service";

export const smeQueryKey = (id: string) => ["smes", "detail", id] as const;

/** The SME drawer payload — contact/account rows, billing, verification items, batch history. */
export function useSmeQuery(id: string | null) {
  return useQuery({
    queryKey: smeQueryKey(id ?? ""),
    queryFn: () => smesService.getSmeDetail(id ?? ""),
    enabled: id !== null,
    retry: false,
  });
}
