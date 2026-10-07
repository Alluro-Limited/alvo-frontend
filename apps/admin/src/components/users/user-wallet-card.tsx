import {m} from "@/paraglide/messages";
import type {UserDetail} from "@/types/users-types";
import {InfoRow} from "@/components/workloads/info-row";
import {formatNaira} from "./user-labels";

function StatBox({value, label}: {value: number; label: string}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 rounded-lg border border-grey-200 py-4">
      <span className="text-2xl leading-[1.3] font-medium text-black">{value}</span>
      <span className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{label}</span>
    </div>
  );
}

/** The "Wallet & Activity" card — balance/spent rows plus the sent/delivered stat boxes. */
export function UserWalletCard({detail}: {detail: UserDetail}) {
  return (
    <section className="rounded-lg bg-white p-4" aria-label={m["users.wallet_title"]()}>
      <h3 className="text-sm leading-[1.4] font-medium tracking-[0.14px] text-black">{m["users.wallet_title"]()}</h3>
      <div className="pt-2">
        <InfoRow label={m["users.wallet_balance"]()}>
          <span className="text-primary-500">{formatNaira(detail.walletBalanceKobo)}</span>
        </InfoRow>
        <InfoRow label={m["users.wallet_spent"]()}>{formatNaira(detail.totalSpentKobo)}</InfoRow>
      </div>
      <div className="flex gap-2 pt-3">
        <StatBox value={detail.parcelsSent} label={m["users.stat_parcels_sent"]()} />
        <StatBox value={detail.parcelsDelivered} label={m["users.stat_delivered"]()} />
      </div>
    </section>
  );
}
