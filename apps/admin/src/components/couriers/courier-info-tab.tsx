import {m} from "@/paraglide/messages";
import type {CourierDetail} from "@/types/couriers-types";
import {InfoRow} from "@/components/workloads/info-row";
import {formatJoinedLong, VEHICLE_LABELS} from "./courier-labels";

/** The "Courier Information" card — identity, vehicle, and zone rows. */
export function CourierInfoTab({detail}: {detail: CourierDetail}) {
  return (
    <section className="rounded-lg bg-white p-4" aria-label={m["couriers.info_title"]()}>
      <h3 className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["couriers.info_title"]()}</h3>
      <div className="pt-2">
        <InfoRow label={m["couriers.info_full_name"]()}>{detail.fullName}</InfoRow>
        <InfoRow label={m["couriers.info_email"]()}>{detail.email}</InfoRow>
        <InfoRow label={m["couriers.info_phone"]()}>{detail.phone}</InfoRow>
        <InfoRow label={m["couriers.info_age"]()}>{detail.age}</InfoRow>
        <InfoRow label={m["couriers.info_nin"]()}>{detail.nin}</InfoRow>
        <InfoRow label={m["couriers.info_vehicle"]()}>{VEHICLE_LABELS[detail.vehicle]()}</InfoRow>
        <InfoRow label={m["couriers.info_brand"]()}>{detail.vehicleBrand}</InfoRow>
        <InfoRow label={m["couriers.info_plate"]()}>{detail.plateNumber}</InfoRow>
        <InfoRow label={m["couriers.info_zone"]()}>{detail.zone}</InfoRow>
        <InfoRow label={m["couriers.info_joined"]()}>{formatJoinedLong(detail.joinedAt)}</InfoRow>
      </div>
    </section>
  );
}
