import type {ParcelTrackingStop} from "@/types/workloads-types";
import {m} from "@/paraglide/messages";

/** Teardrop locker pin with the parcel label ("P01") — DOM marker like the overview's. */
export function createStopPinElement(stop: ParcelTrackingStop): HTMLElement {
  const el = document.createElement("div");
  el.className = "flex flex-col items-center";
  const pin = document.createElement("div");
  pin.className = `flex h-6 min-w-6 items-center justify-center rounded-t-full rounded-br-full border-2 border-white px-1 text-[10px] font-semibold text-white shadow-md ${
    stop.tone === "alert" ? "bg-status-fail" : "bg-primary-700"
  }`;
  pin.style.borderBottomLeftRadius = "0";
  pin.style.transform = "rotate(-45deg)";
  const text = document.createElement("span");
  text.style.transform = "rotate(45deg)";
  text.textContent = stop.label;
  pin.appendChild(text);
  el.appendChild(pin);
  return el;
}

/** The teal ETA bubble anchored on the courier's live position ("2 min"). */
export function createEtaMarkerElement(minutes: number): HTMLElement {
  const el = document.createElement("div");
  el.className = "flex flex-col items-center";
  const bubble = document.createElement("div");
  bubble.className =
    "flex size-[52px] items-center justify-center rounded-full border-4 border-white/70 bg-primary-500 text-[11px] font-bold text-white shadow-lg";
  bubble.textContent = m["workloads.eta_min"]({minutes});
  const stem = document.createElement("div");
  stem.className = "h-5 w-1 rounded-b bg-primary-500";
  el.appendChild(bubble);
  el.appendChild(stem);
  return el;
}

/** Small dark dot marking the destination locker. */
export function createEndpointMarkerElement(): HTMLElement {
  const el = document.createElement("div");
  el.className = "size-4 rounded-full border-2 border-white bg-primary-800 shadow-md";
  return el;
}
