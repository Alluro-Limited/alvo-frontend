import type {CourierRow} from "@/types/couriers-types";
import {CourierAvatar} from "./courier-avatar";
import {CourierStatusPill} from "./courier-status-pill";
import {CourierVehicleCell} from "./courier-vehicle-cell";
import {CourierVerificationPill} from "./courier-verification-pill";

/** One courier card in the map panel — avatar, id/name, vehicle + zone, status pill. */
export function CouriersMapCard({row, onOpen}: {row: CourierRow; onOpen: (id: string) => void}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(row.id)}
      className="flex w-full shrink-0 items-center gap-3 rounded-xl border border-grey-200 bg-white p-3 text-left transition-colors hover:bg-grey-100/60"
    >
      <CourierAvatar id={row.id} name={row.name} photoUrl={row.photoUrl} size="size-10" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{row.name}</span>
        <span className="block text-xs leading-[1.4] tracking-[0.12px] text-grey-500">
          {row.id} · {row.zone}
        </span>
        <span className="flex items-center gap-2 pt-1 text-xs leading-[1.4] tracking-[0.12px] text-grey-600">
          <CourierVehicleCell vehicle={row.vehicle} />
        </span>
      </span>
      {row.verification === "pending" ? <CourierVerificationPill verification="pending" /> : <CourierStatusPill status={row.status} />}
    </button>
  );
}
