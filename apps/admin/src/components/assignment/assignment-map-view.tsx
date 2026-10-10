import {useState} from "react";
import {Image as ImageIcon} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {ListMapView} from "@/components/view-tabs";
import type {FilterOption} from "@/components/workloads/workloads-toolbar";
import {useAssignmentMapQuery} from "@/queries/use-assignment-map-query";
import type {AssignmentMapParams, AssignmentRow} from "@/types/assignment-types";
import {AssignmentMap} from "./assignment-map";
import {AssignmentMapCard} from "./assignment-map-card";
import {AssignmentMapPanel} from "./assignment-map-panel";

interface AssignmentMapViewProps {
  params: AssignmentMapParams;
  filtered: boolean;
  statusOptions: FilterOption[];
  typeOptions: FilterOption[];
  onQuery: (value: string) => void;
  onStatus: (value: string) => void;
  onType: (value: string) => void;
  onView: (view: ListMapView) => void;
  onOpen: (id: string) => void;
  onClearFilters: () => void;
}

/** The full-bleed map surface: markers under a floating left panel of search, filters, and assignment cards. */
export function AssignmentMapView({
  params,
  filtered,
  statusOptions,
  typeOptions,
  onQuery,
  onStatus,
  onType,
  onView,
  onOpen,
  onClearFilters,
}: AssignmentMapViewProps) {
  const [collapsed, setCollapsed] = useState(false);
  const {data: rows, isPending, isError, refetch} = useAssignmentMapQuery(params);

  return (
    <div className="relative h-[calc(100dvh-112px)] overflow-clip rounded-lg bg-white">
      <AssignmentMap rows={rows ?? []} onOpen={onOpen} className="size-full min-h-0 rounded-none border-0" />
      <AssignmentMapPanel
        collapsed={collapsed}
        query={params.query ?? ""}
        status={params.status ?? ""}
        type={params.type ?? ""}
        statusOptions={statusOptions}
        typeOptions={typeOptions}
        onToggleCollapsed={() => setCollapsed((current) => !current)}
        onView={onView}
        onQuery={onQuery}
        onStatus={onStatus}
        onType={onType}
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
      </AssignmentMapPanel>
    </div>
  );
}

interface PanelContentProps {
  pending: boolean;
  failed: boolean;
  rows: AssignmentRow[];
  filtered: boolean;
  onOpen: (id: string) => void;
  onClearFilters: () => void;
  onRetry: () => void;
}

/** Loading skeletons, the error retry, empty copy, or the assignment cards. */
function PanelContent({pending, failed, rows, filtered, onOpen, onClearFilters, onRetry}: PanelContentProps) {
  if (pending) {
    return Array.from({length: 4}, (_, index) => <div key={index} className="h-[148px] shrink-0 animate-pulse rounded-xl bg-grey-100" />);
  }
  if (failed) {
    return (
      <PanelEmpty title={m["assignment.map_error"]()}>
        <button type="button" onClick={onRetry} className="text-sm font-semibold text-primary-600 underline">
          {m["assignment.retry"]()}
        </button>
      </PanelEmpty>
    );
  }
  if (rows.length === 0) {
    if (filtered) {
      return (
        <PanelEmpty title={m["assignment.filtered_empty_title"]()} description={m["assignment.filtered_empty_description"]()}>
          <button type="button" onClick={onClearFilters} className="text-sm font-semibold text-primary-600 underline">
            {m["assignment.clear_filter"]()}
          </button>
        </PanelEmpty>
      );
    }
    return (
      <PanelEmpty
        icon={<ImageIcon className="size-10 text-grey-300" aria-hidden="true" />}
        title={m["assignment.map_empty_title"]()}
        description={m["assignment.map_empty_description"]()}
      />
    );
  }
  return rows.map((row) => <AssignmentMapCard key={row.id} row={row} onOpen={onOpen} />);
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
