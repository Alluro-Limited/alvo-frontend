import {useNavigate} from "@tanstack/react-router";
import {Button} from "@alvo/ui";
import {ConfirmedCard} from "./confirmed-card";
import type {SendBooking} from "@/types/send-types";
import {m} from "@/paraglide/messages";
import iconCheckUrl from "@/assets/icon-check.svg";

interface ConfirmedScreenProps {
  booking: SendBooking;
  onShowCode: () => void;
  onOpenGuide: () => void;
}

/** Post-booking screen — success badge, drop-off details card, support note, and the two exit actions. */
export function ConfirmedScreen({booking, onShowCode, onOpenGuide}: ConfirmedScreenProps) {
  const navigate = useNavigate();

  return (
    <main className="flex h-dvh w-full flex-col overflow-y-auto bg-white px-6 pt-12 pb-[max(24px,env(safe-area-inset-bottom))]">
      <div className="flex w-full flex-col items-center gap-3">
        <span className="flex size-16 items-center justify-center rounded-[160px] bg-grey-100">
          <img src={iconCheckUrl} alt="" aria-hidden="true" className="size-16" />
        </span>
        <div className="flex w-full flex-col gap-2 text-center">
          <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.32px] text-foreground">{m["send.confirmed_title"]()}</h1>
          <p className="text-[16px] leading-[1.4] tracking-[0.16px] text-grey-500">{m["send.confirmed_desc"]()}</p>
        </div>
      </div>
      <ConfirmedCard booking={booking} onOpenGuide={onOpenGuide} />
      <div className="mt-4 flex w-full flex-col items-center gap-1 text-center">
        <p className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{m["send.changes"]()}</p>
        <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{m["send.support_desc"]()}</p>
        <button type="button" className="mt-1 text-[16px] font-medium leading-[1.4] tracking-[0.32px] text-status-fail">
          {m["send.chat"]()}
        </button>
      </div>
      <div className="mt-auto flex w-full gap-3 pt-6">
        <Button variant="outline" className="flex-1 text-[16px] font-medium" onClick={() => void navigate({to: "/home"})}>
          {m["send.back_home"]()}
        </Button>
        <Button className="flex-1 text-[16px] font-medium" onClick={onShowCode}>
          {m["send.dropoff_now"]()}
        </Button>
      </div>
    </main>
  );
}
