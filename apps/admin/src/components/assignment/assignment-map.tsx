import {useEffect} from "react";
import {cn} from "cnfast";
import {useMapInstance} from "@/components/overview/use-map-instance";
import {m} from "@/paraglide/messages";
import type {AssignmentRow, AssignmentStatus} from "@/types/assignment-types";
import "maplibre-gl/dist/maplibre-gl.css";

const DOT: Record<AssignmentStatus, string> = {
  created: "#6a6e74",
  pending_pickup: "#8b5cf6",
  active: "#009688",
  public_pool: "#f97316",
  failed: "#dd524d",
  flagged: "#f5b546",
  completed: "#40b869",
};

/** 48px white marker with a status-colored core — same family as the node pins. */
function buildMarkerElement(row: AssignmentRow): HTMLDivElement {
  const el = document.createElement("div");
  el.className =
    "flex size-12 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-white shadow-[0_0_7px_1px_rgba(0,0,0,0.1)]";
  el.setAttribute("role", "button");
  el.setAttribute("aria-label", row.id);
  el.tabIndex = 0;
  const dot = document.createElement("div");
  dot.className = "size-5 rounded-full";
  dot.style.backgroundColor = DOT[row.status];
  el.appendChild(dot);
  return el;
}

/** The Map tab: every assignment pinned on the basemap, colored by status; click or Enter opens its drawer. */
export function AssignmentMap({rows, onOpen, className}: {rows: AssignmentRow[]; onOpen: (id: string) => void; className?: string}) {
  const {containerRef, mapState, failed} = useMapInstance(rows.map((row) => row.position));

  useEffect(() => {
    if (!mapState) return;
    const markers = rows.map((row) => {
      const element = buildMarkerElement(row);
      element.onclick = () => onOpen(row.id);
      element.onkeydown = (event) => {
        if (event.key === "Enter") onOpen(row.id);
      };
      return new mapState.lib.Marker({element}).setLngLat(row.position).addTo(mapState.map);
    });
    return () => markers.forEach((marker) => marker.remove());
  }, [mapState, rows, onOpen]);

  return (
    <div
      className={cn("relative min-h-[560px] overflow-clip rounded-lg border border-grey-200 bg-white", className)}
      aria-label={m["assignment.view_map"]()}
    >
      <div ref={containerRef} className={cn("absolute inset-0", failed && "bg-grey-100")} data-testid="assignment-map" />
    </div>
  );
}
