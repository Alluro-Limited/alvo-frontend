import {PackageOpen} from "lucide-react";
import {ChipRow} from "@/components/app/chip-row";
import type {CompletedDelivery} from "@/types/deliveries-types";
import type {JobKind} from "@/types/home-types";
import {m} from "@/paraglide/messages";
import {CompletedCard} from "./completed-card";

interface CompletedSectionProps {
  deliveries: CompletedDelivery[];
  filter: "all" | JobKind;
  onFilter: (f: "all" | JobKind) => void;
}

/** Chips + "Completed Deliveries · See all" header + the list (or the empty state). */
export function CompletedSection({deliveries, filter, onFilter}: CompletedSectionProps) {
  return (
    <>
      <div className="mt-6">
        <ChipRow
          value={filter}
          onChange={onFilter}
          options={[
            {value: "all", label: m["jobs.all"]()},
            {value: "regular", label: m["jobs.regular"]()},
            {value: "speed", label: m["jobs.speed"]()},
          ]}
        />
      </div>
      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-[14px] font-semibold">{m["deliveries.completed"]()}</h2>
        <p className="text-[13px] font-semibold text-primary-500">{m["job.see_all"]()}</p>
      </div>
      {deliveries.length === 0 ? (
        <div className="flex flex-col items-center py-14 text-grey-400">
          <PackageOpen className="size-9" strokeWidth={1.5} aria-hidden="true" />
          <p className="mt-3 text-[13px] font-medium text-grey-500">{m["deliveries.no_completed"]()}</p>
        </div>
      ) : (
        <div className="mt-2 pb-[max(24px,env(safe-area-inset-bottom))]">
          {deliveries.map((d) => (
            <CompletedCard key={d.id} delivery={d} />
          ))}
        </div>
      )}
    </>
  );
}
