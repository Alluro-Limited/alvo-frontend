import {m} from "@/paraglide/messages";
import {InfoRow} from "@/components/workloads/info-row";
import type {AssignmentDetail} from "@/types/assignment-types";
import {AssignmentTypePill} from "./assignment-type-pill";

/** The "Parcel Information" card — type, route ends, item count, and courier rows when assigned. */
export function AssignmentInfoCard({detail}: {detail: AssignmentDetail}) {
  return (
    <section className="rounded-lg bg-white p-4">
      <h2 className="pb-1 text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["assignment.info_title"]()}</h2>
      <InfoRow label={m["assignment.info_type"]()}>
        <AssignmentTypePill type={detail.type} />
      </InfoRow>
      <InfoRow label={m["assignment.info_pickup"]()}>{detail.pickup}</InfoRow>
      <InfoRow label={m["assignment.info_dropoff"]()}>{detail.dropoff}</InfoRow>
      <InfoRow label={m["assignment.info_items"]()}>
        {detail.items === 1 ? m["assignment.info_parcels_one"]({count: detail.items}) : m["assignment.info_parcels"]({count: detail.items})}
      </InfoRow>
      {detail.courier && (
        <>
          <InfoRow label={m["assignment.info_courier"]()}>{detail.courier.name}</InfoRow>
          <InfoRow label={m["assignment.info_courier_id"]()}>{detail.courier.code}</InfoRow>
          {detail.etaMin !== null && (
            <InfoRow label={m["assignment.info_eta"]()}>{m["assignment.eta_minutes"]({minutes: detail.etaMin})}</InfoRow>
          )}
        </>
      )}
    </section>
  );
}
