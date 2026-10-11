import {m} from "@/paraglide/messages";
import {useBatchesQuery} from "@/queries/use-batch-queries";
import {useSetPageTitle} from "@/components/app-shell/page-title";
import {BatchesEmpty} from "@/components/batches/batches-empty";
import {BatchesStats} from "@/components/batches/batches-stats";
import {BatchesTable} from "@/components/batches/batches-table";
import {BatchFilterBar} from "@/components/batches/batch-filter";
import {useBatchList} from "@/components/batches/use-batch-list";

function TableSkeleton() {
  return (
    <div className="w-full animate-pulse overflow-clip rounded-3xl border border-grey-200">
      <div className="h-[52px] bg-[#f9f9f9]" />
      {[0, 1, 2, 3, 4].map((row) => (
        <div key={row} className="h-[52px] border-t-[0.75px] border-grey-300 bg-white" />
      ))}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {[0, 1, 2, 3].map((card) => (
        <div key={card} className="h-[118px] animate-pulse rounded-xl border border-grey-200 bg-white" />
      ))}
    </div>
  );
}

function BatchesContent() {
  const {data} = useBatchesQuery();
  const list = useBatchList(data?.batches ?? []);
  if (!data) {
    return (
      <>
        <StatsSkeleton />
        <TableSkeleton />
      </>
    );
  }
  if (data.batches.length === 0) return <BatchesEmpty />;
  return (
    <>
      <BatchesStats stats={data.stats} />
      <BatchFilterBar
        filter={list.filter}
        onFilter={list.setFilter}
        search={list.search}
        onSearch={list.setSearch}
        placeholder={m["batches.search_ph"]()}
        period={list.period}
        onPeriod={list.setPeriod}
      />
      <BatchesTable batches={list.filtered} />
    </>
  );
}

/** `/shipments` — the batches list: stat cards, filters, and the batches table. */
export function BatchesPage() {
  useSetPageTitle(m["batches.title"]());
  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-6">
      <BatchesContent />
    </div>
  );
}
