import {useState} from "react";
import {m} from "@/paraglide/messages";
import wheelIcon from "@/assets/asn-wheel.svg";
import type {ListMapView} from "@/components/view-tabs";
import {useCourierTrackingQuery} from "@/queries/use-courier-tracking-query";
import type {CourierTrack} from "@/types/couriers-types";
import {trackStatusLabel, trackTypeLabel} from "./courier-labels";
import {CouriersMap} from "./couriers-map";
import {CouriersMapCard} from "./couriers-map-card";
import {CouriersMapPanel} from "./couriers-map-panel";
import {useCourierMapFilters} from "./use-courier-map-filters";

/** The full-bleed tracking map: courier/node markers under a floating panel of search, filters, and track cards. */
export function CouriersMapView({onView}: {onView: (view: ListMapView) => void}) {
  const filters = useCourierMapFilters();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const {data, isPending, isError, refetch} = useCourierTrackingQuery(filters.params);

  const tracks = data?.tracks ?? [];

  return (
    <div className="relative h-[calc(100dvh-112px)] overflow-clip rounded-lg bg-white">
      <CouriersMap
        tracks={tracks}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onClearSelection={() => setSelectedId(null)}
        className="size-full min-h-0 rounded-none border-0"
      />
      <CouriersMapPanel
        collapsed={collapsed}
        query={filters.filters.query}
        status={filters.filters.status}
        type={filters.filters.type}
        statusOptions={(data?.filters.statuses ?? []).map((id) => ({id, label: trackStatusLabel(id)}))}
        typeOptions={(data?.filters.types ?? []).map((id) => ({id, label: trackTypeLabel(id)}))}
        onToggleCollapsed={() => setCollapsed((current) => !current)}
        onView={onView}
        onQuery={filters.onQuery}
        onStatus={filters.onStatus}
        onType={filters.onType}
      >
        <PanelContent
          pending={isPending}
          failed={isError}
          tracks={tracks}
          selectedId={selectedId}
          filtered={filters.filtered}
          onSelect={setSelectedId}
          onClearFilters={filters.clearFilters}
          onRetry={() => void refetch()}
        />
      </CouriersMapPanel>
    </div>
  );
}

interface PanelContentProps {
  pending: boolean;
  failed: boolean;
  tracks: CourierTrack[];
  selectedId: string | null;
  filtered: boolean;
  onSelect: (courierId: string) => void;
  onClearFilters: () => void;
  onRetry: () => void;
}

/** Loading skeletons, the error retry, empty copy, or the track cards. */
function PanelContent({pending, failed, tracks, selectedId, filtered, onSelect, onClearFilters, onRetry}: PanelContentProps) {
  if (pending) {
    return ["a", "b", "c", "d"].map((key) => <div key={key} className="h-[168px] shrink-0 animate-pulse rounded-xl bg-grey-100" />);
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
  if (tracks.length === 0) {
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
        icon={<img src={wheelIcon} alt="" className="size-12" aria-hidden="true" />}
        title={m["couriers.map_empty_title"]()}
        description={m["couriers.map_empty_description"]()}
      />
    );
  }
  return tracks.map((track) => (
    <CouriersMapCard key={track.courierId} track={track} selected={track.courierId === selectedId} onSelect={onSelect} />
  ));
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
