import {useEffect, useRef, useState} from "react";
import type {Map as MaplibreMap} from "maplibre-gl";

/** Free OpenFreeMap basemap — no token, light style matching the design's pale map. */
const MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";
/** Lagos, where Alvo's network lives. */
const MAP_CENTER: [number, number] = [3.3792, 6.5244];
const MAP_ZOOM = 12.5;

export interface LiveMapState {
  map: MaplibreMap;
  lib: typeof import("maplibre-gl");
}

/**
 * Mounts the MapLibre instance once and reports it (or failure when WebGL is unavailable).
 * `fitPoints` frames the camera once — pass the points the map should open on.
 */
export function useMapInstance(fitPoints: [number, number][]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapState, setMapState] = useState<LiveMapState | null>(null);
  const [failed, setFailed] = useState(false);
  /** Camera fits once per map instance — later polls must not steal the user's pan/zoom. */
  const fittedFor = useRef<MaplibreMap | null>(null);

  useEffect(() => {
    let map: MaplibreMap | undefined;
    let cancelled = false;
    void import("maplibre-gl")
      .then((lib) => {
        if (cancelled || !containerRef.current) return;
        map = new lib.Map({
          container: containerRef.current,
          style: MAP_STYLE,
          center: MAP_CENTER,
          zoom: MAP_ZOOM,
          attributionControl: false,
        });
        // Top-right keeps the attribution clear of the bottom chips and legend.
        map.addControl(new lib.AttributionControl({compact: true}), "top-right");
        setMapState({map, lib});
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      map?.remove();
      setMapState(null);
    };
  }, []);

  // Frame the given points once; an empty set keeps the default Lagos view.
  useEffect(() => {
    if (!mapState || fittedFor.current === mapState.map || fitPoints.length === 0) return;
    const bounds = new mapState.lib.LngLatBounds(fitPoints[0], fitPoints[0]);
    for (const point of fitPoints) bounds.extend(point);
    mapState.map.fitBounds(bounds, {padding: {top: 64, right: 56, bottom: 128, left: 56}, animate: false});
    fittedFor.current = mapState.map;
  }, [mapState, fitPoints]);

  return {containerRef, mapState, failed};
}
