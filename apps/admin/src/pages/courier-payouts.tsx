import {useParcelSelection} from "@/components/workloads/use-parcel-selection";
import {PayoutsContent} from "@/components/payouts/payouts-content";
import {PayoutsHeader} from "@/components/payouts/payouts-header";
import {PayoutsOverlays} from "@/components/payouts/payouts-overlays";
import {usePayoutExport} from "@/components/payouts/use-payout-export";
import {usePayoutsFilters} from "@/components/payouts/use-payouts-filters";
import {usePayoutsOverlays} from "@/components/payouts/use-payouts-overlays";
import {usePayoutsQuery} from "@/queries/use-payouts-query";

/** Finance → Courier Payout — cycle picker, KPIs, issue cards, the payout table, and the payment flows. */
export function CourierPayoutsPage() {
  const filters = usePayoutsFilters();
  const selection = useParcelSelection();
  const overlays = usePayoutsOverlays();
  const list = usePayoutsQuery(filters.listParams);
  const exporter = usePayoutExport(filters.exportParams);
  const cycles = list.data?.cycles ?? [];

  return (
    <div className="flex flex-col gap-6">
      <PayoutsHeader
        cycles={cycles}
        cycle={filters.cycle}
        exporting={exporter.exporting}
        onCycle={(cycle) => {
          filters.onCycle(cycle);
          selection.clear();
        }}
        onExport={() => void exporter.exportPayouts()}
      />
      <PayoutsContent filters={filters} selection={selection} list={list} overlays={overlays} />
      <PayoutsOverlays overlays={overlays} selection={selection} data={list.data} cycle={filters.cycle} />
    </div>
  );
}
