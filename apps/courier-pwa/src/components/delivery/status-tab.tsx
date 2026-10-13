import {BadgeCheck, Hourglass, PackageCheck, Truck} from "lucide-react";
import type {DeliveryDetail, DeliveryStatus} from "@/types/delivery-types";
import {m} from "@/paraglide/messages";
import {cn} from "cnfast";
import {StatusTimeline} from "./status-timeline";

const OPTIONS: {value: DeliveryStatus; label: () => string; desc: () => string; icon: typeof Truck}[] = [
  {value: "assigned", label: () => m["job.st_assigned"](), desc: () => m["job.st_assigned_desc"](), icon: BadgeCheck},
  {value: "in_transit", label: () => m["job.st_transit"](), desc: () => m["job.st_transit_desc"](), icon: Truck},
  {value: "delayed", label: () => m["job.st_delayed"](), desc: () => m["job.st_delayed_desc"](), icon: Hourglass},
  {value: "dropped_off", label: () => m["job.st_dropped"](), desc: () => m["job.st_dropped_desc"](), icon: PackageCheck},
];

interface StatusTabProps {
  delivery: DeliveryDetail;
  selected: DeliveryStatus;
  pending: boolean;
  onSelect: (s: DeliveryStatus) => void;
  onConfirm: () => void;
}

/** The "Update Delivery Status" radio card + the status history timeline. */
export function StatusTab({delivery, selected, pending, onSelect, onConfirm}: StatusTabProps) {
  return (
    <div className="mt-5 flex flex-col gap-5">
      <section className="rounded-[14px] bg-grey-50 p-4">
        <h2 className="text-[15px] font-semibold">{m["job.update_status"]()}</h2>
        <div className="mt-4 flex flex-col gap-4">
          {OPTIONS.map((o) => (
            <StatusOption key={o.value} option={o} active={selected === o.value} onSelect={() => onSelect(o.value)} />
          ))}
        </div>
        <button
          type="button"
          onClick={onConfirm}
          disabled={pending}
          className="mt-5 h-[50px] w-full rounded-[10px] bg-primary-500 text-[16px] font-semibold text-white disabled:bg-grey-300 disabled:text-grey-500"
        >
          {m["job.confirm_status"]()}
        </button>
      </section>
      <StatusTimeline entries={delivery.timeline} />
    </div>
  );
}

function StatusOption({option, active, onSelect}: {option: (typeof OPTIONS)[number]; active: boolean; onSelect: () => void}) {
  const Icon = option.icon;
  return (
    <button type="button" onClick={onSelect} aria-pressed={active} className="flex w-full items-center gap-3 text-left">
      <span className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-primary-50">
        <Icon className="size-4.5 text-primary-500" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold">{option.label()}</span>
        <span className="block text-[12px] text-grey-500">{option.desc()}</span>
      </span>
      <span
        aria-hidden="true"
        className={cn("grid size-5 shrink-0 place-items-center rounded-full border-2", active ? "border-primary-500" : "border-grey-300")}
      >
        {active && <span className="size-2.5 rounded-full bg-primary-500" />}
      </span>
    </button>
  );
}
