import {useEffect, useReducer} from "react";
import {cn} from "cnfast";
import type {GeoJSONSourceSpecification} from "maplibre-gl";
import {useMapInstance, type LiveMapState} from "@/components/overview/use-map-instance";
import {m} from "@/paraglide/messages";
import type {CourierTrack} from "@/types/couriers-types";
import {createCourierPinElement, createNodePinElement} from "./couriers-map-markers";
import {CouriersTrackPopup} from "./couriers-track-popup";
import "maplibre-gl/dist/maplibre-gl.css";

const ROUTE_ID = "courier-track-route";
const ROUTE_COLOR = "#8B5CF6";

function routeData(path: [number, number][]): GeoJSONSourceSpecification["data"] {
  return {type: "Feature", properties: {}, geometry: {type: "LineString", coordinates: path}};
}

/** Avatar pins + node cubes for every track — rebuilt when the feed changes, removed on cleanup. */
function useTrackMarkers(mapState: LiveMapState | null, tracks: CourierTrack[], onSelect: (courierId: string) => void) {
  useEffect(() => {
    if (!mapState) return;
    const markers = tracks.flatMap((track) => {
      const element = createCourierPinElement(track);
      element.onclick = () => onSelect(track.courierId);
      element.onkeydown = (event) => {
        if (event.key === "Enter") onSelect(track.courierId);
      };
      return [
        new mapState.lib.Marker({element, anchor: "bottom"}).setLngLat(track.position).addTo(mapState.map),
        new mapState.lib.Marker({element: createNodePinElement()}).setLngLat(track.pickup.position).addTo(mapState.map),
      ];
    });
    return () => markers.forEach((marker) => marker.remove());
  }, [mapState, tracks, onSelect]);
}

/** The purple polyline for the selected track — added once the style loads, removed on cleanup. */
function useTrackRoute(mapState: LiveMapState | null, selected: CourierTrack | null) {
  useEffect(() => {
    if (!mapState || !selected || selected.routePath.length < 2) return;
    const map = mapState.map;
    let cancelled = false;
    const addRoute = () => {
      if (cancelled) return;
      map.addSource(ROUTE_ID, {type: "geojson", data: routeData(selected.routePath)});
      map.addLayer({
        id: ROUTE_ID,
        type: "line",
        source: ROUTE_ID,
        paint: {"line-color": ROUTE_COLOR, "line-width": 3},
        layout: {"line-cap": "round", "line-join": "round"},
      });
    };
    const deferred = () => {
      if (!cancelled) addRoute();
    };
    if (map.isStyleLoaded()) {
      addRoute();
    } else {
      map.once("load", deferred);
    }
    // Offset left so the pin lands clear of the floating panel.
    map.easeTo({center: selected.position, offset: [-190, 0], duration: 400});
    return () => {
      cancelled = true;
      map.off("load", deferred);
      if (!map.isStyleLoaded()) return;
      if (map.getLayer(ROUTE_ID)) map.removeLayer(ROUTE_ID);
      if (map.getSource(ROUTE_ID)) map.removeSource(ROUTE_ID);
    };
  }, [mapState, selected]);
}

/**
 * The selected courier's screen position — re-projected during render and kept
 * live by re-rendering on every map `move` event.
 */
function usePopupPoint(mapState: LiveMapState | null, selected: CourierTrack | null) {
  const [, bump] = useReducer((tick: number) => tick + 1, 0);
  useEffect(() => {
    if (!mapState) return;
    mapState.map.on("move", bump);
    return () => {
      mapState.map.off("move", bump);
    };
  }, [mapState]);
  if (!mapState || !selected) return null;
  return mapState.map.project(selected.position);
}

interface CouriersMapProps {
  tracks: CourierTrack[];
  selectedId: string | null;
  onSelect: (courierId: string) => void;
  onClearSelection: () => void;
  className?: string;
}

/** The tracking map: avatar pins + node cubes, a purple route line and popup for the selected track. */
export function CouriersMap({tracks, selectedId, onSelect, onClearSelection, className}: CouriersMapProps) {
  const fitPoints = tracks.flatMap((track) => [track.position, track.pickup.position]);
  const {containerRef, mapState, failed} = useMapInstance(fitPoints);
  const selected = tracks.find((track) => track.courierId === selectedId) ?? null;
  useTrackMarkers(mapState, tracks, onSelect);
  useTrackRoute(mapState, selected);
  const popupPoint = usePopupPoint(mapState, selected);

  return (
    <div
      className={cn("relative min-h-[560px] overflow-clip rounded-lg border border-grey-200 bg-white", className)}
      aria-label={m["couriers.map_aria"]()}
    >
      <div ref={containerRef} className={cn("absolute inset-0", failed && "bg-grey-100")} data-testid="couriers-map" />
      {selected && popupPoint && <CouriersTrackPopup track={selected} x={popupPoint.x} y={popupPoint.y} onClose={onClearSelection} />}
    </div>
  );
}
