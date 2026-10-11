import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {settingsService} from "@/services/settings-service";

export const settingsKeys = {
  all: ["settings"] as const,
  account: () => [...settingsKeys.all, "account"] as const,
};

export function useSettingsQuery() {
  return useQuery({queryKey: settingsKeys.account(), queryFn: settingsService.getSettings});
}

export function useUpdateUserProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsService.updateUserProfile,
    onSuccess: () => void queryClient.invalidateQueries({queryKey: settingsKeys.all}),
  });
}

export function useUpdateBusinessProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsService.updateBusinessProfile,
    onSuccess: () => void queryClient.invalidateQueries({queryKey: settingsKeys.all}),
  });
}

export function useUpdateNotificationsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsService.updateNotifications,
    onSuccess: () => void queryClient.invalidateQueries({queryKey: settingsKeys.all}),
  });
}

export function useChangePasswordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: settingsService.changePassword,
    onSuccess: () => void queryClient.invalidateQueries({queryKey: settingsKeys.all}),
  });
}
