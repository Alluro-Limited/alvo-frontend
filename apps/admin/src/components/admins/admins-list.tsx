import {Button} from "@alvo/ui";
import {PageNumbers} from "@/components/workloads/page-numbers";
import {m} from "@/paraglide/messages";
import type {AdminListResponse} from "@/types/admins-types";
import {AdminsTable} from "./admins-table";

interface AdminsListProps {
  data: AdminListResponse;
  filtered: boolean;
  selected: ReadonlySet<string>;
  page: number;
  onPage: (page: number) => void;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (checked: boolean) => void;
  onOpen: (id: string) => void;
  onClearFilter: () => void;
}

/** The table region — populated, empty, and filtered-empty states plus pagination. */
export function AdminsList({data, filtered, selected, page, onPage, onToggleRow, onToggleAll, onOpen, onClearFilter}: AdminsListProps) {
  const {items, total, pageSize} = data.admins;
  if (items.length === 0) {
    return filtered ? <FilteredEmpty onClear={onClearFilter} /> : <EmptyState />;
  }
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <AdminsTable rows={items} selected={selected} onToggleRow={onToggleRow} onToggleAll={onToggleAll} onOpen={onOpen} />
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <PageNumbers page={page} totalPages={totalPages} onPage={onPage} />
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      data-testid="admins-empty"
      className="flex flex-col items-center rounded-2xl border border-grey-200 bg-white px-6 py-16 text-center"
    >
      <p className="text-base leading-[1.4] font-medium text-black">{m["admins.empty_title"]()}</p>
      <p className="max-w-[380px] pt-2 text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{m["admins.empty_description"]()}</p>
    </div>
  );
}

function FilteredEmpty({onClear}: {onClear: () => void}) {
  return (
    <div
      data-testid="admins-filtered-empty"
      className="flex flex-col items-center rounded-2xl border border-grey-200 bg-white px-6 py-16 text-center"
    >
      <p className="text-base leading-[1.4] font-medium text-black">{m["admins.filtered_empty_title"]()}</p>
      <p className="pt-2 text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{m["admins.filtered_empty_description"]()}</p>
      <Button variant="outline" className="mt-4" onClick={onClear}>
        {m["admins.clear_filter"]()}
      </Button>
    </div>
  );
}
