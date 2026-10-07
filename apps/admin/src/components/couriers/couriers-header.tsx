import {Button} from "@alvo/ui";
import {m} from "@/paraglide/messages";
import type {ListMapView} from "@/components/view-tabs";
import {ViewTabs} from "@/components/view-tabs";
import wlExport from "@/assets/wl-export.svg";
import wlRefresh from "@/assets/wl-refresh.svg";

interface CouriersHeaderProps {
  view: ListMapView;
  refreshing: boolean;
  exporting: boolean;
  onView: (view: ListMapView) => void;
  onRefresh: () => void;
  onExport: () => void;
}

/** Top row: the List/Map toggle on the left, Refresh and Export on the right. */
export function CouriersHeader({view, refreshing, exporting, onView, onRefresh, onExport}: CouriersHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="sr-only">{m["couriers.title"]()}</h1>
      <ViewTabs value={view} onChange={onView} ariaLabel={m["nav.courier"]()} />
      <div className="flex items-center gap-2">
        <Button variant="outline" isLoading={refreshing} onClick={onRefresh}>
          <img src={wlRefresh} alt="" className="size-4" aria-hidden="true" />
          {m["couriers.refresh"]()}
        </Button>
        <Button isLoading={exporting} onClick={onExport}>
          <img src={wlExport} alt="" className="size-4 brightness-0 invert" aria-hidden="true" />
          {m["couriers.export"]()}
        </Button>
      </div>
    </div>
  );
}
