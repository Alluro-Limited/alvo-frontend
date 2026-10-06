import {Button} from "@alvo/ui";
import {Plus} from "lucide-react";
import {m} from "@/paraglide/messages";
import wlRefresh from "@/assets/wl-refresh.svg";
import {NodesViewTabs, type NodesView} from "./nodes-view-tabs";

interface NodesHeaderProps {
  view: NodesView;
  refreshing: boolean;
  onView: (view: NodesView) => void;
  onRefresh: () => void;
  onRegister: () => void;
}

/** Top row: the List/Map toggle plus the Refresh and Register Node actions. */
export function NodesHeader({view, refreshing, onView, onRefresh, onRegister}: NodesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <NodesViewTabs value={view} onChange={onView} />
      <div className="flex items-center gap-2">
        <Button variant="outline" isLoading={refreshing} onClick={onRefresh}>
          <img src={wlRefresh} alt="" className="size-4" aria-hidden="true" />
          {m["nodes.refresh"]()}
        </Button>
        <Button onClick={onRegister}>
          <Plus className="size-4" aria-hidden="true" />
          {m["nodes.register_node"]()}
        </Button>
      </div>
    </div>
  );
}
