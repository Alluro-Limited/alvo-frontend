import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {CircleCheck, LogOut, Pencil, Trash2} from "lucide-react";
import {PageHeader} from "@/components/account/page-header";
import {SignOutDialog} from "@/components/account/sign-out-dialog";
import {UpdateNameSheet} from "@/components/account/update-name-sheet";
import {UpdatePhoneSheet} from "@/components/account/update-phone-sheet";
import {useAccountQuery} from "@/queries/use-account-queries";
import type {UserProfile} from "@/types/account-types";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";

type EditTarget = "name" | "phone" | null;

/** Personal Information — editable profile rows (name/phone sheets), security, sign out, delete. */
export function PersonalInfoPage() {
  const query = useAccountQuery();
  const [editing, setEditing] = useState<EditTarget>(null);
  const profile = query.data?.profile;

  return (
    <main className="flex h-dvh w-full flex-col gap-6 overflow-y-auto bg-white px-6 pb-[max(32px,env(safe-area-inset-bottom))] pt-[60px]">
      <PageHeader title={m["pi.title"]()} />
      {query.isLoading || !profile ? (
        <div className="flex flex-col gap-4">
          <div className="skeleton h-40 w-full rounded-2xl" />
          <div className="skeleton h-20 w-full rounded-2xl" />
        </div>
      ) : (
        <InfoSections profile={profile} onEdit={setEditing} />
      )}
      <AccountActions />
      {profile ? (
        <>
          <UpdateNameSheet
            open={editing === "name"}
            firstName={profile.firstName}
            lastName={profile.lastName}
            onClose={() => setEditing(null)}
          />
          <UpdatePhoneSheet open={editing === "phone"} phone={profile.phone} onClose={() => setEditing(null)} />
        </>
      ) : null}
    </main>
  );
}

function AccountActions() {
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="mt-auto flex w-full flex-col gap-4 pt-6">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="flex items-center gap-2 text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-primary-500"
      >
        <LogOut className="size-5" aria-hidden="true" />
        {m["pi.sign_out"]()}
      </button>
      <button
        type="button"
        onClick={() => void navigate({to: "/account/delete"})}
        className="flex items-center gap-2 text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-status-fail"
      >
        <Trash2 className="size-5" aria-hidden="true" />
        {m["pi.delete"]()}
      </button>
      {confirming ? <SignOutDialog onClose={() => setConfirming(false)} /> : null}
    </div>
  );
}

function InfoSections({profile, onEdit}: {profile: UserProfile; onEdit: (t: Exclude<EditTarget, null>) => void}) {
  return (
    <>
      <section className="flex w-full flex-col gap-2">
        <h2 className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["pi.basic"]()}</h2>
        <div className="flex w-full flex-col rounded-[16px] bg-[#f9f9f9] p-4">
          <InfoRow label="pi.name" value={profile.name} onEdit={() => onEdit("name")} />
          <InfoRow label="pi.email" value={profile.email} verified={profile.emailVerified} />
          <InfoRow label="pi.phone" value={profile.phone ?? "-"} onEdit={() => onEdit("phone")} last />
        </div>
      </section>
      <section className="flex w-full flex-col gap-2">
        <h2 className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["pi.security"]()}</h2>
        <div className="flex w-full flex-col rounded-[16px] bg-[#f9f9f9] p-4">
          <InfoRow label="pi.password" value="••••••" last />
        </div>
      </section>
    </>
  );
}

interface InfoRowProps {
  label: SimpleMessage;
  value: string;
  verified?: boolean;
  onEdit?: () => void;
  last?: boolean;
}

function InfoRow({label, value, verified, onEdit, last}: InfoRowProps) {
  return (
    <div className={`flex w-full items-center gap-3 py-3 ${last ? "" : "border-b-[0.5px] border-grey-300"}`}>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{m[label]()}</span>
        <span className="truncate text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{value}</span>
      </div>
      {verified ? (
        <CircleCheck className="size-5 shrink-0 text-primary-500" aria-label={m["pi.verified"]()} />
      ) : onEdit ? (
        <button type="button" onClick={onEdit} aria-label={`${m["pi.edit"]()} ${m[label]()}`} className="text-primary-500">
          <Pencil className="size-5" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
