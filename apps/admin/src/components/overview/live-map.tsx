import {useEffect, useState} from "react";
import {cn} from "cnfast";
import {m} from "@/paraglide/messages";
import type {OverviewMap} from "@/types/dashboard-types";
import {CourierPopover} from "./courier-popover";
import {MapFilterTabs} from "./map-filter";
import {MapLegend, MapStatusChips} from "./map-overlays";
import {syncLiveMap, type MapFilter} from "./map-sync";
import {MarkerPopover} from "./marker-popover";
import {NodePopover} from "./node-popover";
import {PanelHeader} from "./panel-header";
import {useMapInstance} from "./use-map-instance";
import {useMarkerSelection} from "./use-marker-selection";
import "maplibre-gl/dist/maplibre-gl.css";

/** The Live Operation panel: basemap, route, markers, filter tabs, chips, the legend, and marker popovers. */
export function LiveMap({data, className}: {data: OverviewMap; className?: string}) {
  const fitPoints = [...data.nodes.map((n) => n.position), ...data.couriers.map((c) => c.position), ...data.route];
  const {containerRef, mapState, failed} = useMapInstance(fitPoints);
  const [filter, setFilter] = useState<MapFilter>("all");
  const {selection, anchor, open, leave, enterCard, leaveCard, clear} = useMarkerSelection(data, filter);

  useEffect(() => {
    if (!mapState) return;
    return syncLiveMap({map: mapState.map, lib: mapState.lib, data, filter, onMarkerEnter: open, onMarkerLeave: leave});
  }, [mapState, data, filter, open, leave]);

  return (
    <section className={cn("flex flex-col overflow-clip rounded-xl bg-white", className)} aria-label={m["overview.map_title"]()}>
      <PanelHeader title={m["overview.map_title"]()} className="px-4">
        <MapFilterTabs value={filter} onChange={setFilter} />
      </PanelHeader>
      <div className="relative min-h-[717px] flex-1">
        <div ref={containerRef} className={cn("absolute inset-0", failed && "bg-grey-100")} data-testid="live-map" aria-hidden="true" />
        <MapStatusChips nodes={data.nodes} />
        <MapLegend />
        {selection && anchor && mapState && (
          <MarkerPopover map={mapState.map} anchor={anchor} onClose={clear} onEnter={enterCard} onLeave={leaveCard}>
            {selection.kind === "node" ? (
              <NodePopover id={selection.id} onClose={clear} />
            ) : (
              <CourierPopover id={selection.id} onClose={clear} />
            )}
          </MarkerPopover>
        )}
      </div>
    </section>
  );
}
