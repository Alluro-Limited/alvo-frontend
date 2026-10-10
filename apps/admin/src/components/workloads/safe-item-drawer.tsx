import {m} from "@/paraglide/messages";
import {useSafeItemDetailQuery} from "@/queries/use-safe-item-detail-query";
import type {SafeItemDetail} from "@/types/workloads-types";
import {DrawerError} from "./drawer-error";
import {DrawerShell} from "./drawer-shell";
import {DrawerSkeleton} from "./drawer-skeleton";
import {FlaggedBanner} from "./parcel-banners";
import {SafeDrawerHeader} from "./safe-drawer-header";
import {SafeInfoCard} from "./safe-info-card";
import {SafeStatusBanner} from "./safe-status-banner";
import {SafeTimeline} from "./safe-timeline";

function SafeDrawerBody({item}: {item: SafeItemDetail}) {
  return (
    <div className="flex-1 space-y-3 overflow-y-auto p-4">
      <SafeStatusBanner status={item.status} note={item.statusNote} />
      {item.flag && <FlaggedBanner flag={item.flag} />}
      <SafeInfoCard item={item} />
      <SafeTimeline steps={item.timeline} />
    </div>
  );
}

interface SafeDrawerContentProps {
  item: SafeItemDetail | undefined;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
}

function SafeDrawerContent({item, isPending, isError, onRetry}: SafeDrawerContentProps) {
  if (isPending) return <DrawerSkeleton />;
  if (isError) return <DrawerError message={m["workloads.drawer_error_safe"]()} onRetry={onRetry} />;
  return item ? <SafeDrawerBody item={item} /> : null;
}

/** Right slide-over for a Safe storage item — status banner, info card, storage timeline, flag action. */
export function SafeItemDrawer({itemId, onClose, onFlag}: {itemId: string | null; onClose: () => void; onFlag: (id: string) => void}) {
  const {data: item, isPending, isError, refetch} = useSafeItemDetailQuery(itemId);

  return (
    <DrawerShell open={itemId !== null} onClose={onClose}>
      <SafeDrawerHeader item={item} onFlag={() => item && onFlag(item.id)} />
      {itemId && <SafeDrawerContent item={item} isPending={isPending} isError={isError} onRetry={() => void refetch()} />}
    </DrawerShell>
  );
}
