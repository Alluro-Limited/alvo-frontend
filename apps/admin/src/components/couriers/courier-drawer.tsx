import {useState} from "react";
import type {UseQueryResult} from "@tanstack/react-query";
import {DialogClose, DialogTitle} from "@alvo/ui";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {CourierDetail, CourierVerificationItem} from "@/types/couriers-types";
import wlClose from "@/assets/wl-close.svg";
import {DrawerError} from "@/components/workloads/drawer-error";
import {DrawerShell} from "@/components/workloads/drawer-shell";
import {DrawerSkeleton} from "@/components/workloads/drawer-skeleton";
import {useCourierQuery} from "@/queries/use-courier-query";
import {CourierAssignmentTab} from "./courier-assignment-tab";
import {CourierAvatar} from "./courier-avatar";
import {CourierInfoTab} from "./courier-info-tab";
import {CourierMenu} from "./courier-menu";
import {CourierStatusPill} from "./courier-status-pill";
import {CourierVerificationTab} from "./courier-verification-tab";

type CourierTab = "information" | "verification" | "assignments";

const TABS: {id: CourierTab; label: () => string}[] = [
  {id: "information", label: m["couriers.tab_information"]},
  {id: "verification", label: m["couriers.tab_verification"]},
  {id: "assignments", label: m["couriers.tab_assignments"]},
];

interface CourierDrawerProps {
  id: string | null;
  open: boolean;
  onClose: () => void;
  onFlag: (detail: CourierDetail) => void;
  onSuspend: (detail: CourierDetail) => void;
  onDelete: (detail: CourierDetail) => void;
  onViewDocument: (detail: CourierDetail, item: CourierVerificationItem) => void;
  onApprove: (detail: CourierDetail, item: CourierVerificationItem) => void;
  onOpenHistory: (detail: CourierDetail) => void;
}

/** The courier detail slide-over — photo header, tabs (Information / Verification / Assignment History), kebab actions. */
export function CourierDrawer({
  id,
  open,
  onClose,
  onFlag,
  onSuspend,
  onDelete,
  onViewDocument,
  onApprove,
  onOpenHistory,
}: CourierDrawerProps) {
  const query = useCourierQuery(open ? id : null);
  const [tab, setTab] = useState<CourierTab>("information");
  return (
    <DrawerShell open={open} onClose={onClose} className="bg-grey-100">
      <DrawerHeader query={query} onFlag={onFlag} onSuspend={onSuspend} onDelete={onDelete} />
      <TabBar tab={tab} onTab={setTab} />
      <div className="flex-1 overflow-y-auto bg-grey-100/60 p-4">
        <DrawerBody query={query} tab={tab} onViewDocument={onViewDocument} onApprove={onApprove} onOpenHistory={onOpenHistory} />
      </div>
    </DrawerShell>
  );
}

interface DrawerHeaderProps {
  query: UseQueryResult<CourierDetail>;
  onFlag: (detail: CourierDetail) => void;
  onSuspend: (detail: CourierDetail) => void;
  onDelete: (detail: CourierDetail) => void;
}

function DrawerHeader({query, onFlag, onSuspend, onDelete}: DrawerHeaderProps) {
  const detail = query.data;
  return (
    <header className="flex items-center justify-between gap-3 border-b border-grey-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2.5">
        {detail ? (
          <CourierAvatar id={detail.id} name={detail.name} photoUrl={detail.photoUrl} size="size-10" />
        ) : (
          <span className="size-10 animate-pulse rounded-full bg-grey-200" />
        )}
        <div>
          <DialogTitle className="text-sm leading-[1.4] tracking-[0.14px] text-grey-500">{detail?.id ?? "…"}</DialogTitle>
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-base leading-[1.4] font-medium text-black">{detail?.name ?? ""}</span>
            {detail && <CourierStatusPill status={detail.status} />}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {detail && (
          <CourierMenu
            status={detail.status}
            onFlag={() => onFlag(detail)}
            onSuspend={() => onSuspend(detail)}
            onDelete={() => onDelete(detail)}
          />
        )}
        <DialogClose className="rounded p-0.5 text-grey-600 hover:bg-grey-100" aria-label={m["workloads.close"]()}>
          <img src={wlClose} alt="" className="size-6" aria-hidden="true" />
        </DialogClose>
      </div>
    </header>
  );
}

function TabBar({tab, onTab}: {tab: CourierTab; onTab: (tab: CourierTab) => void}) {
  return (
    <div className="flex gap-6 border-b border-grey-200 bg-white px-4" role="tablist">
      {TABS.map(({id, label}) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={tab === id}
          onClick={() => onTab(id)}
          className={cn(
            "border-b-2 py-3 text-sm leading-[1.4] tracking-[0.14px] transition-colors",
            tab === id ? "border-primary-500 font-medium text-primary-600" : "border-transparent text-grey-500 hover:text-grey-700"
          )}
        >
          {label()}
        </button>
      ))}
    </div>
  );
}

interface DrawerBodyProps {
  query: UseQueryResult<CourierDetail>;
  tab: CourierTab;
  onViewDocument: (detail: CourierDetail, item: CourierVerificationItem) => void;
  onApprove: (detail: CourierDetail, item: CourierVerificationItem) => void;
  onOpenHistory: (detail: CourierDetail) => void;
}

function DrawerBody({query, tab, onViewDocument, onApprove, onOpenHistory}: DrawerBodyProps) {
  if (query.isPending) return <DrawerSkeleton />;
  if (query.isError || !query.data) return <DrawerError message={m["couriers.drawer_error"]()} onRetry={() => query.refetch()} />;
  const detail = query.data;
  if (tab === "information") return <CourierInfoTab detail={detail} />;
  if (tab === "verification") {
    return (
      <CourierVerificationTab
        detail={detail}
        onViewDocument={(item) => onViewDocument(detail, item)}
        onApprove={(item) => onApprove(detail, item)}
      />
    );
  }
  return <CourierAssignmentTab detail={detail} onOpenHistory={onOpenHistory} />;
}
