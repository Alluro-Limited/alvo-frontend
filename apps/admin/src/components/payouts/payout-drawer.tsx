import {Button} from "@alvo/ui";
import {Check, Flag, Lock, Truck} from "lucide-react";
import {m} from "@/paraglide/messages";
import type {PayoutDetail} from "@/types/payouts-types";
import {usePayoutDetailQuery} from "@/queries/use-payouts-query";
import {DrawerShell} from "@/components/workloads/drawer-shell";
import {CourierAvatar} from "@/components/couriers/courier-avatar";
import popoverClose from "@/assets/popover-close.svg";
import {formatJoinedLong} from "@/lib/format";
import {PayoutDrawerSections} from "./payout-drawer-sections";
import {PayoutStatusPill} from "./payout-status-pill";

interface PayoutDrawerProps {
  courierId: string | null;
  cycle: string;
  onClose: () => void;
  onMarkPaid: (courierId: string) => void;
  onViewDeliveries: (courierId: string) => void;
  onFlag: (courierId: string) => void;
  onWithhold: (courierId: string) => void;
}

/** The courier payout side drawer — identity header, status-driven actions, earnings/bank/disputes. */
export function PayoutDrawer({courierId, cycle, onClose, onMarkPaid, onViewDeliveries, onFlag, onWithhold}: PayoutDrawerProps) {
  const {data, isLoading, isError, refetch} = usePayoutDetailQuery(courierId, cycle);
  return (
    <DrawerShell open={courierId !== null} onClose={onClose} className="w-[520px]">
      {isLoading && <DrawerSkeleton />}
      {isError && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="text-sm font-medium text-black">{m["payout.drawer_error"]()}</p>
          <Button variant="outline" className="h-9 px-4" onClick={() => refetch()}>
            {m["payout.retry"]()}
          </Button>
        </div>
      )}
      {data && courierId && (
        <DrawerBody
          detail={data}
          onClose={onClose}
          onMarkPaid={() => onMarkPaid(courierId)}
          onViewDeliveries={() => onViewDeliveries(courierId)}
          onFlag={() => onFlag(courierId)}
          onWithhold={() => onWithhold(courierId)}
        />
      )}
    </DrawerShell>
  );
}

function DrawerBody({
  detail,
  onClose,
  onMarkPaid,
  onViewDeliveries,
  onFlag,
  onWithhold,
}: {
  detail: PayoutDetail;
  onClose: () => void;
  onMarkPaid: () => void;
  onViewDeliveries: () => void;
  onFlag: () => void;
  onWithhold: () => void;
}) {
  const paid = detail.status === "paid";
  return (
    <>
      <DrawerHeader detail={detail} onClose={onClose} />
      {paid && detail.paidAt && (
        <div className="flex items-center gap-2 border-b border-grey-200 bg-status-success-subtle px-4 py-3">
          <Check className="size-4 text-status-success-dark" aria-hidden="true" />
          <p className="text-sm font-medium text-status-success-dark">{m["payout.paid_on"]({date: formatJoinedLong(detail.paidAt)})}</p>
        </div>
      )}
      <DrawerActions paid={paid} onMarkPaid={onMarkPaid} onViewDeliveries={onViewDeliveries} onFlag={onFlag} onWithhold={onWithhold} />
      <PayoutDrawerSections detail={detail} />
    </>
  );
}

function DrawerHeader({detail, onClose}: {detail: PayoutDetail; onClose: () => void}) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-grey-200 bg-white px-4 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <CourierAvatar id={detail.courierId} name={detail.name} photoUrl={detail.photoUrl} size="size-11" />
        <div className="min-w-0">
          <p className="truncate text-base leading-[1.4] font-bold text-black">{detail.name}</p>
          <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-500">{detail.courierId}</p>
        </div>
        <PayoutStatusPill status={detail.status} />
      </div>
      <button type="button" onClick={onClose} aria-label={m["payout.close"]()} className="rounded p-1 hover:bg-grey-100">
        <img src={popoverClose} alt="" className="size-4" aria-hidden="true" />
      </button>
    </header>
  );
}

function DrawerActions({
  paid,
  onMarkPaid,
  onViewDeliveries,
  onFlag,
  onWithhold,
}: {
  paid: boolean;
  onMarkPaid: () => void;
  onViewDeliveries: () => void;
  onFlag: () => void;
  onWithhold: () => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 border-b border-grey-200 bg-white p-4">
      {!paid && (
        <Button className="h-9 gap-1.5 rounded-lg px-3 text-sm font-medium" onClick={onMarkPaid}>
          <Check className="size-4" aria-hidden="true" />
          {m["payout.mark_paid"]()}
        </Button>
      )}
      <Button variant="outline" className="h-9 gap-1.5 rounded-lg px-3 text-sm font-medium" onClick={onViewDeliveries}>
        <Truck className="size-4" aria-hidden="true" />
        {m["payout.view_deliveries"]()}
      </Button>
      {!paid && (
        <>
          <Button
            variant="outline"
            className="h-9 gap-1.5 rounded-lg border-status-warning px-3 text-sm font-medium text-status-warning-dark"
            onClick={onFlag}
          >
            <Flag className="size-4" aria-hidden="true" />
            {m["payout.flag"]()}
          </Button>
          <Button
            variant="outline"
            className="h-9 gap-1.5 rounded-lg border-status-fail px-3 text-sm font-medium text-status-fail-dark"
            onClick={onWithhold}
          >
            <Lock className="size-4" aria-hidden="true" />
            {m["payout.withhold"]()}
          </Button>
        </>
      )}
    </div>
  );
}

function DrawerSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4" data-testid="payout-drawer-skeleton">
      <div className="flex items-center gap-3">
        <div className="size-11 rounded-full bg-grey-200" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 rounded bg-grey-200" />
          <div className="h-3 w-20 rounded bg-grey-200" />
        </div>
      </div>
      <div className="h-24 rounded-xl bg-white/70" />
      <div className="h-40 rounded-xl bg-white/70" />
      <div className="h-32 rounded-xl bg-white/70" />
    </div>
  );
}
