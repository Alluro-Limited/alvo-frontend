import type {AdminProfile, ProfileOptions} from "@/types/profile-types";
import {AppToast} from "@/components/app-toast";
import {ChangePasswordDialog} from "./change-password-dialog";
import {ProfileHeaderCard} from "./profile-header";
import {ProfileTabPanel} from "./profile-tab-panel";
import {SignOutDialog} from "./sign-out-dialog";
import {useProfileActions} from "./use-profile-actions";
import {useProfileOverlays} from "./use-profile-overlays";

/** The loaded profile surface — identity card, tab panels, both dialogs, and the toast. */
export function ProfileLoaded({profile, options}: {profile: AdminProfile; options: ProfileOptions | undefined}) {
  const overlays = useProfileOverlays();
  const actions = useProfileActions(overlays);

  return (
    <>
      <ProfileHeaderCard profile={profile} />
      <ProfileTabPanel
        profile={profile}
        options={options}
        tab={overlays.tab}
        pending={actions.pending}
        failedUpdate={actions.failedUpdate}
        onTab={overlays.setTab}
        onSaveProfile={actions.saveProfile}
        onChangePassword={overlays.openPassword}
        onToggle2fa={actions.toggle2fa}
        onSavePrefs={actions.savePrefs}
        onRevoke={actions.revoke}
        onSignOut={overlays.openSignOut}
      />
      <ChangePasswordDialog
        open={overlays.passwordOpen}
        submitting={actions.pending.password}
        error={overlays.passwordError}
        onClose={overlays.closePassword}
        onSubmit={actions.submitPassword}
      />
      <SignOutDialog
        open={overlays.signOutOpen}
        submitting={actions.pending.signOut}
        onClose={overlays.closeSignOut}
        onConfirm={actions.confirmSignOut}
      />
      {overlays.toast && <AppToast message={overlays.toast} variant="success" onDismiss={overlays.dismissToast} />}
    </>
  );
}
