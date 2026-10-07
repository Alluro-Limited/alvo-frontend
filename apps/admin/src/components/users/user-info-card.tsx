import {m} from "@/paraglide/messages";
import type {UserDetail} from "@/types/users-types";
import {InfoRow} from "@/components/workloads/info-row";
import {formatJoinedLong} from "./user-labels";

/** The "User Information" card — name, email, phone, joined date. */
export function UserInfoCard({detail}: {detail: UserDetail}) {
  return (
    <section className="rounded-lg bg-white p-4" aria-label={m["users.info_title"]()}>
      <h3 className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["users.info_title"]()}</h3>
      <div className="pt-2">
        <InfoRow label={m["users.info_full_name"]()}>{detail.name}</InfoRow>
        <InfoRow label={m["users.info_email"]()}>{detail.email}</InfoRow>
        <InfoRow label={m["users.info_phone"]()}>{detail.phone}</InfoRow>
        <InfoRow label={m["users.info_joined"]()}>{formatJoinedLong(detail.joinedAt)}</InfoRow>
      </div>
    </section>
  );
}
