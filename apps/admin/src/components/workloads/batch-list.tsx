import {m} from "@/paraglide/messages";
import type {BatchTag, WorkloadListResponse} from "@/types/workloads-types";
import wlEmptyBox from "@/assets/wl-empty-box.svg";
import {BatchCard} from "./batch-card";
import {BATCH_TAG_LABELS} from "./batch-tag-labels";
import {WorkloadsEmpty} from "./workloads-empty";
import {WorkloadsMetrics} from "./workloads-metrics";
import {WorkloadsPagination} from "./workloads-pagination";
import {WorkloadsToolbar} from "./workloads-toolbar";

interface BatchListProps {
  data: WorkloadListResponse;
  filters: {query: string; status: string; location: string};
  onQuery: (v: string) => void;
  onStatus: (v: string) => void;
  onLocation: (v: string) => void;
  onPage: (page: number) => void;
}

/** Metrics strip + toolbar + batch cards + pagination for the Batches tab. */
export function BatchList({data, filters, onQuery, onStatus, onLocation, onPage}: BatchListProps) {
  const batches = data.batches;
  return (
    <>
      <WorkloadsMetrics metrics={data.metrics} />
      <WorkloadsToolbar
        query={filters.query}
        status={filters.status}
        location={filters.location}
        searchPlaceholder={m["workloads.search_placeholder_batches"]()}
        statusOptions={data.filters.statuses.map((id) => ({id, label: BATCH_TAG_LABELS[id as BatchTag]?.() ?? id}))}
        locationOptions={data.filters.locations}
        onQuery={onQuery}
        onStatus={onStatus}
        onLocation={onLocation}
      />
      {!batches || batches.items.length === 0 ? (
        <WorkloadsEmpty
          icon={wlEmptyBox}
          title={m["workloads.batch_empty_title"]()}
          description={m["workloads.batch_empty_description"]()}
        />
      ) : (
        <div className="overflow-clip rounded-lg bg-white">
          <div className="flex flex-col gap-3 p-4">
            {batches.items.map((batch) => (
              <BatchCard key={batch.id} batch={batch} />
            ))}
          </div>
          <WorkloadsPagination
            page={batches.page}
            pageSize={batches.pageSize}
            total={batches.total}
            itemCount={batches.items.length}
            noun={m["workloads.noun_batches"]()}
            onPage={onPage}
          />
        </div>
      )}
    </>
  );
}
