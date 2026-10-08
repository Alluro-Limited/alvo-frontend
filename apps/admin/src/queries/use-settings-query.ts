import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {settingsService} from "@/services/settings-service";
import type {PlatformSettings} from "@/types/settings-types";

export const settingsQueryKey = ["settings"] as const;

/** Platform settings grouped by tab — single fetch for the whole page. */
export function useSettingsQuery() {
  return useQuery({
    queryKey: settingsQueryKey,
    queryFn: () => settingsService.getSettings(),
    retry: false,
  });
}

/** Persists the edited settings payload and refreshes the cached copy. */
export function useUpdateSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: PlatformSettings) => settingsService.updateSettings(settings),
    onSuccess: () => queryClient.invalidateQueries({queryKey: settingsQueryKey}),
  });
}
