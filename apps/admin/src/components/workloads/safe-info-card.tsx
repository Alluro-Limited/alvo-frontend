import {m} from "@/paraglide/messages";
import {formatNairaAmount} from "@/lib/format";
import type {SafeItemDetail} from "@/types/workloads-types";
import {InfoRow} from "./info-row";
import {formatExpiresIn, formatSafeDate, formatStorageDuration} from "./workloads-format";

/** The "Safe Information" card — owner, node, item, size, charge, and booking window. */
export function SafeInfoCard({item}: {item: SafeItemDetail}) {
  return (
    <section className="rounded-lg bg-white p-4">
      <p className="mb-1 text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["workloads.safe_info_title"]()}</p>
      <InfoRow label={m["workloads.info_owner"]()}>{item.owner}</InfoRow>
      <InfoRow label={m["workloads.info_node"]()}>{item.node}</InfoRow>
      <InfoRow label={m["workloads.info_item"]()}>{item.item}</InfoRow>
      <InfoRow label={m["workloads.info_size"]()}>{item.size}</InfoRow>
      <InfoRow label={m["workloads.info_charged"]()}>{formatNairaAmount(item.charged)}</InfoRow>
      <InfoRow label={m["workloads.info_date"]()}>{formatSafeDate(item.storedAt)}</InfoRow>
      <InfoRow label={m["workloads.info_duration"]()}>{formatStorageDuration(item.storedAt)}</InfoRow>
      <InfoRow label={m["workloads.info_expires_in"]()}>{formatExpiresIn(item.expiresAt)}</InfoRow>
    </section>
  );
}
