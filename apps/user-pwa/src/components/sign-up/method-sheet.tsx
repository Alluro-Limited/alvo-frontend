import {AuthSheet} from "@/components/auth/auth-sheet";
import type {VerificationMethod} from "@/types/auth-types";
import {m} from "@/paraglide/messages";

interface MethodSheetProps {
  open: boolean;
  onClose: () => void;
  onPick: (method: VerificationMethod) => void;
  emailDest: string;
  phoneDest: string;
}

const ROWS: {id: VerificationMethod; labelKey: "su.method_email" | "su.method_sms" | "su.method_whatsapp"}[] = [
  {id: "email", labelKey: "su.method_email"},
  {id: "sms", labelKey: "su.method_sms"},
  {id: "whatsapp", labelKey: "su.method_whatsapp"},
];

/** "Choose another verification method" sheet listing each channel with its masked destination. */
export function MethodSheet({open, onClose, onPick, emailDest, phoneDest}: MethodSheetProps) {
  return (
    <AuthSheet open={open} onClose={onClose}>
      <div className="mt-6 flex w-full flex-col gap-4">
        <h2 className="w-full text-center text-[20px] font-medium leading-[1.2] text-foreground">{m["su.other_method"]()}</h2>
        <div className="flex w-full flex-col rounded-[8px]">
          {ROWS.map((row, i) => (
            <button
              key={row.id}
              type="button"
              onClick={() => onPick(row.id)}
              className={
                i < ROWS.length - 1 ? "flex w-full flex-col border-b border-grey-300 py-3 text-left" : "flex w-full flex-col py-3 text-left"
              }
            >
              <span className="w-full text-[16px] font-medium leading-[1.4] tracking-[0.16px] text-foreground">{m[row.labelKey]()}</span>
              <span className="w-full text-[14px] leading-[1.4] tracking-[0.14px] text-grey-600">
                {m["su.send_to"]({dest: row.id === "email" ? emailDest : phoneDest})}
              </span>
            </button>
          ))}
        </div>
      </div>
    </AuthSheet>
  );
}
