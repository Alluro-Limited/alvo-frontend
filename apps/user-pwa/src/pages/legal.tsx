import {FileText, Lock} from "lucide-react";
import {NavRow} from "@/components/account/nav-row";
import {PageHeader} from "@/components/account/page-header";
import {m} from "@/paraglide/messages";

/** Legal — the Terms and Conditions / Privacy Policy link rows. */
export function LegalPage() {
  return (
    <main className="flex h-dvh w-full flex-col gap-6 overflow-y-auto bg-white px-6 pb-[max(32px,env(safe-area-inset-bottom))] pt-[60px]">
      <PageHeader title={m["leg.title"]()} />
      <div className="flex w-full flex-col">
        <NavRow icon={FileText} label={m["leg.terms"]()} href="#" />
        <NavRow icon={Lock} label={m["leg.privacy"]()} href="#" last />
      </div>
    </main>
  );
}
