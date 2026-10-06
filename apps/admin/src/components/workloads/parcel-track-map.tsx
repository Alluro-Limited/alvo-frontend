import {useEffect} from "react";
import {cn} from "cnfast";
import type {ParcelTracking} from "@/types/workloads-types";
import {useMapInstance} from "@/components/overview/use-map-instance";
import {syncTrackMap} from "./sync-track-map";
import "maplibre-gl/dist/maplibre-gl.css";

/** The live tracking map inside the expanded drawer: route line, locker pins, courier ETA bubble. */
export function ParcelTrackMap({tracking, className}: {tracking: ParcelTracking; className?: string}) {
  const fitPoints = [...tracking.route, ...tracking.stops.map((s) => s.position), tracking.courierPosition, tracking.destinationPosition];
  const {containerRef, mapState, failed} = useMapInstance(fitPoints);

  useEffect(() => {
    if (!mapState) return;
    return syncTrackMap(mapState.map, mapState.lib, tracking);
  }, [mapState, tracking]);

  return (
    <div
      ref={containerRef}
      data-testid="parcel-track-map"
      aria-hidden="true"
      className={cn("min-h-0 overflow-clip rounded-lg", failed && "bg-grey-100", className)}
    />
  );
}
