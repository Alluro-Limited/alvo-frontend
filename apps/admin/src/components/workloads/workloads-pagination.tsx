import {m} from "@/paraglide/messages";
import {PageNumbers} from "./page-numbers";

interface WorkloadsPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  itemCount: number;
  noun: string;
  onPage: (page: number) => void;
}

/** Footer strip: "Showing 1–10 of 343 deliveries", page numbers, Previous/Next. */
export function WorkloadsPagination({page, pageSize, total, itemCount, noun, onPage}: WorkloadsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, from + itemCount - 1);
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-600">{m["workloads.showing"]({from_: from, to, total, noun})}</p>
      <PageNumbers page={page} totalPages={totalPages} onPage={onPage} />
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="h-9 w-[90px] rounded-md border border-grey-300 text-sm font-medium text-grey-600 disabled:opacity-40"
        >
          {m["workloads.previous"]()}
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
          className="h-9 w-[90px] rounded-md border border-primary-500 text-sm font-medium text-primary-500 disabled:opacity-40"
        >
          {m["workloads.next"]()}
        </button>
      </div>
    </div>
  );
}
