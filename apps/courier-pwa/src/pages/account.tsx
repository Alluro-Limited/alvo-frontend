import {Banknote, Bell, Car, ClipboardList, MessageCircle, Settings, SlidersHorizontal, User} from "lucide-react";
import {MenuCard} from "@/components/account/menu-card";
import {OptionItem} from "@/components/account/option-item";
import {ProfileCard} from "@/components/account/profile-card";
import {m} from "@/paraglide/messages";
import {useProfileQuery} from "@/queries/use-earnings-queries";

/** The Account tab: profile header, two option cards, and the app-version footer. */
export function AccountPage() {
  const profile = useProfileQuery();

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-white px-6 pt-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <h1 className="text-[32px] leading-[36px] font-bold tracking-[-0.01em]">{m["account.title"]()}</h1>
      <div className="mt-9 flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          {profile.isPending || !profile.data ? (
            <div className="h-[68px] animate-pulse rounded-[12px] bg-grey-100" />
          ) : (
            <ProfileCard profile={profile.data} />
          )}
          <div className="flex flex-col gap-6">
            <MenuCard icon={User} title={m["account.work"]()}>
              <OptionItem icon={Settings} label={m["account.manage"]()} to="/personal-information" />
              <OptionItem icon={Car} label={m["account.vehicle"]()} to="/vehicle" />
              <OptionItem icon={Banknote} label={m["account.financials"]()} to="/bank-account" />
            </MenuCard>
            <MenuCard icon={SlidersHorizontal} title={m["account.prefs"]()}>
              <OptionItem icon={Bell} label={m["nav.notifications"]()} to="/notification-settings" />
              <OptionItem icon={ClipboardList} label={m["account.legal"]()} to="/legal" />
              <OptionItem icon={MessageCircle} label={m["account.contact"]()} to="/support" />
            </MenuCard>
          </div>
        </div>
        <footer className="flex flex-col items-center pb-6 text-center text-[12px]">
          <p className="font-medium">AlvoGo</p>
          <p className="text-grey-600">V 1.0.0</p>
        </footer>
      </div>
    </main>
  );
}
