import {Truck} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {PayoutListResponse} from "@/types/payouts-types";
import {WorkloadsPagination} from "@/components/workloads/workloads-pagination";
import {PayoutsTable} from "./payouts-table";

interface PayoutsListProps {
  data: PayoutListResponse;
  filtered: boolean;
  selected: ReadonlySet<string>;
  page: number;
  onPage: (page: number) => void;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onOpen: (id: string) => void;
  onClearFilter: () => void;
}

/** The table region — populated rows + pagination, the no-couriers empty state, or the filtered-empty state. */
export function PayoutsList({data, filtered, selected, page, onPage, onToggleRow, onToggleAll, onOpen, onClearFilter}: PayoutsListProps) {
  const rows = data.payouts.items;
  if (rows.length === 0) {
    return filtered ? <FilteredEmpty onClearFilter={onClearFilter} /> : <PayoutsEmpty />;
  }
  return (
    <div className="rounded-xl bg-white">
      <PayoutsTable rows={rows} selected={selected} onToggleRow={onToggleRow} onToggleAll={onToggleAll} onOpen={onOpen} />
      <WorkloadsPagination
        page={page}
        pageSize={data.payouts.pageSize}
        total={data.payouts.total}
        itemCount={rows.length}
        noun={m["payout.noun"]()}
        onPage={onPage}
      />
    </div>
  );
}

/** The "No Couriers Yet" state — truck icon + the Figma copy. */
function PayoutsEmpty() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 rounded-xl border border-grey-300 bg-white py-24"
      data-testid="payouts-empty"
    >
      <Truck className="size-14 text-grey-300" aria-hidden="true" strokeWidth={1.25} />
      <div className="text-center">
        <p className="text-lg font-semibold text-black">{m["payout.empty_title"]()}</p>
        <p className="mt-1 text-sm text-grey-500">{m["payout.empty_description"]()}</p>
      </div>
    </div>
  );
}

function FilteredEmpty({onClearFilter}: {onClearFilter: () => void}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-grey-300 bg-white py-20"
      data-testid="payouts-filtered-empty"
    >
      <p className="text-sm font-medium text-black">{m["payout.filtered_empty_title"]()}</p>
      <p className="text-xs text-grey-500">{m["payout.filtered_empty_description"]()}</p>
      <button
        type="button"
        onClick={onClearFilter}
        className="mt-2 h-8 rounded-md border border-primary-500 px-3 text-sm font-medium text-primary-500"
      >
        {m["payout.clear_filter"]()}
      </button>
    </div>
  );
}
