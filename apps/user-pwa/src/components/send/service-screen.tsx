import {Button} from "@alvo/ui";
import {SendHeader} from "./send-header";
import {ServiceStep} from "./service-step";
import {m} from "@/paraglide/messages";
import heroUrl from "@/assets/send-hero.png";

/** Step 1 — full-bleed locker hero, "Send / How would you like to send?", and the two service cards. */
export function ServiceScreen({onBack, onNext}: {onBack: () => void; onNext: () => void}) {
  return (
    <main className="relative flex h-dvh w-full flex-col bg-white">
      <div className="relative h-[300px] w-full shrink-0 overflow-clip">
        <img src={heroUrl} alt="" aria-hidden="true" className="absolute size-full object-cover" />
      </div>
      <div className="absolute inset-x-0 top-0 px-6 pt-[63px]">
        <SendHeader onBack={onBack} />
      </div>
      <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-6 pt-8 pb-4">
        <div className="flex w-full flex-col gap-2">
          <h1 className="text-[32px] font-bold leading-[1.1] tracking-[-0.32px] text-foreground">{m["send.title"]()}</h1>
          <p className="text-[16px] leading-[1.4] tracking-[0.16px] text-grey-500">{m["send.service_desc"]()}</p>
        </div>
        <ServiceStep />
      </div>
      <div className="px-6 pb-[max(24px,env(safe-area-inset-bottom))]">
        <Button className="w-full text-[16px] font-medium" onClick={onNext}>
          {m["send.continue"]()}
        </Button>
      </div>
    </main>
  );
}
