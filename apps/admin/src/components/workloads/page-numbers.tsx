import {cn} from "cnfast";
import {m} from "@/paraglide/messages";

/** Page list like the design's "1 2 3 … 10 11 12": leading pages, ellipsis, then the tail. */
function paginationRange(page: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) return Array.from({length: totalPages}, (_, i) => i + 1);
  const tail = [totalPages - 2, totalPages - 1, totalPages];
  if (page <= 3) return [1, 2, 3, "…", ...tail];
  if (page >= totalPages - 2) return [1, "…", ...tail];
  return [1, "…", page - 1, page, page + 1, "…", ...tail];
}

/** Numbered page buttons with the ellipsis pattern, used inside the pagination footer. */
export function PageNumbers({page, totalPages, onPage}: {page: number; totalPages: number; onPage: (page: number) => void}) {
  return (
    <div className="flex items-center gap-1">
      {paginationRange(page, totalPages).map((item, index) =>
        item === "…" ? (
          <span key={`ellipsis-${index}`} className="flex size-6 items-center justify-center text-sm text-grey-500">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={m["workloads.page_aria"]({page: item})}
            aria-current={item === page ? "page" : undefined}
            onClick={() => onPage(item)}
            className={cn(
              "flex size-6 items-center justify-center rounded text-sm leading-[1.4]",
              item === page ? "bg-primary-500 text-white" : "text-grey-600 hover:bg-grey-100"
            )}
          >
            {item}
          </button>
        )
      )}
    </div>
  );
}
