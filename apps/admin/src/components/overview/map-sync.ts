import type {GeoJSONSourceSpecification, LayerSpecification, Map as MaplibreMap} from "maplibre-gl";
import type {OverviewMap} from "@/types/dashboard-types";
import {createCourierMarkerElement, createNodeMarkerElement} from "./map-markers";

export type MapFilter = "all" | "nodes" | "couriers";

/** The marker the operator hovered — drives which popover opens and where it anchors. */
export interface MarkerSelection {
  kind: "node" | "courier";
  id: string;
  position: [number, number];
}

type MaplibreModule = typeof import("maplibre-gl");

const SOURCES = ["overview-route", "overview-route-done"];
const LAYERS = ["overview-route-done", "overview-route"];

function lineFeature(coordinates: [number, number][]): GeoJSONSourceSpecification["data"] {
  return {type: "Feature", properties: {}, geometry: {type: "LineString", coordinates}};
}

function lineLayer(id: string, color: string): LayerSpecification {
  return {
    id,
    type: "line",
    source: id,
    paint: {"line-color": color, "line-width": 4},
    layout: {"line-cap": "round", "line-join": "round"},
  };
}

/**
 * Rebuilds the route layers and markers for the current filter.
 * Returns a cleanup that removes everything it added.
 */
interface SyncLiveMapOptions {
  map: MaplibreMap;
  lib: MaplibreModule;
  data: OverviewMap;
  filter: MapFilter;
  onMarkerEnter?: (selection: MarkerSelection) => void;
  onMarkerLeave?: (selection: MarkerSelection) => void;
}

/** Hover previews the marker (pointer + keyboard focus); leaving a marker starts the close countdown. */
function attachHover(el: HTMLElement, selection: MarkerSelection, options: SyncLiveMapOptions) {
  const enter = () => options.onMarkerEnter?.(selection);
  const leave = () => options.onMarkerLeave?.(selection);
  el.addEventListener("pointerenter", enter);
  el.addEventListener("pointerleave", leave);
  el.addEventListener("focus", enter);
  el.addEventListener("blur", leave);
}

function addMarkers(options: SyncLiveMapOptions, markers: InstanceType<MaplibreModule["Marker"]>[]): void {
  const {map, lib, data, filter} = options;
  if (filter !== "couriers") {
    for (const node of data.nodes) {
      const el = createNodeMarkerElement(node);
      attachHover(el, {kind: "node", id: node.id, position: node.position}, options);
      markers.push(new lib.Marker({element: el, anchor: "center"}).setLngLat(node.position).addTo(map));
    }
  }
  if (filter !== "nodes") {
    for (const courier of data.couriers) {
      const el = createCourierMarkerElement(courier.id);
      attachHover(el, {kind: "courier", id: courier.id, position: courier.position}, options);
      markers.push(new lib.Marker({element: el, anchor: "center"}).setLngLat(courier.position).addTo(map));
    }
  }
}

export function syncLiveMap(options: SyncLiveMapOptions): () => void {
  const {map, data, filter} = options;
  const markers: InstanceType<MaplibreModule["Marker"]>[] = [];
  let cancelled = false;

  const addRoute = () => {
    if (filter === "nodes" || data.route.length < 2) return;
    map.addSource("overview-route", {type: "geojson", data: lineFeature(data.route)});
    map.addLayer(lineLayer("overview-route", "#DCCEFC"));
    if (data.routeCompleted && data.routeCompleted.length >= 2) {
      map.addSource("overview-route-done", {type: "geojson", data: lineFeature(data.routeCompleted)});
      map.addLayer(lineLayer("overview-route-done", "#8B5CF6"));
    }
  };

  const deferredRoute = () => {
    if (!cancelled) addRoute();
  };

  // Route sources need the loaded style; markers are DOM and can attach immediately.
  addMarkers(options, markers);
  if (map.isStyleLoaded()) {
    addRoute();
  } else {
    map.once("load", deferredRoute);
  }

  return () => {
    cancelled = true;
    map.off("load", deferredRoute);
    for (const marker of markers) marker.remove();
    if (!map.isStyleLoaded()) return;
    for (const layer of LAYERS) if (map.getLayer(layer)) map.removeLayer(layer);
    for (const source of SOURCES) if (map.getSource(source)) map.removeSource(source);
  };
}
