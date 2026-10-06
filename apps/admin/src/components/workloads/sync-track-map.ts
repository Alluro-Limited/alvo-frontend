import type {GeoJSONSourceSpecification, Map as MaplibreMap} from "maplibre-gl";
import type {ParcelTracking} from "@/types/workloads-types";
import {createEndpointMarkerElement, createEtaMarkerElement, createStopPinElement} from "./track-map-markers";

type MaplibreModule = typeof import("maplibre-gl");
type MarkerInstance = InstanceType<MaplibreModule["Marker"]>;

const SOURCE_ID = "parcel-track-route";
const LAYER_ID = "parcel-track-route";

function routeData(route: [number, number][]): GeoJSONSourceSpecification["data"] {
  return {type: "Feature", properties: {}, geometry: {type: "LineString", coordinates: route}};
}

/** Draws the parcel's route line plus its pins; returns a cleanup removing everything it added. */
export function syncTrackMap(map: MaplibreMap, lib: MaplibreModule, tracking: ParcelTracking): () => void {
  const markers: MarkerInstance[] = [];
  let cancelled = false;

  const addRoute = () => {
    if (tracking.route.length < 2) return;
    map.addSource(SOURCE_ID, {type: "geojson", data: routeData(tracking.route)});
    map.addLayer({
      id: LAYER_ID,
      type: "line",
      source: SOURCE_ID,
      paint: {"line-color": "#00A996", "line-width": 4},
      layout: {"line-cap": "round", "line-join": "round"},
    });
  };

  const deferred = () => {
    if (!cancelled) addRoute();
  };

  for (const stop of tracking.stops) {
    markers.push(new lib.Marker({element: createStopPinElement(stop), anchor: "center"}).setLngLat(stop.position).addTo(map));
  }
  markers.push(
    new lib.Marker({element: createEtaMarkerElement(tracking.etaMinutes), anchor: "center"}).setLngLat(tracking.courierPosition).addTo(map)
  );
  markers.push(
    new lib.Marker({element: createEndpointMarkerElement(), anchor: "center"}).setLngLat(tracking.destinationPosition).addTo(map)
  );

  if (map.isStyleLoaded()) {
    addRoute();
  } else {
    map.once("load", deferred);
  }

  return () => {
    cancelled = true;
    map.off("load", deferred);
    for (const marker of markers) marker.remove();
    if (!map.isStyleLoaded()) return;
    if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID);
    if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
  };
}
