import {ViewTabs, type ListMapView} from "@/components/view-tabs";
import {m} from "@/paraglide/messages";

export type NodesView = ListMapView;

/** The List/Map pill toggle above the nodes list — shared `ViewTabs` with nodes aria-label. */
export function NodesViewTabs({value, onChange}: {value: NodesView; onChange: (view: NodesView) => void}) {
  return <ViewTabs value={value} onChange={onChange} ariaLabel={m["nav.nodes"]()} />;
}
