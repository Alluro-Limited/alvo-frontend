import {useState} from "react";
import {BusinessProfileForm} from "@/components/settings/business-profile-form";
import {NotificationsPanel} from "@/components/settings/notifications-panel";
import {PasswordForm} from "@/components/settings/password-form";
import {SettingsTabs} from "@/components/settings/settings-tabs";
import {UserProfileForm} from "@/components/settings/user-profile-form";
import {useSetPageTitle} from "@/components/app-shell/page-title";
import {m} from "@/paraglide/messages";
import {useSettingsQuery} from "@/queries/use-settings-queries";
import type {SettingsTab} from "@/types/settings-types";

function SettingsSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[635px] animate-pulse flex-col items-center gap-6 pt-10">
      <div className="h-9 w-full max-w-[542px] rounded" />
      <div className="h-[585px] w-full rounded-xl border border-grey-200 bg-white" />
    </div>
  );
}

/** `/settings` — the 4-tab account settings page. */
export function SettingsPage() {
  useSetPageTitle(m["nav.settings"]());
  const {data: settings, isLoading} = useSettingsQuery();
  const [tab, setTab] = useState<SettingsTab>("user");

  if (isLoading || !settings) return <SettingsSkeleton />;

  return (
    <div className="flex flex-col items-center gap-6">
      <SettingsTabs active={tab} onChange={setTab} />
      {tab === "user" && <UserProfileForm key={settings.user.email} initial={settings.user} />}
      {tab === "business" && (
        <BusinessProfileForm key={settings.business.businessName} initial={settings.business} onBack={() => setTab("user")} />
      )}
      {tab === "notifications" && <NotificationsPanel prefs={settings.notifications} />}
      {tab === "security" && <PasswordForm />}
    </div>
  );
}
