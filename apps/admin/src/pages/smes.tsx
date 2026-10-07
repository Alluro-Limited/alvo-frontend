import {AppToast} from "@/components/app-toast";
import {DeactivateSmeDialog} from "@/components/smes/deactivate-sme-dialog";
import {EditSmeModal} from "@/components/smes/edit-sme-modal";
import {SmeDocViewer} from "@/components/smes/sme-doc-viewer";
import {SmeDrawer} from "@/components/smes/sme-drawer";
import {SmeReviewModal} from "@/components/smes/sme-review-modal";
import {SmesHeader} from "@/components/smes/smes-header";
import {SmesList} from "@/components/smes/smes-list";
import {SmesSkeleton} from "@/components/smes/smes-skeleton";
import {SuspendSmeDialog} from "@/components/smes/suspend-sme-dialog";
import {useSmeApproveFlow} from "@/components/smes/use-sme-approve-flow";
import {useSmeDeactivateFlow} from "@/components/smes/use-sme-deactivate-flow";
import {useSmeEditFlow} from "@/components/smes/use-sme-edit-flow";
import {useSmeExport} from "@/components/smes/use-sme-export";
import {useSmeFlagFlow} from "@/components/smes/use-sme-flag-flow";
import {useSmeOverlays} from "@/components/smes/use-sme-overlays";
import {useSmeSuspendFlow} from "@/components/smes/use-sme-suspend-flow";
import {useSmesFilters} from "@/components/smes/use-smes-filters";
import {FlagForReviewDialog} from "@/components/workloads/flag-for-review-dialog";
import {useParcelSelection} from "@/components/workloads/use-parcel-selection";
import {WorkloadsError} from "@/components/workloads/workloads-error";
import {m} from "@/paraglide/messages";
import {useSmesQuery} from "@/queries/use-smes-query";
import type {SmeDeactivateReason, SmeListResponse, SmeSuspendReason} from "@/types/smes-types";

type Flows = {
  overlays: ReturnType<typeof useSmeOverlays>;
  flag: ReturnType<typeof useSmeFlagFlow>;
  suspend: ReturnType<typeof useSmeSuspendFlow>;
  deactivate: ReturnType<typeof useSmeDeactivateFlow>;
  edit: ReturnType<typeof useSmeEditFlow>;
  approve: ReturnType<typeof useSmeApproveFlow>;
};

interface PageContentProps {
  pending: boolean;
  failed: boolean;
  retrying: boolean;
  data?: SmeListResponse;
  onRetry: () => void;
  flows: Flows;
  filters: ReturnType<typeof useSmesFilters>;
  selection: ReturnType<typeof useParcelSelection>;
  exportSmes: (ids?: string[]) => Promise<void>;
}

/** The pending/error/list body under the header. */
function PageContent({pending, failed, retrying, data, onRetry, flows, filters, selection, exportSmes}: PageContentProps) {
  if (pending) return <SmesSkeleton />;
  if (failed || !data) return <WorkloadsError onRetry={onRetry} isRetrying={retrying} />;
  return (
    <SmesList
      data={data}
      filters={filters.filters}
      selected={selection.selected}
      onQuery={filters.onQuery}
      onStatus={filters.onStatus}
      onVerification={filters.onVerification}
      onPage={filters.onPage}
      onClearFilters={filters.clearFilters}
      onToggleRow={selection.toggleRow}
      onToggleAll={selection.toggleAll}
      onClearSelection={selection.clear}
      onOpen={flows.overlays.openDrawer}
      onBulkExport={() => void exportSmes([...selection.selected])}
      onBulkFlag={() => flows.flag.openFlag([...selection.selected])}
      onBulkSuspend={() => flows.suspend.openBulkSuspend([...selection.selected])}
    />
  );
}

/** The SME Account Management page — metrics, filters, the table, tabbed drawer, and account actions. */
export function SmesPage() {
  const filters = useSmesFilters();
  const selection = useParcelSelection();
  const {data, isPending, isError, refetch, isRefetching} = useSmesQuery(filters.listParams);

  const overlays = useSmeOverlays();
  const flows: Flows = {
    overlays,
    flag: useSmeFlagFlow(selection.clear),
    suspend: useSmeSuspendFlow(selection.clear),
    deactivate: useSmeDeactivateFlow(overlays.closeDrawer),
    edit: useSmeEditFlow(),
    approve: useSmeApproveFlow(),
  };
  const {exporting, exportSmes} = useSmeExport(filters.listParams);

  return (
    <div className="flex flex-col gap-4">
      <SmesHeader refreshing={isRefetching} exporting={exporting} onRefresh={() => void refetch()} onExport={() => void exportSmes()} />
      <PageContent
        pending={isPending}
        failed={isError}
        retrying={isRefetching}
        data={data}
        onRetry={() => void refetch()}
        flows={flows}
        filters={filters}
        selection={selection}
        exportSmes={exportSmes}
      />
      <SmesOverlays flows={flows} list={data} />
    </div>
  );
}

/** Drawer, modals, dialogs, and whichever flow's toast is active — rendered above the list. */
function SmesOverlays({flows, list}: {flows: Flows; list?: SmeListResponse}) {
  const {overlays, flag, suspend, deactivate, edit, approve} = flows;
  const toast = activeToast(flows);
  return (
    <>
      <SmeDrawer
        smeId={overlays.openId}
        onClose={overlays.closeDrawer}
        onEdit={edit.openEdit}
        onFlag={(detail) => flag.openFlag(detail.id, detail.businessName)}
        onSuspend={(detail) => suspend.openSuspend(detail.id, detail.businessName, detail.status === "suspended")}
        onDeactivate={(detail) => deactivate.openDeactivate(detail.id, detail.businessName)}
        onViewDocument={(_detail, item) => overlays.openDoc(item)}
        onApprove={(detail, item) => approve.openReview(detail.id, item)}
      />
      <VerificationModals overlays={overlays} approve={approve} />
      <EditSmeModal
        detail={edit.detail}
        businessTypes={list?.businessTypes ?? []}
        submitting={edit.submitting}
        failed={edit.failed}
        onClose={edit.closeEdit}
        onSubmit={edit.submit}
      />
      <AccountDialogs flows={flows} suspendReasons={list?.suspendReasons ?? []} deactivateReasons={list?.deactivateReasons ?? []} />
      {toast && <AppToast message={toast.message} variant={toast.variant} onDismiss={toast.dismiss} />}
    </>
  );
}

/** The doc viewer and the review modal it hands off to. */
function VerificationModals({overlays, approve}: Pick<Flows, "overlays" | "approve">) {
  return (
    <>
      <SmeDocViewer
        item={overlays.docItem}
        onClose={overlays.closeDoc}
        onApprove={() => {
          if (overlays.docItem && overlays.openId) {
            approve.openReview(overlays.openId, overlays.docItem);
            overlays.closeDoc();
          }
        }}
      />
      <SmeReviewModal
        item={approve.item}
        submitting={approve.submitting}
        failed={approve.failed}
        onClose={approve.closeReview}
        onApprove={approve.approve}
      />
    </>
  );
}

/** Suspend/unsuspend, deactivate, and flag dialogs. */
function AccountDialogs({
  flows,
  suspendReasons,
  deactivateReasons,
}: {
  flows: Flows;
  suspendReasons: SmeSuspendReason[];
  deactivateReasons: SmeDeactivateReason[];
}) {
  const {flag, suspend, deactivate} = flows;
  return (
    <>
      <SuspendSmeDialog
        open={suspend.target !== null}
        intent={suspend.target?.intent ?? "suspend"}
        name={suspend.target?.name ?? ""}
        reasons={suspendReasons}
        submitting={suspend.submitting}
        failed={suspend.failed}
        onClose={suspend.closeSuspend}
        onSubmit={suspend.submit}
      />
      <DeactivateSmeDialog
        open={deactivate.target !== null}
        reasons={deactivateReasons}
        submitting={deactivate.submitting}
        failed={deactivate.failed}
        onClose={deactivate.closeDeactivate}
        onSubmit={deactivate.submit}
      />
      <FlagForReviewDialog
        open={flag.flagIds !== null}
        parcelIds={flag.flagIds ?? []}
        noun="sme"
        description={m["smes.flag_description"]({name: flag.flagName ?? m["smes.noun"]()})}
        submitting={flag.submitting}
        failed={flag.failed}
        onClose={flag.closeFlag}
        onSubmit={flag.submit}
      />
    </>
  );
}

type ToastVariant = "success" | "destructive";

interface ActiveToast {
  message: string;
  variant: ToastVariant;
  dismiss: () => void;
}

/** The first active flow's toast wins — suspend/deactivate get the destructive styling. */
function activeToast(flows: Flows): ActiveToast | null {
  const entries: {message: string | null; variant: ToastVariant; dismiss: () => void}[] = [
    {message: flows.suspend.toast, variant: "destructive", dismiss: flows.suspend.dismissToast},
    {message: flows.deactivate.toast, variant: "destructive", dismiss: flows.deactivate.dismissToast},
    {message: flows.flag.toast, variant: "success", dismiss: flows.flag.dismissToast},
    {message: flows.edit.toast, variant: "success", dismiss: flows.edit.dismissToast},
    {message: flows.approve.toast, variant: "success", dismiss: flows.approve.dismissToast},
  ];
  return entries.find((entry): entry is ActiveToast => entry.message !== null) ?? null;
}
