import {useState} from "react";
import {ChevronLeft} from "lucide-react";
import {cn} from "cnfast";
import {Button} from "@alvo/ui";
import {AccessCodeBlock} from "./code-block";
import {ExtendSheet} from "./extend-sheet";
import {PickupBody} from "./pickup-body";
import {ReactivateSheet} from "./reactivate-sheet";
import {VerifySheet} from "./verify-sheet";
import {DropoffSheet} from "@/components/send/dropoff-sheet";
import type {DeliveryDetail} from "@/types/activity-types";
import type {SimpleMessage} from "@/lib/i18n";
import {m} from "@/paraglide/messages";

/** The drop-off/pickup access screen — tabs over the QR + spelled-out code, with guide/extend/reactivate actions. */
export function AccessScreen({delivery, isFetching, onBack}: {delivery: DeliveryDetail; isFetching?: boolean; onBack: () => void}) {
  const [tab, setTab] = useState<"dropoff" | "pickup">("dropoff");
  const [guideOpen, setGuideOpen] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);
  const [reactivateOpen, setReactivateOpen] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);

  return (
    <main className="flex h-dvh w-full flex-col overflow-y-auto bg-white px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-[65px]">
      <button type="button" onClick={onBack} aria-label={m["auth.back"]()} className="flex size-8 items-center justify-center">
        <ChevronLeft className="size-6" aria-hidden="true" />
      </button>
      <div className="mt-8 flex w-full flex-col gap-2">
        <h1 className="text-[24px] font-medium leading-[1.2] tracking-[-0.24px] text-foreground">{m["acc.title"]()}</h1>
        <p className="text-[14px] leading-[1.4] tracking-[0.14px] text-grey-500">{m["send.code_desc"]()}</p>
      </div>
      <AccessTabs tab={tab} onChange={setTab} />
      {isFetching ? (
        <LoadingDots />
      ) : tab === "dropoff" ? (
        <DropoffBody delivery={delivery} onGuide={() => setGuideOpen(true)} onExtend={() => setExtendOpen(true)} />
      ) : (
        <PickupBody delivery={delivery} onReactivate={() => setReactivateOpen(true)} onVerify={() => setVerifyOpen(true)} />
      )}
      <DropoffSheet open={guideOpen} nodeName={delivery.origin} onClose={() => setGuideOpen(false)} />
      <ExtendSheet
        open={extendOpen}
        deliveryId={delivery.id}
        remaining={delivery.extensionsRemaining}
        onClose={() => setExtendOpen(false)}
      />
      <ReactivateSheet
        open={reactivateOpen}
        deliveryId={delivery.id}
        fee={delivery.pickupExtensionFee}
        onClose={() => setReactivateOpen(false)}
      />
      <VerifySheet open={verifyOpen} deliveryId={delivery.id} onClose={() => setVerifyOpen(false)} />
    </main>
  );
}

function LoadingDots() {
  return (
    <div className="flex flex-1 items-center justify-center gap-2" aria-busy="true" role="status">
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-2.5 animate-pulse rounded-full bg-grey-400" />
      ))}
    </div>
  );
}

function DropoffBody({delivery, onGuide, onExtend}: {delivery: DeliveryDetail; onGuide: () => void; onExtend: () => void}) {
  return (
    <>
      <AccessCodeBlock access={delivery.dropoffAccess} />
      <div className="mt-auto flex w-full gap-3 pt-8">
        <button
          type="button"
          onClick={onGuide}
          className="flex h-[50px] flex-1 items-center justify-center rounded-[8px] bg-[#f2f2f2] text-[14px] font-medium leading-[1.4] tracking-[0.28px] text-[#00221e]"
        >
          {m["acc.guide"]()}
        </button>
        <Button className="flex-1 text-[14px] font-medium" onClick={onExtend} disabled={delivery.extensionsRemaining <= 0}>
          {m["acc.extend"]()}
        </Button>
      </div>
    </>
  );
}

const TABS: {id: "dropoff" | "pickup"; label: SimpleMessage}[] = [
  {id: "dropoff", label: "acc.tab_drop"},
  {id: "pickup", label: "acc.tab_pick"},
];

function AccessTabs({tab, onChange}: {tab: "dropoff" | "pickup"; onChange: (t: "dropoff" | "pickup") => void}) {
  return (
    <div className="mt-6 flex w-full shrink-0">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            "flex flex-1 items-center justify-center border-b-2 pb-2 text-[14px] font-medium leading-[1.4] tracking-[0.14px]",
            tab === t.id ? "border-primary-500 text-primary-500" : "border-grey-300 text-grey-500"
          )}
        >
          {m[t.label]()}
        </button>
      ))}
    </div>
  );
}
