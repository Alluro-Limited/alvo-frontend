import type {ReactNode} from "react";
import {m} from "@/paraglide/messages";
import {formatNairaAmount} from "@/lib/format";
import type {ParcelDetail} from "@/types/workloads-types";
import {formatSla} from "./workloads-format";

function InfoRow({label, children}: {label: string; children: ReactNode}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-grey-200 py-3 last:border-b-0">
      <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{label}</p>
      <div className="text-right text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{children}</div>
    </div>
  );
}

function CourierCell({courier}: {courier: NonNullable<ParcelDetail["courier"]>}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {courier.avatarUrl ? (
        <img src={courier.avatarUrl} alt="" className="size-6 rounded-full object-cover" />
      ) : (
        <span
          className="flex size-6 items-center justify-center rounded-full bg-grey-200 text-[10px] font-medium text-grey-600"
          aria-hidden="true"
        >
          {courier.name
            .split(" ")
            .map((part) => part[0])
            .join("")}
        </span>
      )}
      <span className="text-primary-500 underline">
        {courier.name} ({courier.id})
      </span>
    </span>
  );
}

/** The Parcel Information card inside the drawer — label/value rows straight from the detail payload. */
export function ParcelInfoCard({parcel}: {parcel: ParcelDetail}) {
  return (
    <section className="rounded-lg bg-white p-4" aria-label={m["workloads.info_title"]()}>
      <h3 className="pb-1 text-sm leading-[1.4] font-semibold tracking-[0.14px] text-black">{m["workloads.info_title"]()}</h3>
      <InfoRow label={m["workloads.info_sender"]()}>{parcel.sender}</InfoRow>
      <InfoRow label={m["workloads.info_recipient"]()}>{parcel.recipient}</InfoRow>
      <InfoRow label={m["workloads.info_courier"]()}>{parcel.courier ? <CourierCell courier={parcel.courier} /> : "—"}</InfoRow>
      <InfoRow label={m["workloads.info_route"]()}>
        {parcel.route.from} → {parcel.route.to}
      </InfoRow>
      <InfoRow label={m["workloads.info_size"]()}>{parcel.size}</InfoRow>
      <InfoRow label={m["workloads.info_charged"]()}>₦{formatNairaAmount(parcel.charged)}</InfoRow>
      <InfoRow label={m["workloads.info_sla"]()}>{formatSla(parcel.slaRemainingMin)}</InfoRow>
    </section>
  );
}
