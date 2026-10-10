import type {UseQueryResult} from "@tanstack/react-query";
import {m} from "@/paraglide/messages";
import {DrawerError} from "@/components/workloads/drawer-error";
import {DrawerShell} from "@/components/workloads/drawer-shell";
import {DrawerSkeleton} from "@/components/workloads/drawer-skeleton";
import {FlaggedBanner} from "@/components/workloads/parcel-banners";
import {useAssignmentQuery} from "@/queries/use-assignment-query";
import type {AssignmentDetail} from "@/types/assignment-types";
import {PublicPoolBanner} from "./assignment-banners";
import {AssignmentDrawerHeader} from "./assignment-drawer-header";
import {AssignmentInfoCard} from "./assignment-info-card";
import {AssignmentProgressCard} from "./assignment-progress-card";
import {AssignmentTimeline} from "./assignment-timeline";
import {ViewItemsBanner} from "./view-items-banner";

interface AssignmentDrawerProps {
  id: string | null;
  open: boolean;
  onClose: () => void;
  onFlag: (id: string) => void;
  onOpenItems: (detail: AssignmentDetail) => void;
  onTrackMap: () => void;
  onPullBack: (id: string) => void;
}

/** The assignment detail slide-over — banners, progress, view-items, info card, timeline. */
export function AssignmentDrawer({id, open, onClose, onFlag, onOpenItems, onTrackMap, onPullBack}: AssignmentDrawerProps) {
  const query = useAssignmentQuery(open ? id : null);
  return (
    <DrawerShell open={open} onClose={onClose}>
      <AssignmentDrawerHeader detail={query.data} onFlag={() => id && onFlag(id)} onTrackMap={onTrackMap} />
      <div className="flex-1 overflow-y-auto">
        <DrawerBody query={query} onOpenItems={onOpenItems} onPullBack={onPullBack} />
      </div>
    </DrawerShell>
  );
}

function DrawerBody({
  query,
  onOpenItems,
  onPullBack,
}: {
  query: UseQueryResult<AssignmentDetail>;
  onOpenItems: (detail: AssignmentDetail) => void;
  onPullBack: (id: string) => void;
}) {
  if (query.isPending) return <DrawerSkeleton />;
  if (query.isError || !query.data) return <DrawerError message={m["assignment.drawer_error"]()} onRetry={() => query.refetch()} />;
  const detail = query.data;
  return (
    <div className="flex flex-col gap-3 p-4">
      {detail.flag && <FlaggedBanner flag={detail.flag} />}
      {detail.declinedBy && detail.declinedBy.length > 0 && (
        <PublicPoolBanner declinedBy={detail.declinedBy} onPullBack={() => onPullBack(detail.id)} />
      )}
      {detail.progress !== null && <AssignmentProgressCard progress={detail.progress} etaMin={detail.etaMin} />}
      <ViewItemsBanner type={detail.type} count={detail.items} onOpen={() => onOpenItems(detail)} />
      <AssignmentInfoCard detail={detail} />
      <AssignmentTimeline steps={detail.timeline} />
    </div>
  );
}
