import {m} from "@/paraglide/messages";
import type {PayoutDetail, PayoutListResponse, PayoutRow} from "@/types/payouts-types";
import type {useParcelSelection} from "@/components/workloads/use-parcel-selection";
import {usePayoutDetailQuery} from "@/queries/use-payouts-query";
import {useFlagPayoutMutation, useMarkPaidMutation, useWithholdPayoutMutation} from "@/queries/use-payout-mutations";
import {AppToast} from "@/components/app-toast";
import type {usePayoutsOverlays} from "./use-payouts-overlays";
import {PayoutBatchDialog} from "./payout-batch-dialog";
import {PayoutDeliveriesDialog} from "./payout-deliveries-dialog";
import {PayoutDrawer} from "./payout-drawer";
import {PayoutFlagDialog} from "./payout-flag-dialog";
import {PayoutMarkPaidDialog} from "./payout-mark-paid-dialog";
import {PayoutWithholdDialog} from "./payout-withhold-dialog";

type Overlays = ReturnType<typeof usePayoutsOverlays>;

interface PayoutsOverlaysProps {
  overlays: Overlays;
  selection: ReturnType<typeof useParcelSelection>;
  data: PayoutListResponse | undefined;
  cycle: string;
}

/** The drawer, the five dialogs, and the success toast for the payout console. */
export function PayoutsOverlays({overlays, selection, data, cycle}: PayoutsOverlaysProps) {
  const markPaidDetail = usePayoutDetailQuery(overlays.markPaidId, cycle);
  const deliveriesDetail = usePayoutDetailQuery(overlays.deliveriesId, cycle);
  const selectedRows = (data?.payouts.items ?? []).filter((row) => selection.selected.has(row.courierId));
  return (
    <>
      <PayoutDrawer
        courierId={overlays.drawerId}
        cycle={cycle}
        onClose={overlays.closeDrawer}
        onMarkPaid={overlays.openMarkPaid}
        onViewDeliveries={overlays.openDeliveries}
        onFlag={overlays.openFlag}
        onWithhold={overlays.openWithhold}
      />
      <PaymentDialogs
        overlays={overlays}
        cycle={cycle}
        data={data}
        selectedRows={selectedRows}
        detail={markPaidDetail.data ?? null}
        onDone={selection.clear}
      />
      <IssueDialogs overlays={overlays} cycle={cycle} data={data} />
      <PayoutDeliveriesDialog
        courierId={overlays.deliveriesId}
        courierName={deliveriesDetail.data?.name ?? ""}
        cycle={cycle}
        onClose={overlays.closeDeliveries}
      />
      {overlays.toast && <AppToast message={overlays.toast} variant="success" onDismiss={overlays.dismissToast} />}
    </>
  );
}

/** The Mark-as-Paid and Batch Payout dialogs — one mutation, two entry points. */
function PaymentDialogs({
  overlays,
  cycle,
  data,
  selectedRows,
  detail,
  onDone,
}: {
  overlays: Overlays;
  cycle: string;
  data: PayoutListResponse | undefined;
  selectedRows: PayoutRow[];
  detail: PayoutDetail | null;
  onDone: () => void;
}) {
  const markPaid = useMarkPaidMutation();
  const paymentMethods = data?.paymentMethods ?? ["bank_transfer", "manual"];
  const afterPaid = (count: number) => {
    overlays.closeMarkPaid();
    overlays.closeBatch();
    onDone();
    overlays.showToast(count === 1 ? m["payout.toast_marked_paid"]() : m["payout.toast_batch_paid"]({count}));
  };
  return (
    <>
      <PayoutMarkPaidDialog
        detail={detail}
        cycle={cycle}
        paymentMethods={paymentMethods}
        submitting={markPaid.isPending}
        failed={markPaid.isError && overlays.markPaidId !== null}
        onClose={overlays.closeMarkPaid}
        onSubmit={(input) => markPaid.mutate(input, {onSuccess: () => afterPaid(input.courierIds.length)})}
      />
      <PayoutBatchDialog
        rows={overlays.batchOpen ? selectedRows : []}
        cycle={cycle}
        paymentMethods={paymentMethods}
        submitting={markPaid.isPending}
        failed={markPaid.isError && overlays.batchOpen}
        onClose={overlays.closeBatch}
        onSubmit={(input) => markPaid.mutate(input, {onSuccess: () => afterPaid(input.courierIds.length)})}
      />
    </>
  );
}

/** The Withhold and Flag dialogs — each owns its mutation and success toast. */
function IssueDialogs({overlays, cycle, data}: {overlays: Overlays; cycle: string; data: PayoutListResponse | undefined}) {
  const withhold = useWithholdPayoutMutation();
  const flag = useFlagPayoutMutation();
  const onWithhold = (courierId: string, input: Parameters<typeof withhold.mutate>[0]["input"]) =>
    withhold.mutate(
      {courierId, input},
      {
        onSuccess: () => {
          overlays.closeWithhold();
          overlays.showToast(m["payout.toast_withheld"]());
        },
      }
    );
  const onFlag = (courierId: string, input: Parameters<typeof flag.mutate>[0]["input"]) =>
    flag.mutate(
      {courierId, input},
      {
        onSuccess: () => {
          overlays.closeFlag();
          overlays.showToast(m["payout.toast_flagged"]());
        },
      }
    );
  return (
    <>
      <PayoutWithholdDialog
        courierId={overlays.withholdId}
        cycle={cycle}
        issueTypes={data?.issueTypes ?? []}
        submitting={withhold.isPending}
        failed={withhold.isError && overlays.withholdId !== null}
        onClose={overlays.closeWithhold}
        onSubmit={onWithhold}
      />
      <PayoutFlagDialog
        courierId={overlays.flagId}
        cycle={cycle}
        reasons={data?.disputeReasons ?? []}
        submitting={flag.isPending}
        failed={flag.isError && overlays.flagId !== null}
        onClose={overlays.closeFlag}
        onSubmit={onFlag}
      />
    </>
  );
}
