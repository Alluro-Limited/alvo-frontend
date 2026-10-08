import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {profileService} from "@/services/profile-service";
import type {AdminProfile, ChangePasswordInput, UpdateProfileInput} from "@/types/profile-types";

export const profileQueryKey = ["profile"] as const;

/** The signed-in admin's profile — drives every profile tab. */
export function useProfileQuery() {
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: () => profileService.getProfile(),
    retry: false,
  });
}

/** Timezone/date-format options for the personal-info form. */
export function useProfileOptionsQuery() {
  return useQuery({
    queryKey: [...profileQueryKey, "options"],
    queryFn: () => profileService.getProfileOptions(),
    retry: false,
    staleTime: Infinity,
  });
}

/** Saves the personal-info form fields. */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => profileService.updateProfile(input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: profileQueryKey}),
  });
}

/** Verifies the current password and sets a new one — resets "last changed". */
export function useChangePasswordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => profileService.changePassword(input),
    onSuccess: () => queryClient.invalidateQueries({queryKey: profileQueryKey}),
  });
}

/** Email/push/SMS notification preference toggles. */
export function useNotificationPrefsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (prefs: AdminProfile["notifications"]) => profileService.updateNotificationPrefs(prefs),
    onSuccess: () => queryClient.invalidateQueries({queryKey: profileQueryKey}),
  });
}

/** The Security tab's two-factor toggle. */
export function useTwoFactorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enabled: boolean) => profileService.toggleTwoFactor(enabled),
    onSuccess: () => queryClient.invalidateQueries({queryKey: profileQueryKey}),
  });
}

/** Revokes a non-current session — the row disappears from the Session tab. */
export function useRevokeSessionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => profileService.revokeSession(sessionId),
    onSuccess: () => queryClient.invalidateQueries({queryKey: profileQueryKey}),
  });
}
