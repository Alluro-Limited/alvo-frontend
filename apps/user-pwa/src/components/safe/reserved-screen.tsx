import {Copy} from "lucide-react";
import {useNavigate} from "@tanstack/react-router";
import {Button} from "@alvo/ui";
import {ReservedCard} from "./reserved-card";
import type {SafeReservation} from "@/types/safe-types";
import {m} from "@/paraglide/messages";
import iconCheckUrl from "@/assets/icon-check.svg";

interface ReservedScreenProps {
  reservation: SafeReservation;
  onOpenSafe: () => void;
  onOpenGuide: () => void;
}

function copyId(storageId: string) {
  void navigator.clipboard?.writeText(storageId).catch(() => undefined);
}

/** Post-reservation screen — success badge, storage ID + details card, support note, and exit actions. */
export function ReservedScreen({reservation, onOpenSafe, onOpenGuide}: ReservedScreenProps) {
  const navigate = useNavigate();

  return (
    <main className="flex h-dvh w-full flex-col overflow-y-auto bg-white px-6 pt-12 pb-[max(24px,env(safe-area-inset-bottom))]">
      <ReservedHeader storageId={reservation.storageId} />
      <div className="mt-4">
        <ReservedCard reservation={reservation} />
      </div>
      <div className="mt-4 flex w-full gap-2.5">
        <GreyAction>{m["safe.directions"]()}</GreyAction>
        <GreyAction onClick={onOpenGuide}>{m["safe.guide"]()}</GreyAction>
      </div>
      <ReservedSupport />
      <div className="mt-auto flex w-full gap-3 pt-6">
        <Button variant="outline" className="flex-1 text-[16px] font-medium" onClick={() => void navigate({to: "/home"})}>
          {m["safe.back_home"]()}
        </Button>
        <Button className="flex-1 text-[16px] font-medium" onClick={onOpenSafe}>
          {m["safe.open_now"]()}
        </Button>
      </div>
    </main>
  );
}

function ReservedHeader({storageId}: {storageId: string}) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <span className="flex size-16 items-center justify-center rounded-[160px] bg-grey-100">
        <img src={iconCheckUrl} alt="" aria-hidden="true" className="size-16" />
      </span>
      <div className="flex w-full flex-col gap-2 text-center">
        <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.32px] text-foreground">{m["safe.reserved_title"]()}</h1>
        <p className="text-[16px] leading-[1.4] tracking-[0.16px] text-grey-500">{m["safe.reserved_desc"]()}</p>
      </div>
      <span className="mt-2 flex items-center gap-2">
        <span className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["safe.storage_id"]()}</span>
        <span className="flex items-center gap-1">
          <span className="text-[16px] font-bold leading-[1.4] tracking-[0.16px] text-foreground">{`#${storageId}`}</span>
          <button
            type="button"
            onClick={() => copyId(storageId)}
            aria-label={m["send.copy"]()}
            className="flex size-6 items-center justify-center"
          >
            <Copy className="size-5 text-foreground" aria-hidden="true" />
          </button>
        </span>
      </span>
    </div>
  );
}

const greyActionClass =
  "flex h-[50px] flex-1 items-center justify-center rounded-[8px] bg-[#f2f2f2] px-5 text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-primary-500";

function GreyAction({children, onClick}: {children: string; onClick?: () => void}) {
  return (
    <button type="button" onClick={onClick} className={greyActionClass}>
      {children}
    </button>
  );
}

/** The "Need to make changes? / extend storage?" note plus the grey Chat with Support button. */
function ReservedSupport() {
  return (
    <div className="mt-4 flex w-full flex-col items-center gap-1 text-center">
      <p className="text-[14px] font-medium leading-[1.4] tracking-[0.14px] text-foreground">{m["safe.changes"]()}</p>
      <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-grey-500">{m["safe.support_desc"]()}</p>
      <p className="text-[12px] leading-[1.4] tracking-[0.12px] text-primary-500">{m["safe.extend"]()}</p>
      <button type="button" className={`mt-1 w-full ${greyActionClass}`}>
        {m["safe.chat"]()}
      </button>
    </div>
  );
}
