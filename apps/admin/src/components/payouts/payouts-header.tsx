import {Button} from "@alvo/ui";
import {ArrowUp, Calendar} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {PayoutCycle} from "@/types/payouts-types";
import wlChevron from "@/assets/wl-chevron.svg";

interface PayoutsHeaderProps {
  cycles: PayoutCycle[];
  cycle: string;
  exporting: boolean;
  onCycle: (cycle: string) => void;
  onExport: () => void;
}

/** Page title plus the cycle date-range field and the teal Export action. */
export function PayoutsHeader({cycles, cycle, exporting, onCycle, onExport}: PayoutsHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-2xl leading-[1.2] font-bold tracking-[-0.24px] text-black">{m["payout.title"]()}</h1>
      <div className="flex items-center gap-6">
        <div className="relative w-[208px]">
          <Calendar className="pointer-events-none absolute top-1/2 left-4 size-[22px] -translate-y-1/2 text-grey-500" aria-hidden="true" />
          <select
            value={cycle}
            onChange={(event) => onCycle(event.target.value)}
            aria-label={m["payout.cycle_aria"]()}
            className="h-[38px] w-full cursor-pointer appearance-none rounded-lg border-[0.75px] border-grey-300 bg-white pr-9 pl-12 text-sm leading-[1.4] tracking-[0.14px] text-primary-900 outline-none focus:border-primary-500"
          >
            {cycles.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.label}
              </option>
            ))}
          </select>
          <img src={wlChevron} alt="" className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2" aria-hidden="true" />
        </div>
        <Button
          variant="default"
          isLoading={exporting}
          onClick={onExport}
          className="h-[38px] gap-1.5 rounded-lg px-4 text-sm font-medium tracking-[0.28px]"
        >
          <ArrowUp className="size-3.5" aria-hidden="true" />
          {m["payout.export"]()}
        </Button>
      </div>
    </div>
  );
}
