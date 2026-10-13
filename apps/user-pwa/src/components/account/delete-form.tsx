import {useRouter} from "@tanstack/react-router";
import {LoaderCircle} from "lucide-react";
import {Checkbox} from "@alvo/ui";
import {PasswordField} from "@/components/auth/password-field";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";

const CONSENTS: SimpleMessage[] = ["del.c1", "del.c2"];

interface DeleteFormProps {
  password: string;
  badPassword: boolean;
  consents: boolean[];
  pending: boolean;
  /** Password entered + both consent boxes ticked + no request in flight. */
  ready: boolean;
  onPassword: (v: string) => void;
  onConsent: (index: number, checked: boolean) => void;
  onSubmit: () => void;
}

/** The Confirm Password field, consent checkboxes, and the Cancel / Delete account buttons. */
export function DeleteForm({password, badPassword, consents, pending, ready, onPassword, onConsent, onSubmit}: DeleteFormProps) {
  const router = useRouter();

  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <PasswordField id="delete-password" label={m["del.password"]()} value={password} onChange={onPassword} error={badPassword} />
        {badPassword ? (
          <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-status-fail">{m["del.err_password"]()}</p>
        ) : (
          <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{m["del.password_help"]()}</p>
        )}
      </div>
      <div className="flex w-full flex-col gap-4">
        {CONSENTS.map((key, i) => (
          <div key={key} className="flex items-start gap-3">
            <Checkbox checked={consents[i]} onCheckedChange={(c) => onConsent(i, c === true)} aria-label={m[key]()} />
            <span className="text-[14px] leading-[1.4] tracking-[0.14px] text-foreground">{m[key]()}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto flex w-full flex-col gap-4 pt-6">
        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={() => router.history.back()}
            className="flex h-[50px] flex-1 items-center justify-center rounded-[12px] bg-[#f2f2f2] text-[16px] font-medium leading-[1.4] text-foreground"
          >
            {m["del.cancel"]()}
          </button>
          <button
            type="button"
            disabled={!ready}
            onClick={onSubmit}
            className="flex h-[50px] flex-1 items-center justify-center gap-2 rounded-[12px] bg-status-fail text-[16px] font-medium leading-[1.4] text-white disabled:opacity-40"
          >
            {pending ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : null}
            {m["del.confirm"]()}
          </button>
        </div>
        <p className="text-center text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{m["del.privacy"]()}</p>
      </div>
    </>
  );
}
