import type {Page, ParcelRow} from "@/types/workloads-types";
import {WorkloadsPagination} from "./workloads-pagination";
import {WorkloadsTable, type WorkloadsTableVariant} from "./workloads-table";

interface ParcelTableRegionProps {
  parcels: Page<ParcelRow>;
  variant: WorkloadsTableVariant;
  noun: string;
  selected: ReadonlySet<string>;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onOpen: (id: string) => void;
  onPage: (page: number) => void;
}

/** The parcels table with its pagination footer — shared by the single-send list and the batch detail. */
export function ParcelTableRegion({parcels, variant, noun, selected, onToggleRow, onToggleAll, onOpen, onPage}: ParcelTableRegionProps) {
  return (
    <div className="overflow-clip rounded-lg bg-white">
      <WorkloadsTable
        rows={parcels.items}
        variant={variant}
        selected={selected}
        onToggleRow={onToggleRow}
        onToggleAll={onToggleAll}
        onOpen={onOpen}
      />
      <WorkloadsPagination
        page={parcels.page}
        pageSize={parcels.pageSize}
        total={parcels.total}
        itemCount={parcels.items.length}
        noun={noun}
        onPage={onPage}
      />
    </div>
  );
}
