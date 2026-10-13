import {useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {Checkbox} from "@alvo/ui";
import {DeleteOtpSheet} from "@/components/delete-account/delete-otp-sheet";
import {WizardHeader} from "@/components/sign-up/wizard-header";
import {m} from "@/paraglide/messages";
import {accountService} from "@/services/account-service";

const BULLETS = ["del.b1", "del.b2", "del.b3", "del.b4"] as const;
const CHECKS = ["del.check1", "del.check2"] as const;

/** Delete account — consequences list + both acknowledgement checkboxes before the OTP sheet. */
export function DeleteAccountPage() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState([false, false]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const allChecked = checked.every(Boolean);

  const openSheet = () => {
    setSheetOpen(true);
    void accountService.requestDeleteCode();
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white px-6 pt-[max(24px,env(safe-area-inset-top))] pb-[max(24px,env(safe-area-inset-bottom))]">
      <WizardHeader step={0} onBack={() => void navigate({to: "/personal-information"})} />
      <h1 className="mt-9 text-[24px] leading-[30px] font-medium tracking-[-0.01em]">{m["del.title"]()}</h1>
      <p className="mt-2 text-[16px] leading-[22px] text-grey-500">{m["del.desc"]()}</p>
      <ConsequencesList checked={checked} onChange={setChecked} />
      <div className="mt-auto flex flex-col gap-3">
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => void navigate({to: "/personal-information"})}
            className="h-[50px] w-[165px] rounded-[8px] bg-grey-200 text-[16px] font-medium"
          >
            {m["home.cancel"]()}
          </button>
          <button
            type="button"
            onClick={openSheet}
            disabled={!allChecked}
            className="h-[50px] flex-1 rounded-[8px] bg-status-fail text-[16px] font-medium text-white disabled:bg-grey-300 disabled:text-grey-500"
          >
            {m["del.delete"]()}
          </button>
        </div>
        <p className="text-center text-[11px] text-grey-500">{m["del.privacy"]()}</p>
      </div>
      <DeleteOtpSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </main>
  );
}

function ConsequencesList({checked, onChange}: {checked: boolean[]; onChange: (next: boolean[]) => void}) {
  return (
    <div className="mt-10 flex flex-col gap-6">
      <div>
        <h2 className="text-[16px] font-medium">{m["del.includes"]()}</h2>
        <ul className="mt-2 flex flex-col text-[14px] leading-[20px] text-grey-500">
          {BULLETS.map((key) => (
            <li key={key}>{`• ${m[key]()}`}</li>
          ))}
        </ul>
        <p className="mt-2 text-[14px] font-medium text-status-fail-dark">{m["del.irreversible"]()}</p>
      </div>
      <div className="flex flex-col gap-3">
        {CHECKS.map((key, i) => (
          <div key={key} className="flex items-start gap-2">
            <Checkbox
              checked={checked[i]}
              onCheckedChange={(v) => onChange(checked.map((c, j) => (j === i ? v === true : c)))}
              aria-label={m[key]()}
              className="mt-0.5 size-[22px] shrink-0"
            />
            <span className="text-[14px] leading-[20px] text-primary-850">{m[key]()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
