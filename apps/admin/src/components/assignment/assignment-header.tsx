import {Button} from "@alvo/ui";
import {UserPlus} from "lucide-react";
import {m} from "@/paraglide/messages";
import wlRefresh from "@/assets/wl-refresh.svg";
import {ViewTabs, type ListMapView} from "@/components/view-tabs";

interface AssignmentHeaderProps {
  view: ListMapView;
  refreshing: boolean;
  onView: (view: ListMapView) => void;
  onRefresh: () => void;
  onManualAssign: () => void;
}

/** Top row: the List/Map toggle plus the Refresh and Manual Assign actions. */
export function AssignmentHeader({view, refreshing, onView, onRefresh, onManualAssign}: AssignmentHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <ViewTabs value={view} onChange={onView} ariaLabel={m["nav.assignment"]()} />
      <div className="flex items-center gap-2">
        <Button variant="outline" isLoading={refreshing} onClick={onRefresh}>
          <img src={wlRefresh} alt="" className="size-4" aria-hidden="true" />
          {m["assignment.refresh"]()}
        </Button>
        <Button onClick={onManualAssign}>
          <UserPlus className="size-4" aria-hidden="true" />
          {m["assignment.manual_assign"]()}
        </Button>
      </div>
    </div>
  );
}
