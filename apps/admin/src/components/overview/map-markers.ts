import {cn} from "cnfast";
import mapCourierIcon from "@/assets/map-courier.svg";
import mapNodeOfflineIcon from "@/assets/map-node-offline.svg";
import mapNodeOnlineIcon from "@/assets/map-node-online.svg";
import type {OverviewMapNode} from "@/types/dashboard-types";

const NODE_RING: Record<OverviewMapNode["status"], string> = {
  online: "border-solid border-primary-500",
  warning: "border-dashed border-status-fail",
  offline: "border-solid border-grey-500",
};

interface MarkerSpec {
  ring: string;
  innerShadow: string;
  icon: string;
  id: string;
}

function buildMarkerElement(spec: MarkerSpec): HTMLDivElement {
  const el = document.createElement("div");
  el.className = cn("absolute size-12 cursor-pointer rounded-full border-2 bg-white", spec.ring);
  el.dataset.markerId = spec.id;
  el.setAttribute("role", "button");
  el.setAttribute("aria-label", spec.id);
  el.tabIndex = 0;

  const inner = document.createElement("div");
  inner.className = cn("absolute inset-1 flex items-center justify-center overflow-clip rounded-full bg-white", spec.innerShadow);
  const img = document.createElement("img");
  img.src = spec.icon;
  img.alt = "";
  img.className = "size-6";
  inner.appendChild(img);
  el.appendChild(inner);
  return el;
}

/** 48px white node marker ringed by its status color; warning gets the dashed red ring. */
export function createNodeMarkerElement(node: OverviewMapNode): HTMLDivElement {
  return buildMarkerElement({
    ring: NODE_RING[node.status],
    innerShadow: "shadow-[0_0_7px_1px_rgba(0,0,0,0.1)]",
    icon: node.status === "offline" ? mapNodeOfflineIcon : mapNodeOnlineIcon,
    id: node.id,
  });
}

/** 48px white courier marker ringed in purple with the darker outer glow. */
export function createCourierMarkerElement(id: string): HTMLDivElement {
  return buildMarkerElement({
    ring: "border-solid border-accent",
    innerShadow: "shadow-[0_0_0_4px_rgba(0,0,0,0.09)]",
    icon: mapCourierIcon,
    id,
  });
}
