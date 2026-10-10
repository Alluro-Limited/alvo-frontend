import {m} from "@/paraglide/messages";
import type {PayoutStatus} from "@/types/payouts-types";
import {CourierSearchField} from "@/components/couriers/courier-search-field";
import {SelectShell} from "@/components/workloads/select-shell";
import {PAYOUT_STATUS_LABELS} from "./payout-labels";

interface PayoutsToolbarProps {
  query: string;
  status: string;
  statusOptions: PayoutStatus[];
  onQuery: (value: string) => void;
  onStatus: (value: string) => void;
}

/** The search field plus the status select inside the rounded strip above the table. */
export function PayoutsToolbar({query, status, statusOptions, onQuery, onStatus}: PayoutsToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white p-3">
      <CourierSearchField value={query} placeholder={m["payout.search_placeholder"]()} onQuery={onQuery} className="w-full max-w-[832px]" />
      <SelectShell aria-label={m["payout.col_status"]()} value={status} onChange={onStatus} wrapperClassName="w-[176px] flex-none">
        <option value="">{m["payout.filter_all"]()}</option>
        {statusOptions.map((value) => (
          <option key={value} value={value}>
            {PAYOUT_STATUS_LABELS[value]()}
          </option>
        ))}
      </SelectShell>
    </div>
  );
}
