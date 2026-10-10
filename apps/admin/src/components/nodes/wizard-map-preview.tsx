import {useEffect, useRef} from "react";
import type {Marker} from "maplibre-gl";
import {MapPin} from "lucide-react";
import {useMapInstance} from "@/components/overview/use-map-instance";
import {m} from "@/paraglide/messages";
import "maplibre-gl/dist/maplibre-gl.css";

function buildPinElement(): HTMLDivElement {
  const el = document.createElement("div");
  el.className =
    "flex size-8 items-center justify-center rounded-full border-2 border-white bg-primary-500 text-white shadow-[0_0_7px_1px_rgba(0,0,0,0.2)]";
  const pin = document.createElement("div");
  pin.className = "size-3 rounded-full bg-white";
  el.appendChild(pin);
  return el;
}

/** Live map preview for the Location step — drops a pin once both coordinates parse. */
export function WizardMapPreview({latitude, longitude}: {latitude: number | null; longitude: number | null}) {
  const hasPoint = latitude !== null && longitude !== null;
  const {containerRef, mapState} = useMapInstance(hasPoint ? [[longitude, latitude]] : []);
  const markerRef = useRef<Marker | null>(null);
  const centeredFor = useRef<string | null>(null);

  // The marker lives only while the coordinates are valid.
  useEffect(() => {
    if (!mapState || !hasPoint || latitude === null || longitude === null) return;
    const marker = new mapState.lib.Marker({element: buildPinElement()}).setLngLat([longitude, latitude]).addTo(mapState.map);
    markerRef.current = marker;
    return () => {
      marker.remove();
      markerRef.current = null;
    };
    // Marker identity is stable while the point stays valid — the position effect moves it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapState, hasPoint]);

  // Position and camera follow the latest valid coordinate pair.
  useEffect(() => {
    if (!mapState || latitude === null || longitude === null) return;
    markerRef.current?.setLngLat([longitude, latitude]);
    const key = `${latitude},${longitude}`;
    if (centeredFor.current !== key) {
      mapState.map.easeTo({center: [longitude, latitude], zoom: Math.max(mapState.map.getZoom(), 14)});
      centeredFor.current = key;
    }
  }, [mapState, latitude, longitude]);

  return (
    <div className="relative h-[180px] overflow-clip rounded-lg border border-grey-200" aria-label={m["nodes.location_preview_title"]()}>
      <div ref={containerRef} className="absolute inset-0 bg-grey-100" data-testid="wizard-map" />
      {!hasPoint && (
        <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-white/70">
          <MapPin className="size-4 text-grey-500" aria-hidden="true" />
          <p className="text-xs leading-[1.4] tracking-[0.12px] text-grey-600">{m["nodes.map_pin_hint"]()}</p>
        </div>
      )}
    </div>
  );
}
