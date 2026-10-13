import {useNavigate} from "@tanstack/react-router";
import {ChevronLeft} from "lucide-react";
import {Button} from "@alvo/ui";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";
import iconCheckUrl from "@/assets/icon-check.svg";

const NEXT_STEPS: SimpleMessage[] = ["cxl.next_1", "cxl.next_2", "cxl.next_3"];

/** Full-screen "Shipment Cancelled Successfully" result — refund note, next steps, and exit actions. */
export function CancelledScreen({onBack}: {onBack: () => void}) {
  const navigate = useNavigate();

  return (
    <main className="flex h-dvh w-full flex-col bg-white px-6 pt-[60px]">
      <button type="button" onClick={onBack} aria-label={m["auth.back"]()} className="flex size-8 items-center justify-center">
        <ChevronLeft className="size-6 text-foreground" aria-hidden="true" />
      </button>
      <div className="mt-12 flex w-full flex-col items-center gap-6">
        <img src={iconCheckUrl} alt="" aria-hidden="true" className="size-16" />
        <div className="flex w-full flex-col gap-2 text-center">
          <h1 className="text-[24px] font-bold leading-[1.2] text-foreground">{m["cxl.done_title"]()}</h1>
          <p className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["cxl.done_desc"]()}</p>
        </div>
        <div className="flex w-full flex-col gap-3 rounded-[12px] bg-[#f9f9f9] p-4">
          <span className="text-[16px] font-medium leading-[1.4] tracking-[0.16px] text-foreground">{m["cxl.next_title"]()}</span>
          <ul className="flex w-full list-disc flex-col gap-2 pl-5 marker:text-grey-500">
            {NEXT_STEPS.map((key) => (
              <li key={key} className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-600">
                {m[key]()}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-auto flex w-full flex-col gap-3 pb-[max(24px,env(safe-area-inset-bottom))]">
        <Button className="w-full text-[16px] font-medium" onClick={() => void navigate({to: "/send"})}>
          {m["cxl.new"]()}
        </Button>
        <button
          type="button"
          onClick={() => void navigate({to: "/home"})}
          className="flex h-[50px] w-full items-center justify-center rounded-[12px] bg-[#f2f2f2] text-[16px] font-medium leading-[1.4] text-foreground"
        >
          {m["cxl.home"]()}
        </button>
      </div>
    </main>
  );
}
