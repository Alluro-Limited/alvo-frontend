import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {CircleCheck, Info, LogOut, Trash2} from "lucide-react";
import {SignOutDialog} from "@/components/account/sign-out-dialog";
import {WizardHeader} from "@/components/sign-up/wizard-header";
import {m} from "@/paraglide/messages";
import {useProfileQuery} from "@/queries/use-earnings-queries";

function InfoRow({label, value}: {label: string; value: string}) {
  return (
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1">
        <p className="text-[12px] text-grey-600">{label}</p>
        <p className="mt-1 text-[14px]">{value}</p>
      </div>
      <CircleCheck className="size-4 shrink-0 text-primary-500" aria-hidden="true" />
    </div>
  );
}

/** Manage Profile target — read-only identity card plus account actions and the security banner. */
export function PersonalInfoPage() {
  const navigate = useNavigate();
  const profile = useProfileQuery();
  const [signOutOpen, setSignOutOpen] = useState(false);

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[430px] bg-white px-6 pt-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <WizardHeader step={0} onBack={() => void navigate({to: "/profile"})} />
      <h1 className="mt-9 text-[24px] leading-[30px] font-medium tracking-[-0.01em]">{m["account.personal"]()}</h1>
      <div className="mt-6 flex flex-col gap-6">
        <section className="flex flex-col gap-2">
          <h2 className="text-[14px] text-grey-500">{m["account.basic"]()}</h2>
          {profile.isPending || !profile.data ? (
            <div className="h-[179px] animate-pulse rounded-[8px] bg-grey-100" />
          ) : (
            <div className="flex flex-col gap-4 rounded-[8px] bg-grey-100 p-3">
              <InfoRow label={m["account.name"]()} value={profile.data.name} />
              <InfoRow label={m["account.email"]()} value={profile.data.email} />
              <InfoRow label={m["account.phone"]()} value={profile.data.phone} />
            </div>
          )}
        </section>
        <AccountActions onSignOut={() => setSignOutOpen(true)} />
        <aside className="flex flex-col gap-4 rounded-[12px] border-[0.5px] border-primary-500 bg-[#f2fcfd] p-4">
          <span className="grid size-9 place-items-center rounded-[8px] bg-primary-500">
            <Info className="size-6 text-white" aria-hidden="true" />
          </span>
          <p className="text-[14px] leading-[20px] text-primary-850/70">{m["account.security_note"]()}</p>
        </aside>
      </div>
      <SignOutDialog open={signOutOpen} onClose={() => setSignOutOpen(false)} />
    </main>
  );
}

function AccountActions({onSignOut}: {onSignOut: () => void}) {
  const navigate = useNavigate();

  return (
    <section className="rounded-[8px] bg-grey-100 px-3">
      <button type="button" onClick={onSignOut} className="flex h-12 w-full items-center gap-3 py-3 text-left text-[14px]">
        <LogOut className="size-5" aria-hidden="true" />
        {m["account.signout"]()}
      </button>
      <button
        type="button"
        onClick={() => void navigate({to: "/delete-account"})}
        className="flex h-12 w-full items-center gap-3 py-3 text-left text-[14px] text-status-fail-dark"
      >
        <Trash2 className="size-5" aria-hidden="true" />
        {m["account.delete"]()}
      </button>
    </section>
  );
}
