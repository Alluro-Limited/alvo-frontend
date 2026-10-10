import {m} from "@/paraglide/messages";
import {DeleteUserDialog} from "@/components/users/delete-user-dialog";
import {SuspendUserDialog} from "@/components/users/suspend-user-dialog";
import {useUserDeleteFlow} from "@/components/users/use-user-delete-flow";
import {useUserExport} from "@/components/users/use-user-export";
import {useUserFlagFlow} from "@/components/users/use-user-flag-flow";
import {useUserOverlays} from "@/components/users/use-user-overlays";
import {useUserSuspendFlow} from "@/components/users/use-user-suspend-flow";
import {useUsersFilters} from "@/components/users/use-users-filters";
import {UserDrawer} from "@/components/users/user-drawer";
import {UserParcelsModal} from "@/components/users/user-parcels-modal";
import {UsersHeader} from "@/components/users/users-header";
import {UsersList} from "@/components/users/users-list";
import {UsersSkeleton} from "@/components/users/users-skeleton";
import {UsersToast} from "@/components/users/users-toast";
import {FlagForReviewDialog} from "@/components/workloads/flag-for-review-dialog";
import {useParcelSelection} from "@/components/workloads/use-parcel-selection";
import {WorkloadsError} from "@/components/workloads/workloads-error";
import {useUsersQuery} from "@/queries/use-users-query";
import type {SuspendReason, UserListResponse} from "@/types/users-types";

interface ListHandlers {
  selected: ReadonlySet<string>;
  filters: {query: string; status: string; verification: string};
  onQuery: (v: string) => void;
  onStatus: (v: string) => void;
  onVerification: (v: string) => void;
  onToggleRow: (id: string, checked: boolean) => void;
  onToggleAll: (ids: string[], checked: boolean) => void;
  onOpen: (id: string) => void;
  onPage: (page: number) => void;
  onClearFilters: () => void;
  onBulkExport: () => void;
  onBulkFlag: () => void;
  onBulkSuspend: () => void;
  onClearSelection: () => void;
}

/** The pending/error/list body under the header. */
function PageContent({pending, failed, retrying, data, onRetry, ...handlers}: PageContentProps) {
  if (pending) return <UsersSkeleton />;
  if (failed || !data) return <WorkloadsError onRetry={onRetry} isRetrying={retrying} />;
  return <UsersList data={data} {...handlers} />;
}

interface PageContentProps extends ListHandlers {
  pending: boolean;
  failed: boolean;
  retrying: boolean;
  data?: UserListResponse;
  onRetry: () => void;
}

/** The User Management page — metrics, filters, the users table, drawer, and account actions. */
export function UsersPage() {
  const {filters, listParams, onQuery, onStatus, onVerification, onPage, clearFilters} = useUsersFilters();
  const {selected, toggleRow, toggleAll, clear} = useParcelSelection();
  const {data, isPending, isError, refetch, isRefetching} = useUsersQuery(listParams);

  const overlays = useUserOverlays();
  const flag = useUserFlagFlow(clear);
  const suspend = useUserSuspendFlow(clear);
  const del = useUserDeleteFlow(overlays.closeDrawer);
  const {exporting, exportUsers} = useUserExport(listParams);

  return (
    <div className="flex flex-col gap-4">
      <UsersHeader refreshing={isRefetching} exporting={exporting} onRefresh={() => void refetch()} onExport={() => void exportUsers()} />
      <PageContent
        pending={isPending}
        failed={isError}
        retrying={isRefetching}
        data={data}
        onRetry={() => void refetch()}
        filters={filters}
        selected={selected}
        onQuery={onQuery}
        onStatus={onStatus}
        onVerification={onVerification}
        onToggleRow={toggleRow}
        onToggleAll={toggleAll}
        onOpen={overlays.openDrawer}
        onPage={onPage}
        onClearFilters={clearFilters}
        onBulkExport={() => void exportUsers([...selected])}
        onBulkFlag={() => flag.openFlag([...selected])}
        onBulkSuspend={() => suspend.openBulkSuspend([...selected])}
        onClearSelection={clear}
      />
      <UsersOverlays
        overlays={overlays}
        flag={flag}
        suspend={suspend}
        del={del}
        suspendReasons={data?.suspendReasons ?? []}
        exporting={exporting}
        onExportParcels={exportUsers}
      />
    </div>
  );
}

type OverlayFlows = {
  overlays: ReturnType<typeof useUserOverlays>;
  flag: ReturnType<typeof useUserFlagFlow>;
  suspend: ReturnType<typeof useUserSuspendFlow>;
  del: ReturnType<typeof useUserDeleteFlow>;
};

interface UsersOverlaysProps extends OverlayFlows {
  suspendReasons: SuspendReason[];
  exporting: boolean;
  onExportParcels: (ids?: string[]) => Promise<void>;
}

/** Drawer, parcels modal, mutation dialogs, and the shared toast — rendered above the list. */
function UsersOverlays({overlays, flag, suspend, del, suspendReasons, exporting, onExportParcels}: UsersOverlaysProps) {
  return (
    <>
      <UserDrawer
        id={overlays.openId}
        open={overlays.openId !== null}
        onClose={overlays.closeDrawer}
        onFlag={flag.openFlag}
        onSuspend={suspend.openSuspend}
        onDelete={del.openDelete}
        onOpenParcels={overlays.openParcels}
      />
      <UserParcelsModal
        detail={overlays.parcelsDetail}
        open={overlays.parcelsDetail !== null}
        exporting={exporting}
        onClose={overlays.closeParcels}
        onExport={() => void onExportParcels(overlays.parcelsDetail ? [overlays.parcelsDetail.id] : undefined)}
      />
      <UserDialogs flag={flag} suspend={suspend} del={del} suspendReasons={suspendReasons} />
    </>
  );
}

/** The first active flow's toast wins — flows are mutually exclusive in practice. */
function activeToast(flag: OverlayFlows["flag"], suspend: OverlayFlows["suspend"], del: OverlayFlows["del"]) {
  if (flag.toast) return {message: flag.toast, dismiss: flag.dismissToast};
  if (suspend.toast) return {message: suspend.toast, dismiss: suspend.dismissToast};
  if (del.toast) return {message: del.toast, dismiss: del.dismissToast};
  return null;
}

/** The suspend/unsuspend, delete, and flag dialogs plus whichever flow's toast is active. */
function UserDialogs({flag, suspend, del, suspendReasons}: Pick<UsersOverlaysProps, "flag" | "suspend" | "del" | "suspendReasons">) {
  const toast = activeToast(flag, suspend, del);
  return (
    <>
      <SuspendUserDialog
        open={suspend.target !== null}
        intent={suspend.target?.intent ?? "suspend"}
        reasons={suspendReasons}
        submitting={suspend.submitting}
        failed={suspend.failed}
        onClose={suspend.closeSuspend}
        onSubmit={suspend.submit}
      />
      <DeleteUserDialog
        open={del.detail !== null}
        name={del.detail?.name ?? ""}
        submitting={del.submitting}
        failed={del.failed}
        onClose={del.closeDelete}
        onConfirm={del.confirm}
      />
      <FlagForReviewDialog
        open={flag.flagIds !== null}
        parcelIds={flag.flagIds ?? []}
        noun="user"
        description={m["users.flag_description"]()}
        submitting={flag.submitting}
        failed={flag.failed}
        onClose={flag.closeFlag}
        onSubmit={flag.submit}
      />
      {toast && <UsersToast message={toast.message} onDismiss={toast.dismiss} />}
    </>
  );
}
