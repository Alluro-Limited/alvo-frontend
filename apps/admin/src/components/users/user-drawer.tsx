import type {UseQueryResult} from "@tanstack/react-query";
import {DialogClose, DialogTitle} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {UserDetail} from "@/types/users-types";
import wlClose from "@/assets/wl-close.svg";
import {DrawerError} from "@/components/workloads/drawer-error";
import {DrawerShell} from "@/components/workloads/drawer-shell";
import {DrawerSkeleton} from "@/components/workloads/drawer-skeleton";
import {FlaggedBanner} from "@/components/workloads/parcel-banners";
import {useUserQuery} from "@/queries/use-user-query";
import {UserActivity} from "./user-activity";
import {UserInfoCard} from "./user-info-card";
import {UserMenu} from "./user-menu";
import {UserParcelsBanner} from "./user-parcels-banner";
import {UserStatusPill} from "./user-status-pill";
import {UserWalletCard} from "./user-wallet-card";

interface UserDrawerProps {
  id: string | null;
  open: boolean;
  onClose: () => void;
  onFlag: (id: string) => void;
  onSuspend: (detail: UserDetail) => void;
  onDelete: (detail: UserDetail) => void;
  onOpenParcels: (detail: UserDetail) => void;
}

/** The user detail slide-over — info, parcels banner, wallet stats, recent activity, account actions. */
export function UserDrawer({id, open, onClose, onFlag, onSuspend, onDelete, onOpenParcels}: UserDrawerProps) {
  const query = useUserQuery(open ? id : null);
  const detail = query.data;
  return (
    <DrawerShell open={open} onClose={onClose}>
      <header className="flex items-start justify-between gap-3 border-b border-grey-200 bg-white px-4 py-3">
        <div>
          <DialogTitle className="text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{detail?.id ?? "…"}</DialogTitle>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-base leading-[1.4] font-medium text-black">{detail?.name ?? ""}</span>
            {detail && <UserStatusPill status={detail.status} />}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {detail && (
            <UserMenu
              status={detail.status}
              parcelCount={detail.parcelsSent}
              onViewItems={() => onOpenParcels(detail)}
              onFlag={() => onFlag(detail.id)}
              onSuspend={() => onSuspend(detail)}
              onDelete={() => onDelete(detail)}
            />
          )}
          <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["workloads.close"]()}>
            <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
          </DialogClose>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <DrawerBody query={query} onOpenParcels={onOpenParcels} />
      </div>
    </DrawerShell>
  );
}

function DrawerBody({query, onOpenParcels}: {query: UseQueryResult<UserDetail>; onOpenParcels: (detail: UserDetail) => void}) {
  if (query.isPending) return <DrawerSkeleton />;
  if (query.isError || !query.data) return <DrawerError message={m["users.drawer_error"]()} onRetry={() => query.refetch()} />;
  const detail = query.data;
  return (
    <div className="flex flex-col gap-3 p-4">
      {detail.flag && <FlaggedBanner flag={detail.flag} />}
      <UserInfoCard detail={detail} />
      <UserParcelsBanner count={detail.parcelsSent} onOpen={() => onOpenParcels(detail)} />
      <UserWalletCard detail={detail} />
      <UserActivity items={detail.recentActivity} />
    </div>
  );
}
