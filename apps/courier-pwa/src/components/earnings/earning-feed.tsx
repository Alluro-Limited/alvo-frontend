import {Wallet} from "lucide-react";
import {EarningRow} from "@/components/earnings/earning-row";
import {m} from "@/paraglide/messages";
import type {EarningTxn} from "@/types/earnings-types";

interface EarningFeedProps {
  txns: EarningTxn[];
}

/** The Recent Activity list, or the centered "No earning yet" empty state. */
export function EarningFeed({txns}: EarningFeedProps) {
  if (txns.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-14">
        <span className="grid size-14 place-items-center rounded-full bg-grey-100">
          <Wallet className="size-7 text-grey-400" aria-hidden="true" />
        </span>
        <p className="text-[13px] text-grey-600">{m["earnings.none"]()}</p>
      </div>
    );
  }
  return (
    <div>
      {txns.map((txn) => (
        <EarningRow key={txn.id} txn={txn} />
      ))}
    </div>
  );
}
