import {LogOut} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {AdminProfile, ProfileOptions, UpdateProfileInput} from "@/types/profile-types";
import {ProfileNav, type ProfileTab} from "./profile-nav";
import {ProfileNotificationPanel} from "./profile-notification-panel";
import {ProfilePersonalPanel} from "./profile-personal-panel";
import {ProfileSecurityPanel} from "./profile-security-panel";
import {ProfileSessionsPanel} from "./profile-sessions-panel";

interface ProfileTabPanelProps {
  profile: AdminProfile;
  options: ProfileOptions | undefined;
  tab: ProfileTab;
  pending: {update: boolean; prefs: boolean; twofa: boolean; revoke: boolean};
  failedUpdate: boolean;
  onTab: (tab: ProfileTab) => void;
  onSaveProfile: (input: UpdateProfileInput) => void;
  onChangePassword: () => void;
  onToggle2fa: (enabled: boolean) => void;
  onSavePrefs: (prefs: AdminProfile["notifications"]) => void;
  onRevoke: (sessionId: string) => void;
  onSignOut: () => void;
}

/** The left nav (plus sign-out trigger) and the active tab's panel. */
export function ProfileTabPanel(props: ProfileTabPanelProps) {
  const {tab, onTab, onSignOut} = props;
  return (
    <div className="flex items-start gap-6">
      <div className="flex flex-col">
        <ProfileNav tab={tab} onTab={onTab} />
        <button
          type="button"
          onClick={onSignOut}
          className="mt-4 flex items-center gap-2 rounded-lg px-4 py-3 text-left text-sm leading-[1.4] tracking-[0.14px] text-status-fail hover:bg-status-fail-subtle"
        >
          <LogOut className="size-4" aria-hidden="true" />
          {m["nav.logout"]()}
        </button>
      </div>
      <ActivePanel {...props} />
    </div>
  );
}

function ActivePanel({
  profile,
  options,
  tab,
  pending,
  failedUpdate,
  onSaveProfile,
  onChangePassword,
  onToggle2fa,
  onSavePrefs,
  onRevoke,
}: ProfileTabPanelProps) {
  if (tab === "personal")
    return (
      <ProfilePersonalPanel profile={profile} options={options} saving={pending.update} failed={failedUpdate} onSave={onSaveProfile} />
    );
  if (tab === "security")
    return (
      <ProfileSecurityPanel profile={profile} toggling2fa={pending.twofa} onChangePassword={onChangePassword} onToggle2fa={onToggle2fa} />
    );
  if (tab === "notification") return <ProfileNotificationPanel profile={profile} saving={pending.prefs} onChange={onSavePrefs} />;
  return <ProfileSessionsPanel profile={profile} revoking={pending.revoke} onRevoke={onRevoke} />;
}
