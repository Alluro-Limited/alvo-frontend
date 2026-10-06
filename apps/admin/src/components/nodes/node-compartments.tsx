import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {CompartmentGroup, CompartmentSize} from "@/types/nodes-types";

const GROUP_TITLE: Record<CompartmentGroup["key"], () => string> = {
  pickup: m["nodes.compartment_pickup"],
  dropoff: m["nodes.compartment_dropoff"],
};

const SIZE_LABEL: Record<CompartmentSize, () => string> = {
  small: m["nodes.compartments_small"],
  medium: m["nodes.compartments_medium"],
  large: m["nodes.compartments_large"],
};

function UsageLine({group}: {group: CompartmentGroup}) {
  const pct = group.total === 0 ? 0 : Math.round((group.used / group.total) * 100);
  const text =
    group.unit === "kg"
      ? m["nodes.compartment_kg_used"]({used: group.used, total: group.total})
      : m["nodes.compartment_slots_used"]({used: group.used, total: group.total, pct});
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{GROUP_TITLE[group.key]()}</p>
        <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{text}</p>
      </div>
      <div className="h-2 overflow-clip rounded-full bg-grey-200">
        <div className={cn("h-full rounded-full", pct >= 90 ? "bg-status-fail" : "bg-primary-500")} style={{width: `${pct}%`}} />
      </div>
      {group.breakdown.length > 0 && (
        <div className="flex gap-2">
          {group.breakdown.map((chip) => (
            <span key={chip.size} className="rounded-md bg-grey-100 px-2 py-1 text-xs leading-[1.4] tracking-[0.12px] text-grey-600">
              {SIZE_LABEL[chip.size]()} ·{" "}
              {chip.unit === "items"
                ? m["nodes.compartments_items"]({count: chip.count})
                : m["nodes.compartments_slots"]({count: chip.count})}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** The compartment capacity card — pickup slots and the drop-off bay, each with a usage bar and size chips. */
export function NodeCompartments({groups}: {groups: CompartmentGroup[]}) {
  return (
    <section className="flex flex-col gap-5 rounded-lg border border-grey-200 bg-white p-6" aria-labelledby="node-compartments-title">
      <h2 id="node-compartments-title" className="text-base leading-[1.4] font-medium tracking-[0.16px] text-black">
        {m["nodes.compartments_title"]()}
      </h2>
      {groups.map((group) => (
        <UsageLine key={group.key} group={group} />
      ))}
    </section>
  );
}
