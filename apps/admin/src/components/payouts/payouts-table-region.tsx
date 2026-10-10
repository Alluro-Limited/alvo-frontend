import type {PayoutListResponse} from "@/types/payouts-types";
import type {useParcelSelection} from "@/components/workloads/use-parcel-selection";
import type {usePayoutsFilters} from "./use-payouts-filters";
import type {usePayoutsOverlays} from "./use-payouts-overlays";
import {PayoutSelectionBar} from "./payout-selection-bar";
import {PayoutsList} from "./payouts-list";
import {PayoutsToolbar} from "./payouts-toolbar";

interface PayoutsTableRegionProps {
  filters: ReturnType<typeof usePayoutsFilters>;
  selection: ReturnType<typeof useParcelSelection>;
  overlays: ReturnType<typeof usePayoutsOverlays>;
  data: PayoutListResponse;
}

/** The toolbar (or black selection bar while rows are checked) plus the table below it. */
export function PayoutsTableRegion({filters, selection, overlays, data}: PayoutsTableRegionProps) {
  return (
    <div className="flex flex-col gap-4">
      {selection.selected.size > 0 ? (
        <PayoutSelectionBar count={selection.selected.size} onMarkPaid={overlays.openBatch} onClear={selection.clear} />
      ) : (
        <PayoutsToolbar
          query={filters.query}
          status={filters.status}
          statusOptions={data.filters.statuses}
          onQuery={filters.onQuery}
          onStatus={filters.onStatus}
        />
      )}
      <PayoutsList
        data={data}
        filtered={filters.filtered}
        selected={selection.selected}
        page={filters.page}
        onPage={filters.onPage}
        onToggleRow={selection.toggleRow}
        onToggleAll={(checked) =>
          selection.toggleAll(
            data.payouts.items.map((row) => row.courierId),
            checked
          )
        }
        onOpen={overlays.openDrawer}
        onClearFilter={filters.clearFilters}
      />
    </div>
  );
}
