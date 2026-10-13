import {X} from "lucide-react";
import {Button} from "@alvo/ui";
import {AuthSheet} from "@/components/auth/auth-sheet";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";

interface DropoffSheetProps {
  open: boolean;
  nodeName: string;
  onClose: () => void;
}

const STEPS: {title: SimpleMessage; desc: SimpleMessage; note?: SimpleMessage}[] = [
  {title: "send.step1_t", desc: "send.step1_d"},
  {title: "send.step2_t", desc: "send.step2_d"},
  {title: "send.step3_t", desc: "send.step3_d", note: "send.step3_note"},
  {title: "send.step4_t", desc: "send.step4_d"},
];

/** "How to Drop Off" sheet — the four numbered kiosk steps for the chosen node. */
export function DropoffSheet({open, nodeName, onClose}: DropoffSheetProps) {
  return (
    <AuthSheet open={open} onClose={onClose}>
      <div className="mt-2 flex max-h-[78dvh] w-full flex-col">
        <div className="flex w-full flex-col">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-[20px] font-medium leading-[1.2] text-foreground">{m["send.guide_title"]()}</h2>
            <button type="button" onClick={onClose} aria-label={m["loc.close"]()} className="flex size-8 items-center justify-center">
              <X className="size-[18px]" aria-hidden="true" />
            </button>
          </div>
          <p className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["send.guide_desc"]({node: nodeName})}</p>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex w-full items-center gap-4 border-b-[0.75px] border-grey-300 py-6 last:border-b-0">
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-500 text-[20px] font-medium leading-[1.2] text-white"
              >
                {i + 1}
              </span>
              <span className="flex min-w-0 flex-1 flex-col text-[#070d17]">
                <span className="text-[16px] font-medium leading-[1.4] tracking-[0.16px]">{m[step.title]()}</span>
                <span className="text-[12px] leading-[1.4] tracking-[0.12px] opacity-50">
                  {m[step.desc]()}
                  {step.note ? <> {m[step.note]()}</> : null}
                </span>
              </span>
            </div>
          ))}
        </div>
        <div className="flex w-full flex-col gap-3 pt-4">
          <Button className="w-full text-[16px] font-medium" onClick={onClose}>
            {m["send.got_it"]()}
          </Button>
          <Button variant="outline" className="w-full text-[16px] font-medium">
            {m["send.open_map"]()}
          </Button>
        </div>
      </div>
    </AuthSheet>
  );
}
