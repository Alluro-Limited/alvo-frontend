import {useState} from "react";
import {Image as ImageIcon} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {ListMapView} from "@/components/view-tabs";
import {useCourierMapQuery} from "@/queries/use-courier-map-query";
import type {CourierMapParams, CourierRow} from "@/types/couriers-types";
import {courierFilterOptions} from "./courier-labels";
import {CouriersMap} from "./couriers-map";
import {CouriersMapCard} from "./couriers-map-card";
import {CouriersMapPanel} from "./couriers-map-panel";

interface CouriersMapViewProps {
  params: CourierMapParams;
  filtered: boolean;
  filters: {statuses: string[]; verifications: string[]; vehicles: string[]};
  onQuery: (value: string) => void;
  onStatus: (value: string) => void;
  onVerification: (value: string) => void;
  onVehicle: (value: string) => void;
  onView: (view: ListMapView) => void;
  onOpen: (id: string) => void;
  onClearFilters: () => void;
}

/** The full-bleed map surface: markers under a floating left panel of search, filters, and courier cards. */
export function CouriersMapView({
  params,
  filtered,
  filters,
  onQuery,
  onStatus,
  onVerification,
  onVehicle,
  onView,
  onOpen,
  onClearFilters,
}: CouriersMapViewProps) {
  const [collapsed, setCollapsed] = useState(false);
  const {data: rows, isPending, isError, refetch} = useCourierMapQuery(params);
  const options = courierFilterOptions(filters);

  return (
    <div className="relative h-[calc(100dvh-112px)] overflow-clip rounded-lg bg-white">
      <CouriersMap rows={rows ?? []} onOpen={onOpen} className="size-full min-h-0 rounded-none border-0" />
      <CouriersMapPanel
        collapsed={collapsed}
        query={params.query ?? ""}
        status={params.status ?? ""}
        verification={params.verification ?? ""}
        vehicle={params.vehicle ?? ""}
        statusOptions={options.statusOptions}
        verificationOptions={options.verificationOptions}
        vehicleOptions={options.vehicleOptions}
        onToggleCollapsed={() => setCollapsed((current) => !current)}
        onView={onView}
        onQuery={onQuery}
        onStatus={onStatus}
        onVerification={onVerification}
        onVehicle={onVehicle}
      >
        <PanelContent
          pending={isPending}
          failed={isError}
          rows={rows ?? []}
          filtered={filtered}
          onOpen={onOpen}
          onClearFilters={onClearFilters}
          onRetry={() => void refetch()}
        />
      </CouriersMapPanel>
    </div>
  );
}

interface PanelContentProps {
  pending: boolean;
  failed: boolean;
  rows: CourierRow[];
  filtered: boolean;
  onOpen: (id: string) => void;
  onClearFilters: () => void;
  onRetry: () => void;
}

/** Loading skeletons, the error retry, empty copy, or the courier cards. */
function PanelContent({pending, failed, rows, filtered, onOpen, onClearFilters, onRetry}: PanelContentProps) {
  if (pending) {
    return ["a", "b", "c", "d"].map((key) => <div key={key} className="h-[92px] shrink-0 animate-pulse rounded-xl bg-grey-100" />);
  }
  if (failed) {
    return (
      <PanelEmpty title={m["couriers.map_error"]()}>
        <button type="button" onClick={onRetry} className="text-sm font-semibold text-primary-600 underline">
          {m["couriers.retry"]()}
        </button>
      </PanelEmpty>
    );
  }
  if (rows.length === 0) {
    if (filtered) {
      return (
        <PanelEmpty title={m["couriers.filtered_empty_title"]()} description={m["couriers.filtered_empty_description"]()}>
          <button type="button" onClick={onClearFilters} className="text-sm font-semibold text-primary-600 underline">
            {m["couriers.clear_filter"]()}
          </button>
        </PanelEmpty>
      );
    }
    return (
      <PanelEmpty
        icon={<ImageIcon className="size-10 text-grey-300" aria-hidden="true" />}
        title={m["couriers.map_empty_title"]()}
        description={m["couriers.map_empty_description"]()}
      />
    );
  }
  return rows.map((row) => <CouriersMapCard key={row.id} row={row} onOpen={onOpen} />);
}

/** Centered note inside the cards region — optional icon above the copy and action below it. */
function PanelEmpty({
  icon,
  title,
  description,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
      {icon}
      <p className="text-sm leading-[1.4] font-semibold tracking-[0.14px] text-grey-700">{title}</p>
      {description && <p className="text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{description}</p>}
      {children}
    </div>
  );
}
