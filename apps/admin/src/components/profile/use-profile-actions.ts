import {useNavigate} from "@tanstack/react-router";
import {m} from "@/paraglide/messages";
import type {AdminProfile, ChangePasswordInput, UpdateProfileInput} from "@/types/profile-types";
import {
  useChangePasswordMutation,
  useNotificationPrefsMutation,
  useRevokeSessionMutation,
  useTwoFactorMutation,
  useUpdateProfileMutation,
} from "@/queries/use-profile-queries";
import {useSignOutMutation} from "@/queries/use-sign-out-mutation";
import {passwordErrorKind} from "./change-password-dialog";
import type {useProfileOverlays} from "./use-profile-overlays";

type Overlays = ReturnType<typeof useProfileOverlays>;

/** Every profile mutation wired to its overlay/toast feedback. */
export function useProfileActions(overlays: Overlays) {
  const navigate = useNavigate();
  const updateProfile = useUpdateProfileMutation();
  const changePassword = useChangePasswordMutation();
  const notificationPrefs = useNotificationPrefsMutation();
  const twoFactor = useTwoFactorMutation();
  const revokeSession = useRevokeSessionMutation();
  const signOut = useSignOutMutation();

  const saveProfile = (input: UpdateProfileInput) =>
    updateProfile.mutate(input, {onSuccess: () => overlays.showToast(m["profile.toast_saved"]())});

  const submitPassword = (input: ChangePasswordInput) =>
    changePassword.mutate(input, {
      onSuccess: () => {
        overlays.closePassword();
        overlays.showToast(m["profile.toast_password"]());
      },
      onError: (error) => overlays.setPasswordError(passwordErrorKind(error)),
    });

  const revoke = (sessionId: string) =>
    revokeSession.mutate(sessionId, {onSuccess: () => overlays.showToast(m["profile.toast_session_revoked"]())});

  const confirmSignOut = () => signOut.mutate(undefined, {onSettled: () => void navigate({to: "/"})});

  return {
    saveProfile,
    submitPassword,
    savePrefs: (prefs: AdminProfile["notifications"]) => notificationPrefs.mutate(prefs),
    toggle2fa: (enabled: boolean) => twoFactor.mutate(enabled),
    revoke,
    confirmSignOut,
    pending: {
      update: updateProfile.isPending,
      prefs: notificationPrefs.isPending,
      twofa: twoFactor.isPending,
      revoke: revokeSession.isPending,
      password: changePassword.isPending,
      signOut: signOut.isPending,
    },
    failedUpdate: updateProfile.isError,
  };
}
