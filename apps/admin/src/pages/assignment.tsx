import {useState} from "react";
import {m} from "@/paraglide/messages";
import {AppToast} from "@/components/app-toast";
import {AssignmentDrawer} from "@/components/assignment/assignment-drawer";
import {AssignmentError} from "@/components/assignment/assignment-error";
import {AssignmentHeader} from "@/components/assignment/assignment-header";
import {AssignmentList} from "@/components/assignment/assignment-list";
import {assignmentFilterOptions} from "@/components/assignment/assignment-labels";
import {AssignmentMapView} from "@/components/assignment/assignment-map-view";
import {AssignmentSkeleton} from "@/components/assignment/assignment-skeleton";
import {ItemsInAssignmentModal} from "@/components/assignment/items-in-assignment-modal";
import {ManualAssignModal} from "@/components/assignment/manual-assign-modal";
import {useAssignmentFilters} from "@/components/assignment/use-assignment-filters";
import {useAssignmentFlagFlow} from "@/components/assignment/use-assignment-flag-flow";
import {useAssignmentOverlays} from "@/components/assignment/use-assignment-overlays";
import {FlagForReviewDialog} from "@/components/workloads/flag-for-review-dialog";
import {useParcelSelection} from "@/components/workloads/use-parcel-selection";
import type {ListMapView} from "@/components/view-tabs";
import type {FilterOption} from "@/components/workloads/workloads-toolbar";
import {useAssignmentsQuery} from "@/queries/use-assignments-query";
import type {AssignmentListResponse, AssignmentMapParams} from "@/types/assignment-types";

interface ListHandlers {
  selected: ReadonlySet<string>;
  filters: {query: string; status: string; type: string};
  onQuery: (v: string) => void;
  onStatus: (v: string) => void;
  onType: (v: string) => void;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (ids: string[], checked: boolean) => void;
  onOpen: (id: string) => void;
  onPage: (page: number) => void;
  onClearFilters: () => void;
  onBulkFlag: () => void;
  onClearSelection: () => void;
}

interface PageContentProps extends ListHandlers {
  pending: boolean;
  failed: boolean;
  retrying: boolean;
  data?: AssignmentListResponse;
  onRetry: () => void;
}

function PageContent({pending, failed, retrying, data, onRetry, ...handlers}: PageContentProps) {
  if (pending) return <AssignmentSkeleton />;
  if (failed || !data) return <AssignmentError onRetry={onRetry} isRetrying={retrying} />;
  return <AssignmentList data={data} {...handlers} />;
}

interface PageOverlaysProps {
  overlays: ReturnType<typeof useAssignmentOverlays>;
  flag: ReturnType<typeof useAssignmentFlagFlow>;
  onTrackMap: () => void;
}

/** Every slide-over/dialog the page can layer on top of the list, plus the success toasts. */
function PageOverlays({overlays, flag, onTrackMap}: PageOverlaysProps) {
  const toast = flag.toast ?? overlays.assignToast;
  const dismissToast = flag.toast ? flag.dismissToast : overlays.dismissAssignToast;
  return (
    <>
      <AssignmentDrawer
        id={overlays.openId}
        open={overlays.openId !== null}
        onClose={overlays.closeDrawer}
        onFlag={flag.openFlag}
        onOpenItems={overlays.openItems}
        onTrackMap={onTrackMap}
        onPullBack={overlays.openAssign}
      />
      <ItemsInAssignmentModal detail={overlays.itemsDetail} onClose={overlays.closeItems} />
      <ManualAssignModal
        open={overlays.assign.open}
        preselectId={overlays.assign.preselect}
        onClose={overlays.closeAssign}
        onAssigned={(id, courier) => {
          overlays.showAssignToast(m["assignment.assigned_toast"]({id, courier}));
          overlays.closeDrawer();
        }}
      />
      <FlagForReviewDialog
        open={flag.flagIds !== null}
        parcelIds={flag.flagIds ?? []}
        noun="assignment"
        description={m["assignment.flag_description"]()}
        submitting={flag.submitting}
        failed={flag.failed}
        onClose={flag.closeFlag}
        onSubmit={flag.submit}
      />
      {toast && <AppToast message={toast} onDismiss={dismissToast} />}
    </>
  );
}

interface ListRegionProps extends PageContentProps {
  view: ListMapView;
  refreshing: boolean;
  onView: (view: ListMapView) => void;
  onRefresh: () => void;
  onManualAssign: () => void;
}

/** The header row plus the pending/error/list content below it. */
function ListRegion({
  view,
  refreshing,
  onView,
  onRefresh,
  onManualAssign,
  pending,
  failed,
  retrying,
  data,
  onRetry,
  ...handlers
}: ListRegionProps) {
  return (
    <>
      <AssignmentHeader view={view} refreshing={refreshing} onView={onView} onRefresh={onRefresh} onManualAssign={onManualAssign} />
      <PageContent pending={pending} failed={failed} retrying={retrying} data={data} onRetry={onRetry} {...handlers} />
    </>
  );
}

interface PageBodyProps extends ListRegionProps {
  mapParams: AssignmentMapParams;
  filterOptions: {statusOptions: FilterOption[]; typeOptions: FilterOption[]};
}

/** The map surface or the list region, depending on the active tab. */
function PageBody({view, mapParams, filterOptions, ...list}: PageBodyProps) {
  const {filters, onQuery, onStatus, onType, onView, onOpen, onClearFilters} = list;
  if (view === "map") {
    return (
      <AssignmentMapView
        params={mapParams}
        filtered={filters.query !== "" || filters.status !== "" || filters.type !== ""}
        statusOptions={filterOptions.statusOptions}
        typeOptions={filterOptions.typeOptions}
        onQuery={onQuery}
        onStatus={onStatus}
        onType={onType}
        onView={onView}
        onOpen={onOpen}
        onClearFilters={onClearFilters}
      />
    );
  }
  return <ListRegion view={view} {...list} />;
}

/** The Assignment console — metrics, type cards, filters, list/map views, drawer, and the manual-assign flow. */
export function AssignmentPage() {
  const [view, setView] = useState<ListMapView>("list");
  const {filters, params, onQuery, onStatus, onType, onPage, clearFilters} = useAssignmentFilters();
  const {selected, toggleRow, toggleAll, clear} = useParcelSelection();
  const {data, isPending, isError, refetch, isRefetching} = useAssignmentsQuery(params);

  const overlays = useAssignmentOverlays();
  const flag = useAssignmentFlagFlow(clear);

  return (
    <div className="flex flex-col gap-4">
      <PageBody
        view={view}
        mapParams={{query: params.query, status: params.status, type: params.type}}
        filterOptions={assignmentFilterOptions(data?.filters ?? {statuses: [], types: []})}
        filters={filters}
        onClearFilters={clearFilters}
        refreshing={isRefetching}
        onView={setView}
        onRefresh={() => void refetch()}
        onManualAssign={() => overlays.openAssign(null)}
        pending={isPending}
        failed={isError}
        retrying={isRefetching}
        data={data}
        onRetry={() => void refetch()}
        selected={selected}
        onQuery={onQuery}
        onStatus={onStatus}
        onType={onType}
        onToggleRow={toggleRow}
        onToggleAll={toggleAll}
        onOpen={overlays.openDrawer}
        onPage={onPage}
        onBulkFlag={() => flag.openFlag([...selected])}
        onClearSelection={clear}
      />
      <PageOverlays
        overlays={overlays}
        flag={flag}
        onTrackMap={() => {
          overlays.closeDrawer();
          setView("map");
        }}
      />
    </div>
  );
}
