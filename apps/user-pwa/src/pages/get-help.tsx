import {Mail, MessageCircle} from "lucide-react";
import {NavRow} from "@/components/account/nav-row";
import {PageHeader} from "@/components/account/page-header";
import {InstagramLogo, XLogo} from "@/components/account/x-logo";
import {m} from "@/paraglide/messages";

/** Get Help — the support-channel link rows (email, socials, live chat). */
export function GetHelpPage() {
  return (
    <main className="flex h-dvh w-full flex-col gap-6 overflow-y-auto bg-white px-6 pb-[max(32px,env(safe-area-inset-bottom))] pt-[60px]">
      <PageHeader title={m["hlp.title"]()} />
      <div className="flex w-full flex-col">
        <NavRow icon={Mail} label={m["hlp.email"]()} href="mailto:support@alvo.com" />
        <NavRow icon={InstagramLogo} label={m["hlp.instagram"]()} href="#" />
        <NavRow icon={XLogo} label={m["hlp.x"]()} href="#" />
        <NavRow icon={MessageCircle} label={m["hlp.chat"]()} href="#" last />
      </div>
    </main>
  );
}
