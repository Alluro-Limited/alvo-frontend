import {useState} from "react";
import {StatusTag} from "@alvo/ui";
import {cn} from "cnfast";
import {X} from "lucide-react";
import {DrawerError} from "@/components/workloads/drawer-error";
import {DrawerShell} from "@/components/workloads/drawer-shell";
import {DrawerSkeleton} from "@/components/workloads/drawer-skeleton";
import {m} from "@/paraglide/messages";
import {useSmeQuery} from "@/queries/use-sme-query";
import type {SmeDetail, SmeVerificationItem} from "@/types/smes-types";
import {SmeBatchesTab} from "./sme-batches-tab";
import {SmeMenu} from "./sme-menu";
import {SmeOverviewTab} from "./sme-overview-tab";
import {SmeVerificationTab} from "./sme-verification-tab";

type SmeTab = "overview" | "verification" | "batches";

const TABS: {id: SmeTab; label: () => string}[] = [
  {id: "overview", label: m["smes.tab_overview"]},
  {id: "verification", label: m["smes.tab_verification"]},
  {id: "batches", label: m["smes.tab_batches"]},
];

interface SmeDrawerProps {
  smeId: string | null;
  onClose: () => void;
  onEdit: (detail: SmeDetail) => void;
  onFlag: (detail: SmeDetail) => void;
  onSuspend: (detail: SmeDetail) => void;
  onDeactivate: (detail: SmeDetail) => void;
  onViewDocument: (detail: SmeDetail, item: SmeVerificationItem) => void;
  onApprove: (detail: SmeDetail, item: SmeVerificationItem) => void;
}

/** Right-side SME detail drawer — header pills, tabs (Overview / Verification / Batch History), kebab actions. */
export function SmeDrawer({smeId, onClose, onEdit, onFlag, onSuspend, onDeactivate, onViewDocument, onApprove}: SmeDrawerProps) {
  const query = useSmeQuery(smeId);
  const [tab, setTab] = useState<SmeTab>("overview");
  return (
    <DrawerShell open={smeId !== null} onClose={onClose} className="w-[736px] bg-white">
      {query.isPending ? (
        <DrawerSkeleton />
      ) : query.isError || !query.data ? (
        <DrawerError message={m["smes.drawer_error"]()} onRetry={() => query.refetch()} />
      ) : (
        <DrawerBody
          detail={query.data}
          tab={tab}
          onTab={setTab}
          onClose={onClose}
          onEdit={onEdit}
          onFlag={onFlag}
          onSuspend={onSuspend}
          onDeactivate={onDeactivate}
          onViewDocument={onViewDocument}
          onApprove={onApprove}
        />
      )}
    </DrawerShell>
  );
}

interface DrawerBodyProps extends Omit<SmeDrawerProps, "smeId"> {
  detail: SmeDetail;
  tab: SmeTab;
  onTab: (tab: SmeTab) => void;
}

function DrawerBody({detail, tab, onTab, onClose, onEdit, onFlag, onSuspend, onDeactivate, onViewDocument, onApprove}: DrawerBodyProps) {
  return (
    <>
      <DrawerHeader
        detail={detail}
        onClose={onClose}
        onFlag={() => onFlag(detail)}
        onSuspend={() => onSuspend(detail)}
        onDeactivate={() => onDeactivate(detail)}
      />
      <TabBar tab={tab} onTab={onTab} />
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {tab === "overview" && <SmeOverviewTab detail={detail} onEdit={() => onEdit(detail)} />}
        {tab === "verification" && (
          <SmeVerificationTab
            detail={detail}
            onViewDocument={(item) => onViewDocument(detail, item)}
            onApprove={(item) => onApprove(detail, item)}
          />
        )}
        {tab === "batches" && <SmeBatchesTab detail={detail} />}
      </div>
    </>
  );
}

function DrawerHeader({
  detail,
  onClose,
  onFlag,
  onSuspend,
  onDeactivate,
}: {
  detail: SmeDetail;
  onClose: () => void;
  onFlag: () => void;
  onSuspend: () => void;
  onDeactivate: () => void;
}) {
  return (
    <div className="border-b border-grey-200 px-6 pt-5 pb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-base font-bold text-primary-600">
            {initials(detail.businessName)}
          </span>
          <div>
            <p className="text-lg leading-[1.3] font-bold tracking-[0.18px] text-black">{detail.businessName}</p>
            <p className="pt-0.5 text-[13px] leading-[1.4] tracking-[0.13px] text-grey-500">
              {detail.ref} · {detail.businessType}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <SmeMenu suspended={detail.status === "suspended"} onFlag={onFlag} onSuspend={onSuspend} onDeactivate={onDeactivate} />
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-md text-grey-600 transition-colors hover:bg-grey-100"
            aria-label={m["workloads.close"]()}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 pt-3">
        <StatusTag status="pickup">{m["smes.status_active"]()}</StatusTag>
        {detail.dvaEnabled && <StatusTag status="violet">{m["smes.dva_enabled"]()}</StatusTag>}
        {detail.status === "flagged" && <StatusTag status="pending">{m["smes.status_flagged"]()}</StatusTag>}
        {detail.status === "suspended" && <StatusTag status="fail">{m["smes.status_suspended"]()}</StatusTag>}
      </div>
    </div>
  );
}

function TabBar({tab, onTab}: {tab: SmeTab; onTab: (tab: SmeTab) => void}) {
  return (
    <div className="flex gap-6 border-b border-grey-200 px-6" role="tablist">
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

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
