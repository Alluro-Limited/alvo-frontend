import {useState} from "react";
import {Button, Dialog, DialogBackdrop, DialogPopup, DialogPortal} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {DeliveryType} from "@/types/assignment-types";
import type {CourierAssignmentStatus, CourierAssignmentsParams, CourierDetail} from "@/types/couriers-types";
import {TYPE_SHORT_LABELS} from "@/components/assignment/assignment-labels";
import {SelectShell} from "@/components/workloads/select-shell";
import {useParcelSelection} from "@/components/workloads/use-parcel-selection";
import {useCourierAssignmentsQuery} from "@/queries/use-courier-assignments-query";
import {HistoryBody} from "./courier-history-table";
import {CourierSearchField} from "./courier-search-field";
import {CourierStatusPill} from "./courier-status-pill";

const TYPE_OPTIONS: DeliveryType[] = ["node", "bulk", "express"];
const STATUS_OPTIONS: CourierAssignmentStatus[] = ["completed", "cancelled", "failed"];

interface CourierHistoryModalProps {
  detail: CourierDetail | null;
  open: boolean;
  exporting: boolean;
  onClose: () => void;
  /** Exports the modal's current filters — `ids` narrows to the checked rows. */
  onExport: (params: Omit<CourierAssignmentsParams, "page"> & {ids?: string[]}) => void;
}

/** Search/type/status/page state for the history table — any filter change returns to page 1. */
function useHistoryFilters() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const firstPage = (set: (v: string) => void) => (v: string) => {
    set(v);
    setPage(1);
  };
  return {
    params: {query: query.trim() || undefined, type: type || undefined, status: status || undefined, page} as CourierAssignmentsParams,
    filters: {query, type, status},
    filtered: query !== "" || type !== "" || status !== "",
    clear: () => {
      setQuery("");
      setType("");
      setStatus("");
      setPage(1);
    },
    onQuery: firstPage(setQuery),
    onType: firstPage(setType),
    onStatus: firstPage(setStatus),
    onPage: setPage,
  };
}

/** The wide "View assignment history" modal — searchable, type/status-filtered deliveries. */
export function CourierHistoryModal({detail, open, exporting, onClose, onExport}: CourierHistoryModalProps) {
  const history = useHistoryFilters();
  const {selected, toggleRow, toggleAll} = useParcelSelection();
  const assignments = useCourierAssignmentsQuery(open ? (detail?.id ?? null) : null, history.params);

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[960px] max-w-[calc(100vw-32px)] p-4">
          <ModalHeader
            detail={detail}
            exporting={exporting}
            onExport={() =>
              onExport({
                query: history.params.query,
                type: history.params.type,
                status: history.params.status,
                ids: selected.size > 0 ? [...selected] : undefined,
              })
            }
          />
          <ModalFilters filters={history.filters} onQuery={history.onQuery} onType={history.onType} onStatus={history.onStatus} />
          <HistoryBody
            filtered={history.filtered}
            assignments={assignments}
            selected={selected}
            onToggleRow={toggleRow}
            onToggleAll={toggleAll}
            onClear={history.clear}
            onPage={history.onPage}
          />
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}

function ModalHeader({detail, exporting, onExport}: {detail: CourierDetail | null; exporting: boolean; onExport: () => void}) {
  return (
    <div className="flex items-center justify-between gap-3 pb-3">
      <div>
        <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{detail?.id ?? ""}</p>
        <div className="flex items-center gap-2 pt-0.5">
          <p className="text-base leading-[1.4] font-medium text-black">{detail?.name ?? ""}</p>
          {detail && <CourierStatusPill status={detail.status} />}
        </div>
      </div>
      <Button variant="outline" isLoading={exporting} onClick={onExport}>
        {m["couriers.export"]()}
      </Button>
    </div>
  );
}

interface ModalFiltersProps {
  filters: {query: string; type: string; status: string};
  onQuery: (value: string) => void;
  onType: (value: string) => void;
  onStatus: (value: string) => void;
}

function ModalFilters({filters, onQuery, onType, onStatus}: ModalFiltersProps) {
  return (
    <div className="flex items-center gap-2 pb-3">
      <CourierSearchField value={filters.query} placeholder={m["couriers.history_search"]()} onQuery={onQuery} className="flex-1" />
      <SelectShell
        aria-label={m["couriers.history_type_label"]()}
        value={filters.type}
        onChange={onType}
        wrapperClassName="w-[170px] flex-none"
      >
        <option value="">{m["couriers.history_type_label"]()}</option>
        {TYPE_OPTIONS.map((value) => (
          <option key={value} value={value}>
            {TYPE_SHORT_LABELS[value]()}
          </option>
        ))}
      </SelectShell>
      <SelectShell
        aria-label={m["couriers.history_status_label"]()}
        value={filters.status}
        onChange={onStatus}
        wrapperClassName="w-[150px] flex-none"
      >
        <option value="">{m["couriers.history_status_label"]()}</option>
        {STATUS_OPTIONS.map((value) => (
          <option key={value} value={value}>
            {STATUS_LABELS[value]()}
          </option>
        ))}
      </SelectShell>
    </div>
  );
}

const STATUS_LABELS: Record<CourierAssignmentStatus, () => string> = {
  completed: m["couriers.history_status_completed"],
  cancelled: m["couriers.history_status_cancelled"],
  failed: m["couriers.history_status_failed"],
};
