import type {UseQueryResult} from "@tanstack/react-query";
import {Button} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {PayoutListResponse} from "@/types/payouts-types";
import type {useParcelSelection} from "@/components/workloads/use-parcel-selection";
import type {usePayoutsFilters} from "./use-payouts-filters";
import type {usePayoutsOverlays} from "./use-payouts-overlays";
import {PayoutIssuesCard} from "./payout-issues-card";
import {PayoutMetricsCards} from "./payout-metrics";
import {PayoutsTableRegion} from "./payouts-table-region";
import {PayoutsSkeleton} from "./payouts-skeleton";

export interface PayoutsContentProps {
  filters: ReturnType<typeof usePayoutsFilters>;
  selection: ReturnType<typeof useParcelSelection>;
  list: UseQueryResult<PayoutListResponse>;
  overlays: ReturnType<typeof usePayoutsOverlays>;
}

/** Everything under the page header — KPIs, the two issue cards, toolbar/selection bar, and the table. */
export function PayoutsContent({filters, selection, list, overlays}: PayoutsContentProps) {
  if (list.isPending) return <PayoutsSkeleton />;
  if (list.isError || !list.data) return <PayoutsError retrying={list.isRefetching} onRetry={() => void list.refetch()} />;
  const data = list.data;
  return (
    <div className="flex flex-col gap-6">
      <PayoutMetricsCards metrics={data.metrics} />
      <div className="flex gap-6">
        <PayoutIssuesCard
          kind="withheld"
          summary={data.withheld}
          onViewAll={() => filters.onStatus("withheld")}
          onReview={overlays.openDrawer}
        />
        <PayoutIssuesCard
          kind="flagged"
          summary={data.flagged}
          onViewAll={() => filters.onStatus("flagged")}
          onReview={overlays.openDrawer}
        />
      </div>
      <PayoutsTableRegion filters={filters} selection={selection} overlays={overlays} data={data} />
    </div>
  );
}

function PayoutsError({retrying, onRetry}: {retrying: boolean; onRetry: () => void}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-grey-300 bg-white py-20"
      data-testid="payouts-error"
    >
      <p className="text-sm font-medium text-black">{m["payout.error_title"]()}</p>
      <Button variant="outline" isLoading={retrying} onClick={onRetry} className="h-9 px-4">
        {m["payout.retry"]()}
      </Button>
    </div>
  );
}
