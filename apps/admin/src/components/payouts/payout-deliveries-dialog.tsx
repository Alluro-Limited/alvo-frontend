import {useState} from "react";
import {Button, Dialog, DialogBackdrop, DialogClose, DialogPopup, DialogPortal, DialogTitle} from "@alvo/ui";
import {Package} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {DeliveryType} from "@/types/assignment-types";
import type {PayoutDeliveriesResponse, PayoutDelivery} from "@/types/payouts-types";
import {usePayoutDeliveriesQuery} from "@/queries/use-payouts-query";
import wlClose from "@/assets/wl-close.svg";
import {CourierSearchField} from "@/components/couriers/courier-search-field";
import {SelectShell} from "@/components/workloads/select-shell";
import {PageNumbers} from "@/components/workloads/page-numbers";
import {trackTypeLabel} from "@/components/couriers/courier-labels";
import {formatNairaAmount} from "@/lib/format";
import {DeliveriesTable} from "./payout-deliveries-table";

const DELIVERY_TYPES: DeliveryType[] = ["bulk", "node", "express"];
const DELIVERY_STATUSES = ["completed", "cancelled", "failed"] as const;

const DELIVERY_STATUS_LABELS: Record<PayoutDelivery["status"], () => string> = {
  completed: m["payout.status_completed"],
  cancelled: m["payout.status_cancelled"],
  failed: m["payout.status_failed"],
};

const PAGE_SIZE = 7;

interface PayoutDeliveriesDialogProps {
  courierId: string | null;
  courierName: string;
  cycle: string;
  onClose: () => void;
}

/** The wide View Deliveries modal — filterable, paginated assignment rows + the earned total. */
export function PayoutDeliveriesDialog({courierId, courierName, cycle, onClose}: PayoutDeliveriesDialogProps) {
  const [filters, setFilters] = useState({query: "", type: "", status: ""});
  const [page, setPage] = useState(1);
  const {data, isLoading, isError, refetch} = usePayoutDeliveriesQuery(courierId, cycle, {...filters, page});
  const reset = () => {
    setFilters({query: "", type: "", status: ""});
    setPage(1);
    onClose();
  };
  return (
    <Dialog open={courierId !== null} onOpenChange={(next) => !next && reset()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="flex max-h-[85vh] w-[920px] max-w-[calc(100vw-32px)] flex-col p-0">
          <DeliveriesHead courierName={courierName} />
          <DeliveriesFilters
            filters={filters}
            onChange={(next) => {
              setFilters(next);
              setPage(1);
            }}
          />
          <DeliveriesBody page={page} isLoading={isLoading} isError={isError} data={data} onPage={setPage} onRetry={() => refetch()} />
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}

function DeliveriesHead({courierName}: {courierName: string}) {
  return (
    <div className="flex items-center justify-between border-b border-grey-200 px-6 py-4">
      <div>
        <DialogTitle className="text-lg leading-[1.3] font-medium text-black">{m["payout.deliveries_title"]()}</DialogTitle>
        <p className="pt-0.5 text-sm text-grey-600">{courierName}</p>
      </div>
      <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["payout.close"]()}>
        <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
      </DialogClose>
    </div>
  );
}

function DeliveriesFilters({
  filters,
  onChange,
}: {
  filters: {query: string; type: string; status: string};
  onChange: (v: {query: string; type: string; status: string}) => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-grey-200 px-6 py-4">
      <CourierSearchField
        value={filters.query}
        placeholder={m["payout.deliveries_search"]()}
        onQuery={(v) => onChange({...filters, query: v})}
        className="w-full max-w-[420px]"
      />
      <SelectShell
        value={filters.type}
        onChange={(v) => onChange({...filters, type: v})}
        wrapperClassName="w-[180px] flex-none"
        aria-label={m["payout.deliveries_type_label"]()}
      >
        <option value="">{m["payout.deliveries_type_label"]()}</option>
        {DELIVERY_TYPES.map((value) => (
          <option key={value} value={value}>
            {trackTypeLabel(value)}
          </option>
        ))}
      </SelectShell>
      <SelectShell
        value={filters.status}
        onChange={(v) => onChange({...filters, status: v})}
        wrapperClassName="w-[160px] flex-none"
        aria-label={m["payout.deliveries_status_label"]()}
      >
        <option value="">{m["payout.deliveries_status_label"]()}</option>
        {DELIVERY_STATUSES.map((value) => (
          <option key={value} value={value}>
            {DELIVERY_STATUS_LABELS[value]()}
          </option>
        ))}
      </SelectShell>
    </div>
  );
}

interface DeliveriesBodyProps {
  page: number;
  isLoading: boolean;
  isError: boolean;
  data: PayoutDeliveriesResponse | undefined;
  onPage: (p: number) => void;
  onRetry: () => void;
}

function DeliveriesBody({page, isLoading, isError, data, onPage, onRetry}: DeliveriesBodyProps) {
  const rows = data?.deliveries.items ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.deliveries.total ?? 0) / PAGE_SIZE));
  return (
    <>
      <div className="min-h-[300px] flex-1 overflow-y-auto px-6">
        <DeliveriesRows isLoading={isLoading} isError={isError} rows={rows} onRetry={onRetry} />
      </div>
      {data && rows.length > 0 && (
        <div className="flex items-center justify-between border-t border-grey-200 px-6 py-3">
          <p className="text-sm font-bold tracking-[0.14px] text-primary-800">{`₦${formatNairaAmount(data.totalEarned)}`}</p>
          <PageNumbers page={page} totalPages={totalPages} onPage={onPage} />
        </div>
      )}
    </>
  );
}

function DeliveriesRows({
  isLoading,
  isError,
  rows,
  onRetry,
}: {
  isLoading: boolean;
  isError: boolean;
  rows: PayoutDelivery[];
  onRetry: () => void;
}) {
  if (isLoading) return <DeliveriesSkeleton />;
  if (isError) return <DeliveriesError onRetry={onRetry} />;
  if (rows.length === 0) return <DeliveriesEmpty />;
  return <DeliveriesTable rows={rows} />;
}

function DeliveriesError({onRetry}: {onRetry: () => void}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-sm font-medium text-black">{m["payout.deliveries_error"]()}</p>
      <Button variant="outline" className="h-9 px-4" onClick={onRetry}>
        {m["payout.retry"]()}
      </Button>
    </div>
  );
}

function DeliveriesEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <Package className="size-10 text-grey-300" aria-hidden="true" strokeWidth={1.25} />
      <p className="text-sm font-medium text-black">{m["payout.deliveries_empty_title"]()}</p>
      <p className="text-xs text-grey-500">{m["payout.deliveries_empty_description"]()}</p>
    </div>
  );
}

function DeliveriesSkeleton() {
  return (
    <div className="flex flex-col gap-3 py-2" data-testid="deliveries-skeleton">
      {Array.from({length: 6}, (_, index) => (
        <div key={index} className="h-12 rounded-lg bg-grey-100" />
      ))}
    </div>
  );
}
