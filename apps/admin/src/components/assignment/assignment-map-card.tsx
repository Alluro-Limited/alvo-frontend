import {m} from "@/paraglide/messages";
import asnPackage from "@/assets/asn-package.svg";
import asnRoute from "@/assets/asn-route.svg";
import asnWheel from "@/assets/asn-wheel.svg";
import type {AssignmentRow} from "@/types/assignment-types";
import {AssignmentStatusPill} from "./assignment-status-pill";
import {AssignmentTypePill} from "./assignment-type-pill";

/** One floating-panel card — id, type/status pills, courier, route, items, and the ETA line. */
export function AssignmentMapCard({row, onOpen}: {row: AssignmentRow; onOpen: (id: string) => void}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(row.id)}
      className="flex w-full flex-col gap-1.5 rounded-xl bg-grey-100 p-3 text-left transition-colors hover:bg-grey-200"
      aria-label={row.id}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm leading-[1.4] font-semibold tracking-[0.14px] text-primary-600">{row.id}</span>
        <span className="flex items-center gap-1.5">
          <AssignmentTypePill type={row.type} />
          <AssignmentStatusPill status={row.status} />
        </span>
      </div>
      {row.courier && (
        <p className="flex items-center gap-1.5">
          <img src={asnWheel} alt="" className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate text-sm leading-[1.4] font-semibold tracking-[0.14px] text-grey-700">{row.courier.name}</span>
          <span className="shrink-0 text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{row.courier.code}</span>
        </p>
      )}
      <p className="flex items-center gap-1.5">
        <img src={asnRoute} alt="" className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="truncate text-sm leading-[1.4] tracking-[0.14px] text-grey-600">
          {row.pickup} → {row.dropoff}
        </span>
      </p>
      <p className="flex items-center gap-1.5">
        <img src={asnPackage} alt="" className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">
          {row.items === 1 ? m["assignment.map_items_one"]({count: row.items}) : m["assignment.map_items"]({count: row.items})}
        </span>
      </p>
      {row.etaMin !== null && row.distanceKm !== null && (
        <p className="pt-0.5 text-xs leading-[1.4] tracking-[0.12px] text-grey-500">
          {m["assignment.map_eta"]({minutes: row.etaMin, distance: row.distanceKm})}
        </p>
      )}
    </button>
  );
}
