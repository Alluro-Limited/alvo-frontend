import {useState} from "react";
import type {UseQueryResult} from "@tanstack/react-query";
import {Button, Dialog, DialogBackdrop, DialogPopup, DialogPortal} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {Page, ParcelStatus} from "@/types/workloads-types";
import type {UserDetail, UserParcel, UserParcelsParams} from "@/types/users-types";
import wlEmptyBox from "@/assets/wl-empty-box.svg";
import wlSearch from "@/assets/wl-search.svg";
import {DrawerError} from "@/components/workloads/drawer-error";
import {DrawerSkeleton} from "@/components/workloads/drawer-skeleton";
import {ParcelStatusTag} from "@/components/workloads/parcel-status-tag";
import {FIELD_CLASSES, SelectShell} from "@/components/workloads/select-shell";
import {STATUS_LABELS} from "@/components/workloads/status-labels";
import {WorkloadsEmpty} from "@/components/workloads/workloads-empty";
import {WorkloadsPagination} from "@/components/workloads/workloads-pagination";
import {useUserParcelsQuery} from "@/queries/use-user-parcels-query";
import {UserStatusPill} from "./user-status-pill";

const CELL = "h-14 overflow-clip px-4 text-sm leading-[1.4] tracking-[0.14px] text-ellipsis whitespace-nowrap text-grey-600";
const HEAD_CELL = "h-12 px-4 text-left text-sm leading-[1.4] font-medium tracking-[0.14px] whitespace-nowrap text-black";

const HEADERS = [
  m["users.parcels_col_id"],
  m["users.parcels_col_recipient"],
  m["users.parcels_col_destination"],
  m["users.parcels_col_courier"],
  m["users.parcels_col_status"],
  m["users.parcels_col_sla"],
];

const PARCEL_STATUS_OPTIONS: ParcelStatus[] = ["pending_pickup", "in_transit", "delivered", "failed", "expired"];

interface UserParcelsModalProps {
  detail: UserDetail | null;
  open: boolean;
  exporting: boolean;
  onClose: () => void;
  onExport: () => void;
}

/** The wide "View all items" modal — searchable, status-filtered parcels sent by this user. */
export function UserParcelsModal({detail, open, exporting, onClose, onExport}: UserParcelsModalProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const params: UserParcelsParams = {query: query.trim() || undefined, status: status || undefined, page};
  const parcels = useUserParcelsQuery(open ? (detail?.id ?? null) : null, params);
  const filtered = query !== "" || status !== "";
  const clear = () => {
    setQuery("");
    setStatus("");
    setPage(1);
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup className="w-[960px] max-w-[calc(100vw-32px)] p-4">
          <ModalHeader detail={detail} exporting={exporting} onExport={onExport} />
          <ModalFilters
            query={query}
            status={status}
            onQuery={(v) => {
              setQuery(v);
              setPage(1);
            }}
            onStatus={(v) => {
              setStatus(v);
              setPage(1);
            }}
          />
          <ParcelsBody filtered={filtered} parcels={parcels} onClear={clear} onPage={setPage} />
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}

function ModalHeader({detail, exporting, onExport}: {detail: UserDetail | null; exporting: boolean; onExport: () => void}) {
  return (
    <div className="flex items-center justify-between gap-3 pb-3">
      <div>
        <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{detail?.id ?? ""}</p>
        <div className="flex items-center gap-2 pt-0.5">
          <p className="text-base leading-[1.4] font-medium text-black">{detail?.name ?? ""}</p>
          {detail && <UserStatusPill status={detail.status} />}
        </div>
      </div>
      <Button variant="outline" isLoading={exporting} onClick={onExport}>
        {m["users.export"]()}
      </Button>
    </div>
  );
}

interface ModalFiltersProps {
  query: string;
  status: string;
  onQuery: (value: string) => void;
  onStatus: (value: string) => void;
}

function ModalFilters({query, status, onQuery, onStatus}: ModalFiltersProps) {
  return (
    <div className="flex items-center gap-2 pb-3">
      <div className="relative flex-1">
        <img
          src={wlSearch}
          alt=""
          className="pointer-events-none absolute top-1/2 left-4 size-[22px] -translate-y-1/2"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder={m["users.parcels_search"]()}
          aria-label={m["users.parcels_search"]()}
          className={`${FIELD_CLASSES} pl-12 placeholder:text-grey-500`}
        />
      </div>
      <SelectShell aria-label={m["users.parcels_status_aria"]()} value={status} onChange={onStatus} wrapperClassName="w-[180px] flex-none">
        <option value="">{m["workloads.filter_all"]()}</option>
        {PARCEL_STATUS_OPTIONS.map((value) => (
          <option key={value} value={value}>
            {STATUS_LABELS[value]()}
          </option>
        ))}
      </SelectShell>
    </div>
  );
}

interface ParcelsBodyProps {
  filtered: boolean;
  parcels: UseQueryResult<Page<UserParcel>>;
  onClear: () => void;
  onPage: (page: number) => void;
}

function ParcelsBody({filtered, parcels, onClear, onPage}: ParcelsBodyProps) {
  if (parcels.isPending) return <DrawerSkeleton />;
  if (parcels.isError || !parcels.data) return <DrawerError message={m["users.parcels_error"]()} onRetry={() => void parcels.refetch()} />;
  const data = parcels.data;
  if (data.items.length === 0) return <EmptyState filtered={filtered} onClear={onClear} />;
  return (
    <>
      <div className="overflow-clip rounded-lg border border-grey-200">
        <ParcelsTable rows={data.items} />
      </div>
      <WorkloadsPagination
        page={data.page}
        pageSize={data.pageSize}
        total={data.total}
        itemCount={data.items.length}
        noun="deliveries"
        onPage={onPage}
      />
    </>
  );
}

function EmptyState({filtered, onClear}: {filtered: boolean; onClear: () => void}) {
  return (
    <WorkloadsEmpty
      icon={wlEmptyBox}
      title={filtered ? m["users.parcels_filtered_empty"]() : m["users.parcels_empty_title"]()}
      description={filtered ? m["users.filtered_empty_description"]() : m["users.parcels_empty_description"]()}
      action={filtered ? {label: m["users.clear_filter"](), onClick: onClear} : undefined}
    />
  );
}

function ParcelsTable({rows}: {rows: UserParcel[]}) {
  return (
    <table className="w-full" aria-label={m["users.parcels_col_id"]()}>
      <thead>
        <tr className="bg-grey-100">
          {HEADERS.map((label, index) => (
            <th key={index} className={HEAD_CELL}>
              {label()}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((parcel) => (
          <tr key={parcel.id} className="border-t border-grey-200 bg-white">
            <td className={`${CELL} font-medium text-black`}>{parcel.id}</td>
            <td className={CELL}>{parcel.recipient}</td>
            <td className={CELL}>{parcel.destination}</td>
            <td className={CELL}>{parcel.courier}</td>
            <td className="h-14 px-4">
              <ParcelStatusTag status={parcel.status} />
            </td>
            <td className={CELL}>{parcel.sla}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
