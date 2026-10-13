import {Check} from "lucide-react";
import {cn} from "cnfast";
import mailIconUrl from "@/assets/icon-mail.svg";
import smsIconUrl from "@/assets/icon-sms.svg";
import whatsappIconUrl from "@/assets/icon-whatsapp.svg";
import type {SimpleMessage} from "@/lib/i18n";
import type {VerificationMethod} from "@/types/auth-types";
import {m} from "@/paraglide/messages";

interface MethodStepProps {
  value: VerificationMethod | null;
  onChange: (method: VerificationMethod) => void;
}

export const METHODS: {id: VerificationMethod; labelKey: SimpleMessage; icon: string}[] = [
  {id: "email", labelKey: "su.via_email", icon: mailIconUrl},
  {id: "sms", labelKey: "su.via_sms", icon: smsIconUrl},
  {id: "whatsapp", labelKey: "su.via_whatsapp", icon: whatsappIconUrl},
];

/** Step 2 — Email / SMS / WhatsApp radio rows. */
export function MethodStep({value, onChange}: MethodStepProps) {
  return (
    <div className="flex w-full flex-col gap-3" role="radiogroup" aria-label={m["su.verify_title"]()}>
      {METHODS.map((method) => {
        const selected = value === method.id;
        return (
          <button
            key={method.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(method.id)}
            className="flex w-full items-center gap-2 border-b-[0.5px] border-grey-200 py-3 text-left"
          >
            <img src={method.icon} alt="" aria-hidden="true" className="size-5" />
            <span className="flex-1 text-[16px] font-medium leading-[1.4] tracking-[0.16px] text-foreground">{m[method.labelKey]()}</span>
            <span
              aria-hidden="true"
              className={cn(
                "flex size-5 items-center justify-center rounded-full border",
                selected ? "border-primary-500 bg-primary-500 text-white" : "border-grey-300 bg-white"
              )}
            >
              {selected ? <Check className="size-3" strokeWidth={3} aria-hidden="true" /> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
